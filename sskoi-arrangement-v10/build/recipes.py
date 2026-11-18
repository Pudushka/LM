# One source for the SSKOI arrangement book: Shopify section data, the recipe document and Codex's shot list.
# Usage: python3 -I build/recipes.py        Writes recipes.json, RECIPES.md, SHOTLIST.md and build/template-blocks.json
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Sets sold, with the child ASINs and swatches the live flower pages use.
P = {
 'austin':   dict(name='Austin Roses', unit='6 stems', page='/?view=sskoi-austin'),
 'tulip':    dict(name='Real-Touch Tulips', unit='12 stems', page='/?view=sskoi-tulip'),
 'classic':  dict(name='Classic Roses', unit='6 stems', page='/?view=sskoi-classic'),
 'peony':    dict(name='Flocked Ranunculus', unit='4 stems', page='/?view=sskoi-peony'),
 'gift':     dict(name='Classic Rose Gift Set', unit='8 stems and paper vase', page='/?view=sskoi-rose-gift'),
 'austineu': dict(name='Austin Roses with Eucalyptus', unit='6 roses and 6 eucalyptus stems', page=''),
}
C = {
 ('austin','Baby Pink'):('B0DTFNXBHF','#e6b7b5'), ('austin','White'):('B0DTFNZQRG','#f4eee2'), ('austin','Purple'):('B0DTFNB9BG','#9473b3'),
 ('austin','Pink'):('B0DTFPD9F9','#d982a6'),
 ('tulip','White'):('B0DQDXM72R','#f4eee2'), ('tulip','Green With Pink Tip'):('B0DQF16XSS','#c5c6a3'), ('tulip','Dark Purple'):('B0DQDVL846','#654181'),
 ('classic','Coral'):('B0DSWT9NMF','#d98268'), ('classic','White With Pink Tip'):('B0DSWSM1QY','#f2e4de'), ('classic','Burgundy'):('B0DSXY4KDH','#6d283f'),
 ('peony','Light Peach'):('B0DTYG3SY1','#eac3a9'), ('peony','White'):('B0DTYJ5V1W','#f4eee2'), ('peony','Orange'):('B0DTYBG3DP','#dc884d'),
 ('peony','Baby Pink'):('B0DTYL1GYT','#e6b7b5'), ('peony','Pink'):('B0DTYBPB9F','#d982a6'),
 ('gift','Burgundy'):('B0FKJ6Y2FQ','#6d283f'),
 ('austineu','Baby Pink'):('B0FLLPR1W9','#e6b7b5'),
}
REF = {  # product reference photographs for the shot list (theme assets on the live site)
 'austin': 'ssko-v072-austin-{c}-set.webp, ssko-v073-austin-{c}-detail.webp',
 'tulip': 'ssko-v072-tulip-{c}-set.webp, ssko-v073-tulip-{c}-detail.webp',
 'classic': 'ssko-v072-classic-{c}-set.webp, ssko-v073-classic-{c}-detail.webp',
 'peony': 'ssko-v072-peony-{c}-set.webp, ssko-v073-peony-{c}-detail.webp',
 'gift': 'ssko-v072-gift-{c}-set.webp, ssko-v072-gift-{c}-detail.webp, ssko-v072-gift-{c}-box.webp',
 'austineu': 'Amazon listing main image of B0FLLPR1W9 (Listing v19 MAIN)',
}
slug = lambda s: s.lower().replace(' ', '-')

