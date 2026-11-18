# 原生输出登记

计划已冻结：`generation-plan.frozen.json` SHA-256 `37bb982c1b032fc1508305849a160f7e37e01fc2f254cf9dafad42df97d68733`。每次调用前捕获实际请求，不事后从计划推断。H1-a的prompt自初版起未改变；后补的来源元数据不覆盖实际请求。

支持实际请求包装：`{job:{slotId,candidate,fullPrompt,referencePaths或referenceLocalPaths,referenceUrls},modelName,tool,sourcePath,status,noPostProcessing}`。完整包装原字节会另存到`_actual_jobs`。模型字段原样登记；底层模型未公开时写未公开，不猜名称。

逐个执行，避免并发修改同一份delivery：

```
node ingest_native.cjs --input "<actual-request.sourcePath>" --slot H1 --candidate b --actual-job-json "H1/H1-b.actual-request.json"
```

脚本只把原始工具输出按实际尺寸命名后逐字节复制。已有同名同哈希则不重复复制；同候选遇到不同图片、prompt或捕获请求哈希会停止，不覆盖历史。写根`delivery.json`与对应槽位`delivery.json`，保留真实参考链接／本地哈希、实际prompt、原始源路径、实际尺寸与图片哈希。

默认全部REVIEW。原生输出小于下限会如实记录并保持原文件，不重新生成、放大或锐化来伪造达标。视觉QA留待独立复核：`requiresRevision`、`recommendedWithinSlot`初始为null，`visualQAStatus=PENDING`。硬缺陷后续记`requiresRevision=true`和`knownIssues`，status仍REVIEW。推荐每槽哪一张及原因须根据真实三张图判断。

脚本不访问Drive、GitHub、Shopify，不集成、不发布。它通过输入与副本哈希相同验证本次复制没有改图；不能仅从尺寸或哈希证明生成工具内部设置，实际最大原生设置由调用记录提供证据。
