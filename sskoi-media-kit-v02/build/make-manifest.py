# Merges the per-script manifests into manifest.csv and writes the Drive upload plan (build/tmp/upload.tsv).
# Usage: python3 -I build/make-manifest.py
import csv, hashlib, json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rows = []
for n in ('photos', 'stills', 'video'):
    p = f'{ROOT}/build/manifest-{n}.json'
    if os.path.exists(p): rows += json.load(open(p))
NOTE = {
  'Tulip': '图片来自 15 枝纸花器套装（Listing v19）；网站在售白色郁金香是 12 枝盒装 B0DQDXM72R。玻璃花瓶为搭配示意。',
  'Classic-Rose': '陶瓷花瓶为搭配示意，不含在套装内。', 'Ranunculus': '陶瓷花瓶为搭配示意，不含在套装内。',
  'Austin-Rose': 'A+ v18 原图；花型和 Red、Hot Pink 的颜色与 Listing 主图有差异，待对照实物。花瓶为搭配示意。',
  'Austin-Rose-Eucalyptus': 'A+ v18 原图；花瓶为搭配示意。',
  'Rose-Gift-Box': 'v03 花器场景图，陶瓷花瓶为搭配示意；套装自带的是纸盒花器。', 'All': '',
}
FOLDER = lambda r: ('01_Photo_No-Text/' + r['file'].split('/')[2]) if r['type'] == 'Photo' else {'Feed': '02_Feed_4x5', 'Story': '03_Story_9x16', 'Wide': '04_Wide_16x9', 'Video': '05_Video'}[r['type']]
out = []
for r in rows:
    p = f"{ROOT}/{r['file']}"
    if not os.path.exists(p): print('MISSING', r['file']); continue
    b = open(p, 'rb').read()
    scene = 'Scene' in r.get('layout', '') or 'Room' in r.get('layout', '') or r.get('layout') == 'Series'
    note = NOTE.get(r.get('family', ''), '')
    if scene: note = 'Codex 场景图（Wabi-Sabi v02 为 Gemini 生成；Wood-Slat v08.5 以 Pexels 照片 Amar Preciado 为底）。' + ('' if r.get('family') != 'Tulip' else '此图为 12 枝白色郁金香。')
    out.append(dict(file=os.path.basename(p), drive_folder=FOLDER(r), type=r['type'], layout=r.get('layout', ''), ratio=r['ratio'], pixels=r['size'], family=r.get('family', 'All'), set=r.get('set', ''),
                    colour=r.get('colour', 'All colours'), child_asin=r.get('asin', ''), asin_check=r.get('asin_check', ''), shot=r.get('shot', ''), source_file=r.get('source', ''), source_px=r.get('source_px', ''),
                    upscale=r.get('scale', ''), seconds=r.get('seconds', ''), status='REVIEW', version='v02', kb=round(len(b) / 1024), note=note, sha256=hashlib.sha256(b).hexdigest(), local=r['file']))
    if r['type'] == 'Video':
        pj = p.replace('_v02_REVIEW.mp4', '_Poster_v02_REVIEW.jpg'); bj = open(pj, 'rb').read()
        out.append(dict(out[-1], file=os.path.basename(pj), layout='Video poster', seconds='', kb=round(len(bj) / 1024), sha256=hashlib.sha256(bj).hexdigest(), local=os.path.relpath(pj, ROOT)))
cols = [c for c in out[0] if c not in ('sha256', 'local')]
with open(ROOT + '/manifest.csv', 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.DictWriter(f, fieldnames=cols, extrasaction='ignore'); w.writeheader(); w.writerows(out)
# upload plan: short hard links so each upload call stays small
up = ROOT + '/build/tmp/up'; os.makedirs(up, exist_ok=True)
with open(ROOT + '/build/tmp/upload.tsv', 'w') as f:
    for i, r in enumerate(out):
        ext = r['file'].rsplit('.', 1)[1]; link = f'{up}/{i:03d}.{ext}'
        if os.path.exists(link): os.remove(link)
        os.link(f"{ROOT}/{r['local']}", link)
        f.write('\t'.join([f'{i:03d}', r['drive_folder'], r['sha256'], link, r['file']]) + '\n')
big = [(r['file'], r['kb']) for r in out if r['kb'] > 2950]
print(len(out), 'files', round(sum(r['kb'] for r in out) / 1024), 'MB', 'too big:', big)
from collections import Counter
print(Counter(r['drive_folder'] for r in out))
