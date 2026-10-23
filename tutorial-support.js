// Shared dataset and setup for all three external-library examples.
export let restaurants = [];
export function setRestaurants(data) {
    if (!Array.isArray(data) || !data.length || !data.every(item =>
        item && typeof item.name === 'string' && typeof item.cuisine === 'string' &&
        typeof item.neighborhood === 'string' && Number.isFinite(item.rating))) {
        throw new Error('Restaurant data must be a nonempty array with names, cuisines, neighborhoods, and numeric ratings.');
    }
    restaurants = data;
}

export function checkAllLibraryStatus() {
    const libraries = [
        ['chart', typeof Chart !== 'undefined'],
        ['leaflet', typeof L !== 'undefined'],
        ['gsap', typeof gsap !== 'undefined']
    ];
    libraries.forEach(([name, loaded]) => {
        const element = document.querySelector(`#${name}-status`);
        element.textContent = loaded ? 'Loaded' : 'Unavailable — fallback enabled';
        element.className = loaded ? 'status-loaded' : 'status-failed';
    });
    return libraries.filter(([, loaded]) => loaded).length;
}

export function showTutorialInterface() {
    ['library-status-section', 'examples-section', 'pattern-summary', 'data-summary'].forEach(id => {
        document.getElementById(id).classList.remove('hidden');
    });
    document.querySelector('#record-count').textContent = restaurants.length;
}

export async function clickToLoad(button) {
    const status = document.querySelector('#loading-status');
    const text = status.querySelector('.status-message');
    button.disabled = true;
    status.className = 'status-display loading';
    text.textContent = 'Loading restaurant data...';
    try {
        const response = await fetch('./restaurants.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setRestaurants(await response.json());
        checkAllLibraryStatus();
        showTutorialInterface();
        status.className = 'status-display success';
        text.textContent = `Successfully loaded ${restaurants.length} restaurants!`;
        button.textContent = 'Reload Restaurant Data';
        return true;
    } catch (error) {
        status.className = 'status-display error';
        text.textContent = `Could not load restaurants.json (${error.message}). Run this page with a local web server and try again.`;
        button.textContent = 'Try Again';
        console.error('Data loading failed:', error);
        return false;
    } finally {
        button.disabled = false;
    }
}

export function clearExistingMap() {
    if (window.myMap) {
        window.myMap.remove();
        window.myMap = null;
    }
    document.querySelector('#restaurant-map').replaceChildren();
}

export function getRestaurantCoordinates(restaurant, index) {
    // The sample dataset has no coordinates. Use stable demonstration positions.
    const neighborhoods = {
        'College Park': [38.9897, -76.9378],
        'Downtown': [38.9067, -76.9078],
        'University District': [38.9800, -76.9400],
        'Historic District': [38.9850, -76.9350]
    };
    const base = neighborhoods[restaurant.neighborhood] || neighborhoods['College Park'];
    return [base[0] + (index + 1) * 0.0004, base[1] + (index + 1) * 0.0003];
}

export function createRestaurantCards() {
    const container = document.querySelector('#restaurant-cards');
    container.replaceChildren(...restaurants.map(restaurant => {
        const card = document.createElement('article');
        card.className = 'restaurant-card';
        const title = document.createElement('h4');
        title.textContent = restaurant.name;
        card.append(title);
        [
            ['restaurant-cuisine', `${restaurant.cuisine} cuisine`],
            ['restaurant-rating', `Rating: ${restaurant.rating}/5`],
            ['restaurant-location', restaurant.neighborhood]
        ].forEach(([className, text]) => {
            const paragraph = document.createElement('p');
            paragraph.className = className;
            paragraph.textContent = text;
            card.append(paragraph);
        });
        return card;
    }));
}

window.checkStudentProgress = () => console.table({
    restaurants: restaurants.length,
    librariesLoaded: checkAllLibraryStatus(),
    chartCreated: Boolean(window.myChart),
    mapCreated: Boolean(window.myMap),
    cards: document.querySelectorAll('.restaurant-card').length
});
window.resetTutorial = () => {
    if (window.myChart) window.myChart.destroy();
    window.myChart = null;
    clearExistingMap();
    if (typeof gsap !== 'undefined') gsap.killTweensOf('.restaurant-card');
    document.querySelector('#restaurant-cards').replaceChildren();
};
