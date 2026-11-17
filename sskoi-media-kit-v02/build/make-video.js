// Short videos for media kit v02. Every frame is drawn by the browser from the same layouts as the stills,
// then encoded with ffmpeg. Each file is kept under 3 MB so it can be uploaded to Drive through the connector.
// Usage: node build/make-video.js [filter]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const CAT = JSON.parse(fs.readFileSync(path.join(__dirname, 'catalog.json'), 'utf8'));
const F = CAT.families, V = 'v02_REVIEW', FPS = 30, LIMIT = 2.9 * 1024 * 1024;
const FRAMES = process.env.FRAMES_DIR || path.join(__dirname, 'tmp', 'frames');
const url = p => 'file://' + encodeURI(p);
const cols = k => Object.keys(F[k].colours);
const S = (k, c, shot) => url(F[k].colours[c].shots[shot]);
const GIFT_X = { 'Coral': 47, 'Red': 52, 'Burgundy': 50, 'Mauve Pink': 50, 'Purple': 50, 'White': 52, 'White With Pink Tip': 50 };

// slides: [{src, pos, label}]  mode: 'bleed' (9:16 full-bleed + text), 'mount' (9:16 photo on paper + text), 'plain' (16:9, no text)
function html(v) {
  const n = v.slides.length;
  const imgs = v.slides.map((s, i) => `<img class="shot" id="s${i}" src="${s.src}" style="object-position:${s.pos}">`).join('');
  const labels = v.slides.map((s, i) => `<span class="lab" id="l${i}">${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')} · ${s.label}</span>`).join('');
  const css = `
  .shot{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform-origin:50% 45%}
  .lab{position:absolute;left:0;top:0;opacity:0;white-space:nowrap}
  .labs{position:relative;height:32px}
  .bleed .shade{position:absolute;inset:0;z-index:20;background:linear-gradient(180deg,rgba(29,20,24,.5) 0,rgba(29,20,24,0) 24%),linear-gradient(0deg,rgba(29,20,24,.86) 0,rgba(29,20,24,.6) 30%,rgba(29,20,24,0) 56%)}
  .bleed .mastw{position:absolute;inset:232px 0 auto;text-align:center;color:var(--paper);z-index:21}
  .bleed .bot{position:absolute;inset:auto 60px 400px;color:var(--paper);z-index:22}
  .bleed h1{font:400 ${v.fs || 118}px/.86 var(--display);letter-spacing:-.035em}
  .bleed h1 span{display:block}.bleed h1 em{display:block;color:var(--blush);padding-left:.3em}
  .bleed .rule{height:1px;background:rgba(237,228,225,.34);margin:26px 0 18px}
  .mountv .photo{position:absolute;left:60px;top:340px;width:960px;height:990px;overflow:hidden;background:var(--paper-2)}
  .mountv .top{position:absolute;inset:262px 0 auto;text-align:center}
  .mountv .bot{position:absolute;inset:1366px 60px auto}
  .mountv h1{font:400 ${v.fs || 104}px/.86 var(--display);letter-spacing:-.035em}
  .mountv h1 span{display:block}.mountv h1 em{display:block;padding-left:.3em}
  .mountv .rule{height:1px;background:var(--ink);opacity:.25;margin:24px 0 16px}`;
  const text = `<h1><span>${v.l1}</span><em>${v.l2}</em></h1><div class="rule"></div><div class="labs mono">${labels}</div>`;
  const body = v.mode === 'bleed' ? `<div class="canvas bleed">${imgs}<div class="shade"></div><div class="mastw"><span class="mast">SSKOI</span></div><div class="bot">${text}</div></div>`
    : v.mode === 'mount' ? `<div class="canvas mountv"><div class="top"><span class="mast">SSKOI</span></div><div class="photo">${imgs}</div><div class="bot">${text}</div></div>`
    : `<div class="canvas">${imgs}</div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../kit.css"><style>${css}</style></head><body>${body}
  <script>
  const N=${n}, HOLD=${v.hold}, FADE=${v.fade}, STEP=HOLD+FADE, ZOOM=${v.zoom || 0};
  const ease=x=>x*x*(3-2*x);
  window.renderAt=t=>{
    const i=Math.floor(t/STEP)%N, p=t-Math.floor(t/STEP)*STEP, j=(i+1)%N, a=p<HOLD?0:ease((p-HOLD)/FADE);
    for(let k=0;k<N;k++){
      const s=document.getElementById('s'+k), l=document.getElementById('l'+k);
      const o=k===i?1:(k===j?a:0);
      s.style.opacity=o; s.style.zIndex=k===j?2:(k===i?1:0);
      // each slide drifts in slowly from the moment it starts to appear until it has faded out
      if(ZOOM){ const local=k===i?p+FADE:(k===j?p-HOLD:0); s.style.transform='scale('+(1+ZOOM*local/(STEP+FADE))+')'; }
      if(l) l.style.opacity=k===i?1-a:(k===j?a:0);
    }
  };
  </script></body></html>`;
}

