# SSKOI 素材包 v02（REVIEW）

2026-11-17 制作。沿用 v01 的杂志版式（纸色底、Bodoni Moda 标题、DM Mono 小字），把范围扩大到六个系列的全部颜色。全部状态 **REVIEW**：未经 James 或 Rachel 批准，没有发布到任何渠道。

共 **348 个文件**：324 张图片，12 条短视频和 12 张视频首帧。

## Drive 位置

协作目录 → `SSKOI_Media-Kit_v02_REVIEW_20261117`
https://drive.google.com/drive/folders/1TgA77LQUEsLB98AN0rWUN48973ceCDpJ

权限继承协作目录：Owner 和三位协作者可编辑，没有公开链接。

| 文件夹 | 数量 | 规格 | 内容 | Folder ID |
|---|---|---|---|---|
| `01_Photo_No-Text/Tulip_15-Stems` | 40 | 4:5、16:9 | 10 色 × 花瓶、花瓣特写、平铺、单枝 | `1ckbC7htriQKmvrifLzVsLJqYJrwVCbGW` |
| `01_Photo_No-Text/Classic-Rose_6-Stems` | 24 | 4:5、16:9 | 6 色 × 花瓶、花瓣特写、平铺、花与花苞 | `1qFO9pZJRFkBrsHZqoAEzYeDaX2ocjxWi` |
| `01_Photo_No-Text/Ranunculus_4-Stems` | 28 | 4:5、16:9 | 7 色 × 花瓶、花瓣特写、平铺、花与花苞 | `1rRiCrlxbAaZJQFL1E0m835DFeMtw3qmy` |
| `01_Photo_No-Text/Austin-Rose_6-Stems` | 35 | 4:5、16:9 | 7 色 × 花瓶、平铺、客厅、花瓣特写、单枝 | `1xiRN3UqpWBnpoRKRXW6hIx1pX53h1DyR` |
| `01_Photo_No-Text/Austin-Rose-Eucalyptus_6-Roses-6-Eucalyptus` | 35 | 1:1、4:5、16:9 | 7 色 × 花瓶、拱门、花瓣特写（两种比例）、平铺 | `1IONU7hSc4B0K7GGYo7CY8HqD1D3yADHy` |
| `01_Photo_No-Text/Rose-Gift-Box_8-Stems` | 14 | 4:5、16:9 | 7 色花器搭配场景 | `1bR3Gpk32SJHjEMjOzd_scbAYghLdDwNN` |
| `01_Photo_No-Text/Scenes` | 20 | 9:16、4:5 | 侘寂房间 5 张、木格栅墙边桌 5 张，各两种比例 | `1Z_n9f1RXZhRlyh0o2szQBOWasy-X_-Jg` |
| `02_Feed_4x5` | 68 | 1080 × 1350 | 封面 44、细节 10、色卡 6、标语 3、房间封面 5 | `1t194kaFsltOj8p_a8qDp7etm0W-qe-5x` |
| `03_Story_9x16` | 28 | 1080 × 1920 | 每个系列 3 张，房间 10 张 | `1GAfi-CdPBuihbwCMEOGTnWchTfw9Q1Lg` |
| `04_Wide_16x9` | 32 | 1920 × 1080 | 色卡 6、三联 11、横幅封面 13、房间系列 2 | `1LuOyn2Ivj_PQIhKFTo2FQYhRSNp7ypoA` |
| `05_Video` | 12 + 12 | 1080 × 1920、1920 × 1080 | MP4 和首帧 JPG | `18eK2Vvxwrz6lvqNU8Jk3Ykn1KLlJhxU4` |

根目录另有 `README.md`（本文件）、`manifest.csv` 和五张 `00_Overview_*.jpg` 总览图。

## 给 Codex：怎么读

`manifest.csv`（UTF-8 带 BOM）每行一个文件。主要列：

| 列 | 说明 |
|---|---|
| `file` / `drive_path` | 文件名，以及它在 Drive 里的相对路径 |
| `type` | `Photo`（无文字）、`Feed`、`Story`、`Wide`、`Video` |
| `layout` | `Photo`、`Scene`、`Cover`、`Detail-Plate`、`Colour-Card`、`Statement`、`Room-Cover`、`Story`、`Room-Story`、`Triptych`、`Wide-Cover`、`Series`、`Reel`、`Loop (no text)`、`Video poster` |
| `ratio` / `pixels` | `4x5`、`9x16`、`16x9`、`1x1` |
| `family` / `set` / `colour` | 系列、套装规格、颜色 |
| `child_asin` / `asin_check` | 子 ASIN 和核对状态（来自 SKU 登记表的映射，见下方注意事项） |
| `shot` / `source_file` / `source_px` / `upscale` | 镜头、来源文件、来源裁切像素、放大倍数（大于 1 表示放大过） |
| `note` | 使用限制 |