R = [
 dict(no='01', key='blush-and-peach', title='Blush and', em='Peach', room='Console', palette='Analogous',
  why='Two neighboring pinks. The Austin roses lead; the smaller ranunculus fill the gaps and repeat the peach at the center of each rose.',
  summary='Baby pink Austin roses with light peach ranunculus in a cream vase.',
  items=[('austin','Baby Pink',1,6,'Focal'), ('peony','Light Peach',1,4,'Secondary')],
  vessel=dict(type='urn', name='Cream ceramic vase', h=20, w=9),
  method=['Set the six roses first at slightly different heights, the tallest about twice the height of the vase.',
          'Add the ranunculus lower and to the sides, letting the buds stand a little above the roses.',
          'Turn the vase until the outline looks gathered rather than round.'],
  scene='A pale oak console against a limewashed wall, one small linen-bound book, soft window light from the left.',
  camera='Standing eye level, 50 mm, vase slightly left of center, the arrangement filling about 55% of the frame height.'),
 dict(no='02', key='coral-hour', title='Coral', em='Hour', room='Reading table', palette='Analogous',
  why='Coral and orange sit next to each other on the color wheel. The open roses and their buds carry the shape; the orange ranunculus warm the base.',
  summary='Coral classic roses with orange ranunculus in a stone jug.',
  items=[('classic','Coral',1,6,'Focal'), ('peony','Orange',1,4,'Secondary')],
  vessel=dict(type='jug', name='Stone jug', h=20, w=8),
  method=['Place the roses first and let a few buds lean out over the rim.',
          'Add the ranunculus low, close to the lip of the jug.',
          'Leave one side lighter than the other so the arrangement looks gathered, not packed.'],
  scene='A round walnut side table beside a worn leather reading chair, an open book and a cup. Warm late-afternoon sun from the right.',
  camera='Seated eye level, 50 mm, jug right of center, chair arm entering the left edge.'),
 dict(no='03', key='white-garden', title='White', em='Garden', room='Dining table', palette='Tonal',
  why='One color, three textures: smooth tulips for height, cupped Austin roses as the focal point, layered ranunculus with silvery leaves in between.',
  summary='White tulips, Austin roses and ranunculus in a wide stoneware crock.',
  items=[('tulip','White',1,12,'Line'), ('austin','White',1,6,'Focal'), ('peony','White',1,4,'Secondary')],
  vessel=dict(type='crock', name='Wide stoneware crock', h=22, w=14),
  method=['Stand the tulips around the rim first, leaning out to set the width.',
          'Place the roses in the center at two or three different heights.',
          'Fill the gaps with the ranunculus and let a few tulips rise above everything.'],
  scene='A long scrubbed oak dining table in a pale plaster room, linen runner, a stack of plates at the far end. Soft overcast daylight from tall windows.',
  camera='Standing, 50 mm, crock centerd on the table, the room receding behind.'),
 dict(no='04', key='pink-and-green', title='Pink and', em='Green', room='Living room', palette='Tonal',
  why='Three pinks at different scales, tied together by the green of the tulips. The tulips draw the lines, the roses hold the center, the ranunculus add detail.',
  summary='Green-and-pink tulips with pink Austin roses and pink ranunculus.',
  items=[('tulip','Green With Pink Tip',1,12,'Line'), ('austin','Pink',1,6,'Focal'), ('peony','Pink',1,4,'Secondary')],
  vessel=dict(type='crock', name='Wide glazed ceramic vase', h=22, w=14),
  method=['Start with the tulips around the rim, leaning out.',
          'Place the roses in the middle at different heights.',
          'Tuck the ranunculus between the roses and let the buds stand above them.'],
  scene='A garden room with a pine table, terracotta floor and a window onto green foliage. Bright, soft overcast light.',
  camera='Standing, 35 mm, vase centerd on the table, window behind and to the right.'),
 dict(no='05', key='soft-white', title='Soft', em='White', room='Bedside', palette='Tonal',
  why='The pink edges on the white roses are picked up by the baby pink ranunculus, so the two sets read as one soft color.',
  summary='White classic roses with pink tips and baby pink ranunculus in a slim vase.',
  items=[('classic','White With Pink Tip',1,6,'Focal'), ('peony','Baby Pink',1,4,'Secondary')],
  vessel=dict(type='bottle', name='Slim glazed vase', h=18, w=6),
  method=['Set the roses so the open blooms sit low and the buds rise above.',
          'Add the ranunculus to one side for an off-center outline.',
          'Keep the top of the arrangement below the lampshade so the light falls on the petals.'],
  scene='An oak bedside table, linen bedding edge, a pleated lamp switched on, two books. Dusk light.',
  camera='Low, at mattress height, 50 mm, vase right of center, lamp partly in frame.'),
 dict(no='06', key='late-plum', title='Late', em='Plum', room='Evening table', palette='Analogous',
  why='Burgundy and dark purple share their depth. The tall tulips draw the outline; the roses and their buds give it weight at the center.',
  summary='Burgundy classic roses with dark purple tulips in smoked glass.',
  items=[('classic','Burgundy',1,6,'Focal'), ('tulip','Dark Purple',1,12,'Line')],
  vessel=dict(type='cylinder', name='Smoked glass vase', h=22, w=9),
  method=['Stand the tulips first and let them fall open toward the rim.',
          'Place the roses through the middle, open blooms low and buds high.',
          'Light the table from one side; the dark petals need it.'],
  scene='A dark-stained dining table, two lit taper candles, linen napkins, a deep plaster wall. Evening candlelight and one soft side light.',
  camera='Seated eye level, 50 mm, vase centerd, candles slightly out of focus on either side.'),
]

