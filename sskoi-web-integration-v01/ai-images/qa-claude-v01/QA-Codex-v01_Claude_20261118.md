# Codex v01 场景图质检（2026-11-18，Claude）

- 对象：Codex 分支 `codex/sskoi-web-scenes-v01-20261118`，commit 9785e2d。36 张 PNG，12 个位置，每个位置 3 张候选。
- 依据：`../../brand/PROMPT-Codex-v01.md`、`../../brand/SSKOI-visual-handbook-v01.md`。
- 状态：全部仍为 REVIEW。James 或 Rachel 批准前不接入、不发布。

## 结论
1. **可以送批：8 张**
   - H1-a、L1-a、L7-c、L2-b、L4-b、L6-b、WW-b、WM-a。
   - 对比图：`SSKOI_Codex-v01_Claude-picks-8_for-approval_20261118_REVIEW.jpg`。
2. **需要重做：L3、L5 共 6 张，全部 NEEDS-FIX**
   - Ranunculus Light Peach 画得太“桃色”，和商品偏差 13 到 15，标准是 6 以内。
   - 商品实际是奶油白，中心只带一点桃色。
3. **首屏 HW、HM 不建议替换**
   - 原生尺寸 1672×941 和 1122×1402，和现在线上的首屏一模一样，没有变清晰。
   - 构图也基本是重画一遍。
   - 继续用现在已经上线的首屏，这个位置等能出 2400 宽以上的工具再做。
4. **和 Codex 推荐不同的三处**

   | 位置 | Codex 推荐 | 我的推荐 | 原因 |
   |---|---|---|---|
   | L7 | a | c | a 的颜色偏差 7.8，c 是 3.0 |
   | L6 | c | b | c 的颜色偏差 8.3，b 是 5.1；b 多了一碗桃子，道具仍是两件，符合规则 |
   | WM | b | a | b 的颜色偏差 7.0，a 是 4.3 |

## 检查方法
1. 逐张和该颜色的商品图（Full set、Flower detail）并排看：花型、色边、叶子、花苞、枝数、花器结构、水、文字、多余的花。
2. 颜色：
   - 取花瓣主色（Lab 空间中位数），和商品 Full set 同类像素比较。
   - 场景是暖色窗光，商品图是中性光，所以这个数字是近似值，只用来发现明显偏色。
   - 超过 6 判为偏色。
3. 枝数：Austin 一套 6 枝，推荐的三张都是 6 朵，不多于一套。
4. 尺寸：全部低于说明里的最小尺寸，Codex 已如实写明，没有放大。Lookbook 的 1536×1024 和现在线上的图一样大，不会变差。

## 逐个位置

| 位置 | a | b | c | 推荐 | 说明 |
|---|---|---|---|---|---|
| H1 首页 Austin | 3.5 | 4.4 | 4.5 | a | 6 朵，构图透气 |
| L1 窗边 Austin | 1.4 | 6.2 | 5.0 | a | 颜色最准；c 有一碗鸡蛋，不需要 |
| L7 书架 Austin | 7.8 | 5.8 | 3.0 | c | 6 朵；兼作 Journal 封面（选购指南） |
| L2 玄关白郁金香 | — | — | — | b | 白色不测色差；玻璃瓶里没有水；Codex 数的是 10 个花头，网站上写一套 12 枝 |
| L4 浴室白郁金香 | — | — | — | b | 同上；兼作 Journal 封面（郁金香插法） |
| L3 阅读角 Ranunculus | 14.5 | 13.5 | 13.8 | 重做 | 太桃色；Journal 封面（小空间）跟着等 |
| L5 卧室 Ranunculus | 13.9 | 13.1 | 14.0 | 重做 | 同上 |
| L6 厨房 Coral | 7.6 | 5.1 | 8.3 | b | 兼作 Journal 封面（花瓶尺寸） |
| HW 首屏桌面 | 6.3 | 5.7 | 9.2 | 不替换 | 分辨率没有提升 |
| HM 首屏手机 | 4.1 | 3.7 | 6.4 | 不替换 | 同上 |
| WW 冬季桌面 | 11.0 | 5.6 | 5.8 | b | 整体比商品略偏红，商品更偏莓紫，可以接受 |
| WM 冬季手机 | 4.3 | 7.0 | 5.7 | a | 和 WW-b 色调一致 |

## 观察（不影响这次送批）
1. **构图太像**：
   - 36 张几乎都是“正面平视、居中一只圆瓶、花呈半球形、左侧百叶窗条纹光”。
   - Lookbook 7 张放在一起会显得重复，H1、L1、L7 三张 Austin 尤其接近。
   - 下一轮要加入不同机位：俯拍、近景裁切、更宽的房间全景。
2. **光线比手册暖**：
   - 墙面实测约 #9B8671，手册写的是 #D9CFC6，整体更像傍晚金光。
   - 和现在网站上的 v09 房间图风格一致，所以这轮不改。
   - 下一季统一调成更浅、更柔和的光。
3. **Austin 的花心**：大多露出黄色花蕊。商品 Full set 里多数花是闭合的杯状，只有 Flower detail 是盛开的，可以接受。

## 给 Codex 的返工说明（L3、L5）
沿用原来的 A、B、D 和构图 C，在 C 后面加：
> Petal color must match the Light Peach reference exactly: mostly ivory cream petals with only a faint, pale peach blush at the very center. Much paler and less saturated than typical peach roses or ranunculus. If in doubt, make it paler.

每个位置出 3 张，交付方式同上一轮。

## 下一步
1. James 或 Rachel 看对比图，批准或换选。
2. 批准后由 Claude 接入未发布主题，再给预览链接：
   - 首页 Austin 那一行用 H1；
   - Lookbook 换掉 v5、v6 场景；
   - 3 篇 Journal 换封面。
3. 冬季图等首页季节模块做好后再接。
4. Codex 重做 L3、L5，Claude 再质检。
