---
feature: pages-redesign
complexity: complex
source_design: docs/dev/pages-redesign/pages-redesign-design.md
---

# 任务清单: 全站页面重新设计 (pages-redesign)

> 依赖策略：优先用显式 `dependencies`；`parallel_group` 仅作兼容回退。文件契约字段（`provides`/`consumes`/`must_not_create`）供调度器派生依赖边与并发 lint。
> 单一权威口径：token 命名/主题机制见 design.md §2-§4；cyber 文案口径见 design.md §7。

## 任务总览

| ID | 任务 | priority | complexity | dependencies | parallel_group |
|---|---|---|---|---|---|
| T-001 | v2 token 双主题 + 组件类层基建（styles.css） | P0 | complex | — | 1 |
| T-002 | 主题 toggle 机制（无闪烁脚本 + ThemeToggle） | P0 | complex | T-001 | 2 |
| T-003 | 语言 toggle 占位组件（UI only） | P1 | standard | T-001 | 2 |
| T-004 | PageHero + SectionHeading 深色变体改造 | P0 | standard | T-001 | 2 |
| T-005 | SiteFooter 深色四列改造 | P1 | standard | T-001 | 2 |
| T-006 | 网络安全页内容与文案重写（cybersecurity.ts） | P0 | complex | — | 1 |
| T-007 | SiteHeader 集成 toggles + 断点对齐 | P0 | standard | T-002, T-003 | 3 |
| T-008 | 首页重样式 | P1 | standard | T-001, T-004 | 3 |
| T-009 | 联盟介绍页重样式 | P1 | standard | T-001, T-004 | 3 |
| T-010 | 工作组与专项页重样式 | P1 | standard | T-001, T-004 | 3 |
| T-011 | 成员伙伴页重样式（分组 + empty） | P1 | standard | T-001, T-004 | 3 |
| T-012 | 新闻列表 + 新闻详情页重样式 | P1 | standard | T-001, T-004 | 3 |
| T-013 | 机构生态共建（join）页重样式 | P1 | standard | T-001, T-004 | 3 |
| T-014 | 专业用户加入（professionals）页重样式 | P1 | standard | T-001, T-004 | 3 |
| T-015 | 隐私说明页重样式 | P1 | standard | T-001, T-004 | 3 |
| T-016 | 404 页重样式 | P2 | simple | T-001 | 3 |
| T-017 | 网络安全页重样式（消费新内容） | P1 | complex | T-001, T-004, T-006 | 3 |

---

## 任务详情

## T-001: v2 token 双主题 + 组件类层基建 [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: 1
- **execution**: agent
- **model**: opus
- **estimated_files**: 1
- **dependencies**: []
- **provides**: [src/app/(frontend)/styles.css]
- **consumes**: []
- **must_not_create**: []
- **injected_skills**: [dev-frontend-standards]

### 描述
重写 `src/app/(frontend)/styles.css`：(a) 照搬 `docs/design/prototypes/_design-system.css` 的裸命名 v2 token 到 `:root`（light）与 `html[data-theme="dark"]`（dark），字面值展开、无 `{ref}`；(b) 追加 `--alliance-*` → 裸 token 的**兼容别名层**（design.md §2.1），置于 `:root` 与 `[data-theme="dark"]` 内使别名随主题翻转；(c) 移植原型组件类层（header/nav/btn/page-hero/hero/glass/eyebrow/sec-head/card/grid/split/dir-list/badges/cta-band/band-dark/empty/news/prose/logo-tile/end-cta/notfound/footer + 900/520 断点 + prefers-reduced-motion）；(d) 保留并按裸 token 重写现有 `.site-container`(max→1200px)/`.button-primary`/`.button-secondary`/`.surface-card`/`.site-nav-link`/`.site-header`/`.site-footer`/`.mobile-menu`；(e) 不移植 `.demo-bar` 与 `[data-cn]/[data-en]` i18n 显隐。保留 `@import 'tailwindcss'`。

