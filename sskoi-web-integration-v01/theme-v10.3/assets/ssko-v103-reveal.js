// Fades sections in as they reach the viewport. Skipped with reduced motion; everything shows after 4 s regardless.
(() => {
  if (window.__sskoReveal) return;
  window.__sskoReveal = true;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const selector = '.rows .row, .ssko-v10-recipe, .ssko-gift-row, .ssko-v4-look, .sec-head, .ssko-v09-mod__head, .ssko-home-journal, .ssko-v09-trio, .ssko-v09-duo';
  const run = () => {
    const els = [...document.querySelectorAll(selector)].filter((el) => el.getBoundingClientRect().top > innerHeight * 0.85);
    if (!els.length) return;
    document.documentElement.classList.add('js-reveal');
    els.forEach((el) => el.classList.add('ssko-reveal'));
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    setTimeout(() => els.forEach((el) => el.classList.add('is-in')), 4000);
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', run) : run();
})();
