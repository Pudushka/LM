# SSKOI 网站整合 v01：Codex 执行说明（REVIEW）

2026-11-17，Claude 出效果图，Codex 实施。目标：把 Media Kit v02 里可靠的特写、颜色和房间场景放进现在的 In Bloom 网站（主题 v08.1），帮客人看清花型、颜色和摆放效果，再去 Amazon。

**状态：REVIEW。** 效果图和素材都没有经过 James 或 Rachel 批准，也没有上线。

## 0. 先读

| 文件 | 内容 |
|---|---|
| `mockups/SSKOI_Web-Mockup_01-Home_*` | 首页：现网（Before-Live）、方案（Proposed）、带编号标注（Annotated），桌面 1440 和手机 390（2 倍图） |
| `mockups/SSKOI_Web-Mockup_02-Flower-Page-Classic-Rose_*` | 花页：以 Classic Roses · Coral 为样板。其他四个花页按第 3 节的数据套用同一结构 |
| `mockups/SSKOI_Web-Mockup_03-Lookbook_*` | Lookbook 换成 In Bloom 的字体和纸色，同一做法用于 About、Care、Journal |
| `web/` | 网站用 WebP 素材包，77 张图，每张两个宽度（如 `-900.webp` 和 `-450.webp`），共 6.3 MB。`web/manifest.json` 记录每张图的来源 |
| `build/mock.js` | 效果图的生成脚本。里面的 HTML 结构和 CSS（`.mk-*` 类名）可以直接作为实现参考，改成主题自己的 `ssko-v09-*` 命名 |
| `build/make-web.py` | 素材包的裁切脚本，可重跑 |

效果图是在无头浏览器里把新区块临时插进现网页面后截图的，**没有改动商店或主题**。

## 1. 工作方式和授权

1. 在 v08.1（181442085057）的**副本**上做，命名 `SSKOI In Bloom v09.0 REVIEW`，不发布。v08.1 保持为线上版和回滚版。
2. 做完给 James 发预览链接和 1440、390 两档截图。只有 James 明确批准这个具体版本后才能发布；发布、提交 Amazon 变更等操作按他对该项操作的授权执行。
3. 完成后在 Drive 交接记录追加：版本、改动、验证结果、预览链接、待确认项和下一位负责人。

## 2. 商品真实性规则（实施和验收都按这里）

1. **花页主图库不动。** 主图库继续用 v072 套装原图和 v073 白底细节图（Codex 已核对）。素材包的图只放进新的特写、颜色、房间和品牌区块。
2. **郁金香：** 网站卖的是 12 枝盒装（B0DQDXM72R）。素材包的郁金香 Listing 图来自 15 枝纸花器款，只能用单朵花特写和单枝图，不能用花束、平铺或花瓶图。花束只用现网 12 枝套装图（`ssko-v072-tulip-*-set.webp`）和侘寂厨房台面场景。
3. **玫瑰礼盒：** 自带折叠纸花器。礼盒的颜色切片、特写和花瓶图都取自现网纸花器套装图；素材包里的陶瓷花瓶搭配图只能作为“搭配示意”，配文写明花器不含在内。
4. **木格栅墙边桌场景（Wood-Slat）不能用在单品页面。** Austin、Tulip、Classic、Ranunculus 四张都是混搭花束：玫瑰和露莲里混了白色郁金香，郁金香那张混了一朵桃色玫瑰。素材包里这些图已标为 NEEDS-FIX。礼盒那张只有 Burgundy 玫瑰和纸花器，可以用。`web/rooms/` 里已去掉这四张。
5. **Austin 的特写和平铺图来自 A+ v18，** 花心黄蕊更明显，花瓣更松散，和 Listing 主图不完全一致。上线前请 James 或 Rachel 对照实物确认；如果不符，三联图改用现网 v073 细节图和 v072 套装图。
6. **尺寸先不显示。** 效果图里 Classic 的 43 cm 枝长来自旧图标注，没有独立测量；9 cm 花径没有可靠来源，只是占位。尺寸格先隐藏，确认后再开。
7. 凡是出现花瓶、家具、房间的图，配文都写清楚这是搭配示意，套装只含花枝（礼盒含纸花器）。
8. 不写价格、评价、销量、库存。颜色名沿用网站现有名称，用美式拼写（color）。
9. 圆点色块用主题已有的色值（花页颜色选择器里的值），不要用效果图里的近似色，也不要用 `web/manifest.json` 里的 `swatches`。那是从照片里取的中位色，不准确，例如 Austin White 会取成黄色。

