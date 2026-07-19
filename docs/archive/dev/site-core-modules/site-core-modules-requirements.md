---
feature: site-core-modules
complexity: complex
generated_by: clarify
generated_at: 2026-07-17T00:00:00Z
version: 1
---

# 需求文档: 官网六大核心板块落地

> **功能标识**: site-core-modules
> **复杂度**: complex
> **生成方式**: clarify
> **生成时间**: 2026-07-17

## 1. 概述

### 1.1 一句话描述

在中关村自主大模型产业联盟纯静态官网上，落地并理顺「联盟层 / 工作组层」两级信息架构，把需求方提出的六大板块（联盟介绍、加入联盟、工作组介绍、工作组成员、加入工作组、新闻）建成清晰、可扩展、职责分明的页面结构。

### 1.2 核心价值

- 让访客能清楚区分**联盟（顶层组织）**与**工作组（下设专业小组）**两级，并沿正确的层级找到"了解 → 参与"的路径。
- 修正当前把「网络安全工作组（组织）」与「网络安全生态（业务专题）」混为一谈的信息架构缺陷。
- 通过通用嵌套路由 `/working-groups/[slug]`，为未来新增工作组预留可扩展结构，网络安全作为首个实例。
- 保持纯静态、无后台的低成本形态，加入申请统一通过飞书表单收集。

### 1.3 目标用户

- **主要用户**：希望了解联盟/工作组并申请加入的机构（模型、芯片、算力、数据、平台、行业应用伙伴、高校科研机构）与专业用户（安全研究员、攻防团队、高校师生、专业开发者）。
- **次要用户**：联盟/工作组内容维护者（通过 `src/content/` 类型化配置维护公开内容）。

---

## 2. 需求与用户故事

### 2.1 需求清单

| ID | 需求点 | 优先级 | 用户故事 |
|----|--------|--------|----------|
| R-001 | 联盟介绍 | P0 | As a 访客, I want 了解联盟宗旨、价值、机制与重点方向, so that 判断是否与自身相关 |
| R-002 | 加入联盟申请入口 | P0 | As a 机构/单位, I want 通过机构飞书表单提交合作意向, so that 与联盟建立联系 |
| R-003 | 工作组介绍（组织层） | P0 | As a 访客, I want 了解某工作组的职责、研究方向、负责人与成果, so that 理解这个专业小组在做什么 |
| R-004 | 工作组成员列表 | P0 | As a 访客, I want 查看该工作组的成员单位名单, so that 评估生态规模与可信度 |
| R-005 | 加入工作组申请入口 | P0 | As a 专业用户/单位, I want 通过专业用户飞书表单申请加入某工作组, so that 参与该工作组的重点专项 |
| R-006 | 新闻板块 | P0 | As a 访客, I want 浏览联盟新闻、活动、观察与成果动态, so that 了解最新进展 |
| R-007 | 联盟层与工作组层信息架构区分 | P0 | As a 访客, I want 清楚区分"网络安全工作组（组织）"与"网络安全生态（专题）", so that 不被概念混淆 |
| R-008 | 通用嵌套路由结构 | P1 | As a 内容维护者, I want 工作组走 `/working-groups/[slug]` 通用结构, so that 未来新增工作组无需改动路由代码 |
| R-009 | 静态导出与 SEO 同步 | P1 | As a 站点运营, I want 新增路由纳入静态导出、sitemap、robots, so that 页面可被正确抓取与索引 |

### 2.2 验收标准

#### R-001: 联盟介绍
- **WHEN** 访客访问 `/alliance`, **THEN** 系统 **SHALL** 展示联盟宗旨、价值主张、运作机制与重点方向（沿用 `src/content/alliance.ts`，如需微调可小幅更新）。

#### R-002: 加入联盟申请入口
- **WHEN** 访客访问 `/join`, **THEN** 系统 **SHALL** 展示机构参与价值/路径/流程/FAQ，并提供 `kind="institution"` 的机构飞书表单入口按钮。
- **IF** 机构飞书表单环境变量未配置（`NEXT_PUBLIC_INSTITUTION_APPLICATION_URL` 缺失或非 https）, **THEN** 系统 **SHALL** 显示"申请通道准备中"的不可用提示，而非跳转。

