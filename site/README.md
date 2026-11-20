# Lensho Capital website (完整版)

这是 lensho.com 的完整静态网站：六个页面，中英双语，不依赖任何框架。

- **上线说明（给 Codex 或工程师）：** [`CODEX_HANDOFF.md`](CODEX_HANDOFF.md)
- **可直接部署的文件包：** `lensho-site.zip`，内容与 `dist-lensho/` 相同
- **本地预览：** 运行下面两条命令，然后打开 http://localhost:8766

```bash
cd site && python3 build.py
```

```bash
cd dist && python3 -m http.server 8766
```

## 页面

| 页面 | 内容 |
|---|---|
| 首页 `/` | 三幕电影式首屏、OZ 2.0 专区、投资理念（連勝）、关注方向、项目五阶段、改造案例（可放大）、投资工具、合作方式、洞察、联系表单 |
| OZ 2.0 `/opportunity-zones` | 倒计时首屏、滚动时间轴、收益示意计算器、180 天窗口测算、4 题资格自测、实质改善规划工具、哈德逊县示意地图、关键日期、1.0 与 2.0 对比、术语表（可筛选）、常见问题 |
| 指南 `/oz-guide` | 约 12 分钟的长文：基本概念、180 天时钟、三重优惠示例表、六项变化、实质性改善、风险、向发起人提问清单、Lensho 的做法；带目录高亮和阅读进度条 |
| 合作流程 `/how-we-work` | 三类合作方的切换卡片，以及会记住勾选状态的准备清单；六阶段分工表、合作承诺、合作平台入口、常见问题 |
| 披露 `/disclosures` | 重要披露、隐私、使用条款 |
| 404 | 自定义的找不到页面 |

`/platform`（合作平台）和 `/calculators/refinance`（再融资计算器）沿用现有系统，新网站只是链接过去。

## 目录结构

```
site/
  src/               页面源文件（含 <!--@header--> 等占位标记）
  src/partials/      共用的 head、header、footer
  assets/css|js|images|fonts
  public/            robots.txt、sitemap.xml、site.webmanifest、_headers
  build.py           生成 dist/（预览用，相对链接）和 dist-lensho/（上线用，无后缀链接）
  CODEX_HANDOFF.md   部署说明与验收清单
```

## 上线前需要你确认的内容

详见 `CODEX_HANDOFF.md` 第 6 节，摘要如下：

- **OZ 基金表述：** 目前写的是「正在梳理地块，欢迎联系」，没有声称已有基金在发行。基金成立后再更新，并请律师审阅。
- **服务承诺：** 「两个工作日内回复」等承诺，以及各阶段的时间估计。
- **税务内容：** 需要税务顾问核实。
- **示意地图：** 新机会区名单公布后换成真实地块。
