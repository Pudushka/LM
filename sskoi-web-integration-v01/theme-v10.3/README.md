# SSKOI 网站 v10.3 品牌系统（REVIEW，未发布）

2026-11-18，Claude。v10.2 已由 James 发布为正式主题。这一版从 v10.2 复制出 `sskoi-shopify-v10-3-brand-system REVIEW`（**181497135297**），改动只在这个未发布主题里。

预览：https://sskoi.com/?preview_theme_id=181497135297

依据：`../research/top-tier-brand-notes-20261118.md`（顶级品牌对照）和 `../brand/SSKOI-visual-handbook-v01.md`（视觉手册与 AI 出图流程）。

## 改动
1. **字体**：
   - 全站小标签原来用 DM Mono 等宽字体，有打字机般的“技术感”，现在统一换成 Hanken Grotesk 小号大写（字重 500，字距 0.14em）。
   - 涉及的地方：页面标签、规格、配方编号、花器说明、页脚，以及花页里写死 DM Mono 的规格和标签（`--product-mono`），还有 Dawn 页头菜单。
2. **按钮只保留两种**：
   - 主操作用实心胶囊按钮（View on Amazon、Shop on Amazon）；
   - 次要操作一律用带下划线的文字链接，所以花页的 “Arrangement recipes” 从描边按钮改成了文字链接；
   - Care、About、Lookbook 页原来是全大写的 “EXPLORE THE LOOKBOOK ↗”，改成和全站一致的句首大写文字链接。
3. **克制的滚动动效**：
   - 首屏以下的区块进入视口时淡入，上移 14px，0.9 秒；
   - 系统开启“减少动态效果”时完全不动；
   - 没有 JS 时内容照常显示；4 秒后无论如何全部显示。
   - 文件：`assets/ssko-v103-reveal.js`，由 `snippets/ssko-assurance.liquid` 和站点页脚加载，并防止重复执行。
4. **404 页**：品牌化的 “This page has moved.”，下面链接到花、配方、礼物和首页。文件：`sections/ssko-v103-404.liquid`、`templates/404.json`。
5. **单枝尺寸图**：4 张原来是冷灰底，改为暖纸底（#E2D5CF）。只改了和画面边缘连通的灰色背景像素，花、茎、叶、尺寸线都没动；白郁金香的花瓣放大核对过，没有变色。新文件覆盖了原来的 `ssko-v072-*-stem.webp`，所以模板不用改。

## 试过但没用的
- **28 张白底 Flower detail 的确定性换底**：这些原图的背景是带窗光条纹和偏色的墙面，不是纯色背景，换完花边会出现锯齿白边，所以不用。
- 改为 Gemini 只编辑背景，出图单见 `../brand/BRIEF-01_flower-detail-paper-Gemini.md`。

6. **404 和搜索页**：改用品牌页头页脚（`layout/theme.liquid` 的品牌页面列表里加入 404 和 search）。商品页和购物车仍保留 Dawn 页头和购物车。

## 验证（2026-11-18，Chromium 模拟 iPhone 13 和桌面 1440）
检查了首页、Austin、Lookbook、About、Care、全部花、Journal、商品页、配方、礼物、搜索和 404：
- 横向溢出、Liquid 错误、JS 报错和坏图都是 0。
- 小标签字体为 Hanken Grotesk 500，花页规格也已换掉 DM Mono。
- “Arrangement recipes” 显示为带下划线的文字链接，点击区域高 48px。
- 动效：首页有 8 个区块参与淡入，滚动后全部显示（不透明度 1）。
- 尺寸图显示为纸面版。
- 404 页显示品牌页头和 4 个链接。

截图：`review/v103-mobile.jpg`。

## 待办
1. Gemini 出图单 01（28 张 Flower detail 换纸面）完成后，由 Claude 质检并接入。
2. 首页 Austin 那一行现在是“平铺图加近景”，其他花是“房间图加近景”。需要 Codex 按 v09 rooms 风格补一张 Austin 房间图；不复用首页下方已有的餐桌图。
3. Lookbook 和 Journal 封面里 v5、v6 早期场景、首页桌面首图高分辨率版、每季首页章节图：按视觉手册第 7 节排期。
4. James/Rachel 审阅后，在后台手动发布 v10.3。
