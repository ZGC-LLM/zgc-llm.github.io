# 任务清单: 官网六大核心板块落地 (site-core-modules)

> **对应设计**: `site-core-modules-design.md`
> **对应需求**: `site-core-modules-requirements.md`（R-001~R-009 / F-001~F-014）
> **阶段**: Planning 阶段 3（任务拆分）
> 依赖以 `provides`/`consumes` 派生边为准，`parallel_group` 为兼容回退分组。

## 任务总览

| ID | 任务 | priority | complexity | parallel_group | 依赖 |
|----|------|----------|------------|----------------|------|
| T-001 | 扩展类型定义（content.ts） | P0 | standard | 1 | — |
| T-002 | 扩展工作组数据与 helper（working-groups.ts） | P0 | standard | 2 | T-001 |
| T-003 | 新增工作组成员数据源（working-group-members.ts） | P0 | simple | 2 | T-001 |
| T-004 | 扩展 site.ts 配置 + CORE_MODULES 文案修正 + env | P0 | standard | 3 | T-001, T-002 |
| T-005 | 工作组介绍页 `/working-groups/[slug]/page.tsx` | P0 | standard | 3 | T-002 |
| T-006 | 工作组成员页 `/working-groups/[slug]/members/page.tsx` | P0 | standard | 3 | T-002, T-003 |
| T-007 | 加入工作组页 `/working-groups/[slug]/join/page.tsx` | P0 | standard | 4 | T-002, T-004 |
| T-008 | 总览页链接调整 + 生态专题页互链 | P1 | standard | 4 | T-002 |
| T-009 | 新增单元测试（Vitest） | P1 | standard | 5 | T-004,T-005,T-006,T-007 |
| T-010 | 新增 E2E 测试（Playwright） | P1 | standard | 5 | T-005,T-006,T-007,T-008 |
| T-011 | 静态导出构建验证（out/ + sitemap） | P0 | standard | 6 | T-004~T-008 |

**任务总数**: 11

---

## 任务详情

## T-001: 扩展类型定义（content.ts） [P0] [standard]

- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 1
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: []
- **provides**: [src/types/content.ts]
- **consumes**: []
- **must_not_create**: []

### 描述
扩展 `src/types/content.ts`：`ApplicationKind` 追加 `'professional'`；扩展 `WorkingGroupSummary`（新增 `slug`、`responsibilities`、`researchDirections`、`leads`、`outcomes`、`ecosystemHref`、`ecosystemLabel`，移除 `href`，保留 `description`）；新增 `WorkingGroupLead` 与 `WorkingGroupMember` 接口。字段定义见 design §4.1。

### 验收标准
- [ ] `ApplicationKind = 'institution' | 'professional'`
- [ ] `WorkingGroupSummary` 含 `slug` 及全部组织层字段，`href` 已移除，`description` 保留
- [ ] 新增 `WorkingGroupLead { role; name; named }` 与 `WorkingGroupMember { id; name; role?; description?; logo? }`
- [ ] `tsc --noEmit` 通过（此步会暴露下游待改点，属预期）

### 涉及文件
- src/types/content.ts

---

## T-002: 扩展工作组数据与 helper（working-groups.ts） [P0] [standard]

- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 2
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 2
- **dependencies**: [T-001]
- **provides**: [src/content/working-groups.ts]
- **consumes**: [src/types/content.ts]
- **must_not_create**: [src/content/working-group-members.ts]

### 描述
将 `WORKING_GROUPS` 扩展为组织层结构（网络安全工作组：id/slug='cybersecurity'、title='网络安全工作组'、职责/研究方向/负责人/成果、`ecosystemHref='/cybersecurity'`），负责人具名沿用 `cybersecurity.ts` 已授权口径、未授权者按角色描述、成果不虚构（可空态）。新增 `getWorkingGroupSlugs()`、`getWorkingGroupBySlug(slug)`。同步更新既有断言 `tests/unit/content.test.ts`（工作组目录形状由旧 `{href:'/cybersecurity', id:'cybersecurity-ecosystem'}` 改为新形状）。