# v12: roles, vases and copy follow real stem length (working values; confirm against the product size charts).
STEM = {'tulip': 35, 'classic': 43, 'austin': 44, 'peony': 52}
ROLE = {'tulip': 'Base', 'classic': 'Focal', 'austin': 'Focal', 'peony': 'Height'}
V12 = {
 '01': dict(vessel=dict(type='urn', name='Cream ceramic vase', h=20, w=9),
   why='Two neighboring pinks. The Austin roses form the body; the ranunculus, on longer stems, rise above them and repeat the peach at the center of each rose.',
   method=['Place the six roses first, heads turned outward, so they sit a little above the rim.',
           'Add the four ranunculus between them; their longer stems carry the flowers and buds above the roses.',
           'Turn the vase until one side stands a little higher than the other.']),
 '02': dict(vessel=dict(type='jug', name='Stone jug', h=20, w=8),
   why='Coral and orange sit next to each other on the color wheel. The roses and their buds make the body; the orange ranunculus lift above them on longer stems.',
   method=['Place the roses first and let a few buds lean out over the lip.',
           'Add the ranunculus behind and between the roses, where they stand taller.',
           'Leave one side lighter than the other so the arrangement looks gathered, not packed.']),
 '03': dict(vessel=dict(type='crock', name='Wide stoneware crock', h=16, w=14),
   why='One color in three heights: tulips gathered low at the rim, Austin roses as the body, ranunculus above them with their round buds.',
   method=['Set the twelve tulips around the rim first and let them lean outward.',
           'Place the roses through the center, above the tulips.',
           'Add the ranunculus last; their longer stems carry them above everything.']),
 '04': dict(vessel=dict(type='crock', name='Wide glazed ceramic vase', h=16, w=13),
   why='Three pinks in three heights, tied together by the green of the tulips: tulips low at the rim, roses through the middle, ranunculus on top.',
   method=['Set the tulips around the rim first, leaning out.',
           'Place the roses in the middle, above the tulips.',
           'Add the ranunculus last and let their buds stand above the roses.']),
 '05': dict(vessel=dict(type='bottle', name='Slim glazed vase', h=18, w=6),
   why='The pink edges on the white roses are picked up by the baby pink ranunculus, so the two sets read as one soft color. The ranunculus stand above the roses.',
   method=['Set the roses so the open blooms sit near the rim and the buds rise above them.',
           'Add the ranunculus behind the roses, a little to one side, for an off-center outline.',
           'Keep the top below the lampshade so the light falls on the petals.']),
 '06': dict(vessel=dict(type='cylinder', name='Smoked glass vase', h=16, w=10),
   why='Burgundy and dark purple share their depth. The tulips gather low around the rim; the roses and their buds rise above them.',
   method=['Stand the tulips around the rim first and let them lean outward.',
           'Place the roses through the middle, open blooms above the tulips and buds highest.',
           'Light the table from one side; the dark petals need it.']),
}
# v13: copy follows Codex's v02 images (REVIEW). Every vessel in them is a broad, wide-mouth ceramic jar or crock,
# generated to Codex's prompt heights (01/02 about 20 cm, 05 about 18 cm, 03/04/06 about 22 cm). These are suggested
# sizes, not measured, so the page shows "Suggested: about N cm tall, wide mouth" with no opening figure.
# Ranunculus sit among and just above the roses in the images (stems bent or trimmed), so their role is Secondary, not Height.
ROLE['peony'] = 'Secondary'
V13 = {
 '01': dict(vessel=dict(type='jar', name='Cream glazed pot', h=20, w=None),
   summary='Baby pink Austin roses with light peach ranunculus in a wide-mouth cream pot.',
   why='Two neighboring pinks. The Austin roses form the body; the ranunculus sit between them and repeat the peach at the center of each rose, with their round buds standing a little higher.',
   method=['Place the six roses first, heads turned outward, so they sit a little above the rim.',
           'Add the four ranunculus between the roses. Their stems are the longest, so bend them to set the flowers among the roses and let the buds stand above.',
           'Turn the pot until one side stands a little higher than the other.']),
 '02': dict(vessel=dict(type='jar', name='Textured stoneware jar', h=20, w=None),
   summary='Coral classic roses with orange ranunculus in a textured stoneware jar.',
   why='Coral and orange sit next to each other on the color wheel. The roses and their buds set the outline; the orange ranunculus sit among them and warm the center.',
   method=['Place the roses first and let a few buds rise above the open blooms.',
           'Add the ranunculus between the roses, bending the stems so the flowers sit at different depths.',
           'Leave one side lighter than the other so the arrangement looks gathered, not packed.']),
 '03': dict(vessel=dict(type='crock', name='Wide stoneware crock', h=22, w=None),
   summary='White tulips, Austin roses and ranunculus in a wide stoneware crock.',
   why='One color in three textures: tulips gathered low at the rim, cupped Austin roses as the body, layered ranunculus with silvery leaves among and above them.',
   method=['Set the twelve tulips around the rim first. In a crock about 22 cm tall, full-length tulips show about 13 cm above the rim.',
           'Place the roses through the center, above the tulips.',
           'Add the ranunculus last, between and just above the roses.']),
 '04': dict(vessel=dict(type='jar', name='Sage glazed stoneware jar', h=22, w=None),
   summary='Green-and-pink tulips with pink Austin roses and pink ranunculus in a sage glazed jar.',
   why='Three pinks at three heights, tied together by the green of the tulips: tulips low at the rim, roses through the middle, ranunculus among and above them.',
   method=['Set the tulips around the rim first, leaning out. In a jar about 22 cm tall they show about 13 cm above the rim.',
           'Place the roses in the middle, above the tulips.',
           'Tuck the ranunculus between the roses and let their buds stand above.']),
 '05': dict(vessel=dict(type='jar', name='Speckled stoneware pot', h=18, w=None),
   summary='White classic roses with pink tips and baby pink ranunculus in a speckled stoneware pot.',
   why='The pink edges on the white roses are picked up by the baby pink ranunculus, so the two sets read as one soft color. The rose buds rise highest; the ranunculus sit between the open roses.',
   method=['Set the roses so the open blooms sit near the rim and the buds rise above them.',
           'Add the ranunculus between the roses, a little to one side, for an off-center outline.',
           'Keep it low and wide on a bedside table, with the open blooms facing the room.']),
 '06': dict(vessel=dict(type='jar', name='Brown glazed stoneware jar', h=22, w=None),
   summary='Burgundy classic roses with dark purple tulips in a brown glazed jar.',
   why='Burgundy and dark purple share their depth. The tulips gather low around the rim; the roses and their buds rise above them.',
   method=['Stand the tulips around the rim first. In a jar about 22 cm tall they show about 13 cm above the rim, below the roses.',
           'Place the roses through the middle, open blooms above the tulips and buds highest.',
           'Light the table from one side; the dark petals need it.']),
}
for r in R:
    r.update(V12[r['no']])
    r.update(V13[r['no']])
    r['items'] = [(k, c, q, s, ROLE.get(k, role)) for k, c, q, s, role in r['items']]

