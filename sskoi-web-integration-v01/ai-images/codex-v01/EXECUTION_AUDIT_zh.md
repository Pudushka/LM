# Codex v01 本轮执行矩阵与冲突处理

来源：Pudushka/LM 的 `claude/pensive-planck-o61hll`，head `94ce80d22474be84c37b1eed87eb2941d463e089`。Prompt blob `f710e4de58c290592230645c9f48f4c705c03882`；手册 blob `4fa615615370d24857d6474ff4fbb4bd6355e2d4`。执行提示文件优先于手册；最新用户指令优先于两者。

| 顺序 | 槽位与内容 | 比例／下限 | 候选数 |
|---|---|---|---:|
| 1 | H1 Austin Baby Pink：起居室胡桃木边柜，不用餐桌 | 4:5；1440×1800 | 3 |
| 2 | L1 Austin窗边；L2 White Tulips玄关；L3 Light Peach Ranunculus阅读；L4 White Tulips浴室；L5 Ranunculus卧室；L6 Classic Coral厨房；L7 Austin书架 | 均3:2、至少2000宽；主体居中，未来4:5裁切也成立 | 21 |
| 3 | HW桌面、HM手机：Austin Baby Pink亚麻首屏，当前首屏只作指定构图参考 | HW16:9至少2400宽；HM4:5、1440×1800 | 6 |
| 4 | WW桌面、WM手机：Classic Burgundy冬日章节，无蜡烛或节日装饰 | WW16:9至少2400宽；WM4:5、1440×1800 | 6 |

共12槽、36张，按上表顺序，每槽a/b/c三个独立候选。L3、L4、L6、L7同时复用于对应Journal封面，不另多生成封面。其他花页、Gemini28张细节和30张平铺均不属于本轮。

`generation-plan.json` 已给出36条完整提示、参考图链接及本地路径／哈希。A、C、D直接抽取原文，B只替换产品数据；A+B+C+D顺序固定，附加约束单独列出。Ranunculus没有已知花径，B末句明确 `flower head diameter is not specified in reference`，不造9cm。

一套上限：Austin6枝6花；Tulips12枝12花；Ranunculus4枝8花4苞；Classic6枝6花12苞。允许少于一套，整张图及倒影、背景不能多于一套，不添其他花种。Classic与Austin不混用。标称枝长44／35／52／43cm按各原图为准，下段正常入瓶，不能把全枝长再叠在花器上。

Burgundy在Prompt只列set/detail；已核实同色stem补充图HTTP200且原字节保留，明确标为补充来源。两张风格图只控制光线、色板、材质；不能从它们复制产品几何或构图。HW/HM按Prompt特例允许用现首屏构图，旧文件不修改、不复用作新交付。

所有新图保持 **REVIEW**。明显问题写 `requiresRevision`／`knownIssues`，保留问题文件；本轮最新指令覆盖旧手册的NEEDS-FIX状态规则，不标APPROVED。无手部、无人、无拆包、无弯枝演示、无包装或图中文字。不上主题、不发布。

工具用可用的最大原生输出；最小尺寸不满足照常交原文件，报告实际尺寸及差额。不放大、裁切、锐化、改色或重采样；首屏的“更清楚”只指原生生成细节。`fingerprint_native.cjs` 只读尺寸、格式、哈希，可显式写JSON收据，不转换图片；它不能仅靠文件元数据证明生成时使用了最大原生设置。

示例：`node fingerprint_native.cjs --input <原生输出文件> --slot H1 --candidate a --model <实际工具报告名称> --out H1/a-fingerprint.json`。必须填写真实模型／工具信息，不猜底层模型名称。建议候选和原因由生成后的实际目视审查补充，下一位负责人Claude质检。

## 实际执行偏差：以捕获请求为准，冻结计划不回写

HW/HM冻结计划原列三张商品原图、两张风格图、两张hero，共7张附件。实际内置imagegen调用返回最多5张参考的限制，超限尝试被拒绝且没有图像输出。随后实际只附三张同色商品图＋两张hero（5张）；两张风格图已读过但未作为该调用附件，A风格文字保持原样，C的hero构图要求优先。实际请求另行追加此限制说明，真实5张附件的URL／路径／哈希均在捕获请求和delivery中记录。不能把冻结计划的7张记成实际都已附上，也不为被拒绝请求冒记一张候选。

冬季WW/WM六张额外澄清用4枝、4个开放花头、最多8苞，属于原Classic每套6枝上限之内的较少子集；原规则本就允许少于一套。L3-b/c额外说明书页空白以遵守无文字，L6-c以4个开放花头子集呈现。这些实际附加文字如实保留，`actualPromptMatchesFrozenPlan=false`不是篡改或失败标志；汇总核验实际prompt与捕获请求的字节／哈希，不要求它与冻结计划相同。全部仍为REVIEW。

Git交付记录不预填尚未产生的本提交SHA。实际提交SHA在push后由root在最终回报／交接记录附上；把提交SHA写入该提交内的delivery会产生自引用。暂存白名单JSON对自身的sha256明确为null，其余项逐个SHA-256；JSON自身复制时另以当时实际字节核验，不伪造自校验哈希。
