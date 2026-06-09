// Holly's Pantry — /map page: Leaflet map + product filter + stockist sidebar.
// Stockist data + pin helpers come from the shared locations.js (window.HOLLYS).
(function () {
  if (typeof L === 'undefined' || !window.HOLLYS) return; // Leaflet/data missing — leave a blank parchment panel
  var H = window.HOLLYS;
  var BIGFORK = H.BIGFORK;
  var LOCATIONS = H.LOCATIONS;
  var productsLabel = H.productsLabel;

  // --- Map ---
  var map = L.map('leaflet-map', { scrollWheelZoom: true }).setView(BIGFORK, 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // --- Build markers ---
  LOCATIONS.forEach(function (loc) {
    var m = L.marker([loc.lat, loc.lng], { icon: H.makeIcon(loc.home), alt: loc.name, title: loc.name });
    m.bindPopup(
      '<div class="lp-name">' + loc.name + '</div>' +
      '<div class="lp-products">' + productsLabel(loc) + '</div>' +
      '<div class="lp-meta">' + loc.address + '<br>' + loc.hours + '</div>'
    );
    if (loc.home) {
      m.bindTooltip(loc.name, { permanent: true, direction: 'right', offset: [10, -12], className: 'home-tooltip' });
    }
    loc._marker = m;
  });

  // --- Filter dropdown options (union of all products, sorted) ---
  var sel = document.getElementById('product-filter');
  var all = [];
  LOCATIONS.forEach(function (l) { l.products.forEach(function (p) { if (all.indexOf(p) === -1) all.push(p); }); });
  all.sort().forEach(function (p) {
    var o = document.createElement('option');
    o.value = p; o.textContent = p;
    sel.appendChild(o);
  });

  // --- Render sidebar + markers for a given filter ---
  var listEl = document.getElementById('loc-list');
  function render(filter) {
    listEl.innerHTML = '';
    var visible = [];
    LOCATIONS.forEach(function (loc) {
      var match = filter === 'all' || loc.products.indexOf(filter) !== -1;
      if (match) { loc._marker.addTo(map); visible.push(loc); }
      else { map.removeLayer(loc._marker); }
      if (!match) return;

      var li = document.createElement('li');
      li.className = 'loc';
      li.tabIndex = 0;
      li.setAttribute('role', 'button');
      li.setAttribute('aria-label', 'Show ' + loc.name + ' on the map');
      li.style.cursor = 'pointer';
      li.innerHTML =
        '<h3>' + loc.name + (loc.home ? ' <span class="loc-badge">home base</span>' : '') + '</h3>' +
        '<p class="loc-addr">' + loc.address + '</p>' +
        '<p class="loc-hours">' + loc.hours + '</p>' +
        '<p class="loc-products">' + productsLabel(loc) + '</p>';
      var focusLoc = function () {
        map.setView([loc.lat, loc.lng], 15, { animate: true });
        loc._marker.openPopup();
      };
      li.addEventListener('click', focusLoc);
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focusLoc(); }
      });
      listEl.appendChild(li);
    });

    if (!visible.length) {
      listEl.innerHTML = '<li class="loc-empty">No stockists carry that yet — check back soon.</li>';
    }

    // Frame the visible pins
    if (filter === 'all') {
      map.setView(BIGFORK, 13, { animate: true });
    } else if (visible.length) {
      var bounds = L.latLngBounds(visible.map(function (l) { return [l.lat, l.lng]; }));
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }

  sel.addEventListener('change', function () { render(sel.value); });
  render('all');

  // Leaflet needs a size recalc once layout settles
  setTimeout(function () { map.invalidateSize(); }, 200);
})();