### 验收标准
- [ ] `WORKING_GROUPS` 单条网络安全工作组，含全部组织层字段，`slug='cybersecurity'`、`ecosystemHref='/cybersecurity'`
- [ ] `leads` 中 `named=false` 项按角色描述，无虚构具名；`outcomes` 不含未确认数据
- [ ] `getWorkingGroupSlugs()` 返回 `['cybersecurity']`；`getWorkingGroupBySlug('cybersecurity')` 命中、未知 slug 返回 `undefined`
- [ ] `tests/unit/content.test.ts` 相关断言已更新且通过
- [ ] 治理边界：仅公开授权者具名（R-004/非功能安全约束）

### 涉及文件
- src/content/working-groups.ts
- tests/unit/content.test.ts

---

## T-003: 新增工作组成员数据源（working-group-members.ts） [P0] [simple]

- **priority**: P0
- **complexity**: simple
- **review_strategy**: self
- **parallel_group**: 2
- **execution**: agent
- **model**: haiku
- **estimated_files**: 1
- **dependencies**: [T-001]
- **provides**: [src/content/working-group-members.ts]
- **consumes**: [src/types/content.ts]
- **must_not_create**: []

### 描述
新建 `src/content/working-group-members.ts`：按 slug 索引的 `WORKING_GROUP_MEMBERS: Record<string, readonly WorkingGroupMember[]>`（`cybersecurity: []` 空态占位），及 `getWorkingGroupMembers(slug)`（未知 slug 返回 `[]`）。独立于联盟 `MEMBERS`，满足 F-014。见 design §4.3。

### 验收标准
- [ ] 文件独立于 `src/content/members.ts`，不 import `MEMBERS`
- [ ] `getWorkingGroupMembers('cybersecurity')` 返回 `[]`（空态）
- [ ] `getWorkingGroupMembers('unknown')` 返回 `[]`
- [ ] 注释注明「授权后补充，未授权空态占位」

### 涉及文件
- src/content/working-group-members.ts

---

## T-004: 扩展 site.ts 配置 + CORE_MODULES 文案修正 + env [P0] [standard]

- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 4
- **dependencies**: [T-001, T-002]
- **provides**: [src/config/site.ts]
- **consumes**: [src/types/content.ts, src/content/working-groups.ts]
- **must_not_create**: []

### 描述
`src/config/site.ts`：（1）`APPLICATION_TARGETS` 新增 `professional` 条目（`href: process.env.NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL`、`internalHref: '/working-groups/cybersecurity/join'`、`label: '专业用户申请'`、复用降级文案）；（2）`PUBLIC_STATIC_ROUTES` 由 `WORKING_GROUPS` 派生工作组三层子路由并并入（design §6.2）；（3）修正 `CORE_MODULES` 三条误导文案与 path 对齐（design §5）。核对 `.env.example` 含 `NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL`（已存在则保留并补注释）。同步更新既有断言 `tests/unit/site-config.test.ts` 与 `tests/unit/conversion-pages.test.tsx`（移除/改写 professional「已退役」断言，保留 `/professionals` 路由仍不存在）。

### 验收标准
- [ ] `APPLICATION_TARGETS.professional` 存在，`resolveApplicationTarget('professional')` 在 env 缺失时 `isAvailable=false`、非 https 时降级
- [ ] `PUBLIC_STATIC_ROUTES` 含 `/working-groups/cybersecurity`、`.../members`、`.../join`；不含 `/professionals`
- [ ] `CORE_MODULES` 不再含「材料上传」「后台审核流转」「进度管理」；`alliance-application.path === '/join'`
- [ ] `.env.example` 含机构与专业两个表单变量
- [ ] `tests/unit/site-config.test.ts`、`tests/unit/conversion-pages.test.tsx` 更新后通过；无循环依赖，`tsc --noEmit` 通过

### 涉及文件
- src/config/site.ts
- .env.example
- tests/unit/site-config.test.ts
- tests/unit/conversion-pages.test.tsx

---

## T-005: 工作组介绍页 `/working-groups/[slug]/page.tsx` [P0] [standard]

- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-002]
- **provides**: [src/app/(frontend)/working-groups/[slug]/page.tsx]
- **consumes**: [src/content/working-groups.ts, src/types/content.ts]
- **must_not_create**: []

### 描述
新建工作组组织层介绍页。渲染职责/研究方向/负责人/成果；提供指向成员页、加入页、`ecosystemHref`(/cybersecurity 业务专题) 的链接。导出 `generateStaticParams`（全部 slug）+ `export const dynamicParams = false`；body 内 `getWorkingGroupBySlug(slug)` 为空即 `notFound()`。含 `generateMetadata`（canonical `/working-groups/${slug}`、title、description）。复用 `PageHero`/`SectionHeading`/既有样式。范式对齐 `news/[slug]/page.tsx`。覆盖 F-005、F-009(去程链接)、F-011、R-003、R-007、R-009。

### 验收标准
- [ ] `/working-groups/cybersecurity` 展示职责/方向/负责人/成果
- [ ] 页面含通往 members、join、`/cybersecurity`（生态专题）的可见链接
- [ ] `generateStaticParams` 返回全部 slug；`dynamicParams=false`
- [ ] 未知 slug（如 `/working-groups/unknown`）返回 not-found
- [ ] `generateMetadata` 输出 canonical/title/description

### 涉及文件
- src/app/(frontend)/working-groups/[slug]/page.tsx

---

## T-006: 工作组成员页 `/working-groups/[slug]/members/page.tsx` [P0] [standard]

- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-002, T-003]
- **provides**: [src/app/(frontend)/working-groups/[slug]/members/page.tsx]
- **consumes**: [src/content/working-group-members.ts, src/content/working-groups.ts]
- **must_not_create**: []

### 描述
新建工作组成员名单页。读 `getWorkingGroupMembers(slug)`；空数组渲染空态占位（复用 `.empty` 结构，文案「成员名单整理中/授权后发布」）；非空按卡片渲染。`generateStaticParams` + `dynamicParams=false` + 未知 slug `notFound()` + `generateMetadata`。覆盖 F-006、F-014、R-004。

### 验收标准
- [ ] `/working-groups/cybersecurity/members` 空态占位完整可访问、不报错
- [ ] 成员数据来自 `working-group-members.ts`，未 import 联盟 `MEMBERS`（F-014）
- [ ] `generateStaticParams`/`dynamicParams=false`/未知 slug 404
- [ ] `generateMetadata` 输出 canonical/title/description

### 涉及文件
- src/app/(frontend)/working-groups/[slug]/members/page.tsx

---

## T-007: 加入工作组页 `/working-groups/[slug]/join/page.tsx` [P0] [standard]

- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 4
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-002, T-004]
- **provides**: [src/app/(frontend)/working-groups/[slug]/join/page.tsx]
- **consumes**: [src/content/working-groups.ts, src/config/site.ts, src/components/site/external-application-link.tsx]
- **must_not_create**: []

### 描述
新建加入工作组页（面向专业用户）。展示加入价值/路径/说明；用 `ExternalApplicationLink kind="professional"` 提供专业用户飞书表单入口；env 缺失/非 https 时显示降级提示不跳转。`generateStaticParams` + `dynamicParams=false` + 未知 slug `notFound()` + `generateMetadata`。复用 `/join` 页版式。覆盖 F-007、F-008、R-005。

### 验收标准
- [ ] `/working-groups/cybersecurity/join` 含 `kind="professional"` 的申请入口
- [ ] env 配置有效（https）时跳转外链、`target=_blank rel=noreferrer noopener`
- [ ] env 缺失/非 https 时显示不可用降级提示、不跳转（F-008）
- [ ] `generateStaticParams`/`dynamicParams=false`/未知 slug 404 + metadata

### 涉及文件
- src/app/(frontend)/working-groups/[slug]/join/page.tsx

---

## T-008: 总览页链接调整 + 生态专题页互链 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 4
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 2
- **dependencies**: [T-002]
- **provides**: []
- **consumes**: [src/content/working-groups.ts]
- **must_not_create**: [src/app/(frontend)/working-groups/[slug]/page.tsx]

