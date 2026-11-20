/* Homepage: cinematic scenes, OZ countdown label, lightbox. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const LS = window.LS;

  /* cinematic hero — scene follows scroll progress through the pinned section */
  const cine = $('[data-cine]');
  if (cine) {
    const imgs = $$('.cine-images img', cine), caps = $$('.cine-caption', cine), tracks = $$('.cine-track i', cine);
    let current = 0;
    const onScroll = () => {
      const r = cine.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      const idx = Math.min(2, Math.floor(p * 3 * 0.999));
      tracks.forEach((t, i) => { t.style.width = Math.min(100, Math.max(0, (p * 3 - i) * 100)) + '%'; });
      if (idx === current) return;
      current = idx;
      imgs.forEach((im, i) => im.classList.toggle('is-active', i === idx));
      caps.forEach((c, i) => { c.classList.toggle('is-active', i === idx); c.classList.toggle('is-past', i < idx); });
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    // warm the later scenes once the first has painted
    addEventListener('load', () => imgs.forEach(im => { im.loading = 'eager'; }));
  }

  /* OZ band — days until 1 Jan 2027 (Eastern) */
  const n = $('[data-oz-days]'), label = $('[data-oz-days-label]');
  if (n) {
    const render = () => {
      const days = Math.ceil((new Date('2027-01-01T00:00:00-05:00') - Date.now()) / 864e5);
      if (days > 0) { n.textContent = days; label.textContent = LS.t('days until it takes effect', '天后正式生效'); }
      else { n.textContent = Math.abs(days); label.textContent = LS.t('days in effect', '天 · 已生效'); }
    };
    render(); LS.onLang(render);
  }

  /* lightbox */
  const dlg = $('[data-lightbox-dialog]');
  if (dlg && dlg.showModal) {
    const img = $('img', dlg);
    $$('[data-lightbox]').forEach(b => b.addEventListener('click', () => {
      img.src = b.dataset.lightbox; img.alt = $('img', b).alt; dlg.showModal();
    }));
    $('.lightbox-close', dlg).addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  }
})();
