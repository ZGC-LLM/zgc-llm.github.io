# 技术设计文档: 官网六大核心板块落地 (site-core-modules)

> **功能标识**: site-core-modules
> **复杂度**: complex
> **对应需求**: `site-core-modules-requirements.md`（R-001~R-009 / F-001~F-014）
> **阶段**: Planning 阶段 2（技术设计）

---

## 1. 架构概览

### 1.1 设计目标

在现有 Next.js 16 App Router + React 19 + TS + Tailwind 4 纯静态官网（`BUILD_TARGET=export` 导出到 `out/`，无后台无数据库）之上，落地「联盟层 / 工作组层」两级信息架构，并以**通用嵌套动态路由** `/working-groups/[slug]` 承载工作组，网络安全作为首个实例。所有页面复用既有站点组件与样式，保持纯静态形态，申请统一走飞书表单外链。

### 1.2 两级信息架构（R-007 核心）

```
联盟层 (Alliance)
├── /alliance              联盟介绍（沿用现有，R-001）
├── /join                  加入联盟 · 机构飞书表单 kind="institution"（R-002）
├── /members               联盟成员（沿用，空态占位，与工作组成员分离 F-014）
└── /news                  新闻（沿用，R-006）

工作组层 (Working Groups) —— 通用嵌套路由 /working-groups/[slug]
├── /working-groups                        工作组总览（沿用，改为链向 [slug] 介绍页）
├── /working-groups/cybersecurity          网络安全工作组 · 组织层介绍（R-003, R-007）★新
│     └─ 互链 →  /cybersecurity            网络安全生态 · 业务专题（沿用，不重构内容）
├── /working-groups/cybersecurity/members  工作组成员名单（R-004，空态占位）★新
└── /working-groups/cybersecurity/join     加入工作组 · 专业用户飞书表单 kind="professional"（R-005）★新
```

关键区分（R-007）：
- `/working-groups/cybersecurity` = **组织层**（这个专业小组是谁、做什么：职责/方向/负责人/成果）。
- `/cybersecurity` = **业务专题层**（重点专项：生态闭环、资源、行动、治理边界）。本期不重构其内容，仅建立双向互链。

### 1.3 数据流（构建期，全静态）

```
src/content/*.ts  (类型化配置, 唯一数据源)
   │  working-groups.ts  → WORKING_GROUPS[] + getWorkingGroupBySlug / getWorkingGroupSlugs
   │  working-group-members.ts → WORKING_GROUP_MEMBERS{} + getWorkingGroupMembers
   ▼
generateStaticParams()  ── 为每个 slug 预渲染 3 层路由 (dynamicParams=false)
   ▼
src/config/site.ts
   │  PUBLIC_STATIC_ROUTES  ← 由 WORKING_GROUPS 派生工作组子路由
   │  APPLICATION_TARGETS   ← institution + professional（读 env）
   ▼
next build (BUILD_TARGET=export) → out/**/index.html + sitemap.xml
```

无运行时数据获取；env 缺失/非 https 时由 `resolveApplicationTarget` 走「申请通道准备中」降级。

---

## 2. 组件设计

### 2.1 新增路由组件（`src/app/(frontend)/working-groups/[slug]/`）

| 文件 | 职责 | 关键点 |
|------|------|--------|
| `[slug]/page.tsx` | 工作组组织层介绍 | 渲染职责/研究方向/负责人/成果；含通往 members、join、`ecosystemHref`(/cybersecurity) 的链接；`generateStaticParams` + `dynamicParams=false` + 未知 slug `notFound()` |
| `[slug]/members/page.tsx` | 工作组成员名单 | 读 `getWorkingGroupMembers(slug)`；空数组渲染空态占位（复用 `.empty` 结构）；同样 `generateStaticParams`/`notFound` |
| `[slug]/join/page.tsx` | 加入工作组（专业用户） | `ExternalApplicationLink kind="professional"`；env 缺失/非 https 时降级；同样 `generateStaticParams`/`notFound` |

三个文件各自导出 `generateStaticParams()`（返回全部 slug）、`export const dynamicParams = false`、并在 body 内 `getWorkingGroupBySlug(slug)` 为空即 `notFound()`。与既有 `news/[slug]/page.tsx` 模式完全一致（该文件是本项目已验证的静态导出动态路由范式）。

复用组件：`PageHero`、`SectionHeading`、`ExternalApplicationLink`、`.card`/`.grid-2`/`.grid-3`/`.empty`/`.badges` 等既有样式类，视觉与现有页面统一（无新增 CSS）。

### 2.2 修改的组件

