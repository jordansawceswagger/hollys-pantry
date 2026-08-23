// Homepage content bindings - fills the Meet Holly teaser, Coming Up rows,
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
        if (box) box.innerHTML = '<img src="' + esc(meet.headshot) + '" alt="Holly">'; // sizing via .holly-photo img CSS
      }
    })
    .catch(function () {});

  // --- Coming Up rows: next events from content/calendar.json ---
  fetch('content/calendar.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var box = document.querySelector('[data-home-events]');
      if (!box) return;
      var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      function parse(s) {
        var p = String(s).slice(0, 10).split('-');
        return new Date(+p[0], +p[1] - 1, +p[2]);
      }
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var upcoming = (data.events || [])
        .filter(function (e) {
          if (!e.title || !e.date) return false;
          var end = e.endDate ? parse(e.endDate) : parse(e.date);
          return end >= today;
        })
        .sort(function (a, b) { return parse(a.date) - parse(b.date); })
        .slice(0, 3);
      if (!upcoming.length) return;
      box.innerHTML = upcoming.map(function (e) {
        var a = parse(e.date);
        var b = e.endDate ? parse(e.endDate) : a;
        var range = MONTHS[a.getMonth()] + ' ' + a.getDate();
        if (b > a) {
          range += b.getMonth() === a.getMonth()
            ? '-' + b.getDate()
            : ' - ' + MONTHS[b.getMonth()] + ' ' + b.getDate();
        }
        var when = range + (e.time ? ' · ' + e.time : '') + (e.where ? ' · ' + e.where : '');
        return '<div class="cu-row"><span class="cu-event">' + esc(e.title) + '</span>' +
               '<span class="cu-when">' + esc(when) + '</span></div>';
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