## 3. 区块说明

编号和标注图上的角标一致。

### 首页

**1 · 更新「Find your flowers」每行（`#flowers .rows li`）**
- 现在每行只有一个小缩略图。改成两张 4:5 照片并排：左边「In a vase」，右边「Up close」。礼盒行的说明改成「Paper vase」和「In a room」。
- 规格文字下面加一排颜色圆点（14px，间距 6px，带 1px 细描边），数量等于该套装颜色数。
- 桌面四列：`1.25fr / .9fr / 320px / 150px`。手机改成一列，顺序是名称、规格、照片、按钮。
- 素材：`web/rows/<set>-room` 和 `web/rows/<set>-close`，其中 set 为 `austin`、`tulip`、`classic`、`ranunculus`、`gift`。

**2 · 新增「Every color」（放在 `#flowers` 之后）**
- 深色底（`--ink`），标题 `Every flower, <em>every color.</em>`，强调字用 `--blush`。
- 说明：`Thirty-seven colors across five sets. Choose a set, then open a color to see it on the flower page.`
- 五个标签：`Austin Roses 7`、`Tulips 10`、`Classic Roses 6`、`Flocked Ranunculus 7`、`Rose Gift Box 7`。默认选 Tulips，展开 Peach。
- 每个颜色是一条竖切片，图片比例 2:3，素材为 `web/colour/<set>-<color-slug>`。
  - 桌面高 540px；展开的那条宽度是其他的 2.6 倍，底部渐变上写大号颜色名和 `Open <Color> <Set> →`。
  - 鼠标悬停或键盘聚焦时展开。点击打开对应花页并预选颜色：`/?view=<view>#color=<Color>`，需要第 4 节的花页改动。
- 手机：高 380px，横向滚动。收起的切片宽 54px，只显示编号；展开的宽 176px，显示颜色名。点收起的切片先展开，再点一次才跳转。
- 底栏：`<Set> · <n> colors · close-up photos`，右侧 `Shop <Set> →`。
- 五组切片都由 Liquid 输出，非当前组加 `hidden`。标签用 `role="tablist"`，支持左右方向键切换。

**3 · 更新「Flowers at home」轮播（`#ssko-v07-rooms`）**
- 卡片改成房间封面：4:5 照片、底部渐变、两行标题（第二行斜体，用 `--blush`）、细线、下方一行等宽小字 `<Set> · <Color> · <n> stems` 和 `Shop →`。
- 卡片宽度：桌面 420px，手机 78vw。保留现有的左右箭头。
- 五个房间，都用侘寂场景：

| 卡片 | 标题 | 小字 | 链接 |
|---|---|---|---|
| `web/rooms/austin-baby-pink-wabi-dinner-table` | The dinner / table. | Austin Roses · Baby Pink · 6 stems | `/?view=sskoi-austin#color=Baby Pink` |
| `web/rooms/tulip-white-wabi-kitchen-ledge` | The kitchen / ledge. | Tulips · White · 12 stems | `/?view=sskoi-tulip#color=White` |
| `web/rooms/classic-coral-wabi-reading-table` | The reading / table. | Classic Roses · Coral · 6 stems | `/?view=sskoi-classic#color=Coral` |
| `web/rooms/ranunculus-light-peach-wabi-mantel` | On the / mantel. | Flocked Ranunculus · Light Peach · 4 stems | `/?view=sskoi-peony#color=Light Peach` |
| `web/rooms/gift-burgundy-wabi-entry-console` | The entry / console. | Rose Gift Box · Burgundy · 8 stems, paper vase | `/?view=sskoi-rose-gift#color=Burgundy` |