def scale(n): return 'Bud' if n <= 8 else ('Table' if n <= 18 else 'Statement')
for r in R:
    r['stems'] = sum(s for _,_,_,s,_ in r['items'])
    r['scale'] = scale(r['stems'])
    r['sets'] = sum(q for _,_,q,_,_ in r['items'])
    r['cart'] = 'https://www.amazon.com/gp/aws/cart/add.html?' + '&'.join(f'ASIN.{i+1}={C[(k,c)][0]}&Quantity.{i+1}={q}' for i,(k,c,q,_,_) in enumerate(r['items']))

def prompt(r):
    D = {'austin': 'stems of Austin roses in {c}, one cupped many-petalled bloom per stem',
         'classic': 'stems of classic roses in {c}, each stem with one open rose and two closed buds',
         'peony': 'stems of flocked ranunculus in {c}, each stem with two layered flowers, one round bud and silvery-green flocked leaves',
         'tulip': 'tulips in {c}, one closed cup-shaped bloom per stem',
         'gift': 'stems of classic roses in {c}', 'austineu': 'Austin roses in {c} with 6 eucalyptus stems'}
    parts = '; '.join(f"{s} " + D[k].format(c=c.lower()) for k,c,q,s,role in r['items'])
    return (f"Photorealistic editorial interior photograph for a luxury home magazine, in the manner of Architectural Digest. {r['scene']} "
            f"On it, a broad wide-mouth {r['vessel']['name'].lower()} about {r['vessel']['h']} cm tall holding one loose, natural arrangement of: {parts}. "
            "Every flower must match the reference product photographs exactly: same flower shape, petal layers, colour, leaves and buds. "
            "Faux flowers that look real. No other flowers, no extra greenery, no fillers. All stems are in the vase. "
            f"Scale follows nominal stem lengths (tulips about 35 cm, classic roses about 43 cm, Austin roses about 44 cm, ranunculus about 52 cm, not yet measured): full-length tulips sit low, about 13 cm above a 22 cm rim, below the roses; ranunculus stems may be bent or trimmed to sit among and just above the roses. Whole arrangement about twice the vase height. Natural overlap; not every stem needs to be visible, and flowers do not all face the camera. {r['camera']} "
            "Natural light, soft real shadows, quiet muted palette that lets the flowers lead. No people, no text, no logos. Vertical 4:5.")

