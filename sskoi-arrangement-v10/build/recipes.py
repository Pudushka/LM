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
  why='Two neighbouring pinks. The Austin roses lead; the smaller ranunculus fill the gaps and repeat the peach at the centre of each rose.',
  summary='Baby pink Austin roses with light peach ranunculus in a cream vase.',
  items=[('austin','Baby Pink',1,6,'Focal'), ('peony','Light Peach',1,4,'Secondary')],
  vessel=dict(type='urn', name='Cream ceramic vase', h=20, w=9),
  method=['Set the six roses first at slightly different heights, the tallest about twice the height of the vase.',
          'Add the ranunculus lower and to the sides, letting the buds stand a little above the roses.',
          'Turn the vase until the outline looks gathered rather than round.'],
  scene='A pale oak console against a limewashed wall, one small linen-bound book, soft window light from the left.',
  camera='Standing eye level, 50 mm, vase slightly left of centre, the arrangement filling about 55% of the frame height.'),
 dict(no='02', key='coral-hour', title='Coral', em='Hour', room='Reading table', palette='Analogous',
  why='Coral and orange sit next to each other on the colour wheel. The open roses and their buds carry the shape; the orange ranunculus warm the base.',
  summary='Coral classic roses with orange ranunculus in a stone jug.',
  items=[('classic','Coral',1,6,'Focal'), ('peony','Orange',1,4,'Secondary')],
  vessel=dict(type='jug', name='Stone jug', h=20, w=8),
  method=['Place the roses first and let a few buds lean out over the rim.',
          'Add the ranunculus low, close to the lip of the jug.',
          'Leave one side lighter than the other so the arrangement looks gathered, not packed.'],
  scene='A round walnut side table beside a worn leather reading chair, an open book and a cup. Warm late-afternoon sun from the right.',
  camera='Seated eye level, 50 mm, jug right of centre, chair arm entering the left edge.'),
 dict(no='03', key='white-garden', title='White', em='Garden', room='Dining table', palette='Tonal',
  why='One colour, three textures: smooth tulips for height, cupped Austin roses as the focal point, layered ranunculus with silvery leaves in between.',
  summary='White tulips, Austin roses and ranunculus in a wide stoneware crock.',
  items=[('tulip','White',1,12,'Line'), ('austin','White',1,6,'Focal'), ('peony','White',1,4,'Secondary')],
  vessel=dict(type='crock', name='Wide stoneware crock', h=22, w=14),
  method=['Stand the tulips around the rim first, leaning out to set the width.',
          'Place the roses in the centre at two or three different heights.',
          'Fill the gaps with the ranunculus and let a few tulips rise above everything.'],
  scene='A long scrubbed oak dining table in a pale plaster room, linen runner, a stack of plates at the far end. Soft overcast daylight from tall windows.',
  camera='Standing, 50 mm, crock centred on the table, the room receding behind.'),
 dict(no='04', key='pink-and-green', title='Pink and', em='Green', room='Living room', palette='Tonal',
  why='Three pinks at different scales, tied together by the green of the tulips. The tulips draw the lines, the roses hold the centre, the ranunculus add detail.',
  summary='Green-and-pink tulips with pink Austin roses and pink ranunculus.',
  items=[('tulip','Green With Pink Tip',1,12,'Line'), ('austin','Pink',1,6,'Focal'), ('peony','Pink',1,4,'Secondary')],
  vessel=dict(type='crock', name='Wide glazed ceramic vase', h=22, w=14),
  method=['Start with the tulips around the rim, leaning out.',
          'Place the roses in the middle at different heights.',
          'Tuck the ranunculus between the roses and let the buds stand above them.'],
  scene='A garden room with a pine table, terracotta floor and a window onto green foliage. Bright, soft overcast light.',
  camera='Standing, 35 mm, vase centred on the table, window behind and to the right.'),
 dict(no='05', key='soft-white', title='Soft', em='White', room='Bedside', palette='Tonal',
  why='The pink edges on the white roses are picked up by the baby pink ranunculus, so the two sets read as one soft colour.',
  summary='White classic roses with pink tips and baby pink ranunculus in a slim vase.',
  items=[('classic','White With Pink Tip',1,6,'Focal'), ('peony','Baby Pink',1,4,'Secondary')],
  vessel=dict(type='bottle', name='Slim glazed vase', h=18, w=6),
  method=['Set the roses so the open blooms sit low and the buds rise above.',
          'Add the ranunculus to one side for an off-centre outline.',
          'Keep the top of the arrangement below the lampshade so the light falls on the petals.'],
  scene='An oak bedside table, linen bedding edge, a pleated lamp switched on, two books. Dusk light.',
  camera='Low, at mattress height, 50 mm, vase right of centre, lamp partly in frame.'),
 dict(no='06', key='late-plum', title='Late', em='Plum', room='Evening table', palette='Analogous',
  why='Burgundy and dark purple share their depth. The tall tulips draw the outline; the roses and their buds give it weight at the centre.',
  summary='Burgundy classic roses with dark purple tulips in smoked glass.',
  items=[('classic','Burgundy',1,6,'Focal'), ('tulip','Dark Purple',1,12,'Line')],
  vessel=dict(type='cylinder', name='Smoked glass vase', h=22, w=9),
  method=['Stand the tulips first and let them fall open toward the rim.',
          'Place the roses through the middle, open blooms low and buds high.',
          'Light the table from one side; the dark petals need it.'],
  scene='A dark-stained dining table, two lit taper candles, linen napkins, a deep plaster wall. Evening candlelight and one soft side light.',
  camera='Seated eye level, 50 mm, vase centred, candles slightly out of focus on either side.'),
]

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
            f"On it, a {r['vessel']['name'].lower()} about {r['vessel']['h']} cm tall holding one loose, natural arrangement of exactly: {parts}. "
            "Every flower must match the reference product photographs exactly: same flower shape, petal layers, colour, leaves and buds. "
            "Faux flowers that look real. No other flowers, no extra greenery, no fillers. All stems are in the vase. "
            f"The arrangement is about twice the height of the vase, with varied heights and an asymmetric, gathered outline. {r['camera']} "
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
             vessel_height=str(r['vessel']['h']), vessel_opening=str(r['vessel']['w']), method='\n'.join(r['method']), why=r['why'],
             anchor=r['key'], alt=r['summary'])
    bid = 'recipe-' + r['no']; blocks[bid] = dict(type='recipe', settings=s); order.append(bid)
