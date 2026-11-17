# Contact sheets of the downloaded sources, for choosing shots. Usage: python3 -I build/sheet.py
import sys, os, glob
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def sheet(rows, out, tw, th, label=True):
    cols = max(len(r[1]) for r in rows)
    W = cols * (tw + 6) + 6; H = len(rows) * (th + 26) + 6
    im = Image.new('RGB', (W, H), '#222'); d = ImageDraw.Draw(im)
    for y, (name, files) in enumerate(rows):
        d.text((8, y * (th + 26) + 6), name, fill='#fff')
        for x, f in enumerate(files):
            t = Image.open(f).convert('RGB'); t.thumbnail((tw, th))
            im.paste(t, (6 + x * (tw + 6), y * (th + 26) + 24))
    im.save(out, quality=82); print(out, im.size)
os.makedirs(ROOT + '/check', exist_ok=True)
for fam in ['tulip', 'classic', 'ranunculus']:
    rows = []
    for d in sorted(glob.glob(f'{ROOT}/raw/listing/{fam}-*')):
        rows.append((os.path.basename(d), sorted(glob.glob(d + '/*.jpg'))))
    sheet(rows, f'{ROOT}/check/listing-{fam}.jpg', 250, 250)
for fam in ['austin6', 'austin66']:
    rows = []
    for d in sorted(glob.glob(f'{ROOT}/raw/aplus/{fam}-*')):
        fs = sorted(glob.glob(d + '/Source-AI-Photo-Plates_REVIEW/*.jpg'))
        rows.append((os.path.basename(d) + '  ' + ' '.join(str(Image.open(f).size) for f in fs[:2]), fs))
    sheet(rows, f'{ROOT}/check/aplus-{fam}.jpg', 330, 210)
