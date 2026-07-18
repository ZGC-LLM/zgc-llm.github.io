# 任务清单: 区分「联盟成员伙伴」与「工作组伙伴」

> 对应设计：`member-partner-distinction-design.md`。整体复杂度 standard（各任务标 simple/standard，无 complex）。
> 门禁：所有任务合并后须通过 `pnpm typecheck && pnpm lint && pnpm test && pnpm build`。

## 任务总览

| ID | 任务 | priority | complexity | parallel_group | dependencies |
|----|------|----------|------------|----------------|--------------|
| T-001 | 扩展 `NavigationItem` 类型支持子项 | P0 | simple | 1 | — |
| T-002 | 扩展 `dict.nav` 分组文案（zh/en） | P0 | simple | 1 | — |
| T-003 | `SITE_NAVIGATION`「成员伙伴」改为二级分组 | P0 | simple | 2 | T-001 |
| T-004 | `NavGroup` 组件 + header 桌面/移动分组渲染 | P1 | standard | 3 | T-001, T-002, T-003 |
| T-005 | 成员页术语「联盟成员伙伴」+ 互链工作组 | P1 | standard | 1 | — |
| T-006 | 工作组成员页术语 +互链成员页 | P1 | standard | 1 | — |
| T-007 | 首页体现两类入口 | P1 | standard | 1 | — |

并行分组：group 1（T-001/T-002/T-005/T-006/T-007 无依赖，可并行）→ group 2（T-003）→ group 3（T-004）。T-005/006/007 文案任务彼此无依赖、无文件重叠，可与导航基座任务同批并行。

---

## 任务详情

## T-001: 扩展 `NavigationItem` 类型支持子项 [P0] [simple]

- **priority**: P0
- **complexity**: simple
- **parallel_group**: 1
- **execution**: agent
- **dependencies**: —
- **provides**: [src/types/content.ts]
- **consumes**: []
- **must_not_create**: [src/content/partners.ts, src/types/partner.ts]（不新增第三类内容模型/类型）

### 描述
为 `NavigationItem` 增加可选 `children?: readonly NavigationItem[]`，并将 `href` 放宽为可选，以支持二级分组节点。保持对现有扁平导航项完全向后兼容。这是 T-003/T-004 的前置类型基座。

### 验收标准
- [ ] `src/types/content.ts` 中 `NavigationItem` 含可选 `href?: string`、`label: string`、可选 `children?: readonly NavigationItem[]`
- [ ] 现有引用（`site.ts`、`site-navigation-link.tsx`、`site-header.tsx`）在 `pnpm typecheck` 下零报错
- [ ] 注释写明不变式：叶子有 `href` 无 `children`，分组有 `children` 无 `href`
- [ ] 未新增任何内容数据模型/文件
- [ ] `pnpm typecheck && pnpm lint` 通过

### 涉及文件
- src/types/content.ts

---

## T-002: 扩展 `dict.nav` 分组文案（zh/en） [P0] [simple]

- **priority**: P0
- **complexity**: simple
- **parallel_group**: 1
- **execution**: agent
- **dependencies**: —
- **provides**: [src/i18n/dictionary.ts]
- **consumes**: []
- **must_not_create**: []

### 描述
在 `dict.nav` 新增分组子项文案键：`allianceMembers`（联盟成员 / Alliance Members）、`workingGroupMembers`（工作组成员 / Working Group Members）；保留 `members` 作为分组标题（成员伙伴 / Members）。zh 与 en 必须同步新增，满足既有 key-parity 测试。

### 验收标准
- [ ] `Dictionary['nav']` 接口新增 `allianceMembers`、`workingGroupMembers` 两键
- [ ] zh 与 en 两份字典均补齐新键，值符合术语（zh：联盟成员 / 工作组成员；en：Alliance Members / Working Group Members）
- [ ] `tests/unit/i18n.test.ts`「every locale dictionary shares the same key structure」保持绿（zh/en 同步）
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/i18n/dictionary.ts

---

## T-003: `SITE_NAVIGATION`「成员伙伴」改为二级分组 [P0] [simple]

- **priority**: P0
- **complexity**: simple
- **parallel_group**: 2
- **execution**: agent
- **dependencies**: T-001
- **provides**: [src/config/site.ts]
- **consumes**: [src/types/content.ts]
- **provided_by**: { "src/types/content.ts": "T-001" }
- **must_not_create**: []

### 描述
将 `SITE_NAVIGATION` 中扁平项 `{ href: '/members', label: '成员伙伴' }` 替换为分组节点：`label: '成员伙伴'` + `children: [{ href:'/members', label:'联盟成员' }, { href:'/working-groups', label:'工作组成员' }]`。`PUBLIC_STATIC_ROUTES` 保持不变。同步更新 `tests/unit/site-config.test.ts` 对导航结构的断言。

