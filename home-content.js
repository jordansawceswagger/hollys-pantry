// Homepage content bindings — fills the Meet Holly teaser, Coming Up rows,
// and map-preview stockist list from the same JSON files that drive the
// Meet Us page, the /map page, and the /admin/ editor. Edit once, show everywhere.
(function () {
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function isPlaceholder(s) {
    return !s || s.indexOf('[') === 0 || s.indexOf('FILL IN') !== -1;
  }

  // --- Meet Holly teaser (content/meet.json) ---
  fetch('content/meet.json')
    .then(function (r) { return r.json(); })
    .then(function (meet) {
      if (!isPlaceholder(meet.intro)) {
        var head = document.querySelector('[data-home-headline]');
        if (head) head.textContent = meet.intro;
      }
      if (!isPlaceholder(meet.story)) {
        var body = document.querySelector('[data-home-body]');
        if (body) {
          body.innerHTML = esc(meet.story.split(/\n\s*\n/)[0])
            .replace(/\*([^*]+)\*/g, '<em>$1</em>');
        }
      }
      if (meet.headshot) {
        var box = document.querySelector('.holly-photo');
        if (box) box.innerHTML = '<img src="' + esc(meet.headshot) + '" alt="Holly" style="width:100%;height:100%;object-fit:cover;display:block;">';
      }
    })
    .catch(function () {});

  // --- Coming Up rows (content/coming-up.json) ---
  fetch('content/coming-up.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var box = document.querySelector('[data-home-events]');
      var events = (data.events || []).filter(function (e) { return !isPlaceholder(e.title); });
      if (!box || !events.length) return;
      box.innerHTML = events.map(function (e) {
        return '<div class="cu-row"><span class="cu-event">' + esc(e.title) + '</span>' +
               '<span class="cu-when">' + esc(e.when || '') + '</span></div>';
      }).join('');
    })
    .catch(function () {});

  // --- Map preview stockist list (stockists.json via locations.js) ---
  if (window.HOLLYS && window.HOLLYS.ready) {
    window.HOLLYS.ready.then(function (H) {
      var ul = document.querySelector('[data-home-stockists]');
      if (!ul || !H.LOCATIONS.length) return;
      var ordered = H.LOCATIONS.slice().sort(function (a, b) {
        return (a.home === b.home) ? 0 : (a.home ? 1 : -1); // stores first, home base last
      });
      ul.innerHTML = ordered.map(function (loc) {
        var name = loc.website
          ? '<a href="' + esc(loc.website) + '" target="_blank" rel="noopener">' + esc(loc.name) + '</a>'
          : esc(loc.name);
        return '<li class="loc">' +
          '<h3>' + name + '</h3>' +
          '<p class="loc-addr">' + esc(loc.address) + '</p>' +
          '<p class="loc-hours">' + esc(loc.hours) + '</p>' +
          '<p class="loc-products">' + esc(H.productsLabel(loc)) + '</p>' +
        '</li>';
      }).join('');
    });
  }
})();
