// Content for the SSKOI media kit. Facts (stem counts, colour names) come from the SKU sheet and the
// v06 site copy; photographs come from the v19 listing set, the Austin v15 panels and the v06 scenes.
const slug = s => s.toLowerCase().replace(/ with /g, ' ').replace(/ /g, '-');
const SRC = '../../src/';
const CUT = '../../../sskoi-v08/assets/';

const FAMILIES = {
  austin: { label: 'Austin roses', short: 'Austin', hero: 'Baby Pink', set: '6 stems', n: 'seven',
    colours: ['White', 'Baby Pink', 'Light Peach', 'Purple', 'Pink', 'Hot Pink', 'Red'], cols: 4, ch: 360 },
  tulip: { label: 'Tulips', short: 'Tulip', hero: 'White', set: '15 stems', n: 'ten',
    colours: ['White', 'White With Blue Tip', 'Yellow', 'Peach', 'Orange', 'Green With Pink Tip', 'Pink', 'Hot Pink', 'Red', 'Dark Purple'], cols: 4, ch: 228 },
  classic: { label: 'Classic roses', short: 'Classic', hero: 'Coral', set: '6 stems', n: 'six',
    colours: ['Coral', 'Mauve', 'Burgundy', 'Purple', 'White With Pink Tip', 'White'], cols: 3, ch: 372 },
  ranunculus: { label: 'Ranunculus', short: 'Ranunculus', hero: 'Light Peach', set: '4 stems', n: 'seven',
    colours: ['Light Peach', 'White', 'Baby Pink', 'Pink', 'Hot Pink', 'Orange', 'Purple'], cols: 4, ch: 350 },
  gift: { label: 'The gift box', short: 'Gift box', hero: 'Coral', set: '8 stems and a box', n: 'seven',
    colours: ['Coral', 'Mauve Pink', 'Red', 'Burgundy', 'Purple', 'White With Pink Tip', 'White'], cols: 4, ch: 360 },
};
const cut = (fam, colour, size = 'm') => `${CUT}${size}/${fam}-${slug(colour)}.webp`;
const trim = (fam, colour) => `../../cut/${fam}-${slug(colour)}.webp`;

const COVERS = [
  { id: 'Brand_In-Bloom', photo: SRC + 'ssko-v6-hero.webp', pos: '100% 50%', l1: 'In bloom,', l2: 'all year.', meta: 'Faux flowers for real homes' },
  { id: 'Tulip_White', photo: SRC + 'tulip-vase.jpg', pos: '50% 50%', l1: 'White', l2: 'tulips.', meta: 'Faux tulips · 15 stems · 10 colours' },
  { id: 'Classic-Rose_Coral', photo: SRC + 'classic-still.jpg', pos: '58% 50%', l1: 'Coral', l2: 'roses.', meta: 'Classic roses · 6 stems · 6 colours' },
  { id: 'Ranunculus_Light-Peach', photo: SRC + 'ranunculus-still.jpg', pos: '62% 50%', l1: 'Light peach', l2: 'ranunculus.', meta: 'Flocked ranunculus · 4 stems · 7 colours', h: 138 },
  { id: 'Austin-Rose_Baby-Pink', photo: SRC + 'austin-detail.jpg', pos: '50% 40%', l1: 'Baby pink', l2: 'Austin roses.', meta: 'Austin roses · 6 stems · 7 colours', h: 132 },
];

const PLATES = [
  { id: 'Tulip_White', photo: SRC + 'tulip-detail.jpg', pos: '50% 46%', name: 'White', em: 'tulip', meta: 'Finely ribbed petals' },
  { id: 'Classic-Rose_Coral', photo: SRC + 'classic-detail.jpg', pos: '42% 50%', name: 'Coral', em: 'rose', meta: 'One open rose and two buds on every stem' },
  { id: 'Ranunculus_Light-Peach', photo: SRC + 'ranunculus-detail.jpg', pos: '40% 60%', name: 'Light peach', em: 'ranunculus', meta: 'Layered petals, flocked leaves', h: 72 },
  { id: 'Austin-Rose_Baby-Pink', photo: SRC + 'austin-detail.jpg', pos: '50% 50%', name: 'Baby pink<br>', em: 'Austin rose', meta: 'Layered petals around pale stamens', h: 72 },
];