### 验收标准
- [ ] `:root` 与 `html[data-theme="dark"]` 含 design-system.md §2 全部色彩 token（裸命名），值与 `_design-system.css` 一致
- [ ] `--alliance-*` 别名层覆盖现有页面/组件引用到的每个旧 token，dark 下自动翻转
- [ ] 原型组件类层已移植且消费裸 token；`.site-container` max-width = 1200px
- [ ] 无脱离 token 的硬编码色值（除 glass/网格等原型内既有 rgba 装饰）
- [ ] `pnpm typecheck && pnpm lint` 通过；现有页面在 light 下视觉不回退

### 涉及文件
- src/app/(frontend)/styles.css

---

## T-002: 主题 toggle 机制（无闪烁脚本 + ThemeToggle） [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: 2
- **execution**: agent
- **model**: opus
- **estimated_files**: 2
- **dependencies**: [T-001]
- **provides**: [src/components/site/theme-toggle.tsx, src/app/(frontend)/layout.tsx]
- **consumes**: [src/app/(frontend)/styles.css]
- **must_not_create**: [src/components/site/language-toggle.tsx, src/components/site/site-header.tsx]
- **injected_skills**: [dev-frontend-standards]

### 描述
实现主题切换（design.md §3）：在 `layout.tsx` 的 `<html>` 内、`<body>` 前注入同步阻塞内联脚本，首帧按 `localStorage['zgcllm-theme'] > prefers-color-scheme > 'light'` 设 `html[data-theme]`（`try/catch` 降级）；`<html>` 加 `suppressHydrationWarning`。新增 `theme-toggle.tsx`（`'use client'`）：读写 `document.documentElement.dataset.theme` + localStorage，图标 `☀︎/☾`，`aria-label="切换深浅色主题 / Toggle theme"`，mount 后校正图标态。持久化 key 常量集中定义（`src/config/site.ts` 或组件常量），内联脚本内以同值字面量重复并注释。不改 header（由 T-007 集成）。

