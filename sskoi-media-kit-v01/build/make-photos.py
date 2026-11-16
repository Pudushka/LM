"""Clean crops with no text, for website sections and ads.
Each source photograph is cut to 4:5 (feed) and, where the composition allows, 16:9 (website banner)."""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, OUT = os.path.join(ROOT, 'src'), os.path.join(ROOT, 'out', 'photo')
V = 'v01_REVIEW'

# name: (family id, shot label, focal x, focal y, make a 16:9 too, 16:9 focal y)
SHOTS = {
    'tulip-still':       ('Tulip_White', 'Still-Life', .45, .45, True, .42),
    'tulip-detail':      ('Tulip_White', 'Petal-Detail', .50, .46, False, 0),
    'tulip-vase':        ('Tulip_White', 'Vase-Scene', .50, .50, False, 0),
    'tulip-stem':        ('Tulip_White', 'Single-Stem', .45, .50, False, 0),
    'classic-still':     ('Classic-Rose_Coral', 'Still-Life', .56, .50, True, .50),
    'classic-detail':    ('Classic-Rose_Coral', 'Petal-Detail', .42, .50, True, .52),
    'classic-vase':      ('Classic-Rose_Coral', 'Vase-Scene', .50, .50, False, 0),
    'classic-bud':       ('Classic-Rose_Coral', 'Flower-and-Bud', .62, .55, True, .56),
    'ranunculus-still':  ('Ranunculus_Light-Peach', 'Still-Life', .58, .52, True, .52),
    'ranunculus-detail': ('Ranunculus_Light-Peach', 'Petal-Detail', .42, .58, True, .62),
    'ranunculus-vase':   ('Ranunculus_Light-Peach', 'Vase-Scene', .49, .50, False, 0),
    'ranunculus-bud':    ('Ranunculus_Light-Peach', 'Flower-and-Bud', .55, .50, True, .52),
    'austin-vase':       ('Austin-Rose_Baby-Pink', 'Vase-Scene', .60, .50, False, 0),
    'austin-detail':     ('Austin-Rose_Baby-Pink', 'Petal-Detail', .50, .50, False, 0),
    'austin-stems':      ('Austin-Rose_Baby-Pink', 'Six-Stems', .52, .50, True, .50),
    'austin-stem':       ('Austin-Rose_Baby-Pink', 'Single-Stem', .72, .50, False, 0),
}


def crop(im, aspect, fx, fy):
    w, h = im.size
    cw, ch = (w, w / aspect) if w / h < aspect else (h * aspect, h)
    x0 = min(max(fx * w - cw / 2, 0), w - cw)
    y0 = min(max(fy * h - ch / 2, 0), h - ch)
    return im.crop((round(x0), round(y0), round(x0 + cw), round(y0 + ch)))


os.makedirs(OUT, exist_ok=True)
n = 0
for name, (fam, shot, fx, fy, wide, wfy) in SHOTS.items():
    im = Image.open(os.path.join(SRC, name + '.jpg')).convert('RGB')
    crop(im, 4 / 5, fx, fy).resize((1080, 1350), Image.LANCZOS).save(
        os.path.join(OUT, f'SSKOI_{fam}_Photo-{shot}_4x5_{V}.jpg'), quality=93, subsampling=0)
    n += 1
    if wide:
        crop(im, 16 / 9, fx, wfy).resize((1920, 1080), Image.LANCZOS).save(
            os.path.join(OUT, f'SSKOI_{fam}_Photo-{shot}_16x9_{V}.jpg'), quality=92, subsampling=0)
        n += 1
print(n, 'photos')
