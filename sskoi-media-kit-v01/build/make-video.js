// Renders the kit's videos frame by frame: each video is an HTML page with renderAt(seconds),
// screenshotted once per frame and encoded to H.264 with ffmpeg. Motion comes from still photographs.
// Usage: node build/make-video.js [name-filter]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const D = require('./data.js');
const ROOT = path.resolve(__dirname, '..');
const TMP = path.join(__dirname, 'tmp');
const OUT = path.join(ROOT, 'out', 'video');
const V = 'v01_REVIEW';
const S = D.SRC;

const CSS = `
.reel{background:var(--ink)}
.reel img.shot{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:transform,opacity}
.reel .shade{position:absolute;inset:0;z-index:20;background:linear-gradient(180deg,rgba(29,20,24,.42) 0,rgba(29,20,24,0) 24%),linear-gradient(0deg,rgba(29,20,24,.68) 0,rgba(29,20,24,.42) 30%,rgba(29,20,24,0) 58%)}
.reel .mastwrap{position:absolute;z-index:21;inset:232px 0 auto;text-align:center;color:var(--paper)}
.reel .line{position:absolute;z-index:22;left:64px;right:64px;bottom:480px;color:var(--paper);font:400 168px/.86 var(--display);letter-spacing:-.035em;opacity:0;text-shadow:0 2px 28px rgba(29,20,24,.38)}
.reel .line em{color:var(--blush)}
.reel .sub{position:absolute;z-index:22;left:64px;right:64px;bottom:400px;color:var(--paper);opacity:0;text-shadow:0 1px 14px rgba(29,20,24,.5)}
.reel .endcard{position:absolute;z-index:30;inset:0;background:var(--ink);color:var(--paper);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px;opacity:0}
.reel .endcard .mast{font-size:118px}
.reel .endcard .mono{font-size:25px;text-align:center;line-height:2}
.reel .endcard i{display:block;width:120px;height:1px;background:var(--blush)}
.wide .shade,.wide .mastwrap{display:none}

.col{background:var(--paper)}
.col .mastwrap{position:absolute;inset:232px 0 auto;text-align:center}
.col .kick{position:absolute;inset:312px 0 auto;text-align:center;opacity:.72}
.col .word{position:absolute;left:-200px;right:-200px;top:430px;text-align:center;font:italic 400 320px/1 var(--display);letter-spacing:-.04em;color:var(--paper-3);white-space:nowrap}
.col img.b{position:absolute;left:70px;top:390px;width:940px;height:940px;object-fit:contain;opacity:0;will-change:transform,opacity}
.col .name{position:absolute;inset:1338px 64px auto;text-align:center;font:400 96px/.95 var(--display);letter-spacing:-.03em}
.col .count{position:absolute;inset:1470px 0 auto;text-align:center}
.col .bar{position:absolute;left:64px;right:64px;top:1536px;height:2px;background:var(--paper-3)}
.col .bar b{display:block;height:100%;background:var(--ink);width:0}
.col .intro,.col .outro{position:absolute;z-index:10;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:40px}
.col .intro{background:var(--paper)}
.col .intro h1{font:400 150px/.88 var(--display);letter-spacing:-.035em}
.col .outro{background:var(--ink);color:var(--paper);opacity:0}
.col .outro .mast{font-size:118px}
.col .outro .mono{font-size:25px;line-height:2}
.col .outro i{display:block;width:120px;height:1px;background:var(--blush)}
`;

const LIB = `
const sm=x=>x<=0?0:x>=1?1:x*x*(3-2*x), lerp=(a,b,u)=>a+(b-a)*u, cl=x=>x<0?0:x>1?1:x;
`;

