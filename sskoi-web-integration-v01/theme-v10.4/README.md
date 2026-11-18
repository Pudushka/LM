# SSKOI 网站 v10.4 商品图统一纸面（REVIEW，未发布）

2026-11-18，Claude。v10.3 已由 James 发布为正式主题。这一版从 v10.3 复制出 `sskoi-shopify-v10-4-paper-products REVIEW`（**181500674241**），只换图片，不改代码和文字。

预览：https://sskoi.com/?preview_theme_id=181500674241

## 改动
55 张商品图换成 Gemini 编辑的暖纸面版本（#E2D5CF），花本身不变。文件名不变，所以模板不用改。
- Flower detail（近景）26 张：原来是白墙或窗光墙面。
- Full set（平铺图）29 张：原来是粉棕纸、灰亚麻、灰石面、棕纸四种底面，现在统一成同一种纸。
- 图片文件：`../theme-v10.3/assets-img/gemini-paper-v01/`（WebP，附 manifest.json）。
- 质检：`../brand/QA-Gemini-paper-v01_Claude_20261118.md`。

## 已批准的 Codex 场景图（James 2026-11-18 在对话中批准）
- 8 张标为 APPROVED：H1-a、L1-a、L7-c、L2-b、L4-b、L6-b、WW-b、WM-a。
- Drive 归档（批准版副本，原 REVIEW 文件保留）：https://drive.google.com/drive/folders/1_nFtud2ZH0ARW7AfxUpB5MDBaxqjMKD8
- 批准记录：`../ai-images/approved-v01/approved-codex-v01.json`（原图文件名、SHA-256、网站用 WebP）。

接入 v10.4 的 6 张：

| 位置 | 编号 | 主题文件 |
|---|---|---|
| 首页 Austin 那一行（原来是平铺图） | H1-a | `assets/ssko-v104-rows-austin-room.webp` |
| Lookbook · 窗边（替换 v5-austin-scene） | L1-a | `assets/ssko-v104-look-austin-window.webp` |
| Lookbook · 玄关（替换 v5-tulip-scene） | L2-b | `assets/ssko-v104-look-tulip-entry.webp` |
| Lookbook · 浴室（替换 v6-vanity） | L4-b | `assets/ssko-v104-look-tulip-vanity.webp` |
| Lookbook · 厨房（替换 v6-kitchen） | L6-b | `assets/ssko-v104-look-classic-kitchen.webp` |
| Lookbook · 书架（替换 v6-shelf） | L7-c | `assets/ssko-v104-look-austin-shelf.webp` |

**文字随图片调整**（`templates/index.sskoi-lookbook.json`）：
- 窗边：标签改为 By the window，标题改为 An easy morning，说明配合新场景。
- 浴室：标题从 White against green tile 改为 White by the basin，因为新图没有绿砖。
- 书架：标题从 Pink in a darker room 改为 Pink between the books。
- 各图描述文字按新画面重写，用美式拼写（gray）。

冬季 WW-b、WM-a 只归档，等首页季节模块做好再接。

## 重做补齐
- D18（白色 Ranunculus 近景）、D28（黄色郁金香近景）、S26（粉色郁金香平铺）第一版不合格。
- Gemini 重做的 v02 质检合格，已接入。v10.4 现在 58 张商品图都是纸面版。
- 写入后 MD5 一致；四个花页在手机和桌面重测，没有坏图或报错。

## 没换的
- Austin Baby Pink 近景用的是 v10.1-r02 的新图，不在这一批里。

## 验证（2026-11-18，Chromium 模拟 iPhone 13 和桌面 1440）
- 55 个文件写入 v10.4 后，主题里的 MD5 和本地文件逐个比对，55/55 一致。
  - 第一次上传和主题复制同时进行，部分文件被复制进程覆盖回旧图，所以在复制完成后又全部重传了一次。
- Austin、Classic、Tulips、Ranunculus 四个花页：
  - 没有坏图、横向溢出、Liquid 错误或 JS 报错；
  - 没加载的图都是轮播里还没滑到的懒加载图。
- 截图：`review/v104-austin-mobile.jpg`。
- 场景图：
  - 首页 Austin 行和 Lookbook 的 6 个主题文件、2 个模板，MD5 都和本地一致。
  - 手机和桌面都没有坏图、横向溢出、Liquid 错误或 JS 报错，页面上已经没有旧的 v5、v6 场景。
  - 截图：`review/v104-home-austin-mobile.jpg`、`review/v104-lookbook-thumb.jpg`。

## 待办
1. James 或 Rachel 看预览后批准，再在后台手动发布。
3. Lookbook 阅读角和卧室两张仍是旧图，等 Codex 重做 L3、L5（Light Peach 颜色太桃）。
4. Journal 的 3 篇文章封面已于 2026-11-18 经 James 授权（“现在换”）直接在正式网站替换：

   | 文章 | 新封面 | 原封面 |
   |---|---|---|
   | faux-flower-buying-guide | L7-c | v6-shelf |
   | faux-flower-vase-size-guide | L6-b | v6-kitchen |
   | how-to-style-faux-tulips | L4-b | v6-vanity |

   - 图片描述文字同步更新。
   - 验证：Journal 列表和三篇文章在手机上都显示新封面，没有旧封面，没有坏图，没有横向溢出。
5. 建议（未改）：选购指南正文里还嵌着一张旧的 v5 玄关郁金香图。
   - 它引用的是旧主题 t/21 的文件，那个主题删除后图会失效。
   - 可以换成已批准的 L2-b 玄关图，等 James 决定。
