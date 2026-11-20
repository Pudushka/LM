/* Lensho Capital — shared behaviour: language, header, menu, reveal, count-up, contact form. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- language ---------- */
  const LS = window.LS = window.LS || {};
  const listeners = [];
  LS.onLang = fn => listeners.push(fn);
  LS.lang = 'en';
  try {
    const q = new URLSearchParams(location.search).get('lang');
    const saved = localStorage.getItem('lensho-lang');
    LS.lang = (q || saved || (navigator.language || '').toLowerCase()).startsWith('zh') ? 'zh' : 'en';
  } catch (e) {}
  LS.t = (en, zh) => (LS.lang === 'zh' ? zh : en);
  LS.setLang = l => {
    LS.lang = l;
    root.dataset.lang = l;
    root.lang = l === 'zh' ? 'zh-CN' : 'en';
    $$('[data-set-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.setLang === l)));
    $$('[data-title-en]').forEach(el => { document.title = l === 'zh' ? el.dataset.titleZh : el.dataset.titleEn; });
    $$('[data-ph-en]').forEach(el => { el.placeholder = l === 'zh' ? el.dataset.phZh : el.dataset.phEn; });
    $$('option[data-en]').forEach(o => { o.textContent = l === 'zh' ? o.dataset.zh : o.dataset.en; });
    try { localStorage.setItem('lensho-lang', l); } catch (e) {}
    listeners.forEach(fn => fn(l));
  };
  $$('[data-set-lang]').forEach(b => b.addEventListener('click', () => LS.setLang(b.dataset.setLang)));

  /* ---------- toast & copy ---------- */
  const toast = $('.toast');
  let toastT;
  LS.toast = msg => {
    if (!toast) return;
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('show'), 2600);
  };
  LS.copy = async (text, el) => {
    try { await navigator.clipboard.writeText(text); LS.toast(LS.t('Copied to clipboard', '已复制')); }
    catch (e) {
      if (el) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
      LS.toast(LS.t('Selected — press Ctrl/⌘ + C to copy', '已选中，请按 Ctrl/⌘ + C 复制'));
    }
  };
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => {
    const target = b.dataset.copy ? $(b.dataset.copy) : null;
    LS.copy(target ? target.textContent.trim() : b.dataset.copyText, target);
  }));

  /* ---------- header & menu ---------- */
  const header = $('.header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const toggle = $('.menu-toggle');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
  };
  if (toggle) toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('.drawer a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- launcher hides over footer ---------- */
  // hidden over the opening screen (where it would cover hero captions) and over the footer
  const launcher = $('.launcher'), footer = $('.footer');
  if (launcher) {
    let overFooter = false;
    const sync = () => launcher.classList.toggle('is-hidden', overFooter || scrollY < innerHeight * .6);
    if (footer && 'IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { overFooter = e.isIntersecting; sync(); }).observe(footer);
    }
    addEventListener('scroll', sync, { passive: true }); sync();
  }

  /* ---------- reveal & count-up ---------- */
  const countUp = el => {
    const end = +el.dataset.count; const dec = +(el.dataset.dec || 0);
    if (reduce || !end) { el.textContent = end.toFixed(dec); return; }
    const t0 = performance.now(), dur = 1500;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = (end * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  LS.observe = (els, fn, opts = { threshold: .18 }) => {
    if (!('IntersectionObserver' in window)) { els.forEach(fn); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { fn(en.target); io.unobserve(en.target); } }), opts);
    els.forEach(el => io.observe(el));
  };
  LS.observe($$('[data-reveal]'), el => {
    el.classList.add('is-in');
    $$('[data-count]', el).forEach(countUp);
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  // anything already on screen at load reveals immediately
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-loaded')));

  /* ---------- footer year ---------- */
  $$('[data-year-now]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- contact form ---------- */
  const form = $('[data-contact-form]');
  if (form) {
    const out = $('[data-contact-result]');
    const email = form.dataset.to || 'lenshocapitalllc@gmail.com';
    form.addEventListener('submit', async e => {
      e.preventDefault();
      let ok = true;
      $$('[required]', form).forEach(inp => {
        const fld = inp.closest('.fld') || inp.closest('.check');
        const bad = inp.type === 'checkbox' ? !inp.checked : !inp.value.trim() || (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(inp.value));
        if (fld) fld.classList.toggle('has-error', bad);
        if (bad) ok = false;
      });
      if (!ok) { LS.toast(LS.t('Please complete the highlighted fields', '请填写标出的必填项')); $('.has-error :is(input,select,textarea)', form)?.focus(); return; }
      const data = Object.fromEntries(new FormData(form));
      const label = k => form.querySelector(`[name="${k}"]`)?.closest('.fld')?.querySelector('span .' + LS.lang)?.textContent || k;
      const lines = Object.entries(data).filter(([k, v]) => v && k !== 'consent').map(([k, v]) => {
        const sel = form.querySelector(`select[name="${k}"]`);
        const shown = sel ? sel.selectedOptions[0].textContent.trim() : v;
        return `${label(k)}: ${shown}`;
      });
      const subject = `${LS.t('Introduction', '合作介绍')} — ${data.name || ''}`.trim();
      const body = lines.join('\n');
      // Production hook: set data-endpoint on the form to POST JSON to a server route.
      if (form.dataset.endpoint) {
        try {
          const r = await fetch(form.dataset.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
          if (!r.ok) throw new Error(r.status);
          form.reset(); out.hidden = false;
          out.querySelector('[data-result-title]').textContent = LS.t('Thank you. We will be in touch.', '感谢您的来信，我们会尽快联系您。');
          out.querySelector('pre').textContent = body;
          return;
        } catch (err) { /* fall through to email */ }
      }
      out.hidden = false;
      out.querySelector('pre').textContent = `${subject}\n\n${body}`;
      out.querySelector('[data-result-title]').textContent = LS.t('Your introduction is ready to send.', '您的介绍已整理好，可以发送。');
      out.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    $$('input, select, textarea', form).forEach(inp => inp.addEventListener('input', () => (inp.closest('.fld') || inp.closest('.check'))?.classList.remove('has-error')));
  }

  LS.setLang(LS.lang);
})();
