# Tutorial 7: External libraries

The page loads the same eight restaurants into a Chart.js cuisine bar chart, a Leaflet map with restaurant popups, and GSAP restaurant-card animations. Click **Load Restaurant Data** to run all three. Each demo button can be clicked again, and **Reload Restaurant Data** refreshes the dataset and demos.

## Run locally

Open this folder in VS Code and use the Live Server extension on `index.html`. Use an HTTP server rather than double-clicking the HTML file: JavaScript modules and `fetch` require it. Internet access is needed for the CDN libraries and map tiles.

## Submit a working link

Publish the contents of this folder to your course web host or GitHub Pages, keeping `index.html`, `script.js`, `tutorial-support.js`, `style.css`, and `restaurants.json` together. Submit the published page URL, not a local file path. The page has not been deployed by this edit.

## Integration pattern and trade-offs

Each example includes a pinned CDN library, checks its global object, processes the shared data, initializes the library, and catches failures. Chart failures leave text cuisine counts, map failures leave neighborhood details, and animation failures leave visible cards. Reduced-motion preferences show static cards.

- Chart.js: count restaurants by cuisine to compare categories. All eight sample cuisines have one restaurant, so the bars have equal heights. Best for numerical comparisons in Project 2.
- Leaflet: turn neighborhoods into sample markers with popups. Coordinates are deterministic demonstration positions, not verified addresses. Real location data would be needed for a real restaurant finder.
- GSAP: stagger card entrance animations with opacity, scale, and movement. Best for coordinated transitions; respect reduced-motion preferences.

CDNs simplify setup but create network dependencies. Pinned versions make changes predictable, and fallbacks keep the dataset useful if a dependency is unavailable.

Reference documentation: [Chart.js](https://www.chartjs.org/docs/latest/getting-started/), [Leaflet](https://leafletjs.com/examples/quick-start/), [GSAP](https://gsap.com/docs/v3/GSAP/gsap.fromTo/).
