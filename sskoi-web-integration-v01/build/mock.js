// Website integration mockups: loads the live sskoi.com pages, inserts the proposed sections and screenshots them.
// Nothing is changed on the store; the edits exist only inside this headless browser.
// Usage: node build/mock.js [name filter] [desktop|mobile]   Writes out/*.png (clean) and out/*_annotated.png; mobile is 2x
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const MK = 'https://sskoi.com/__mk/';
const img = (group, name, w) => `${MK}web/${group}/${name}-${w}.webp`;
const srcset = (group, name, w) => `${img(group, name, w)} ${w}w, ${img(group, name, w / 2)} ${w / 2}w`;
const slug = c => c.toLowerCase().replace(/ with /g, ' ').replace(/ /g, '-');
const arrow = '<svg class="ssko-arrow" aria-hidden="true" width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-.12em"><path d="M3 8h10M9 4l4 4-4 4"></path></svg>';

// Colour names follow the site. Swatch values are approximations for the mockup; the theme keeps its own.
const FAM = [
  { key: 'austin', view: 'sskoi-austin', name: 'Austin <em>Roses</em>', plain: 'Austin Roses', spec: '6 stems · one full bloom per stem', shown: 'Baby Pink',
    colours: [['White', '#f2ede3'], ['Baby Pink', '#f3c9c4'], ['Light Peach', '#f4d2b4'], ['Purple', '#c9a6cf'], ['Pink', '#eb98ae'], ['Hot Pink', '#d3416f'], ['Red', '#b22231']] },
  { key: 'tulip', view: 'sskoi-tulip', name: '<em>Tulips</em>', plain: 'Tulips', spec: '12 stems · standard box', shown: 'White',
    colours: [['White', '#f3efe6'], ['White With Blue Tip', '#dde6ee'], ['Yellow', '#f2c230'], ['Peach', '#f4b896'], ['Orange', '#e86a1c'], ['Green With Pink Tip', '#e2e6c9'], ['Pink', '#eea6bd'], ['Hot Pink', '#d12e6e'], ['Red', '#b3152a'], ['Dark Purple', '#6e2f6e']] },
  { key: 'classic', view: 'sskoi-classic', name: 'Classic <em>Roses</em>', plain: 'Classic Roses', spec: '6 stems · 1 open bloom and 2 buds per stem', shown: 'Coral',
    colours: [['Coral', '#ea7552'], ['Mauve', '#c07074'], ['Burgundy', '#6a1424'], ['Purple', '#b9a3d8'], ['White With Pink Tip', '#f1d4dc'], ['White', '#f3f0e8']] },
  { key: 'ranunculus', view: 'sskoi-peony', name: 'Flocked <em>Ranunculus</em>', plain: 'Flocked Ranunculus', spec: '4 stems · 2 flowers and 1 bud per stem', shown: 'Light Peach',
    colours: [['Light Peach', '#f3c9a0'], ['White', '#f1efdc'], ['Baby Pink', '#f3d6d6'], ['Pink', '#eaa5b0'], ['Hot Pink', '#d4385f'], ['Orange', '#f0a020'], ['Purple', '#b49bc9']] },
  { key: 'gift', view: 'sskoi-rose-gift', name: 'Rose <em>Gift Box</em>', plain: 'Rose Gift Box', spec: '8 stems · folding paper display vase included', shown: 'Coral',
    colours: [['Coral', '#ea7552'], ['Mauve Pink', '#c35f6e'], ['Red', '#b5122a'], ['Burgundy', '#5b0f22'], ['Purple', '#a98bd0'], ['White With Pink Tip', '#f0cbd6'], ['White', '#f3f0e8']] },
];
const fam = k => FAM.find(f => f.key === k);
const dots = f => `<span class="mk-dots" aria-label="${f.colours.length} colors">${f.colours.map(([n, h]) => `<i title="${n}" style="--c:${h}"></i>`).join('')}</span>`;