| 文件 | 修改 | 原因 |
|------|------|------|
| `src/app/(frontend)/working-groups/page.tsx` | 卡片链接由 `group.href` 改为 `/working-groups/${group.slug}`（介绍页）；eyebrow 文案区分工作组/重点专项 | `WorkingGroupSummary` 去除 `href` 改用 `slug`（见 §4.1）；总览须指向组织层介绍页而非直接跳专题页 |
| `src/app/(frontend)/cybersecurity/page.tsx` | 在 hero 或组织机制段增加一条返回链接「← 网络安全工作组（组织介绍）」指向 `/working-groups/cybersecurity` | R-007 双向互链，帮助读者区分「工作组(组织)」vs「生态(专题)」 |
| `src/config/site.ts` | 见 §3、§4、§6 | 新增 professional target、派生工作组路由、修正 CORE_MODULES |
| `src/types/content.ts` | 见 §4.1 | 扩展类型 |
| `src/content/working-groups.ts` | 见 §4.2 | 补齐组织层字段 + helper |

`ExternalApplicationLink` 组件**无需改动**：它已是 `kind`-泛化的，新增 `kind="professional"` 通过 `APPLICATION_TARGETS` 与 `ApplicationKind` 联合类型自动生效。

---

## 3. 接口设计

### 3.1 外链集成（飞书表单）

两个独立飞书表单，通过 https 外链跳转，官网不接收/存储数据：

| kind | env 变量 | 使用页面 | 降级 |
|------|----------|----------|------|
| `institution` | `NEXT_PUBLIC_INSTITUTION_APPLICATION_URL`（现有） | `/join` | 现有「申请通道准备中」 |
| `professional`（新增） | `NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL`（**.env.example 已存在**） | `/working-groups/[slug]/join` | 复用 `resolveApplicationTarget` 同款降级 |

安全边界：外链仅 https，复用 `isSafeExternalUrl`；缺失/非 https → `isAvailable=false` → 渲染不可跳转的降级 `<span>`。

### 3.2 内部辅助函数（新增 / 扩展）

```ts
// src/content/working-groups.ts
export function getWorkingGroupSlugs(): string[]
export function getWorkingGroupBySlug(slug: string): WorkingGroupSummary | undefined

// src/content/working-group-members.ts (新文件)
export function getWorkingGroupMembers(slug: string): readonly WorkingGroupMember[]
```

`generateStaticParams` 统一实现：`getWorkingGroupSlugs().map((slug) => ({ slug }))`。

---

## 4. 数据设计

### 4.1 类型定义扩展（`src/types/content.ts`）

**ApplicationKind**（R-005）：
```ts
export type ApplicationKind = 'institution' | 'professional'
```
> 命名决策：采用 `'professional'`（面向专业用户），与 `.env.example` 已有的 `NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL` 对齐。注意这不同于历史上已被移除的 `/professionals` 页面（见 §9 风险）。

**WorkingGroupSummary**（R-003，组织层字段集——本设计需明确定义的核心点）：
```ts
export interface WorkingGroupLead {
  role: string          // 角色/职责，如「统筹」「技术牵引」「学术指导」
  name: string          // 授权具名单位；未授权则填角色化占位描述
  named: boolean         // true=已公开授权具名；false=按角色描述（治理边界）
}

export interface WorkingGroupSummary {
  id: string
  slug: string                              // ★新增 路由键，如 'cybersecurity'
  kind: 'working-group' | 'initiative'
  title: string                             // 组织层名称，如「网络安全工作组」
  description: string                        // 卡片/hero 简述（保留原字段名，减少总览页改动）
  responsibilities: readonly string[]        // ★职责
  researchDirections: readonly string[]      // ★研究方向
  leads: readonly WorkingGroupLead[]         // ★负责人（治理：仅授权者具名）
  outcomes: readonly string[]                // ★成果（本期可空态占位）
  ecosystemHref?: string                     // ★互链业务专题页，如 '/cybersecurity'
  ecosystemLabel?: string                    // ★互链标签，如 '网络安全生态'
}
```
> 决策：**移除原 `href` 字段**，改由 `slug` 派生 `/working-groups/${slug}`；业务专题互链单独用 `ecosystemHref`。原字段 `description` 保留（短简述），避免总览页大改。`leads[].named` 落实「仅公开授权者具名，其余按角色描述」的治理边界（沿用 `cybersecurity.ts` organisation 惯例）。

**WorkingGroupMember**（R-004，工作组成员数据结构——独立于联盟 `MemberSummary`）：
```ts
export interface WorkingGroupMember {
  id: string
  name: string
  role?: string          // 参与角色，如「共建单位」「学术支持」
  description?: string
  logo?: string
}
```
> 决策：**新建独立类型**而非复用 `MemberSummary`。`MemberSummary.type`（founding/institution/research/ecosystem）是联盟层分类，不适用于工作组；独立类型确保两数据源不串（F-014）。