json.dump(dict(blocks=blocks, block_order=order), open(ROOT+'/build/template-blocks.json','w'), indent=1, ensure_ascii=False)

# Recipe document (Chinese notes, English customer copy)
md = ['# SSKOI 花艺配方册 v11（REVIEW，6 套）', '', '2026-11-17。替换现在的 Arrangement Studio（抠图拼贴）。6 套配方，每套由两到三种能直接买到的整套花组成，同一个花瓶里混搭。页面给出照片、用料和每种花的角色、花器、摆法和“一键加入 Amazon 购物车”。', '',
      '搭配原则：每种花有角色（Focal 主花：Austin 和 Classic 玫瑰；Secondary 辅花：植绒露莲，补空隙、加质感；Line 线条花：郁金香，定高度和外轮廓）。花型大小要有变化。颜色用同色系深浅（Tonal）或相邻色（Analogous），一种颜色在几种花之间重复，绿色做框。整体高度约为花瓶的 1.5–2 倍。', '',
      '体量：Bud ≤ 8 枝，Table 9–18 枝，Statement 19 枝以上。花器都不在套装内（礼盒自带的纸花器除外）。', '',
      '| No. | 名称 | 房间 | 色调 | 体量 | 用料（套 × 规格 · 颜色 · ASIN） | 花器 |', '|---|---|---|---|---|---|---|']
for r in R:
    items = '<br>'.join(f"{q} × {P[k]['name']} ({P[k]['unit']}) · {c} · {C[(k,c)][0]} · {role}" for k,c,q,_,role in r['items'])
    md.append(f"| {r['no']} | {r['title']} {r['em']} | {r['room']} | {r['palette']} | {r['scale']} · {r['stems']} | {items} | {r['vessel']['name']}，高 {r['vessel']['h']} cm，口径 {r['vessel']['w']} cm |")
