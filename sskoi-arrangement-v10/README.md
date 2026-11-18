# SSKOI 花艺配方册（v13 文案 + Codex v02 配方图，REVIEW，未发布）

替换网站上的 Arrangement Studio（单枝抠图拼进画出来的花瓶）。新页面有 6 套配方，每套包含：一张搭配示意图、要买的整套花（数量、颜色、ASIN、角色）、花器线稿和建议尺寸、三步摆法，以及“一键加入 Amazon 购物车”。

- Shopify 主题：`sskoi-shopify-v10-0-arrangement-book REVIEW`（181470527681），从 v09.1 复制，包含手机滑动修复。未发布。
- 预览：https://sskoi.com/?view=sskoi-arrangement&preview_theme_id=181470527681
- 配方数据只有一个来源：`build/recipes.py`。它生成 `RECIPES.md`、`SHOTLIST.md`、`recipes.json` 和 `build/template-blocks.json`；带版本号的副本是 `*-v13.*`。
- 配方图：Codex v11-photo-v02（AI 生成，REVIEW），Drive `02_Photos`。网页用的 WebP 在 `photos-v02/`，Shopify Files 中名为 `ssko-v11v02-recipe-NN-<名称>.webp`。复核结论见 `PHOTO-REVIEW-v02.md`。
- 已作废：v01 配方图（`photos-v11/`，James 否决）；v10、v11、v12 的配方文档。

## 上线前

1. James 或 Rachel 逐张批准 01–06 的配方图（见 `PHOTO-REVIEW-v02.md` 的偏差表）。批准后在主题编辑器里取消 “Show the Photo under review tag”。
2. 决定页面是否注明图片由 AI 生成。
3. 用已登录的 Amazon 账号点一次任意配方的加购按钮，确认几件商品都进了购物车。
4. 在 Shopify 后台手动发布主题。

## 主题改动

- 新增：`sections/ssko-v10-recipes.liquid`、`snippets/ssko-v10-vessel.liquid`（含 “jar” 宽口罐线稿）、`assets/ssko-v10.css`
- `snippets/ssko-v09-img.liquid`：srcset 只列不超过原图的宽度
- `templates/index.sskoi-arrangement.json`：6 套配方数据和配方图
- `layout/ssko-v07.liquid`：配方页也用网站页头和页脚
- `sections/sskoi-v07-product.liquid`、`sections/sskoi-lookbook.liquid`：“Try in a vase” 改为 “Arrangement recipes”
- `snippets/ssko-v08-index-meta.liquid`：页面标题和描述

`theme/` 下是配方页文件的副本（section、两个 snippet、CSS、模板），与主题 181470527681 一致（2026-11-18 用 md5 核对，模板按 JSON 内容核对）。

验证（2026-11-18，iPhone 13、iPhone SE、Pixel 7、桌面 1440）：没有 Liquid 错误，没有坏图，没有横向滚动；6 张图都加载（HTTP 200）；6 个加购链接的 ASIN 数和配方一致；按钮高度 ≥ 44 px；“How to arrange” 能展开。