### 4.2 工作组数据（`src/content/working-groups.ts`）

由当前单条精简结构扩展为组织层结构。网络安全工作组示例（组织层文案，负责人沿用 `cybersecurity.ts` 已授权具名口径）：

```ts
export const WORKING_GROUPS: readonly WorkingGroupSummary[] = [
  {
    id: 'cybersecurity',
    slug: 'cybersecurity',
    kind: 'working-group',
    title: '网络安全工作组',
    description: '联盟下设的网络安全工作组，连接专业用户、真实场景、深度任务与能力验证，持续推进安全大模型与网络安全智能体建设。',
    responsibilities: [ /* 职责条目：统筹专项、组织验证、沉淀数据任务、推动成果发布 */ ],
    researchDirections: [ /* 安全大模型、网络安全智能体、深度数据与任务、能力评测靶场 */ ],
    leads: [
      { role: '统筹', name: '中关村自主大模型产业联盟', named: true },
      { role: '模型与技术牵引', name: '智谱', named: true },
      { role: '学术指导', name: '清华大学', named: true },
      { role: '联合运营', name: '数说安全 · 云起无垠', named: true },
      { role: '生态伙伴', name: '安全企业 / 高校 / 实验室 / 专业研究人员（按角色参与）', named: false },
    ],
    outcomes: [ /* 本期可空态或填写已公开确认的阶段性成果，不虚构 */ ],
    ecosystemHref: '/cybersecurity',
    ecosystemLabel: '网络安全生态',
  },
]
```
> 治理约束：`leads`/`outcomes` 仅填入已公开授权信息，未授权保持角色化描述或空态；不虚构数据。具体文案以需求方提供为准，实施时可用上述与 `cybersecurity.ts` 一致的口径占位。

helper：`getWorkingGroupSlugs()`、`getWorkingGroupBySlug(slug)`。

### 4.3 工作组成员数据（新文件 `src/content/working-group-members.ts`）

```ts
import type { WorkingGroupMember } from '@/types/content'

// 成员单位名单须在获得公开授权后加入，未授权前保持空态占位。
export const WORKING_GROUP_MEMBERS: Readonly<Record<string, readonly WorkingGroupMember[]>> = {
  cybersecurity: [],   // 空态占位（R-004 IF 分支）
} as const

export function getWorkingGroupMembers(slug: string): readonly WorkingGroupMember[] {
  return WORKING_GROUP_MEMBERS[slug] ?? []
}
```
> 决策：**按 slug 索引的 map**（`Record<slug, WorkingGroupMember[]>`）。便于未来多工作组扩展，且与联盟 `MEMBERS`（扁平数组）物理隔离，满足 F-014「不同数据源、互不串数据」。

---

## 5. `CORE_MODULES` 文案修正与路由对齐（R-002/R-005 排除项）

修正 `src/config/site.ts` 中暗示「材料上传 / 后台审核流转 / 进度管理」的误导性文案，改为与纯静态飞书表单一致，并对齐实际路由：

| slug | 现状（误导） | 修正后 | path 修正 |
|------|------------|--------|-----------|
| `alliance-application` | 「提供结构化入盟申请、材料上传和进度管理。」 | 「汇总机构参与价值、路径与流程，通过机构飞书表单提交合作意向。」 | `/alliance/join` → `/join`（对齐实际路由） |
| `working-group-members` | 「按照成员类型展示单位信息、品牌标识与简介。」 | 「展示工作组成员单位名单与公开简介，未授权前保持空态占位。」 | 保持 `/working-groups/[slug]/members` |
| `working-group-application` | 「接收加入工作组的申请并支持后台审核流转。」 | 「面向专业用户，通过专业用户飞书表单申请加入工作组重点专项。」 | 保持 `/working-groups/[slug]/join` |

其余条目（`alliance`、`working-group`、`news`）文案无误导，保持不变。

---

## 6. 静态导出与 SEO 同步（R-009）

### 6.1 `generateStaticParams`（关键高风险点）

三层路由 **每个文件都必须**导出 `generateStaticParams`，否则静态导出下 `out/` 缺页。统一实现 + `dynamicParams=false`（未知 slug → 404，满足 R-008 not-found）。范式对齐既有 `news/[slug]/page.tsx`。

### 6.2 `PUBLIC_STATIC_ROUTES` 与 sitemap 同步

