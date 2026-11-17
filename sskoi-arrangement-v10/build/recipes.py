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
 ('classic','Coral'):('B0DSWT9NMF','#d98268'), ('classic','Burgundy'):('B0DSXY4KDH','#6d283f'),
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
 dict(no='01', key='long-table', title='The Long', em='Table', room='Dining', palette='Blush',
  summary='Austin roses and flocked ranunculus, kept low so you can talk across the table.',
  items=[('austin','Baby Pink',1,6), ('peony','Light Peach',1,4)],
  vessel=dict(type='bowl', name='Low footed stoneware bowl with a flower frog', h=11, w=15),
  method=['Set the six roses first, low and turned outward, so the heads rest just above the rim.',
          'Tuck the ranunculus between the roses and let the buds rise a little higher.',
          'Walk around the table and turn the bowl until it looks full from every chair.'],
  standin=('file','ssko-v09-rooms-austin-baby-pink-wabi-dinner-table.webp'),
  scene='A long oak dining table in a limewashed room, linen runner, two place settings at the far end. Window light from the left, late morning.',
  camera='Eye level of a seated guest, 50 mm, the bowl centered one third from the bottom; table runs away from camera.'),
 dict(no='02', key='morning-kitchen', title='Morning', em='Kitchen', room='Kitchen', palette='White',
  summary='White tulips with white ranunculus in clear glass, for a counter by the window.',
  items=[('tulip','White',1,12), ('peony','White',1,4)],
  vessel=dict(type='cylinder', name='Clear glass cylinder', h=20, w=9),
  method=['Stand the twelve tulips upright and let them fall open toward the rim.',
          'Add the ranunculus at the front, a little lower than the tulips.',
          'Keep the stems visible through the glass; they are part of the look.'],
  standin=('file','ssko-v09-rooms-tulip-white-wabi-kitchen-ledge.webp'),
  scene='Honed limestone counter beside a steel-framed window, a stoneware cup and a wooden board in soft focus. Clear morning light.',
  camera='Standing eye level, 50 mm, slight three-quarter angle so the stems show through the glass.'),
 dict(no='03', key='coral-hour', title='Coral', em='Hour', room='Living', palette='Warm',
  summary='Coral roses and orange ranunculus in a stone jug beside a reading chair.',
  items=[('classic','Coral',1,6), ('peony','Orange',1,4)],
  vessel=dict(type='jug', name='Stone jug', h=18, w=8),
  method=['Place the roses first and let a few buds lean out toward the chair.',
          'Add the ranunculus lower, near the lip of the jug.',
          'Leave one side lighter than the other so the arrangement looks gathered, not packed.'],
  standin=('file','ssko-v09-rooms-classic-coral-wabi-reading-table.webp'),
  scene='Round walnut side table next to a worn leather reading chair, an open book and a cup. Low warm sun from the right, early evening.',
  camera='Seated eye level, 50 mm, jug slightly right of center, chair arm entering the left edge.'),
 dict(no='04', key='mantel-in-blush', title='Mantel in', em='Blush', room='Mantel', palette='Blush',
  summary='Baby pink and white Austin roses with eucalyptus trailing over the edge of the mantel.',
  items=[('austineu','Baby Pink',1,12), ('austin','White',1,6)],
  vessel=dict(type='urn', name='Wide ceramic urn', h=22, w=12),
  method=['Set the eucalyptus first, letting two stems trail down one side.',
          'Add the white roses at the center, then the pink roses around them.',
          'Step back to the far side of the room and correct the outline from there.'],
  standin=('asset','ssko-v6-shelf.webp'),
  scene='Plaster fireplace mantel, a leaning unframed linen-toned painting behind, one candle. Soft daylight from a tall window on the left.',
  camera='Standing, 70 mm from across the room, mantel edge in the lower third, urn left of center.'),
 dict(no='05', key='by-the-bed', title='By the', em='Bed', room='Bedroom', palette='Blush',
  summary='One set of baby pink ranunculus, split between two bud vases.',
  items=[('peony','Baby Pink',1,4)],
  vessel=dict(type='bud', name='Two bud vases', h=12, w=2.5),
  method=['Put two stems in each vase.',
          'Set one vase a little forward of the other.',
          'Keep the flowers below the lampshade so the light falls on them.'],
  standin=('asset','ssko-v6-bedside.webp'),
  scene='Oak bedside table, linen bedding edge, a pleated lamp switched on, a small stack of books. Dusk light.',
  camera='Low, at mattress height, 50 mm, the two vases staggered on the table.'),
 dict(no='06', key='the-entry', title='The', em='Entry', room='Entry', palette='Deep',
  summary='The burgundy gift set in its own paper vase, paired with dark purple tulips in glass.',
  items=[('gift','Burgundy',1,8), ('tulip','Dark Purple',1,12)],
  vessel=dict(type='pair', name='Paper vase from the gift set, and a tall glass vase', h=25, w=8),
  method=['Open the gift box into its standing vase and arrange the eight roses.',
          'Stand the tulips upright in the glass vase.',
          'Place the two vases a hand’s width apart, the taller one at the back.'],
  standin=('file','ssko-v09-rooms-gift-burgundy-wabi-entry-console.webp'),
  scene='Walnut console in an entry hall, a framed small drawing, a ceramic dish for keys, a doorway to a bright room behind. Daylight from the doorway.',
  camera='Standing, 50 mm, console in the lower half, both vases fully visible with the printed paper vase facing camera.'),
 dict(no='07', key='garden-room', title='Garden', em='Room', room='Living', palette='Garden',
  summary='Tulips, Austin roses and ranunculus in pinks and green, loose like a cut-garden bunch.',
  items=[('tulip','Green With Pink Tip',1,12), ('austin','Pink',1,6), ('peony','Pink',1,4)],
  vessel=dict(type='crock', name='Wide ceramic crock', h=24, w=14),
  method=['Start with the tulips around the rim, leaning out.',
          'Place the roses in the middle at different heights.',
          'Fill the gaps with the ranunculus and let the buds stand above the roses.'],
  standin=('asset','ssko-v5-peony-scene.webp'),
  scene='Garden room with a scrubbed pine table, terracotta floor, a window onto green foliage. Bright overcast light.',
  camera='Standing, 35 mm, crock centered on the table, window light behind and to the right.'),
 dict(no='08', key='late-plum', title='Late', em='Plum', room='Dining', palette='Deep',
  summary='Burgundy classic roses and purple Austin roses for an evening table.',
  items=[('classic','Burgundy',1,6), ('austin','Purple',1,6)],
  vessel=dict(type='bottle', name='Smoked glass vase', h=20, w=9),
  method=['Set the Austin roses low around the rim.',
          'Raise the classic roses above them, with the buds at the top.',
          'Light the table from the side; the dark petals need it.'],
  standin=('asset','ssko-v5-gift-scene.webp'),
  scene='Dark-stained dining table, two lit taper candles, linen napkins, deep plaster wall. Evening, candlelight plus one soft side light.',
  camera='Seated eye level, 50 mm, vase centered, candles slightly out of focus on either side.'),
]

