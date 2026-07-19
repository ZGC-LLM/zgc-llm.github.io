# 历史规格状态

`docs/dev/` 保存各轮规范驱动开发的需求、设计、任务、上下文和评审记录。它们说明当时为什么做出某项决定，不自动成为当前架构或待办清单。

当前工程入口为 [项目总览](../overview.md)，当前发布治理入口为 [`repository-wide-release-optimization`](./repository-wide-release-optimization/repository-wide-release-optimization-tasks.md)。历史正文保持原样，生命周期只在本页集中裁决。

## 状态定义

| 状态     | 含义                                                   |
| -------- | ------------------------------------------------------ |
| 进行中   | 本轮仍有依赖任务或验收未完成                           |
| 已完成   | 原规格的核心目标有实现证据，后续修订不否定该目标       |
| 部分完成 | 已有实现，但仍保留明确的仓库内或外部余项               |
| 被替代   | 后续规格改变了契约或接管了剩余工作；旧正文不再指导实现 |
| 仅供追溯 | 曾参与实现，但主要架构假设已失效，只保留决策历史       |

状态描述的是规格生命周期，不代表当前产品已通过发布验收。发布结论必须由当前总规格的 T-012 根据当次证据给出。

## Feature 目录

| Feature                                                                                                                        | 状态               | 原始结果与当前裁决                                                                                                      | 证据或后继                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`alliance-website-v1`](../archive/dev/alliance-website-v1/alliance-website-v1-context.md)                                     | 已归档，仅供追溯   | 一期网站曾实现；早期 Payload CMS 与 PostgreSQL 假设已被纯静态架构替代。                                                 | 实现提交 `840a596`；当前架构见 [overview](../overview.md)                                                                                                                                                                                                                                                                                                                                                                  |
| [`cicd-and-tests`](../archive/dev/cicd-and-tests/cicd-and-tests-requirements.md)                                               | 已归档，被替代     | 原规格完成了部分并行、缓存和 coverage 报告；硬覆盖率、双构建与多浏览器由本轮重新治理。                                  | 原提交 `9282170`；后继为当前 T-007、T-009、T-010                                                                                                                                                                                                                                                                                                                                                                           |
| [`cybersecurity-content-dedup`](./cybersecurity-content-dedup/cybersecurity-content-dedup-requirements.md)                     | 已完成             | 工作组与网络安全专题的职责去重目标成立；当前角色与事实边界由本轮内容治理修订。                                          | 原提交 `449e6d7`；当前 T-005                                                                                                                                                                                                                                                                                                                                                                                               |
| [`cybersecurity-cooperation`](../archive/dev/cybersecurity-cooperation/cybersecurity-cooperation-requirements.md)              | 已归档，被替代     | 单一共享申请表方案先被双入口替代，随后又被三个独立、默认关闭的 target 契约替代。                                        | 原提交 `41c04d9`；后继为 join-flow 与当前 T-003/T-005/T-006                                                                                                                                                                                                                                                                                                                                                                |
| [`join-flow-optimization`](../archive/dev/join-flow-optimization/join-flow-optimization-requirements.md)                       | 已归档，被替代     | 旧双 URL 和默认启用行为不再有效；当前三个 target 独立 fail closed。                                                     | 原提交 `0bfc6c3`；当前申请契约见 [`src/config/site.ts`](../../src/config/site.ts)                                                                                                                                                                                                                                                                                                                                          |
| [`lark-application-forms`](./lark-application-forms/lark-application-forms-design.md)                                          | 部分完成，外部阻塞 | 仓库保留表单与多维表格设计；Feishu UI 的匿名提交、隐私告知、字段和回执仍需逐表核验。                                    | 原提交 `41fd78b`；当前 T-012 外部验收                                                                                                                                                                                                                                                                                                                                                                                      |
| [`launch-optimization`](../archive/dev/launch-optimization/launch-optimization-report.md)                                      | 已归档，被替代     | 部分 SEO、i18n 与上线优化已经实现，剩余事实、测试和发布门由本轮总规格接管。                                             | 规划提交 `49fba1e`、实现提交 `867ec55`；后继为当前总规格                                                                                                                                                                                                                                                                                                                                                                   |
| [`launch-readiness-ghpages`](./launch-readiness-ghpages/launch-readiness-ghpages-requirements.md)                              | 部分完成，外部阻塞 | 静态导出、workflow 与 CNAME 已实现并在本轮加固；正式 DNS、TLS、Pages cname 和六个备用入口的 301 尚未形成证据。          | 原提交 `c3668db`；当前 T-007 与 T-012                                                                                                                                                                                                                                                                                                                                                                                      |
| [`member-partner-distinction`](./member-partner-distinction/member-partner-distinction-requirements.md)                        | 已完成，后续修订   | 联盟成员和工作组伙伴保持独立名录；本轮重新建立成员公开来源，并将未核验工作组伙伴保持为空。                              | 原提交 `8967db7`；当前 T-005/T-006                                                                                                                                                                                                                                                                                                                                                                                         |
| [`pages-redesign`](../archive/dev/pages-redesign/pages-redesign-requirements.md)                                               | 已归档，被替代     | v2 视觉基础仍在使用；手动主题 toggle、语言占位和旧断点等约定已被当前 system-only 与双语实现替代。                       | 原设计提交 `0777d33`；当前 T-002/T-004/T-005/T-006                                                                                                                                                                                                                                                                                                                                                                         |
| [`repository-wide-release-optimization`](./repository-wide-release-optimization/repository-wide-release-optimization-tasks.md) | 部分完成，外部阻塞 | T-012 已执行；本地候选自动质量门通过，原七类门中的 reviewer 门已按 owner 决策接受，其余六类仍未闭合，发布裁决为 NO-GO。 | [release report](./repository-wide-release-optimization/release-readiness-report.md)、[baseline after](./repository-wide-release-optimization/baseline-after.md)、[requirements](./repository-wide-release-optimization/repository-wide-release-optimization-requirements.md)、[audit](./repository-wide-release-optimization/audit-register.md)、[facts](./repository-wide-release-optimization/content-fact-register.md) |
| [`site-core-modules`](../archive/dev/site-core-modules/site-core-modules-requirements.md)                                      | 已归档，仅供追溯   | 核心板块曾实现；旧 institution/professional 变量、路由和空成员假设已被后续规格改写。                                    | 规划提交 `062a9fc`/`c58fc55`；当前架构见 [overview](../overview.md)                                                                                                                                                                                                                                                                                                                                                        |

