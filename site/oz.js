/* Lensho Capital — OZ 2.0 page interactions (no dependencies) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const OZ_START = new Date('2027-01-01T00:00:00-05:00');
  const DAY = 864e5;

  /* ---------------- language ---------------- */
  const t = {
    en: {
      cdBefore: 'OZ 2.0 TAKES EFFECT IN', cdAfter: 'OZ 2.0 HAS BEEN IN EFFECT FOR',
      today: 'TODAY', daysLeft: 'days left in your window', daysOver: 'days since your window closed',
      yrs: 'yrs',
      openOZ: 'Your window reaches into OZ 2.0.',
      openOZBody: d => `Your 180 days run to ${d}. Investing on or after January 1, 2027 may place the gain under the enhanced OZ 2.0 rules: five-year rolling deferral, a 10% step-up and the ten-year exclusion.`,
      open: 'Your window is open.',
      openBody: d => `Your 180 days run to ${d}. There is time to review a specific project, but structuring and documentation take weeks — earlier conversations leave more options.`,
      pre: 'Your window closes before OZ 2.0 begins.',
      preBody: d => `Your 180 days end ${d}, before January 1, 2027. Investments made under the original rules defer the gain only until December 31, 2026. Talk with your tax advisor about timing before you act.`,
      closed: 'Your window may have closed.',
      closedBody: d => `Based on this date, the 180 days ended ${d}. Some gains — including certain partnership (K-1) gains — can start the clock later than expected, so it is worth confirming.`,
      k1: ' For K-1 gains, a partner may be able to start the 180 days on the last day of the partnership’s tax year or the due date of its return.',
      future: 'Planning ahead is the strongest position.',
      futureBody: d => `If the gain is recognized on this date, your 180 days would run to ${d}. Planning before a sale closes leaves the most room to choose the right investment.`,
      futureLabel: 'days in your window',
    },
    zh: {
      cdBefore: '距 OZ 2.0 生效还有', cdAfter: 'OZ 2.0 已生效',
      today: '今天', daysLeft: '天 · 窗口剩余', daysOver: '天 · 窗口已结束',
      yrs: '年',
      openOZ: '您的窗口可延伸至 OZ 2.0。',
      openOZBody: d => `您的 180 天窗口截至 ${d}。在 2027 年 1 月 1 日或之后投资，利得可能适用 OZ 2.0 的增强规则：五年滚动递延、10% 基础上调，以及持有十年后的增值免税。`,
      open: '您的窗口仍然开放。',
      openBody: d => `您的 180 天窗口截至 ${d}。仍有时间了解具体项目，但架构安排与文件准备通常需要数周 —— 越早沟通，选择越多。`,
      pre: '您的窗口在 OZ 2.0 生效前结束。',
      preBody: d => `您的 180 天窗口于 ${d} 结束，早于 2027 年 1 月 1 日。按原规则投资，利得仅可递延至 2026 年 12 月 31 日。行动前请先与税务顾问确认时间安排。`,
      closed: '您的窗口可能已经结束。',
      closedBody: d => `按此日期计算，180 天已于 ${d} 结束。部分利得（包括某些合伙企业 K-1 利得）的起算时间可能晚于预期，值得进一步确认。`,
      k1: ' 对于 K-1 利得，合伙人或可选择以合伙企业纳税年度最后一天或其申报截止日作为 180 天的起算日。',
      future: '提前规划，是最有利的位置。',
      futureBody: d => `若利得于该日确认，您的 180 天窗口将截至 ${d}。在交易完成前规划，最能从容选择合适的投资。`,
      futureLabel: '天 · 窗口总长',
    },
  };
  let lang = 'en';
  try { lang = localStorage.getItem('lensho-lang') === 'zh' ? 'zh' : 'en'; } catch (e) {}
  const setLang = l => {
    lang = l;
    root.dataset.lang = l;
    root.lang = l === 'zh' ? 'zh-CN' : 'en';
    $$('[data-set-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.setLang === l)));
    try { localStorage.setItem('lensho-lang', l); } catch (e) {}
    updateCalc(); updateWindow(); tickCountdown();
  };
  $$('[data-set-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.setLang)));

  const fmtUSD = n => '$' + Math.round(n).toLocaleString('en-US');
  const fmtDate = d => lang === 'zh'
    ? `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
    : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const fmtShort = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  /* ---------------- header + load ---------------- */
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-loaded')));

  /* ---------------- countdown ---------------- */
  const cd = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  function tickCountdown() {
    const now = Date.now();
    let diff = OZ_START - now;
    const after = diff <= 0;
    diff = Math.abs(diff);
    const pad = n => String(n).padStart(2, '0');
    cd.d.textContent = Math.floor(diff / DAY);
    cd.h.textContent = pad(Math.floor(diff / 36e5) % 24);
    cd.m.textContent = pad(Math.floor(diff / 6e4) % 60);
    cd.s.textContent = pad(Math.floor(diff / 1e3) % 60);
    $('[data-cd-label-en]').textContent = t.en[after ? 'cdAfter' : 'cdBefore'];
    $('[data-cd-label-zh]').textContent = t.zh[after ? 'cdAfter' : 'cdBefore'];
  }
  setInterval(tickCountdown, 1000);

  /* ---------------- reveal + count-up ---------------- */
  const countUp = el => {
    const end = +el.dataset.count; if (reduce || !end) { el.textContent = end; return; }
    const t0 = performance.now(), dur = 1600;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * e);
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = 0; requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-in');
    $$('[data-count]', en.target).forEach(countUp);
    if (en.target.matches('.map')) lightTracts();
    io.unobserve(en.target);
  }), { threshold: .22 });
  $$('.figures, .fit, .map, [data-reveal]').forEach(el => io.observe(el));

  /* ---------------- scroll timeline ---------------- */
  const track = $('[data-timeline]');
  const yearEl = $('[data-year]');
  const steps = $$('.step');
  const marks = $$('[data-mark]');
  const clip = $('[data-clip]');
  const prog = $('[data-progress]');
  const isDesktop = () => innerWidth > 900;
  let tlDraw = 0, tlTarget = .04, tlRaf = 0;
  function onTimeline() {
    let p = 1;
    if (isDesktop()) {
      const r = track.getBoundingClientRect();
      p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    }
    const active = !isDesktop() ? 2 : p < .34 ? 0 : p < .67 ? 1 : 2;
    steps.forEach((s, i) => { s.classList.toggle('is-active', i === active || !isDesktop()); s.classList.toggle('is-past', i < active && isDesktop()); });
    prog.style.width = (p * 100) + '%';
    tlTarget = [.04, .5, 1][active];
    if (!tlRaf) tlRaf = requestAnimationFrame(tweenTimeline);
  }
  // chart + year ease toward the active step: 2027 → 2032 → 2037
  function tweenTimeline() {
    tlDraw += (tlTarget - tlDraw) * (reduce ? 1 : .07);
    if (Math.abs(tlTarget - tlDraw) < .002) tlDraw = tlTarget;
    clip.setAttribute('width', 40 + 560 * tlDraw);
    marks.forEach((m, i) => m.classList.toggle('on', tlDraw >= [0, .49, .99][i]));
    yearEl.textContent = 2027 + Math.round(tlDraw * 10);
    tlRaf = tlDraw === tlTarget ? 0 : requestAnimationFrame(tweenTimeline);
  }
  addEventListener('scroll', onTimeline, { passive: true });
  addEventListener('resize', onTimeline); onTimeline();

  /* ---------------- calculator ---------------- */
  const RATE = .238;
  const ins = { gain: $('[data-in="gain"]'), rate: $('[data-in="rate"]'), years: $('[data-in="years"]') };
  const out = k => $(`[data-out="${k}"]`), res = k => $(`[data-r="${k}"]`);
  const paintRange = el => el.style.setProperty('--p', ((el.value - el.min) / (el.max - el.min) * 100) + '%');
  function updateCalc() {
    const G = +ins.gain.value, r = +ins.rate.value / 100, n = +ins.years.value;
    const g = Math.pow(1 + r, n);
    const taxNow = G * RATE;
    const base = G - taxNow;
    const netA = base * g - RATE * (base * g - base);           // pay now, reinvest, tax appreciation at exit
    const taxY5 = G * .9 * RATE;                                  // OZ: tax on 90% of deferred gain at year 5
    const netB = G * g - taxY5;                                   // appreciation excluded after 10+ years
    out('gain').textContent = fmtUSD(G);
    out('rate').textContent = (+ins.rate.value).toFixed(1) + '%';
    out('years').textContent = n + ' ' + t[lang].yrs;
    res('taxNow').textContent = fmtUSD(taxNow);
    res('taxY5').textContent = fmtUSD(taxY5);
    res('netA').textContent = fmtUSD(netA);
    res('netB').textContent = fmtUSD(netB);
    res('delta').textContent = '+' + fmtUSD(netB - netA);
    const max = Math.max(netA, netB);
    $('[data-bar="a"]').style.width = (netA / max * 100) + '%';
    $('[data-bar="b"]').style.width = (netB / max * 100) + '%';
    Object.values(ins).forEach(paintRange);
  }
  Object.values(ins).forEach(i => i.addEventListener('input', updateCalc));

  /* ---------------- 180-day window ---------------- */
  const dateIn = $('[data-gain-date]');
  const w = k => $(`[data-w="${k}"]`);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  dateIn.value = iso(new Date(today.getTime() - 40 * DAY));
  function updateWindow() {
    if (!dateIn.value) return;
    const [y, m, d] = dateIn.value.split('-').map(Number);
    const start = new Date(y, m - 1, d);
    const end = new Date(start.getTime() + 180 * DAY);
    const L = t[lang];
    const type = ($('[name="gtype"]:checked') || {}).value;
    const ozLocal = new Date(2027, 0, 1);
    let state, days;
    if (start > today) { state = 'future'; days = 180; }
    else if (end < today) { state = 'closed'; days = Math.round((today - end) / DAY); }
    else { days = Math.round((end - today) / DAY); state = end >= ozLocal ? 'openOZ' : 'pre'; if (start >= ozLocal) state = 'open'; }
    const big = w('days');
    big.textContent = days;
    big.classList.toggle('is-oz', state === 'openOZ' || state === 'future' && end >= ozLocal);
    w('daysLabel').textContent = state === 'closed' ? L.daysOver : state === 'future' ? L.futureLabel : L.daysLeft;
    w('headline').textContent = L[state];
    w('body').textContent = L[state + 'Body'](fmtDate(end)) + (type === 'k1' && state !== 'future' ? L.k1 : '');
    w('start').textContent = fmtShort(start);
    w('end').textContent = fmtShort(end);
    const pct = x => Math.max(0, Math.min(100, (x - start) / (end - start) * 100));
    w('fill').style.width = pct(today) + '%';
    const todayEl = w('today'), ozEl = w('oz');
    todayEl.style.left = pct(today) + '%';
    todayEl.style.display = today >= start && today <= end ? '' : 'none';
    w('todayLabel').textContent = L.today;
    ozEl.style.left = pct(ozLocal) + '%';
    ozEl.style.display = ozLocal > start && ozLocal <= end ? '' : 'none';
  }
  dateIn.addEventListener('input', updateWindow);
  $$('[name="gtype"]').forEach(r => r.addEventListener('change', updateWindow));

  /* ---------------- schematic tract map ---------------- */
  const svgNS = 'http://www.w3.org/2000/svg';
  const g = $('.tracts');
  // rough outline of Hudson County, NJ (schematic only)
  const outline = [[236, 18], [292, 26], [304, 96], [292, 170], [276, 236], [254, 300], [226, 372], [196, 432], [150, 452], [116, 430], [128, 372], [156, 300], [178, 220], [196, 140], [212, 70]];
  const inside = (x, y) => {
    let c = false;
    for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
      const [xi, yi] = outline[i], [xj, yj] = outline[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const R = 11, hexes = [];
  for (let row = 0; row < 40; row++) for (let col = 0; col < 30; col++) {
    const cx = col * R * 1.732 + (row % 2) * R * .866, cy = row * R * 1.5;
    if (!inside(cx, cy)) continue;
    const pts = Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 3 * k + Math.PI / 6; return `${(cx + (R - 1.2) * Math.cos(a)).toFixed(1)},${(cy + (R - 1.2) * Math.sin(a)).toFixed(1)}`; }).join(' ');
    const p = document.createElementNS(svgNS, 'polygon');
    p.setAttribute('points', pts); p.setAttribute('class', 't');
    g.appendChild(p); hexes.push({ p, cy });
  }
  const labels = [['North Bergen', 104], ['Union City', 178], ['Weehawken', 214], ['Jersey City', 330]];
  labels.forEach(([name, y]) => {
    const tx = document.createElementNS(svgNS, 'text');
    tx.setAttribute('x', 330); tx.setAttribute('y', y); tx.setAttribute('class', 'map-caption');
    tx.style.fill = '#d6d9d3'; tx.textContent = name.toUpperCase();
    const ln = document.createElementNS(svgNS, 'line');
    ln.setAttribute('x1', 322); ln.setAttribute('x2', 286 - (y > 250 ? 40 : 0)); ln.setAttribute('y1', y - 3); ln.setAttribute('y2', y - 3);
    ln.setAttribute('stroke', '#c9a07b'); ln.setAttribute('stroke-width', '1');
    g.parentNode.appendChild(ln); g.parentNode.appendChild(tx);
  });
  function lightTracts() {
    hexes.forEach(({ p, cy }) => {
      const r = rnd();
      if (r > .7) setTimeout(() => { p.classList.add('oz'); if (r > .93) p.classList.add('hot'); }, reduce ? 0 : 200 + cy * 4 + r * 400);
    });
  }

  setLang(lang);
})();
