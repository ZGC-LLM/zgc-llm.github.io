---
feature: alliance-website-v1
preset: overnight
planning: batch
execution: auto
complexity: standard
status: completed
updated_at: 2026-07-16
---

# SDD 上下文: alliance-website-v1

> **更新补记（2026-07-16）**：本文件为 alliance-website-v1 开发期的历史设计记录。项目已在 PR #4 中移除 Payload CMS 与 PostgreSQL，收敛为纯静态官网——公开内容由 `src/content/` 驱动，加入申请通过飞书表单外链承接。以下涉及 Payload / 数据库的内容仅作历史留存，不代表当前架构。

## 当前状态

- 阶段 0：已完成。功能 worktree 位于仓库内 `.worktree/codex/alliance-website-v1`。
- 分支：`codex/alliance-website-v1`，基于 `dev` 创建。
- 阶段 1：requirements 已完成并经用户确认。
- 阶段 2：design 已生成并经用户确认。
- 阶段 3：tasks 已生成并经用户确认。
- Planning 方案评审：已通过；3 项 P1 已在 design/tasks 中修正，剩余 P2 纳入执行跟踪。
- Execution Group 0–4 与最终验收均已完成。

## 已确认决策

- 网站主体为中关村自主大模型产业联盟总官网。
- 一期为官网、内容展示和外部申请入口，不建设会员或申请后台。
- 首页主转化是机构生态共建，次转化是专业用户加入。
- 申请跳转飞书表单，后续数据由飞书多维表格承接。
- 内容由开发人员通过项目内配置维护。
- 保留 Payload CMS 与 PostgreSQL，但一期公开内容不接入。
- 建设独立“网络安全生态”专题，保持厂商中立，欢迎不同基础模型参与。

## 环境与仓库状态

- 主工作区分支为 `dev`，创建功能 worktree 后保持干净。
- Worktree 管理配置：`.gtrconfig`；功能分支 `.gitignore` 增加 `/.worktree/`。
- worktree 管理脚本的 enforcement 模块在当前 Bash 环境中提前退出；经用户确认使用 worktree 后，使用脚本支持的 `GTR_SKIP_ENFORCEMENT=1` 继续创建，并手动验证路径与忽略规则。
- 现有技术栈：Next.js 16.2、React 19.2、TypeScript 5.7、Tailwind CSS 4.3、Payload CMS 3.86、PostgreSQL。
- Payload 配置在加载时要求至少 32 位 `PAYLOAD_SECRET`；基线验证和 build 需要使用项目约定的安全测试环境变量。

## 当前执行组

Planning 已于 2026-07-15 获得用户确认。Execution Group 0（T-001）已完成。用户于 2026-07-16 开启隔夜执行模式，后续 Group 1-4 自动推进，仅在不可恢复失败或需要新授权时暂停。

## Owl 隔夜配置

- 工作流：feature
- 模式：quick
- DoD 评估间隔：5 轮或关键里程碑
- 最大评估次数：20
- 自动恢复：启用
- 外部信号监听：无
- 持久化目录：用户配置目录下的 `owl-state/alliance-website-v1`

## Group 0 基线结果

- `pnpm test`：通过，1 个测试文件、2 个测试。
- `pnpm typecheck`：通过，无 TypeScript 错误。
- `pnpm lint`：通过，无 ESLint 错误。
- `pnpm build`：通过；首页静态预渲染，Payload 管理/API 路由保持动态。
- 构建使用本地基线专用的非生产 `PAYLOAD_SECRET`、数据库 URL 和站点 URL；未读取或提交生产凭据。

首次 typecheck 曾因 worktree 管理脚本复制 `node_modules` 时展开 pnpm 符号链接而出现两套 Payload 类型。主工作区同一提交 typecheck 正常；删除 worktree 内可再生的 `node_modules` 并执行 `pnpm install --frozen-lockfile` 后恢复通过。该问题属于隔离环境复制问题，不是仓库基线缺陷。

## Group 0 评审