function reel(spec) {
  const shots = spec.shots.map((s, i) => `<img class="shot" id="s${i}" src="${s.src}">`).join('');
  const lines = (spec.lines || []).map((l, i) => `<div class="${l.cls || 'line'}" id="l${i}">${l.html}</div>`).join('');
  const end = spec.end ? `<div class="endcard" id="end"><span class="mast">SSKOI</span><i></i><p class="mono">${spec.end.html}</p></div>` : '';
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../kit.css"><style>${CSS}</style></head>
<body><div class="canvas reel ${spec.cls || ''}">${shots}<div class="shade"></div><div class="mastwrap"><span class="mast">SSKOI</span></div>${lines}${end}</div>
<script>${LIB}
const SP=${JSON.stringify(spec)};const F=SP.fade;
window.renderAt=t=>{
  SP.shots.forEach((s,i)=>{const e=document.getElementById('s'+i);let tt=t;
    if(SP.loop){tt=((t-s.t0)%SP.dur+SP.dur)%SP.dur+s.t0}
    const len=s.t1-s.t0,u=cl((tt-s.t0)/len);
    let op=(i===0&&!SP.loop)?1:sm((tt-s.t0)/F);
    if(tt>s.t1)op=0;
    if(SP.loop){op=Math.min(sm((tt-s.t0)/F),1)*(tt<=s.t1?1:0)}
    e.style.opacity=op;e.style.zIndex=SP.loop?Math.round(((tt-s.t0)<F?2:1)):i;
    e.style.objectPosition=lerp(s.p0[0],s.p1[0],u)+'% '+lerp(s.p0[1],s.p1[1],u)+'%';
    e.style.transform='scale('+lerp(s.s0,s.s1,u)+')';});
  (SP.lines||[]).forEach((l,i)=>{const e=document.getElementById('l'+i);const a=sm((t-l.t0)/.55),b=1-sm((t-(l.t1-.4))/.4);
    e.style.opacity=Math.min(a,b);e.style.transform='translateY('+(1-a)*26+'px)';});
  if(SP.end){document.getElementById('end').style.opacity=sm((t-SP.end.t0)/.7)}
};
</script></body></html>`;
}

function colours() {
  const fams = [['austin', 'Roses', 'Austin roses · 6 stems'], ['tulip', 'Tulips', 'Tulips · 15 stems'], ['classic', 'Roses', 'Classic roses · 6 stems'],
    ['ranunculus', 'Ranunculus', 'Flocked ranunculus · 4 stems'], ['gift', 'Gift box', 'Rose gift box · 8 stems']];
  const items = [];
  fams.forEach(([k, word, kick]) => D.FAMILIES[k].colours.forEach((c, i, arr) => items.push({ src: D.cut(k, c, 'p'), name: c, word, kick, i: i + 1, n: arr.length })));
  const STEP = 0.44, INTRO = 1.5, OUTRO = 2.2;
  const dur = INTRO + items.length * STEP + OUTRO;
  const imgs = items.map((it, i) => `<img class="b" id="b${i}" src="${it.src}">`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../kit.css"><style>${CSS}</style></head>
<body><div class="canvas col"><div class="mastwrap"><span class="mast">SSKOI</span></div><p class="mono kick" id="kick"></p>
<div class="word" id="word"></div>${imgs}<div class="name" id="name"></div><p class="mono count" id="count"></p><div class="bar"><b id="bar"></b></div>
<div class="intro" id="intro"><span class="mast">SSKOI</span><h1>Thirty-seven<br><em>colours.</em></h1><p class="mono">Five faux flower sets</p></div>
<div class="outro" id="outro"><span class="mast">SSKOI</span><i></i><p class="mono">Faux flowers for real homes<br>Find SSKOI on Amazon</p></div></div>
<script>${LIB}
const IT=${JSON.stringify(items)},STEP=${STEP},INTRO=${INTRO},N=IT.length;
const pad=n=>String(n).padStart(2,'0');
window.renderAt=t=>{
  document.getElementById('intro').style.opacity=1-sm((t-(INTRO-.45))/.45);
  const tt=t-INTRO,k=Math.max(0,Math.min(N-1,Math.floor(tt/STEP))),u=cl((tt-k*STEP)/STEP);
  IT.forEach((it,i)=>{const e=document.getElementById('b'+i);
    if(i===k){e.style.opacity=sm(u/.22);e.style.transform='scale('+lerp(1.035,1,sm(u/.5))+')';e.style.zIndex=2}
    else if(i===k-1){e.style.opacity=1-sm(u/.22);e.style.transform='scale(1)';e.style.zIndex=1}
    else{e.style.opacity=0}});
  const it=IT[k];
  const wd=document.getElementById('word');wd.textContent=it.word;wd.style.fontSize=Math.min(320,1900/it.word.length)+'px';document.getElementById('kick').textContent=it.kick;
  document.getElementById('name').textContent=it.name;document.getElementById('count').textContent=pad(it.i)+' / '+pad(it.n);
  document.getElementById('bar').style.width=(cl(tt/(N*STEP))*100)+'%';
  document.getElementById('outro').style.opacity=sm((t-(INTRO+N*STEP))/.6);
};
</script></body></html>`;
  return { html, dur };
}