const ROOMS = [
  ['austin-baby-pink-wabi-dinner-table', 'The dinner', 'table.', 'austin', 'Baby Pink · 6 stems'],
  ['tulip-white-wabi-kitchen-ledge', 'The kitchen', 'ledge.', 'tulip', 'White · 12 stems'],
  ['classic-coral-wabi-reading-table', 'The reading', 'table.', 'classic', 'Coral · 6 stems'],
  ['ranunculus-light-peach-wabi-mantel', 'On the', 'mantel.', 'ranunculus', 'Light Peach · 4 stems'],
  ['gift-burgundy-wabi-entry-console', 'The entry', 'console.', 'gift', 'Burgundy · 8 stems, paper vase'],
];
const CLOSER = [
  ['classic-coral-bud', 'Classic Roses', 'One open rose and two buds on every stem.', '6 stems · Coral', 'classic'],
  ['ranunculus-light-peach-bud', 'Flocked Ranunculus', 'Two flowers and a bud on every stem, with soft flocked leaves.', '4 stems · Light Peach', 'ranunculus'],
  ['tulip-peach-petal', 'Tulips', 'Real-touch petals with fine ribs from base to tip.', '12 stems · Peach', 'tulip'],
  ['austin-light-peach-petal', 'Austin Roses', 'Loosely cupped, layered petals with a garden-rose shape.', '6 stems · Light Peach', 'austin'],
];

