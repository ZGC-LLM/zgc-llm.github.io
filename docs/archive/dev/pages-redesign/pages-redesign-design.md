---
feature: pages-redesign
complexity: complex
source_requirements: docs/dev/pages-redesign/pages-redesign-requirements.md
design_tokens_source: docs/design/prototypes/_design-system.css
---

# 技术设计文档: 全站页面重新设计 (pages-redesign)

> 本文档只定义技术方案与架构决策，不含实现代码。落地由 `task-implementer` 按 `pages-redesign-tasks.md` 执行。
> 权威需求：`docs/dev/pages-redesign/pages-redesign-requirements.md`；token 单一来源：`docs/design/prototypes/_design-system.css`。

## 1. 架构概览

### 1.1 现状与目标

**现状**（当前实现）：
- `src/app/(frontend)/styles.css`：仅 light 主题，`--alliance-*` 前缀 token，无 dark。
- 页面（11 个 `page.tsx`）：以 Tailwind 任意值工具类 `bg-[var(--alliance-*)]` 为主，混用少量语义类（`.site-container`、`.surface-card`、`.button-primary`、`.eyebrow`、`.text-link`）。
- 共享组件：`SiteHeader`/`SiteFooter`/`PageHero`/`SectionHeading`/`SiteNavigationLink`/`ExternalApplicationLink`。
- 无主题/语言切换能力。

**目标**（v2）：
- `styles.css` 承载完整 v2 token（light + dark，字面值展开，无 `{ref}`）+ 从原型 `_design-system.css` 移植的语义组件类层。
- Header 新增主题 toggle（持久化 + SSR 首帧无闪烁）与语言 toggle（本轮仅 UI 占位）。
- 11 个页面重样式，视觉对齐 `docs/design/prototypes/*.html`；不推翻信息架构。
- 网络安全页按 requirements §2 落地新中文文案（厂商中立、仅点名已授权牵头方）。

### 1.2 数据流

```text
layout.tsx (server)
  ├── <head> 内联无闪烁脚本（读取 localStorage / prefers-color-scheme → 设 html[data-theme]）
  ├── styles.css（:root light + html[data-theme="dark"] override + 组件类层）
  ├── SiteHeader (server 壳)
  │     ├── SiteNavigationLink (client, aria-current)
  │     ├── ThemeToggle (client, 读写 localStorage + html[data-theme])
  │     └── LanguageToggle (client, UI 占位)
  ├── {page.tsx} (server, 消费 src/content/*.ts)
  └── SiteFooter (server, 4 列深色)
```

主题状态权威 = `html[data-theme]` 属性；CSS 全部通过 `var(--token)` 消费，切换只改一个属性即整站换肤。内容为静态数据模块（`src/content/*.ts`），无异步加载态（与需求 §5 一致，跳过 loading 态）。

## 2. Design Token 体系落地方案

### 2.1 命名决策：采用原型裸命名为**唯一权威**，保留 `--alliance-*` 兼容别名层

**决策**：`styles.css` 的 `:root` / `html[data-theme="dark"]` 直接照搬 `_design-system.css` 的**裸命名** token（`--brand-primary`、`--bg-page`、`--text-title`、`--border`、`--radius-card`、`--shadow-card` 等），逐字对齐 requirements §4 指定命名空间（`--brand-*`/`--accent*`/`--bg-*`/`--border*`/`--text-*`/`--radius-*`/`--shadow-*`）。

**理由**：
1. token 单一来源 = 原型 `_design-system.css`，裸命名与之逐字一致，杜绝两套命名漂移。
2. requirements §4 明确要求这些命名空间。
3. 原型的组件类层（`.card`/`.btn`/`.page-hero` 等）全部消费裸命名 token，移植即用。

**兼容别名层（关键去风险手段）**：在 `:root` 与 `[data-theme="dark"]` 之外追加一段映射，把旧 `--alliance-*` 定义为对新 token 的引用：
```css
--alliance-brand-primary: var(--brand-primary);
--alliance-bg-hero: var(--bg-hero);
--alliance-text-title: var(--text-title);  /* 等等，覆盖现有页面用到的全部 --alliance-* */
```
因别名指向 `var(--brand-*)`，dark 主题下**自动跟随翻转**——即使某页面尚未从 `bg-[var(--alliance-*)]` 迁到语义类，深色也"免费"生效。这让 11 个页面任务**互不阻塞、可增量迁移**，是最大化并行的核心设计。别名层为过渡态，页面重样式时优先迁到裸 token / 语义类，但不要求一次清空。