const NOTES = [
  { id: 'Tulip_White', a: SRC + 'tulip-vase.jpg', pa: '50% 30%', b: SRC + 'tulip-stem.jpg', pb: '30% 20%', kicker: 'Styling note · Tulips',
    head: 'A narrow vase <em>keeps them gathered.</em>', body: 'Start with the shape you want. A narrow opening keeps tulips gathered.' },
  { id: 'Classic-Rose_Coral', a: SRC + 'classic-vase.jpg', pa: '50% 34%', b: SRC + 'classic-bud.jpg', pb: '30% 40%', kicker: 'Styling note · Classic roses',
    head: 'Let the buds <em>rise.</em>', body: 'Let a few buds rise above the open blooms to give a low arrangement an irregular outline.' },
  { id: 'Ranunculus_Light-Peach', a: SRC + 'ranunculus-vase.jpg', pa: '50% 36%', b: SRC + 'ranunculus-bud.jpg', pb: '70% 60%', kicker: 'Styling note · Ranunculus',
    head: 'Turn the flowers <em>apart.</em>', body: 'Angle the two flowers on each stem away from each other to reveal the shape of the buds and leaves.' },
  { id: 'Austin-Rose_Baby-Pink', a: SRC + 'austin-stems.jpg', pa: '50% 50%', b: SRC + 'austin-stem.jpg', pb: '78% 30%', kicker: 'Styling note · Austin roses',
    head: 'Low and <em>wide.</em>', body: 'Try a low, wide-necked vase. Turn the blooms at different angles and let a few leaves break the outline.' },
];

const STATEMENTS = [
  { id: 'Brand_In-Bloom', bg: 'var(--blush)', fg: 'var(--ink)', em: 'var(--ink)', l1: 'In bloom,', l2: 'all year.', cut: cut('austin', 'Baby Pink', 'p'),
    cx: 330, cy: 300, cw: 1000, ty: 170, foot: 'Display them dry, in any room, for as long as you like.', tag: 'Austin roses · Baby Pink' },
  { id: 'Classic-Rose_Coral', bg: 'var(--paper)', fg: 'var(--ink)', em: 'var(--coral)', l1: 'Six stems.', l2: 'Twelve buds.', cut: cut('classic', 'Coral', 'p'),
    cx: 30, cy: 400, cw: 1020, ty: 170, h: 168, foot: 'Every Classic rose stem carries one open rose and two buds.', tag: 'Classic roses · Coral' },
  { id: 'Gift-Box_Coral', bg: 'var(--paper-2)', fg: 'var(--ink)', em: 'var(--ink)', l1: 'The box', l2: 'becomes the vase.', cut: cut('gift', 'Coral', 'p'),
    cx: 170, cy: 396, cw: 800, ty: 170, h: 132, foot: 'Eight faux rose stems in a printed paper box that opens into a standing vase.', tag: 'Rose gift box · Coral' },
];

const STORIES = [
  { id: 'Brand_In-Bloom', photo: SRC + 'ssko-v6-hero.webp', pos: '100% 50%', l1: 'In bloom,', l2: 'all year.', meta: 'Faux flowers for real homes' },
  { id: 'Tulip_White', photo: SRC + 'tulip-vase.jpg', pos: '50% 50%', l1: 'White', l2: 'tulips.', meta: 'Faux tulips · 15 stems · 10 colours' },
  { id: 'Classic-Rose_Coral', photo: SRC + 'classic-vase.jpg', pos: '50% 50%', l1: 'Coral', l2: 'roses.', meta: 'Classic roses · 6 stems · 6 colours' },
  { id: 'Ranunculus_Light-Peach', photo: SRC + 'ranunculus-vase.jpg', pos: '48% 50%', l1: 'Light peach', l2: 'ranunculus.', meta: 'Flocked ranunculus · 4 stems · 7 colours', h: 100 },
  { id: 'Austin-Rose_Baby-Pink', photo: SRC + 'austin-vase.jpg', pos: '60% 50%', l1: 'Baby pink', l2: 'Austin roses.', meta: 'Austin roses · 6 stems · 7 colours', h: 98 },
];

module.exports = { slug, SRC, CUT, FAMILIES, cut, trim, COVERS, PLATES, NOTES, STATEMENTS, STORIES };
