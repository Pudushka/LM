(() => {
  const book = document.querySelector('[data-ssko-v10-book]');
  if (!book || book.dataset.ready) return;
  book.dataset.ready = 'true';
  const state = { room: '', palette: '', scale: '' };
  const groups = Array.from(book.querySelectorAll('[data-filter]'));
  const items = Array.from(book.querySelectorAll('.ssko-v10-recipe, .ssko-v10-contents li'));
  const count = book.querySelector('[data-ssko-v10-count]');
  const empty = book.querySelector('[data-ssko-v10-empty]');

  function apply() {
    let shown = 0;
    items.forEach((el) => {
      const match = Object.entries(state).every(([key, value]) => !value || el.dataset[key] === value);
      el.hidden = !match;
      if (match && el.matches('.ssko-v10-recipe')) shown += 1;
    });
    count.textContent = shown === 1 ? '1 recipe' : `${shown} recipes`;
    empty.hidden = shown > 0;
    // Keep photos alternating left and right among the recipes still shown.
    let index = 0;
    book.querySelectorAll('.ssko-v10-recipe').forEach((recipe) => {
      if (recipe.hidden) return;
      recipe.classList.toggle('is-flip', index % 2 === 1);
      index += 1;
    });
  }
  function press(group, value) {
    group.querySelectorAll('button[data-value]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.value === value)));
  }
  groups.forEach((group) => {
    group.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-value]');
      if (!button) return;
      state[group.dataset.filter] = button.dataset.value;
      press(group, button.dataset.value);
      apply();
    });
  });
  book.querySelector('[data-ssko-v10-reset]')?.addEventListener('click', () => {
    Object.keys(state).forEach((key) => { state[key] = ''; });
    groups.forEach((group) => press(group, ''));
    apply();
  });
})();
