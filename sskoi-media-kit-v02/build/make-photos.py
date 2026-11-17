# Text-free crops of every source photograph: 4:5 (1080x1350), 16:9 (1920x1080) and 9:16 (1080x1920).
# Usage: python3 -I build/make-photos.py [family]     Writes out/photo/<Family>/ and build/manifest-photos.json
import json, os, sys
from PIL import Image, ImageFilter
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAT = json.load(open(ROOT + '/build/catalog.json'))
V = 'v02_REVIEW'
SIZES = {'1x1': (1080, 1080), '4x5': (1080, 1350), '16x9': (1920, 1080), '9x16': (1080, 1920)}

# (shot label, source shot, ratio, focal x, focal y, zoom)
PLAN = {
  'tulip': [('Vase', 'vase', '4x5', .50, .5, 1), ('Petal-Detail', 'detail', '4x5', .50, .5, 1),
            ('Still-Life', 'still', '16x9', .5, .30, 1), ('Single-Stem', 'stem', '16x9', .5, .28, 1)],
  'classic': [('Vase', 'vase', '4x5', .47, .5, 1), ('Petal-Detail', 'detail', '4x5', .40, .5, 1),
              ('Still-Life', 'still', '16x9', .5, .58, 1), ('Flower-and-Bud', 'bud', '16x9', .5, .55, 1)],
  'ranunculus': [('Vase', 'vase', '4x5', .47, .5, 1), ('Petal-Detail', 'detail', '4x5', .42, .5, 1),
                 ('Still-Life', 'still', '16x9', .5, .56, 1), ('Flower-and-Bud', 'bud', '16x9', .5, .5, 1)],
  'austin6': [('Vase', 'vase', '16x9', .5, .45, 1), ('Flat-Lay', 'flatlay', '16x9', .5, .55, 1), ('Room', 'room', '16x9', .5, .45, 1),
              ('Petal-Detail', 'macro', '4x5', .27, .5, 1), ('Single-Stem', 'stem', '4x5', .76, .5, 1)],
  'austin66': [('Vase', 'vase', '16x9', .5, .42, 1), ('Petal-Detail', 'macro', '16x9', .5, .5, 1), ('Petal-Detail', 'macro', '4x5', .63, .5, 1),
               ('Arch', 'arch', '1x1', .56, .5, 1), ('Flat-Lay', 'flatlay', '1x1', .5, .5, 1)],
  'gift': [('Vase-Styling', 'styling', '4x5', .5, .5, 1), ('Vase-Styling', 'styling', '16x9', .5, .38, 1)],
}
GIFT_X = {'Coral': .47, 'Red': .52, 'Burgundy': .5, 'Mauve Pink': .5, 'Purple': .5, 'White': .52, 'White With Pink Tip': .5}
GIFT_Y = {'Coral': .40, 'Red': .40, 'Burgundy': .36, 'Mauve Pink': .42, 'Purple': .38, 'White': .37, 'White With Pink Tip': .38}
# scenes: series -> [(ratio, fx, fy)]
SCENE_PLAN = {'wabi': [('9x16', .5, .5), ('4x5', .5, .40)], 'slat': [('9x16', .5, .5), ('4x5', .5, .62)]}
SCENE_FY = {('wabi', 'Entry-Console'): .42, ('wabi', 'Dinner-Table'): .36, ('wabi', 'Kitchen-Ledge'): .42, ('wabi', 'Reading-Table'): .45, ('wabi', 'Mantel'): .36}

def crop(src, ratio, fx, fy, zoom=1.0):
    im = Image.open(src).convert('RGB'); W, H = im.size
    w, h = SIZES[ratio]; r = w / h
    cw, ch = (W, W / r) if W / H <= r else (H * r, H)
    cw, ch = cw / zoom, ch / zoom
    x = min(max(fx * W - cw / 2, 0), W - cw); y = min(max(fy * H - ch / 2, 0), H - ch)
    box = tuple(int(round(v)) for v in (x, y, x + cw, y + ch))
    out = im.crop(box).resize((w, h), Image.LANCZOS)
    scale = w / cw
    if scale > 1.08: out = out.filter(ImageFilter.UnsharpMask(radius=1.4, percent=55, threshold=2))
    return out, (box[2] - box[0], box[3] - box[1]), round(scale, 2)

def save(im, d, name):
    os.makedirs(d, exist_ok=True)
    p = f'{d}/{name}.jpg'; im.save(p, 'JPEG', quality=88, optimize=True, progressive=True); return p

rows = []; only = sys.argv[1] if len(sys.argv) > 1 else None
for key, fam in CAT['families'].items():
    if only and key != only: continue
    d = f"{ROOT}/out/photo/{fam['token']}_{fam['set']}"
    for colour, c in fam['colours'].items():
        for label, shot, ratio, fx, fy, zoom in PLAN[key]:
            if key == 'gift': fx = GIFT_X[colour]; fy = GIFT_Y[colour] if ratio == '16x9' else .5
            src = c['shots'][shot]
            im, px, scale = crop(src, ratio, fx, fy, zoom)
            name = f"SSKOI_{fam['token']}_{c['token']}_{fam['set']}_Photo-{label}_{ratio}_{V}"
            p = save(im, d, name)
            rows.append(dict(file=os.path.relpath(p, ROOT), type='Photo', layout='Photo', ratio=ratio, size='x'.join(map(str, SIZES[ratio])), family=fam['token'], set=fam['set'],
                             colour=colour, asin=c['asin'], asin_check=c['asin_check'], shot=label, source=os.path.basename(os.path.dirname(src)) + '/' + os.path.basename(src) if key.startswith('austin') else os.path.basename(src),
                             source_px='x'.join(map(str, px)), scale=scale))
if not only or only == 'scenes':
    for s in CAT['scenes']:
        fam = CAT['families'][s['family']]; d = f"{ROOT}/out/photo/Scenes"
        series = 'Wabi-Sabi' if s['series'] == 'wabi' else 'Wood-Slat'
        for ratio, fx, fy in SCENE_PLAN[s['series']]:
            fy = SCENE_FY.get((s['series'], s['place']), fy) if ratio == '4x5' else fy
            im, px, scale = crop(s['file'], ratio, fx, fy)
            place = s['place'] if s['series'] == 'wabi' else 'Side-Table'
            name = f"SSKOI_{fam['token']}_{s['colour'].replace(' ', '-')}_{s['set']}_Scene-{series}-{place}_{ratio}_{V}"
            p = save(im, d, name)
            rows.append(dict(file=os.path.relpath(p, ROOT), type='Photo', layout='Scene', ratio=ratio, size='x'.join(map(str, SIZES[ratio])), family=fam['token'], set=s['set'],
                             colour=s['colour'], asin=s['asin'], asin_check='文件名标注', shot=f'{series} {place}', source=os.path.basename(s['file']), source_px='x'.join(map(str, px)), scale=scale))
if not only:
    json.dump(rows, open(ROOT + '/build/manifest-photos.json', 'w'), indent=1, ensure_ascii=False)
print(len(rows), 'photos')