- 复杂度：simple（环境与配置验证，无业务实现）。
- 规范符合性：通过；主工作区 `dev` 干净，功能 worktree 可独立安装与验证。
- 代码质量：不适用；本组未修改产品代码。
- 无法验证项：E2E 依赖开发服务器与测试数据库，按计划留到页面实现后的 Group 3/4 执行。

## Group 1 结果

- T-002：类型化内容、导航、公开路由与双申请目标配置完成。
- T-003：设计 Token、共享站点外壳、申请外链组件和 jsdom 组件测试完成。
- T-004：sitemap、根级 robots.txt 与统一 404 完成。
- 验证：20/20 单元与组件测试通过；typecheck、lint、build 通过；构建确认 `/robots.txt` 与 `/sitemap.xml` 均已注册。
- 评审：独立评审代理发生停滞并被中断；controller 规范核查发现并修复 robots 路由位置与 404 旧色系问题，随后完成代码质量核查。无未解决 Critical/Important。

## Group 2 结果

- T-005：首页、联盟介绍、工作组与专项完成。
- T-006：厂商中立的网络安全生态独立专题完成。
- T-007：成员授权空状态、新闻列表/详情与未知 slug 404 完成。
- 验证：36/36 单元与组件测试通过；typecheck、lint、build 通过；所有 Group 2 公开路由静态生成。
- 评审：独立规范 reviewer 停滞并中断；controller 对 requirements 与页面逐项核查，无未解决 Critical/Important。

## Group 3 结果

- T-008：机构生态共建、专业用户加入和隐私说明页面完成；双申请目标独立配置，缺失或非法 URL 安全降级。
- T-009：Playwright 改用隔离的 `127.0.0.1:3100`，所有测试使用相对路由；补齐移动导航、横向溢出、主转化路径和全局中文 404。
- 首轮联调发现并修复三个问题：测试标题漂移、顶级未知路由使用 Next 英文 404、管理后台登录 helper 硬编码 3000 端口。
- 验证：53/53 单元与组件测试通过；typecheck、lint、build 通过；22/22 E2E 通过（包括 Payload 管理后台及 390/768/1024/1280 关键视口检查）。

## Group 4 最终验收

| 需求项 | 结果 | 证据或说明 |
|---|---|---|
| 联盟品牌、主张与重点方向 | 通过 | 首页、联盟介绍、工作组页面 |
| 机构主 CTA、专业用户次 CTA | 通过 | 首页、页头与网络安全生态专题 |
| 核心公开内容入口 | 通过 | 导航、首页板块、页脚与 sitemap |
| 独立网络安全生态专题 | 通过 | `/cybersecurity` |
| 六阶段闭环、角色、共建与治理 | 通过 | 专题页面与回归测试 |
| 厂商中立 | 通过 | 产品文案未绑定单一基础模型品牌 |
| 两类飞书目标独立集中配置 | 条件通过 | HTTPS 校验与安全降级已完成；正式 URL 待运营提供 |
| 官网不保存申请数据 | 通过 | 静态外链实现与 `/privacy` 说明 |
| 开发人员维护静态内容 | 通过 | `src/content/*` 与 `src/config/site.ts` |
| 保留 Payload/PostgreSQL | 通过 | 管理后台/API 构建及 E2E 通过 |
| 响应式与移动导航 | 通过 | 390/768/1280 px 全公开页 E2E、CSS 断点与溢出断言 |
| SEO、sitemap、robots | 通过 | 独立 metadata 与生成路由 |
| 隐私、联系、版权、备案位置 | 条件通过 | 页面位置完成；正式联系人和备案号待运营提供 |
| 无明显断链与运行时错误 | 通过 | 22/22 E2E 与全局 404 |
| 自动化验证 | 通过 | 53/53 unit，22/22 E2E，typecheck、lint、build、diff check |

## 发布前运营资料

- 正式联盟 Logo 与视觉规范。
- 经授权的成员名单、Logo、新闻、活动与成果材料。
- 机构和专业用户两份飞书表单 HTTPS URL，以及各表单内隐私告知。
- 正式联系人、ICP备案号和最终合规文案。

以上属于发布资料，不是代码缺陷；当前实现会使用文字标识、诚实空状态和不可点击申请状态，避免虚构内容或死链。