### 描述
（1）`working-groups/page.tsx`：卡片链接由已移除的 `group.href` 改为 `/working-groups/${group.slug}`（指向组织层介绍页），eyebrow 文案区分工作组/重点专项。（2）`cybersecurity/page.tsx`：新增一条返回链接指向 `/working-groups/cybersecurity`（组织介绍），建立 R-007 双向互链。均为修改既有文件（不创建新文件）。覆盖 F-004、F-009(回程互链)、R-007。

### 验收标准
- [ ] `/working-groups` 列出网络安全工作组卡片，点击进入 `/working-groups/cybersecurity`（非直接跳专题页）
- [ ] `/cybersecurity` 专题页含指向 `/working-groups/cybersecurity` 的可见互链
- [ ] `/cybersecurity` 内部丰富内容未被重构（仅加互链）
- [ ] `tsc --noEmit` 通过（`group.href` 已无引用）

### 涉及文件
- src/app/(frontend)/working-groups/page.tsx
- src/app/(frontend)/cybersecurity/page.tsx

---

## T-009: 新增单元测试（Vitest） [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 5
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-004, T-005, T-006, T-007]
- **provides**: [tests/unit/site-core-modules.test.ts]
- **consumes**: [src/config/site.ts, src/content/working-groups.ts, src/content/working-group-members.ts]
- **must_not_create**: [tests/unit/site-config.test.ts, tests/unit/content.test.ts, tests/unit/conversion-pages.test.tsx]

### 描述
新建单元测试文件覆盖新功能：`resolveApplicationTarget('professional')` 可用/降级；`getWorkingGroupBySlug`/`getWorkingGroupSlugs`；`getWorkingGroupMembers` 空态；三路由 `generateStaticParams` 返回全部 slug；`PUBLIC_STATIC_ROUTES` 含工作组子路由；`CORE_MODULES` 不含「材料上传/后台审核/进度管理」；工作组成员与联盟成员数据源分离。**不编辑**既有测试文件（那些改动属 T-002/T-004）。命令：`pnpm run test:unit`。

### 验收标准
- [ ] professional target 在 env 缺失/非 https 时 `isAvailable=false`
- [ ] 覆盖三路由 `generateStaticParams` 输出、空态成员、CORE_MODULES 文案、数据源分离（F-014）
- [ ] `pnpm run test:unit` 全绿

### 涉及文件
- tests/unit/site-core-modules.test.ts

---

## T-010: 新增 E2E 测试（Playwright） [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 5
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-005, T-006, T-007, T-008]
- **provides**: [tests/e2e/working-groups.e2e.spec.ts]
- **consumes**: []
- **must_not_create**: []

### 描述
新建 Playwright E2E 覆盖导航流：`/working-groups` → `/working-groups/cybersecurity`（见职责/方向/负责人/成果 + 三链接）→ members(空态) / join(专业入口) / `/cybersecurity`(生态互链)；未知 slug → 404；`/join` 机构入口；`/alliance`、`/news` 可访问。**不经 rtk 代理运行**（本地代理会使 Playwright 端口检查失效）。命令：`pnpm run test:e2e`。覆盖 F-001~F-011。

### 验收标准
- [ ] 覆盖 F-001,F-002,F-004,F-005,F-006,F-007,F-009,F-010,F-011 关键路径
- [ ] 未知 slug 断言 not-found
- [ ] `pnpm run test:e2e`（原生，不经 rtk 代理）通过

### 涉及文件
- tests/e2e/working-groups.e2e.spec.ts

---

## T-011: 静态导出构建验证（out/ + sitemap） [P0] [standard]

- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 6
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 0
- **dependencies**: [T-004, T-005, T-006, T-007, T-008]
- **provides**: []
- **consumes**: [src/config/site.ts, src/app/(frontend)/working-groups/[slug]/page.tsx, src/app/(frontend)/working-groups/[slug]/members/page.tsx, src/app/(frontend)/working-groups/[slug]/join/page.tsx]
- **must_not_create**: []
- **requires**: []

