# 文档索引

本目录收录中关村自主大模型产业联盟官网的当前工程说明、维护指南、部署手册和历史规格。第一次接触仓库时，从根目录 [README](../README.md) 开始；本页负责把问题路由到唯一的专题文档。

## 当前文档

| 主题                | 权威入口                                                               | 适用内容                                              |
| ------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| 项目定位与快速开始  | [README.md](../README.md)                                              | 稳定边界、核心命令、环境变量与文档入口                |
| 协作与质量门        | [CONTRIBUTING.md](../CONTRIBUTING.md)                                  | 开发环境、测试分层、提交和 PR 规则                    |
| 当前架构            | [overview.md](./overview.md)                                           | 技术栈、目录、路由、内容流和部署形态                  |
| 内容与事实治理      | [content-authoring.md](./content-authoring.md)                         | 成员、新闻、工作组、双语和事实来源                    |
| UI 规范             | [design/design-system.md](./design/design-system.md)                   | token、主题策略、断点、组件状态和无障碍               |
| GitHub Pages 与域名 | [deploy-pages-dns.md](./deploy-pages-dns.md)                           | CI 依赖部署、DNS、TLS、CNAME 与保护域 301             |
| 发布配置交接        | [release-configuration-handoff.md](./release-configuration-handoff.md) | 交给域名、Pages、邮箱、备案和飞书表单负责人的逐项清单 |
| Docker 自托管       | [deploy-docker.md](./deploy-docker.md)                                 | standalone 镜像、构建期变量、反向代理和健康检查       |
| 历史规格状态        | [dev/README.md](./dev/README.md)                                       | SDD feature 的完成、部分、替代、归档和追溯状态        |
| 历史文档归档        | [archive/README.md](./archive/README.md)                               | 不再指导当前实现的旧规格、原型与操作设计              |

## 代码事实来源

文档解释代码，但不覆盖代码契约。出现漂移时按下表复核并同步文档：

| 事实                                   | 代码来源                                                                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 包管理器、脚本、运行时范围             | [`package.json`](../package.json)                                                                                                        |
| 公开环境变量样例                       | [`.env.example`](../.env.example)                                                                                                        |
| canonical、导航、公开路由和申请 target | [`src/config/site.ts`](../src/config/site.ts)                                                                                            |
| 类型化内容和事实来源                   | [`src/content/`](../src/content)、[`src/types/content.ts`](../src/types/content.ts)                                                      |
| 内容发布校验                           | [`src/lib/content-validation.ts`](../src/lib/content-validation.ts)                                                                      |
| 视觉实现                               | [`src/app/(frontend)/styles.css`](<../src/app/(frontend)/styles.css>)                                                                    |
| unit/integration 覆盖率                | [`vitest.unit.config.mts`](../vitest.unit.config.mts)                                                                                    |
| E2E 项目矩阵                           | [`playwright.config.ts`](../playwright.config.ts)                                                                                        |
| CI 与 Pages 部署                       | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)、[`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml) |
| 容器构建                               | [`Dockerfile`](../Dockerfile)、[`docker-compose.prod.yml`](../docker-compose.prod.yml)                                                   |

正式域名、外部 Feishu 表单、备案、评审人员和公开联系渠道属于仓库外状态。仓库配置或 HTTP GET 成功不能代替匿名提交、TLS、301、权限和运营验收。

## 关于 `dev/` 与 `archive/`

[`dev/`](./dev/README.md) 保存仍承担当前任务或验收职责的规范驱动开发记录；[`archive/`](./archive/README.md) 保存已被替代、仅供追溯的历史正文。归档材料用于理解当时决策，不应改写成当前实现说明。

生命周期状态集中登记在 `docs/dev/README.md`。其中“已完成”表示原规格目标曾有实现证据，“被替代”表示当前实现由后续规格裁决，“部分完成”保留明确余项，“仅供追溯”不再指导当前开发。过期且不再承担当前任务的正文迁入 [`archive/`](./archive/README.md)，保留 Git 历史和决策背景，但不参与当前维护。任何历史状态都不等于当前版本已经通过发布验收。

本轮总规格位于 [`dev/repository-wide-release-optimization/`](./dev/repository-wide-release-optimization/)。最终发布结论只由该规格的 T-012 验收产物给出，其他 README 或历史任务不得提前声明“可发布”。