const CSS = `
.mk-note{position:absolute;z-index:50;left:12px;top:12px;display:flex;gap:8px;align-items:center;background:#f47a60;color:#1d1418;font:600 13px/1 var(--text);padding:8px 12px 8px 8px;border-radius:999px;box-shadow:0 2px 10px rgba(0,0,0,.25)}
.mk-note b{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#1d1418;color:#f6cfcd;font:600 12px/1 var(--mono)}
.mk-clean .mk-note{display:none}
html:not(.mk-clean) .mk-pdp{border-top:44px solid transparent}
.mk-pdp>.mk-note{top:-36px}
.mk-rel{position:relative}
.mk-dots{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.mk-dots i{width:14px;height:14px;border-radius:50%;background:var(--c);box-shadow:inset 0 0 0 1px rgba(29,20,24,.16)}
/* 1. Find your flowers: two photographs per row, colour dots under the spec */
.mk .rows li a{grid-template-columns:minmax(0,1.25fr) minmax(0,.9fr) 320px 150px !important}
.mk .rows .thumb{display:grid !important;grid-template-columns:1fr 1fr;gap:10px;width:auto !important;height:auto !important;aspect-ratio:auto !important;background:transparent !important;padding:0 !important;overflow:visible !important;position:static !important}
.mk .rows .thumb img{position:static !important;transform:none !important}
.mk .rows .thumb figure{margin:0}
.mk .rows .thumb img{width:100%;aspect-ratio:4/5;height:auto;object-fit:cover;display:block}
.mk .rows .thumb figcaption{font:400 10px/1.2 var(--mono);letter-spacing:.12em;text-transform:uppercase;margin-top:6px;opacity:.6}
@media (max-width:749px){
  .mk .rows li a{grid-template-columns:1fr !important;grid-template-areas:"name" "spec" "thumb" "go" !important}
  .mk .rows .thumb{grid-area:thumb;gap:8px}
}
/* 2. Every colour */
.mk-colours{background:var(--ink);color:var(--paper);padding:112px 0 104px}
.mk-colours .sec-head h2 em{color:var(--blush)}
.mk-colours .sec-head p{color:rgba(237,228,225,.72)}
.mk-tabs{display:flex;gap:28px;margin:48px 0 28px;border-bottom:1px solid var(--rule-light);overflow-x:auto;scrollbar-width:none}
.mk-tabs button{all:unset;cursor:pointer;font:400 11px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;padding:0 0 16px;white-space:nowrap;color:rgba(237,228,225,.6);border-bottom:1px solid transparent;margin-bottom:-1px}
.mk-tabs button[aria-selected=true]{color:var(--paper);border-bottom-color:var(--blush)}
.mk-tabs button sup{font-size:10px;margin-left:4px;color:var(--blush)}
.mk-slices{display:flex;gap:8px;height:540px}
.mk-slice{flex:1;min-width:0;display:flex;flex-direction:column;text-decoration:none;color:inherit;transition:flex .4s}
.mk-slice .im{flex:1;overflow:hidden;position:relative;background:#2a2024}
.mk-slice img{width:100%;height:100%;object-fit:cover;display:block}
.mk-slice span b,.mk-slice span i{font:inherit;font-style:normal}
.mk-slice span{font:400 10px/1.3 var(--mono);letter-spacing:.1em;text-transform:uppercase;margin-top:12px;min-height:26px;color:rgba(237,228,225,.7)}
.mk-slice.is-open{flex:2.6}
.mk-slice.is-open .im::after{content:"";position:absolute;inset:auto 0 0 0;height:45%;background:linear-gradient(0deg,rgba(29,20,24,.78),rgba(29,20,24,0))}
.mk-slice .open{display:none}
.mk-slice.is-open .open{display:block;position:absolute;left:20px;right:20px;bottom:18px;z-index:2}
.mk-slice .open strong{display:block;font:400 44px/.95 var(--display);letter-spacing:-.02em;color:var(--paper)}
.mk-slice .open em{display:block;font:400 11px/1.4 var(--mono);letter-spacing:.12em;text-transform:uppercase;font-style:normal;margin-top:10px;color:var(--blush)}
.mk-slice.is-open span{color:var(--paper)}
.mk-colours .foot{display:flex;justify-content:space-between;gap:24px;margin-top:28px;font:400 11px/1.5 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:rgba(237,228,225,.6)}
.mk-colours .foot a{color:var(--paper)}
@media (max-width:749px){
  .mk-colours{padding:56px 0 52px}
  .mk-tabs{gap:20px;margin:28px 0 20px}
  .mk-slices{height:380px;overflow-x:auto;gap:6px;scrollbar-width:none;margin-right:calc(var(--gutter) * -1)}
  .mk-slice{flex:0 0 54px}
  .mk-slice.is-open{flex:0 0 176px}
  .mk-slice .open strong{font-size:28px}
  .mk-slice span{font-size:9px;min-height:16px}
  .mk-slice:not(.is-open) span i{display:none}
  .mk-colours .foot{flex-direction:column;gap:10px}
}
/* 3. Rooms carousel: room-cover cards */
.mk #ssko-v07-rooms .mk-room{flex:0 0 420px;margin:0}
.mk-room a{display:block;position:relative;color:var(--paper);text-decoration:none}
.mk-room .frame{aspect-ratio:4/5;overflow:hidden}
.mk-room img{width:100%;height:100%;object-fit:cover;display:block}
.mk-room .shade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(29,20,24,.72) 0,rgba(29,20,24,.25) 34%,rgba(29,20,24,0) 58%)}
.mk-room .txt{position:absolute;left:24px;right:24px;bottom:22px}
.mk-room strong{display:block;font:400 46px/.9 var(--display);letter-spacing:-.025em}
.mk-room strong em{display:block;padding-left:.3em;color:var(--blush)}
.mk-room .rule{height:1px;background:rgba(237,228,225,.34);margin:16px 0 12px}
.mk-room .mono{display:flex;justify-content:space-between;color:var(--paper)}
@media (max-width:749px){ .mk #ssko-v07-rooms .mk-room{flex:0 0 78vw} .mk-room strong{font-size:34px} }
/* 4. Look closer */
.mk-closer{padding:112px 0 112px}
.mk-closer .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;margin-top:56px}
.mk-plate{margin:0}
.mk-plate a{color:inherit;text-decoration:none}
.mk-plate .im{aspect-ratio:4/5;overflow:hidden;background:var(--paper-2)}
.mk-plate img{width:100%;height:100%;object-fit:cover;display:block}
.mk-plate h3{font:400 30px/1 var(--display);letter-spacing:-.02em;margin:20px 0 10px}
.mk-plate p{font:400 15px/1.5 var(--text);margin:0 0 14px;max-width:30ch}
.mk-plate .mono{border-top:1px solid var(--rule);padding-top:12px;display:flex;justify-content:space-between}
@media (max-width:749px){
  .mk-closer{padding:56px 0}
  .mk-closer .grid{display:flex;overflow-x:auto;gap:14px;margin:28px calc(var(--gutter) * -1) 0 0;scrollbar-width:none}
  .mk-plate{flex:0 0 74vw}
  .mk-plate h3{font-size:26px}
}
/* 10. Site header and footer on flower pages (copied from the home page) */
.mk-site-head{position:sticky;top:0;z-index:40;background:var(--paper);border-bottom:1px solid var(--rule)}
.mk-site-head .bar{position:static !important;color:var(--ink) !important;padding-top:18px !important;padding-bottom:18px !important;inset:auto !important}
.mk-site-head .bar a{color:var(--ink)}
.mk-site-head .pill{background:var(--ink) !important;color:var(--paper) !important;border-color:var(--ink) !important}
.mk-site-head>.mk-note{top:auto;bottom:-44px}
.mk-site-foot>.mk-note{top:12px}
/* PDP modules */
.mk-pdp{padding:96px 0}
.mk-pdp + .mk-pdp{padding-top:0}
.mk-pdp h2{font:400 clamp(40px,6.4vw,92px)/.92 var(--display);letter-spacing:-.025em;margin:0}
.mk-pdp h2 em{font-style:italic}
.mk-pdp .lede{font:400 15px/1.55 var(--text);max-width:42ch;margin:18px 0 0}
.mk-pdp .head{display:flex;justify-content:space-between;align-items:flex-end;gap:32px;padding-bottom:28px;border-bottom:1px solid var(--rule);margin-bottom:36px}
.mk-statement{background:var(--paper-2);position:relative;overflow:hidden;padding:104px 0 96px}
.mk-statement .eyebrow{font:400 11px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase}
.mk-statement h2{font:400 clamp(56px,10vw,150px)/.84 var(--display);letter-spacing:-.04em;margin:28px 0 48px;position:relative;z-index:2}
.mk-statement h2 em{display:block;color:var(--coral);padding-left:.3em}
.mk-statement dl{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;max-width:820px;margin:0;position:relative;z-index:2;border-top:1px solid var(--rule)}
.mk-statement dl div{padding:16px 20px 0 0}
.mk-statement dt{font:400 10px/1.2 var(--mono);letter-spacing:.12em;text-transform:uppercase;opacity:.65}
.mk-statement dd{font:400 26px/1.1 var(--display);margin:8px 0 0}
.mk-statement dd small{display:block;font:400 12px/1.4 var(--text);margin-top:4px;opacity:.7}
.mk-statement .note{font:400 12px/1.5 var(--text);opacity:.6;margin-top:22px;position:relative;z-index:2}
.mk-statement .cut{position:absolute;right:4%;top:40px;height:calc(100% - 40px);width:auto;object-fit:contain;z-index:1}
.mk-trio{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.mk-trio figure{margin:0}
.mk-trio img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block}
.mk-trio figcaption{font:400 11px/1.3 var(--mono);letter-spacing:.12em;text-transform:uppercase;margin-top:10px;display:flex;justify-content:space-between}
.mk-mini{display:flex;gap:8px;height:420px}
.mk-mini a{flex:1;display:flex;flex-direction:column;color:inherit;text-decoration:none}
.mk-mini .im{flex:1;overflow:hidden;position:relative}
.mk-mini img{width:100%;height:100%;object-fit:cover;display:block}
.mk-mini span{font:400 10px/1.3 var(--mono);letter-spacing:.1em;text-transform:uppercase;margin-top:10px;min-height:26px}
.mk-mini a.is-current{flex:1.8}
.mk-mini a.is-current .im{outline:1px solid var(--ink);outline-offset:4px}
.mk-mini a.is-current span::after{content:" · Selected";color:var(--coral)}
.mk-duo{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.mk-duo figure{margin:0}
.mk-duo img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block}
.mk-duo figcaption{font:400 13px/1.45 var(--text);margin-top:12px}
.mk-duo figcaption b{display:block;font:400 24px/1 var(--display);margin-bottom:6px}
.mk-more{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.mk-more a{color:inherit;text-decoration:none}
.mk-more img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block}
.mk-more h3{font:400 30px/1 var(--display);letter-spacing:-.02em;margin:16px 0 6px}
@media (max-width:749px){
  .mk-pdp{padding:56px 0}
  .mk-pdp .head{flex-direction:column;align-items:flex-start;gap:8px;margin-bottom:22px}
  .mk-statement{padding:56px 0 260px}
  .mk-statement h2{margin:18px 0 28px}
  .mk-statement dl{grid-template-columns:1fr 1fr;row-gap:16px}
  .mk-statement .cut{top:auto;bottom:-10px;right:50%;transform:translateX(50%);height:300px}
  .mk-trio{display:flex;overflow-x:auto;gap:12px;margin-right:calc(var(--gutter) * -1);scrollbar-width:none}
  .mk-trio figure{flex:0 0 72vw}
  .mk-mini{height:300px;gap:5px}
  .mk-mini a.is-current{flex:2.6}
  .mk-mini span{font-size:8px;min-height:32px;overflow:hidden}
  .mk-mini a:not(.is-current) span{visibility:hidden}
  .mk-duo{grid-template-columns:1fr;gap:28px}
  .mk-more{display:flex;overflow-x:auto;gap:14px;margin-right:calc(var(--gutter) * -1);scrollbar-width:none}
  .mk-more a{flex:0 0 62vw}
}
/* Lookbook: In Bloom type and paper. The fonts are the theme's own local files */
@font-face{font-family:"Bodoni Moda";src:url(https://sskoi.com/cdn/shop/t/23/assets/ssko-bodoni-moda.woff2) format("woff2");font-weight:400 650}
@font-face{font-family:"Bodoni Moda";src:url(https://sskoi.com/cdn/shop/t/23/assets/ssko-bodoni-moda-italic.woff2) format("woff2");font-style:italic;font-weight:400 650}
@font-face{font-family:"Hanken Grotesk";src:url(https://sskoi.com/cdn/shop/t/23/assets/ssko-hanken-grotesk.woff2) format("woff2");font-weight:400 600}
@font-face{font-family:"DM Mono";src:url(https://sskoi.com/cdn/shop/t/23/assets/ssko-dm-mono.woff2) format("woff2");font-weight:400}
.mk-lb{--color-background:237,228,225;--gradient-background:#ede4e1;--font-heading-family:"Bodoni Moda",Georgia,serif;--font-body-family:"Hanken Grotesk",Arial,sans-serif;--ink:#1d1418;--paper:#ede4e1;--paper-2:#e2d5d1}
.mk-lb .ssko-v3-theme,.mk-lb .ssko-v3{--ssko-v3-paper:#ede4e1;--ssko-v3-ink:#1d1418;--ssko-v3-panel:#e2d5d1;--ssko-v3-line:rgba(29,20,24,.18);--ssko-v3-olive:#12261c;--ssko-v3-serif:"Bodoni Moda",Georgia,serif;--ssko-v3-sans:"Hanken Grotesk",Arial,sans-serif}
.mk-lb .ssko-v4-look,.mk-lb .ssko-v4-split{background:#e2d5d1}.mk-lb .ssko-v4-look-image{background:#d9cac5}
.mk-lb body,.mk-lb .gradient,.mk-lb .header-wrapper,.mk-lb header{background:#ede4e1 !important}
.mk-lb .header__heading-link,.mk-lb .header__heading{font-family:"Bodoni Moda",serif !important;letter-spacing:.36em}
.mk-lb .header__menu-item,.mk-lb nav a{font-family:"DM Mono",monospace !important;text-transform:uppercase;font-size:11px !important;letter-spacing:.12em}
.mk-lb h1 em,.mk-lb h2 em{font-style:italic}
.mk-lb body, .mk-lb{background:var(--paper,#ede4e1) !important}
.mk-lb h1,.mk-lb h2,.mk-lb .h1,.mk-lb .h2{font-family:"Bodoni Moda",Georgia,serif !important;letter-spacing:-.025em;font-weight:400 !important}
.mk-lb h1{font-size:clamp(48px,8vw,120px) !important;line-height:.9 !important}
.mk-lb body,.mk-lb p,.mk-lb a,.mk-lb li,.mk-lb button{font-family:"Hanken Grotesk",Arial,sans-serif !important}
.mk-lb [class*=eyebrow],.mk-lb small{font-family:"DM Mono",monospace !important;letter-spacing:.12em}
`;