**4 · 新增「Look closer」（放在 `#rooms` 之后）**
- 标题 `Look <em>closer.</em>`，说明 `Petals, buds and leaves up close, so you know what arrives before you choose a set.`
- 桌面四列 4:5 特写；手机横向滚动，每张 74vw。每张下面是标题、一句说明，再一行等宽小字（规格和颜色 · `Explore →`）。

| 图 | 标题 | 说明 | 小字 |
|---|---|---|---|
| `web/closer/classic-coral-bud` | Classic Roses | One open rose and two buds on every stem. | 6 stems · Coral |
| `web/closer/ranunculus-light-peach-bud` | Flocked Ranunculus | Two flowers and a bud on every stem, with soft flocked leaves. | 4 stems · Light Peach |
| `web/closer/tulip-peach-petal` | Tulips | Real-touch petals with fine ribs from base to tip. | 12 stems · Peach |
| `web/closer/austin-light-peach-petal` | Austin Roses | Loosely cupped, layered petals with a garden-rose shape. | 6 stems · Light Peach |

### 花页（五个 `?view=` 页面通用，加在 `.ssko-v07-product` 之后）

**10 · 修复：花页没有网站页头和页脚。** 现在五个花页只有面包屑，客人只能点面包屑离开。花页要用首页同一套页头（纸色底、墨色字、底部细线、吸顶）和首页的深色页脚 `footer.end`。页头里的锚点链接改成 `/#flowers`、`/#rooms`、`/#gift`。

**5 · Set at a glance（规格一览）**
- 底色 `--paper-2`。依次是小标题 `<Set> · Shown in <Color>`、超大两行标题（第二行斜体，用 `--coral`）、四格数据，最后一行注释。
- 右侧放一张去底的花束图作装饰；手机上放到数据下方并居中。

**6 · Up close（三联特写）**：标题 `<Color>, <em>up close.</em>`。三张 4:5 图，桌面三列；手机横向滚动，每张 72vw。

**7 · In every color（本套所有颜色）**
- 每个颜色一张 2:3 切片（`web/colour/<set>-<slug>`），当前颜色更宽，加描边，标签后缀 ` · Selected`。手机上非当前颜色隐藏文字。
- 点击切片：选中页面上方对应的颜色（`[data-ssko-v07-choices] input`，并触发 change），把 URL 的 hash 改成 `#color=<Color>`，再平滑滚动到图库；用户开启减少动态效果时直接跳。主图、Amazon 链接和这一栏的选中状态要保持同步。
- **需要改 `ssko-v07-product.js`：** 页面加载和 `hashchange` 时读取 `#color=`，不区分大小写匹配 `input.value` 并选中；匹配不到时保持默认颜色。

**8 · At home（房间里的样子）**：标题 `<Scene color> <em>at home.</em>`，右侧链接 `Open the lookbook →`。桌面两张 4:5 并排，手机上下排列。说明写清楚搭配示意。

**9 · More flowers（其他花）**：另外四套花的卡片，用 `web/rows/<set>-room`，下面是名称、规格和颜色圆点。桌面四列，手机横向滚动，每张 62vw。

#### 五个花页的数据

