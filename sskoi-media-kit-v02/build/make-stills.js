// Renders the designed stills of media kit v02. Each layout is a small HTML page drawn at its exact pixel size.
// Usage: node build/make-stills.js [filter]        Writes out/feed, out/story, out/wide and build/manifest-stills.json
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const TMP = path.join(__dirname, 'tmp');
const OUT = path.join(ROOT, 'out');
const V = 'v02_REVIEW';
const CAT = JSON.parse(fs.readFileSync(path.join(__dirname, 'catalog.json'), 'utf8'));
const F = CAT.families;
const CUT = path.resolve(ROOT, '../sskoi-v08/assets/p');

const url = p => 'file://' + encodeURI(p);
const S = (k, c, shot) => { const p = F[k].colours[c].shots[shot]; if (!p) throw new Error(`no ${shot} for ${k} ${c}`); return url(p); };
const sc = s => s[0] + s.slice(1).toLowerCase();
const tok = s => s.replace(/ /g, '-');
const fit = (h0, width, ...lines) => Math.min(h0, Math.floor(width / (0.5 * (Math.max(...lines.map(l => l.replace(/<[^>]+>/g, '').length)) + 0.6))));
const list = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
const page = (cls, vars, body) => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../kit.css"></head>
<body><div class="canvas ${cls}" style="${vars || ''}">${body}</div></body></html>`;

const jobs = [];
const add = (dir, name, w, h, html, meta) => jobs.push({ dir, name: `SSKOI_${name}_${V}`, w, h, html, meta });
const base = (k, c) => `${F[k].token}_${tok(c)}_${F[k].set}`;
const info = (k, cs, layout, shot) => ({ layout, family: F[k].token, set: F[k].set, colour: [].concat(cs).join(' / '),
  asin: [].concat(cs).map(c => F[k].colours[c].asin).join(' / '), asin_check: [...new Set([].concat(cs).map(c => F[k].colours[c].asin_check))].join(' / '), shot });

// title lines per family
// returns [html of the upright lines, italic line, plain lines for sizing]; colours such as "White With Pink Tip" take two lines
const title = (k, c) => {
  if (k === 'austin66') return [`<span>${sc(c)} roses</span>`, 'and eucalyptus.', [`${sc(c)} roses`, 'and eucalyptus.x']];
  const l2 = { tulip: 'tulips.', classic: 'roses.', ranunculus: 'ranunculus.', austin6: 'Austin roses.', gift: 'gift roses.' }[k];
  const parts = c.includes(' With ') ? [c.split(' With ')[0] + ' with', c.split(' With ')[1].toLowerCase()] : [sc(c)];
  return [parts.map(x => `<span>${x}</span>`).join(''), l2, [...parts, l2 + 'x']];
};
const H1 = (l1, l2) => `<h1>${l1}<em>${l2}</em></h1>`;
const single = { tulip: 'tulip', classic: 'rose', ranunculus: 'ranunculus', austin6: 'Austin rose', austin66: 'Austin rose', gift: 'rose' };
const GIFT_X = { 'Coral': 47, 'Red': 52, 'Burgundy': 50, 'Mauve Pink': 50, 'Purple': 50, 'White': 52, 'White With Pink Tip': 50 };
const POS = {
  tulip: { vase: '50% 50%', still: '45% 50%', detail: '50% 50%', stem: '30% 40%' },
  classic: { vase: '47% 50%', still: '58% 50%', bud: '78% 50%', detail: '40% 50%' },
  ranunculus: { vase: '47% 50%', still: '62% 50%', bud: '72% 50%', detail: '42% 50%' },
  austin6: { vase: '72% 50%', flatlay: '62% 50%', room: '82% 50%', stem: '76% 50%', macro: '22% 50%' },
  austin66: { vase: '55% 50%', arch: '56% 50%', macro: '64% 50%', flatlay: '50% 50%' },
};
const pos = (k, c, shot) => k === 'gift' ? `${GIFT_X[c]}% 50%` : POS[k][shot];
const LABEL = { vase: 'Vase', still: 'Still-Life', detail: 'Petal-Detail', stem: 'Single-Stem', bud: 'Flower-and-Bud', macro: 'Petal-Detail', flatlay: 'Flat-Lay', room: 'Room', arch: 'Arch', styling: 'Vase-Styling' };

// ---------- 1. covers (4:5): every colour of the square-format families ----------
const COVER_ORDER = { tulip: ['still', 'vase', 'detail'], classic: ['vase', 'still', 'bud'], ranunculus: ['vase', 'still', 'bud'], gift: ['styling'] };
for (const k of Object.keys(COVER_ORDER)) Object.keys(F[k].colours).forEach((c, i) => {
  const shot = COVER_ORDER[k][i % COVER_ORDER[k].length], [l1, l2, ln] = title(k, c);
  add('feed', `${base(k, c)}_Cover-${LABEL[shot]}_4x5`, 1080, 1350, page('cover', `--h:${fit(ln.length > 2 ? 132 : 150, 952, ...ln)}px`,
    `<img src="${S(k, c, shot)}" style="object-position:${pos(k, c, shot)}"><div class="shade"></div>
     <div class="top"><span class="mast">SSKOI</span></div>
     <div class="bot">${H1(l1, l2)}<div class="rule"></div><p class="mono">${F[k].meta}</p></div>`), info(k, c, 'Cover', LABEL[shot]));
});

// ---------- 2. mounts (4:5): every colour of the two Austin sets (landscape plates) ----------
const MOUNT_ORDER = { austin6: ['vase', 'flatlay', 'room', 'stem', 'macro'], austin66: ['vase', 'arch', 'macro'] };
for (const k of Object.keys(MOUNT_ORDER)) Object.keys(F[k].colours).forEach((c, i) => {
  const shot = MOUNT_ORDER[k][i % MOUNT_ORDER[k].length], [l1, l2, ln] = title(k, c);
  add('feed', `${base(k, c)}_Cover-${LABEL[shot]}_4x5`, 1080, 1350, page('mount', `--h:${fit(128, 940, ...ln)}px`,
    `<div class="head"><span class="mast">SSKOI</span><span class="mono">${k === 'austin66' ? 'Roses and eucalyptus' : 'Austin roses'}</span></div>
     <div class="photo"><img src="${S(k, c, shot)}" style="object-position:${pos(k, c, shot)}"></div>
     <div class="bot">${H1(l1, l2)}<div class="rule"></div><p class="mono">${F[k].meta}</p></div>`), info(k, c, 'Cover', LABEL[shot]));
});

// ---------- 3. stories (9:16): three colours per family ----------
const STORIES = [
  ['tulip', 'Peach', 'vase'], ['tulip', 'Red', 'stem'], ['tulip', 'Dark Purple', 'vase'],
  ['classic', 'Mauve', 'vase'], ['classic', 'Burgundy', 'still'], ['classic', 'White With Pink Tip', 'bud'],
  ['ranunculus', 'Baby Pink', 'vase'], ['ranunculus', 'Hot Pink', 'bud'], ['ranunculus', 'Orange', 'still'],
  ['austin6', 'Red', 'stem'], ['austin6', 'Light Peach', 'macro'], ['austin6', 'White', 'vase'],
  ['austin66', 'Champagne', 'arch'], ['austin66', 'Hot Pink', 'macro'], ['austin66', 'White', 'vase'],
  ['gift', 'Red', 'styling'], ['gift', 'Purple', 'styling'], ['gift', 'White With Pink Tip', 'styling'],
];
for (const [k, c, shot] of STORIES) {
  const [l1, l2, ln] = title(k, c);
  add('story', `${base(k, c)}_Story-${LABEL[shot]}_9x16`, 1080, 1920, page('story', `--h:${fit(ln.length > 2 ? 90 : 112, 940, ...ln)}px`,
    `<div class="top"><span class="mast">SSKOI</span></div>
     <div class="photo"><img src="${S(k, c, shot)}" style="object-position:${pos(k, c, shot)}"></div>
     <div class="bot">${H1(l1, l2)}<div class="rule"></div><p class="mono">${F[k].meta}</p></div>`), info(k, c, 'Story', LABEL[shot]));
}

// ---------- 4. detail plates (4:5) ----------
const PLATE_META = { tulip: 'Finely ribbed petals', classic: 'One open rose and two buds on every stem', ranunculus: 'Layered petals, flocked leaves',
  austin6: 'Layered petals around pale stamens', austin66: 'Shown with eucalyptus stems' };
const PLATES = [['tulip', 'Orange', 'detail'], ['tulip', 'White With Blue Tip', 'detail'], ['classic', 'Burgundy', 'detail'], ['classic', 'White With Pink Tip', 'detail'],
  ['ranunculus', 'Hot Pink', 'detail'], ['ranunculus', 'Purple', 'bud'], ['austin6', 'Red', 'macro'], ['austin6', 'Light Peach', 'macro'],
  ['austin66', 'Champagne', 'macro'], ['austin66', 'Purple', 'macro']];
for (const [k, c, shot] of PLATES) {
  const two = c.includes(' With '), name = two ? `${c.split(' With ')[0]} with<br>${c.split(' With ')[1].toLowerCase()}` : sc(c), em = single[k];
  add('feed', `${base(k, c)}_Detail-Plate_4x5`, 1080, 1350, page('plate', '',
    `<div class="head"><span class="mast">SSKOI</span><span class="mono">Detail</span></div>
     <div class="photo"><img src="${S(k, c, shot)}" style="object-position:${pos(k, c, shot)}"></div>
     <div class="cap"><h2 style="font-size:${two ? 62 : fit(84, 560, name, em)}px">${name}<br><em>${em}</em></h2><p class="mono">${PLATE_META[k]}</p></div>`), info(k, c, 'Detail-Plate', LABEL[shot]));
}

// ---------- 5. colour cards (4:5 and 16:9) ----------
const CARD = { tulip: ['Tulips', 'in ten colours.', 'detail', '50% 50%'], classic: ['Classic roses', 'in six colours.', 'detail', '36% 50%'],
  ranunculus: ['Ranunculus', 'in seven colours.', 'detail', '37% 55%'], austin6: ['Austin roses', 'in seven colours.', 'macro', '25% 50%'],
  austin66: ['With eucalyptus', 'in seven colours.', 'macro', '66% 50%'], gift: ['The gift box', 'in seven colours.', 'styling', null] };
const GIFT_SL = { 'Coral': '48% 50%', 'Red': '60% 50%', 'Burgundy': '40% 50%', 'Mauve Pink': '42% 50%', 'Purple': '36% 50%', 'White': '50% 50%', 'White With Pink Tip': '46% 50%' };
for (const [k, [a, b, shot, p]] of Object.entries(CARD)) {
  const cs = Object.keys(F[k].colours), num = i => String(i + 1).padStart(2, '0');
  const slices = cs.map((c, i) => `<div class="sl"><div class="im"><img src="${S(k, c, shot)}" style="object-position:${p || GIFT_SL[c]}"></div><b>${num(i)}</b></div>`).join('');
  const legend = cs.map((c, i) => `<span><i>${num(i)}</i>${c}</span>`).join('');
  const head = `<div class="head"><div class="row"><span class="mast">SSKOI</span><span class="mono">Colour card</span></div><h1>${a}<em>${b}</em></h1></div>`;
  add('feed', `${F[k].token}_All-Colours_${F[k].set}_Colour-Card_4x5`, 1080, 1350, page('card', `--gap:${cs.length > 7 ? 8 : 10}px`,
    `${head}<div class="slices">${slices}</div><div class="legend">${legend}</div>`), info(k, cs, 'Colour-Card', LABEL[shot]));
  add('wide', `${F[k].token}_All-Colours_${F[k].set}_Colour-Card_16x9`, 1920, 1080, page('card w', `--gap:${cs.length > 7 ? 10 : 12}px`,
    `${head}<div class="slices">${slices}</div><div class="legend">${legend}</div>`), info(k, cs, 'Colour-Card', LABEL[shot]));
}

// ---------- 6. triptychs (16:9) ----------
const TRIPS = [
  ['tulip', 'vase', ['Peach', 'Pink', 'Hot Pink'], 'Tulips'], ['tulip', 'detail', ['Yellow', 'Orange', 'Red'], 'Tulips'],
  ['classic', 'vase', ['Mauve', 'Burgundy', 'Purple'], 'Classic roses'], ['classic', 'bud', ['Coral', 'White With Pink Tip', 'White'], 'Classic roses'],
  ['ranunculus', 'vase', ['White', 'Baby Pink', 'Pink'], 'Ranunculus'], ['ranunculus', 'still', ['Hot Pink', 'Orange', 'Purple'], 'Ranunculus'],
  ['austin6', 'stem', ['Baby Pink', 'Pink', 'Red'], 'Austin roses'], ['austin6', 'macro', ['White', 'Light Peach', 'Purple'], 'Austin roses'],
  ['austin66', 'macro', ['Baby Pink', 'Hot Pink', 'Red'], 'Roses and eucalyptus'],
  ['gift', 'styling', ['Coral', 'Mauve Pink', 'White With Pink Tip'], 'Gift roses'], ['gift', 'styling', ['Red', 'Burgundy', 'Purple'], 'Gift roses'],
];
for (const [k, shot, cs, label] of TRIPS) {
  const cells = cs.map(c => `<div class="cell"><div class="im"><img src="${S(k, c, shot)}" style="object-position:${pos(k, c, shot)}"></div><span>${c}</span></div>`).join('');
  add('wide', `${F[k].token}_${cs.map(tok).join('+')}_${F[k].set}_Triptych-${LABEL[shot]}_16x9`, 1920, 1080, page('trip', '',
    `<div class="head"><span class="mast">SSKOI</span><span class="mono">${F[k].meta}</span></div><div class="row">${cells}</div>
     <div class="foot"><h2>${label} <em>in ${list(cs.map(c => c.toLowerCase()))}.</em></h2></div>`), info(k, cs, 'Triptych', LABEL[shot]));
}

// ---------- 7. wide covers (16:9) ----------
const WIDES = [
  ['tulip', 'Yellow', 'still', 'dark', '50% 22%'], ['tulip', 'Pink', 'stem', 'light right', '50% 16%', 640],
  ['classic', 'Burgundy', 'bud', 'dark', '50% 58%'], ['classic', 'Mauve', 'still', 'dark', '50% 62%'],
  ['ranunculus', 'Hot Pink', 'still', 'dark', '50% 58%'], ['ranunculus', 'Orange', 'bud', 'dark', '50% 50%'],
  ['austin6', 'Red', 'vase', 'light', '50% 0%'], ['austin6', 'Light Peach', 'room', 'light', '50% 0%'], ['austin6', 'White', 'flatlay', 'dark', '50% 60%'],
  ['austin66', 'Champagne', 'vase', 'dark', '50% 35%'], ['austin66', 'Purple', 'macro', 'dark', '50% 50%'],
  ['gift', 'Red', 'styling', 'dark', '50% 30%'], ['gift', 'Burgundy', 'styling', 'dark', '50% 24%'],
];
for (const [k, c, shot, tone, p, tw] of WIDES) {
  const [l1, l2, ln] = title(k, c), light = tone.startsWith('light');
  const h = light ? fit(140, 800, ...ln) : fit(150, 1200, ...ln);
  add('wide', `${base(k, c)}_Wide-Cover-${LABEL[shot]}_16x9`, 1920, 1080, page('wide ' + (light ? tone : ''), `--h:${h}px;${tw ? `--tw:${tw}px` : ''}`,
    `<img class="bg" src="${S(k, c, shot)}" style="object-position:${p}"><div class="shade"></div>
     <div class="top"><span class="mast">SSKOI</span></div>
     <div class="bot">${H1(l1, l2)}${light ? '<div class="rule"></div>' : ''}<p class="mono">${F[k].meta}</p></div>`), info(k, c, 'Wide-Cover', LABEL[shot]));
}

// ---------- 8. statements (4:5) with cut-out bouquets ----------
const cutout = (k, c) => url(path.join(CUT, `${k}-${F[k === 'austin' ? 'austin6' : k].colours[c].slug}.webp`));
const STATEMENTS = [
  { k: 'tulip', fam: 'tulip', c: 'Pink', bg: 'var(--paper-2)', em: 'var(--ink)', l1: 'Tulips,', l2: 'ten ways.', cx: 190, cy: 520, cw: 780, ty: 170, h: 176, foot: 'Faux tulips in ten colours, from white to dark purple.' },
  { k: 'ranunculus', fam: 'ranunculus', c: 'Orange', bg: 'var(--paper)', em: 'var(--coral)', l1: 'Four stems.', l2: 'Eight flowers.', cx: 120, cy: 400, cw: 920, ty: 170, h: 150, foot: 'Every ranunculus stem carries two flowers and one bud.' },
  { k: 'austin', fam: 'austin6', c: 'Baby Pink', bg: 'var(--paper-3)', em: 'var(--ink)', l1: 'One rose,', l2: 'seven colours.', cx: 250, cy: 330, cw: 960, ty: 170, h: 150, foot: 'Austin roses come six stems to a set, in seven colours.' },
];
for (const s of STATEMENTS) add('feed', `${base(s.fam, s.c)}_Statement_4x5`, 1080, 1350, page('statement',
  `--bg:${s.bg};--fg:var(--ink);--em:${s.em};--cx:${s.cx}px;--cy:${s.cy}px;--cw:${s.cw}px;--ty:${s.ty}px;--h:${s.h}px;`,
  `<div class="top"><span class="mast">SSKOI</span><span class="mono">${F[s.fam].label} · ${s.c}</span></div>
   <h1><span>${s.l1}</span><em>${s.l2}</em></h1><img class="cut" src="${cutout(s.k, s.c)}"><div class="foot"><p>${s.foot}</p></div>`), info(s.fam, s.c, 'Statement', 'Cut-out of listing main image'));

// ---------- 9. rooms: covers, stories and series banners from the two room sets ----------
const ROOM = { 'Dinner-Table': ['The dinner', 'table.', '34% 36%', '36%'], 'Kitchen-Ledge': ['The kitchen', 'ledge.', '70% 42%', '68%'], 'Reading-Table': ['The reading', 'table.', '62% 45%', '64%'],
  'Mantel': ['On the', 'mantel.', '36% 36%', '34%'], 'Entry-Console': ['The entry', 'console.', '30% 42%', '24%'], 'Wood-Slat-Wall': ['By the', 'armchair.', '50% 62%', '50%'] };
const short = { austin6: 'Austin roses', tulip: 'Tulips', classic: 'Classic roses', ranunculus: 'Ranunculus', gift: 'Rose gift box' };
const sinfo = (s, layout) => ({ layout, family: F[s.family].token, set: s.set, colour: s.colour, asin: s.asin, asin_check: '文件名标注', shot: (s.series === 'wabi' ? 'Wabi-Sabi ' : 'Wood-Slat ') + s.place });
for (const s of CAT.scenes) {
  const [l1, l2, p] = ROOM[s.place], series = s.series === 'wabi' ? 'Wabi-Sabi' : 'Wood-Slat', place = s.series === 'wabi' ? s.place : 'Side-Table';
  const b = `${F[s.family].token}_${tok(s.colour)}_${s.set}`, meta = `${short[s.family]} · ${s.colour} · ${s.set.replace('-', ' ').toLowerCase()}`;
  if (s.series === 'wabi') add('feed', `${b}_Room-Cover-${place}_4x5`, 1080, 1350, page('cover', `--h:${fit(150, 952, l1, l2 + 'x')}px`,
    `<img src="${url(s.file)}" style="object-position:${p}"><div class="shade"></div><div class="top"><span class="mast">SSKOI</span></div>
     <div class="bot">${H1(l1, l2)}<div class="rule"></div><p class="mono">${meta}</p></div>`), sinfo(s, 'Room-Cover'));
  const [t1, t2] = s.series === 'wabi' ? [l1, l2] : [sc(s.colour), title(s.family, s.colour)[1]];
  add('story', `${b}_Room-Story-${series}-${place}_9x16`, 1080, 1920, page('sstory', `--h:${fit(118, 940, t1, t2 + 'x')}px`,
    `<img class="bg" src="${url(s.file)}"><div class="shade"></div><div class="top"><span class="mast">SSKOI</span></div>
     <div class="bot"><h1><span>${t1}</span><em>${t2}</em></h1><div class="rule"></div><p class="mono">${meta}</p></div>`), sinfo(s, 'Room-Story'));
}
for (const [series, name, h2, kicker] of [['wabi', 'Wabi-Sabi-Rooms', 'Five rooms, <em>five flowers.</em>', 'Rooms'], ['slat', 'Wood-Slat-Side-Table', 'One corner, <em>five flowers.</em>', 'One corner']]) {
  const ss = CAT.scenes.filter(s => s.series === series);
  const cells = ss.map(s => `<div class="cell"><div class="im"><img src="${url(s.file)}" style="object-position:${ROOM[s.place][3]} 50%"></div><span>${short[s.family]}<br>${s.colour}</span></div>`).join('');
  add('wide', `All-Flowers_Five-Colours_${name}_Series_16x9`, 1920, 1080, page('trip', '--gap:20px',
    `<div class="head"><span class="mast">SSKOI</span><span class="mono">${kicker}</span></div><div class="row">${cells}</div><div class="foot"><h2>${h2}</h2></div>`),
    { layout: 'Series', family: 'All', set: 'Mixed', colour: ss.map(s => s.colour).join(' / '), asin: ss.map(s => s.asin).join(' / '), asin_check: '文件名标注', shot: series === 'wabi' ? 'Wabi-Sabi rooms' : 'Wood-Slat side table' });
}

(async () => {
  const filter = process.argv[2];
  fs.mkdirSync(TMP, { recursive: true });
  const browser = await chromium.launch();
  const rows = [];
  for (const j of jobs) {
    const ratio = j.name.match(/_(\d+x\d+)_v02/)[1];
    rows.push({ file: `out/${j.dir}/${j.name}.jpg`, type: { feed: 'Feed', story: 'Story', wide: 'Wide' }[j.dir], ratio, size: `${j.w}x${j.h}`, ...j.meta });
    if (filter && !j.name.includes(filter)) continue;
    fs.mkdirSync(path.join(OUT, j.dir), { recursive: true });
    const file = path.join(TMP, j.name + '.html');
    fs.writeFileSync(file, j.html);
    const ctx = await browser.newContext({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 1 });
    const pg = await ctx.newPage();
    await pg.goto('file://' + file);
    await pg.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
    const bad = await pg.evaluate(() => [...document.images].filter(i => !i.naturalWidth).map(i => i.getAttribute('src')));
    if (bad.length) console.log('MISSING', j.name, bad);
    const fonts = await pg.evaluate(() => document.fonts.check('400 40px "Bodoni Moda"') && document.fonts.check('400 20px "DM Mono"'));
    if (!fonts) console.log('FONT FALLBACK', j.name);
    // text that runs past the canvas edge
    const over = await pg.evaluate(() => [...document.querySelectorAll('h1,h2,.mono,.legend')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth - 20 || r.bottom > innerHeight - 10 || e.scrollWidth > e.clientWidth + 2; }).map(e => e.tagName + ':' + e.textContent.slice(0, 30)));
    if (over.length) console.log('OVERFLOW', j.name, over);
    await pg.screenshot({ path: path.join(OUT, j.dir, j.name + '.jpg'), type: 'jpeg', quality: 91 });
    await ctx.close();
  }
  await browser.close();
  if (!filter) fs.writeFileSync(path.join(__dirname, 'manifest-stills.json'), JSON.stringify(rows, null, 1));
  console.log(jobs.length, 'jobs');
})();
