// Shared stockist data + rustic pin helpers - single source of truth for the
// homepage map preview (home-map.js) and the full /map page (map.js).
// Data lives in stockists.json (editable via /admin/); this file loads and
// normalizes it, exposing window.HOLLYS with a `ready` promise.
(function () {
  var BIGFORK = [48.0633, -114.0667];

  // Plain-text product names, for the sidebar and the home teaser.
  function productsLabel(loc) {
    if (loc.home) return 'The full Holly’s Pantry line';
    return loc.products.map(function (p) { return p.name; }).join(' · ');
  }

  // Linked product names, for the /map popups → pantry.html#slug anchors.
  function productLinks(loc) {
    if (loc.home) return productsLabel(loc);
    return loc.products.map(function (p) {
      return '<a href="pantry.html#' + p.slug + '">' + p.name + '</a>';
    }).join(' · ');
  }

  // Hand-drawn rustic pin (circle + tapered point), matching the brand.
  function pinSvg(home) {
    var w = home ? 24 : 18, h = home ? 31 : 24;
    return '<svg viewBox="0 0 18 24" width="' + w + '" height="' + h + '" aria-hidden="true">' +
      '<path class="pin-body" d="M9 0 C 4 0 0 3.6 0 8.2 C 0 14 9 23 9 23 C 9 23 18 14 18 8.2 C 18 3.6 14 0 9 0 Z"/>' +
      '<circle class="pin-eye" cx="9" cy="8.2" r="3"/></svg>';
  }

  // Leaflet divIcon using the rustic pin (called at runtime, after L exists).
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

  var H = window.HOLLYS = {
    BIGFORK: BIGFORK,
    LOCATIONS: [],   // populated once `ready` resolves
    PRODUCTS: [],
    REGIONS: [],
    productsLabel: productsLabel,
    productLinks: productLinks,
    pinSvg: pinSvg,
    makeIcon: makeIcon
  };

  H.ready = fetch('stockists.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var bySlug = {};
      (data.products || []).forEach(function (p) { bySlug[p.slug] = p; });
      H.PRODUCTS = data.products || [];
      H.REGIONS = data.regions || [];
      H.HOME_REGION = H.REGIONS[0] || { lat: BIGFORK[0], lng: BIGFORK[1], zoom: 13 };
      H.LOCATIONS = (data.stockists || []).map(function (s) {
        s.products = (s.carries || []).map(function (slug) {
          return bySlug[slug] || { slug: slug, name: slug };
        });
        return s;
      });
      return H;
    });
})();