#### R-003: 工作组介绍（组织层）
- **WHEN** 访客访问 `/working-groups/cybersecurity`, **THEN** 系统 **SHALL** 展示**网络安全工作组**的组织层介绍（职责、研究方向、负责人、成果），并提供指向其成员列表、加入入口与「网络安全生态」重点专项专题页的链接。
- **WHEN** 访客访问 `/working-groups`, **THEN** 系统 **SHALL** 列出联盟下设的各工作组，并链接到各自的 `/working-groups/[slug]` 介绍页。

#### R-004: 工作组成员列表
- **WHEN** 访客访问 `/working-groups/cybersecurity/members`, **THEN** 系统 **SHALL** 展示该工作组的成员单位名单（独立于联盟成员名单）。
- **IF** 该工作组成员名单为空（暂无可公开授权数据）, **THEN** 系统 **SHALL** 显示空态占位文案，页面结构保持完整可访问。

#### R-005: 加入工作组申请入口
- **WHEN** 访客访问 `/working-groups/cybersecurity/join`, **THEN** 系统 **SHALL** 展示面向专业用户的加入价值/路径/说明，并提供新增的专业用户飞书表单入口按钮（新 `ApplicationKind`）。
- **IF** 专业用户飞书表单环境变量未配置或非 https, **THEN** 系统 **SHALL** 显示不可用提示，而非跳转。

#### R-006: 新闻板块
- **WHEN** 访客访问 `/news`, **THEN** 系统 **SHALL** 展示 `published: true` 的新闻条目（沿用 `src/content/news.ts`）。

#### R-007: 信息架构区分
- **WHEN** 访客在工作组介绍页浏览, **THEN** 系统 **SHALL** 将"网络安全工作组（组织）"与"网络安全生态（重点专项/业务专题）"呈现为两个层面：组织信息在 `/working-groups/cybersecurity`，业务专题保留在 `/cybersecurity` 并从工作组页链接过去。

#### R-008: 通用嵌套路由结构
- **WHEN** 新增一个工作组配置项, **THEN** 系统 **SHALL** 无需新增路由文件即可通过 `/working-groups/[slug]`、`/working-groups/[slug]/members`、`/working-groups/[slug]/join` 提供对应页面。
- **WHEN** 访客访问不存在的 `slug`, **THEN** 系统 **SHALL** 返回 not-found。

#### R-009: 静态导出与 SEO 同步
- **WHEN** 执行生产构建（静态导出）, **THEN** 系统 **SHALL** 为所有工作组的 `[slug]` 及其子路由通过 `generateStaticParams` 生成静态页面。
- **WHEN** 访客/爬虫请求 sitemap, **THEN** 系统 **SHALL** 在 sitemap 与 `PUBLIC_STATIC_ROUTES` 中包含新增的工作组子路由。

---

## 3. 功能验收清单

> 从用户视角列出可感知的功能点。实施阶段只能将 ☐ 改为 ✅，不得删除或修改功能描述。

