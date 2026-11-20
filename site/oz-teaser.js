/* Homepage OZ 2.0 teaser: days-until counter + reveal. No dependencies. */
(() => {
  const el = document.querySelector('[data-oz-teaser]');
  if (!el) return;
  const start = new Date('2027-01-01T00:00:00-05:00');
  const days = Math.ceil((start - Date.now()) / 864e5);
  const n = el.querySelector('[data-oz-days]');
  const label = el.querySelector('[data-oz-days-label]');
  if (days > 0) { n.textContent = days; }
  else { n.textContent = 'Now'; label.textContent = 'in effect since January 1, 2027'; }
  if (!('IntersectionObserver' in window)) { el.classList.add('is-in'); return; }
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect(); } }, { threshold: .3 });
  io.observe(el);
})();