### 2.2 组件类层移植

将 `_design-system.css` 的组件类层（第 84-294 行：`.header`/`.nav`/`.btn`/`.page-hero`/`.hero`/`.glass`/`.eyebrow`/`.sec-head`/`.card`/`.grid-2/3/4`/`.split`/`.dir-list`/`.badges`/`.cta-band`/`.band-dark`/`.empty`/`.news`/`.prose`/`.logo-tile`/`.end-cta`/`.notfound`/`.footer` + 响应式断点 + `prefers-reduced-motion`）移植进 `styles.css`。

**与现有类的衔接**：现有 `.site-container`（max 1280px）与原型 `.container`（max 1200px）并存——统一以 requirements §4「容器最大宽 1200px」为准，将 `.site-container` 的 `max-width` 调为 `1200px` 并保留类名（页面已广泛引用），无需重命名。现有 `.button-primary`/`.button-secondary`/`.surface-card`/`.site-nav-link`/`.site-header`/`.site-footer`/`.mobile-menu` 保留并按 v2 token 重写其色值（改为消费裸 token），避免大面积改类名。原型的 `.btn--primary`/`.card` 等作为新增可用类并存，页面按需采用。

**豁免**：`.demo-bar` / `[data-en]/[data-cn]` i18n 显隐规则是原型演示脚手架，本轮**不移植**（本轮不做内容双语切换）。

### 2.3 断点对齐

沿用 requirements §4：900px（三/双列→单列、导航收汉堡）、520px（4/2 列→单列、container padding 收 16px）。现有 header 用 `xl:` (1280px) 断点切换桌面/移动导航——统一改为 900px 语义（用 `styles.css` 媒体查询或 Tailwind `max-[900px]`），与原型一致。

## 3. 主题 Toggle 技术选型

### 3.1 选型：轻量 `data-theme` + 内联脚本 + localStorage（**不引入 next-themes**）

| 维度 | 轻量自研（选中） | next-themes |
|---|---|---|
| 依赖 | 0（项目当前仅 next/react/sharp）| +1 运行时依赖 |
| 机制契合 | 原生 `html[data-theme]`，与原型 `_shell.js`、`styles.css` 完全一致 | 默认 class 策略，需配 `attribute="data-theme"` |
| 无闪烁 | ~15 行内联阻塞脚本，完全可控 | 内置，但对 App Router `data-*` 策略仍需自定义 |
| 控制粒度 | 完全掌握持久化 key / 兜底顺序 | 抽象层，定制成本 |

**决策**：轻量自研。理由：机制与原型/规范同源、零新依赖、SSR 无闪烁实现简单且透明。

### 3.2 SSR 首帧无闪烁实现

在 `layout.tsx` 的 `<html>` 内、`<body>` 之前注入**同步阻塞内联脚本**（`<script dangerouslySetInnerHTML>`），在首帧绘制前设定 `html[data-theme]`：

```text
优先级（首帧）：localStorage['zgcllm-theme'] > prefers-color-scheme > 'light'
```

脚本在 body 渲染前同步执行 → 无 light→dark 闪烁。脚本体极小、无外部依赖、`try/catch` 包裹（隐私模式 localStorage 抛错时降级到 `prefers-color-scheme`）。

**注意 hydration**：`<html lang>` 保持静态，`data-theme` 由脚本在客户端设置——因该属性在 React 接管前已存在于 DOM，且 React 不渲染 `data-theme`（仅 `ThemeToggle` 运行时读写），不产生 hydration mismatch。如需消除 React 对 `html` 属性差异告警，可在 `<html>` 上加 `suppressHydrationWarning`。

### 3.3 ThemeToggle 客户端组件

新增 `src/components/site/theme-toggle.tsx`（`'use client'`）：
- 从 `document.documentElement.dataset.theme` 读当前值渲染日/夜图标（`☀︎`/`☾`）。
- 点击：翻转 `data-theme` + 写 `localStorage['zgcllm-theme']`。
- `aria-label="切换深浅色主题 / Toggle theme"`，`.toggle` 类。
- 首帧用 `useEffect` 同步图标到实际 `data-theme`（避免 SSR 时图标与内联脚本设定不符）；按钮本身 SSR 可渲染，图标态在 mount 后校正。

持久化 key 常量集中定义（`src/config/site.ts` 或组件内常量），供内联脚本与组件共用同一字符串。内联脚本因需在 `layout.tsx` 内联，key 以字符串字面量重复一次并加注释指向常量（脚本不能 import）。

## 4. 语言 Toggle 占位组件设计（UI only）

