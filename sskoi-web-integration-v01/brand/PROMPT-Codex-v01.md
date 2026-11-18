# 给 Codex 的提示词 v01（2026-11-18，Claude，REVIEW）

用法：把下面代码块整段复制给 Codex。

依据：`SSKOI-visual-handbook-v01.md`。Codex 能读仓库，提示词里让它先读这份手册。

```
任务：按《SSKOI 视觉手册 v01》为网站生成场景图（第一轮）。James 已决定网站图片全部用 AI 生成，近期不安排拍摄。Claude 负责视觉标准和质检，你负责出图。

开始前：
- 先读 AGENTS.md（如有）和 sskoi-web-integration-v01/brand/SSKOI-visual-handbook-v01.md，再读 Drive 交接记录最新几条。
- 本说明和手册冲突时，以本说明为准，并在交付说明里写出来。

一、硬性规则
1. 每个位置出 3 张候选。
   - 用工具支持的最大原生尺寸，不放大、不锐化。
   - 达不到最小尺寸照常交付，在说明里写实际尺寸。
2. 花必须和参考图一致：花型、花瓣层次、颜色和色边、叶形、花苞、比例。每张都附上该颜色的参考图（第三节）。
3. 每套只有花枝。
   - 花器、家具、布料都是道具。
   - 花枝数量不超过一套的枝数，以 Full set 图为准；可以少，不能多，不能出现其他花。
4. 比例真实：花器高度要和枝长匹配。
   - 枝长：Austin 约 44 cm，Classic 约 43 cm，Tulips 约 35 cm，Ranunculus 约 52 cm，以原图标注为准。
   - 不要硬套固定的露出高度。
5. 画面要求：
   - 墙面：暖灰石灰墙。
   - 台面：白橡或胡桃木。
   - 布料：燕麦色亚麻。
   - 花器：手工粗陶（奶白、灰、陶土）或透明玻璃。
   - 道具最多两件。
   - 不要：深色橡木、绿色或蓝色花器、瓷砖、高饱和颜色、亮面塑料、现代电器、文字、logo、人脸、纸花瓶、礼盒、花瓶里的水。
6. 不改动、不复用网站现有图片；构图不要和风格基准图重复。
7. 所有新图状态为 REVIEW。James 或 Rachel 批准前不接入主题、不发布。

二、提示词 = A + B + C + D
A、B、D 原样复制；B 里的方括号按花种填写；C 用第四节每个位置给的英文。

A: Editorial interior photograph for a quiet luxury home magazine. Soft natural window light from the left, warm daylight around 4300K, gentle real shadows. Limewashed warm grey plaster wall, white oak or walnut surface, oat linen. Muted palette, subtle film grain. Photorealistic, not CGI.

B: The flowers must match the attached product reference photos exactly: same flower shape, petal layers, color and color edges, leaf shape and texture, bud shape. Keep real scale: [FLOWER] stems are about [LENGTH] cm long, flower head about [HEAD] cm.
（花头：Austin 9 cm，Classic 9 cm 且每枝带两个花苞，Tulips 3.5 cm，Ranunculus 两朵花一个苞、银绿植绒叶。）

D: No text, no logos, no people's faces, no paper vase or gift box, no extra flower types, no water in the vase, no plastic look.

三、参考图
前缀：
  T = https://sskoi.com/cdn/shop/t/30/assets/
  F = https://cdn.shopify.com/s/files/1/0621/6017/5297/files/
花（每张附上该颜色的 Full set、Flower detail、Single stem）：
- Austin Baby Pink（ASIN B0DTFNXBHF，6 枝）：
  T+ssko-v072-austin-baby-pink-set.webp
  F+SSKOI_Austin-Rose_B0DTFNXBHF_Baby-Pink_6-stems_Website-Flower-Detail_v10.1-r02_20261118_REVIEW.jpg
  T+ssko-v072-austin-baby-pink-stem.webp
- Tulips White：T+ssko-v072-tulip-white-set.webp、-detail.webp、-stem.webp
- Ranunculus Light Peach（文件名里写 peony）：T+ssko-v072-peony-light-peach-set.webp、-detail.webp、-stem.webp
- Classic Coral：T+ssko-v072-classic-coral-set.webp、-detail.webp、-stem.webp
- Classic Burgundy：T+ssko-v072-classic-burgundy-set.webp、-detail.webp
风格基准（只学光线、色调、材质，不抄构图）：
  F+ssko-v09-rooms-austin-baby-pink-wabi-dinner-table.webp
  F+ssko-v09-rooms-classic-coral-wabi-reading-table.webp

四、要出的位置（按顺序做）

第 1 批：首页
H1  首页 Austin 那一行的房间图 | 4:5，最小 1440×1800 | Austin Baby Pink
C: A loose, airy arrangement of Baby Pink Austin roses in a cream handmade stoneware vase on a walnut sideboard in a calm living room. 50mm lens at seated eye level. The roses fill the upper half of the frame, plaster wall behind, one small stack of linen-bound books as the only prop.
（不要餐桌，下方已有餐桌图。）

第 2 批：Lookbook 7 张，替换 v5/v6 早期场景
规格：3:2，最小 2000 宽；主体放在中间，裁成 4:5 也要成立。
标 * 的 4 张同时用作 Journal 文章封面（3:2）。
L1  Austin Baby Pink | 起居室窗边
C: Baby Pink Austin roses in a low cream stoneware bowl vase on a small white oak side table draped with oat linen, beside a window, 35mm at standing eye level, generous plaster wall space.
L2  Tulips White | 玄关
C: White tulips in a clear glass cylinder vase on a white oak entry console in a quiet hallway, a small handmade ceramic dish beside it, 35mm at standing eye level.
L3* Ranunculus Light Peach | 阅读角（封面：Faux flowers for small rooms and apartments）
C: Light Peach ranunculus in a cream stoneware jug on a small walnut side table next to an oat linen armchair, one open book on the table, 50mm at seated eye level.
L4* Tulips White | 浴室（封面：How to arrange faux tulips in a vase）
C: White tulips loosely arranged in a clear ribbed glass vase on a pale limestone bathroom vanity, limewashed plaster wall, a folded oat linen towel, 50mm at standing eye level, tulip stems gently curving.
L5  Ranunculus Light Peach | 卧室
C: A few Light Peach ranunculus stems in a small cream crock on a white oak bedside table, softly rumpled oat linen bedding at the edge of the frame, morning window light, 50mm.
L6* Classic Coral | 厨房（封面：How to choose the right vase size for faux flowers）
C: Coral classic roses with their buds in a grey handmade stoneware jug on a white oak kitchen counter, plaster backsplash, a linen tea towel. The whole vase and the full stem height are clearly visible so the vase-to-stem proportion reads at a glance. 50mm.
L7* Austin Baby Pink | 书架（封面：How to choose faux flowers for your home）
C: Baby Pink Austin roses in a low terracotta stoneware vase on a walnut bookshelf with a few linen-bound books, 50mm at standing eye level.

第 3 批：首页首屏高清版
现在的首屏太软：桌面 1672×941，手机 1122×1402。
附上 T+ssko-v07-hero-wide.webp 和 T+ssko-v07-hero-mobile.webp 作为构图参考。
HW  桌面 | 16:9，最小 2400 宽
HM  手机 | 4:5，最小 1440×1800
C: Same subject, composition and color mood as the attached current hero: Baby Pink Austin roses arranged on linen, but sharper, with finer petal detail and a more natural light falloff. Do not change the flower color or the linen color.

第 4 批：冬季章节图（首页季节模块，模块上线前要先有获批的图）
WW  16:9，最小 2400 宽 ｜ WM  4:5，最小 1440×1800 ｜ Classic Burgundy
C: Burgundy classic roses with their buds in a cream handmade stoneware vase on a walnut table, low late-afternoon winter sun from the left, deeper but soft shadows, oat linen runner, calm and warm, not festive, no candles, no ornaments.

五、交付
1. 文件名：SSKOI_<花种>_<子ASIN>_<颜色>_<位置ID>-<候选a|b|c>_<宽x高>_Codex_v01_<YYYYMMDD>_REVIEW.<扩展名>
   子 ASIN 查不到写 NA，并在说明里列出。
2. 放到仓库 sskoi-web-integration-v01/ai-images/codex-v01/<位置ID>/。同一文件夹放 delivery.json，每张记录：
   - 位置 ID、文件名、尺寸、SHA-256；
   - 使用的参考图链接；
   - 完整提示词、模型名。
3. 推送到你的分支，回报分支名和 commit。
4. 同时上传到现有 Drive 素材库，按 花种 / 颜色 / 位置 / 版本 归档。核对文件和访问权限，保留现有受限共享。
5. 自检：
   - 每个位置写推荐哪张、为什么、已知问题；
   - 花型、色边、枝数、比例、手指、文字、花器结构有明显问题的标 NEEDS-FIX，不要删。
6. 往交接记录追加一条：版本、改动、自检结果、链接、待办；下一位负责人：Claude（质检）。
7. 还不要做，等 James 和 Rachel 决定是否在网站标注 AI 生成之后再做：手部插花、拆包这类“真实感”生活图。
```