def scale(n): return 'Bud' if n <= 8 else ('Table' if n <= 18 else 'Statement')
for r in R:
    r['stems'] = sum(s for _,_,_,s in r['items'])
    r['scale'] = scale(r['stems'])
    r['sets'] = sum(q for _,_,q,_ in r['items'])
    r['cart'] = 'https://www.amazon.com/gp/aws/cart/add.html?' + '&'.join(f'ASIN.{i+1}={C[(k,c)][0]}&Quantity.{i+1}={q}' for i,(k,c,q,_) in enumerate(r['items']))

json.dump(R, open(ROOT+'/recipes.json','w'), indent=1, ensure_ascii=False)

# Shopify blocks: one "recipe" block per recipe
blocks, order = {}, []
for r in R:
    lines = []
    for k,c,q,s in r['items']:
        asin, sw = C[(k,c)]
        link = (P[k]['page'] + '#color=' + c.replace(' ', '+')) if P[k]['page'] else f'https://www.amazon.com/dp/{asin}?th=1'
        lines.append(f"{q} | {P[k]['name']} | {c} | {P[k]['unit']} | {asin} | {sw} | {link}")
    st = r['standin']
    s = dict(number=r['no'], title=r['title'], emphasis=r['em'], summary=r['summary'], room=r['room'], palette=r['palette'], scale=r['scale'],
             stems=str(r['stems']), ingredients='\n'.join(lines), vessel_type=r['vessel']['type'], vessel_name=r['vessel']['name'],
             vessel_height=str(r['vessel']['h']), vessel_opening=str(r['vessel']['w']), method='\n'.join(r['method']), stand_in=True,
             anchor=r['key'], alt=r['summary'])
    if st[0]=='file': s['image'] = 'shopify://shop_images/' + st[1]
    else: s['image_asset'] = st[1]
    bid = 'recipe-' + r['no']; blocks[bid] = dict(type='recipe', settings=s); order.append(bid)
json.dump(dict(blocks=blocks, block_order=order), open(ROOT+'/build/template-blocks.json','w'), indent=1, ensure_ascii=False)