const flower = (id, fam, a, b, c, l1, l2, meta) => ({
  name: `SSKOI_${id}_Reel_9x16_${V}`, w: 1080, h: 1920, fps: 30, dur: 9, fade: .7,
  shots: [
    { src: S + a.src, t0: 0, t1: 3.9, p0: a.p0, p1: a.p1, s0: 1.0, s1: 1.07 },
    { src: S + b.src, t0: 3.2, t1: 6.7, p0: b.p0, p1: b.p1, s0: 1.08, s1: 1.0 },
    { src: S + c.src, t0: 6.0, t1: 9.1, p0: c.p0, p1: c.p1, s0: 1.0, s1: 1.06 },
  ],
  lines: [
    { t0: .5, t1: 8.6, html: `${l1}<br><em>${l2}</em>` },
    { t0: 1.3, t1: 8.6, cls: 'sub mono', html: meta },
  ],
});

const VIDEOS = [
  { name: `SSKOI_Brand_In-Bloom_Reel_9x16_${V}`, w: 1080, h: 1920, fps: 30, dur: 15, fade: .7,
    shots: [
      { src: S + 'austin-detail.jpg', t0: 0, t1: 3.6, p0: [50, 50], p1: [50, 50], s0: 1.12, s1: 1.0 },
      { src: S + 'tulip-vase.jpg', t0: 2.9, t1: 6.5, p0: [46, 50], p1: [54, 50], s0: 1.0, s1: 1.06 },
      { src: S + 'classic-still.jpg', t0: 5.8, t1: 9.4, p0: [40, 50], p1: [68, 50], s0: 1.02, s1: 1.02 },
      { src: S + 'ranunculus-vase.jpg', t0: 8.7, t1: 12.0, p0: [48, 50], p1: [48, 50], s0: 1.0, s1: 1.08 },
      { src: S + 'austin-stems.jpg', t0: 11.3, t1: 15.1, p0: [34, 50], p1: [62, 50], s0: 1.02, s1: 1.02 },
    ],
    lines: [
      { t0: .5, t1: 3.1, html: 'In bloom,' },
      { t0: 3.3, t1: 6.0, html: '<em>all year.</em>' },
      { t0: 6.2, t1: 8.9, html: 'No water.' },
      { t0: 9.1, t1: 11.5, html: '<em>No wilting.</em>' },
      { t0: 11.7, t1: 13.5, html: 'Five flowers.<br><em>37 colours.</em>' },
    ],
    end: { t0: 13.3, html: 'Faux flowers for real homes<br>Find SSKOI on Amazon' } },
  flower('Tulip_White', 'tulip', { src: 'tulip-vase.jpg', p0: [46, 50], p1: [54, 50] }, { src: 'tulip-detail.jpg', p0: [50, 46], p1: [50, 46] }, { src: 'tulip-still.jpg', p0: [34, 50], p1: [58, 50] },
    'White', 'tulips.', 'Faux tulips · 15 stems · 10 colours'),
  flower('Classic-Rose_Coral', 'classic', { src: 'classic-vase.jpg', p0: [50, 50], p1: [50, 50] }, { src: 'classic-detail.jpg', p0: [34, 50], p1: [50, 50] }, { src: 'classic-still.jpg', p0: [42, 50], p1: [66, 50] },
    'Coral', 'roses.', 'Classic roses · 6 stems · 6 colours'),
  flower('Ranunculus_Light-Peach', 'ranunculus', { src: 'ranunculus-vase.jpg', p0: [48, 50], p1: [48, 50] }, { src: 'ranunculus-detail.jpg', p0: [30, 50], p1: [46, 50] }, { src: 'ranunculus-still.jpg', p0: [44, 50], p1: [70, 50] },
    'Light peach', 'ranunculus.', 'Flocked ranunculus · 4 stems · 7 colours'),
  flower('Austin-Rose_Baby-Pink', 'austin', { src: 'austin-vase.jpg', p0: [60, 50], p1: [60, 50] }, { src: 'austin-detail.jpg', p0: [50, 50], p1: [50, 50] }, { src: 'austin-stems.jpg', p0: [36, 50], p1: [62, 50] },
    'Baby pink', 'Austin roses.', 'Austin roses · 6 stems · 7 colours'),
  { name: `SSKOI_Brand_Website-Hero-Loop_16x9_${V}`, w: 1920, h: 1080, fps: 24, dur: 24, fade: 1.6, loop: true, cls: 'wide',
    shots: [
      { src: S + 'tulip-still.jpg', t0: 0, t1: 7.6, p0: [50, 36], p1: [50, 48], s0: 1.0, s1: 1.05 },
      { src: S + 'classic-still.jpg', t0: 6, t1: 13.6, p0: [50, 56], p1: [50, 46], s0: 1.05, s1: 1.0 },
      { src: S + 'ranunculus-still.jpg', t0: 12, t1: 19.6, p0: [50, 46], p1: [50, 58], s0: 1.0, s1: 1.05 },
      { src: S + 'austin-stems.jpg', t0: 18, t1: 25.6, p0: [50, 60], p1: [50, 46], s0: 1.05, s1: 1.0 },
    ] },
];
// narrower titles for the two long names
VIDEOS[3].lines[0].html = '<span style="font-size:138px">Light peach<br><em>ranunculus.</em></span>';
VIDEOS[4].lines[0].html = '<span style="font-size:134px">Baby pink<br><em>Austin roses.</em></span>';