for r in R: r['prompt'] = prompt(r)
json.dump(R, open(ROOT+'/recipes.json','w'), indent=1, ensure_ascii=False)

# Shopify blocks: one "recipe" block per recipe
blocks, order = {}, []
for r in R:
    lines = []
    for k,c,q,s,role in r['items']:
        asin, sw = C[(k,c)]
        link = (P[k]['page'] + '#color=' + c.replace(' ', '+')) if P[k]['page'] else f'https://www.amazon.com/dp/{asin}?th=1'
        lines.append(f"{q} | {P[k]['name']} | {c} | {P[k]['unit']} | {asin} | {sw} | {link} | {role}")
    s = dict(number=r['no'], title=r['title'], emphasis=r['em'], summary=r['summary'], room=r['room'], palette=r['palette'], scale=r['scale'],
             stems=str(r['stems']), ingredients='\n'.join(lines), vessel_type=r['vessel']['type'], vessel_name=r['vessel']['name'],
             vessel_height=str(r['vessel']['h']), vessel_opening=str(r['vessel']['w'] or ''), method='\n'.join(r['method']), why=r['why'],
             anchor=r['key'], alt='Styling image: ' + r['summary'][0].lower() + r['summary'][1:])
    bid = 'recipe-' + r['no']; blocks[bid] = dict(type='recipe', settings=s); order.append(bid)
json.dump(dict(blocks=blocks, block_order=order), open(ROOT+'/build/template-blocks.json','w'), indent=1, ensure_ascii=False)

