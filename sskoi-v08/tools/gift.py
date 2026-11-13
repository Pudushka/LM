import sys, os, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cutout import cutout
SRC, DST = sys.argv[1], sys.argv[2]
for p in sorted(glob.glob(os.path.join(SRC, '*.webp'))):
    n = os.path.splitext(os.path.basename(p))[0]
    print(n, round(cutout(p, os.path.join(DST, n + '.webp'), size=1050, pale=n in ('gift-white',)), 3), flush=True)