(async () => {
  const filter = process.argv[2];
  fs.mkdirSync(TMP, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
  const col = colours();
  const all = [{ name: `SSKOI_All-Flowers_37-Colours_Reel_9x16_${V}`, w: 1080, h: 1920, fps: 30, dur: col.dur, html: col.html }]
    .concat(VIDEOS.map(v => ({ ...v, html: reel(v) })));
  const browser = await chromium.launch();
  for (const v of all) {
    if (filter && !v.name.includes(filter)) continue;
    const file = path.join(TMP, v.name + '.html'); fs.writeFileSync(file, v.html);
    const frames = path.join(TMP, 'frames-' + v.name); fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames);
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1 });
    const pg = await ctx.newPage();
    await pg.goto('file://' + file);
    await pg.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
    const bad = await pg.evaluate(() => [...document.images].filter(i => !i.naturalWidth).length);
    if (bad) console.log('MISSING IMAGES', v.name, bad);
    const total = Math.round(v.dur * v.fps), t0 = Date.now();
    for (let i = 0; i < total; i++) {
      await pg.evaluate(t => window.renderAt(t), i / v.fps);
      await pg.screenshot({ path: path.join(frames, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 92 });
    }
    await ctx.close();
    const mp4 = path.join(OUT, v.name + '.mp4');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(v.fps), '-i', path.join(frames, '%05d.jpg'),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
    const posterFrame = Math.min(total - 1, Math.round(v.fps * (v.loop ? 3 : 1.6)));
    fs.copyFileSync(path.join(frames, String(posterFrame).padStart(5, '0') + '.jpg'), path.join(OUT, v.name + '_poster.jpg'));
    fs.rmSync(frames, { recursive: true, force: true });
    console.log('ok', v.name, total + ' frames', ((Date.now() - t0) / 1000).toFixed(0) + 's', (fs.statSync(mp4).size / 1e6).toFixed(1) + 'MB');
  }
  await browser.close();
})();
