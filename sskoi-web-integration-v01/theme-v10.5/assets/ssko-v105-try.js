/* SSKOI v10.5 — See it in your vase.
   Runs entirely in the browser: the visitor's photo is never uploaded. */
(function () {
  var root = document.querySelector('.ssko-try');
  if (!root || root.__sskoTry) return;
  root.__sskoTry = true;

  var base = root.getAttribute('data-base') || '';
  var $ = function (sel) { return root.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };

  var canvas = $('[data-canvas]');
  var sample = $('[data-sample]');
  var photo = $('[data-photo]');
  var bouquet = $('[data-bouquet]');
  var clip = document.createElement('div');
  clip.className = 'ssko-try__clip';
  canvas.insertBefore(clip, bouquet);
  clip.appendChild(bouquet);
  var guides = { rim: $('[data-guide="rim"]'), base: $('[data-guide="base"]') };
  var readout = $('[data-readout]');
  var heightInput = $('[data-height]');
  var glassInput = $('[data-glass]');
  var tiltInput = $('[data-tilt]');
  var cta = $('[data-cta]');

  var SAMPLE = { rim: 0.56, base: 0.82, ratio: 0.8, heightIn: 8 };
  var state = {
    fam: null, color: null, slug: null,
    rim: SAMPLE.rim, base: SAMPLE.base, cx: 0.5,
    unit: 'in', glass: false, tilt: 0, flip: false,
    ratio: SAMPLE.ratio, usingPhoto: false
  };
  var lastColor = {};

  function panel(fam) { return root.querySelector('[data-fam="' + fam + '"]'); }

  function vaseCm() {
    var v = parseFloat(heightInput.value);
    if (!(v > 0)) v = state.unit === 'in' ? 8 : 20;
    return state.unit === 'in' ? v * 2.54 : v;
  }
  function fmt(cm) {
    var inch = cm / 2.54;
    var a = Math.round(inch * 2) / 2, b = Math.round(cm);
    return state.unit === 'in' ? a + ' in (' + b + ' cm)' : b + ' cm (' + a + ' in)';
  }

  function sizeCanvas() {
    var col = canvas.parentNode.clientWidth;
    var maxH = Math.max(300, window.innerHeight * (window.innerWidth <= 860 ? 0.5 : 0.74));
    var w = Math.min(col, maxH * state.ratio);
    canvas.style.width = w + 'px';
    canvas.style.height = (w / state.ratio) + 'px';
  }

  function layout() {
    var W = canvas.clientWidth, H = canvas.clientHeight;
    if (!W || !H) return;
    var rimY = state.rim * H, baseY = state.base * H;
    guides.rim.style.top = rimY + 'px';
    guides.base.style.top = baseY + 'px';
    clip.style.clipPath = state.glass ? 'none' : 'inset(0 0 ' + Math.max(0, H - rimY) + 'px 0)';
    var p = panel(state.fam);
    if (!p || !bouquet.naturalWidth) { readout.textContent = ''; return; }
    var stemCm = parseFloat(p.getAttribute('data-cm')) || 44;
    var vcm = vaseCm();
    var pxPerCm = Math.max(1, baseY - rimY) / vcm;
    var bh = stemCm * pxPerCm;
    var bw = bh * bouquet.naturalWidth / bouquet.naturalHeight;
    var bottom = baseY - 1 * pxPerCm; /* the stems rest on the inside floor */
    bouquet.style.width = bw + 'px';
    bouquet.style.height = bh + 'px';
    bouquet.style.left = (state.cx * W - bw / 2) + 'px';
    bouquet.style.top = (bottom - bh) + 'px';
    bouquet.style.transform = 'rotate(' + state.tilt + 'deg)' + (state.flip ? ' scaleX(-1)' : '');
    var above = stemCm - (vcm - 1);
    var name = p.getAttribute('data-name') + ', ' + state.color + ' · ' + p.getAttribute('data-set');
    readout.textContent = above > 0
      ? 'About ' + fmt(above) + ' above the rim · ' + name
      : 'The stems would sit below the rim of this vase · ' + name;
  }

  function setColor(fam, btn) {
    state.fam = fam;
    state.color = btn.getAttribute('data-color');
    state.slug = btn.getAttribute('data-slug');
    lastColor[fam] = btn;
    $$('[data-fam="' + fam + '"] .ssko-try__swatch').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
    bouquet.alt = panel(fam).getAttribute('data-name') + ' in ' + state.color + ', shown at approximate scale';
    bouquet.src = base + 'ssko-v105-cut-' + fam + '-' + state.slug + '.webp';
    var p = panel(fam);
    cta.href = '/?view=' + p.getAttribute('data-view') + '#color=' + encodeURIComponent(state.color).replace(/%20/g, '+');
    cta.firstChild.nodeValue = 'See ' + p.getAttribute('data-name') + ' in ' + state.color + ' ';
    try { history.replaceState(null, '', '#' + fam + '/' + state.slug); } catch (e) {}
  }

  function setFam(fam, preferSlug) {
    $$('[data-fam-tab]').forEach(function (t) { t.setAttribute('aria-selected', t.getAttribute('data-fam-tab') === fam ? 'true' : 'false'); });
    $$('[data-fam]').forEach(function (p) { p.hidden = p.getAttribute('data-fam') !== fam; });
    var btn = (preferSlug && root.querySelector('[data-fam="' + fam + '"] [data-slug="' + preferSlug + '"]')) || lastColor[fam] || root.querySelector('[data-fam="' + fam + '"] .ssko-try__swatch');
    if (btn) setColor(fam, btn);
  }

  /* dragging: guides move vertically, the bouquet moves sideways */
  function drag(el, onMove) {
    el.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      el.classList.add('is-dragging');
      var move = function (ev) {
        var r = canvas.getBoundingClientRect();
        onMove((ev.clientX - r.left) / r.width, (ev.clientY - r.top) / r.height);
        layout();
      };
      var up = function () {
        el.classList.remove('is-dragging');
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  }
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  drag(guides.rim, function (x, y) { state.rim = clamp(y, 0.04, state.base - 0.04); });
  drag(guides.base, function (x, y) { state.base = clamp(y, state.rim + 0.04, 0.99); });
  drag(bouquet, function (x) { state.cx = clamp(x, 0.05, 0.95); });
  ['rim', 'base'].forEach(function (k) {
    guides[k].addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowUp' ? -0.005 : e.key === 'ArrowDown' ? 0.005 : 0;
      if (!d) return;
      e.preventDefault();
      if (k === 'rim') state.rim = clamp(state.rim + d, 0.04, state.base - 0.04);
      else state.base = clamp(state.base + d, state.rim + 0.04, 0.99);
      layout();
    });
  });

  function useSample() {
    state.usingPhoto = false;
    photo.hidden = true;
    sample.style.display = '';
    state.ratio = SAMPLE.ratio; state.rim = SAMPLE.rim; state.base = SAMPLE.base; state.cx = 0.5;
    state.unit = 'in'; heightInput.value = SAMPLE.heightIn; syncUnits();
    sizeCanvas(); layout();
  }

  $('[data-file]').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var url = URL.createObjectURL(file);
    photo.onload = function () {
      state.usingPhoto = true;
      sample.style.display = 'none';
      photo.hidden = false;
      state.ratio = photo.naturalWidth / photo.naturalHeight || 0.8;
      state.rim = 0.55; state.base = 0.85; state.cx = 0.5;
      sizeCanvas(); layout();
      guides.rim.focus({ preventScroll: true });
    };
    photo.src = url;
  });
  $('[data-use-sample]').addEventListener('click', useSample);

  function syncUnits() {
    $$('[data-unit]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-unit') === state.unit ? 'true' : 'false'); });
  }
  $$('[data-unit]').forEach(function (b) {
    b.addEventListener('click', function () {
      var u = b.getAttribute('data-unit');
      if (u === state.unit) return;
      var v = parseFloat(heightInput.value) || 8;
      heightInput.value = u === 'cm' ? Math.round(v * 2.54) : Math.round(v / 2.54 * 2) / 2;
      state.unit = u; syncUnits(); layout();
    });
  });
  heightInput.addEventListener('input', layout);
  glassInput.addEventListener('change', function () { state.glass = glassInput.checked; layout(); });
  tiltInput.addEventListener('input', function () { state.tilt = parseFloat(tiltInput.value) || 0; layout(); });
  $('[data-flip]').addEventListener('click', function () { state.flip = !state.flip; layout(); });
  $$('[data-fam-tab]').forEach(function (t) { t.addEventListener('click', function () { setFam(t.getAttribute('data-fam-tab')); }); });
  $$('.ssko-try__swatch').forEach(function (b) {
    b.addEventListener('click', function () { setColor(b.closest('[data-fam]').getAttribute('data-fam'), b); });
  });
  bouquet.addEventListener('load', layout);

  /* save a picture of the preview */
  function loadImg(src) {
    return new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = rej; i.src = src; });
  }
  $('[data-save]').addEventListener('click', function () {
    if (!bouquet.naturalWidth) return;
    var W = canvas.clientWidth, H = canvas.clientHeight;
    var bgPromise = state.usingPhoto
      ? Promise.resolve(photo)
      : loadImg(URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(sample)], { type: 'image/svg+xml' })));
    bgPromise.then(function (bg) {
      var natW = state.usingPhoto ? photo.naturalWidth : 1600;
      var outW = Math.min(2000, natW), outH = Math.round(outW / state.ratio);
      var k = outW / W;
      var c = document.createElement('canvas'); c.width = outW; c.height = outH;
      var x = c.getContext('2d');
      x.drawImage(bg, 0, 0, outW, outH);
      var rimY = state.rim * H, baseY = state.base * H;
      var pxPerCm = Math.max(1, baseY - rimY) / vaseCm();
      var stemCm = parseFloat(panel(state.fam).getAttribute('data-cm')) || 44;
      var bh = stemCm * pxPerCm, bw = bh * bouquet.naturalWidth / bouquet.naturalHeight;
      x.save();
      if (!state.glass) { x.beginPath(); x.rect(0, 0, outW, rimY * k); x.clip(); }
      x.translate(state.cx * W * k, (baseY - pxPerCm) * k);
      x.rotate(state.tilt * Math.PI / 180);
      if (state.flip) x.scale(-1, 1);
      x.drawImage(bouquet, -bw * k / 2, -bh * k, bw * k, bh * k);
      x.restore();
      x.font = '500 ' + Math.round(outW * 0.018) + 'px "Hanken Grotesk", Arial, sans-serif';
      x.fillStyle = 'rgba(29,20,24,.55)';
      x.textAlign = 'right';
      x.fillText('SSKOI · size preview', outW - outW * 0.03, outH - outW * 0.03);
      c.toBlob(function (blob) {
        var file = new File([blob], 'sskoi-in-your-vase.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: 'SSKOI in my vase' }).catch(function () {});
          return;
        }
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'sskoi-in-your-vase.png';
        document.body.appendChild(a); a.click(); a.remove();
      }, 'image/png');
    });
  });

  if ('ResizeObserver' in window) new ResizeObserver(function () { sizeCanvas(); layout(); }).observe(canvas.parentNode);
  else window.addEventListener('resize', function () { sizeCanvas(); layout(); });

  var hash = (location.hash || '').replace('#', '').split('/');
  var firstTab = root.querySelector('[data-fam-tab]');
  var startFam = panel(hash[0]) ? hash[0] : (firstTab && firstTab.getAttribute('data-fam-tab'));
  useSample();
  setFam(startFam, hash[1]);
})();
