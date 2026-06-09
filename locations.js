// Shared stockist data + rustic pin helpers — single source of truth for the
// homepage map preview (home-map.js) and the full /map page (map.js).
// Loaded after Leaflet; exposes window.HOLLYS.
(function () {
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

  window.HOLLYS = {
    BIGFORK: BIGFORK,
    LOCATIONS: LOCATIONS,
    productsLabel: productsLabel,
    pinSvg: pinSvg,
    makeIcon: makeIcon
  };
})();
