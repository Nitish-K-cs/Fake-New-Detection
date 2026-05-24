// ============================================
// nav.js — Highlight active nav link based on current page filename
// ============================================

(function () {
  const page = window.location.pathname.split('/').pop() || 'home.html';

  const map = {
    'index.html':    'nav-index',
    'predict.html': 'nav-predict',
    'images.html':  'nav-images',
    'about.html':   'nav-about',
  };

  const activeId = map[page];
  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) el.classList.add('active');
  }
})();