| ID | 功能点 | 验收步骤 | 优先级 | 关联需求 | 通过 |
|----|--------|----------|--------|----------|------|
| F-001 | 联盟介绍页可访问 | 1. 访问 `/alliance` 2. 见宗旨/价值/机制/方向 | P0 | R-001 | ☐ |
| F-002 | 加入联盟机构表单入口 | 1. 访问 `/join` 2. 点击"机构合作申请"跳飞书表单 | P0 | R-002 | ☐ |
| F-003 | 机构表单未配置时降级提示 | 1. 清空机构表单 env 2. 访问 `/join` 3. 见不可用提示不跳转 | P1 | R-002 | ☐ |
| F-004 | 工作组总览列出工作组 | 1. 访问 `/working-groups` 2. 见网络安全工作组卡片并可点入 | P0 | R-003 | ☐ |
| F-005 | 工作组介绍页（组织层） | 1. 访问 `/working-groups/cybersecurity` 2. 见职责/方向/负责人/成果 3. 见通往成员/加入/生态专题的链接 | P0 | R-003, R-007 | ☐ |
| F-006 | 工作组成员列表页 | 1. 访问 `/working-groups/cybersecurity/members` 2. 见工作组成员名单或空态占位 | P0 | R-004 | ☐ |
| F-007 | 加入工作组专业表单入口 | 1. 访问 `/working-groups/cybersecurity/join` 2. 点击专业用户申请跳飞书表单 | P0 | R-005 | ☐ |
| F-008 | 专业表单未配置时降级提示 | 1. 清空专业表单 env 2. 访问加入工作组页 3. 见不可用提示不跳转 | P1 | R-005 | ☐ |
| F-009 | 生态专题页与工作组页互链 | 1. 从工作组介绍页点"重点专项/生态" 2. 跳 `/cybersecurity` 专题页 | P0 | R-007 | ☐ |
| F-010 | 新闻板块可访问 | 1. 访问 `/news` 2. 见已发布新闻列表 | P0 | R-006 | ☐ |
| F-011 | 未知 slug 返回 not-found | 1. 访问 `/working-groups/unknown` 2. 见 not-found | P1 | R-008 | ☐ |
| F-012 | 静态导出包含新路由 | 1. 生产构建 2. `out/` 下存在工作组子路由静态页 | P0 | R-009 | ☐ |
| F-013 | sitemap/robots 含新路由 | 1. 检查 sitemap 2. 含 `/working-groups/[slug]` 及子路由 | P1 | R-009 | ☐ |
| F-014 | 联盟成员与工作组成员分离 | 1. 检查两处名单来自不同数据源 2. 互不串数据 | P1 | R-004 | ☐ |

---

## 4. 技术约束

### 4.1 技术栈
- **语言/框架**：Next.js 16（App Router）+ React 19 + TypeScript + Tailwind CSS 4。
- **渲染形态**：纯静态导出官网，无后台、无数据库、无内容管理系统。公开内容全部来自 `src/content/` 类型化配置。
- **测试**：Vitest（单元）+ Playwright（E2E）。
- **注意**：`rtk next build` 曾出现失败构建仍报 "Errors: 0" 的情况，验证构建须用原生 `npx next build` 并检查 `out/` 产物（见项目记忆）。

### 4.2 集成点
- **外部服务**：飞书表单（两个独立表单：机构 + 专业用户），通过 `https` 外链跳转，官网不接收/存储申请数据。
- **内部模块**：
  - `src/config/site.ts` — `APPLICATION_TARGETS`、`PUBLIC_STATIC_ROUTES`、`CORE_MODULES`、`resolveApplicationTarget`、`isSafeExternalUrl`。
  - `src/types/content.ts` — `ApplicationKind`（当前仅 `'institution'`，需扩展）、`WorkingGroupSummary`、`MemberSummary`、`CybersecurityEcosystem`。
  - `src/components/site/external-application-link.tsx` — 申请入口组件（按 `kind` 解析目标）。
  - `src/content/` — `alliance.ts`、`working-groups.ts`、`members.ts`、`news.ts`、`cybersecurity.ts`。
  - `src/app/(frontend)/` — 现有 `alliance/ cybersecurity/ join/ members/ news/ privacy/ working-groups/` 路由；`sitemap.ts`、`layout.tsx`、`styles.css`。
- **需扩展/新增**：
  - `ApplicationKind` 新增专业用户类型（如 `'professional'` 或 `'working-group'`）+ 对应 `APPLICATION_TARGETS` 条目 + 新环境变量（如 `NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL`），同步 `.env.example`。
  - 新增动态路由 `src/app/(frontend)/working-groups/[slug]/`（`page.tsx` + `members/` + `join/`），配 `generateStaticParams`。
  - `WorkingGroupSummary` 扩展组织层字段（职责/方向/负责人/成果等，待设计阶段定字段集）。
  - 工作组成员数据源（独立于联盟 `MEMBERS`）。
  - 修正 `CORE_MODULES` 中暗示"材料上传/后台审核流转"的描述文字，改为与纯静态飞书表单一致的措辞，并对齐实际路由。

