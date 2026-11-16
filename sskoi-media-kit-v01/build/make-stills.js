// Renders every still in the kit: each layout is a small HTML page drawn at its exact pixel size.
// Usage: node build/make-stills.js [filter]
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const D = require('./data.js');
const ROOT = path.resolve(__dirname, '..');
const TMP = path.join(__dirname, 'tmp');
const OUT = path.join(ROOT, 'out');
const V = 'v01_REVIEW';

const page = (cls, vars, body) => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../kit.css"></head>
<body><div class="canvas ${cls}" style="${vars || ''}">${body}</div></body></html>`;

const jobs = [];
const add = (dir, name, w, h, html) => jobs.push({ dir, name, w, h, html });

for (const c of D.COVERS) add('feed', `SSKOI_${c.id}_Cover_4x5_${V}`, 1080, 1350, page('cover', c.h ? `--h:${c.h}px` : '',
  `<img src="${c.photo}" style="object-position:${c.pos}"><div class="shade"></div>
   <div class="top"><span class="mast">SSKOI</span></div>
   <div class="bot"><h1><span>${c.l1}</span><em>${c.l2}</em></h1><div class="rule"></div><p class="mono">${c.meta}</p></div>`));

for (const p of D.PLATES) add('feed', `SSKOI_${p.id}_Detail-Plate_4x5_${V}`, 1080, 1350, page('plate', '',
  `<div class="head"><span class="mast">SSKOI</span><span class="mono">Detail</span></div>
   <div class="photo"><img src="${p.photo}" style="object-position:${p.pos}"></div>
   <div class="cap"><h2 style="${p.h ? `font-size:${p.h}px` : ''}">${p.name} <em>${p.em}</em></h2><p class="mono">${p.meta}</p></div>`));

for (const n of D.NOTES) add('feed', `SSKOI_${n.id}_Styling-Note_4x5_${V}`, 1080, 1350, page('note', '',
  `<div class="head"><span class="mast">SSKOI</span><span class="mono">Styling note</span></div>
   <div class="a"><img src="${n.a}" style="object-position:${n.pa}"></div>
   <div class="b"><img src="${n.b}" style="object-position:${n.pb}"></div>
   <div class="txt"><span class="mono">${n.kicker}</span><h2>${n.head}</h2><p class="body">${n.body}</p></div>`));

for (const [key, f] of Object.entries(D.FAMILIES)) {
  const w = Math.floor(980 / f.cols);
  const cells = f.colours.map(c => `<div class="cell"><div class="im"><img src="${D.trim(key, c)}"></div><span>${c}</span></div>`).join('');
  add('feed', `SSKOI_${f.short.replace(/ /g, '-')}_All-Colours_4x5_${V}`, 1080, 1350, page('colours', `--w:${w}px;--ch:${f.ch}px`,
    `<div class="head"><div class="row"><span class="mast">SSKOI</span><span class="mono">${f.set}</span></div>
     <h1>${f.label}<em>in ${f.n} colours.</em></h1></div>
     <div class="grid">${cells}</div>
     <div class="foot"><span class="mono">Product photographs</span><span class="mono">Faux flowers for real homes</span></div>`));
}

for (const s of D.STATEMENTS) add('feed', `SSKOI_${s.id}_Statement_4x5_${V}`, 1080, 1350, page('statement',
  `--bg:${s.bg};--fg:${s.fg};--em:${s.em};--cx:${s.cx}px;--cy:${s.cy}px;--cw:${s.cw}px;--ty:${s.ty}px;${s.h ? `--h:${s.h}px;` : ''}`,
  `<div class="top"><span class="mast">SSKOI</span><span class="mono">${s.tag}</span></div>
   <h1><span>${s.l1}</span><em>${s.l2}</em></h1>
   <img class="cut" src="${s.cut}">
   <div class="foot"><p>${s.foot}</p></div>`));

for (const s of D.STORIES) add('story', `SSKOI_${s.id}_Story_9x16_${V}`, 1080, 1920, page('story', s.h ? `--h:${s.h}px` : '',
  `<div class="top"><span class="mast">SSKOI</span></div>
   <div class="photo"><img src="${s.photo}" style="object-position:${s.pos}"></div>
   <div class="bot"><h1><span>${s.l1}</span><em>${s.l2}</em></h1><div class="rule"></div><p class="mono">${s.meta}</p></div>`));

(async () => {
  const filter = process.argv[2];
  fs.mkdirSync(TMP, { recursive: true });
  const browser = await chromium.launch();
  for (const j of jobs) {
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
    await pg.screenshot({ path: path.join(OUT, j.dir, j.name + '.jpg'), type: 'jpeg', quality: 93 });
    await ctx.close();
    console.log('ok', j.dir + '/' + j.name);
  }
  await browser.close();
})();