### 验收标准
- [ ] `SITE_NAVIGATION` 含一个带 `children` 的「成员伙伴」分组节点，子项分别指向 `/members` 与 `/working-groups`
- [ ] 顶层仍保留 `/alliance`、`/working-groups`、`/cybersecurity`、`/news` 四个扁平项
- [ ] `PUBLIC_STATIC_ROUTES` 未改动（仍含 `/members`、`/working-groups`、`/privacy` 等）
- [ ] `tests/unit/site-config.test.ts` 更新为遍历分组结构：断言分组 children 指向 `/members`、`/working-groups`，且叶子目标唯一
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/config/site.ts
- tests/unit/site-config.test.ts

---

## T-004: `NavGroup` 组件 + header 桌面/移动分组渲染 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **parallel_group**: 3
- **execution**: agent
- **dependencies**: T-001, T-002, T-003
- **provides**: [src/components/site/nav-group.tsx]
- **consumes**: [src/types/content.ts, src/i18n/dictionary.ts, src/config/site.ts, src/components/site/site-navigation-link.tsx]
- **provided_by**: { "src/types/content.ts": "T-001", "src/i18n/dictionary.ts": "T-002", "src/config/site.ts": "T-003" }
- **must_not_create**: []

### 描述
**TDD：先写测试**。新增 client 组件 `NavGroup` 渲染二级分组，桌面下拉与移动内联折叠共用（`variant` 区分）；改造 `site-header.tsx` 的 `NavigationLinks` 按节点类型分发（叶子→`SiteNavigationLink`，分组→`NavGroup`），桌面 `<nav>` 与移动 `.mobile-menu__panel` 复用同一渲染。解决标签解析的 href 冲突（子项「工作组成员」复用 `/working-groups` 但需与顶层「工作组」不同标签）：分组标题与子项使用显式 dict 键（`members`/`allianceMembers`/`workingGroupMembers`），叶子沿用 href→dict 键。补充 `styles.css` 下拉/分组样式。

### 验收标准
- [ ] 先落单测 `tests/unit/`（NavGroup）：触发器可键盘聚焦；Enter/Space 展开、Escape 关闭并把焦点归还触发器；点击外部关闭；任一子项路由命中时触发器置 `aria-current="page"`；`variant='mobile'` 内联渲染两个子项链接
- [ ] `NavGroup` 触发器为 `<button aria-expanded aria-controls>`，SSR 首帧收起、`aria-expanded="false"`，纯静态导出无水合告警
- [ ] 桌面主导航渲染「成员伙伴」分组触发器，展开后含「联盟成员」(`/members`)、「工作组成员」(`/working-groups`) 两链接；移动 `.mobile-menu__panel` 同样渲染该分组
- [ ] en locale 下分组标题与子项显示英文（Members / Alliance Members / Working Group Members），不回退中文字面
- [ ] `tests/unit/site-components.test.tsx` 扩展：断言分组触发器与两子项存在；既有「网络安全生态」激活态断言不回归（`/cybersecurity` 下仅该项 `aria-current`）
- [ ] 分组样式加入 `styles.css`（桌面绝对定位下拉、移动内联），复用既有设计 token
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm build` 通过

### 涉及文件
- src/components/site/nav-group.tsx（新增）
- src/components/site/site-header.tsx
- src/components/site/site-navigation-link.tsx（如需复用子项渲染做小调整）
- src/app/(frontend)/styles.css
- tests/unit/site-components.test.tsx
- tests/unit/nav-group.test.tsx（新增，可并入 site-components.test.tsx，二选一）

---

## T-005: 成员页术语「联盟成员伙伴」+ 互链工作组 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **parallel_group**: 1
- **execution**: agent
- **dependencies**: —
- **provides**: [src/components/pages/members-view.tsx]
- **consumes**: []
- **must_not_create**: [src/content/partners.ts]（不新增名单/数据）

### 描述
**TDD：先更新/新增断言**。将成员页术语从「成员伙伴」改为「联盟成员伙伴」（R1），并新增关系说明「部分成员亦参与工作组共建」+ 链接至 `/working-groups`（R2）。zh/en 两套 `STRINGS` 同步；`members/page.tsx` 的 `metadata.title` 同步术语。不改动 `MEMBERS` 名单与 `MemberSummary` 结构。

### 验收标准
- [ ] `members-view.tsx` 的 `heroTitle`（及 eyebrow）zh 呈现「联盟成员伙伴」，en 相应术语；zh/en STRINGS 同步
- [ ] 页面含关系说明文案（含「工作组共建」语义）+ 指向 `/working-groups` 的站内链接（经 `localizePath`），zh/en 均有
- [ ] `src/app/(frontend)/members/page.tsx` 的 `metadata.title` 与新术语一致
- [ ] `tests/unit/news-members-pages.test.tsx` 更新：h1 与 metadata 断言改为「联盟成员伙伴」，新增互链存在断言；空态/名单渲染断言不回归
- [ ] `MEMBERS`、`MemberSummary` 未改动
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/components/pages/members-view.tsx
- src/app/(frontend)/members/page.tsx
- tests/unit/news-members-pages.test.tsx

---

## T-006: 工作组成员页术语 +互链成员页 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **parallel_group**: 1
- **execution**: agent
- **dependencies**: —
- **provides**: [src/app/(frontend)/working-groups/[slug]/members/page.tsx]
- **consumes**: []
- **must_not_create**: [src/content/partners.ts]

### 描述
**TDD：先写测试**。将工作组成员页术语改为「工作组共建伙伴/成员」（R1，含 `pageTitle`/eyebrow/og 后缀），并新增关系说明「名单单位多为联盟会员」+ 链接至 `/members`（R2）。zh/en 两套 `STRINGS` 同步。不改动 `WORKING_GROUP_MEMBERS` 名单与 `WorkingGroupMember` 结构。新增独立单测文件（避免与 T-005 的 `news-members-pages.test.tsx` 写冲突）。

### 验收标准
- [ ] `pageTitle` / eyebrow / `ogTitleSuffix` 体现「工作组共建伙伴/成员」术语，zh/en 同步
- [ ] 页面含关系说明（含「多为联盟会员」语义）+ 指向 `/members` 的站内链接（经 `localizePath`），zh/en 均有
- [ ] 新增 `tests/unit/working-group-members-page.test.tsx`：断言术语与互链（zh 与 en 至少各一路径）、空态渲染不回归
- [ ] `WORKING_GROUP_MEMBERS`、`WorkingGroupMember` 未改动
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/app/(frontend)/working-groups/[slug]/members/page.tsx
- tests/unit/working-group-members-page.test.tsx（新增）

---

## T-007: 首页体现两类入口 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **parallel_group**: 1
- **execution**: agent
- **dependencies**: —
- **provides**: [src/components/pages/home-view.tsx]
- **consumes**: []
- **must_not_create**: [src/content/partners.ts]

### 描述
**TDD：先更新断言**。调整首页成员区块，体现两类身份入口——联盟成员（→ `/members`）与工作组成员（→ `/working-groups`），文案与顶栏分组语义一致（R4）。zh/en 两套 `STRINGS` 同步。不改动 `MEMBERS` 数据。

### 验收标准
- [ ] 首页成员区块呈现两类入口/说明：含指向 `/members` 与 `/working-groups` 的站内链接，措辞与导航「联盟成员 / 工作组成员」一致，zh/en 同步
- [ ] `tests/unit/home-alliance-pages.test.tsx` 更新：既有「查看成员伙伴」→`/members` 断言按新文案调整，新增指向 `/working-groups` 的入口断言；其它首页断言不回归
- [ ] `MEMBERS` 未改动
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/components/pages/home-view.tsx
- tests/unit/home-alliance-pages.test.tsx

---

## 依赖关系图

```
group 1 (并行):  T-001(type)   T-002(dict)   T-005(members)   T-006(wg)   T-007(home)
                   │              │
                   ▼              │