function colourSection(active = 'tulip', open = 'Peach') {
  const tabs = FAM.map(f => `<button role="tab" aria-selected="${f.key === active}">${f.plain}<sup>${f.colours.length}</sup></button>`).join('');
  const f = fam(active);
  const slices = f.colours.map(([c], i) => `<a class="mk-slice${c === open ? ' is-open' : ''}" href="/?view=${f.view}#color=${encodeURIComponent(c)}">
      <div class="im"><img src="${img('colour', f.key + '-' + slug(c), 600)}" alt="${c} ${f.plain.toLowerCase()} up close" loading="lazy">
      <div class="open"><strong>${c}</strong><em>Open ${c} ${f.plain} ${arrow}</em></div></div>
      <span><b>${String(i + 1).padStart(2, '0')}</b> <i>${c}</i></span></a>`).join('');
  return `<section class="mk-colours mk-rel" id="colors" aria-labelledby="colors-h">
    <div class="mk-note"><b>2</b>NEW · Every color</div>
    <div class="wrap">
      <div class="sec-head"><h2 id="colors-h">Every flower, <em>every color.</em></h2><p>Thirty-seven colors across five sets. Choose a set, then open a color to see it on the flower page.</p></div>
      <div class="mk-tabs" role="tablist">${tabs}</div>
      <div class="mk-slices">${slices}</div>
      <div class="foot"><span>${f.plain} · ${f.colours.length} colors · close-up photos</span><a href="/?view=${f.view}">Shop ${f.plain} ${arrow}</a></div>
    </div></section>`;
}

