# SSKOI 网站 v10.5：“放进你的花瓶看看”（REVIEW，未发布）

2026-11-19，Claude。从 v10.4 复制出 `sskoi-shopify-v10-5-try-in-your-vase REVIEW`（**181511225537**），所以 v10.4 的全部改动这里都有。v10.4 原样保留，单独等批准。

- 预览：https://sskoi.com/?view=sskoi-try&preview_theme_id=181511225537
- 入口：
  - 每个花页的 “Arrangement recipes” 旁边新增 “See it in your vase”，点击时会带上当前选中的颜色；
  - Lookbook 页底也有一个链接。

## 用法
1. 拍一张自家空花瓶的正面照片，或者用页面自带的示例花瓶。
2. 把 Rim 线拖到瓶口，把 Base 线拖到瓶底，再输入花瓶高度（英寸或厘米）。
3. 选花种和颜色：4 个花种共 30 个颜色，颜色旁显示寓意词。
4. 花束按真实比例插进瓶里：
   - 瓶口以下的花枝会被瓶身挡住；
   - 勾选“玻璃花瓶”可以看到花枝；
   - 页面会显示花露出瓶口多少，例如“About 9.5 in (24 cm) above the rim”。
5. 可以左右拖动花束、倾斜、翻转。“Save image” 会生成一张带 “SSKOI · size preview” 字样的图片，可以保存或分享。
6. 底部链接到对应花页和颜色，购买按钮在花页上。

## 隐私和诚实
- 照片只在访客自己的浏览器里处理，不上传，页面上写明了 “Your photo stays on this device”。
- 页面写明：比例是按整枝长度估算的；每套只有花枝，花瓶是访客自己的。
- 花束素材来自已经统一成纸面的平铺图：
  - Claude 在本地只去掉背景，按花束主轴自动立直，花本身的像素不变。
  - 文件：`assets-img/ssko-v105-cut-*.webp`（30 个，带透明通道）。
  - 总览图：`cutouts-contact-sheet.jpg`。
- 比例依据枝长：Austin 44 cm，Classic 43 cm，Tulips 35 cm，Ranunculus 52 cm（视觉手册的名义值）。

## 其他改动
- `layout/ssko-v07.liquid`：新页面使用品牌页头页脚。
- `snippets/ssko-v08-index-meta.liquid`：
  - 新页面的标题、描述和分享图；
  - 去掉 Care 和 Shop 描述里已下架的纸花瓶、礼盒字样；
  - Gifts 和 Lookbook 的分享图换成已批准的 L1-a。

## 验证（2026-11-19，Chromium 模拟 iPhone 13 和桌面 1440）
- 30 个颜色全部能载入。
- 示例花瓶和上传照片都能用：拖动 Rim、Base 线正常，读数计算正确（7 英寸花瓶、Austin 显示露出 10.5 英寸）。
- 网址会记住所选颜色，例如 `#classic/coral`。
- 没有横向溢出，没有 JS 报错。桌面上的 shop.app 框架报错是 Shopify 预览栏自带的，和本功能无关。
- 修过的问题：
  - 隐藏的照片层挡住了点击；
  - 手机上被键盘聚焦的控件会落到固定的预览区下面。
- 截图：`review/v105-try-mobile.jpg`。

## 已知限制
- 花束是整套原样捆扎的样子。插进花瓶后实际会更散开一些，所以这个功能主要用来看高度和颜色。
- 紫色和橙色洋牡丹的花束略斜，可以用 Tilt 调正。

## 待办
1. James 或 Rachel 试用后决定是否发布。v10.5 已经包含 v10.4，可以直接发布 v10.5。
2. 如果要更逼真，可以请 Gemini 给每种花出一张“插在瓶里、正面”的去背景图，替换平铺图素材。
