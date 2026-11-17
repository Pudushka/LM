# SSKOI 主题 v09.0（REVIEW，未发布）

Shopify 主题 `sskoi-shopify-v09-0-media-kit REVIEW`（181465219265），从线上 v08.1（181442085057）复制。未发布，v08.1 仍是线上版本和回滚版本。

预览：https://sskoi.com/?preview_theme_id=181465219265

这里是新增文件的副本，主题里的才是正式版本。另外改动的现有文件：

- `sections/sskoi-v07-home.liquid`：每行花两张图和颜色圆点，新增 Every color 和 Look closer，房间卡改为封面卡，schema 增加对应设置
- `layout/ssko-v07.liquid`：加载 ssko-v09.css 和 ssko-v09.js，五个花页加页头和页脚
- `layout/theme.liquid`：所有 Dawn 页面加载 In Bloom 字体和 ssko-v09-pages.css
- `assets/ssko-v3-brand.css`、`assets/ssko-v4-editorial.css`：旧版配色和字体变量改为 In Bloom
- `templates/index.json`、五个 `templates/index.sskoi-*.json`：新区块的图片和文案

图片：43 张在 Shopify Files，文件名 `ssko-v09-*.webp`，在主题编辑器里可以替换。Austin 和郁金香暂时只用网站原有的商品图（ssko-v072、ssko-v073），待确认花型后再换素材包的图。

验证（2026-11-17）：首页、五个花页、Lookbook、Care、About、Journal 在 320、390、768、1440 宽度下没有 Liquid 错误、没有坏图、没有横向滚动；`#color=` 直达颜色、颜色条切换主图和 Amazon 链接、首页 37 个颜色链接、标签的点击和方向键都正常。
