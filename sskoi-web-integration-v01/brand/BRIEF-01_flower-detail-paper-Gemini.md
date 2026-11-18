# 出图单 01：28 张 Flower detail 换纸面衬底（Gemini 编辑，REVIEW）

2026-11-18，Claude。依据《SSKOI 视觉手册与 AI 出图流程 v01》第 5–7 节。

## 为什么要做
花页图库里 “Flower detail” 一格，有 28 个颜色还是白底或窗光墙面背景，和纸面平铺图、纸面单枝尺寸图不统一。我先试了确定性换底，但原图背景里有窗光条纹和偏色，换完花的边缘会出现锯齿状白边，所以不用。这一批改为 Gemini 只编辑背景。

## 对每张图的统一指令（英文，原样使用）
> Edit this product photo. Replace only the background with a warm matte paper backdrop, color close to #E2D5CF, with a soft natural shadow from window light on the left. Do not change the flowers, petals, leaves, stems or buds in any way: keep their exact shape, color, color edges, texture and position. Keep the same framing and crop. No text, no props, no vase. Photorealistic. Output a square image at least 1600 x 1600 if the model can, otherwise the same size as the input, without upscaling artifacts.

浅色花（White、White With Blue Tip、White With Pink Tip、Light Peach、Baby Pink）在指令后面再加一句：
> The petals are white or very pale; keep them exactly as pale as in the input and do not tint them with the background color.

## 质检（Claude）
1. 花瓣主色和原图同部位比较，色差 ΔE 超过 6 判为 NEEDS-FIX；花型、色边、叶形任何改动也判为 NEEDS-FIX。
2. 背景落在暖纸色范围内，不能有残留的白边、光斑或锯齿。
3. 尺寸不小于输入图；不能由放大得到。
4. 通过的标 REVIEW 并接入未发布主题；James 或 Rachel 批准后标 APPROVED。

## 清单（28 张）
| # | 花种 | 颜色 | 注意 | 原图 | 交付文件名 |
|---|---|---|---|---|---|
| 1 | Austin Roses | White | 浅色，重点核对花瓣 | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-austin-white-detail.webp) | `SSKOI_Austin-Roses_B0DTFNZQRG_White_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 2 | Austin Roses | Purple |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-austin-purple-detail.webp) | `SSKOI_Austin-Roses_B0DTFNB9BG_Purple_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 3 | Austin Roses | Pink |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-austin-pink-detail.webp) | `SSKOI_Austin-Roses_B0DTFPD9F9_Pink_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 4 | Austin Roses | Hot Pink |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-austin-hot-pink-detail.webp) | `SSKOI_Austin-Roses_ASIN-TBC_Hot-Pink_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 5 | Austin Roses | Red |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-austin-red-detail.webp) | `SSKOI_Austin-Roses_ASIN-TBC_Red_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 6 | Real-Touch Tulips | White | 浅色，重点核对花瓣 | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-tulip-white-detail.webp) | `SSKOI_Real-Touch-Tulips_B0DQDXM72R_White_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 7 | Real-Touch Tulips | Yellow |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-tulip-yellow-detail.webp) | `SSKOI_Real-Touch-Tulips_ASIN-TBC_Yellow_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 8 | Real-Touch Tulips | Peach |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-tulip-peach-detail.webp) | `SSKOI_Real-Touch-Tulips_ASIN-TBC_Peach_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 9 | Real-Touch Tulips | Orange |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-tulip-orange-detail.webp) | `SSKOI_Real-Touch-Tulips_ASIN-TBC_Orange_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 10 | Real-Touch Tulips | Green With Pink Tip |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-tulip-green-with-pink-tip-detail.webp) | `SSKOI_Real-Touch-Tulips_B0DQF16XSS_Green-With-Pink-Tip_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 11 | Real-Touch Tulips | Hot Pink |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-tulip-hot-pink-detail.webp) | `SSKOI_Real-Touch-Tulips_ASIN-TBC_Hot-Pink_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 12 | Real-Touch Tulips | Pink |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-tulip-pink-detail.webp) | `SSKOI_Real-Touch-Tulips_ASIN-TBC_Pink_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 13 | Real-Touch Tulips | Red |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-tulip-red-detail.webp) | `SSKOI_Real-Touch-Tulips_ASIN-TBC_Red_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 14 | Real-Touch Tulips | Dark Purple |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-tulip-dark-purple-detail.webp) | `SSKOI_Real-Touch-Tulips_B0DQDVL846_Dark-Purple_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 15 | Real-Touch Tulips | White With Blue Tip | 浅色，重点核对花瓣 | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-tulip-white-with-blue-tip-detail.webp) | `SSKOI_Real-Touch-Tulips_ASIN-TBC_White-With-Blue-Tip_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 16 | Classic Roses | Coral |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-classic-coral-detail.webp) | `SSKOI_Classic-Roses_B0DSWT9NMF_Coral_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 17 | Classic Roses | Burgundy |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-classic-burgundy-detail.webp) | `SSKOI_Classic-Roses_B0DSXY4KDH_Burgundy_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 18 | Classic Roses | Purple |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-classic-purple-detail.webp) | `SSKOI_Classic-Roses_ASIN-TBC_Purple_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 19 | Classic Roses | Mauve |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-classic-mauve-detail.webp) | `SSKOI_Classic-Roses_ASIN-TBC_Mauve_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 20 | Classic Roses | White With Pink Tip | 浅色，重点核对花瓣 | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-classic-white-with-pink-tip-detail.webp) | `SSKOI_Classic-Roses_B0DSWSM1QY_White-With-Pink-Tip_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 21 | Classic Roses | White | 浅色，重点核对花瓣 | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-classic-white-detail.webp) | `SSKOI_Classic-Roses_ASIN-TBC_White_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 22 | Flocked Ranunculus | Light Peach | 浅色，重点核对花瓣 | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-peony-light-peach-detail.webp) | `SSKOI_Flocked-Ranunculus_B0DTYG3SY1_Light-Peach_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 23 | Flocked Ranunculus | Baby Pink | 浅色，重点核对花瓣 | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-peony-baby-pink-detail.webp) | `SSKOI_Flocked-Ranunculus_B0DTYL1GYT_Baby-Pink_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 24 | Flocked Ranunculus | Pink |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-peony-pink-detail.webp) | `SSKOI_Flocked-Ranunculus_B0DTYBPB9F_Pink_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 25 | Flocked Ranunculus | Hot Pink |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-peony-hot-pink-detail.webp) | `SSKOI_Flocked-Ranunculus_ASIN-TBC_Hot-Pink_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 26 | Flocked Ranunculus | Orange |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-peony-orange-detail.webp) | `SSKOI_Flocked-Ranunculus_B0DTYBG3DP_Orange_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 27 | Flocked Ranunculus | White | 浅色，重点核对花瓣 | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-peony-white-detail.webp) | `SSKOI_Flocked-Ranunculus_B0DTYJ5V1W_White_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |
| 28 | Flocked Ranunculus | Purple |  | [原图](https://sskoi.com/cdn/shop/t/29/assets/ssko-v072-peony-purple-detail.webp) | `SSKOI_Flocked-Ranunculus_ASIN-TBC_Purple_Flower-Detail_1600x1600_Gemini_v01_20261118_REVIEW.png` |

ASIN 一栏写 ASIN-TBC 的，交付前按亚马逊子 ASIN 补上。

交付：上传到 Drive 素材库 `02_Web-Assets` 下新建的 `Flower-Detail_Paper_v01` 文件夹，并附一份交付 JSON（文件名、尺寸、SHA-256、对应原图）。
