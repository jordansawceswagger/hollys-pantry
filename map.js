// Holly's Pantry - /map page: Leaflet map + product filter + stockist sidebar.
// Stockist data + pin helpers come from the shared locations.js (window.HOLLYS),
// which loads stockists.json and resolves HOLLYS.ready.
(function () {
  if (typeof L === 'undefined' || !window.HOLLYS) return; // Leaflet/data missing - leave a blank parchment panel

  window.HOLLYS.ready.then(function (H) {
    var LOCATIONS = H.LOCATIONS;
    var HOME = H.HOME_REGION; // Bigfork - first region in stockists.json

    // --- Map ---
    var map = L.map('leaflet-map', { scrollWheelZoom: true }).setView([HOME.lat, HOME.lng], HOME.zoom);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // --- Build markers (popup products link to their pantry.html card) ---
    LOCATIONS.forEach(function (loc) {
      var m = L.marker([loc.lat, loc.lng], { icon: H.makeIcon(loc.home), alt: loc.name, title: loc.name });
      var nameHtml = loc.website
        ? '<a href="' + loc.website + '" target="_blank" rel="noopener">' + loc.name + '</a>'
        : loc.name;
      m.bindPopup(
        '<div class="lp-name">' + nameHtml + '</div>' +
        '<div class="lp-products">' + H.productLinks(loc) + '</div>' +
        '<div class="lp-meta">' + loc.address + '<br>' + loc.hours + '</div>'
      );
      if (loc.home) {
        m.bindTooltip(loc.name, { permanent: true, direction: 'right', offset: [10, -12], className: 'home-tooltip' });
      }
      loc._marker = m;
    });

    // --- Region jump buttons (Bigfork / Kalispell / Whitefish ...) ---
    var regionBox = document.getElementById('map-regions');
    if (regionBox && H.REGIONS.length > 1) {
      H.REGIONS.forEach(function (rg, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'region-btn' + (i === 0 ? ' is-active' : '');
        b.textContent = rg.name;
        b.addEventListener('click', function () {
          map.setView([rg.lat, rg.lng], rg.zoom, { animate: true });
          regionBox.querySelectorAll('.region-btn').forEach(function (x) { x.classList.remove('is-active'); });
          b.classList.add('is-active');
        });
        regionBox.appendChild(b);
      });
    }

    // --- Filter dropdown: full product line (value = slug) ---
    var sel = document.getElementById('product-filter');
    H.PRODUCTS.forEach(function (p) {
      var o = document.createElement('option');
      o.value = p.slug;
      o.textContent = p.name;
      sel.appendChild(o);
    });

    // --- Render sidebar + markers for a given filter (slug or 'all') ---
    var listEl = document.getElementById('loc-list');
    function render(filter) {
      listEl.innerHTML = '';
      var visible = [];
      LOCATIONS.forEach(function (loc) {
        var match = filter === 'all' || (loc.carries || []).indexOf(filter) !== -1;
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
          '<p class="loc-products">' + H.productsLabel(loc) + '</p>';
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
        listEl.innerHTML = '<li class="loc-empty">No stockists carry that yet - check back soon.</li>';
      }

      // Frame the visible pins
      if (filter === 'all') {
        map.setView([HOME.lat, HOME.lng], HOME.zoom, { animate: true });
      } else if (visible.length) {
        var bounds = L.latLngBounds(visible.map(function (l) { return [l.lat, l.lng]; }));
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }

    sel.addEventListener('change', function () { render(sel.value); });
    render('all');

    // Leaflet needs a size recalc once layout settles
    setTimeout(function () { map.invalidateSize(); }, 200);
  });
})();
