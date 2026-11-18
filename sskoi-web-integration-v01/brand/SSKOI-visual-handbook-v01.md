# SSKOI 视觉手册与 AI 出图流程 v01（2026-11-18，REVIEW）

James 决定：近期不安排专业拍摄，网站图片由 AI 生成和编辑。Claude 负责视觉语言、出图流程和质检，Codex、Gemini、Grok 负责出图。等收益允许时再补实拍。本手册是唯一的视觉标准，每次出图都要附上它。

## 1. 原则
1. **花是主角**：每张图先看到花，再看到房间。道具最多两件，比如一本书、一只杯子或一块亚麻布。
2. **准确优先于好看**：花型、颜色、色边、叶形、花苞、比例都以商品原图为准。James 已经否决过一次与实物不符、比例失真、画面假的图（v11-photo-v01）。
3. **能编辑就不重画**：需要准确的位置（Flower detail、颜色卡、平铺图）优先在商品原图上编辑，例如换底、补光，花本身的像素不重画。只有房间氛围、配方场景才从零生成。
4. **一季一个世界**：同一季所有图用同一套光线、色板、材质，下一季整体更换。
5. **诚实**：
   - 每套只有花枝，花器和家具都是道具；
   - 不出现纸花瓶或礼盒；
   - 生成图在页面上标为搭配示意或 AI-assisted；
   - 是否在全站统一注明，待 James/Rachel 决定。

## 2. 色板
**网站色**

| 名称 | 色值 | 用途 |
|---|---|---|
| Paper | #EDE4E1 | 网站底色 |
| Linen | #E2D5D1 | 图片衬底、卡片底 |
| Ink | #1D1418 | 文字、深色区块 |
| Blush | #F6CFCD | 主按钮、强调 |
| Coral | #F47A60 | 极少量强调 |

**画面色**
- 墙面：暖灰石灰墙，约 #D9CFC6。
- 木面：白橡或胡桃木。
- 布料：燕麦色亚麻。
- 花器：手工粗陶（奶白、灰、陶土）和透明玻璃。
- 不要：高饱和道具、亮面塑料、文字和 logo、现代电器、人脸正面。

**统一衬底**
- 产品图（平铺、近景、单枝）统一用暖纸色 #E2D5CF。
- 允许有轻微纸纹和真实柔和的阴影。

## 3. 光线与机位（写进每个提示词）
- **光线**：左侧窗光，柔和、偏暖的日光（约 4000–4500K），阴影柔和但真实存在，没有闪光感，没有强烈的高光反射。
- **机位**：

| 场景 | 设定 |
|---|---|
| 房间全景 | 35mm，站姿眼平 |
| 桌面、台面 | 50mm，坐姿眼平 |
| 近景 | 100mm 微距，浅景深 |
| 平铺 | 正上方 90°，花枝从左下到右上斜放 |

- **画面质感**：像胶片拍的真实家居杂志照片，轻微颗粒，色彩克制，不要 CG 感和塑料感。

## 4. 固定提示词模块
每个提示词按顺序拼接：A 风格锁定 + B 产品锁定 + C 本张内容 + D 禁止项。

- **A 风格锁定（英文，原样复制）**
  > Editorial interior photograph for a quiet luxury home magazine. Soft natural window light from the left, warm daylight around 4300K, gentle real shadows. Limewashed warm grey plaster wall, white oak or walnut surface, oat linen. Muted palette, subtle film grain. Photorealistic, not CGI.
- **B 产品锁定**
  > The flowers must match the attached product reference photos exactly: same flower shape, petal layers, color and color edges, leaf shape and texture, bud shape. Keep real scale: [花种] stems are about [长度] cm long, flower head about [直径] cm.

  花种数据：

  | 花种 | 枝长（cm） | 花头（cm） | 其他 |
  |---|---|---|---|
  | Austin | 44 | 9 | |
  | Classic | 43 | 9 | 带两个花苞 |
  | Tulips | 35 | 3.5 | |
  | Ranunculus | 52 | — | 两朵花一个苞，银绿植绒叶 |

  这些是名义值，以原图标注为准。
- **C 本张内容**：按第 6 节的位置规格写构图、比例和位置。
- **D 禁止项**
  > No text, no logos, no people's faces, no paper vase or gift box, no extra flower types, no water in the vase, no plastic look.

