---
feature: cybersecurity-cooperation
complexity: standard
generated_by: clarify
generated_at: 2026-07-18T00:00:00+08:00
version: 2
---

# 需求文档: 统一合作/加入入口（共享一张飞书问卷）

> v2 变更：由"网安组合作招募单入口"演进为"**统一飞书问卷承接 + 官网分场景多入口**"。加入联盟（轻量登记）、参与工作组、机构/专家合作共用同一张飞书问卷；官网各场景保留独立入口与文案，但都指向该问卷。

## 1. 概述

用**一张飞书问卷**统一承接官网上的三类意向——**加入联盟**（轻量登记）、**参与网络安全工作组**、**机构/专家合作**；官网侧保留分场景的入口与介绍文案，但所有 CTA 指向同一张问卷。问卷用**逻辑跳转**按"意向类型 + 专家/机构身份"分支提问，运营一处后台维护。

- **核心价值**：把官网现有分散的申请入口（机构 `institution` / 专业用户 `professional`）与加入联盟收敛成**一张可维护的飞书问卷**，运营成本最低；同时在官网侧保留语境化入口，用户不丢失方向感。
- **目标用户**：① 想加入联盟的机构；② 想参与/合作网络安全工作组的专家个人与机构（网络安全企业、科研机构、高校团队、研究人员）。

> **现状约束**：仓库已有两类外部申请目标 `institution`（→ `/join`）、`professional`（→ `/working-groups/cybersecurity/join`），由 `NEXT_PUBLIC_INSTITUTION_APPLICATION_URL`、`NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL` 注入（见 `src/config/site.ts` `APPLICATION_TARGETS`、`external-application-link.tsx`）。本需求将其向"单一问卷"收敛。

## 2. 需求与用户故事

### R1 一张统一飞书问卷（承接全部意向）
- **作为**运营者，**我希望**用一张飞书问卷承接加入联盟/参与工作组/合作全部意向，**以便**只维护一处后台。
- **验收标准**：
  - 官网侧最终指向**一个**外部问卷链接（经环境变量注入）。
  - 问卷内部由"意向类型"（加入联盟 / 参与网安组 / 机构合作）与"身份"（专家 / 机构）字段区分——**字段与分支逻辑在飞书侧配置，不在代码内硬编码**。
  - 问卷须为**外部/匿名可填的公开链接**（无需登录飞书），否则外部专家/机构无法提交。
  - **官网不接收、不落库、不保存任何申请人个人信息**（项目硬约束）。

### R2 官网分场景入口（多入口、共享后端）
- **作为**潜在加入方，**我希望**在对应页面看到贴合语境的入口与说明，**以便**知道自己在申请什么。
- **验收标准**：
  - 至少保留：联盟层面的"加入联盟"入口，与网安组的"参与工作组/合作"入口，各自有独立介绍文案。
  - 各入口 CTA 均指向同一张问卷；如飞书问卷支持链接参数，可预选对应"意向类型"。
  - 中英双语（复用 `Record<Locale, ...>` i18n，覆盖中文根路径与 `/en` 子树）。
  - 网安组合作招募的展示内容（做什么/欢迎谁/合作价值）聚焦网络安全工作组，集中在 `src/content/`。

### R3 配置收敛 & 结构可扩展
- **作为**维护者，**我希望**入口配置尽量收敛、且为将来其他工作组留位。
- **验收标准**：
  - 现有 `institution` / `professional` 双 target + 双环境变量向单一问卷收敛（收敛为一个统一 target/env，如 `NEXT_PUBLIC_APPLICATION_URL`；具体在设计阶段定，需保证 `/join`、`/working-groups/cybersecurity/join` 现有引用不回归）。
  - 环境变量缺省时展示"申请通道准备中"降级文案，不报错、不阻塞构建。
  - "工作组"维度为可配置数据（复用/扩展 `working-groups.ts`），将来加组只增配置、不重构页面。

## 3. 功能验收清单