| 花页 | 第 5 区标题 | 数据格 | 去底图 | 第 6 区三联（图 · 说明） | 第 8 区两图（标题 · 说明） |
|---|---|---|---|---|---|
| Austin `sskoi-austin` | `Six stems. <em>Six full blooms.</em>` | Stems 6；On each stem 1, One full bloom | `cutout/austin-baby-pink`（Shown in Baby Pink） | `closer/austin-baby-pink-petal` Petals · `-stem` One stem · `-flatlay` Laid flat（见第 2 节第 5 条） | `rooms/austin-baby-pink-wabi-dinner-table` **The dinner table** · Keep the vase low enough to talk across the table. ／ `closer/austin-baby-pink-room` **Beside the reading chair** · A small vase on a side table, close to eye level. |
| Tulips `sskoi-tulip` | `Twelve stems. <em>Twelve tulips.</em>` | Stems 12；On each stem 1, One tulip；Box, Standard box | 不用（Listing 主图是 15 枝）。不放图，数据格占满宽度 | `closer/tulip-white-petal` Petals · `-stem` One stem · `-set` Full set（现网 12 枝图） | 只放一张：`rooms/tulip-white-wabi-kitchen-ledge` **The kitchen ledge** · Twelve stems stand upright in a clear glass vase by the window.（用单图版式：照片 4:5 在左，文字在右） |
| Classic `sskoi-classic` | `Six stems. <em>Twelve buds.</em>` | Stems 6；On each stem 1 + 2, One open rose, two buds | `cutout/classic-coral`（Shown in Coral） | `closer/classic-coral-petal` Petals · `-bud` Bloom and buds · `-still` Laid flat | `rooms/classic-coral-wabi-reading-table` **The reading table** · Keep the jug low and let a few buds lean out toward the chair. ／ `closer/classic-coral-vase` **In a round vase** · A wide stoneware vase holds all six stems, with the buds left loose at the edge. |
| Ranunculus `sskoi-peony` | `Four stems. <em>Eight flowers.</em>` | Stems 4；On each stem 2 + 1, Two flowers, one bud | `cutout/ranunculus-orange`（小标题写 Shown in Orange） | `closer/ranunculus-light-peach-petal` Petals · `-bud` Flowers and bud · `-still` Laid flat | `rooms/ranunculus-light-peach-wabi-mantel` **On the mantel** · A cream jug beside a candle; the buds lean toward the light. ／ `closer/ranunculus-light-peach-vase` **In a round vase** · Four stems fill a low vase, with flocked leaves around the rim. |
| Gift `sskoi-rose-gift` | `Eight stems. <em>One paper vase.</em>` | Stems 8；Vase, Folding paper display vase, included | 不用（避免和三联图重复）。不放图，数据格占满宽度 | `closer/gift-coral-petal` Petals · `-paper-vase` The paper vase · `-styled` Styled in a jug（配文：Jug shown for styling; the set comes with the paper vase.） | `rooms/gift-burgundy-wabi-entry-console` **The entry console** · The paper vase from the box, on a walnut sideboard. ／ `rooms/gift-burgundy-slat-side-table` **Beside the armchair** · The same paper vase on a small side table. |

所有花页的注释行：`Vases and furniture are shown for styling; the set includes the stems only.` 礼盒页改成 `Furniture is shown for styling; the set includes eight stems and the paper vase.` 尺寸格（Stem length、Bloom）确认前不显示。

### 其他页面

**Lookbook、About、Care、Journal 统一成 In Bloom 风格。** 这几页现在还是旧版：Newsreader、DM Sans、#f8f6f1 底色，用的是 Dawn 页头和 v2 页脚。
- 在 `ssko-v3-brand.css` 里把变量改成 In Bloom 的值（`ssko-v07-editorial.css` 的 `:root`）：

  ```css
  --ssko-v3-paper:#ede4e1; --ssko-v3-ink:#1d1418; --ssko-v3-panel:#e2d5d1;
  --ssko-v3-line:rgba(29,20,24,.18); --ssko-v3-olive:#12261c;
  --ssko-v3-serif:"Bodoni Moda",Georgia,serif; --ssko-v3-sans:"Hanken Grotesk",Arial,sans-serif;
  ```

  `ssko-v4-editorial.css` 里 `.ssko-v4-look`、`.ssko-v4-split` 的底色改为 `#e2d5d1`，`.ssko-v4-look-image` 改为 `#d9cac5`。
