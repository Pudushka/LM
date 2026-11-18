# 给 Gemini 的提示词 v01（2026-11-18，Claude，REVIEW）

这份取代 `BRIEF-01_flower-detail-paper-Gemini.md`，并增加第二批：平铺图。

依据：`SSKOI-visual-handbook-v01.md` 第 1、2、5、6 节。

## Drive 文件夹（2026-11-18 已由 Claude 放好）
- 原图 58 张，按编号命名，附清单：https://drive.google.com/drive/folders/1AzTcHDaVSDypLWN3BGhOuOYMQyPOlOE5
- 成图放这里：https://drive.google.com/drive/folders/1o2l__Ix-lUcj9PmU5coqE0zV3XQQrWD3
- 两个文件夹都在共享协作目录里，沿用原有的受限共享（James、Rachel、sskoillc、QL76.88）。

## 怎么用
1. 用 Gemini 的图片编辑功能。如果有 Pro 图像模型，优先用它，分辨率更高。
2. 新开一个对话，先把下面整段提示词发过去。
3. 之后每次上传一张原图，并附上那张图的编号，例如 `D01`。一次只发一张。
4. 花有变化就让它重做，或者换一个新对话。
5. 把输出存到同一个文件夹，文件名不用改。我会按编号和画面自动和原图对上，再逐张质检。

## 复制给 Gemini 的提示词
```
You are editing product photos of SSKOI faux flowers for a premium home brand website. I will send one original photo at a time, with an ID such as D01 or S01. For each photo, change ONLY the background. The flowers must stay exactly as they are.

Rules:
1. Replace only the background and the surface the flowers sit on, with one smooth warm paper backdrop: color about #E2D5CF (warm cream with a hint of blush), very fine paper texture, soft natural window light from the left. Keep a soft, realistic shadow under and beside the flowers.
2. Keep every flower, petal, stem, leaf and bud exactly as in the original photo: same shape, color, color edges, texture, count and position. Do not redraw, retouch, recolor, sharpen, beautify or add anything.
3. Keep the same framing, crop and square 1:1 aspect ratio. Output at the same size as the original or larger.
4. Do not add anything: no text, logos, vase, paper vase, gift box, ribbon, hands, extra flowers or props.
5. Clean edges: no white or grey halo, no jagged outline, no leftover pieces of the old background.
6. Where a flower is hard to separate from the old background (for example a white petal against a white wall), be conservative. Never invent new petals or change the flower's outline.
7. For top-down flat lays (IDs starting with S), keep the top-down view. Replace the pink, brown, grey linen or stone surface with the same warm paper. The shadow falls gently toward the lower right.
8. Reply with the edited image only, and write the ID in your reply.
```

## 第一批：28 张 Flower detail（D01–D28，现在是白底或墙面底）
原图前缀：`https://sskoi.com/cdn/shop/t/30/assets/`。文件名里的 peony 就是 Ranunculus。

| ID | 文件 | ID | 文件 |
|---|---|---|---|
| D01 | ssko-v072-austin-hot-pink-detail.webp | D15 | ssko-v072-peony-orange-detail.webp |
| D02 | ssko-v072-austin-pink-detail.webp | D16 | ssko-v072-peony-pink-detail.webp |
| D03 | ssko-v072-austin-purple-detail.webp | D17 | ssko-v072-peony-purple-detail.webp |
| D04 | ssko-v072-austin-red-detail.webp | D18 | ssko-v072-peony-white-detail.webp |
| D05 | ssko-v072-austin-white-detail.webp | D19 | ssko-v072-tulip-dark-purple-detail.webp |
| D06 | ssko-v072-classic-burgundy-detail.webp | D20 | ssko-v072-tulip-green-with-pink-tip-detail.webp |
| D07 | ssko-v072-classic-coral-detail.webp | D21 | ssko-v072-tulip-hot-pink-detail.webp |
| D08 | ssko-v072-classic-mauve-detail.webp | D22 | ssko-v072-tulip-orange-detail.webp |
| D09 | ssko-v072-classic-purple-detail.webp | D23 | ssko-v072-tulip-peach-detail.webp |
| D10 | ssko-v072-classic-white-detail.webp | D24 | ssko-v072-tulip-pink-detail.webp |
| D11 | ssko-v072-classic-white-with-pink-tip-detail.webp | D25 | ssko-v072-tulip-red-detail.webp |
| D12 | ssko-v072-peony-baby-pink-detail.webp | D26 | ssko-v072-tulip-white-detail.webp |
| D13 | ssko-v072-peony-hot-pink-detail.webp | D27 | ssko-v072-tulip-white-with-blue-tip-detail.webp |
| D14 | ssko-v072-peony-light-peach-detail.webp | D28 | ssko-v072-tulip-yellow-detail.webp |

## 第二批：30 张平铺图 Full set（S01–S30，统一成同一种纸面）
2026-11-18 实测：现在 Austin 是粉棕纸，Classic 是灰亚麻，Ranunculus 是灰石面，Tulips 是棕纸，和目标纸色的色差都在 18 到 31 之间。原图前缀同上。

| ID | 文件 | ID | 文件 |
|---|---|---|---|
| S01 | ssko-v072-austin-baby-pink-set.webp | S16 | ssko-v072-peony-light-peach-set.webp |
| S02 | ssko-v072-austin-hot-pink-set.webp | S17 | ssko-v072-peony-orange-set.webp |
| S03 | ssko-v072-austin-light-peach-set.webp | S18 | ssko-v072-peony-pink-set.webp |
| S04 | ssko-v072-austin-pink-set.webp | S19 | ssko-v072-peony-purple-set.webp |
| S05 | ssko-v072-austin-purple-set.webp | S20 | ssko-v072-peony-white-set.webp |
| S06 | ssko-v072-austin-red-set.webp | S21 | ssko-v072-tulip-dark-purple-set.webp |
| S07 | ssko-v072-austin-white-set.webp | S22 | ssko-v072-tulip-green-with-pink-tip-set.webp |
| S08 | ssko-v072-classic-burgundy-set.webp | S23 | ssko-v072-tulip-hot-pink-set.webp |
| S09 | ssko-v072-classic-coral-set.webp | S24 | ssko-v072-tulip-orange-set.webp |
| S10 | ssko-v072-classic-mauve-set.webp | S25 | ssko-v072-tulip-peach-set.webp |
| S11 | ssko-v072-classic-purple-set.webp | S26 | ssko-v072-tulip-pink-set.webp |
| S12 | ssko-v072-classic-white-set.webp | S27 | ssko-v072-tulip-red-set.webp |
| S13 | ssko-v072-classic-white-with-pink-tip-set.webp | S28 | ssko-v072-tulip-white-set.webp |
| S14 | ssko-v072-peony-baby-pink-set.webp | S29 | ssko-v072-tulip-white-with-blue-tip-set.webp |
| S15 | ssko-v072-peony-hot-pink-set.webp | S30 | ssko-v072-tulip-yellow-set.webp |

## 交回之后（Claude）
1. 按画面把每张输出和原图对上。
2. 自动检查：
   - 花的区域和原图比较，色差超过 6 标 NEEDS-FIX；
   - 纸面颜色落在 #E2D5CF 附近；
   - 尺寸不小于原图；
   - 边缘有没有白边或锯齿。
3. 目视复核花型、色边、叶子、花苞有没有被改。
4. 合格的放进未发布主题，标为 REVIEW，等 James 或 Rachel 批准。原图保留。