# Recipe document (Chinese notes, English customer copy)
md = ['# SSKOI 花艺配方册 v13（REVIEW，6 套）', '', '2026-11-17。替换现在的 Arrangement Studio（抠图拼贴）。6 套配方，每套由两到三种能直接买到的整套花组成，同一个花瓶里混搭。页面给出照片、用料和每种花的角色、花器、摆法和“一键加入 Amazon 购物车”。', '',
      '搭配原则：每种花有角色，按枝长分层。花型大小要有变化。颜色用同色系深浅（Tonal）或相邻色（Analogous），一种颜色在几种花之间重复，绿色做框。枝长是名义值，未实测：郁金香约 35 cm 最矮，整枝放进约 22 cm 的宽口陶器只露出约 13 cm，围在瓶口一圈（Base）；Classic 约 43 cm、Austin 约 44 cm 做主体（Focal）；露莲约 52 cm 最长，枝条弯折或剪短后插在玫瑰之间、略高于玫瑰（Secondary）。整体高度约为花器的 2 倍。', '',
      '体量：Bud ≤ 8 枝，Table 9–18 枝，Statement 19 枝以上。花器都不在套装内（礼盒自带的纸花器除外）。', '',
      '| No. | 名称 | 房间 | 色调 | 体量 | 用料（套 × 规格 · 颜色 · ASIN） | 花器 |', '|---|---|---|---|---|---|---|']
for r in R:
    items = '<br>'.join(f"{q} × {P[k]['name']} ({P[k]['unit']}) · {c} · {C[(k,c)][0]} · {role}" for k,c,q,_,role in r['items'])
    md.append(f"| {r['no']} | {r['title']} {r['em']} | {r['room']} | {r['palette']} | {r['scale']} · {r['stems']} | {items} | {r['vessel']['name']}，宽口，建议高约 {r['vessel']['h']} cm（待实测） |")
md += ['', '## 每套的文案和摆法', '']
for r in R:
    md += [f"### {r['no']} {r['title']} {r['em']}", '', r['summary'], '', '为什么这样配：' + r['why'], '']
    md += [f"{i+1}. {m}" for i,m in enumerate(r['method'])]
    md += ['', f"一键加购链接：`{r['cart']}`", '']
md += ['## 与 v12 的差异（2026-11-18）', '',
       'v12 曾把 03/04/06 改成 16 cm 花器、郁金香露出约 19 cm。这一改动晚于 Codex 按 22 cm 指导出的 v02 图，和图片不符，v13 撤回，按图片改：', '',
       '| No. | v12 花器 | v13 花器（按 v02 图，建议值，待实测） |', '|---|---|---|',
       '| 01 | Cream ceramic vase（urn）20 cm，口径 9 cm | Cream glazed pot（宽口罐）约 20 cm |',
       '| 02 | Stone jug 20 cm，口径 8 cm | Textured stoneware jar（宽口罐）约 20 cm |',
       '| 03 | Wide stoneware crock 16 cm，口径 14 cm | Wide stoneware crock 约 22 cm |',
       '| 04 | Wide glazed ceramic vase 16 cm，口径 13 cm | Sage glazed stoneware jar（宽口罐）约 22 cm |',
       '| 05 | Slim glazed vase（bottle）18 cm，口径 6 cm | Speckled stoneware pot（宽口罐）约 18 cm |',
       '| 06 | Smoked glass vase（cylinder）16 cm，口径 10 cm | Brown glazed stoneware jar（宽口罐）约 22 cm |', '',
       '- 高度取自 Codex 出图提示（01/02 约 20 cm，05 约 18 cm，03/04/06 约 22 cm）。图是 AI 生成的，不能当作实测；页面写 “Suggested: about N cm tall, wide mouth”，不再写口径。',
       '- 郁金香：35 cm 名义枝长放进约 22 cm 的花器，只露出约 13 cm，低于玫瑰（v12 写的约 19 cm 撤回）。',
       '- 露莲角色从 Height 改为 Secondary：图里露莲插在玫瑰之间、略高于玫瑰，枝条弯折或剪短，不是最高的一层。',
       '- 页面脚注从 “每张照片都展示了全部花枝” 改为 “搭配示意，花枝互相遮挡，套装内容以花页为准；花器尺寸是建议”。图上的审阅标记改为 “Styling image · under review”。',
       '- 05 的摆法去掉 “台灯罩” 一步（图里没有台灯），02/05 的说明按图改为露莲在玫瑰之间。', '']
