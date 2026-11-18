# SSKOI 网站 v10.2 精简版（quiet edit，REVIEW，未发布）

2026-11-18，Claude。从当前正式主题 v10.1（181477900481，MAIN）复制出 `sskoi-shopify-v10-2-quiet-edit REVIEW`（**181481275585**），所有改动只写在 v10.2，正式站没有改动。

预览：https://sskoi.com/?preview_theme_id=181481275585

目标：去掉不必要的文字，让网站更安静、简洁、有高级感。只删减和统一，不新增图片，不改商品图，也不改套装内容的说明。

## 字数变化（iPhone 13 页面可见文字，含页头页脚）

| 页面 | v10.1 | v10.2 |
|---|---:|---:|
| 首页 | 649 | 230 |
| Austin / Tulips / Classic / Ranunculus / 礼盒 | 231 / 249 / 300 / 293 / 304 | 138 / 151 / 183 / 180 / 184 |
| Lookbook | 434 | 368 |
| 商品页 /products/tulips | 203 | 121 |
| About / Care | 165 / 192 | 147 / 174 |

首页高度从 8288 px 降到 5754 px（390 宽）。

## 改了什么

**全站**
- About、Care、Lookbook、全部花（`?view=sskoi-shop`）和 Journal（博客列表、文章）改用品牌页头页脚。原来这些页面还是 Dawn 的汉堡菜单、搜索、购物车、“Subscribe to our emails”、支付图标和 “Powered by Shopify”。商品页、购物车、搜索仍用 Dawn 页头，保留购物车。
- 页脚去掉可见的 “v10.1” 版本号。版本号改为隐藏属性 `data-ssko-site-version="v10.2"`，QA 仍能读到。
- “Visit the SSKOI store on Amazon” 改为 “Shop on Amazon”。

**首页**
- 首屏：去掉右下 “Shown · Austin Roses · Baby Pink · 6 stems”；按钮改为 “Shop on Amazon”。
- Find your flowers：
  - 去掉导语，以及每种花下的颜色名、“7 colors” 计数和两张图下的 “Full set / Up close” 标签。
  - 规格缩短为 “6 stems”“12 stems”“6 stems · 2 buds on each”“4 stems · 2 flowers and a bud on each”“8 stems · paper vase included”。
  - 整行描边按钮 “Explore colors” 改为文字链接 “Explore”。
- Every color：
  - 去掉说明句和标签上的数字角标；
  - 色卡去掉 01–06 编号；
  - 去掉 “Classic Roses · 6 colors · Close-up photos” 一行，保留 “Shop Classic Roses”。
- Flowers at home：
  - 去掉导语；卡片只写花名；
  - 说明改为 “Styled scenes. Each flower page shows what comes in the set.”（保留搭配示意的提示）。
- Look closer、How to shop、Before you order：默认不显示。
  - 理由：近景图已经在 Find your flowers 和各花页出现；常见问题在 Care 页。
  - 主题编辑器里有两个开关（Show Look closer、Show How to shop and questions），随时可以恢复，内容都还在。
- 礼盒：说明缩短为 “Eight rose stems in a paper box that opens into a vase.”，图上的 “Coral · Gift set” 标签隐藏（元素保留，切色脚本不受影响）。
- Journal：只列标题，不再显示摘要。
- 手机底部原来是整条黑底栏（Explore flowers ＋ Shop on Amazon），改为右下角一个浮动的 “Shop on Amazon” 胶囊按钮。

**花页（5 个）**
- 去掉主图下重复的 “Baby Pink · Full set” 说明（对读屏仍可读），缩略图标签保留。手机上隐藏面包屑。
- 去掉 “Styling and care” 折叠项和 “Read arranging and care guides” 链接；保留 “What’s included”。
- 去掉 “Six stems. Six full blooms.” 那一整块数字说明（内容与规格和 What’s included 重复）。
- In every color：去掉 “Tap a color to switch…” 和 “7 colors”。
- at home 说明缩短为 “Vase and furniture shown for styling.”；礼盒页为 “Shown with the paper vase from the box.”
- More flowers 去掉每张卡片下的规格小字；礼盒近景标签去掉 01–03 编号。
- 礼盒规格改为 “8 stems · paper vase included”。

**其他页面**
- Lookbook：去掉 8 个房间跳转按钮和 “See each product page…” 一行。导语改为 “Eight rooms, styled with SSKOI flowers. Vases shown are styling props.”。Sideboard 一条改为 “Coral on a quiet sideboard. Shown in a ceramic vase; the set comes with its own paper vase.”
- 全部花页：隐藏 “5 styles” 计数（对读屏仍可读）。
- 商品页 /products/tulips：停用两段 Dawn 占位内容（“Image with text / Pair text with an image…”、“Free Shipping / Hassle-Free Exchanges” 的示例文字）。区块只是设为 disabled，可在编辑器恢复。
- 配方页：卡片小标题去掉 “Analogous / Tonal”，只保留 “No. 01 · 10 stems”；导语缩短。

## 改动的主题文件

`assets/ssko-v102.css`（新增，副本在本目录，md5 与主题一致）、`layout/theme.liquid`、`layout/ssko-v07.liquid`、`sections/sskoi-v07-home.liquid`、`sections/sskoi-v07-product.liquid`、`sections/ssko-v09-flower-more.liquid`、`sections/ssko-v09-site-footer.liquid`、`sections/sskoi-lookbook.liquid`、`sections/ssko-v10-recipes.liquid`、`snippets/ssko-v09-color-band.liquid`、`snippets/ssko-v09-room-card.liquid`、`snippets/ssko-v09-row-photos.liquid`，以及 `templates/index*.json`（首页、5 个花页、lookbook、配方页）和 `templates/product.json`。

