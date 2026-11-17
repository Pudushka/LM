(() => {
  if (document.documentElement.dataset.sskoV09) return;
  document.documentElement.dataset.sskoV09 = 'true';
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Phones show equal cards that snap while swiping; a tap opens the color directly.
  const noHover = matchMedia('(hover: none)');

  // Home: "Every color" tabs and slices
  function initColors(band) {
    if (band.dataset.ready) return;
    band.dataset.ready = 'true';
    const tabs = Array.from(band.querySelectorAll('[role="tab"]'));
    const panels = Array.from(band.querySelectorAll('[role="tabpanel"]'));
    function activate(index, focus) {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      panels.forEach((panel, i) => { panel.hidden = i !== index; });
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index + (event.key === 'ArrowRight' ? 1 : -1);
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        activate((next + tabs.length) % tabs.length, true);
      });
    });
    band.querySelectorAll('.ssko-v09-slices').forEach((list) => {
      const slices = Array.from(list.querySelectorAll('.ssko-v09-slice'));
      const open = (slice) => slices.forEach((item) => item.classList.toggle('is-open', item === slice));
      slices.forEach((slice) => {
        const link = slice.querySelector('a');
        slice.addEventListener('mouseenter', () => { if (!noHover.matches) open(slice); });
        link.addEventListener('focus', () => open(slice));
      });
    });
  }

  // Flower pages: choose a color from #color=Name or from the "In every color" strip
  const choices = () => document.querySelector('[data-ssko-v07-choices]');
  function pick(name) {
    const fieldset = choices();
    if (!fieldset || !name) return false;
    const wanted = name.trim().toLowerCase();
    const input = Array.from(fieldset.querySelectorAll('input[type="radio"]')).find((item) => item.value.trim().toLowerCase() === wanted);
    if (!input) return false;
    if (!input.checked) {
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return true;
  }
  function fromHash() {
    const match = location.hash.match(/^#color=(.+)$/);
    if (match) pick(decodeURIComponent(match[1].replace(/\+/g, ' ')));
  }
  function syncStrip() {
    const current = choices()?.querySelector('input:checked')?.value;
    document.querySelectorAll('[data-ssko-v09-color]').forEach((link) => {
      const on = link.dataset.sskoV09Color === current;
      link.classList.toggle('is-current', on);
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }
  function initStrip() {
    document.querySelectorAll('[data-ssko-v09-color]').forEach((link) => {
      if (link.dataset.ready) return;
      link.dataset.ready = 'true';
      link.addEventListener('click', (event) => {
        const name = link.dataset.sskoV09Color;
        if (!pick(name)) return;
        event.preventDefault();
        history.replaceState(null, '', `#color=${encodeURIComponent(name)}`);
        syncStrip();
        document.querySelector('[data-ssko-v07-product]')?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
      });
    });
    const fieldset = choices();
    if (fieldset && !fieldset.dataset.sskoV09) {
      fieldset.dataset.sskoV09 = 'true';
      fieldset.addEventListener('change', syncStrip);
    }
  }

  function run() {
    document.querySelectorAll('[data-ssko-v09-colors]').forEach(initColors);
    initStrip();
    fromHash();
    syncStrip();
  }
  // Deferred scripts run before DOMContentLoaded; wait for it so the product script has set up its color choices.
  if (document.readyState === 'complete') run();
  else {
    document.addEventListener('DOMContentLoaded', run, { once: true });
    addEventListener('load', run, { once: true });
  }
  addEventListener('hashchange', () => { fromHash(); syncStrip(); });
  document.addEventListener('shopify:section:load', run);
})();
