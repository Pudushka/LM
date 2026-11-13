"""Turn a white-background product photo into an RGBA cutout.
Background-connected smooth light pixels become transparent; grey studio shadows
become semi-transparent dark so they survive on any backdrop. Object pixels are untouched.
pale=True adds a protection pass for white flowers whose blown-out petals merge with the background."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter

def _img(m):
    return Image.fromarray((m * 255).astype(np.uint8)).convert('L')

def _blur(m, r):
    return np.asarray(_img(m).filter(ImageFilter.GaussianBlur(r))).astype(np.float32) / 255.0

def cutout(src, dst, size=1200, light=0.70, sat_max=0.075, grad_max=0.022, pale=False, close_r=26, debug=None):
    im = Image.open(src).convert('RGB')
    if im.size != (size, size):
        im = im.resize((size, size), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255.0
    # white point: some studio backgrounds sit just below pure white, which would leave a faint box
    edge = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
    wp = float(np.median(edge.min(1)))
    if 0.90 < wp < 0.999:
        a = np.clip(a / wp, 0, 1)
    mn, mx = a.min(2), a.max(2)
    sat = mx - mn
    lum = a.mean(2)
    g = [np.abs(np.diff(lum, axis=1, prepend=lum[:, :1])), np.abs(np.diff(lum, axis=0, prepend=lum[:1, :])),
         np.abs(np.diff(lum, axis=1, append=lum[:, -1:])), np.abs(np.diff(lum, axis=0, append=lum[-1:, :]))]
    grad = np.maximum(np.maximum(g[0], g[1]), np.maximum(g[2], g[3]))
    cand = (mn > light) & (sat < sat_max) & (grad < grad_max)
    pim = _img(np.pad(cand, 1, constant_values=True)).copy()
    ImageDraw.floodfill(pim, (0, 0), 128, thresh=0)
    M = (np.asarray(pim)[1:-1, 1:-1] == 128)
    if pale:
        pass
    else:
        # enclosed pure-white gaps between stems and leaves are background too
        holes = cand & ~M & (mn > 0.93)
        M = M | holes
    grown = np.asarray(_img(M).filter(ImageFilter.MaxFilter(5))) > 0
    rim = grown & ~M & (mn > 0.55)
    W = _blur(M | rim, 0.9)
    W = np.where(M, 1.0, W)
    if pale:
        # white flowers: every bright neutral pixel takes the backdrop tint (like printing on tinted
        # paper), so petals the fill reached and petals it missed look the same
        t = np.clip((mn - 0.80) / 0.10, 0, 1) * np.clip((0.12 - sat) / 0.04, 0, 1)
        W = np.maximum(W, _blur(t, 0.8))
    alpha = np.clip(1.0 - W * mn, 0, 1)
    # fade background shadow out toward the frame so no box edge survives on a tinted page
    yy, xx = np.mgrid[0:size, 0:size]
    d = np.minimum(np.minimum(xx, size - 1 - xx), np.minimum(yy, size - 1 - yy)) / (0.08 * size)
    f = np.clip(d, 0, 1); f = f * f * (3 - 2 * f)
    alpha = np.where(M, alpha * f, alpha)
    col = np.clip((a - (1 - alpha[..., None])) / np.maximum(alpha, 1e-3)[..., None], 0, 1)
    col = np.where((W > 0.98)[..., None], 0.12, col)
    out = Image.fromarray((np.dstack([col, alpha]) * 255 + 0.5).astype(np.uint8))
    out.save(dst, 'WEBP', quality=84, method=6)
    if debug:
        sheet = Image.new('RGB', (size * 3, size))
        for i, bg in enumerate([(0xcf, 0xb9, 0xb3), (0xed, 0xe4, 0xe1), (0x1d, 0x14, 0x18)]):
            b = Image.new('RGBA', (size, size), bg + (255,))
            sheet.paste(Image.alpha_composite(b, out).convert('RGB'), (i * size, 0))
        sheet.resize((size * 3 // 2, size // 2), Image.LANCZOS).save(debug, quality=85)
    return float(M.mean())

if __name__ == '__main__':
    pale = len(sys.argv) > 4 and sys.argv[4] == 'pale'
    print(round(cutout(sys.argv[1], sys.argv[2], pale=pale, debug=sys.argv[3] if len(sys.argv) > 3 else None), 3))
