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

## 第三轮（2026-11-18）：颜色寓意词、按场合选礼物、信任行、邮件订阅

借鉴 Moon Magic 的前三条（笔记见 `../research/moonmagic-notes-20261118.md`）。

### 1. 颜色寓意词（Claude 定稿）
同一颜色在所有花种里用同一个词，统一由 `snippets/ssko-color-meaning.liquid` 管理，改一处全站生效。

| 颜色 | 词 | 颜色 | 词 |
|---|---|---|---|
| White | Calm | Coral | Warmth |
| Baby Pink | Tenderness | Peach / Light Peach | Comfort |
| Pink | Gratitude | Orange | Energy |
| Hot Pink | Delight | Yellow | Cheer |
| Red | Love | White With Pink Tip | Romance |
| Burgundy | Devotion | Green With Pink Tip | Renewal |
| Purple | Wonder | White With Blue Tip | Serenity |
| Dark Purple | Mystery | Mauve / Mauve Pink | Grace |

显示位置：
- 花页的颜色标签，例如 “Color Baby Pink · Tenderness”，切换颜色时跟着变；
- 花页 “In every color” 的颜色卡片；
- 首页 “Every color” 色卡；
- 首页礼盒区的颜色名，切换颜色时跟着变。

### 2. 按场合选礼物（新页面）
`/?view=sskoi-gifts`，模板 `templates/index.sskoi-gifts.json`，区块 `sections/ssko-v102-gifts.liquid`，用品牌页头页脚。

页面有 6 个场合：Mother's Day、Anniversary and Valentine's Day、Housewarming、Thank you、Sympathy、Just because。每个场合配：
- 一张现有房间图（没有用待审的 AI 配方图）；
- 一句话；
- 3 个推荐，即套装和颜色（带寓意词）或配方，直接链接到对应花页的那个颜色或配方。

页脚说明：只有礼盒自带纸花器，其他套装只含花枝，图中的花器和房间都是道具。

入口：
- 页头 “Gift box” 改为 “Gifts”；
- 两种页脚都加 “Gifts by occasion”；
- 首页礼盒区加 “Gifts by occasion” 链接。

页面标题和描述已加入 `ssko-v08-index-meta`。顺手把配方页描述里的 “Eight” 改成 “Six”。

### 3. 信任行：暂不显示亚马逊评分
2026-11-18 亚马逊各套的评分和评价数：

| 套装（示例颜色 ASIN） | 评分 | 评价数 |
|---|---|---|
| Austin Roses（B0DTFNXBHF） | 4.8 | 4 |
| Tulips（B0DQDXM72R） | 5.0 | 2 |
| Classic Roses（B0DSWT9NMF） | 5.0 | 4 |
| Flocked Ranunculus（B0DTYG3SY1） | 5.0 | 3 |
| Rose Gift Set（B0FKJ68G3Z） | 4.2 | 28 |
| Austin Roses with Eucalyptus（B0FLLPR1W9） | 4.5 | 29 |

结论：
- 不显示评分。2–4 条评价的 5.0 说服力不足，礼盒的 4.2 反而减分。
- 改为一行产品事实：“Lifelike petals and leaves · Display dry, no water · Order securely on Amazon”。
  - 因为露莲是植绒丝面，不是 real-touch，所以写 lifelike，不写 real-touch；
  - 也不写 Prime 或 “能用很多年”这类没法核实的话。
- 位置：首页首屏下方、每个花页购买按钮下方、礼物页导语下方。
- 建议等某一套达到 4.5 星以上、50 条以上评价时，再在那一套上显示评分。

### 4. 邮件订阅
- 两种页脚都加了一行订阅：“Seasonal styling notes, a few times a year”。
- 用的是 Shopify 自带的客户表单：订阅者保存为同意接收营销邮件的 Shopify 客户，带标签 `newsletter`。在后台按这个标签就能导出名单。
- 测试时没有真的提交，以免在正式店铺里生成测试客户。

### 买家照片墙：未做
店铺没有填写 Instagram 等社媒账号。建议先开账号或决定收集方式，例如随包裹附卡片、邀请客户发邮件，再做照片墙。

### 验证
在 iPhone 13 和桌面 1440 宽度下检查了 11 个页面，加上新的礼物页：
- 没有横向溢出、Liquid 错误、JS 报错或坏图；
- 切换颜色时寓意词同步变化；
- 用礼物页链接打开礼盒页，会直接选中对应颜色（如 Mauve Pink · Grace）；
- 订阅表单存在，带 `newsletter` 标签；
- 手机上信任行改为竖排，避免换行后分隔点错位。

截图在 `review/after-r3-mobile.jpg`。

## 第四轮（2026-11-18）：撤下礼盒系列

James 和 Rachel 讨论后决定：礼盒系列用户反馈一般，先从网站撤下。网站图片专注在花上；包装里可能还会用纸花瓶，但不再作为主打卖点，避免客户拿到纸花瓶后觉得不如预期。

v10.2 的改动：
- **首页**：
  - 删除 Find your flowers 里的礼盒一行；
  - 删除 Every color 里的礼盒色卡（30 色，原来 37 色）；
  - 删除 “The entry console”（纸花瓶）房间卡片；
  - 删除深绿色的 “The box becomes the vase” 礼盒区。
- **花页**：Austin、Tulips、Classic、Ranunculus 四页的 More flowers 都删掉了礼盒卡片。
- **全部花页面**：删除礼盒卡片和 “Gift sets” 筛选按钮。
- **Lookbook**：删除 “On the sideboard”（Coral Rose Gift Set）一节，8 个房间变成 7 个。导语、页面标题和描述同步改成 Seven。
- **礼盒页**：删除 `?view=sskoi-rose-gift` 模板，旧链接会回到首页。主题 v10.1 里仍保留原文件，需要时可以恢复。
- **礼物页（Gifts）**：
  - Mother's Day 的礼盒 Mauve Pink 换成 Flocked Ranunculus Baby Pink；
  - Anniversary 的两款礼盒换成 Austin Roses Red 和 Classic Roses Burgundy，配图从纸花瓶场景换成红色 Austin 平铺图；
  - Sympathy 的礼盒 White 换成 Classic Roses White；
  - 页脚改为 “Every set is stems only. The vases and rooms in these photos are styling props.”
- **问答**（Care 页和首页隐藏的问答）：花瓶问题统一回答 “No. Each set is stems only. The vases in our photos are styling props.”；浇水问题删掉了纸盒那句。

没改、需要决定的店铺内容（不在主题里，一改马上在正式店生效）：
1. Journal 文章 “A guide to gifting faux roses with a vase”（handle `faux-rose-gift-box-guide`）现在仍然发布着，建议取消发布。“How to choose faux flowers for your home” 里可能也提到了礼盒，需要检查文字。
2. Dawn 页脚菜单里的 “Rose gift sets” 链接（只在商品页、购物车、搜索页显示），建议在后台的导航菜单里删除。
3. 亚马逊上的礼盒 listing 是否下架，不在网站范围内。

验证：在 iPhone 13 宽度下逐页滚到底，检查了首页、四个花页、全部花页、Lookbook、礼物页、Care 和配方页：
- 页面文字里没有 “gift box / gift set / paper vase / Rose Gift”；
- 没有礼盒图片，也没有指向礼盒页的链接；
- 旧网址 `?view=sskoi-rose-gift` 会打开首页；
- 横向溢出、Liquid 错误和坏图都是 0。

截图在 `review/after-r4-no-giftbox-mobile.jpg`。
