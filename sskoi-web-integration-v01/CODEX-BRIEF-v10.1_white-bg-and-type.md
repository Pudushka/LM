# Codex 交接：全站白底图和衬线细线优化（v10.1，REVIEW）

2026-11-18，Claude → Codex。来源：用户在 iPhone Safari 上截的正式站（v09.0）四张图，同目录 `user-screens-20261118-1..4.png`。

## 用户反馈

1. **网站上所有白底图都不好看，白底显得很突兀。**
2. **衬线字体（Bodoni Moda）的细线部分太细，有时候看不到。**

截图里能看到的位置（需要全站排查，不限于这些）：
- 首页 “Look closer.” 横滑：Tulips Peach 等 detail 图是白底。
- 首页深色区 “Every flower, every color.” 的颜色横滑：Austin White/Purple/Pink 等白底图贴在深底上，最刺眼。
- 花种区块 “FULL SET / UP CLOSE”、“IN A ROOM / UP CLOSE” 里的 UP CLOSE 图是白底。
- “All flowers / Roses / Tulips / Ranunculus / Gift sets · 5 styles” 网格：平铺图外面套了白色卡片和很宽的白边。
- 各花页（`/?view=sskoi-austin`、`sskoi-tulip`、`sskoi-classic`、`sskoi-peony`、`sskoi-rose-gift`）的 Up close 和颜色小图同理。

## 工作主题和规则

- 从 v10.0（181470527681，包含 v09.1 的手机滑动修复和配方册）复制一个新主题 `sskoi-shopify-v10-1-visual-polish REVIEW` 再改。复制后等 `processing:false` 再动手。
- 不改正式主题 MAIN（181465219265，v09.0）。v10.0 保留为配方册审阅快照，不在上面改。
- 发布由用户在 Shopify 后台手动操作，James 或 Rachel 批准前不发布。新图、新主题都是 REVIEW。
- 花型、颜色、色边、绒叶、花芯和套装内容，以商品原图为准；不改变商品本身。
- 网站文案用美式拼写。

## 1. 白底图清单

用 Playwright 打开所有页面：首页、5 个花页、礼盒页、lookbook、journal、about、配方页（`?view=sskoi-arrangement`）。对每个可见的 `<img>` 取边缘一圈像素，平均亮度大于 245 且饱和度低的判为白底。产出 CSV，列出文件名、页面、section/block、显示尺寸、所在区域是浅底还是深底。

## 2. 替换原则（按优先级）

1. **卡片和网格**：去掉白色卡片底和内边距，图片满幅显示（`object-fit: cover`），卡片底色用页面纸色或同色系深一级。
2. **有带背景的版本就换**：`ssko-v072-*-set.webp`（彩色纸面平铺）、各花的 room/scene 图、media kit v02 场景图。UP CLOSE 可以从平铺图或场景图裁近景，裁完宽度不小于 900 px，不放大。
3. **没有可用近景时再生成**：以商品 detail 原图为参考，用 ImageGen 生成同一花、同一颜色、背景为亚麻、纸面或石灰墙的近景。逐张和原图并排比对，不符的标 NEEDS-FIX。
   - **不要抠图换背景**：用户之前明确否决过抠图碎裂感。
   - 文件按花种、子 ASIN、颜色、用途、版本命名，状态 REVIEW。
4. **深色区 “Every color” 不放白底图**。暂时没有替代图时，宁可用平铺图，或把这一段改成浅底。
5. Shopify Files 上传后核对宽高。`ssko-v09-img` 已限制 srcset 不超过原图宽度，新增图片位请沿用这个 snippet。

## 3. 衬线细线

1. 先查 layout 里 Google Fonts 的加载。Bodoni Moda 要带 opsz 轴：`Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900`。
2. 默认的 `font-optical-sizing: auto` 会让大字号用高 opsz，细线更细。改为按字号设置 `font-variation-settings: "opsz" N`，起点建议如下（以真机效果为准）：

   | 字号 | opsz | weight |
   |---|---|---|
   | ≥ 56 px 的大标题 | 约 28–36 | 500 |
   | 24–55 px（h2、卡片标题） | 约 11–14 | 500 |
   | 深底上的浅色字 | 同上 | 再加一档，500–600 |

   正文和小字不用 Bodoni。
3. 不要用 `-webkit-text-stroke` 或文字阴影来加粗。
4. 如果调整后仍然发虚，可以提出一款低对比的备选衬线。换品牌字体需要 James/Rachel 同意。
5. **验收**：用 Playwright 的 iPhone 13（DPR 3）和 iPhone SE（DPR 2）截图，最好再加真机。h1、h2、卡片标题、斜体和深底标题，在 100% 缩放下细线都要清楚。改前改后并排对比。

## 4. 验收和交付

- **验收范围**：宽度 375、390、412、768、1440 都要看。
  - 没有横向滚动，没有 Liquid 错误，没有坏图。
  - 首屏主图不懒加载。
  - v09.1 的手机滑动修复不回退。
  - 配方页 6 张图的审阅标记还在。
- **交付到本目录**：
  - 新主题 ID 和预览链接；
  - 每处改动的改前/改后截图；
  - 替换清单（旧文件 → 新文件、来源、状态）；
  - 字体参数表。
  - 状态 REVIEW。

## 仍在等待的事项（不要丢）

- 配方册 v10.0：6 张 v02 图已接入，带审阅标记，等 James/Rachel 逐张批准。颜色偏差见 `PHOTO-REVIEW-v02_Claude.md`（配方目录）：01 Austin 偏粉、花蕊偏开，02 Coral 偏橙，06 两种花偏深。
- 是否在页面注明图片由 AI 生成，等 James/Rachel 决定。
- Amazon 组合加购需要用已登录账号点一次确认。
- 不用的主题副本 181465022657 可在后台删除。
- 交接记录是 Google Doc，Claude 的连接器写不进去，请有权限的人追加。