- 这几页也要加载主题里的 `ssko-bodoni-moda(.woff2/-italic)`、`ssko-hanken-grotesk`、`ssko-dm-mono` 字体，并预加载标题字体。
- 页头、页脚换成首页和花页同一套（第 10 节）。导航文字用 DM Mono，大写，11px。
- 效果图里 H1 和 H2 最后一个词改成斜体（`The <em>Lookbook.</em>`）。这是可选的风格统一，实现时在模板里加 `<em>`，不要用 JS 改。

## 4. 素材上线方法

- 把 `web/` 里的文件上传到主题 assets，文件名改成 `ssko-v09-<group>-<name>-<w>.webp`，例如 `ssko-v09-colour-tulip-peach-600.webp`。不要再做二次压缩。
- 每张图都写 `srcset`（两个宽度）、`sizes`、`width`、`height`，以及 CSS `aspect-ratio`，避免布局跳动。
- 首屏以下的图一律 `loading="lazy"` 和 `decoding="async"`。
- 颜色切片的 `sizes`：桌面 `(min-width:750px) 18vw`，手机 `176px`。
- 首页新增图片的总下载量控制在 1.5 MB 以内（以 1440 宽首次滚动到底计）。
- Alt 文字写实际内容，例如 `Coral classic roses in a stone jug on a reading table`。装饰性的去底图用 `alt=""` 加 `aria-hidden`。
- 需要更大尺寸或别的比例时，回到 Media Kit v02 原文件（Drive `SSKOI_Media-Kit_v02_REVIEW_20261117`，`manifest.csv` 有每个文件的路径和来源），用 `build/make-web.py` 重新裁切。

## 5. 无障碍和动效

- 标签和切片支持键盘操作，焦点样式清楚可见。
- 深色区的小字不低于 4.5:1 对比度：`rgba(237,228,225,.72)` 放在 `#1d1418` 上是够的。
- 切片宽度过渡 0.4 秒。用户开启 `prefers-reduced-motion` 时取消过渡和平滑滚动。
- 不加自动播放视频。Media Kit 的 `Loop_16x9` 视频作为下一步的可选项，需 James 确认后再加。

## 6. 验收

1. **宽度** 320、390、768、1440 四档：没有横向滚动条（横向滚动轨道内部除外），没有文字溢出或被遮挡。
2. **链接** 37 个颜色切片逐个点：打开正确的花页，预选正确的颜色，Amazon 链接和主图跟着变。五个花页都测 `#color=` 的直接访问和 `hashchange`。
3. **区块** 五个花页都有页头和页脚，第 5 到第 9 区都在；郁金香页没有 15 枝的图；礼盒页的花器都是纸花器，或者注明了搭配示意。
4. **图片** 页面上没有用到木格栅墙边桌的 Austin、Tulip、Classic、Ranunculus 四张图。
5. **字体** Lookbook、About、Care、Journal 都用 Bodoni Moda、Hanken Grotesk、DM Mono 和 #ede4e1 底色。
6. **技术检查** Shopify Theme Check 0 个错误。Lighthouse 手机版性能不低于 v08.1 现值，CLS < 0.1。
7. **对照效果图** 把 Proposed 图和预览截图并排对比，在交接记录里写出差异。

## 7. 上线前要 James 或 Rachel 确认

1. Austin 的 A+ 图花型和实物是否一致（第 2 节第 5 条）。
2. 郁金香 12 枝盒装和 15 枝纸花器款的花头是否相同。如果不同，郁金香特写也要换成现网 v073 细节图。
3. Classic 的枝长和花径、Ranunculus 的枝长（旧图标注是 52 cm）要实物测量。
4. 是否保留「Every color」默认展开 Tulips · Peach。
5. 是否要首页加背景视频。