### 描述
执行静态导出并校验产物。用**原生** `BUILD_TARGET=export NODE_OPTIONS="--max-old-space-size=8000" npx next build`（**不经 rtk 代理**，因 `rtk next build` 可能失败仍报 "Errors: 0"）。校验 `out/working-groups/cybersecurity/index.html`、`out/working-groups/cybersecurity/members/index.html`、`out/working-groups/cybersecurity/join/index.html` 真实生成（trailingSlash 导出为目录 index）；校验 `out/sitemap.xml` 含三条工作组子路由。覆盖 F-012、F-013、R-009。此任务不改代码，仅验证（如构建暴露缺页/缺参需回退对应实现任务修复）。

### 验收标准
- [ ] 原生 `next build`（export）成功，无错误（人工确认非 rtk 掩盖）
- [ ] `out/` 下三层工作组静态页 index.html 均存在（F-012）
- [ ] `out/sitemap.xml` 含 `/working-groups/cybersecurity` 及 members/join 子路由（F-013）
- [ ] 未知 slug 无对应静态页生成（dynamicParams=false 生效）

### 涉及文件
- （验证性任务，无代码产出）

---

## 依赖关系图

```
T-001 (types)
  ├──> T-002 (working-groups data) ──┬──> T-005 (intro page) ─────┐
  │                                   ├──> T-006 (members page) ───┤
  │                                   ├──> T-007 (join page) ──┐   │
  │                                   └──> T-008 (interlink) ───┤   │
  └──> T-003 (wg members data) ──────────> T-006               │   │
                                                                 │   │
  T-004 (site config) ──┬──> T-007 ────────────────────────────┤   │
   (needs T-001,T-002)  └──> T-009 ─────────────────────────────┼───┤
                                                                 │   │
  T-005,T-006,T-007,T-008 ──> T-010 (e2e) ───────────────────────┘   │
  T-004~T-008 ──> T-011 (build verify) ──────────────────────────────┘
```

## 执行计划（并行波次，回退分组）

- **组 1**: T-001
- **组 2**: T-002, T-003（均仅依赖 types，可并行）
- **组 3**: T-004, T-005, T-006（T-006 待 T-003；T-004 待 T-002）
- **组 4**: T-007（待 T-004）, T-008（待 T-002）
- **组 5**: T-009（单元测试）, T-010（E2E）
- **组 6**: T-011（构建验证，最终闸门）

> 实际调度以 provides/consumes 派生边为准，ready 即派发。

## 需求覆盖矩阵

| 需求/功能 | 覆盖任务 |
|-----------|----------|
| R-001 / F-001 | 沿用现有（E2E T-010 回归） |
| R-002 / F-002,F-003 | 沿用 `/join`；T-010 回归 |
| R-003 / F-004,F-005 | T-002, T-005, T-008 |
| R-004 / F-006,F-014 | T-003, T-006, T-009 |
| R-005 / F-007,F-008 | T-001, T-004, T-007 |
| R-006 / F-010 | 沿用；T-010 回归 |
| R-007 / F-005,F-009 | T-005, T-008 |
| R-008 / F-011 | T-002, T-005/6/7（dynamicParams=false + notFound） |
| R-009 / F-012,F-013 | T-004, T-005/6/7（generateStaticParams）, T-011 |

## 风险提示（写入实施注意）

- **generateStaticParams 缺失致缺页**：三层路由每个文件都必须导出，构建后由 T-011 校验 `out/` 产物。
- **`rtk next build` 掩盖失败**：T-011 用原生 `BUILD_TARGET=export npx next build` + 检查 `out/`。
- **Playwright 本地代理端口检查失效**：T-010 不经 rtk 代理运行。
- **professional「退役」断言反转**：T-002/T-004 须同步更新 `content.test.ts`/`site-config.test.ts`/`conversion-pages.test.tsx`，合并确认时向用户点明此历史决策反转。
- **治理边界**：T-002 负责人具名/成果仅填授权信息，成员名单（T-003）保持空态，不虚构。
</content>
