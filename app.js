// Holly's Pantry — hero rotator + sticky nav + showcase carousel + modal + nav state
(function () {

  /* ----- Hero seasonal callout rotator -----
     EDIT THIS LIST: the words shown on the line under the logo.
     Drop in current products or a seasonal note — Holly's call. */
  const CALLOUTS = [
    'Small-batch & made by hand',
    'Maple nut granola, baked this week',
    "Grammi's pancakes, layered in the jar",
    'Bouillon without the mystery cubes',
    'Taco seasoning you can pronounce',
    'Fresh flour, milled to order',
    'Non-toxic, kitchen to home',
  ];

  const rotator = document.querySelector('[data-rotator]');
  if (rotator && CALLOUTS.length > 1) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0;
    rotator.textContent = CALLOUTS[0];
    if (!reduceMotion) {
      setInterval(() => {
        rotator.classList.add('is-fading');
        setTimeout(() => {
          i = (i + 1) % CALLOUTS.length;
          rotator.textContent = CALLOUTS[i];
          rotator.classList.remove('is-fading');
        }, 500); // matches the CSS opacity transition
      }, 3800);
    }
  }

  /* ----- Sticky header: solid background + hairline after 100px scroll ----- */
  const header = document.querySelector('.site-header');

  /* ----- Scroll-spy: highlight the nav link for the section in view -----
     Only runs on the single-scroll homepage (where #shop exists). The
     /map page falls back to the filename match below (Map active). */
  const isHome = !!document.getElementById('shop');
  // Include the link-less sections (about, find) so the active state clears
  // while reading them instead of leaving "Shop" wrongly highlighted.
  const spyIds = ['top', 'shop', 'about', 'find', 'contact'];
  const navLinks = Array.from(document.querySelectorAll('.nav a'));
  const linkForId = (id) =>
    navLinks.find((a) => (a.getAttribute('href') || '').endsWith('#' + id));

  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 100);

    if (!isHome) return;
    const y = window.scrollY + 100;
    let activeId = 'top';
    for (const id of spyIds) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= y) activeId = id;
    }
    const active = linkForId(activeId);
    navLinks.forEach((a) => a.classList.toggle('active', a === active));
  }

  if (header || isHome) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial state
  }

  /* ----- Product showcase: arrow controls scroll one card at a time ----- */
  const track = document.querySelector('[data-showcase-track]');
  if (track) {
    const card = track.querySelector('.product-card');
    const GAP = 24; // 1.5rem gap between cards
    document.querySelectorAll('[data-scroll]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const step = card
          ? card.getBoundingClientRect().width + GAP
          : track.clientWidth * 0.8;
        track.scrollBy({
          left: btn.dataset.scroll === 'next' ? step : -step,
          behavior: 'smooth',
        });
      });
    });
  }

  /* ----- Modal (legacy pages) ----- */
  const modal = document.getElementById('melaleuca-modal');
  if (modal) {
    document.querySelectorAll('[data-open-modal]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof modal.showModal === 'function') {
          modal.showModal();
        } else {
          modal.setAttribute('open', ''); // fallback for ancient browsers
        }
      });
    });
    modal.addEventListener('click', (e) => {
      if (e.target.matches('[data-close-modal]') || e.target === modal) {
        modal.close();
      }
    });
  }

  /* ----- Mark current nav link as active by filename (multi-page pages) ----- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  if (!isHome) {
    document.querySelectorAll('.nav a').forEach((a) => {
      const href = (a.getAttribute('href') || '').split('#')[0];
      if (href === path) a.classList.add('active');
    });
  }
})();
