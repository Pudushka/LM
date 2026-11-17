# Contact sheet of rendered outputs. Usage: python3 -I build/sheet2.py <out.jpg> <thumb height> <files...>
import sys
from PIL import Image
out, th, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
ims = []
for f in files:
    im = Image.open(f).convert('RGB'); im.thumbnail((10000, th)); ims.append(im)
W = 1900; rows = [[]]; x = 0
for im in ims:
    if x + im.width > W and rows[-1]: rows.append([]); x = 0
    rows[-1].append(im); x += im.width + 8
sheet = Image.new('RGB', (W, len(rows) * (th + 8) + 8), '#333'); y = 8
for r in rows:
    x = 8
    for im in r: sheet.paste(im, (x, y)); x += im.width + 8
    y += th + 8
sheet.save(out, quality=80); print(out, sheet.size)
