// Holly's Pantry - shared calendar renderer (homepage + Meet Us page).
// Reads content/calendar.json (edited via /admin/). External file so it works
// under the homepage's strict script-src CSP.
//
// Mounts into any container marked [data-calendar] that holds:
//   [data-cal-prev] [data-cal-title] [data-cal-next] [data-cal-grid] [data-cal-list]
// Open days are clickable: click a shaded day to see just that day's events,
// click it again (or the "show whole month" link) to go back.
(function () {
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function parse(s) {
    var p = String(s).slice(0, 10).split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  function covers(e, day) {
    var a = parse(e.date);
    var b = e.endDate ? parse(e.endDate) : a;
    return day >= a && day <= b;
  }
  function fmtRange(e) {
    var a = parse(e.date);
    var b = e.endDate ? parse(e.endDate) : a;
    var s = MONTHS[a.getMonth()].slice(0, 3) + ' ' + a.getDate();
    if (b > a) {
      s += b.getMonth() === a.getMonth()
        ? '-' + b.getDate()
        : ' - ' + MONTHS[b.getMonth()].slice(0, 3) + ' ' + b.getDate();
    }
    return s;
  }
  function eventHtml(e) {
    return '<article style="border-top: 1px solid var(--hairline); padding: 1.1rem 0;">' +
      '<h3 style="margin-bottom: 0.2rem;">' + esc(e.title) + '</h3>' +
      '<div style="font-family: var(--sans); font-size: 0.85rem; letter-spacing: 0.06em;">' +
        esc(fmtRange(e)) + (e.time ? ' &middot; ' + esc(e.time) : '') +
        (e.where ? ' &middot; ' + esc(e.where) : '') + '</div>' +
      (e.note ? '<p style="margin-top: 0.5rem;">' + esc(e.note) + '</p>' : '') +
    '</article>';
  }

  function mount(container, events) {
    var q = function (sel) { return container.querySelector(sel); };
    var titleEl = q('[data-cal-title]');
    var gridEl = q('[data-cal-grid]');
    var listEl = q('[data-cal-list]');
    if (!titleEl || !gridEl || !listEl) return;

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var selected = null; // a Date when a day is clicked

    function render() {
      var y = view.getFullYear(), m = view.getMonth();
      titleEl.textContent = MONTHS[m] + ' ' + y;

      var open = {};
      events.forEach(function (e) {
        var a = parse(e.date);
        var b = e.endDate ? parse(e.endDate) : a;
        for (var d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) {
          if (d.getFullYear() === y && d.getMonth() === m) open[d.getDate()] = true;
        }
      });

      var html = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
        .map(function (d) { return '<div class="cal-dow">' + d + '</div>'; }).join('');
      var first = new Date(y, m, 1).getDay();
      var days = new Date(y, m + 1, 0).getDate();
      for (var i = 0; i < first; i++) html += '<div class="cal-cell cal-cell--pad"></div>';
      for (var d = 1; d <= days; d++) {
        var cur = new Date(y, m, d);
        var cls = 'cal-cell' +
          (open[d] ? ' cal-cell--open' : '') +
          (sameDay(cur, today) ? ' cal-cell--today' : '') +
          (selected && sameDay(cur, selected) ? ' cal-cell--sel' : '');
        html += '<div class="' + cls + '" data-day="' + d + '"><span>' + d + '</span></div>';
      }
      gridEl.innerHTML = html;

      // list: one clicked day, or the whole month
      if (selected && selected.getMonth() === m && selected.getFullYear() === y) {
        var dayEvents = events.filter(function (e) { return covers(e, selected); });
        listEl.innerHTML =
          '<p class="cal-showing">' + MONTHS[m] + ' ' + selected.getDate() +
          ' &middot; <a href="#" data-cal-all>show the whole month</a></p>' +
          (dayEvents.length ? dayEvents.map(eventHtml).join('')
            : '<p style="font-style: italic;">Nothing on this day.</p>');
      } else {
        var monthEvents = events
          .filter(function (e) {
            var a = parse(e.date), b = e.endDate ? parse(e.endDate) : a;
            return a <= new Date(y, m + 1, 0) && b >= new Date(y, m, 1);
          })
          .sort(function (p1, p2) { return parse(p1.date) - parse(p2.date); });
        listEl.innerHTML = monthEvents.length
          ? monthEvents.map(eventHtml).join('')
          : '<p style="font-style: italic; margin-top: 0.8rem;">Nothing this month. Check the next one.</p>';
      }
    }

    gridEl.addEventListener('click', function (ev) {
      var cell = ev.target.closest('.cal-cell--open');
      if (!cell) return;
      var d = new Date(view.getFullYear(), view.getMonth(), +cell.getAttribute('data-day'));
      selected = (selected && sameDay(d, selected)) ? null : d;
      render();
    });
    listEl.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-cal-all]')) {
        ev.preventDefault();
        selected = null;
        render();
      }
    });
    var prev = q('[data-cal-prev]');
    var next = q('[data-cal-next]');
    if (prev) prev.addEventListener('click', function () {
      view = new Date(view.getFullYear(), view.getMonth() - 1, 1); selected = null; render();
    });
    if (next) next.addEventListener('click', function () {
      view = new Date(view.getFullYear(), view.getMonth() + 1, 1); selected = null; render();
    });
    render();
  }

  fetch('content/calendar.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var events = (data.events || []).filter(function (e) { return e.title && e.date; });
      if (!events.length) return; // leave whatever fallback text is in the markup
      Array.prototype.forEach.call(document.querySelectorAll('[data-calendar]'), function (c) {
        mount(c, events);
      });
    })
    .catch(function () {});
})();