function closerSection() {
  const plates = CLOSER.map(([im, t, p, m, k]) => `<figure class="mk-plate"><a href="/?view=${fam(k).view}">
      <div class="im"><img src="${img('closer', im, 900)}" alt="${t} close-up" loading="lazy"></div>
      <h3>${t}</h3><p>${p}</p><div class="mono"><span>${m}</span><span>Explore ${arrow}</span></div></a></figure>`).join('');
  return `<section class="mk-closer mk-rel" aria-labelledby="closer-h"><div class="mk-note"><b>4</b>NEW · Look closer</div>
    <div class="wrap"><div class="sec-head"><h2 id="closer-h">Look <em>closer.</em></h2><p>Petals, buds and leaves up close, so you know what arrives before you choose a set.</p></div>
    <div class="grid">${plates}</div></div></section>`;
}

const roomCards = () => ROOMS.map(([im, a, b, k, m]) => `<figure class="mk-room"><a href="/?view=${fam(k).view}">
    <div class="frame"><img src="${img('rooms', im, 900)}" alt="${fam(k).plain} ${m.split(' · ')[0]} ${a.toLowerCase()} ${b.replace('.', '')}" loading="lazy"></div><div class="shade"></div>
    <div class="txt"><strong>${a}<em>${b}</em></strong><div class="rule"></div><div class="mono"><span>${fam(k).plain} · ${m}</span><span>Shop ${arrow}</span></div></div></a></figure>`).join('');