md += ['## 注意', '', '- Amazon 组合加购链接对未登录的客人会先要求登录，再回到加购页。上线前请用自己的 Amazon 账号点一次确认。',
       '- 配方图由 Codex 依据商品原图生成（AI 搭配示意，REVIEW），花枝互相遮挡，不能证明每套的枝数和花苞数；判断购买内容以商品原图为准。James 或 Rachel 批准前不能上线。',
       '- 花器尺寸是 Codex 出图时用的建议值（01/02 约 20 cm，05 约 18 cm，03/04/06 约 22 cm），不是实测；页面只写“Suggested: about N cm tall, wide mouth”，不写口径。']
open(ROOT+'/RECIPES.md','w').write('\n'.join(md)+'\n')

# Shot list for Codex
sl = ['# 配方图拍摄清单 v13（6 套；按 Codex v02 实际出图更新花器）', '', '已交付：Codex v11-photo-v02（每套 Hero 4:5 1122 × 1402 和 Wide 16:9 1672 × 941，原生 PNG，未放大），在 Drive `02_Photos`，状态 REVIEW。本清单按 v02 实际出图更新花器，供后续重拍或补图使用。',
      '', '## 所有照片的共同要求', '',
      '- 写实室内大片，水准对标 Architectural Digest、Hermès 和 Louis Vuitton 的居家画册：自然光单侧照明，柔和真实的阴影，材质真实（石灰墙、橡木、胡桃木、石材、亚麻），色调安静，衬托花而不抢花。',
      '- **花必须和参考商品图一致**：花型、花瓣层次、颜色和叶子按参考图。Austin 玫瑰是杯状花型，只露出少量浅黄花芯；Classic 玫瑰带尖花苞；露莲是大朵、松散、带色边的花，配圆花苞和银绿色植绒叶；郁金香是闭合的杯形。',
      '- 不加任何配方外的花或绿叶，所有花枝都插在花器里。允许自然遮挡，不要求每朵正面可数；配方枝数靠图片证明不了，购买内容以商品原图为准。',
      '- 花器是宽口陶器（罐或缸），高约 18–22 cm；不出现品牌或文字。整体高度约为花器的 2 倍。郁金香整枝只露出瓶口约 13 cm，低于玫瑰，不要拉成长杆。',
      '- 不出现人、宠物、文字、Logo、价格；不做拼贴，不用抠图。',
      '- 构图：4:5 里花和花器占画面高度 45–60%，房间要看得出是哪种空间；16:9 留出左侧或右侧三分之一的安静背景，网页会把配方卡放在旁边。',
      '- 每张出图后，和参考图并排检查花型、颜色和比例，不符的标 NEEDS-FIX，不要交付。', '', '## 逐套清单', '']
for r in R:
    sl += [f"### {r['no']} {r['title']} {r['em']}（{r['room']} · {r['palette']} · {r['stems']} 枝）", '']
    for k,c,q,s,role in r['items']:
        sl.append(f"- {q} × {P[k]['name']} · {c}（{P[k]['unit']}；ASIN {C[(k,c)][0]}）。参考：{REF[k].format(c=slug(c).replace('baby-pink','baby-pink'))}")
    sl += [f"- 搭配逻辑：{r['why']}",
           f"- 花器：{r['vessel']['name']}，宽口，高约 {r['vessel']['h']} cm（建议值，待实测）。",
           f"- 场景：{r['scene']}", f"- 机位：{r['camera']}", f"- 摆法：" + ' '.join(r['method']), '',
           '生图提示词（英文，附上述参考图）：', '', '> ' + prompt(r), '']
open(ROOT+'/SHOTLIST.md','w').write('\n'.join(sl)+'\n')
print(len(R), 'recipes'); [print(r['no'], r['title'], r['em'], r['stems'], r['scale'], r['sets'], r['cart'][44:]) for r in R]