`src/config/site.ts` 中由 `WORKING_GROUPS` **派生**工作组子路由并并入 `PUBLIC_STATIC_ROUTES`：
```ts
import { WORKING_GROUPS } from '@/content/working-groups'

const BASE_STATIC_ROUTES = ['/', '/alliance', '/working-groups', '/cybersecurity',
  '/members', '/news', '/join', '/privacy'] as const

const WORKING_GROUP_ROUTES = WORKING_GROUPS.flatMap(({ slug }) => [
  `/working-groups/${slug}`,
  `/working-groups/${slug}/members`,
  `/working-groups/${slug}/join`,
])

export const PUBLIC_STATIC_ROUTES: readonly string[] =
  [...BASE_STATIC_ROUTES, ...WORKING_GROUP_ROUTES]
```
> 无循环依赖：`working-groups.ts` 不 import `site.ts`。类型由元组变为 `readonly string[]`，现有 `.toContain`/`.not.toContain` 断言不受影响。
>
> **`sitemap.ts` 无需改动**：它已 `PUBLIC_STATIC_ROUTES.map(...)`，工作组路由随之自动进入 sitemap（满足 F-013）。构建后仍需校验 sitemap.xml 实际含新路由。

---

## 7. 技术选型

沿用现有栈，无新增依赖。全部为仓库内类型化静态配置 + App Router 静态导出。测试：Vitest（单元）+ Playwright（E2E）。

---

## 8. 测试策略

| 层级 | 覆盖 | 关联 |
|------|------|------|
| 单元 (Vitest) | `resolveApplicationTarget('professional')` 可用/降级；`getWorkingGroupBySlug`/`getWorkingGroupSlugs`；`getWorkingGroupMembers` 空态；各路由 `generateStaticParams` 输出全部 slug；`PUBLIC_STATIC_ROUTES` 含工作组子路由；`CORE_MODULES` 文案不含「材料上传/后台审核」；数据源分离 | F-003,F-006,F-008,F-011,F-013,F-014 |
| E2E (Playwright) | `/alliance`、`/join`（+机构入口）、`/working-groups`、`/working-groups/cybersecurity`（+3 链接）、`/members`(空态)、专业加入入口、生态互链、`/news`、未知 slug→404 | F-001~F-011 |
| 构建验证 (原生 `npx next build`) | `BUILD_TARGET=export` 后 `out/working-groups/cybersecurity/{,members/,join/}index.html` 真实生成；`out/sitemap.xml` 含新路由 | F-012,F-013 |

> **已知坑（写入相关任务验收）**：`rtk next build` 可能失败仍报 "Errors: 0"，验证构建**必须用原生 `BUILD_TARGET=export npx next build`** 并检查 `out/` 产物；Playwright 端口检查在本地代理下失效，E2E **不经 rtk 代理**运行。

**须同步更新的既有测试**（否则回归失败）：
- `tests/unit/site-config.test.ts`：删除/改写 `APPLICATION_TARGETS.not.toHaveProperty('professional')`，新增 professional target 断言；`PUBLIC_STATIC_ROUTES` 现含工作组路由。
- `tests/unit/conversion-pages.test.tsx`：「professional conversion page is fully retired」用例——保留「`/professionals` 路由仍不存在」，移除/改写「professional target 不存在」（现已存在，但位于 `/working-groups/[slug]/join` 而非 `/professionals`）。
- `tests/unit/content.test.ts`：工作组目录断言由 `{ href: '/cybersecurity', id: 'cybersecurity-ecosystem' }` 改为新形状（`slug: 'cybersecurity'`、`ecosystemHref: '/cybersecurity'`）。

---

## 9. 风险与迁移

| 风险 | 缓解 |
|------|------|
| `[slug]` 三层路由漏 `generateStaticParams` → `out/` 缺页 | 三文件统一实现 + `dynamicParams=false`；构建后校验 `out/` 产物（F-012） |
| `rtk next build` 掩盖构建失败 | 用原生 `BUILD_TARGET=export npx next build` 验证 + 检查 `out/` |
| **历史已「退役」professional 被重新引入** | 代码中有多处测试显式锁定 professional/`/professionals` 已移除（site-config/conversion-pages）。本期在 `/working-groups/[slug]/join` 复活 `professional` **ApplicationKind**（非 `/professionals` 页面）。须同步更新这些「退役」断言——**建议合并确认时向用户点明此历史决策反转** |
| 「工作组(组织)」vs「生态(专题)」文案仍被混淆 | 介绍页明确标注「组织」层，生态以「重点专项」标签 + 双向互链呈现 |
| 双飞书表单 env 未就绪 | 沿用 `resolveApplicationTarget` 降级，env 缺失显示「准备中」不报错（F-003,F-008） |
| 联盟成员与工作组成员数据串用 | 两套独立类型 + 独立文件 + 独立渲染，加 F-014 测试 |

迁移：无数据库迁移；纯代码变更。`WorkingGroupSummary` 结构变更会波及 `working-groups/page.tsx` 与 `content.test.ts`，已纳入任务范围。
</content>
</invoke>