### 4.3 数据要求
- **存储**：无。所有内容为仓库内静态类型化配置，构建期编译进静态页面。
- **成员名单**：联盟成员（`MEMBERS`，当前为空）与工作组成员（新增，当前无可公开授权数据）两组独立维护；成员名称/品牌标识须在获得公开授权后加入，未授权前保持空态占位。

### 4.4 非功能性需求
- **安全/合规**：外链仅允许 https（`isSafeExternalUrl`）；成员及负责人信息遵循"仅公开授权者具名，其余按角色描述"的既有治理边界（参考 `cybersecurity.ts` organisation 惯例）。
- **可扩展性**：新增工作组只需增配置，不改路由代码。
- **可访问性/SEO**：新增路由须进入 sitemap、`PUBLIC_STATIC_ROUTES`，并具备规范的页面 metadata（canonical、title、description）。
- **一致性**：新页面复用现有站点组件（`PageHero`、`SectionHeading`、`ExternalApplicationLink`、卡片/栅格样式），视觉与既有页面统一。

---

## 5. 排除项

- **后台审核系统 / 材料上传 / 进度管理 / 数据库**：本期不做，纯静态 + 飞书表单收集。`CORE_MODULES` 里相关描述文字需同步修正以免误导。
- **真实成员/负责人具名数据填充**：本期只做数据结构与空态占位，具体名单在获得公开授权后再补。
- **多工作组内容**：本期只落地"网络安全"一个工作组实例，但结构须为通用嵌套，可平滑扩展。
- **联盟成员名单内容填充**：`/members` 结构沿用，名单填充不在本期范围（除非另行授权）。
- **`/cybersecurity` 专题页内容重写**：保留现有丰富内容，仅建立与工作组介绍页的互链，不重构其内部内容。

---

## 6. 风险与依赖

### 6.1 风险
| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| 动态嵌套路由 `[slug]` 在静态导出下遗漏 `generateStaticParams`，导致构建缺页 | 中 | 高 | 三层路由（介绍/成员/加入）均实现 `generateStaticParams`；构建后校验 `out/` 产物 |
| `rtk next build` 掩盖构建失败（记忆已记录） | 中 | 高 | 用原生 `npx next build` 验证 + 检查 `out/` + 本地不经代理跑 Playwright |
| "工作组" vs "生态" 概念在文案上仍被读者混淆 | 中 | 中 | 工作组介绍页明确标注"组织"层，"生态"以"重点专项"标签呈现并链接跳转 |
| 双飞书表单环境变量未就绪导致上线时入口不可用 | 高 | 中 | 沿用 `resolveApplicationTarget` 的不可用降级提示；env 缺失时显示准备中而非报错 |
| `CORE_MODULES` 文案与实际实现（路由/形态）不一致造成后续误导 | 中 | 中 | 本期同步修正 `CORE_MODULES` 描述与 `path` |
| 联盟成员与工作组成员数据源串用 | 低 | 中 | 两套独立数据结构与独立渲染，加测试 F-014 |

### 6.2 依赖
| 依赖项 | 类型 | 状态 | 负责人 |
|--------|------|------|--------|
| 机构飞书表单 URL（`NEXT_PUBLIC_INSTITUTION_APPLICATION_URL`） | 外部 | 待定 | 需求方 |
| 专业用户飞书表单 URL（新增 env） | 外部 | 待定 | 需求方 |
| 网络安全工作组组织层文案（职责/方向/负责人/成果） | 内部 | 待定 | 需求方 |
| 工作组成员单位授权名单 | 外部 | 待定 | 需求方 |

---

## 7. 下一步

### 来自 clarify
✅ 在新会话中执行：
```bash
/devagent:dev-spec-dev site-core-modules --skip-requirements
```

> 复杂度为 `complex`，建议在 design 阶段重点确认：`WorkingGroupSummary` 的组织层字段集、新增 `ApplicationKind` 命名与 env 命名、工作组成员数据结构、三层嵌套路由的 `generateStaticParams` 与 not-found 策略。