## 验证（2026-11-18，Chromium 模拟）

在 iPhone 13 和桌面 1440 宽度下，逐页滚到底，检查了首页、Austin、礼盒、Lookbook、About、Care、全部花、Journal、商品页和配方页：
- 坏图 0，未加载图 0，横向溢出 0；
- Liquid 错误 0，JS 报错 0；
- 品牌页头页脚除商品页外全部到位，商品页保留 Dawn 页头和购物车；
- 配方页 6 张图仍在。

截图在 `review/`：
- 改前和改后的 390 宽长图：首页、Austin、Lookbook；
- 手机视口拼图；
- 桌面截图。

这些是 Chromium 模拟，不等于真机 iPhone Safari。

## 待 James／Rachel

1. 用真机看一遍，再决定是否发布 v10.2。发布在 Shopify 后台手动操作。
2. 建议把 Shopify 商品标题 “12pcs Artificial Fake Flowers Real-Touch Tulips” 改为 “Real-Touch Tulips, 12 Stems”。这是店铺商品数据，改了立即生效，也会影响 Google 商品信息，所以没有动，需要明确同意。
3. 原有待办不变：
   - 配方图逐张审批（01 偏粉、02 偏橙、06 偏深）；
   - 是否注明 AI 生成；
   - 用已登录的 Amazon 账号测试组合加购。

## 第二轮（2026-11-18）：手机横向锁定、配方入口、图片

### 手机左右拖动出现白边
用户在 iPhone 上看正式站（v10.1）的配方页，能把整页往左推，右边露出空白。v10.2 的处理：
- `html` 和 `body` 都设为 `overflow-x: clip`；不支持 `clip` 的浏览器退回 `hidden`。页面宽度锁在屏幕宽度，左右推不动。
- 页面里的横滑区域是各自独立的滚动容器，不受影响。
- 没有用 `touch-action` 禁止横向手势，以免影响 v09.1 修好的横滑。
- `position: sticky` 不受影响。

测试：在页面里人为加一个 700px 宽的元素后，正式站页面宽度变成 700px，可以横向拖动；v10.2 仍是 390px。这台机器没有 WebKit，所以 iPhone Safari 上请真机确认。

### 花艺配方入口
- 页头菜单加 “Recipes”。手机上它取代 “Journal” 的位置，Journal 仍在页脚。
- 两种页脚都加 “Arrangement recipes”。
- 首页 “Flowers at home” 下加 “Arrangement recipes” 链接，和 “Open the lookbook” 并列。
- 花页的 “Arrangement recipes” 按钮：原来只在 Austin、Tulips、Ranunculus 页、并且选中默认颜色时出现；现在这三页切到任何颜色都显示，Classic Roses 页也加上了。礼盒页没有配方，不显示。

### 图片审查
方法：
- 逐页滚动所有页面（iPhone 13 和桌面 2 倍屏），共 75 张不同的图；
- 按真实像素对比显示需要的像素；
- 统计体积和重复；
- 做缩略总览逐张目视。

坏图 0。单张最大约 405 KB。没有找到需要处理的重复图：同一张图出现在页面不同位置的情况，都是图库加颜色卡片这类正常用法。

已在 v10.2 修改：
- Austin 页 “In every color” 中 White、Purple、Pink、Hot Pink、Red 五张卡片，以及 Tulips 页 10 张颜色卡片，原来都是白底近景。现在统一换成同色的纸面平铺图，和 Baby Pink、Light Peach 卡片一致。
- 首页 Tulips 一行的第二张图原来是白底近景，现在换成白郁金香纸面平铺图。
- Care 页顶部原来是一张偏冷灰的郁金香花瓣极近特写，现在换成暖色的露莲绒叶和花苞近景。这张是现有素材，图片说明（alt）同步修改。
- 加大几处图片请求的宽度，高分辨率屏更清晰。实际宽度不会超过原图：
  - 花页场景图和近景 900 → 1400；
  - 颜色卡片 600 → 900；
  - 首页花种小图 720 → 1080；
  - 房间卡片 900 → 1200。

需要新素材或商品数据，未改：
1. **图库里的 “Flower detail” 仍是白底近景**：
   - Austin 5 色（Baby Pink、Light Peach 已由 Codex 换掉）、Tulips 10 色、Classic 6 色、Ranunculus 7 色，共 28 张。
   - 现有带背景的同色近景（`ssko-v09-colour-*`）只有 600 × 900，放在主图位置会发虚，所以没有替换。
   - 需要每色一张 ≥ 1200 px、带纸面或亚麻背景的近景：实拍，或按商品原图生成后审批。
2. **商品页 /products/tulips 首图带 “REALISTIC TOUCH” 大字**，是 Amazon 信息图，不适合品牌官网。
   - 建议改用纸面平铺图作首图，信息图移到后面或删除。
   - 这是 Shopify 商品媒体，改了立刻在正式店生效，需要你们同意。
3. **首页桌面首图原图只有 1672 px 宽**，在 2 倍屏桌面上略软。如有更高分辨率的原图请替换。
4. **Austin Baby Pink 近景（Codex r02）背景是很浅的粉色**，接近白底，可以再换成纸面背景，也可以接受。
