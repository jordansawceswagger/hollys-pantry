// Holly's Pantry — hero rotator + modal + nav active-state
(function () {

  /* ----- Hero seasonal callout rotator -----
     EDIT THIS LIST: the words shown on the line under the logo.
     Drop in current products or a seasonal note — Holly's call. */
  const CALLOUTS = [
    'Small-batch & made by hand',
    'Wild huckleberry preserves',
    'Slow-simmered apple butter',
    'Hand-milled herb & flower salts',
    'Sourdough, started Sunday',
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

  /* ----- Modal ----- */
  const modal = document.getElementById('melaleuca-modal');
  if (modal) {
    // Open from any [data-open-modal] trigger
    document.querySelectorAll('[data-open-modal]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof modal.showModal === 'function') {
          modal.showModal();
        } else {
          modal.setAttribute('open', ''); // fallback for ancient browsers
        }
      });
    });

    // Close button + backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target.matches('[data-close-modal]') || e.target === modal) {
        modal.close();
      }
    });
  }

  /* ----- Mark current nav link as active ----- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();