### 验收标准
- [ ] 首帧无 light→dark 闪烁（内联脚本在 body 前同步执行）
- [ ] 无 hydration mismatch 告警
- [ ] ThemeToggle 点击翻转 `html[data-theme]` 并持久化 localStorage；刷新后保持
- [ ] `aria-label` 存在；`focus-visible` 生效
- [ ] 新增 ThemeToggle 单测（默认 aria-label、点击翻转 data-theme + 写 localStorage）
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/components/site/theme-toggle.tsx
- src/app/(frontend)/layout.tsx
- src/config/site.ts（主题存储 key 常量，可选）
- tests/unit/*（ThemeToggle 单测）

---

## T-003: 语言 toggle 占位组件（UI only） [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 2
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-001]
- **provides**: [src/components/site/language-toggle.tsx]
- **consumes**: [src/app/(frontend)/styles.css]
- **must_not_create**: [src/components/site/theme-toggle.tsx, src/components/site/site-header.tsx]
- **injected_skills**: [dev-frontend-standards]

### 描述
新增 `language-toggle.tsx`（`'use client'`）：`中 / EN` 分段控件（`.toggle.toggle--seg`，当前段 `.on`），`aria-label="切换语言 / Switch language"`。本轮仅 UI 占位——点击给出"即将支持"反馈（`title` 或视觉提示），不切换正文、不引入 i18n、不改 `html lang`。

### 验收标准
- [ ] 渲染 中/EN 分段控件，含 `aria-label`
- [ ] 不触发任何内容语言切换、不改 `html lang`、无 next-intl 依赖
- [ ] `focus-visible` 生效
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/components/site/language-toggle.tsx

---

## T-004: PageHero + SectionHeading 深色变体改造 [P0] [standard]

- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 2
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 2
- **dependencies**: [T-001]
- **provides**: [src/components/site/page-hero.tsx, src/components/site/section-heading.tsx]
- **consumes**: [src/app/(frontend)/styles.css]
- **must_not_create**: []
- **injected_skills**: [dev-frontend-standards]

### 描述
按 design.md §5 改造两个共享组件。PageHero：深底 + 品牌蓝径向 glow + 细网格 mask（`.page-hero::before/::after`），eyebrow 用 `--accent-soft`，标题/正文 inverse token，actions 支持 `.btn--primary/.btn--ghost`。SectionHeading：消费裸 token，支持 row-head（左标题右链接）复用形态。保持 props 接口向后兼容（现有页面调用不破坏）。

### 验收标准
- [ ] PageHero 呈现 v2 深色 hero（glow + 网格），light/dark 均正常
- [ ] SectionHeading light/dark 对比度达标，接口向后兼容
- [ ] 现有引用页面编译通过
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/components/site/page-hero.tsx
- src/components/site/section-heading.tsx

---

## T-005: SiteFooter 深色四列改造 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 2
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-001]
- **provides**: [src/components/site/site-footer.tsx]
- **consumes**: [src/app/(frontend)/styles.css]
- **must_not_create**: []
- **injected_skills**: [dev-frontend-standards]

### 描述
将 `site-footer.tsx` 改为 v2 深色四列（品牌 / 了解联盟 / 参与 / 更多）+ 底部版权条，消费裸 token；dark 下加顶部 1px 描边。链接沿用 `SITE_NAVIGATION` 与既有路由，不新增页面。

### 验收标准
- [ ] 深色四列布局，≥900 四列 / <900 收敛（2 列→单列）
- [ ] light/dark 均正常，对比度 ≥4.5:1
- [ ] 版权条动态年份保留
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/components/site/site-footer.tsx

---

## T-006: 网络安全页内容与文案重写（cybersecurity.ts） [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: 1
- **execution**: agent
- **model**: opus
- **estimated_files**: 3
- **dependencies**: []
- **provides**: [src/content/cybersecurity.ts, src/types/content.ts]
- **consumes**: []
- **must_not_create**: [src/app/(frontend)/cybersecurity/page.tsx]
- **injected_skills**: []

### 描述
按 design.md §7 与原型 `docs/design/prototypes/cybersecurity.html`（最新中文文案来源）重写 `src/content/cybersecurity.ts`：保留 `cycle`/`title`/`summary`；新增 `resources`(5)/`actions`(4)/`organisation`(6，点名已授权牵头方)；调整 `contribution` badges 与 `governanceBoundaries`(3)、`openPrinciples`(4)；移除旧 `roles`/`principles`。在 `src/types/content.ts` 增补对应接口。**口径铁律**：厂商中立；仅点名智谱/清华大学/数说安全/云起无垠；受邀企业只用角色描述；不放数字/姓名/GLM 战略口径；不强制交付原始数据。同步更新受影响单测（`content.test.ts` 等）以匹配新结构（TDD）。

### 验收标准
- [ ] 新字段结构完整、类型定义齐备、`as const` 一致
- [ ] 组织机制仅点名 4 家已授权牵头方；其余为角色描述，无具体数字/个人姓名/GLM 独家或竞争口径
- [ ] 参与方式含"不强制交付原始数据"语义
- [ ] 受影响单测已更新并通过
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/content/cybersecurity.ts
- src/types/content.ts
- tests/unit/content.test.ts（及其他受影响单测）

---

## T-007: SiteHeader 集成 toggles + 断点对齐 [P0] [standard]

- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-002, T-003]
- **provides**: [src/components/site/site-header.tsx]
- **consumes**: [src/components/site/theme-toggle.tsx, src/components/site/language-toggle.tsx, src/app/(frontend)/styles.css]
- **must_not_create**: [src/components/site/theme-toggle.tsx, src/components/site/language-toggle.tsx]
- **injected_skills**: [dev-frontend-standards]

### 描述
在 `site-header.tsx` 的桌面 `header__actions` 与移动 `<details>` 面板插入 `<ThemeToggle/>` + `<LanguageToggle/>`；导航桌面/移动切换断点从 `xl`(1280) 改为 900px（对齐 design.md §2.3）。**保留**品牌、主导航（`aria-label="主导航"`、`aria-current`）、两条转化路径（`专业用户加入`/`申请生态共建`）——site-components 单测断言依赖，不得移除。sticky + 毛玻璃沿用。

### 验收标准
- [ ] header 含主题 + 语言 toggle（桌面与移动面板均可用），各带 aria-label
- [ ] 主导航、两条转化链、`aria-current` 保留，`site-components.test.tsx` 通过
- [ ] 导航在 <900 收汉堡；light/dark 均正常
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/components/site/site-header.tsx

---

## T-008: 首页重样式 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-001, T-004]
- **provides**: [src/app/(frontend)/page.tsx]
- **consumes**: [src/app/(frontend)/styles.css, src/components/site/section-heading.tsx]
- **must_not_create**: [src/app/(frontend)/styles.css]
- **injected_skills**: [dev-frontend-standards]

### 描述
按 design.md §6 重样式首页：双栏 hero + 两张 glass 卡；价值三卡（序号）；重点方向左标题右双列；深色 CTA band；成员/新闻 filled + empty 两态（restyle 现有实现）；收尾 CTA 条。仅改样式/结构，不改内容数据来源。

### 验收标准
- [ ] 视觉对齐原型 `index.html`；成员/新闻 filled+empty 两态均正常
- [ ] 900/520 响应式；light/dark 对比度 ≥4.5:1；无硬编码脱 token 色值
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/app/(frontend)/page.tsx

---

## T-009: 联盟介绍页重样式 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-001, T-004]
- **provides**: [src/app/(frontend)/alliance/page.tsx]
- **consumes**: [src/app/(frontend)/styles.css, src/components/site/page-hero.tsx, src/components/site/section-heading.tsx]
- **must_not_create**: [src/app/(frontend)/styles.css]
- **injected_skills**: [dev-frontend-standards]

### 描述
按原型 `alliance.html`：大字宗旨；共同价值三卡；协作机制编号列表（`.dir-list`）；发展方向双卡；联系 CTA。

### 验收标准
- [ ] 视觉对齐原型；编号列表/双卡/CTA 呈现正确
- [ ] 900/520 响应式；light/dark 达标
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/app/(frontend)/alliance/page.tsx

---

## T-010: 工作组与专项页重样式 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-001, T-004]
- **provides**: [src/app/(frontend)/working-groups/page.tsx]
- **consumes**: [src/app/(frontend)/styles.css, src/components/site/page-hero.tsx, src/components/site/section-heading.tsx]
- **must_not_create**: [src/app/(frontend)/styles.css]
- **injected_skills**: [dev-frontend-standards]

### 描述
按原型 `working-groups.html`：已确认专项卡 + 虚线「持续开放协作方向」占位卡（`.empty`/dashed），不虚构未确认信息。

### 验收标准
- [ ] 已确认专项卡与虚线占位卡呈现正确，无虚构信息
- [ ] 900/520 响应式；light/dark 达标
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/app/(frontend)/working-groups/page.tsx

---

## T-011: 成员伙伴页重样式（分组 + empty） [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-001, T-004]
- **provides**: [src/app/(frontend)/members/page.tsx]
- **consumes**: [src/app/(frontend)/styles.css, src/components/site/page-hero.tsx, src/components/site/section-heading.tsx]
- **must_not_create**: [src/app/(frontend)/styles.css]
- **injected_skills**: [dev-frontend-standards]

### 描述
按原型 `members.html`：按 `founding/institution/research/ecosystem` 分组目录 + logo tile（`.logo-tile`）；empty 态（成员整理中）；仅展示公开授权成员。

### 验收标准
- [ ] 分组目录 + logo tile 呈现；MEMBERS 为空时 empty 态正常
- [ ] 900/520 响应式；light/dark 达标
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/app/(frontend)/members/page.tsx

---

## T-012: 新闻列表 + 新闻详情页重样式 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 2
- **dependencies**: [T-001, T-004]
- **provides**: [src/app/(frontend)/news/page.tsx, src/app/(frontend)/news/[slug]/page.tsx]
- **consumes**: [src/app/(frontend)/styles.css, src/components/site/page-hero.tsx, src/components/site/section-heading.tsx]
- **must_not_create**: [src/app/(frontend)/styles.css]
- **injected_skills**: [dev-frontend-standards]

### 描述
按原型 `news.html` / `news-detail.html`：列表页分类标签 + 日期 + 卡片列表 + empty 态（即将发布）；详情页 `.prose` 排版支持 `heading/paragraph/list` 块、发布 `<time>`、返回新闻中心。

### 验收标准
- [ ] 列表 filled + empty 两态；详情三种块类型排版正确、含 `<time>` 与返回链接
- [ ] 900/520 响应式；light/dark 达标
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/app/(frontend)/news/page.tsx
- src/app/(frontend)/news/[slug]/page.tsx

---

## T-013: 机构生态共建（join）页重样式 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-001, T-004]
- **provides**: [src/app/(frontend)/join/page.tsx]
- **consumes**: [src/app/(frontend)/styles.css, src/components/site/page-hero.tsx, src/components/site/section-heading.tsx, src/components/site/external-application-link.tsx]
- **must_not_create**: [src/app/(frontend)/styles.css, src/components/site/external-application-link.tsx]
- **injected_skills**: [dev-frontend-standards]

### 描述
按原型 `join.html`：共建价值 / 参与方式 / 参与流程（STEP 01-03）/ FAQ 四段；申请入口不可用时沿用 `ExternalApplicationLink` 的联系提示逻辑（不改其逻辑）。

### 验收标准
- [ ] 四段结构呈现；申请入口不可用时显示联系提示
- [ ] 900/520 响应式；light/dark 达标
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/app/(frontend)/join/page.tsx

---

## T-014: 专业用户加入（professionals）页重样式 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-001, T-004]
- **provides**: [src/app/(frontend)/professionals/page.tsx]
- **consumes**: [src/app/(frontend)/styles.css, src/components/site/page-hero.tsx, src/components/site/section-heading.tsx, src/components/site/external-application-link.tsx]
- **must_not_create**: [src/app/(frontend)/styles.css]
- **injected_skills**: [dev-frontend-standards]

### 描述
按原型 `professionals.html`：适用人群 / 参与方式 / 参与权益（编号列表 `.dir-list`）。

### 验收标准
- [ ] 三段结构与编号权益列表呈现正确
- [ ] 900/520 响应式；light/dark 达标
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/app/(frontend)/professionals/page.tsx

---

## T-015: 隐私说明页重样式 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-001, T-004]
- **provides**: [src/app/(frontend)/privacy/page.tsx]
- **consumes**: [src/app/(frontend)/styles.css, src/components/site/page-hero.tsx]
- **must_not_create**: [src/app/(frontend)/styles.css]
- **injected_skills**: [dev-frontend-standards]

### 描述
按原型 `privacy.html`：官网 vs 外部表单边界双卡 + 提交前提示 + 联系。可用 `.prose` 或双卡布局。

### 验收标准
- [ ] 边界双卡 + 提交前提示 + 联系呈现
- [ ] 900/520 响应式；light/dark 达标
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/app/(frontend)/privacy/page.tsx

---

## T-016: 404 页重样式 [P2] [simple]

- **priority**: P2
- **complexity**: simple
- **review_strategy**: self
- **parallel_group**: 3
- **execution**: agent
- **model**: haiku
- **estimated_files**: 1
- **dependencies**: [T-001]
- **provides**: [src/app/(frontend)/not-found.tsx]
- **consumes**: [src/app/(frontend)/styles.css]
- **must_not_create**: [src/app/(frontend)/styles.css]
- **injected_skills**: [dev-frontend-standards]

### 描述
按原型 `404.html`：左对齐大字（`.notfound`）+ 返回首页 / 返回新闻双按钮。

### 验收标准
- [ ] 左对齐大字 + 双按钮；light/dark 达标
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过

### 涉及文件
- src/app/(frontend)/not-found.tsx

---

## T-017: 网络安全页重样式（消费新内容） [P1] [complex]

- **priority**: P1
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: 3
- **execution**: agent
- **model**: opus
- **estimated_files**: 2
- **dependencies**: [T-001, T-004, T-006]
- **provides**: [src/app/(frontend)/cybersecurity/page.tsx]
- **consumes**: [src/content/cybersecurity.ts, src/app/(frontend)/styles.css, src/components/site/page-hero.tsx, src/components/site/section-heading.tsx]
- **must_not_create**: [src/content/cybersecurity.ts, src/app/(frontend)/styles.css]
- **injected_skills**: [dev-frontend-standards]

### 描述
按原型 `cybersecurity.html` 与 design.md §7 重写 `cybersecurity/page.tsx`，消费 T-006 的新内容结构：Hero → 生态闭环（6 段网格）→ 五类关键资源（5 卡）→ 四项重点行动（4 卡）→ 参与方式（pill badges）→ 组织机制（6 卡，点名已授权牵头方）→ 深色治理边界 band → 开放共建 pill + 双 CTA。移除旧 `ROLE_DESCRIPTIONS` 映射（改用 `organisation`）。同步更新 `cybersecurity` 相关单测与 e2e（`tests/e2e/cybersecurity.e2e.spec.ts`）。

### 验收标准
- [ ] 全部分段按原型呈现，消费新内容字段无残留旧 `roles` 逻辑
- [ ] 文案口径厂商中立、仅点名 4 家授权牵头方、无数字/姓名/GLM 战略口径
- [ ] 深色治理边界 band 与 pill/双 CTA 正常；900/520 响应式；light/dark 达标
- [ ] cyber 单测与 e2e 已更新并通过
- [ ] `pnpm typecheck && pnpm lint && pnpm test` 通过（涉 e2e 契约的跑对应 e2e）

### 涉及文件
- src/app/(frontend)/cybersecurity/page.tsx
- tests/unit/*（cyber 相关）
- tests/e2e/cybersecurity.e2e.spec.ts

---

## 依赖关系图

```
组 1（无依赖，可并行起跑）
  T-001 styles.css 基建 ──┐
  T-006 cyber 内容    ──┐ │
                        │ │
组 2（依赖 T-001）       │ │
  T-002 主题机制 ◄───────┘ │
  T-003 语言 toggle ◄──────┤
  T-004 Hero/SectionHeading ◄─┤
  T-005 Footer ◄──────────┘
                        │
组 3（页面/集成）
  T-007 Header ◄── T-002, T-003
  T-008..T-016 各页面 ◄── T-001 (+ T-004)
  T-017 cyber 页 ◄── T-001, T-004, T-006
```

关键路径：T-001 → T-004 → 页面任务；T-001 → T-002/T-003 → T-007。T-006 与 T-001 可完全并行。页面级任务（T-008~T-016）彼此**无依赖、可全部并行**，仅等 T-001+T-004。

## 执行计划

- **wave A**（并行）：T-001、T-006。
- **wave B**（T-001 就绪后并行）：T-002、T-003、T-004、T-005。
- **wave C**（就绪即派发，ready-queue 自认领）：T-007（等 T-002+T-003）、T-008~T-016（等 T-001+T-004，T-016 仅等 T-001）、T-017（等 T-001+T-004+T-006）。
- 建议 `--parallel`（任务数 17 ≥ 3 自动并行）。P0 优先：T-001/T-002/T-004/T-006/T-007。

## 风险评估

| 风险 | 等级 | 缓解 |
|---|---|---|
| SSR 主题闪烁 / hydration mismatch | 中 | 内联阻塞脚本 + `suppressHydrationWarning` + mount 后图标校正（T-002 两阶段评审）|
| cyber 文案点名未授权企业 | 高 | 口径铁律写入验收；complex 两阶段评审；上线前授权门禁（design.md §7）|
| `--alliance-*` 别名遗漏致某页 dark 破色 | 中 | T-001 别名层须覆盖现有全部旧 token 引用；页面任务验收含 dark 对比度检查 |
| 页面任务并发改共享文件冲突 | 低 | 每页 `provides` 独立 `page.tsx`；`must_not_create` 锁 styles.css/组件文件，单一 owner |
| header 集成破坏既有单测 | 低 | T-007 验收明确保留品牌/主导航/两转化链/aria-current |
</content>
