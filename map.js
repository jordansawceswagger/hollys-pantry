// Holly's Pantry — /map page: Leaflet map + filter + stockist sidebar.
// Externalized from map.html so the page can run under a strict script-src CSP
// (no inline scripts). Data is hard-coded placeholder stockists around Bigfork, MT.
(function () {
  if (typeof L === 'undefined') return; // Leaflet failed to load — leave a blank parchment panel

  var BIGFORK = [48.0633, -114.0667];

  // Placeholder stocking locations. Coordinates are around Bigfork, MT.
  var LOCATIONS = [
    {
      name: "Holly's Pantry", home: true,
      address: 'Bigfork, Montana', hours: 'By appointment',
      lat: 48.0633, lng: -114.0667,
      products: ['Honey Granola','Herbal Tea Blend','Sourdough Crackers','Apple Butter','Spice Rub','Pancake Mix','Cookie Mix','Wildflower Honey']
    },
    {
      name: 'Bigfork General Store',
      address: '123 Electric Ave, Bigfork, MT', hours: 'Mon–Sat 8am–6pm',
      lat: 48.0641, lng: -114.0710,
      products: ['Honey Granola','Spice Rub','Herbal Tea Blend']
    },
    {
      name: 'Flathead Valley Farmstand',
      address: '8800 MT Highway 35, Bigfork, MT', hours: 'Daily 9am–5pm',
      lat: 48.0712, lng: -114.0588,
      products: ['Apple Butter','Wildflower Honey','Pancake Mix']
    },
    {
      name: 'Swan River Mercantile',
      address: '450 Grand Ave, Bigfork, MT', hours: 'Tue–Sun 10am–5pm',
      lat: 48.0567, lng: -114.0729,
      products: ['Sourdough Crackers','Cookie Mix','Spice Rub']
    },
    {
      name: 'Lakeside Coffee & Goods',
      address: '27 Holt Dr, Bigfork, MT', hours: 'Daily 7am–4pm',
      lat: 48.0498, lng: -114.0631,
      products: ['Honey Granola','Wildflower Honey','Herbal Tea Blend']
    }
  ];

  function productsLabel(loc) {
    return loc.home ? 'The full Holly’s Pantry line' : loc.products.join(' · ');
  }

  // --- Map ---
  var map = L.map('leaflet-map', { scrollWheelZoom: true }).setView(BIGFORK, 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // --- Rustic pin (matches the homepage preview) ---
  function pinSvg(home) {
    var w = home ? 24 : 18, h = home ? 31 : 24;
    return '<svg viewBox="0 0 18 24" width="' + w + '" height="' + h + '" aria-hidden="true">' +
      '<path class="pin-body" d="M9 0 C 4 0 0 3.6 0 8.2 C 0 14 9 23 9 23 C 9 23 18 14 18 8.2 C 18 3.6 14 0 9 0 Z"/>' +
      '<circle class="pin-eye" cx="9" cy="8.2" r="3"/></svg>';
  }
  function makeIcon(home) {
    return L.divIcon({
      className: 'rustic-marker' + (home ? ' rustic-marker--home' : ''),
      html: pinSvg(home),
      iconSize: home ? [24, 31] : [18, 24],
      iconAnchor: home ? [12, 30] : [9, 23],
      popupAnchor: [0, home ? -28 : -22],
      tooltipAnchor: [home ? 12 : 9, home ? -14 : -12]
    });
  }

  // --- Build markers ---
  LOCATIONS.forEach(function (loc) {
    var m = L.marker([loc.lat, loc.lng], { icon: makeIcon(loc.home), alt: loc.name, title: loc.name });
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