function pdpModules() {
  const f = fam('classic');
  const mini = f.colours.map(([c]) => `<a href="#color=${encodeURIComponent(c)}" class="${c === 'Coral' ? 'is-current' : ''}"><div class="im"><img src="${img('colour', 'classic-' + slug(c), 600)}" alt="${c} classic rose" loading="lazy"></div><span>${c}</span></a>`).join('');
  const more = ['austin', 'tulip', 'ranunculus', 'gift'].map(k => { const g = fam(k); return `<a href="/?view=${g.view}"><img src="${img('rows', k + '-room', 720)}" alt="${g.plain}" loading="lazy"><h3>${g.name}</h3><p class="mono">${g.spec}</p>${dots(g)}</a>`; }).join('');
  return `
  <section class="mk-statement mk-rel" aria-labelledby="facts-h"><div class="mk-note"><b>5</b>NEW · Set at a glance</div>
    <div class="wrap"><p class="eyebrow">Classic Roses · Coral</p>
      <h2 id="facts-h">Six stems. <em>Twelve buds.</em></h2>
      <dl><div><dt>Stems</dt><dd>6</dd></div><div><dt>On each stem</dt><dd>1 + 2<small>One open rose, two buds</small></dd></div><div><dt>Stem length</dt><dd>43 cm<small>About 17 in</small></dd></div><div><dt>Bloom</dt><dd>9 cm<small>About 3.5 in across</small></dd></div></dl>
      <p class="note">Measurements from the product size chart. Vase not included.</p></div>
    <img class="cut" src="${MK}web/cutout/classic-coral-900.webp" alt="" aria-hidden="true"></section>
  <section class="mk-pdp mk-rel" aria-labelledby="close-h"><div class="mk-note"><b>6</b>NEW · Up close</div>
    <div class="wrap"><div class="head"><div><h2 id="close-h">Coral, <em>up close.</em></h2><p class="lede">Soft coral petals that deepen toward the center, with green-tipped buds that open the outline of the arrangement.</p></div></div>
    <div class="mk-trio">
      <figure><img src="${img('closer', 'classic-coral-petal', 900)}" alt="Coral classic rose petals" loading="lazy"><figcaption><span>Petals</span><span>01</span></figcaption></figure>
      <figure><img src="${img('closer', 'classic-coral-bud', 900)}" alt="Coral classic rose bloom and buds" loading="lazy"><figcaption><span>Bloom and buds</span><span>02</span></figcaption></figure>
      <figure><img src="${img('closer', 'classic-coral-still', 900)}" alt="Six coral classic rose stems on linen" loading="lazy"><figcaption><span>Laid flat</span><span>03</span></figcaption></figure>
    </div></div></section>
  <section class="mk-pdp mk-rel" aria-labelledby="every-h"><div class="mk-note"><b>7</b>NEW · Every color (this set)</div>
    <div class="wrap"><div class="head"><div><h2 id="every-h">In every <em>color.</em></h2><p class="lede">Tap a color to switch the photos and the Amazon link above.</p></div><span class="mono">6 colors</span></div>
    <div class="mk-mini">${mini}</div></div></section>
  <section class="mk-pdp mk-rel" aria-labelledby="home-h"><div class="mk-note"><b>8</b>NEW · At home</div>
    <div class="wrap"><div class="head"><div><h2 id="home-h">Coral <em>at home.</em></h2><p class="lede">Two ways to place six stems. Vases and furniture are shown for styling; the set includes the stems only.</p></div><a class="mono" href="/?view=sskoi-lookbook">Open the lookbook ${arrow}</a></div>
    <div class="mk-duo">
      <figure><img src="${img('rooms', 'classic-coral-wabi-reading-table', 900)}" alt="Coral classic roses in a stone jug on a reading table" loading="lazy"><figcaption><b>The reading table</b>Keep the jug low and let a few buds lean out toward the chair.</figcaption></figure>
      <figure><img src="${img('closer', 'classic-coral-vase', 900)}" alt="Coral classic roses in a round stoneware vase on a wooden side table" loading="lazy"><figcaption><b>In a round vase</b>A wide stoneware vase holds all six stems, with the buds left loose at the edge.</figcaption></figure>
    </div></div></section>
  <section class="mk-pdp mk-rel" aria-labelledby="more-h"><div class="mk-note"><b>9</b>NEW · More flowers</div>
    <div class="wrap"><div class="head"><h2 id="more-h">More <em>flowers.</em></h2><a class="mono" href="/#flowers">All flowers ${arrow}</a></div>
    <div class="mk-more">${more}</div></div></section>`;
}