const V9 = { w: 1080, h: 1920 }, V16 = { w: 1920, h: 1080 };
const change = (k, shot, pos) => cols(k).map(c => ({ src: S(k, c, shot), pos: typeof pos === 'function' ? pos(c) : pos, label: c }));
const videos = [
  { name: 'Tulip_All-Colours_15-Stems_Colour-Change_Reel_9x16', ...V9, mode: 'bleed', l1: 'Tulips', l2: 'in ten colours.', slides: change('tulip', 'vase', '50% 50%'), hold: .7, fade: .55 },
  { name: 'Classic-Rose_All-Colours_6-Stems_Colour-Change_Reel_9x16', ...V9, mode: 'bleed', l1: 'Classic roses', l2: 'in six colours.', fs: 104, slides: change('classic', 'vase', '47% 50%'), hold: .8, fade: .6 },
  { name: 'Ranunculus_All-Colours_4-Stems_Colour-Change_Reel_9x16', ...V9, mode: 'bleed', l1: 'Ranunculus', l2: 'in seven colours.', fs: 104, slides: change('ranunculus', 'vase', '47% 50%'), hold: .75, fade: .6 },
  { name: 'Austin-Rose_All-Colours_6-Stems_Colour-Change_Reel_9x16', ...V9, mode: 'mount', l1: 'Austin roses', l2: 'in seven colours.', slides: change('austin6', 'vase', '72% 50%'), hold: .75, fade: .6 },
  { name: 'Austin-Rose-Eucalyptus_All-Colours_6-Roses-6-Eucalyptus_Colour-Change_Reel_9x16', ...V9, mode: 'mount', l1: 'With eucalyptus', l2: 'in seven colours.', fs: 100, slides: change('austin66', 'vase', '55% 50%'), hold: .75, fade: .6 },
  { name: 'Rose-Gift-Box_All-Colours_8-Stems_Vase-Styling_Reel_9x16', ...V9, mode: 'bleed', l1: 'Gift roses', l2: 'in seven colours.', fs: 104, slides: change('gift', 'styling', c => `${GIFT_X[c]}% 50%`).map(s => ({ ...s, label: s.label + ' · vase shown for styling' })), hold: .9, fade: .6, zoom: .05 },
  { name: 'All-Flowers_Five-Colours_Wabi-Sabi-Rooms_Reel_9x16', ...V9, mode: 'bleed', l1: 'Five rooms,', l2: 'five flowers.', fs: 110, hold: 1.3, fade: .7, zoom: .06,
    slides: CAT.scenes.filter(s => s.series === 'wabi').map(s => ({ src: url(s.file), pos: '50% 50%', label: `${{ austin6: 'Austin roses', tulip: 'Tulips', classic: 'Classic roses', ranunculus: 'Ranunculus', gift: 'Rose gift box' }[s.family]} · ${s.colour}` })) },
  { name: 'Tulip_All-Colours_15-Stems_Colour-Change_Loop_16x9', ...V16, mode: 'plain', slides: change('tulip', 'still', '50% 22%'), hold: .7, fade: .6 },
  { name: 'Classic-Rose_All-Colours_6-Stems_Colour-Change_Loop_16x9', ...V16, mode: 'plain', slides: change('classic', 'still', '50% 62%'), hold: .8, fade: .6 },
  { name: 'Ranunculus_All-Colours_4-Stems_Colour-Change_Loop_16x9', ...V16, mode: 'plain', slides: change('ranunculus', 'still', '50% 58%'), hold: .8, fade: .6 },
  { name: 'Austin-Rose_All-Colours_6-Stems_Colour-Change_Loop_16x9', ...V16, mode: 'plain', slides: change('austin6', 'vase', '50% 0%'), hold: .8, fade: .6 },
  { name: 'Austin-Rose-Eucalyptus_All-Colours_6-Roses-6-Eucalyptus_Colour-Change_Loop_16x9', ...V16, mode: 'plain', slides: change('austin66', 'vase', '50% 35%'), hold: .8, fade: .6 },
];

