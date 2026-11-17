# Indexes the downloaded source photographs by family, colour and shot, and attaches the child ASIN
# from the SKU-sheet mapping (build/asin_map.csv). Output: build/catalog.json
# Usage: python3 -I build/catalog.py
import csv, glob, json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = ROOT + '/raw'

FAMILIES = {
  'tulip':      dict(token='Tulip', set='15-Stems', label='Tulips', noun='tulips', zh='郁金香', map='郁金香',
                     meta='Faux tulips · 10 colours',
                     colours=['White', 'White With Blue Tip', 'Yellow', 'Peach', 'Orange', 'Green With Pink Tip', 'Pink', 'Hot Pink', 'Red', 'Dark Purple']),
  'classic':    dict(token='Classic-Rose', set='6-Stems', label='Classic roses', noun='roses', zh='普通玫瑰', map='普通玫瑰（1花2苞）',
                     meta='Classic roses · 6 stems · 6 colours',
                     colours=['Coral', 'Mauve', 'Burgundy', 'Purple', 'White With Pink Tip', 'White']),
  'ranunculus': dict(token='Ranunculus', set='4-Stems', label='Ranunculus', noun='ranunculus', zh='植绒露莲', map='植绒露莲',
                     meta='Flocked ranunculus · 4 stems · 7 colours',
                     colours=['Light Peach', 'White', 'Baby Pink', 'Pink', 'Hot Pink', 'Orange', 'Purple']),
  'austin6':    dict(token='Austin-Rose', set='6-Stems', label='Austin roses', noun='Austin roses', zh='奥斯汀玫瑰', map='奥斯汀玫瑰',
                     meta='Austin roses · 6 stems · 7 colours',
                     colours=['White', 'Baby Pink', 'Light Peach', 'Purple', 'Pink', 'Hot Pink', 'Red']),
  'austin66':   dict(token='Austin-Rose-Eucalyptus', set='6-Roses-6-Eucalyptus', label='Austin roses and eucalyptus', noun='roses', zh='奥斯汀玫瑰礼装', map='奥斯汀玫瑰礼装',
                     meta='Austin roses and eucalyptus · 6 + 6 stems · 7 colours',
                     colours=['White', 'Baby Pink', 'Champagne', 'Purple', 'Pink', 'Hot Pink', 'Red']),
  'gift':       dict(token='Rose-Gift-Box', set='8-Stems', label='The rose gift box', noun='gift roses', zh='普通玫瑰礼盒', map='普通玫瑰礼盒',
                     meta='Rose gift box · 8 stems · Vase shown for styling',
                     colours=['Coral', 'Mauve Pink', 'Red', 'Burgundy', 'Purple', 'White With Pink Tip', 'White']),
}
slug = lambda c: c.lower().replace(' with ', ' ').replace(' ', '-')
tok = lambda c: c.replace(' ', '-')

asin = {}
with open(ROOT + '/build/asin_map.csv', encoding='utf-8') as f:
    for r in csv.DictReader(f):
        asin[(r['花种'], r['颜色（目录）'])] = (r['登记表对应子 ASIN'], r['核对结果'])

LIST = {'01': 'main', '02': 'still', '03': 'detail', '04': 'vase', '05': 'stem'}
A6 = {'M01': 'vase', 'M02': 'macro', 'M03': 'flatlay', 'M04': 'stem', 'M05': 'room'}
A66 = {'M01': 'vase', 'M02': 'macro', 'M03': 'flatlay', 'M04': 'vase2', 'M05': 'arch'}
cat = {}
for key, fam in FAMILIES.items():
    entry = dict(fam); entry['colours'] = {}
    for c in fam['colours']:
        shots = {}
        if key in ('tulip', 'classic', 'ranunculus'):
            for f in glob.glob(f'{RAW}/listing/{key}-{slug(c)}/*.jpg'):
                n = re.search(r'Listing-(\d\d)-', f).group(1)
                shots[LIST[n] if not (n == '05' and key != 'tulip') else 'bud'] = f
        elif key in ('austin6', 'austin66'):
            for f in glob.glob(f'{RAW}/aplus/{key}-{slug(c)}/Source-AI-Photo-Plates_REVIEW/*.jpg'):
                m = os.path.basename(f)[:3]
                shots[(A6 if key == 'austin6' else A66)[m]] = f
        else:
            fs = glob.glob(f'{RAW}/gift/*_{tok(c)}_Listing-04-Vase-Styling*.jpg')
            if fs: shots['styling'] = fs[0]
        a = asin.get((fam['map'], c), ('', ''))
        entry['colours'][c] = dict(slug=slug(c), token=tok(c), asin=a[0], asin_check=a[1], shots=shots)
        if not shots: print('NO SHOTS', key, c)
    cat[key] = entry

SCENES = []
names = {'Dinner-Table': 'The dinner table', 'Kitchen-Ledge': 'The kitchen ledge', 'Reading-Table': 'The reading table', 'Mantel': 'The mantel', 'Entry-Console': 'The entry console'}
famof = {'Austin-Rose': 'austin6', 'Tulip': 'tulip', 'Classic-Rose': 'classic', 'Flocked-Ranunculus': 'ranunculus', 'Classic-Rose-Gift': 'gift'}
for f in sorted(glob.glob(RAW + '/wabi/*.jpg')):
    m = re.search(r'SSKOI_([A-Za-z-]+)_(B0\w+)_([A-Za-z-]+)_(\d+-Stems)_Gemini-([A-Za-z-]+)_v02', f)
    SCENES.append(dict(series='wabi', family=famof[m.group(1)], asin=m.group(2), colour=m.group(3).replace('-', ' '), set=m.group(4), place=m.group(5), title=names[m.group(5)], file=f))
order = ['austin6', 'tulip', 'classic', 'ranunculus', 'gift']
for i, f in enumerate(sorted(glob.glob(RAW + '/slat/*.jpg'))):
    m = re.search(r'SSKOI-(B0\w+)-([A-Za-z-]+?)-(Austin|Real|Classic|Flocked)', f)
    st = re.search(r'-(\d+)Stem-', f).group(1)
    SCENES.append(dict(series='slat', family=order[i], asin=m.group(1), colour=m.group(2).replace('-', ' '), set=st + '-Stems', place='Wood-Slat-Wall', title='The side table', file=f))
json.dump(dict(families=cat, scenes=SCENES), open(ROOT + '/build/catalog.json', 'w'), indent=1, ensure_ascii=False)
for k, e in cat.items():
    print(k, len(e['colours']), sorted({s for c in e['colours'].values() for s in c['shots']}), [c['asin'] for c in e['colours'].values()][:3])
for s in SCENES: print(s['series'], s['family'], s['asin'], s['colour'], s['set'], s['place'])