## 当前外部阻塞

以下状态不能由修改历史任务勾选框解决：

- `www.zgc-llm.org.cn` 的 DNS、TLS 与 GitHub Pages custom domain 尚未建立；
- GitHub Pages 实际 github.io 端点仍服务旧提交，并公开候选已移除的占位/未授权内容与未核申请入口；
- apex、两个品牌保护域和三个无连字符防御域尚无完整 HTTPS 301 证据；
- 三个 Feishu target 尚未证明无登录匿名提交、信息处理告知与回执可用；
- main 的强制批准数已按 owner 的短期策略设为 0；PR、三个 strict checks、对话解决和管理员保护仍强制生效；
- 适用备案与已验证公开联系渠道仍待外部确认；正式 Logo 和官方英文全称已从候选源码/export 中性化，
  只有恢复使用时才重新成为授权阻塞。

这些事项应由当前 T-012 如实记录为通过、失败或阻塞。HTTP GET、仓库配置、测试 fixture 和历史设计都不能替代外部验收。

## 维护规则

- 新增 feature 目录时，在同一 PR 中把它加入本表。
- 只有不再承担当前任务、已明确标为被替代或仅供追溯的正文才能迁入 `docs/archive/`；索引仍保留原 feature 状态和替代链。
- 后续规格替代旧契约时，更新本表的状态、原因和后继链接，不删除旧正文。
- 不根据 tasks 文档中未勾选的 checkbox 自动推断当前功能缺失。
- 历史文档与当前代码冲突时，以 [项目总览](../overview.md) 列出的代码事实来源和当前总规格为准。
- 当前总规格完成后，只能依据 T-012 发布报告更新状态；没有证据的外部事项继续保留阻塞说明。
