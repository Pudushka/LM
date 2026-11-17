# Generate recipe photographs with Gemini, using the live product photos as references.
# The API key is added to requests by the session's network proxy (header x-goog-api-key); it is never read here.
# Usage: python3 -I build/gen.py <refs dir> <out dir> [recipe numbers...] [--model NAME] [--n 2]
import base64, json, os, sys, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[1:]
model = 'gemini-3-pro-image-preview'
n = 2
if '--model' in args: i = args.index('--model'); model = args[i + 1]; del args[i:i + 2]
if '--n' in args: i = args.index('--n'); n = int(args[i + 1]); del args[i:i + 2]
refs, out, only = args[0], args[1], set(args[2:])
os.makedirs(out, exist_ok=True)
FAM = {'austin': 'austin', 'classic': 'classic', 'peony': 'peony', 'tulip': 'tulip', 'gift': 'gift'}
slug = lambda c: c.lower().replace(' ', '-')

def part(path):
    mime = 'image/webp' if path.endswith('.webp') else 'image/jpeg'
    return {'inline_data': {'mime_type': mime, 'data': base64.b64encode(open(path, 'rb').read()).decode()}}

for r in json.load(open(ROOT + '/recipes.json')):
    if only and r['no'] not in only: continue
    parts = [{'text': r['prompt'] + ' The attached images are the exact products to use; follow them for every flower.'}]
    for k, c, q, s, role in r['items']:
        for kind in ('set', 'detail'):
            f = f"{refs}/ssko-v07{'2' if kind == 'set' else '3'}-{FAM[k]}-{slug(c)}-{kind}.webp"
            if os.path.exists(f): parts.append(part(f))
            else: print('missing reference', f)
    body = {'contents': [{'role': 'user', 'parts': parts}],
            'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': '4:5'}}}
    for k in range(n):
        req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
                                     data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'})
        try:
            res = json.load(urllib.request.urlopen(req, timeout=300))
        except urllib.error.HTTPError as e:
            print(r['no'], 'HTTP', e.code, e.read()[:400].decode(errors='replace')); break
        got = [p['inlineData'] for c in res.get('candidates', []) for p in c.get('content', {}).get('parts', []) if 'inlineData' in p]
        if not got: print(r['no'], 'no image', json.dumps(res)[:400]); continue
        ext = 'png' if 'png' in got[0]['mimeType'] else 'jpg'
        path = f"{out}/recipe-{r['no']}-{r['key']}-{k + 1}.{ext}"
        open(path, 'wb').write(base64.b64decode(got[0]['data']))
        print('saved', path)