- [ ] 官网所有加入/合作 CTA 最终指向同一张飞书问卷（单一外链）。
- [ ] 联盟层"加入联盟"入口与网安组"参与工作组/合作"入口均保留，各有语境文案。
- [ ] 问卷链接经环境变量注入；未配置时显示降级文案且不报错。
- [ ] 问卷为外部/匿名可填的公开链接（运营侧验证，官网侧不阻塞）。
- [ ] 官网侧无任何个人信息收集/存储代码。
- [ ] 现有 `institution`/`professional` 双 target 收敛后，`/join` 与 `/working-groups/cybersecurity/join` 无回归。
- [ ] 中文根路径与 `/en` 子树文案齐备，无缺项。
- [ ] 新增/变更环境变量已同步 `.env.example`（不含真实链接）。
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm build` 全部通过。

## 4. 技术约束

- **技术栈**：Next.js 16 App Router + React 19 + TS 严格模式（禁 `any`）+ Tailwind 4；纯静态、无后端、无数据库。
- **承接**：飞书问卷（支持意向类型/身份分支）外链，复用 `resolveApplicationTarget` / `isSafeExternalUrl` / `ExternalApplicationLink`（`https` 校验、`target=_blank` + `rel=noreferrer noopener`、降级文案）。
- **配置收敛**：`APPLICATION_TARGETS` 由双 kind 收敛为单一问卷 target；`NEXT_PUBLIC_*` 环境变量相应收敛，同步 `.env.example`。
- **内容/类型**：文案与工作组配置集中在 `src/content/`，类型集中在 `src/types/content.ts`。
- **i18n**：复用 `Record<Locale, Strings>` + `/en` 子树 + `buildAlternates`，覆盖中文根路径与 `/en`。
- **集成点**：`src/config/site.ts`、`src/content/`、`src/types/content.ts`、`join-view` / `working-groups/[slug]/join` 及相关视图组件、`.env.example`。
- **SEO/域名**：canonical / alternates 沿用现有模式；主域名以 `www.zgc-llm.org.cn`（带连字符）为准。
- **合规**：零个人信息落库；文档与 `.env.example` 不得出现真实问卷链接或密钥。

## 5. 排除项

- ❌ 官网自建表单/后端/数据库承接（继续用飞书问卷，不落库）。
- ❌ 探索非飞书的承接方案（本期沿用飞书问卷）。
- ❌ 现在就为尚未运营的其他工作组落地独立招募页（仅数据结构预留）。
- ❌ 问卷后续审批流、通知、CRM/会员管理（在飞书/运营侧，不在官网范围）。
- ❌ 将"加入联盟"做成正式会员制流程（本期按轻量登记，与工作组合作共用问卷）。

## 6. 风险与依赖

| 项 | 说明 | 应对 |
|----|------|------|
| 双 target 收敛回归 | `institution`/`professional` 被多页引用，收敛为单一问卷可能影响现有链接/降级逻辑 | 设计阶段先全量梳理引用点，保证 `/join`、`/working-groups/cybersecurity/join` 不回归 |
| 问卷外部可填 | 飞书问卷默认可能要求登录/限组织内，外部专家/机构无法提交 | 运营侧设为公开/匿名可填链接，建完用无痕浏览器实测 |
| 意向/身份口径 | 意向类型、专家/机构字段的口径需与运营对齐 | 在飞书问卷内配置分支，官网只暴露单一入口，不硬编码字段 |
| 语境缺失 | 若官网只留光秃链接，用户不知在申请什么 | 保留分场景入口 + 独立文案，CTA 再指向同一问卷 |
| i18n 一致性 | 新文案需中英同步 | 复用 `Record<Locale, ...>`，双语齐备 |

## 7. 下一步

- 建议进入 **dev-spec-dev** 生成 design.md（重点决策：双 target 如何收敛为单一问卷 target；官网各入口如何复用同一 URL（是否用链接参数预选意向）；网安组合作展示板块落位）+ tasks.md 后按 TDD 实施。
- 运营侧**先确认/准备**：在飞书新建一张含"意向类型 + 专家/机构身份"分支、且**外部匿名可填**的统一问卷，提供链接用于配置 `NEXT_PUBLIC_APPLICATION_URL`。
- 命令：`/devagent:dev-spec-dev cybersecurity-cooperation --skip-requirements`