## 5. 分工与流程
1. **出图说明（Claude）**：每张图一份说明，包括位置规格、A–D 提示词、商品原图（该颜色的 set、detail、stem）、2 张风格基准图。
2. **出图**：
   - **Codex**：主力，负责需要和实物一致的场景（房间、配方、花器中）。每个位置出 3 张候选，原生分辨率，不放大。
   - **Gemini**：负责编辑商品原图，比如换成纸面衬底、延展画面、统一光线，但花本身不重画。也可以给 Codex 的图做局部修正。
   - **Grok**：负责找方向，比如每季的首屏构图、氛围备选，不直接用于需要准确的位置。
3. **自动检查（Claude）**：
   - 分辨率达到第 6 节下限，没有放大；
   - 抽取花瓣主色，和原图同部位比较色差（ΔE 超过 6 判为 NEEDS-FIX）；
   - 衬底和墙面颜色落在第 2 节范围内；
   - 和已有图不重复；
   - 文件名和 SHA-256 记录。
4. **目视复核（Claude）**：和原图并排看花型、色边、叶子、花苞、比例；检查手指、文字、花器结构有没有 AI 瑕疵。结论标 REVIEW 或 NEEDS-FIX，写明原因。
5. **批准**：James 或 Rachel 明确批准具体版本后，才标 APPROVED。
6. **接入（Claude）**：放进未发布主题，做手机和桌面测试，给预览链接；正式发布由你们在后台操作。
7. **归档**：
   - Drive 素材库按 “花种 / 颜色 / 位置 / 版本” 存放；
   - 交付 JSON 记录 ID、哈希、来源、参考图；
   - 商品原图和已批准版本保留。

## 6. 各位置规格
| 位置 | 比例 | 最小尺寸（px） | 做法 |
|---|---|---|---|
| 首页首屏（桌面/手机） | 16:9 / 4:5 | 2400 宽 / 1440 宽 | Codex 生成，Grok 先出方向 |
| 首页每种花两张图 | 4:5 | 1440 × 1800 | 房间（Codex）＋近景（原图编辑） |
| 花页 Full set | 1:1 | 1600 | 原图编辑，统一纸面 |
| 花页 Flower detail | 1:1 | 1600 | 原图编辑：白底换纸面，花不重画 |
| 花页 In a vase | 4:5 | 1440 × 1800 | Codex 生成 |
| 花页 Single stem | 1:1 | 1260 | 原图编辑（已完成 4 张） |
| 颜色卡片 | 用 Full set | — | — |
| 房间、Lookbook | 3:2，4:5 裁切也要成立 | 2000 宽 | Codex 生成，以 v09 rooms 为风格基准 |
| 配方图 | 4:5 + 16:9 | 1122 宽起 | Codex（v02 已有） |
| Journal 封面 | 3:2 | 1600 宽 | Codex 或沿用房间图 |

## 7. 待做清单（按优先级）
1. **28 张白底 Flower detail 改纸面**：Austin 5、Tulips 10、Classic 6、Ranunculus 7。
   - 有颜色的花，Claude 直接做确定性换底，花的像素不动；
   - 白色和很浅的花（White、White With Blue Tip、White With Pink Tip、Light Peach、Baby Pink 等），交给 Gemini 编辑，Claude 质检。
2. **平铺图纸面统一**：现在有粉、棕、灰三种。由 Gemini 编辑成统一纸面，花不动。
3. **v5、v6 早期场景换成 v09 风格**：Lookbook 7 张、Journal 封面 6 张，由 Codex 生成。
4. **首页首屏高分辨率版**：桌面原图 1672 宽，偏软。Grok 出方向，Codex 生成。
5. **每季首页章节图**：冬季深色，例如 Burgundy、Dark Purple、Red。
6. **“真实感”生活图**：手部插花、拆包、弯枝。Codex 生成，必须标 AI-assisted，并严格对照原图。

## 8. 风格基准图（出图时作为参考附上）
- 房间：`ssko-v09-rooms-austin-baby-pink-wabi-dinner-table.webp`、`ssko-v09-rooms-classic-coral-wabi-reading-table.webp`
- 近景：`ssko-v09-closer-classic-coral-petal.webp`、`ssko-v09-closer-ranunculus-light-peach-bud.webp`
- 单枝：`ssko-v102-*-stem.webp`（纸面版）

## 9. 命名与交付
- 命名：`SSKOI_<花种>_<ASIN>_<颜色>_<位置>_<宽x高>_<来源 Codex|Gemini|Grok|Claude-edit>_v01_<日期>_REVIEW.<ext>`
- 状态：默认 REVIEW；有明确问题标 NEEDS-FIX；只有 James 或 Rachel 批准后才标 APPROVED。
