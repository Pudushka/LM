# SSKOI 花艺配方册 v10（REVIEW，未发布）

替换现在网站上的 Arrangement Studio（单枝抠图拼进画出来的花瓶）。新页面是 8 套配方：每套一张完整的实景照片、要买的整套花（数量、颜色、ASIN）、花器线稿和尺寸、三步摆法，以及“一键加入 Amazon 购物车”。

- Shopify 主题：`sskoi-shopify-v10-0-arrangement-book REVIEW`（181470527681），从 v09.1 复制，包含手机滑动修复。未发布。
- 预览：https://sskoi.com/?view=sskoi-arrangement&preview_theme_id=181470527681
- 配方和拍摄清单：`RECIPES.md`、`SHOTLIST.md`，都由 `build/recipes.py` 生成；Drive `SSKOI_Arrangement-Recipes_v10_REVIEW_20261117`，照片交到 `02_Photos`。

## 上线前

1. Codex 按 `SHOTLIST.md` 生成 16 张照片（每套 4:5 和 16:9），和商品图对照检查花型、颜色、枝数。
2. 在主题编辑器里给每套配方换上新照片，取消 “Mark as stand-in photo”。现在的临时照片和配方花材不完全一致，不能上线。
3. 用自己的 Amazon 账号点一次任意配方的加购按钮，确认几件商品都进了购物车。未登录的客人会先被要求登录。
4. James 或 Rachel 确认 04 用的 Austin Roses with Eucalyptus（B0FLLPR1W9）可以放在网站上推荐。

## 主题改动

- 新增：`sections/ssko-v10-recipes.liquid`、`snippets/ssko-v10-vessel.liquid`、`assets/ssko-v10.css`、`assets/ssko-v10.js`
- `templates/index.sskoi-arrangement.json`：换成新区块和 8 套配方数据
- `layout/ssko-v07.liquid`：配方页也用网站页头和页脚
- `sections/sskoi-v07-product.liquid`、`sections/sskoi-lookbook.liquid`：“Try in a vase” 改为 “Arrangement recipes”
- `snippets/ssko-v08-index-meta.liquid`：页面标题和描述

验证（桌面 1440、iPhone 13、iPhone SE）：没有 Liquid 错误、没有坏图、没有横向滚动；筛选、空结果和重置正常；8 个加购链接的 ASIN 和数量与配方一致。