async function injectHome(p) {
  await p.evaluate(({ CSS, colours, closer, rooms, FAM, MK }) => {
    document.documentElement.classList.add('mk');
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const note = (el, n, t) => { el.classList.add('mk-rel'); el.insertAdjacentHTML('afterbegin', `<div class="mk-note"><b>${n}</b>${t}</div>`); };
    // 1. rows
    const keys = ['austin', 'tulip', 'classic', 'ranunculus', 'gift'];
    document.querySelectorAll('.rows li').forEach((li, i) => {
      const f = FAM[i]; if (!f) return;
      const th = li.querySelector('.thumb');
      th.innerHTML = `<figure><img src="${MK}web/rows/${keys[i]}-room-720.webp" alt=""><figcaption>${keys[i] === 'gift' ? 'Paper vase' : 'In a vase'}</figcaption></figure><figure><img src="${MK}web/rows/${keys[i]}-close-720.webp" alt=""><figcaption>${keys[i] === 'gift' ? 'In a room' : 'Up close'}</figcaption></figure>`;
      const sp = li.querySelector('.spec'); sp.insertAdjacentHTML('beforeend', `<span class="mk-dots">${f.colours.map(([n, h]) => `<i title="${n}" style="--c:${h}"></i>`).join('')}</span>`);
    });
    note(document.querySelector('#flowers'), 1, 'UPDATE · Two photos + color dots per set');
    document.querySelector('#flowers').insertAdjacentHTML('afterend', colours);
    // 3. rooms
    const strip = document.querySelector('#ssko-v07-rooms'); strip.innerHTML = rooms;
    note(document.querySelector('#rooms'), 3, 'UPDATE · Room-cover cards, five rooms');
    document.querySelector('#rooms').insertAdjacentHTML('afterend', closer);
  }, { CSS, colours: colourSection(), closer: closerSection(), rooms: roomCards(), FAM, MK });
}