新增 `src/components/site/language-toggle.tsx`（`'use client'`）：
- 分段控件 `中 / EN`，`.toggle.toggle--seg`，当前段 `.on`。
- `aria-label="切换语言 / Switch language"`。
- 本轮**不接内容切换**：点击时给出"即将支持"反馈（`title`/视觉提示），或切换视觉高亮但不改正文；不设 i18n、不改 `html lang`（保持 `zh-CN`）。
- 明确 `must_not`：不引入 next-intl、不新增 EN 内容字段、不改 `src/content/*`。

## 5. 组件改造清单

| 组件 | 文件 | 变更点 |
|---|---|---|
| **SiteHeader** | `site-header.tsx` | 在 `header__actions`（桌面 + 移动 `<details>` 面板）插入 `<ThemeToggle/>` + `<LanguageToggle/>`；导航断点从 `xl`(1280) 改 900px；保留品牌、主导航、两条转化路径（`专业用户加入`/`申请生态共建`）——site-components 测试断言依赖其存在，不得移除。sticky + 毛玻璃沿用。|
| **SiteFooter** | `site-footer.tsx` | 由当前 2 段式改为 v2 **深色四列**（品牌 / 了解联盟 / 参与 / 更多）+ 底部版权条，消费裸 token；深色下加顶部 1px 描边（`[data-theme="dark"] .footer`）。|
| **PageHero** | `page-hero.tsx` | 深底 + 品牌蓝径向 glow + 细网格 mask（`.page-hero::before/::after`）；eyebrow 深区色（`--accent-soft`）；标题/正文用 inverse token；`actions` 支持 `.btn--primary/.btn--ghost`。|
| **SectionHeading** | `section-heading.tsx` | 消费裸 token；支持 `row-head`（左标题右链接）布局，供首页/成员/新闻区块复用。|
| **SiteNavigationLink** | `site-navigation-link.tsx` | 逻辑不变（`aria-current`）；样式随 `.nav a` v2 更新，无需改组件。|
| **ExternalApplicationLink** | `external-application-link.tsx` | 逻辑（安全外链 / 不可用态）**不变**；仅调用方传入 v2 `.btn` 类名；join 页申请入口不可用时沿用其占位文案。|

## 6. 逐页改造要点（对齐 requirements §2 分页要点）

| 页面 | 文件 | 要点 |
|---|---|---|
| 首页 | `page.tsx` | 双栏 hero + 两张 glass 卡；价值三卡（序号）；方向左标题右双列；深色 CTA band；成员/新闻 **filled + empty** 两态（现已具备，restyle 到 v2）；收尾 CTA 条。|
| 联盟介绍 | `alliance/page.tsx` | 大字宗旨；共同价值三卡；协作机制编号列表（`.dir-list`）；发展方向双卡；联系 CTA。|
| 工作组与专项 | `working-groups/page.tsx` | 已确认专项卡 + 虚线「持续开放协作方向」占位卡（`.empty`/dashed，不虚构未确认信息）。|
| 网络安全生态 | `cybersecurity/page.tsx` | 见 §7（依赖新内容 T-cyber-content）。|
| 成员伙伴 | `members/page.tsx` | 按 `founding/institution/research/ecosystem` 分组目录 + logo tile；empty 态（成员整理中）；仅公开授权成员。|
| 新闻动态 | `news/page.tsx` | 分类标签 + 日期 + 卡片列表；empty 态（即将发布）。|
| 新闻详情 | `news/[slug]/page.tsx` | `.prose` 排版支持 `heading/paragraph/list` 块；发布 `<time>`；返回新闻中心。|
| 机构生态共建 | `join/page.tsx` | 共建价值 / 参与方式 / 参与流程（STEP 01-03）/ FAQ；申请入口不可用显示联系提示（`ExternalApplicationLink`）。|
| 专业用户加入 | `professionals/page.tsx` | 适用人群 / 参与方式 / 参与权益（编号列表）。|
| 隐私说明 | `privacy/page.tsx` | 官网 vs 外部表单边界双卡 + 提交前提示 + 联系。|
| 404 | `not-found.tsx` | 左对齐大字（`.notfound`）+ 返回首页/新闻双按钮。|

通用（每页）：token 一致无硬编码色值；900/520 响应式；light/dark 均对比度 ≥4.5:1；语言 toggle UI 占位；a11y（skip-link / aria-current / toggle aria-label / focus-visible 3px / 语义标签）；header sticky 毛玻璃；footer 深色四列。

