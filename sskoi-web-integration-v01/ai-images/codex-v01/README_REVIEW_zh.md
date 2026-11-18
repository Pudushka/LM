# SSKOI Codex v01：36张网站场景候选 · REVIEW

四批按原顺序完成，共12槽×3候选。36张PNG均保留原生工具输出字节，Drive已逐个回读核对哈希。全部仍为REVIEW，没有James/Rachel批准，不接入主题、不发布。下一负责人：Claude质检。

原生尺寸：1122×1402（9张）; 1536×1024（21张）; 1672×941（6张）。其中36张低于提示文件的最小尺寸；按授权原样交付，不放大、锐化、裁切或重采样，也不因原生尺寸下限重跑。

实际工具名为各条delivery中的modelName；底层图像模型未向工具公开，不虚构型号。每条实际prompt、参考图与哈希、捕获请求、原生尺寸和Drive文件链接均在根及分槽delivery.json。冻结计划不用于事后替换实际请求。

| 槽位 | 建议候选 | 原因 | 需修订 |
|---|---|---|---|
| H1 | a | Airy varied angles, complete book stack and calm living-room context; no hard visible artifact requiring a rerun. | 否 |
| L1 | a | Best restrained alternative: no fruit, varied bloom angles, calm window context and generous wall. A small future focal adjustment can protect the leftmost bloom in portrait crop. | 否 |
| L2 | b | Ten clearly separable heads stay below the12 ceiling, airy arrangement, no extra linen prop, coherent dry cylinder and safe portrait crop. | 否 |
| L3 | c | Blank book pages, readable5 flowers3 buds, correct flocked leaves and strongest centered portrait crop fit. | 否 |
| L4 | b | Ten distinct cups, balanced gentle curves and safest centered portrait fit; dry ribbed vessel and towel meet the brief. | 否 |
| L5 | c | Airier asymmetry and clear individual flowers, smaller restrained crock and strong safe portrait composition. | 否 |
| L6 | c | Four independently countable heads, seven buds, no unrequested bowl, full product safe in center portrait crop. | 否 |
| L7 | a | Most relaxed varied flower angles, calm shelf/books setting and least portrait flower trimming. | 否 |
| HW | a | Closest restrained continuation of wide hero: all six heads and stem tips fit, ample left negative space, soft consistent linen and petal detail. | 否 |
| HM | a | Softest consistent rose/linen treatment, six clearly separated heads and generous lower linen area; restrained continuation of current mobile hero. | 否 |
| WW | b | Four clearly separated Classic heads, varied angles, slightly cooler wine color closer to neutral product reference and useful left negative space. | 否 |
| WM | b | Airy four-head arrangement with clearly separated original-style paired buds, complete vase and useful breathing room; consistent with preferred WW-b tone. | 否 |

建议仅用于选片，不代表批准。硬缺陷候选：L3-a、L6-a、HW-b。各图仍可能有遮挡导致的枝数不可实测、名义厘米不能从像素认证、精确色差未做标准色卡校准等限制；逐图knownIssues为准。

## 范围与优先级

- 最新用户要求覆盖旧手册的NEEDS-FIX状态：所有文件REVIEW；硬问题只写requiresRevision／knownIssues，保留原件。
- Prompt-Codex-v01的四批次优先于手册宽泛待办。跳过手部插花、拆包、弯枝演示、Gemini商品编辑等；L3/L4/L6/L7复用为Journal封面，不另生成。
- A+B+C+D保留原顺序；约束附在后面。Ranunculus花径未标明，不造数字；L4按指定石灰石浴室台面，L6枝条下段真实入瓶。
- 当前hero只作Prompt明确许可的构图／亚麻色参考；其他风格参考只控制光线、色板、材质，不控制商品几何。
- Austin指定creative-detail比set/stem更展开、黄蕊更大；真实set/stem优先。允许原照小簇自然米黄蕊，不绝对禁黄。
- 来源Drive手册与GitHub手册第7节Gemini/Claude分工有差别，当前Codex四批出图规则一致；两个版本及身份记录均保留。

## 来源格式与Git交付

部分源URL及保留文件名以.webp结尾，HTTP内容／解码元数据实际为JPEG。它们按下载原字节保留，不改扩展名冒充转换，也不转码；actualFormat在reference-provenance.json。36张新候选实际为PNG。

Git仅推送自己的分支 `codex/sskoi-web-scenes-v01-20261118`，不创建PR、不合并。使用_finalization/staging-allowlist.txt中的逐文件白名单；禁止git add -A或整目录递归暂存。白名单不包含缩略图、诊断裁切、旧资产、原始上传响应、临时下载地址或账号凭据。

## 实际执行与冻结计划差异

HW/HM最初7张参考被内置工具5参考上限拒绝，没有输出。实际请求改用三张商品＋两张hero；两张风格图已读但未附，A原样保留。冬季六张补充4枝4头≤8芽，L3-b/c补充空白书页，L6-c为4头子集。实际prompt／附件／SHA以捕获请求为准，允许actualPromptMatchesFrozenPlan=false，冻结计划不回写。

Git采用单一资产提交A。delivery内本提交SHA保持null；root在push后的外部Git回执／交接记录给出真实A，不用第二个提交回填自引用。白名单JSON对自身的sha256为null，其余项目逐个哈希；复制JSON自身时核对当时实际字节。