(async () => {
  const filter = process.argv[2], rows = [];
  fs.mkdirSync(path.join(__dirname, 'tmp'), { recursive: true }); fs.mkdirSync(path.join(ROOT, 'out/video'), { recursive: true });
  const browser = await chromium.launch();
  for (const v of videos) {
    const name = `SSKOI_${v.name}_${V}`, dur = v.slides.length * (v.hold + v.fade), out = path.join(ROOT, 'out/video', name + '.mp4');
    rows.push({ file: `out/video/${name}.mp4`, type: 'Video', layout: v.mode === 'plain' ? 'Loop (no text)' : 'Reel', ratio: v.w > v.h ? '16x9' : '9x16', size: `${v.w}x${v.h}`, seconds: +dur.toFixed(1), slides: v.slides.length });
    if (filter && !name.includes(filter)) continue;
    const dir = path.join(FRAMES, name); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const file = path.join(__dirname, 'tmp', name + '.html'); fs.writeFileSync(file, html(v));
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1 });
    const pg = await ctx.newPage(); await pg.goto('file://' + file);
    await pg.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
    const bad = await pg.evaluate(() => [...document.images].filter(i => !i.naturalWidth).length); if (bad) console.log('MISSING IMAGES', name, bad);
    const total = Math.round(dur * FPS);
    for (let f = 0; f < total; f++) {
      await pg.evaluate(t => window.renderAt(t), f / FPS);
      await pg.screenshot({ path: path.join(dir, String(f).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 95 });
    }
    await ctx.close();
    fs.copyFileSync(path.join(dir, '00000.jpg'), path.join(ROOT, 'out/video', name.replace(/_v02_REVIEW$/, '_Poster_v02_REVIEW') + '.jpg'));
    const enc = extra => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, '%05d.jpg'), '-c:v', 'libx264', '-preset', 'slow', ...extra, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
    enc(['-crf', '19']);
    let mode = 'crf 19';
    if (fs.statSync(out).size > LIMIT) { const kb = Math.floor(LIMIT * 8 / dur / 1000 * 0.84); enc(['-b:v', kb + 'k', '-maxrate', Math.round(kb * 1.6) + 'k', '-bufsize', kb * 2 + 'k']); mode = `abr ${kb}k`; }
    console.log('ok', name, dur.toFixed(1) + 's', (fs.statSync(out).size / 1048576).toFixed(2) + ' MB', mode);
    fs.rmSync(dir, { recursive: true, force: true });
  }
  await browser.close();
  if (!filter) fs.writeFileSync(path.join(__dirname, 'manifest-video.json'), JSON.stringify(rows, null, 1));
})();