## 7. 网络安全页内容结构变更 (`src/content/cybersecurity.ts`)

按 requirements §2 与原型 `cybersecurity.html`（**最新中文文案直接来源**）重写。口径铁律：**厂商中立**、**仅点名已授权牵头方**（智谱 / 清华大学 / 数说安全 / 云起无垠）、受邀企业只用角色描述、**不放具体申请数字 / 个人姓名 / GLM 独家或竞争先发口径**。

**字段变更**：
- 保留 `cycle`（6 段闭环：模型发布→专业验证→场景落地→数据沉淀→模型增强→行业推广）。
- 保留 `summary` / `title`（summary 改为原型 hero 文案）。
- **新增** `resources`（5 卡：模型与算力 / 学术与评测 / 数据与任务 / 专业人才 / 产业场景，各含标题+描述）。
- **新增** `actions`（4 卡：专业用户开放计划 / 生态共建计划 / 深度数据与任务体系 / 先锋验证与发布机制）。
- **新增** `organisation`（6 卡，点名已授权牵头方：联盟统筹 · 智谱模型技术牵引「对不同厂商对等开放」· 清华大学学术指导 · 数说安全 & 云起无垠联合运营 · 生态伙伴共建 · 监管协同）。
- **调整** `contribution` / 参与方式 pill badges（授权脱敏数据 / 真实攻防任务 / 靶场与赛事 / 漏洞环境 / 专家标注与复核 / 新模型测试反馈 / 安全产品接入 / 真实业务场景 / 国产软件与开源安全；**不强制交付原始数据**）。
- **调整** `governanceBoundaries`（深色治理边界 band 3 项：不披露未授权敏感材料且不强制交付原始数据 / 不公开高风险能力与攻击细节 / 数据合规与成果公开需治理评审授权）。
- **调整** `openPrinciples`（开放共建 pill：厂商中立 / 对等参与 / 安全可治理 / 持续演进）。
- **移除** 旧 `roles` + 页面内 `ROLE_DESCRIPTIONS`（被 `organisation` 取代）；旧 `principles` 并入 `openPrinciples`。

**类型影响**（`src/types/content.ts`）：为新结构增补接口（如 `CybersecurityResource`/`CybersecurityAction`/`CybersecurityOrg` 或统一 `{ title; description }` 卡型）。由内容任务统一拥有该文件的本次改动。

**⚠️ 上线前门禁**（写入验收备注，非本轮代码逻辑）：各点名牵头方须确认已获公开授权，未授权者改回角色描述。

## 8. 测试策略

现有测试为**行为/语义导向**（role、aria、文案、外链安全），未耦合 CSS 类名或 `--alliance-*` token —— 故 token 重命名与 restyle **不会**因样式变化破坏单测。受影响项：

- `pnpm typecheck`：全绿（含新增组件、cyber 类型变更）。
- `pnpm lint`：全绿。
- `pnpm test`（vitest 单测）：
  - `site-components.test.tsx`：新增 header toggles 后须保证既有断言（品牌、主导航、两条转化链、`aria-current`）不变；toggle 带 `aria-label` 但不冲突现有 role 查询。
  - `content.test.ts` / cyber 相关单测：随 `cybersecurity.ts` 结构变更**同步更新**（在内容任务内 TDD）。
  - 建议为 `ThemeToggle` 增补单测：默认 aria-label、点击翻转 `data-theme` + 写 localStorage（jsdom）。
- Playwright e2e（`tests/e2e/*`）：`cybersecurity.e2e.spec.ts` 随内容结构调整同步更新；本轮**不新增**独立主题切换 e2e（成本/收益，dark 由单测 + 人工验收覆盖），如需可选加一条 `data-theme` 切换冒烟。

**门禁**：每个代码任务完成须本地 `pnpm typecheck && pnpm lint && pnpm test` 通过；涉及 e2e 契约的（cyber）跑对应 e2e。

## 9. 迁移与风险

- **别名层为过渡**：`--alliance-*` → 裸 token 别名保证增量迁移期不破页；后续可另开 cleanup 移除别名（不在本轮范围）。
- **无闪烁脚本**：唯一 SSR/CSR 交界风险，已用 `suppressHydrationWarning` + mount 后图标校正化解。
- **内容口径**：cyber 文案为敏感项，走 complex 两阶段评审 + 上线前授权门禁，避免点名未授权企业。
- **不做**：完整中英 i18n（next-intl / EN 内容字段）、点名未授权企业、具体数字/姓名、GLM 战略口径——均在 must_not 边界内。
</content>
</invoke>