group 2:         T-003(site.ts)   │
                   │              │
                   └──────┬───────┘
                          ▼
group 3:               T-004(NavGroup + header)   ← 依赖 T-001,T-002,T-003
```

- T-005/T-006/T-007 与导航基座（T-001/T-002）同批并行，互不干扰（文件无重叠，各自拥有自己的测试文件）。
- T-003 依赖 T-001（用到新 `children` 字段）。
- T-004 依赖 T-001+T-002+T-003（消费新类型、新 dict 键、新导航结构）。

## 执行计划

1. **首批并行**：T-001、T-002、T-005、T-006、T-007（五个无依赖任务）。
2. **T-001 完成后**：T-003。
3. **T-002+T-003 完成后**：T-004（导航渲染，最后落地并跑一次 `pnpm build` 验证静态导出）。
4. 全部完成后统一门禁：`pnpm typecheck && pnpm lint && pnpm test && pnpm build`。

## 风险评估

| 风险 | 说明 | 缓解 |
|------|------|------|
| 标签 href 冲突 | 子项「工作组成员」复用 `/working-groups`，与顶层「工作组」同 href，纯 href→dict 键映射会取错标签 | T-004 采用「分组标题与子项显式指定 dict 键、叶子按 href」的解析方式（design §3.2） |
| 激活态重叠 | `/working-groups/*` 下顶层「工作组」与「成员伙伴」分组可能同时高亮 | 见 design §9 待确认问题 1；默认接受重叠，若不接受需产品确认子项落点 |
| 既有测试回归 | `news-members-pages.test.tsx`（h1/metadata「成员伙伴」）、`home-alliance-pages.test.tsx`（「查看成员伙伴」）、`site-config.test.ts`（SITE_NAVIGATION 结构）会因文案/结构改动变红 | 各任务在 files 中显式纳入对应测试并同步更新（T-003/T-004/T-005/T-007） |
| 纯静态水合 | `NavGroup` 为 client 组件，SSR 首帧需与客户端一致 | 首帧默认收起、`aria-expanded="false"`；T-004 acceptance 明确要求无水合告警 |
| 术语不一致 | 「成员/伙伴/共建单位」全站措辞需统一 | design §9 待确认问题 2：实施前定稿对外用词 |
