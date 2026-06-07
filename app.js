// Holly's Pantry — minimal modal + nav active-state
(function () {
  const modal = document.getElementById('melaleuca-modal');
  if (!modal) return;

  // Open from any [data-open-modal] trigger
  document.querySelectorAll('[data-open-modal]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        // Fallback for ancient browsers
        modal.setAttribute('open', '');
      }
    });
  });

  // Close button + backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close-modal]') || e.target === modal) {
      modal.close();
    }
  });

  // Mark current nav link as active
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();
