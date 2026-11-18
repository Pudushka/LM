# 36张齐备后的本地汇总

此脚本现仅准备，未执行apply或任何Git操作。root是唯一Git写入者；停止所有ingest写入、36张候选及12份独立QA全部齐备后，再由root调用。

预览：

```
python finalize_delivery.py
```

仅显式应用时才合并本地记录：

```
python finalize_delivery.py --apply
```

默认Drive收据目录为workspace下`output/codex-web-scenes-v01-20261118/drive-receipts`。预览不写delivery或最终说明。应用检查所有36个候选键、PNG原字节／尺寸、实际prompt哈希、捕获请求字节、参考图哈希、独立QA对应图哈希、Drive当前ID／名称／大小／父级／两位Rachel的commenter权限，以及Drive逐文件下载回读哈希。缺少任一项即停止。

应用范围为根及12槽delivery.json，另生成`README_REVIEW_zh.md`和`_finalization/staging-allowlist.json`／`.txt`。图片、实际请求、冻结计划不改。旧delivery先保存在不暂存的_finalization/backups下。所有状态仍REVIEW，缺陷写requiresRevision／knownIssues，推荐选片不等于批准。实际工具下层模型未暴露，不能猜模型名。

Git白名单按实际文件逐项列出，不执行git add。包括36张原生PNG、13份delivery、12份独立槽QA、原始及不可变实际请求、冻结计划、来源手册／提示文件、19个已回读原始参考及其provenance、必要的说明和本任务脚本。排除诊断裁切、接触表、缩略图、旧任务、原始上传响应、临时下载URL、凭据和不相关登记文件。部分参考以.webp命名但实际JPEG，按原下载字节保留，metadata中明确format；不转码。

root将这些白名单项复制到自己的仓库分支`codex/sskoi-web-scenes-v01-20261118`，检查实际暂存diff后提交并push；本任务不要求PR，不合并、不接入网站、不发布。不要用`git add -A`或整个大目录递归暂存。

## 实际请求差异与工具限制

HW/HM的冻结7附件调用实际被imagegen的5参考图上限拒绝，没有输出；真实调用选三张商品＋两张hero，风格图已读但未附，A原样保留。冬季六张补充4枝4头≤8芽，L3-b/c补充空白书页，L6-c补充4头子集。所有真实提示／附件／哈希另存捕获请求；冻结计划不改。finalizer只要求delivery中的实际prompt与捕获请求及SHA一致，明确允许`actualPromptMatchesFrozenPlan=false`，也不要求实际附件必须等于计划的7张。

finalizer在apply前还会重新检查QA、Drive receipts、reference-provenance快照未被并发更改，并核验rawToolOutput哈希、原字节复制声明与空imageProcessingOperations。Git来源路径限制在本task内部及两份明确brand文件；诊断／备份／缩略图和类似密钥文件不能借记录进入白名单。

## root使用的隔离复制／暂存支持

`prepare_git_staging.py --checkout <隔离checkout绝对路径>`默认只预览，不运行Git，也不复制。root先确认自己的分支与源码head，再显式`--copy`逐文件复制；`--stage`才使用参数数组调用Git，不经过shell拼接。可以合用`--copy --stage`，但本agent不会运行这些模式。

暂存使用NUL分隔的相对文件名和`--literal-pathspecs`，避开空格、引号、通配符及Windows命令行长度问题。脚本拒绝源workspace或task目录充当checkout、拒绝路径越界和非白名单已有暂存文件；不会unstage、commit、push、创建PR或publish。Git操作全部由root最后执行。

delivery不预填本提交自身的SHA；push后root在外部交接／最终回报给出真实commit。白名单manifest的自哈希为null，复制时按实际文件字节核对；其他项目均以清单SHA-256核验。不得为了补自引用哈希循环重写交付文件。