async function injectPdp(p) {
  await p.evaluate(({ CSS, mods }) => {
    document.documentElement.classList.add('mk');
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const sec = document.querySelector('.ssko-v07-product');
    sec.insertAdjacentHTML('afterend', mods);
    const ensure = document.querySelectorAll('.mk-pdp .wrap, .mk-statement .wrap');
    ensure.forEach(w => { w.style.paddingLeft = w.style.paddingRight = 'var(--gutter,56px)'; });
  }, { CSS, mods: pdpModules() });
  // 10. The flower pages have no site header or footer: reuse the home page's bar and footer
  await p.evaluate(async () => {
    const doc = new DOMParser().parseFromString(await (await fetch('/')).text(), 'text/html');
    const bar = doc.querySelector('header.hero .bar'), end = doc.querySelector('footer.end');
    bar.querySelectorAll('a[href^="#"]').forEach(a => a.setAttribute('href', '/' + a.getAttribute('href')));
    const main = document.querySelector('main') || document.body;
    main.insertAdjacentHTML('beforebegin', `<header class="mk-site-head mk-rel"><div class="mk-note"><b>10</b>FIX · Site header on flower pages</div>${bar.outerHTML}</header>`);
    main.insertAdjacentHTML('afterend', `<div class="mk-rel mk-site-foot"><div class="mk-note"><b>10</b>FIX · Site footer on flower pages</div>${end.outerHTML}</div>`);
  });
}

async function injectLookbook(p) {
  await p.evaluate(({ CSS }) => {
    document.documentElement.classList.add('mk-lb'); const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const h1 = document.querySelector('main h1'); if (h1) h1.innerHTML = 'The <em>Lookbook.</em>';
    document.querySelectorAll('main h2').forEach(h => { const w = h.textContent.trim().split(' '); if (w.length > 1 && !h.closest('footer')) h.innerHTML = w.slice(0, -1).join(' ') + ' <em>' + w[w.length - 1] + '.</em>'; });
  }, { CSS });
}

async function settle(p) {
  await p.evaluate(async () => {
    document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager');
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    document.querySelectorAll('video').forEach(v => { v.pause(); });
  });
  await p.waitForTimeout(800);
  return p.evaluate(() => [...document.images].filter(i => i.src.includes('__mk') && !i.naturalWidth).map(i => i.src));
}

(async () => {
  const filter = process.argv[2];
  fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });
  const b = await chromium.launch();
  const jobs = [
    ['home', 'https://sskoi.com/', injectHome, [[1440, 'desktop'], [390, 'mobile']]],
    ['pdp-classic', 'https://sskoi.com/?view=sskoi-classic', injectPdp, [[1440, 'desktop'], [390, 'mobile']]],
    ['lookbook', 'https://sskoi.com/?view=sskoi-lookbook', injectLookbook, [[1440, 'desktop']]],
    ['before-home', 'https://sskoi.com/', null, [[1440, 'desktop'], [390, 'mobile']]],
    ['before-pdp-classic', 'https://sskoi.com/?view=sskoi-classic', null, [[1440, 'desktop'], [390, 'mobile']]],
    ['before-lookbook', 'https://sskoi.com/?view=sskoi-lookbook', null, [[1440, 'desktop']]],
  ];
  for (const [name, url, fn, sizes] of jobs) {
    if (filter && !name.includes(filter)) continue;
    for (const [w, tag] of sizes) {
      if (process.argv[3] && tag !== process.argv[3]) continue;
      const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: w < 800 ? 2 : 1, reducedMotion: 'reduce' });
      await ctx.route(MK + '**', route => { const f = path.join(ROOT, decodeURIComponent(new URL(route.request().url()).pathname.replace('/__mk/', ''))); fs.existsSync(f) ? route.fulfill({ path: f }) : route.fulfill({ status: 404 }); });
      const p = await ctx.newPage();
      await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
      if (fn) await fn(p);
      for (const ann of fn && name !== 'lookbook' ? [false, true] : [false]) {
        await p.evaluate(a => document.documentElement.classList.toggle('mk-clean', !a), ann);
        const missing = await settle(p);
        if (missing.length) console.log('MISSING', name, missing);
        const file = path.join(ROOT, 'out', `${name}_${tag}${ann ? '_annotated' : ''}.png`);
        await p.screenshot({ path: file, fullPage: true });
        console.log('ok', path.basename(file));
      }
      await ctx.close();
    }
  }
  await b.close();
})();