# Recipe document (Chinese notes, English customer copy)
md = ['# SSKOI 花艺配方册 v10（REVIEW）', '', '2026-11-17。替换现在的 Arrangement Studio（抠图拼贴）。每套配方由能直接买到的整套花组成，页面给出照片、用料、花器、三步摆法和“一键加入 Amazon 购物车”。', '',
      '体量：Bud ≤ 8 枝，Table 9–18 枝，Statement 19 枝以上。花器都不在套装内（礼盒自带的纸花器除外）。', '',
      '| No. | 名称 | 房间 | 色调 | 体量 | 用料（套 × 规格 · 颜色 · ASIN） | 花器 |', '|---|---|---|---|---|---|---|']
for r in R:
    items = '<br>'.join(f"{q} × {P[k]['name']} ({P[k]['unit']}) · {c} · {C[(k,c)][0]}" for k,c,q,_ in r['items'])
    md.append(f"| {r['no']} | {r['title']} {r['em']} | {r['room']} | {r['palette']} | {r['scale']} · {r['stems']} | {items} | {r['vessel']['name']}，高 {r['vessel']['h']} cm，口径 {r['vessel']['w']} cm |")
md += ['', '## 每套的文案和摆法', '']
for r in R:
    md += [f"### {r['no']} {r['title']} {r['em']}", '', r['summary'], '']
    md += [f"{i+1}. {m}" for i,m in enumerate(r['method'])]
    md += ['', f"一键加购链接：`{r['cart']}`", '']
md += ['## 注意', '', '- 04 用到的 Austin Roses with Eucalyptus（B0FLLPR1W9）不在网站花页里，链接直接到 Amazon。它的子 ASIN 是目录已标注的两个之一。',
       '- Amazon 组合加购链接对未登录的客人会先要求登录，再回到加购页。上线前请用自己的 Amazon 账号点一次确认。',
       '- 照片到位之前，页面用现有照片做临时图，并标注 Stand-in photo；临时图和配方的花材不完全一致，不能上线。']
open(ROOT+'/RECIPES.md','w').write('\n'.join(md)+'\n')

# Shot list for Codex
sl = ['# 配方照片拍摄清单（给 Codex）v10', '', '每套出两张：`Hero 4:5`（2000 × 2500）和 `Wide 16:9`（2560 × 1440），sRGB JPEG，文件名 `SSKOI_Recipe-<No>_<Name>_<Hero-4x5|Wide-16x9>_v01_REVIEW.jpg`。上传到 Drive `SSKOI_Arrangement-Recipes_v10_REVIEW_20261117/02_Photos`，状态 REVIEW。',
      '', '## 所有照片的共同要求', '',
      '- 写实室内大片，水准对标 Architectural Digest、Hermès 和 Louis Vuitton 的居家画册：自然光单侧照明，柔和真实的阴影，材质真实（石灰墙、橡木、胡桃木、石材、亚麻），色调安静，衬托花而不抢花。',
      '- **花必须和参考商品图一致**：花型、花瓣层次、颜色、叶子、花苞数量都按参考图。Austin 玫瑰是参考图里的杯状花型，不要画成开敞露出黄色花蕊的样子；Classic 玫瑰每枝一朵开花加两个花苞；露莲每枝两朵花加一个花苞，叶子是银绿色植绒叶；郁金香是闭合的杯形。',
      '- **枝数必须和配方完全一致**，不加任何配方外的花或绿叶（04 的尤加利是套装的一部分），所有花枝都插在花器里，看得到的花头数量对得上。',
      '- 花器按配方的类型和高宽比；花器不出现品牌或文字。礼盒的纸花器必须是参考图里的深绿植物印花纸盒。',
      '- 不出现人、宠物、文字、Logo、价格；不做拼贴，不用抠图。',
      '- 构图：4:5 里花和花器占画面高度 45–60%，房间要看得出是哪种空间；16:9 留出左侧或右侧三分之一的安静背景，网页会把配方卡放在旁边。',
      '- 每张出图后，和参考图并排检查花型、颜色和枝数，不符的标 NEEDS-FIX，不要交付。', '', '## 逐套清单', '']
for r in R:
    sl += [f"### {r['no']} {r['title']} {r['em']}（{r['room']} · {r['palette']} · {r['stems']} 枝）", '']
    for k,c,q,s in r['items']:
        sl.append(f"- {q} × {P[k]['name']} · {c}（{P[k]['unit']}；ASIN {C[(k,c)][0]}）。参考：{REF[k].format(c=slug(c).replace('baby-pink','baby-pink'))}")
    sl += [f"- 花器：{r['vessel']['name']}，高约 {r['vessel']['h']} cm，口径约 {r['vessel']['w']} cm。",
           f"- 场景：{r['scene']}", f"- 机位：{r['camera']}", f"- 摆法：" + ' '.join(r['method']), '']
open(ROOT+'/SHOTLIST.md','w').write('\n'.join(sl)+'\n')
print(len(R), 'recipes'); [print(r['no'], r['title'], r['em'], r['stems'], r['scale'], r['sets'], r['cart'][44:]) for r in R]
