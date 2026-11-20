/* Lensho Capital — OZ 2.0 page. Depends on site.js (window.LS). */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const LS = window.LS;
  const t = LS.t;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const OZ_START = new Date('2027-01-01T00:00:00-05:00');
  const DAY = 864e5;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const fmtUSD = n => '$' + Math.round(n).toLocaleString('en-US');
  const fmtDate = d => LS.lang === 'zh'
    ? `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
    : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const fmtShort = d => LS.lang === 'zh'
    ? `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  const parseDate = v => { const [y, m, d] = v.split('-').map(Number); return new Date(y, m - 1, d); };
  const addMonths = (d, n) => { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; };

  /* ---------------- countdown ---------------- */
  const cd = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  function tickCountdown() {
    if (!cd.d) return;
    let diff = OZ_START - Date.now();
    const after = diff <= 0; diff = Math.abs(diff);
    const pad = n => String(n).padStart(2, '0');
    cd.d.textContent = Math.floor(diff / DAY);
    cd.h.textContent = pad(Math.floor(diff / 36e5) % 24);
    cd.m.textContent = pad(Math.floor(diff / 6e4) % 60);
    cd.s.textContent = pad(Math.floor(diff / 1e3) % 60);
    $('[data-cd-label-en]').textContent = after ? 'OZ 2.0 HAS BEEN IN EFFECT FOR' : 'OZ 2.0 TAKES EFFECT IN';
    $('[data-cd-label-zh]').textContent = after ? 'OZ 2.0 已生效' : '距 OZ 2.0 生效还有';
  }
  tickCountdown(); setInterval(tickCountdown, 1000);

  /* ---------------- figures, map reveal ---------------- */
  const countUp = el => {
    const end = +el.dataset.count; if (reduce || !end) { el.textContent = end; return; }
    const t0 = performance.now();
    const step = now => { const p = Math.min(1, (now - t0) / 1600); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); };
    el.textContent = 0; requestAnimationFrame(step);
  };
  LS.observe($$('.figures, .fit, .map'), el => {
    el.classList.add('is-in');
    $$('[data-count]', el).forEach(countUp);
    if (el.matches('.map')) lightTracts();
  }, { threshold: .2 });

  /* ---------------- scroll timeline ---------------- */
  const track = $('[data-timeline]');
  if (track) {
    const yearEl = $('[data-year]'), steps = $$('.step'), marks = $$('[data-mark]'), clip = $('[data-clip]'), prog = $('[data-progress]');
    const isDesktop = () => innerWidth > 900;
    let tlDraw = 0, tlTarget = .04, tlRaf = 0;
    const tween = () => {
      tlDraw += (tlTarget - tlDraw) * (reduce ? 1 : .07);
      if (Math.abs(tlTarget - tlDraw) < .002) tlDraw = tlTarget;
      clip.setAttribute('width', 40 + 560 * tlDraw);
      marks.forEach((m, i) => m.classList.toggle('on', tlDraw >= [0, .49, .99][i]));
      yearEl.textContent = 2027 + Math.round(tlDraw * 10);
      tlRaf = tlDraw === tlTarget ? 0 : requestAnimationFrame(tween);
    };
    const onTimeline = () => {
      let p = 1;
      if (isDesktop()) { const r = track.getBoundingClientRect(); p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))); }
      const active = !isDesktop() ? 2 : p < .34 ? 0 : p < .67 ? 1 : 2;
      steps.forEach((s, i) => { s.classList.toggle('is-active', i === active || !isDesktop()); s.classList.toggle('is-past', i < active && isDesktop()); });
      prog.style.width = (p * 100) + '%';
      tlTarget = [.04, .5, 1][active];
      if (!tlRaf) tlRaf = requestAnimationFrame(tween);
    };
    addEventListener('scroll', onTimeline, { passive: true });
    addEventListener('resize', onTimeline); onTimeline();
  }

  /* ---------------- illustrative calculator ---------------- */
  const RATE = .238;
  const ins = { gain: $('[data-in="gain"]'), rate: $('[data-in="rate"]'), years: $('[data-in="years"]') };
  const paintRange = el => el.style.setProperty('--p', ((el.value - el.min) / (el.max - el.min) * 100) + '%');
  function updateCalc() {
    if (!ins.gain) return;
    const G = +ins.gain.value, r = +ins.rate.value / 100, n = +ins.years.value, g = Math.pow(1 + r, n);
    const taxNow = G * RATE, base = G - taxNow;
    const netA = base * g - RATE * (base * g - base);
    const taxY5 = G * .9 * RATE;
    const netB = G * g - taxY5;
    const set = (sel, v) => { const el = $(sel); if (el) el.textContent = v; };
    set('[data-out="gain"]', fmtUSD(G));
    set('[data-out="rate"]', (+ins.rate.value).toFixed(1) + '%');
    set('[data-out="years"]', n + ' ' + t('yrs', '年'));
    set('[data-r="taxNow"]', fmtUSD(taxNow)); set('[data-r="taxY5"]', fmtUSD(taxY5));
    set('[data-r="netA"]', fmtUSD(netA)); set('[data-r="netB"]', fmtUSD(netB));
    set('[data-r="delta"]', '+' + fmtUSD(netB - netA));
    const max = Math.max(netA, netB);
    $('[data-bar="a"]').style.width = (netA / max * 100) + '%';
    $('[data-bar="b"]').style.width = (netB / max * 100) + '%';
    Object.values(ins).forEach(paintRange);
  }
  Object.values(ins).forEach(i => i && i.addEventListener('input', updateCalc));

  /* ---------------- 180-day window ---------------- */
  const dateIn = $('[data-gain-date]');
  const w = k => $(`[data-w="${k}"]`);
  const W = {
    openOZ: [t => t('Your window reaches into OZ 2.0.', '您的窗口可延伸至 OZ 2.0。'),
      d => t(`Your 180 days run to ${d}. Investing on or after January 1, 2027 may place the gain under the enhanced OZ 2.0 rules: five-year rolling deferral, a 10% step-up and the ten-year exclusion.`,
             `您的 180 天窗口截至 ${d}。在 2027 年 1 月 1 日或之后投资，利得可能适用 OZ 2.0 的增强规则：五年滚动递延、10% 基础上调，以及持有十年后的增值免税。`)],
    open: [t => t('Your window is open.', '您的窗口仍然开放。'),
      d => t(`Your 180 days run to ${d}. There is time to review a specific project, but structuring and documentation take weeks, so earlier conversations leave more options.`,
             `您的 180 天窗口截至 ${d}。仍有时间了解具体项目，但架构安排与文件准备通常需要数周，越早沟通，选择越多。`)],
    pre: [t => t('Your window closes before OZ 2.0 begins.', '您的窗口在 OZ 2.0 生效前结束。'),
      d => t(`Your 180 days end ${d}, before January 1, 2027. Investments made under the original rules defer the gain only until December 31, 2026. Talk with your tax advisor about timing before you act.`,
             `您的 180 天窗口于 ${d} 结束，早于 2027 年 1 月 1 日。按原规则投资，利得仅可递延至 2026 年 12 月 31 日。行动前请先与税务顾问确认时间安排。`)],
    closed: [t => t('Your window may have closed.', '您的窗口可能已经结束。'),
      d => t(`Based on this date, the 180 days ended ${d}. Some gains, including certain partnership (K-1) gains, can start the clock later than expected, so it is worth confirming.`,
             `按此日期计算，180 天已于 ${d} 结束。部分利得（包括某些合伙企业 K-1 利得）的起算时间可能晚于预期，值得进一步确认。`)],
    future: [t => t('Planning ahead is the strongest position.', '提前规划，是最有利的位置。'),
      d => t(`If the gain is recognized on this date, your 180 days would run to ${d}. Planning before a sale closes leaves the most room to choose the right investment.`,
             `若利得于该日确认，您的 180 天窗口将截至 ${d}。在交易完成前规划，最能从容选择合适的投资。`)],
  };
  function updateWindow() {
    if (!dateIn || !dateIn.value) return;
    const start = parseDate(dateIn.value), end = new Date(start.getTime() + 180 * DAY), ozLocal = new Date(2027, 0, 1);
    const type = ($('[name="gtype"]:checked') || {}).value;
    let state, days;
    if (start > today) { state = 'future'; days = 180; }
    else if (end < today) { state = 'closed'; days = Math.round((today - end) / DAY); }
    else { days = Math.round((end - today) / DAY); state = start >= ozLocal ? 'open' : end >= ozLocal ? 'openOZ' : 'pre'; }
    const big = w('days'); big.textContent = days;
    big.classList.toggle('is-oz', state === 'openOZ' || (state === 'future' && end >= ozLocal));
    w('daysLabel').textContent = state === 'closed' ? t('days since your window closed', '天 · 窗口已结束') : state === 'future' ? t('days in your window', '天 · 窗口总长') : t('days left in your window', '天 · 窗口剩余');
    w('headline').textContent = W[state][0](t);
    let body = W[state][1](fmtDate(end));
    if (type === 'k1' && state !== 'future') body += t(' For K-1 gains, a partner may be able to start the 180 days on the last day of the partnership’s tax year or the due date of its return.', ' 对于 K-1 利得，合伙人或可选择以合伙企业纳税年度最后一天或其申报截止日作为 180 天的起算日。');
    w('body').textContent = body;
    w('start').textContent = fmtShort(start); w('end').textContent = fmtShort(end);
    const pct = x => Math.max(0, Math.min(100, (x - start) / (end - start) * 100));
    w('fill').style.width = pct(today) + '%';
    w('today').style.left = pct(today) + '%'; w('today').hidden = !(today >= start && today <= end);
    w('todayLabel').textContent = t('TODAY', '今天');
    w('oz').style.left = pct(ozLocal) + '%'; w('oz').hidden = !(ozLocal > start && ozLocal <= end);
  }
  if (dateIn) {
    dateIn.value = iso(new Date(today.getTime() - 40 * DAY));
    dateIn.addEventListener('input', updateWindow);
    $$('[name="gtype"]').forEach(r => r.addEventListener('change', updateWindow));
  }

  /* ---------------- fit check quiz ---------------- */
  const quiz = $('[data-quiz]');
  const answers = {};
  let qStep = 0;
  const qSteps = quiz ? $$('.quiz-step', quiz) : [];
  function renderQuiz() {
    if (!quiz) return;
    const done = qStep >= qSteps.length;
    qSteps.forEach((s, i) => s.classList.toggle('is-active', i === qStep));
    $('[data-quiz-bar]', quiz).style.width = (Math.min(qStep, qSteps.length) / qSteps.length * 100) + '%';
    $('[data-quiz-count]', quiz).textContent = done ? t('Complete', '已完成') : t(`Question ${qStep + 1} of ${qSteps.length}`, `第 ${qStep + 1} 题，共 ${qSteps.length} 题`);
    $('[data-quiz-back]', quiz).hidden = qStep === 0 || done;
    $('[data-quiz-restart]', quiz).hidden = !done;
    const res = $('[data-quiz-result]', quiz); res.hidden = !done;
    $$('button[data-a]', quiz).forEach(b => b.classList.toggle('is-picked', answers[b.closest('[data-q]').dataset.q] === b.dataset.a));
    if (done) fillResult();
  }
  function fillResult() {
    const a = answers, pts = [];
    const daysToOZ = Math.max(0, Math.ceil((OZ_START - Date.now()) / DAY));
    let head, lead;
    if (a.source === 'none') {
      head = t('Opportunity zone benefits start with a capital gain.', '机会区优惠以资本利得为起点。');
      lead = t('Without a recognized capital gain there is nothing to defer. You can still follow the program and our projects as they develop.', '没有已确认的资本利得，就没有可递延的税款。您仍可持续关注计划进展与我们的项目。');
      pts.push(t('Read the OZ 2.0 guide to understand how the benefits work.', '阅读 OZ 2.0 指南，了解优惠如何运作。'));
    } else if (a.accredited === 'no') {
      head = t('Our offerings are expected to be limited to accredited investors.', '我们的项目预计仅面向合格投资者。');
      lead = t('Private opportunity zone funds are usually offered only to accredited investors. Some public funds and other structures may be open more widely; a financial advisor can help you compare them.', '私募机会区基金通常仅面向合格投资者。部分公开基金或其他结构可能门槛更低，财务顾问可以帮助您比较。');
    } else if (a.timing === 't4') {
      head = t('Your window may be closing. Confirm the recognition date now.', '您的窗口可能即将结束，请立即确认利得确认日。');
      lead = t('Gains recognized more than 150 days ago leave little time. Some gains start the clock later than the closing date, so check the exact date with your advisor.', '确认超过 150 天的利得所剩时间不多。部分利得的起算日晚于交易完成日，请与顾问核实准确日期。');
    } else if (a.timing === 't0') {
      head = t('Planning ahead is the strongest position.', '提前规划，是最有利的位置。');
      lead = t('Before a sale closes you can line up the timing so the gain lands in a window that reaches OZ 2.0, and review projects without deadline pressure.', '交易完成前，您可以安排时间，让利得窗口覆盖 OZ 2.0，并在没有截止压力的情况下评估项目。');
    } else {
      head = t('Your gain may be inside the decision window.', '您的利得可能正处于决策窗口内。');
      lead = daysToOZ > 0
        ? t(`OZ 2.0 takes effect in ${daysToOZ} days. If your 180 days reach past January 1, 2027, an investment made then may qualify for the enhanced rules.`, `距 OZ 2.0 生效还有 ${daysToOZ} 天。若您的 180 天窗口延伸至 2027 年 1 月 1 日之后，届时的投资可能适用增强规则。`)
        : t('OZ 2.0 is in effect, so an investment made within your 180 days may qualify for the enhanced rules.', 'OZ 2.0 已生效，在 180 天窗口内的投资可能适用增强规则。');
    }
    if (a.source === 'k1') pts.push(t('K-1 gains may allow a later 180-day start date, often the end of the partnership’s tax year.', 'K-1 利得的 180 天起算日可能较晚，通常为合伙企业纳税年度末。'));
    if (a.source === 're') pts.push(t('For real estate, only the capital gain portion is eligible; depreciation recapture taxed as ordinary income is not.', '对于房地产，只有资本利得部分符合条件；按普通收入课税的折旧回收部分不适用。'));
    if (a.source === 'biz') pts.push(t('Business sales often include installment payments or earn-outs, which can each start their own 180-day clock.', '企业出售常含分期付款或业绩对赌，每笔款项可能各自起算 180 天。'));
    if (a.source === 'stock') pts.push(t('Concentrated stock positions can be sold in tranches to spread gains across different windows.', '集中持仓可分批出售，让利得落在不同的窗口期。'));
    if (a.size === 's4') pts.push(t('Larger gains can be split across more than one fund or project for diversification.', '较大的利得可分散投入多个基金或项目。'));
    if (a.size === 's1') pts.push(t('Many private funds set minimum investments; ask about the minimum early.', '许多私募基金设有最低投资额，请尽早确认。'));
    if (a.size === 's0') pts.push(t('Once the gain amount is known, the size of the investment and the timing can be planned together.', '利得金额确定后，可同时规划投资规模与时间。'));
    if (a.accredited === 'maybe') pts.push(t('Accredited status is usually confirmed with documentation before investing. We can walk through how the definition applies.', '合格投资者身份通常需在投资前提供文件确认，我们可以协助梳理定义如何适用。'));
    pts.push(t('Deferred tax is not forgiven. Plan for the tax due at the five-year mark from other funds.', '递延税款并非免除，请提前规划第五年需用其他资金缴纳的税款。'));
    $('[data-r-head]', quiz).textContent = head;
    $('[data-r-lead]', quiz).textContent = lead;
    const ul = $('[data-r-points]', quiz); ul.innerHTML = '';
    pts.forEach(p => { const li = document.createElement('li'); li.textContent = p; ul.appendChild(li); });
  }
  if (quiz) {
    $$('button[data-a]', quiz).forEach(b => b.addEventListener('click', () => {
      const q = b.closest('[data-q]').dataset.q;
      answers[q] = b.dataset.a;
      qStep = q === 'source' && b.dataset.a === 'none' ? qSteps.length : qStep + 1;
      renderQuiz();
      const next = qStep < qSteps.length ? $('button[data-a]', qSteps[qStep]) : $('[data-r-head]', quiz);
      if (next) { next.setAttribute('tabindex', '-1'); next.focus({ preventScroll: true }); }
    }));
    $('[data-quiz-back]', quiz).addEventListener('click', () => { qStep = Math.max(0, qStep - 1); renderQuiz(); });
    $('[data-quiz-restart]', quiz).addEventListener('click', () => { Object.keys(answers).forEach(k => delete answers[k]); qStep = 0; renderQuiz(); });
  }

  /* ---------------- substantial improvement planner ---------------- */
  const P = k => $(`[data-p="${k}"]`), PR = k => $(`[data-pr="${k}"]`);
  const num = el => +String(el.value).replace(/[^\d.]/g, '') || 0;
  function updatePlanner() {
    if (!P('price')) return;
    const price = num(P('price')), land = +P('land').value / 100, budget = num(P('budget'));
    const rural = P('rural').checked;
    const basis = price * (1 - land);
    const need = basis * (rural ? .5 : 1);
    const acq = P('date').value ? parseDate(P('date').value) : today;
    const deadline = addMonths(acq, 30);
    const monthsLeft = Math.max(0, (deadline - Math.max(today, acq)) / (DAY * 30.44));
    $('[data-po="land"]').textContent = Math.round(land * 100) + '%';
    paintRange(P('land'));
    PR('basis').textContent = fmtUSD(basis);
    PR('need').textContent = fmtUSD(need);
    PR('deadline').textContent = fmtShort(deadline);
    PR('pace').textContent = fmtUSD(need / 30) + t('/mo', '/月');
    PR('budgetOut').textContent = fmtUSD(budget);
    const pass = budget > need;
    const gap = budget - need;
    const max = Math.max(budget, need) * 1.12 || 1;
    PR('fill').style.width = (budget / max * 100) + '%';
    PR('mark').style.left = (need / max * 100) + '%';
    PR('fill').classList.toggle('is-short', !pass);
    PR('margin').textContent = pass ? t(`Clears the test by ${fmtUSD(gap)}`, `超出门槛 ${fmtUSD(gap)}`) : t(`Short by ${fmtUSD(-gap + 1)}`, `尚差 ${fmtUSD(-gap + 1)}`);
    const st = PR('status');
    st.className = 'planner-status ' + (pass ? 'is-pass' : 'is-short');
    st.innerHTML = '';
    const b = document.createElement('b'); b.textContent = pass ? t('On track', '方案达标') : t('Below the threshold', '低于门槛');
    const s = document.createElement('span');
    s.textContent = pass
      ? t(`Planned improvements exceed the ${rural ? '50% ' : ''}building basis. ${monthsLeft < 30 && today > acq ? `About ${Math.round(monthsLeft)} months remain to complete the spend.` : 'Spending must be completed within 30 months of acquisition.'}`,
          `计划支出超过${rural ? ' 50% 的' : ''}建筑基础。${monthsLeft < 30 && today > acq ? `距截止约剩 ${Math.round(monthsLeft)} 个月。` : '须在收购后 30 个月内完成支出。'}`)
      : t('Increase the building budget, revisit the land allocation with your appraiser, or consider whether the property is original-use.', '可提高建筑改造预算、与评估师复核土地分摊，或确认该物业是否属于原始用途。');
    st.append(b, s);
  }
  if (P('price')) {
    P('date').value = iso(today);
    const fmtField = el => { const v = num(el); el.value = v ? v.toLocaleString('en-US') : ''; };
    ['price', 'budget'].forEach(k => {
      P(k).addEventListener('input', updatePlanner);
      P(k).addEventListener('blur', () => fmtField(P(k)));
    });
    ['land', 'date', 'rural'].forEach(k => P(k).addEventListener(k === 'rural' ? 'change' : 'input', updatePlanner));
  }

  /* ---------------- key dates: mark past / next ---------------- */
  const dateItems = $$('[data-dates] li');
  let nextMarked = false;
  dateItems.forEach(li => {
    const d = parseDate(li.dataset.date);
    if (d <= today) li.classList.add('is-past');
    else if (!nextMarked) { li.classList.add('is-next'); nextMarked = true; }
  });

  /* ---------------- glossary filter ---------------- */
  const gf = $('[data-glossary-filter]');
  if (gf) gf.addEventListener('input', () => {
    const q = gf.value.trim().toLowerCase(); let shown = 0;
    $$('[data-glossary] > div').forEach(d => { const hit = !q || d.textContent.toLowerCase().includes(q); d.hidden = !hit; if (hit) shown++; });
    $('[data-glossary-empty]').hidden = shown > 0;
  });

  /* ---------------- schematic tract map ---------------- */
  const g = $('.tracts');
  const hexes = [];
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  if (g) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const outline = [[236, 18], [292, 26], [304, 96], [292, 170], [276, 236], [254, 300], [226, 372], [196, 432], [150, 452], [116, 430], [128, 372], [156, 300], [178, 220], [196, 140], [212, 70]];
    const inside = (x, y) => { let c = false; for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) { const [xi, yi] = outline[i], [xj, yj] = outline[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
    const R = 11;
    for (let row = 0; row < 40; row++) for (let col = 0; col < 30; col++) {
      const cx = col * R * 1.732 + (row % 2) * R * .866, cy = row * R * 1.5;
      if (!inside(cx, cy)) continue;
      const pts = Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 3 * k + Math.PI / 6; return `${(cx + (R - 1.2) * Math.cos(a)).toFixed(1)},${(cy + (R - 1.2) * Math.sin(a)).toFixed(1)}`; }).join(' ');
      const p = document.createElementNS(svgNS, 'polygon'); p.setAttribute('points', pts); p.setAttribute('class', 't');
      g.appendChild(p); hexes.push({ p, cy });
    }
    [['North Bergen', 104], ['Union City', 178], ['Weehawken', 214], ['Jersey City', 330]].forEach(([name, y]) => {
      const tx = document.createElementNS(svgNS, 'text'); tx.setAttribute('x', 330); tx.setAttribute('y', y); tx.setAttribute('class', 'map-caption map-label'); tx.textContent = name.toUpperCase();
      const ln = document.createElementNS(svgNS, 'line'); ln.setAttribute('x1', 322); ln.setAttribute('x2', 286 - (y > 250 ? 40 : 0)); ln.setAttribute('y1', y - 3); ln.setAttribute('y2', y - 3); ln.setAttribute('class', 'map-leader');
      g.parentNode.append(ln, tx);
    });
  }
  function lightTracts() {
    hexes.forEach(({ p, cy }) => { const r = rnd(); if (r > .7) setTimeout(() => { p.classList.add('oz'); if (r > .93) p.classList.add('hot'); }, reduce ? 0 : 200 + cy * 4 + r * 400); });
  }

  /* ---------------- init + language ---------------- */
  const refresh = () => { updateCalc(); updateWindow(); updatePlanner(); renderQuiz(); tickCountdown(); };
  LS.onLang(refresh); refresh();
})();
