import { restaurants, clickToLoad, createRestaurantCards, getRestaurantCoordinates, clearExistingMap } from './tutorial-support.js';

// Each demo follows Check → Process → Initialize → Error Handling.
function message(id, text) {
    document.querySelector(`#${id}-message`).textContent = text;
}

function createMyChart() {
    if (!restaurants.length) return;
    const cuisineCounts = {};
    restaurants.forEach(({ cuisine }) => {
        cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
    });
    // Text summary remains available to screen readers and if the CDN fails.
    message('chart', Object.entries(cuisineCounts).map(([cuisine, count]) => `${cuisine}: ${count}`).join(' · '));
    try {
        if (typeof Chart === 'undefined') throw new Error('Chart.js is unavailable. Showing cuisine counts instead.');
        if (window.myChart) window.myChart.destroy();
        window.myChart = new Chart(document.querySelector('#restaurant-chart'), {
            type: 'bar',
            data: {
                labels: Object.keys(cuisineCounts),
                datasets: [{
                    label: 'Number of restaurants',
                    data: Object.values(cuisineCounts),
                    backgroundColor: ['#007cba', '#28a745', '#9467bd', '#d97706', '#17a2b8', '#d45087', '#5969b3', '#8b6b45'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: true, text: 'Restaurant Cuisine Distribution' },
                    legend: { display: false }
                },
                scales: {
                    x: { title: { display: true, text: 'Cuisine' } },
                    y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: 'Number of restaurants' } }
                }
            }
        });
    } catch (error) {
        message('chart', `${error.message} ${document.querySelector('#chart-message').textContent}`);
        console.error(error);
    }
}

function createMyMap() {
    if (!restaurants.length) return;
    message('map', 'Sample locations based on neighborhoods; these are not real restaurant addresses. Click a marker for details.');
    try {
        clearExistingMap();
        if (typeof L === 'undefined') throw new Error('Leaflet is unavailable. Restaurant neighborhoods are listed below.');
        window.myMap = L.map('restaurant-map').setView([38.9897, -76.9378], 12);
        const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(window.myMap);
        tiles.on('tileerror', () => message('map', 'Some map tiles could not load. Markers still show sample neighborhood locations; restaurant details are listed below.'));
        const markers = restaurants.map((restaurant, index) => {
            // Use DOM text rather than inserting dataset values as HTML.
            const popup = document.createElement('div');
            const title = document.createElement('strong');
            title.textContent = restaurant.name;
            const details = document.createElement('p');
            details.textContent = `${restaurant.cuisine} · Rating: ${restaurant.rating}/5 · ${restaurant.priceRange} · ${restaurant.neighborhood}`;
            popup.append(title, details);
            return L.marker(getRestaurantCoordinates(restaurant, index), { title: restaurant.name })
                .bindPopup(popup).addTo(window.myMap);
        });
        window.myMap.fitBounds(L.featureGroup(markers).getBounds().pad(0.15));
        window.myMap.invalidateSize();
    } catch (error) {
        clearExistingMap();
        message('map', error.message);
        document.querySelector('#restaurant-map').textContent = 'Interactive map unavailable. See restaurant locations below.';
        console.error(error);
    }
    const list = document.querySelector('#map-locations');
    list.replaceChildren(...restaurants.map(restaurant => {
        const item = document.createElement('li');
        item.textContent = `${restaurant.name} — ${restaurant.neighborhood}`;
        return item;
    }));
}

function animateMyCards() {
    if (!restaurants.length) return;
    if (typeof gsap !== 'undefined') gsap.killTweensOf('.restaurant-card');
    createRestaurantCards();
    const cards = document.querySelectorAll('.restaurant-card');
    try {
        if (typeof gsap === 'undefined') throw new Error('GSAP is unavailable. Showing static restaurant cards.');
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            message('animation', 'Restaurant cards displayed with reduced motion.');
            return;
        }
        gsap.fromTo(cards,
            { opacity: 0, scale: 0.85, y: 35 },
            { opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(1.4)', clearProps: 'all' }
        );
        message('animation', 'All restaurant cards animate in sequence. Click again to replay.');
    } catch (error) {
        cards.forEach(card => { card.style.opacity = '1'; card.style.transform = 'none'; });
        message('animation', error.message);
        console.error(error);
    }
}

document.querySelector('#load-data-button').addEventListener('click', async event => {
    const loaded = await clickToLoad(event.currentTarget);
    if (loaded) {
        createMyChart();
        createMyMap();
        animateMyCards();
    }
});
document.querySelector('#chart-button').addEventListener('click', createMyChart);
document.querySelector('#map-button').addEventListener('click', createMyMap);
document.querySelector('#animation-button').addEventListener('click', animateMyCards);
Object.assign(window, { createMyChart, createMyMap, animateMyCards });