md += ['', '## 每套的文案和摆法', '']
for r in R:
    md += [f"### {r['no']} {r['title']} {r['em']}", '', r['summary'], '', '为什么这样配：' + r['why'], '']
    md += [f"{i+1}. {m}" for i,m in enumerate(r['method'])]
    md += ['', f"一键加购链接：`{r['cart']}`", '']
md += ['## 注意', '', '- 04 用到的 Austin Roses with Eucalyptus（B0FLLPR1W9）不在网站花页里，链接直接到 Amazon。它的子 ASIN 是目录已标注的两个之一。',
       '- Amazon 组合加购链接对未登录的客人会先要求登录，再回到加购页。上线前请用自己的 Amazon 账号点一次确认。',
       '- 照片到位之前，页面用现有照片做临时图，并标注 Stand-in photo；临时图和配方的花材不完全一致，不能上线。']
open(ROOT+'/RECIPES.md','w').write('\n'.join(md)+'\n')

# Shot list for Codex
sl = ['# 配方照片拍摄清单（给 Codex ImageGen）v11，6 套', '', '每套出两张：`Hero 4:5`（2000 × 2500）和 `Wide 16:9`（2560 × 1440），sRGB JPEG，文件名 `SSKOI_Recipe-<No>_<Name>_<Hero-4x5|Wide-16x9>_v01_REVIEW.jpg`。上传到 Drive `SSKOI_Arrangement-Recipes_v10_REVIEW_20261117/02_Photos`，状态 REVIEW。',
      '', '## 所有照片的共同要求', '',
      '- 写实室内大片，水准对标 Architectural Digest、Hermès 和 Louis Vuitton 的居家画册：自然光单侧照明，柔和真实的阴影，材质真实（石灰墙、橡木、胡桃木、石材、亚麻），色调安静，衬托花而不抢花。',
      '- **花必须和参考商品图一致**：花型、花瓣层次、颜色、叶子、花苞数量都按参考图。Austin 玫瑰是参考图里的杯状花型，不要画成开敞露出黄色花蕊的样子；Classic 玫瑰每枝一朵开花加两个花苞；露莲每枝两朵花加一个花苞，叶子是银绿色植绒叶；郁金香是闭合的杯形。',
      '- **枝数必须和配方完全一致**，不加任何配方外的花或绿叶，所有花枝都插在花器里，看得到的花头数量对得上。',
      '- 花器按配方的类型和高宽比；花器不出现品牌或文字。整体高度约为花器的 2 倍，高低错落，轮廓不对称、自然收拢。',
      '- 不出现人、宠物、文字、Logo、价格；不做拼贴，不用抠图。',
      '- 构图：4:5 里花和花器占画面高度 45–60%，房间要看得出是哪种空间；16:9 留出左侧或右侧三分之一的安静背景，网页会把配方卡放在旁边。',
      '- 每张出图后，和参考图并排检查花型、颜色和枝数，不符的标 NEEDS-FIX，不要交付。', '', '## 逐套清单', '']
for r in R:
    sl += [f"### {r['no']} {r['title']} {r['em']}（{r['room']} · {r['palette']} · {r['stems']} 枝）", '']
    for k,c,q,s,role in r['items']:
        sl.append(f"- {q} × {P[k]['name']} · {c}（{P[k]['unit']}；ASIN {C[(k,c)][0]}）。参考：{REF[k].format(c=slug(c).replace('baby-pink','baby-pink'))}")
    sl += [f"- 搭配逻辑：{r['why']}",
           f"- 花器：{r['vessel']['name']}，高约 {r['vessel']['h']} cm，口径约 {r['vessel']['w']} cm。",
           f"- 场景：{r['scene']}", f"- 机位：{r['camera']}", f"- 摆法：" + ' '.join(r['method']), '',
           '生图提示词（英文，附上述参考图）：', '', '> ' + prompt(r), '']
open(ROOT+'/SHOTLIST.md','w').write('\n'.join(sl)+'\n')
print(len(R), 'recipes'); [print(r['no'], r['title'], r['em'], r['stems'], r['scale'], r['sets'], r['cart'][44:]) for r in R]
