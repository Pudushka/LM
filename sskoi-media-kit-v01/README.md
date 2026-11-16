# SSKOI 素材包 v01（REVIEW）

2026-11-14 制作。给官网和社交媒体用的图片与短视频，杂志式版面。全部状态 **REVIEW**，未经 James 或 Rachel 批准，未发布到任何渠道。

## 里面有什么

| 目录 | 数量 | 规格 | 用途 |
|---|---|---|---|
| `out/feed/` | 21 张 | 1080 × 1350（4:5）JPEG | Instagram / 小红书信息流帖子 |
| `out/story/` | 5 张 | 1080 × 1920（9:16）JPEG | Story、Pinterest 竖图 |
| `out/photo/` | 24 张 | 4:5 共 16 张，16:9（1920 × 1080）共 8 张 | 无文字的干净裁切，官网版块、广告、自行排版 |
| `out/video/` | 7 条 MP4 + 封面图 | 竖版 1080 × 1920，横版 1920 × 1080 和 1280 × 720 | Reels / TikTok / 官网首屏循环 |

### 信息流帖子的六种版式

- **Cover**（5 张）：整幅照片加大标题，像杂志封面。
- **Detail-Plate**（4 张）：一张花瓣特写裱在纸色底上，配一行说明。
- **Styling-Note**（4 张）：两张图加一条搭配建议。
- **All-Colours**（5 张）：一款花的全部颜色，用去掉白底的实物图排在同一纸色底上。
- **Statement**（3 张）：大标语加一束花。

### 视频

| 文件 | 时长 | 内容 |
|---|---|---|
| `Brand_In-Bloom_Reel_9x16` | 15 秒 | 品牌片：五个镜头加字幕，片尾品牌卡 |
| `All-Flowers_37-Colours_Reel_9x16` | 20 秒 | 37 个颜色逐一切换 |
| `Tulip_White` / `Classic-Rose_Coral` / `Ranunculus_Light-Peach` / `Austin-Rose_Baby-Pink` `_Reel_9x16` | 各 9 秒 | 每款花一条：花瓶场景、花瓣特写、平铺 |
| `Brand_Website-Hero-Loop_16x9`（另有 720p 版） | 24 秒 | 官网首屏背景，无文字，首尾相接可循环 |

视频都没有声音。发布时在平台里配音乐。

## 素材来源

没有新拍摄，也没有新生成任何画面。全部由现有素材重新裁切、排版和合成：

- 郁金香、普通玫瑰、植绒露莲的场景与特写：Drive 上 Listing v19 的 02–05 图（White 15 枝、Coral 6 枝、Light Peach 4 枝）。
- 奥斯汀玫瑰：Listing v15 的 PT01–PT04，裁掉了原图上的标题和边框。
- 品牌封面的亚麻布玫瑰：网站 v06 首屏图。
- 全色系图里的花束：Listing v16/v19 主图和礼盒实物图，去掉了白底（见 `../sskoi-v08/tools/cutout.py`）。

这些来源图本身是 AI 辅助生成或编辑的，状态都是 REVIEW。素材包继承了它们的全部问题：花型、颜色、枝数是否与实物一致，仍需要 James 或 Rachel 对照实物确认。

## 已知限制

- **视频是静态照片的慢推和淡入淡出**，不是实拍，花不会动。
- **奥斯汀玫瑰的图分辨率偏低**（裁切后约 1860 × 1600），放大到竖版会略软。
- **白色花束只适合浅色底**。去底后的白玫瑰、白露莲放在深色底上会露出缺口。
- **郁金香 10 个颜色的主图是同一构图换色**，不是逐色实拍。
- **文案**里的枝数、颜色数、每枝花苞数来自 SKU 登记表和网站 v06 文案。没有写价格、评价或销量。
- Reel 和 Story 的文字放在画面 y=230 到 y=1560 之间，避开 Instagram 顶部和底部的界面。没有在真机上发布测试过。

## 重新生成

```bash
node build/make-stills.js
```

```bash
python3 build/make-photos.py
```

```bash
node build/make-video.js
```

文案和选图在 `build/data.js`，版式在 `build/kit.css`。需要 Node、Playwright（Chromium）、Python Pillow 和 ffmpeg；字体从 Google Fonts 加载（Bodoni Moda、Hanken Grotesk、DM Mono）。
