// Homepage "Find It Near You" teaser map — a small interactive Leaflet map
// embedded in the map-preview frame. Full filtering lives on /map (map.js).
(function () {
  var el = document.getElementById('home-map');
  if (!el || typeof L === 'undefined' || !window.HOLLYS) return; // graceful: leave the parchment frame
  var H = window.HOLLYS;

  var map = L.map(el, {
    scrollWheelZoom: false,   // don't trap the page scroll inside the teaser
    zoomControl: true
  }).setView(H.BIGFORK, 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  H.LOCATIONS.forEach(function (loc) {
    var m = L.marker([loc.lat, loc.lng], { icon: H.makeIcon(loc.home), alt: loc.name, title: loc.name }).addTo(map);
    m.bindPopup('<div class="lp-name">' + loc.name + '</div><div class="lp-products">' + H.productsLabel(loc) + '</div>');
    if (loc.home) {
      m.bindTooltip(loc.name, { permanent: true, direction: 'right', offset: [10, -12], className: 'home-tooltip' });
    }
  });

  // Recalculate once the framed container has its final size.
  setTimeout(function () { map.invalidateSize(); }, 250);
})();