文件命名：`SSKOI_<系列>_<颜色>_<套装>_<版式>-<镜头>_<比例>_v02_REVIEW.jpg`。例：`SSKOI_Ranunculus_Hot-Pink_4-Stems_Photo-Petal-Detail_4x5_v02_REVIEW.jpg`。

做网站时：
- **商品详情页的颜色图**用 `01_Photo_No-Text`，每个颜色同一组镜头，可以按颜色直接替换。
- **首屏或横幅**用 `01_Photo_No-Text` 的 16:9 或 `04_Wide_16x9` 里不带文字的照片；带文字的成图不要再叠文字。
- **背景视频**用 `05_Video` 里的 `Loop_16x9`，不带文字，首尾相接可循环。

## 视频

都没有声音，画面是静态照片的换色和慢推，花本身不动。

| 文件 | 时长 |
|---|---|
| 郁金香、普通玫瑰、植绒露莲、奥斯汀、奥斯汀＋尤加利的 `Colour-Change_Reel_9x16`（全部颜色依次切换，带标题和颜色名） | 8–13 秒 |
| `Rose-Gift-Box_All-Colours_8-Stems_Vase-Styling_Reel_9x16` | 10.5 秒 |
| `All-Flowers_Five-Colours_Wabi-Sabi-Rooms_Reel_9x16`（五个房间） | 10 秒 |
| 上面五个系列的 `Colour-Change_Loop_16x9`（无文字，官网背景用） | 8–13 秒 |

每条视频都压到 3 MB 以下，以便通过连接器上传 Drive。画质比 v01 原尺寸视频低一些，需要更高码率时可以按下面的方法重新生成。

## 素材来源

没有新拍摄，也没有新生成画面。全部由 Drive 上现有的 REVIEW 素材重新裁切、排版和合成：

| 系列 | 来源 |
|---|---|
| 郁金香、普通玫瑰、植绒露莲 | Listing v19 每色 5 图（2000 × 2000） |
| 奥斯汀 6 枝、奥斯汀＋尤加利 | A+ v18 每色的 `Source-AI-Photo-Plates_REVIEW` 无文字原图（约 1594 × 987 和 1536 × 1024） |
| 玫瑰礼盒 8 枝 | Listing v03 `04-Vase-Styling`（2000 × 2000） |
| 房间场景 | Codex 的 Wabi-Sabi v02（Gemini 生成）和 Wood-Slat v08.5（以 Pexels 上 Amar Preciado 的照片为底） |
| 标语图里的花束 | Listing 主图去白底（`../sskoi-v08/tools/cutout.py`） |

这些来源本身是 AI 辅助生成或编辑的 REVIEW 文件，素材包继承它们的全部问题。

## 注意事项（使用前需要确认）

1. **郁金香是 15 枝纸花器款的图**。网站在售的白色郁金香是 12 枝盒装 B0DQDXM72R；房间场景里的白色郁金香才是 12 枝。不要把 15 枝的图放到 12 枝商品页。
2. **玫瑰礼盒的单品照片都是陶瓷花瓶搭配示意，看不到纸盒花器**。礼盒自带的是纸盒花器，商品页必须同时放原商品图。房间场景里 Burgundy 礼盒的绿色印花高花器才是纸盒。
3. **奥斯汀两套的 A+ 原图花型和 Listing 主图不完全一致**（A+ 图花心有明显黄色花蕊、花瓣更松散），Red、Hot Pink 两色和主图的色调也有差异。需要 James 或 Rachel 对照实物确认。
4. **奥斯汀＋尤加利的子 ASIN** 只有 Baby Pink（B0FLLPR1W9）和 Champagne（B0FLLB1TRY）是目录已标注的，其他五色是按 SKU 登记表推断的，`asin_check` 列写着“待确认”。奥斯汀 6 枝 Light Peach 和礼装 Champagne 的颜色命名也待确认。
5. **放大**：奥斯汀两套的 16:9 照片由约 1600 像素宽的原图放大到 1920，`upscale` 列约 1.2–1.25，大图看会略软。
6. 所有花瓶、桌面和家具都是搭配示意，不含在套装内。文案里的枝数、颜色数和“每枝一花两苞 / 两花一苞”来自 SKU 登记表和网站文案，没有写价格、评价或销量。

## 重新生成

```bash
python3 -I build/catalog.py
```

```bash
python3 -I build/make-photos.py
```

```bash
node build/make-stills.js
```

```bash
node build/make-video.js
```

```bash
python3 -I build/make-manifest.py
```

源图放在 `raw/`（未入库，可按 `build/sources.tsv` 从 Drive 重新下载）。版式在 `build/kit.css`，选图和文案在 `build/make-stills.js`。需要 Node、Playwright（Chromium）、Python Pillow 和 ffmpeg。
