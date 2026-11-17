# Web asset pack for the site integration mockups: WebP crops at the exact ratios the new sections use.
# Sources: media kit v02 raw photos (Listing v19, A+ v18, Codex room scenes) and, for the gift box, the live site's own images.
# Usage: python3 -I build/make-web.py        Writes web/<group>/<name>.webp and web/manifest.json
import json, os
from PIL import Image, ImageStat
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = os.path.abspath(ROOT + '/../sskoi-media-kit-v02')
CAT = json.load(open(KIT + '/build/catalog.json'))
F = CAT['families']
rows = []

def crop(src, ratio, fx=.5, fy=.5, zoom=1.0):
    im = Image.open(src).convert('RGB'); W, H = im.size; r = ratio[0] / ratio[1]
    cw, ch = (W, W / r) if W / H <= r else (H * r, H)
    cw, ch = cw / zoom, ch / zoom
    x = min(max(fx * W - cw / 2, 0), W - cw); y = min(max(fy * H - ch / 2, 0), H - ch)
    return im.crop((int(x), int(y), int(x + cw), int(y + ch)))

def save(im, group, name, width, src, note=''):
    d = f'{ROOT}/web/{group}'; os.makedirs(d, exist_ok=True)
    out = []
    for w in (width, width // 2):
        h = round(im.height * w / im.width)
        p = f'{d}/{name}-{w}.webp'
        im.resize((w, h), Image.LANCZOS).save(p, 'WEBP', quality=80, method=6)
        out.append(os.path.relpath(p, ROOT))
    rows.append(dict(group=group, name=name, files=out, source=os.path.relpath(src, KIT) if src.startswith(KIT) else os.path.basename(src), note=note))
    return out

def swatch(im):
    c = im.crop((int(im.width * .3), int(im.height * .3), int(im.width * .7), int(im.height * .6)))
    return '#%02x%02x%02x' % tuple(int(v) for v in ImageStat.Stat(c).median)

S = lambda k, c, shot: F[k]['colours'][c]['shots'][shot]
scene = {s['family']: s for s in CAT['scenes'] if s['series'] == 'wabi'}
slat = {s['family']: s for s in CAT['scenes'] if s['series'] == 'slat'}

# 1. Find-your-flowers rows: one room or vase photo and one close-up per set (4:5)
ROW = {
  'austin': (S('austin6', 'Baby Pink', 'vase'), .70, .5, S('austin6', 'Baby Pink', 'macro'), .26, .5),
  'tulip': (scene['tulip']['file'], .70, .42, S('tulip', 'White', 'detail'), .5, .5),
  'classic': (S('classic', 'Coral', 'vase'), .47, .5, S('classic', 'Coral', 'bud'), .62, .5),
  'ranunculus': (S('ranunculus', 'Light Peach', 'vase'), .47, .5, S('ranunculus', 'Light Peach', 'detail'), .4, .6),
  'gift': (ROOT + '/live/ssko-v072-gift-coral-set.webp', .5, .5, scene['gift']['file'], .26, .42),
}
for k, (a, ax, ay, b, bx, by) in ROW.items():
    save(crop(a, (4, 5), ax, ay), 'rows', f'{k}-room', 720, a)
    save(crop(b, (4, 5), bx, by), 'rows', f'{k}-close', 720, b)

# 2. Colour card slices (2:3) and swatch colours for all 37 site colours
SITE = {'austin': 'austin6', 'tulip': 'tulip', 'classic': 'classic', 'ranunculus': 'ranunculus'}
sw = {}
for site_key, k in SITE.items():
    shot, fx = ('macro', .26) if k == 'austin6' else ('detail', .5 if k == 'tulip' else .42)
    fy = .62 if k == 'ranunculus' else .5
    for c, v in F[k]['colours'].items():
        im = crop(v['shots'][shot], (2, 3), fx, fy, 1.15)
        save(im, 'colour', f"{site_key}-{v['slug']}", 600, v['shots'][shot])
        sw[f"{site_key}/{c}"] = swatch(im)
for c, v in F['gift']['colours'].items():
    p = f"{ROOT}/live/ssko-v072-gift-{v['slug'] if v['slug'] != 'white-pink-tip' else 'white-with-pink-tip'}-set.webp"
    if not os.path.exists(p): print('missing', p); continue
    im = crop(p, (2, 3), .36, .3, 1.6)
    save(im, 'colour', f"gift-{v['slug']}", 600, p, 'live site image (paper vase set)')
    sw[f"gift/{c}"] = swatch(im)

# 3. Rooms: the five wabi-sabi rooms and five wood-slat side tables (4:5)
FY = {'Dinner-Table': .45, 'Kitchen-Ledge': .45, 'Reading-Table': .5, 'Mantel': .4, 'Entry-Console': .45}
FX = {'Dinner-Table': .38, 'Kitchen-Ledge': .62, 'Reading-Table': .6, 'Mantel': .36, 'Entry-Console': .3}
for s in CAT['scenes']:
    # Wood-slat scenes for Austin, Tulip, Classic and Ranunculus are mixed bouquets (white tulips, a peach rose): NEEDS-FIX, not for single-set pages
    if s['series'] != 'wabi' and s['family'] != 'gift': continue
    name = f"{s['family'].replace('austin6', 'austin')}-{s['colour'].lower().replace(' ', '-')}-{'wabi-' + s['place'].lower() if s['series'] == 'wabi' else 'slat-side-table'}"
    if s['series'] == 'wabi': im = crop(s['file'], (4, 5), FX[s['place']], FY[s['place']])
    else: im = crop(s['file'], (4, 5), .5, .55)
    save(im, 'rooms', name, 900, s['file'], 'Codex scene, REVIEW')

# 4. Look closer plates (4:5)
CL = [('classic-coral-bud', S('classic', 'Coral', 'bud'), .6, .5), ('ranunculus-light-peach-bud', S('ranunculus', 'Light Peach', 'bud'), .62, .55),
      ('tulip-peach-petal', S('tulip', 'Peach', 'detail'), .5, .5), ('austin-light-peach-petal', S('austin6', 'Light Peach', 'macro'), .26, .5),
      ('classic-coral-petal', S('classic', 'Coral', 'detail'), .4, .5), ('classic-coral-still', S('classic', 'Coral', 'still'), .55, .5)]
for n, p, fx, fy in CL: save(crop(p, (4, 5), fx, fy), 'closer', n, 900, p)

# 4b. Flower-page "Up close" trio for each set's default colour (4:5). Tulips: single-flower shots and the live 12-stem set only
L = ROOT + '/live/'
TRIO = [('austin-baby-pink-petal', S('austin6', 'Baby Pink', 'macro'), .26, .5), ('austin-baby-pink-stem', S('austin6', 'Baby Pink', 'stem'), .68, .5),
        ('austin-baby-pink-flatlay', S('austin6', 'Baby Pink', 'flatlay'), .72, .5),
        ('austin-baby-pink-room', S('austin6', 'Baby Pink', 'room'), .55, .5), ('classic-coral-vase', S('classic', 'Coral', 'vase'), .47, .5),
        ('ranunculus-light-peach-vase', S('ranunculus', 'Light Peach', 'vase'), .47, .5),
        ('tulip-white-petal', S('tulip', 'White', 'detail'), .5, .5), ('tulip-white-stem', S('tulip', 'White', 'stem'), .5, .5),
        ('tulip-white-set', L + 'ssko-v072-tulip-white-set.webp', .5, .5),
        ('ranunculus-light-peach-petal', S('ranunculus', 'Light Peach', 'detail'), .4, .6), ('ranunculus-light-peach-still', S('ranunculus', 'Light Peach', 'still'), .5, .5),
        ('gift-coral-petal', L + 'ssko-v072-gift-coral-detail.webp', .5, .5), ('gift-coral-paper-vase', L + 'ssko-v072-gift-coral-set.webp', .5, .5),
        ('gift-coral-styled', S('gift', 'Coral', 'styling'), .5, .5)]
for n, p, fx, fy in TRIO: save(crop(p, (4, 5), fx, fy), 'closer', n, 900, p, 'live site image' if p.startswith(L) else '')

# 5. Statement cut-outs (transparent WebP, already cut for v08)
for n in ('classic-coral', 'ranunculus-orange', 'tulip-pink', 'austin-baby-pink'):
    p = os.path.abspath(ROOT + f'/../sskoi-v08/assets/p/{n}.webp'); im = Image.open(p).convert('RGBA'); bb = im.getbbox(); im = im.crop(bb)
    d = f'{ROOT}/web/cutout'; os.makedirs(d, exist_ok=True); im.thumbnail((900, 900)); im.save(f'{d}/{n}-900.webp', 'WEBP', quality=82, method=6)
    rows.append(dict(group='cutout', name=n, files=[f'web/cutout/{n}-900.webp'], source=f'sskoi-v08/assets/p/{n}.webp', note='listing main image, background removed'))

json.dump(dict(files=rows, swatches=sw), open(ROOT + '/web/manifest.json', 'w'), indent=1)
print(len(rows), 'images', sum(len(r['files']) for r in rows), 'files')
