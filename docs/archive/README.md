# 历史文档归档

本目录保存已经被当前架构、产品契约或发布流程替代的历史规格、原型和操作设计。归档保留决策背景与 Git 历史，但其中的命令、路径、文案、外部链接和架构假设不再指导当前实现。

## 归档内容

| 范围                                                                    | 原因                                            | 当前权威来源                                                                            |
| ----------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`dev/alliance-website-v1/`](./dev/alliance-website-v1/)                | Payload CMS / PostgreSQL 时代的一期规格         | [项目总览](../overview.md)                                                              |
| [`dev/cicd-and-tests/`](./dev/cicd-and-tests/)                          | 旧 CI 与测试治理规格已被总规格替代              | [贡献指南](../../CONTRIBUTING.md)、[CI workflow](../../.github/workflows/ci.yml)        |
| [`dev/cybersecurity-cooperation/`](./dev/cybersecurity-cooperation/)    | 单一共享表单方案已被三个独立 target 替代        | [站点配置](../../src/config/site.ts)、[内容指南](../content-authoring.md)               |
| [`dev/join-flow-optimization/`](./dev/join-flow-optimization/)          | 旧双入口与默认启用契约已被 fail-closed 契约替代 | [站点配置](../../src/config/site.ts)                                                    |
| [`dev/launch-optimization/`](./dev/launch-optimization/)                | 旧发布优化计划已由当前总规格接管                | [当前发布报告](../dev/repository-wide-release-optimization/release-readiness-report.md) |
| [`dev/pages-redesign/`](./dev/pages-redesign/)                          | 旧主题、断点与原型契约已被运行时设计系统替代    | [设计系统](../design/design-system.md)                                                  |
| [`dev/site-core-modules/`](./dev/site-core-modules/)                    | 旧模块、变量和路由假设已被当前架构替代          | [项目总览](../overview.md)                                                              |
| [`design/prototypes/`](./design/prototypes/)                            | 早期静态 UI 原型，仅用于视觉演进追溯            | [设计系统](../design/design-system.md)                                                  |
| [飞书“合作与加入”统一登记设计](./feishu-application-registry-design.md) | 单表方案已被三个独立、默认关闭的 target 替代    | [发布配置交接](../release-configuration-handoff.md)                                     |

## 使用规则

- 不从归档正文复制配置、事实或文案到生产代码；先查表中的当前权威来源。
- 不以归档任务的勾选状态判断当前版本是否可发布。
- 修正文档链接或补充历史注释时保留原意，不把历史方案改写成当前方案。
- 如历史方案重新启用，应新建当前规格并重新完成事实、测试、安全和发布验收，不直接“反归档”。
