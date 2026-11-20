/* Inner pages: reading progress, table-of-contents highlight, role tabs, persistent checklists. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* reading progress */
  const bar = $('[data-read-progress]');
  if (bar) {
    const on = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%'; };
    addEventListener('scroll', on, { passive: true }); on();
  }

  /* toc highlight */
  const tocLinks = $$('[data-toc] a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(tocLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      tocLinks.forEach(a => a.classList.remove('is-current'));
      map.get(e.target.id)?.classList.add('is-current');
    }), { rootMargin: '-30% 0px -60% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* role tabs (WAI-ARIA tabs pattern) */
  const tabs = $$('[role="tab"]');
  const select = tab => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const next = tabs[(i + d + tabs.length) % tabs.length]; select(next); next.focus();
    });
  });

  /* checklists remembered on this device */
  $$('[data-checklist]').forEach(list => {
    const key = 'lensho-check-' + list.dataset.checklist;
    const boxes = $$('input[type="checkbox"]', list);
    const count = list.closest('.role-panel')?.querySelector('[data-check-count]');
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}
    boxes.forEach(b => { b.checked = saved.includes(b.id); });
    const update = () => {
      const ids = boxes.filter(b => b.checked).map(b => b.id);
      if (count) count.textContent = `${ids.length} / ${boxes.length}`;
      try { localStorage.setItem(key, JSON.stringify(ids)); } catch (e) {}
    };
    boxes.forEach(b => b.addEventListener('change', update)); update();
  });
})();
