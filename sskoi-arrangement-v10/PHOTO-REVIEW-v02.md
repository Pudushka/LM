# v11-photo-v02 配方图复核（Claude，2026-11-18，REVIEW）

复核对象：Codex 第二轮 12 张原生 PNG（Drive `02_Photos`，交付 JSON `SSKOI_Recipe-v11_Photos_Delivery_v02_20261117_REVIEW.json`）。12 张全部下载，SHA-256 和字节数与交付 JSON 一致；Hero 1122 × 1402，Wide 1672 × 941，未放大。v01 已作废，页面上不再引用。

方法：每张 Hero 与网站商品原图并排比对（`ssko-v073-<花>-<颜色>-detail.webp` 和 `ssko-v072-<花>-<颜色>-set.webp`，露莲文件名是 peony），看花型、颜色、色边、叶子、花芯、比例和花器是否可信。按 Codex 和 James 的要求，允许自然遮挡，不逐朵点数；图片证明不了每套的枝数和“每枝两朵加一苞”，购买判断以商品原图为准。Wide 与对应 Hero 是同一场景的延展，逐张看过，没有新的问题，继承 Hero 的结论。

## 结论

六张 Hero 都可以作为 **REVIEW 搭配示意** 接入未发布草稿，已接入 v10.0（181470527681），每张都带 “Styling image · under review” 标记。这不是批准：James 或 Rachel 明确批准前不能发布。下表“偏差”是我看到的与实物不一致之处，请 James/Rachel 判断是否需要再修。

| No. | 处理 | 与原图一致的地方 | 偏差（待 James/Rachel 判断） |
|---|---|---|---|
| 01 Blush and Peach | 接入草稿 | Light Peach 露莲：奶油底、桃色中心、大而松散，和原图很接近；花头大小与玫瑰相当；花束低、宽口奶白陶罐 | Austin Baby Pink 比原图粉、饱和度高（原图是很浅的腮红偏桃色）；两朵开得较开，金黄花蕊比原图明显（原图只露少量浅黄）；露莲叶子偏深绿，银色植绒感弱 |
| 02 Coral Hour | 接入草稿 | Orange 露莲：橙色外瓣、黄色中心、褶边松散，和原图一致；Classic 玫瑰带尖花苞；银绿植绒叶和玫瑰叶都在 | Coral 玫瑰比原图偏橙、偏饱和（原图是浅三文鱼粉） |
| 03 White Garden | 接入草稿 | 郁金香闭合、低在瓶口；Austin White 象牙白带浅黄花芯；宽口陶缸；整体最接近原图 | 部分露莲偏纯白、偏规整的同心圆（原图是象牙白、中心带浅黄绿，花瓣更松） |
| 04 Pink and Green | 接入草稿 | 郁金香绿底粉尖、低在瓶口；Austin Pink 与原图一致（含少量黄花芯）；Pink 露莲奶油心、粉色边、松散 | 个别郁金香和花瓣边缘略显规整、偏“画出来” |
| 05 Soft White | 接入草稿 | Classic 白色粉边玫瑰和粉尖花苞与原图一致；Baby Pink 露莲奶油底带淡腮红 | 个别露莲偏桃色、偏紧的玫瑰状（原图更浅、更松） |
| 06 Late Plum | 接入草稿 | 郁金香低在瓶口、明显低于玫瑰；玫瑰和尖花苞、锯齿叶可信；花器不透明，看不到水 | Burgundy 玫瑰比原图更深、偏蓝紫（原图是带洋红的酒红）；Dark Purple 郁金香比原图更深、更饱和（原图偏洋红紫，带明显纹路） |

共同情况：
- 六张的花器都是宽口陶器（罐或缸），尺寸是 AI 出图的结果，不是实测。
- 比例按 Codex 的出图提示：整体约为花器高度的 2 倍，郁金香约露出 13 cm，低于玫瑰。没有再出现长杆郁金香。
- 没有人物、文字、Logo，没有配方外的花材。

## 已改的页面（未发布主题 v10.0）

- 6 张 Hero 转成 WebP（1122 × 1402，quality 86，115–214 KB），上传到 Shopify Files：`ssko-v11v02-recipe-NN-<名称>.webp`。每张都是 READY，1122 × 1402。图上带审阅标记。
- 花器按图改为宽口陶器：01 Cream glazed pot、02 Textured stoneware jar、03 Wide stoneware crock、04 Sage glazed stoneware jar、05 Speckled stoneware pot、06 Brown glazed stoneware jar。页面写 “Suggested: about N cm tall, wide mouth · not included”（N = 20/20/22/22/18/22），不再写口径。新增 “Wide-mouth jar” 线稿。
- 撤回 v12 的 16 cm 花器和 “郁金香露出约 19 cm”；03/04/06 的摆法写 “约 22 cm 花器里郁金香露出约 13 cm”。
- 露莲角色从 Height 改为 Secondary，02/05 的说明按图改成露莲插在玫瑰之间；05 去掉台灯罩那一步。
- 脚注改为：“The arrangement images are styling illustrations. Stems overlap, so not every stem or bud is visible; each flower page shows exactly what comes in a set. Vases and furniture are not included, and vase sizes are suggestions.”
- alt 统一以 “Styling image:” 开头。

## 复测（2026-11-18，预览 https://sskoi.com/?view=sskoi-arrangement&preview_theme_id=181470527681）

| 设备 | 结果 |
|---|---|
| iPhone 13 | 6 张图都在 DOM 里，`complete`，HTTP 200，下载 1122 宽原图；无横向滚动；无 Liquid 错误；6 个按钮都 ≥ 44 px，加购链接 ASIN 数 2/2/3/3/2/2；“How to arrange” 能展开；目录锚点跳转正常 |
| iPhone SE | 同上（srcset 561w/1122w，2 倍屏取 1122） |
| Pixel 7 | 同上 |
| 桌面 1440 | 同上，图显示 733 × 916 |

旧 v01 图在页面上的引用数为 0；6 个花器线稿都渲染；审阅标记 6/6。

## 余项

1. **James/Rachel 审批**：逐张决定 01–06 是否可用。重点是上表的颜色偏差（01 Austin 偏粉且花蕊偏开，02 Coral 偏橙，06 两种花都偏深）。批准前不能发布。
2. **页面是否注明 AI 生成**：现在脚注写 “styling illustrations”，没有写 AI。是否要写，请 James/Rachel 决定。
3. **花器尺寸待实测**：如果以后用实物拍摄或推荐具体花器，再把 “Suggested” 改为实测值。枝长（郁金香 35、Classic 43、Austin 44、露莲 52 cm）也是名义值，待按尺寸表或实物确认。
4. **Wide 16:9 暂未上页面**：当前版式只用 4:5。如需横版（例如首页入口或社媒），另行接入。
5. **Amazon 组合加购**：仍需用已登录的 Amazon 账号点一次确认几件都进购物车；未登录会先要求登录。
6. **发布**：主题发布需在 Shopify 后台手动操作（v09.1 和 v10.0 都未发布）；不用的主题副本 181465022657 可在后台删除。
7. **交接记录**：当前连接器不能编辑 Google Docs，交接记录请由有权限的人追加（内容见本文件和 README）。
