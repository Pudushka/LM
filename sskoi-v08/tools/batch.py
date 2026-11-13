import sys, os, glob
from multiprocessing import Pool
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cutout import cutout
SRC, DST = sys.argv[1], sys.argv[2]
PALE = set(sys.argv[3].split(',')) if len(sys.argv) > 3 and sys.argv[3] else set()
def run(p):
    n = os.path.splitext(os.path.basename(p))[0]
    m = cutout(p, os.path.join(DST, n + '.webp'), pale=n in PALE)
    return n, round(m, 3)
if __name__ == '__main__':
    files = sorted(glob.glob(os.path.join(SRC, '*')))
    with Pool(4) as pool:
        for n, m in pool.imap_unordered(run, files): print(n, m, flush=True)
