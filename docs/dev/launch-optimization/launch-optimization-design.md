---
feature: launch-optimization
type: design
generated_by: architect-planner
generated_at: 2026-07-18T00:00:00+08:00
version: 1
based_on:
  - launch-optimization-requirements.md
  - launch-optimization-report.md
complexity: complex
---

# 技术设计文档：上线优化版本（i18n + 内容录入机制 + SEO/性能收尾）

> 本设计只做架构决策与落点，不含业务实现代码。二进制资产优化（logo 压缩）、
> 测试改写等实际动作由 task-implementer 依 tasks.md 执行。

---

## 0. 待确认决策（请用户拍板，已给推荐默认值）

> 以下两项影响面广、成本高，设计已按「推荐默认值」展开；若用户改选，需回退相应任务。

### D1. 默认语言是否留中文在根路径（不加前缀）

- **推荐（默认）**：`zh` 默认、留在根路径（`/`、`/alliance` … 一律不变）；`en` 置于 `/en/*`。
- 备选：中英都加前缀（`/zh/*` + `/en/*`），根路径 301/跳转到 `/zh/`。
- **推荐理由**：
  - 现有中文 URL、`sitemap`、`canonical`、外链、`PUBLIC_STATIC_ROUTES`、全部 e2e `page.goto('/alliance')` 断言**零变更**——这是本轮最大的稳定性收益。
  - 静态导出（`output: export`）**无服务端**，根路径 `/` → `/zh/` 的 301 需要中间件/服务端，硬约束禁止；若中英都加前缀，只能靠 `/index.html` 里放 `<meta http-equiv=refresh>` 或 JS 跳转，既伤 SEO 又伤首屏。留中文在根路径可完全规避。
  - 面向用户以中文访客为主（CJK 优先字体栈、全站中文权威内容），根路径给中文符合主访问群体。
- **备选代价**：中英都加前缀会破坏所有现有 URL 断言与外链，且触发上面的根路径跳转难题——不推荐。

### D2. 联盟全称等专有名词的英文译名

- **推荐（默认）**：本轮英文文案按**通用译法出初稿**，全部标注「待人工校对」；专有名词（联盟全称、成员单位名、工作组名）**优先保留官方中文或沿用已公开的官方英文**，无官方英文时给通用译法并显式打 `enDraft` 标记，交联盟终审。
- 备选：等待联盟提供官方指定英文译名后再填。
- **推荐理由**：R1.3 明确本轮英文为初稿、不承诺终审质量；阻塞在译名上会拖垮整个 i18n 交付。用 `enDraft` 标记 + 覆盖度测试（见 §4.3）让「哪些还没人工校对」在 CI 可见即可。

---

## 1. 架构概览

### 1.1 现状关键事实（约束设计的既有结构）

- **路由**：所有页面在 `src/app/(frontend)/` 路由组下；该组的 `layout.tsx` 渲染 `<html lang="zh-CN">`/`<body>`，**是事实上的根布局**（`src/app/layout.tsx` 不存在）。这使「多根布局」模式可用（见 §2.1）。
- **元数据**：静态页用 `export const metadata`；动态页 `news/[slug]`、`working-groups/[slug]` 用 `generateMetadata` + `generateStaticParams`，`dynamicParams = false`（未知 slug 404）。
- **内容**：`src/content/*.ts` 导出类型化中文常量（纯字符串），无 locale 维度；页面直接 `import { MEMBERS }` 等消费。
- **导航/站名**：`SITE_NAVIGATION`、`SITE_NAME` 在 `src/config/site.ts`，硬编码中文。
- **双部署**：`next.config.ts` 按 `BUILD_TARGET` 切 `export`/`standalone`，`trailingSlash`/`images.unoptimized` 仅在 export 生效。
- **测试耦合**：e2e 用 `page.goto('/')`、`/alliance` 等相对 baseURL 的绝对路径；unit 直接 import content/config 断言中文字符串、`sitemap` 含 `PUBLIC_STATIC_ROUTES`、`language-toggle` 断言「即将支持」。

### 1.2 目标架构（一句话）

**保留 `(frontend)` 中文子树不动（根路径），新增 `(en)/en/*` 英文子树（各自独立根布局），两套路由都是极薄壳、渲染同一套 locale 参数化的页面视图组件；内容层升级为 `Localized<T>` + locale 感知访问器，中文权威、英文缺失回退中文。**

### 1.3 系统结构图

```
src/app/
├── (frontend)/                 # 中文子树 —— URL 根路径，现有 URL 零变更
│   ├── layout.tsx              # 根布局①：<html lang="zh-CN"> + <SiteChrome locale="zh">
│   ├── page.tsx                # → <HomeView locale="zh" />（薄壳）
│   ├── alliance/page.tsx       # → <AllianceView locale="zh" />
│   ├── news/[slug]/page.tsx    # generateStaticParams(zh) + <NewsDetailView locale="zh">
│   └── … 其余静态/动态页（薄壳，全部 locale="zh"）
│
├── (en)/                       # 英文子树 —— 独立根布局（多根布局模式）
│   └── en/
│       ├── layout.tsx          # 根布局②：<html lang="en"> + <SiteChrome locale="en">
│       ├── page.tsx            # → <HomeView locale="en" />
│       ├── alliance/page.tsx   # → <AllianceView locale="en" />
│       ├── news/[slug]/page.tsx# generateStaticParams(en) + <NewsDetailView locale="en">
│       └── … 与中文子树一一对应的薄壳
│
├── (frontend)/sitemap.ts       # 升级：双语条目 + alternates
├── robots.ts                   # 不变（与 locale 无关）
└── global-not-found.tsx        # 保持

src/i18n/                       # 新增：i18n 基础设施
├── locales.ts                 # Locale 类型、locales、DEFAULT_LOCALE、类型守卫
├── localized.ts               # Localized<T> 类型 + resolve(localized, locale) 回退器
├── dictionary.ts              # UI chrome 字典（导航/按钮/空态/页脚 …）zh/en
└── routing.ts                 # 路由↔URL 映射：pathFor(pageKey, locale)、buildAlternates(pageKey)

src/components/pages/           # 新增：locale 参数化的页面视图（承载原页面 JSX）
├── home-view.tsx  alliance-view.tsx  news-detail-view.tsx  …

src/content/                    # 升级：字段 Localized 化 + getXxx(locale) 访问器
src/lib/content-validation.ts   # 新增：录入校验（R2）
```

### 1.4 数据流

```
请求 /en/alliance
  → (en)/en/alliance/page.tsx（薄壳，locale="en"）
    → <AllianceView locale="en" />
      → getAllianceContent("en")   // 内容层：Localized 解析，en 缺失回退 zh
      → dict("en")                 // UI chrome 字典
      → buildAlternates("alliance")// 元数据：canonical=/en/alliance，hreflang zh/en/x-default
  → 构建期由 generateStaticParams/静态段全量预渲染为 out/en/alliance/index.html
```

中英差异**只在数据边界（content 访问器 + 字典）解析**，视图组件、SEO 助手、路由映射全部 locale 无关地复用——这是「避免页面逻辑重复」的核心机制。

---

## 2. 组件设计

### 2.1 路由方案选型（最关键决策）

**硬约束**：Next 16 App Router + `output: export`，禁用内置 `i18n` 配置、禁用中间件（无服务端、无运行时重定向/rewrite）。

| 方案 | 描述 | 是否满足「zh 根路径零变更」 | 结论 |
|------|------|--------------------------|------|
| **A. 单 `[locale]` 动态段** | 全站移入 `(frontend)/[locale]/*`，`generateStaticParams` 返回 `['zh','en']` | ❌ zh 会落到 `/zh/alliance`，要回根路径必须 rewrite `/zh`→`/`，静态导出做不到 | **否决** |
| **B（选定）. 根路径不变 + 平行 `/en` 静态子树** | 保留 `(frontend)` 中文树在根路径；新增 `(en)/en/*` 英文树，各自独立根布局；两树渲染同一批 locale 参数化视图 | ✅ 中文树物理路径不变 | **采用** |

**为什么 B 同时满足四条约束**：

1. **现有中文 URL 零变更**：`(frontend)` 目录结构原样保留，`/`、`/alliance`、`/news/[slug]` 物理路径不动 → sitemap/canonical/外链/e2e `goto` 断言全部稳定。
2. **避免页面逻辑重复**：页面 JSX 抽到 `src/components/pages/*View`，接收 `locale` 参数；zh/en 两套路由文件只是 3~5 行薄壳（`export default () => <XxxView locale="zh|en"/>`）。逻辑单一来源。
3. **动态路由 × locale 全量预渲染**：`news/[slug]`、`working-groups/[slug]`（及其 `members`/`join` 子路由）在**两棵树各自**保留 `generateStaticParams`（返回该 locale 下的 slug 集合）、`dynamicParams=false`。中文树 params 与现状完全一致；英文树独立生成——组合在构建期展开为具体静态页，无运行时依赖。
4. **双部署形态都成立**：全部是构建期静态路由 + 视图渲染，无中间件/SSR-only 特性 → `BUILD_TARGET=export` 产出 zh+en 全量 HTML；`standalone` 同样正常（只是多了服务端能力，不影响路由）。

> **与 R1.1「用 `[locale]` 段」的关系（有意的、已授权的偏离）**：R1.1 字面要求 `[locale]` 段，但它与「zh 留根路径、URL 不变」在静态导出下**不可兼得**（方案 A 已证否）。发起方已确认「根路径保持不变」为选定方向，故采用静态 `/en` 段替代动态 `[locale]` 段。R1.1 的**实质意图**——「全部 locale×route 组合在构建期预定式预渲染」——仍由两树各自的 `generateStaticParams` + 静态段完整满足。英文段用**静态 `en` 文件夹**而非动态 `[locale]`，因为本轮恰好 2 语言且 zh 已钉在根，静态段更简单、更安全（无 `dynamicParams` 误配风险）、导出更可控。

**`<html lang>` 正确性 —— 多根布局**：App Router 中只有根布局能渲染 `<html>`/`<body>`；单一 `(frontend)` 布局无法为 `/en/*` 静态切换 `lang`。由于 `src/app/layout.tsx` 不存在、`(frontend)/layout.tsx` 已是事实根布局，可用 **多根布局** 模式：新增 `(en)` 路由组自带根布局，渲染 `<html lang="en">`。两个布局仅 `lang` 与传入 chrome 的 `locale` 不同，公共部分抽到 `<SiteChrome locale>`（页头/页脚/skip-link/主题脚本/JSON-LD），零逻辑重复。

### 2.2 新增组件

| 组件 | 落点 | 职责 |
|------|------|------|
| `SiteChrome` | `src/components/site/site-chrome.tsx` | 承载 skip-link + `SiteHeader` + `{children}` + `SiteFooter` + 主题脚本 + 站级 JSON-LD；接收 `locale`。两个根布局共用 |
| `*View` 页面视图 | `src/components/pages/*-view.tsx` | 原各页 JSX，改为从 `getXxx(locale)` + `dict(locale)` 取数；locale 无关地渲染 |
| `JsonLd` | `src/components/site/json-ld.tsx` | 渲染 `<script type="application/ld+json">`（`dangerouslySetInnerHTML`，`JSON.stringify` 转义）；服务端组件 |
| i18n 基础设施 | `src/i18n/*` | `Locale`/`locales`/`DEFAULT_LOCALE`、`Localized<T>`+`resolve`、`dictionary`、`routing`（`pathFor`/`buildAlternates`）|
| 内容校验 | `src/lib/content-validation.ts` | 集中式录入校验（R2），供单测调用 |

### 2.3 修改组件

| 组件 | 改动 | 影响 |
|------|------|------|
| `(frontend)/layout.tsx` | 委托给 `<SiteChrome locale="zh">`；`<html lang="zh-CN">` 保留；注入站级 JSON-LD | 中文根布局 |
| `src/components/site/site-header.tsx` | 导航标签、按钮文案来自 `dict(locale)`；接收 `locale`；logo `src` 指向优化后资产 | 页头双语 |
| `src/components/site/site-footer.tsx` | 文案来自 `dict(locale)` | 页脚双语 |
| `src/components/site/language-toggle.tsx` | 移除「即将支持」占位；改为基于 `usePathname()` 计算对侧 locale 同页 URL（见 §3.4）| **破坏 language-toggle.test.tsx** |
| `src/config/site.ts` | `SITE_NAVIGATION` 标签 Localized 化（或迁入字典）；新增 en 站名/描述常量 | 全站导航/元数据 |
| `src/content/*.ts` | 字段 `Localized<T>` 化 + 导出 `getXxx(locale)` 访问器（zh 权威、en 回退） | **content 全量 + 页面读取点** |
| `src/types/content.ts` | 字符串字段改 `LocalizedText`；新增 `Locale`/`Localized` 关联类型 | 类型层，波及全站 |
| `(frontend)/sitemap.ts` | 双语条目 + 每条 `alternates.languages` | SEO |
| 各 `*/page.tsx`（zh 树） | 改为薄壳，`export default () => <XxxView locale="zh"/>`；metadata 用 `buildAlternates` | 全部页面 |
| `styles.css` | `--font-sans` 移除 `'Inter'`（见 §5.3）| 字体一致性 |

---

## 3. 接口设计

### 3.1 i18n 基础接口（内部）

```ts
// src/i18n/locales.ts
export type Locale = 'zh' | 'en'
export const LOCALES: readonly Locale[] = ['zh', 'en']
export const DEFAULT_LOCALE: Locale = 'zh'
export function isLocale(v: string): v is Locale

// src/i18n/localized.ts —— 双语字段与回退
export interface LocalizedText { zh: string; en?: string; enDraft?: boolean }
export type Localized<T> = { zh: T; en?: T }
export function resolve<T>(value: Localized<T>, locale: Locale): T   // en 缺失 → zh
export function isUntranslated(value: LocalizedText): boolean        // en 缺失或 enDraft

// src/i18n/dictionary.ts —— UI chrome 文案
export function dict(locale: Locale): Dictionary   // 导航、按钮、空态、页脚、aria-label …

// src/i18n/routing.ts —— 路由↔URL 单一来源
export function pathFor(pageKey: string, locale: Locale): string     // zh→'/x'，en→'/en/x'
export function buildAlternates(pageKey: string): Metadata['alternates']
//   → { canonical, languages: { 'zh-CN', 'en', 'x-default'(=zh) } }（按当前页 locale 定 canonical）
```

### 3.2 内容访问器（内部，替代直接 import）

```ts
// 例：src/content/members.ts
export function getMembers(locale: Locale): readonly ResolvedMember[]   // 已解析为纯字符串
// news / working-groups / home / alliance / cybersecurity 同构：getXxx(locale)
// 动态路由 slug 集合与 locale 无关（slug 保持中文源一致）：
export function getPublishedNews(locale?: Locale): readonly ResolvedNewsEntry[]
```

> **回退策略（唯一来源）**：所有 en 字段缺失 → 回退 zh（`resolve`）。视图永远拿到纯字符串，不感知回退，页面 JSX 改动最小（`import { MEMBERS }` → `getMembers(locale)`）。

### 3.3 结构化数据（R3.1）

```ts
// 站级（两根布局，locale 感知 name/url/inLanguage）
Organization: { '@type':'Organization', name, url, logo, sameAs? }
WebSite:      { '@type':'WebSite', name, url, inLanguage }
// 新闻详情（news/[slug]）
Article:      { '@type':'Article', headline, datePublished, inLanguage, mainEntityOfPage, publisher(Organization) }
```
注入方式：App Router 服务端组件渲染 `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}/>`（与现有主题脚本同机制，静态导出兼容）。

### 3.4 语言切换（R1 交互）

`LanguageToggle`（client）用 `usePathname()`：
- 当前 `/en/...` → 目标 = 去掉 `/en` 前缀（回中文根）
- 当前非 `/en` → 目标 = 前缀 `/en`
- 边界：`/` ↔ `/en`；`trailingSlash`（export）下统一 `next/link` 相对跳转，尾斜杠由框架规整。
- 语义：切到「对应语言的同一页面」。移除 `即将支持` 与 `setShowHint`。

---

## 4. 数据设计

### 4.1 双语内容模型（R1.2）

- **策略**：字段层 `LocalizedText`/`Localized<T>`，**中文必填权威**、英文可选、缺失回退中文。
- **向后兼容迁移路径（最小侵入）**：
  1. 先加 `Locale`/`Localized`/`resolve` 与各 `getXxx(locale)` 访问器；访问器内部先把现有中文常量包装成 `{ zh: <原值> }`（`en` 暂空）——此步**页面不动、测试全绿**（getXxx('zh') 等价原数据）。
  2. 再把页面 `import 常量` 逐个换成 `getXxx(locale)`。
  3. 最后回填 `en` 字段（T-109 初稿翻译）。
- 保留既有治理语义字段（`named` 授权标志、`published`、`type` 等）不变。

### 4.2 英文初稿占位（R1.3）

- en 字段可缺省（回退）或填初稿；初稿标 `enDraft: true`。
- 「待人工校对」在**代码注释 + `enDraft` 数据标记 + 覆盖度测试**三处可见，CI 可枚举未校对项。

### 4.3 录入校验（R2.1 / R2.2）

`content-validation.ts` 暴露 `validateAllContent(): ValidationIssue[]`，单测（`content-validation.test.ts`）断言零 issue，规则：
- 必填非空：中文权威字段（name/title/description/slug/date …）非空。
- 授权门：`named=false` 时禁具名（角色化占位）；具名单位需 `named=true`。
- 唯一性：news `slug`、working-group `slug`、member `id`、working-group-member `id` 全局唯一。
- 安全：`ctaHref`/外链 `logo` 为 https（复用 `isSafeExternalUrl`）。
- 双语覆盖度：枚举 `en` 缺失/`enDraft` 字段，**不判失败**（本轮初稿允许），仅输出清单供人工校对。
- 日期格式：news `date` 为 `YYYY-MM-DD`。

### 4.4 存储方案

无数据库；全部编译期 TS 常量 + 构建期静态导出。不变。

---

## 5. 技术选型 / P0·P1 收尾（R3）

### 5.1 JSON-LD（R3.1，P0/P1）

- `Organization` + `WebSite` 放两根布局的 `SiteChrome` → 全站生效；`Article` 放 `news/[slug]`。
- 用 `JsonLd` 服务端组件；数据由 `src/i18n` 站名/URL + content 派生。可选 `BreadcrumbList`（P1，二级页）列为独立子任务，不阻塞。

### 5.2 logo 优化（R3.2，P1）

- `public/brand/llm-alliance-logo.png` 644K → 目标 <100K。方案：转 WebP 或缩放到展示尺寸 2×（页头 40×40 → 源 ~80×80，可再留一档高清），保留 `alt`/`aria-hidden` 语义。
- ⚠️ 需图像工具（sharp/squoosh/pngquant/cwebp）——属实施动作，由 task-implementer 执行；本设计只定目标与验收（<100K 且页头渲染正常、Lighthouse 无回退）。
- 更新 `site-header.tsx` 及任何引用处 `src`；若转 WebP 注意 `next/image` 在 `images.unoptimized` 下原样下发。

### 5.3 字体栈修正（R3.3，P1）—— 二选一，给建议

- **推荐：从 `--font-sans` 删除 `'Inter'`**（`styles.css:45-47`）。理由：单行改动、零新增网络负载、消除「声明却从不加载」的隐性不一致；主访问群体为中文，CJK 字体栈（PingFang/YaHei）才是关键，Latin 回退 `ui-sans-serif/system-ui` 已足够；上线性能敏感期不宜新增 webfont 下载。
- 备选：`next/font` 自托管 Inter（若品牌明确要 Latin Inter 观感）——需引入字体子集与 `--font-sans` 变量绑定，成本更高。
- **建议默认删除 Inter**；如品牌坚持保留观感再切自托管。

---

## 6. 安全考量

- 无新增用户输入/后端；JSON-LD 数据来自内部常量，`JSON.stringify` 转义，注入面可控。
- 外链（`ctaHref`、外部 logo）沿用 `isSafeExternalUrl`（仅 https）；校验模块强制。
- 语言切换为纯前端路径映射，无开放重定向（目标始终站内派生）。
- 不引入中间件/SSR，攻击面与现状一致。

---

## 7. 测试策略

| 层 | 新增/改动 | 说明 |
|----|-----------|------|
| unit | `content-validation.test.ts`（新） | 断言 §4.3 规则，错误录入在 `pnpm test` 暴露（R2.1）|
| unit | `seo.test.ts`（改） | 断言 sitemap 双语条目 + `alternates.languages`；canonical 按 locale |
| unit | `language-toggle.test.tsx`（**改，破坏性**） | 从「即将支持」占位改为断言路径映射（`/x`↔`/en/x`）|
| unit | `i18n` 单测（新） | `resolve` 回退、`pathFor`/`buildAlternates`、`dict` 键完整性 |
| unit | content/pages 相关（改） | 读取从常量改访问器后的断言调整 |
| e2e | `/en/*` 冒烟（新） | 英文树可访问、`html[lang=en]`、切换往返 |
| e2e | 现有 zh 断言（**基本不变**） | 中文根路径 URL 断言因 §2.1 保持稳定——这是选定方案的核心收益 |

发布闸门不变：`pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e && BUILD_TARGET=export pnpm build`（`out/` 须含 zh+en 全量 HTML）。

---

## 8. 迁移计划（三批，可独立开 PR）

> 详见 tasks.md。批次边界即 PR 边界。

- **批 1 — R3 优化（独立低风险，先做见效）**：JSON-LD、logo 压缩、字体栈、隐藏「即将支持」入口（上线前移除半成品观感，批 2 再换真实切换）。不依赖 i18n，可先单独 PR 合入。
- **批 2 — R1 i18n（架构核心）**：i18n 基础设施 → 双语内容模型（先包装后回填，见 §4.1）→ 两根布局/SiteChrome → 页面视图抽取 + zh 薄壳 → `/en` 子树 → 真实语言切换 → i18n SEO → 英文初稿 → 测试同步。
- **批 3 — R2 内容录入机制**：录入校验模块 + 测试、双语空态/占位核验、维护者录入指南文档。依赖批 2 的双语模型。

关键回滚点：批 2 的内容模型迁移采「先包装（en 空、行为等价）后回填」两步，任一步可独立验证、绿色可停。

---

## 9. 风险与缓解（承接 requirements §6）

| 风险 | 缓解 |
|------|------|
| 双语 × 动态路由 `generateStaticParams` 组合遗漏 | 两树 slug 集合集中派生自同一 content 源；导出后校验 `out/` 含全部 zh+en HTML（发布闸门） |
| 内容模型改动波及全站页面 | §4.1 两步迁移：先包装（测试不变）后逐页换访问器，blast radius 分摊 |
| e2e/unit 断言破坏 | 中文根路径不变 → zh 断言稳定；破坏集中在 language-toggle/seo/content 三处，列为显式任务并同步更新 |
| hreflang/canonical 配错 | `buildAlternates` 单一来源 + seo 单测断言双语 alternates |
| 多根布局共享 chrome 漂移 | 页头/页脚/JSON-LD/主题脚本统一进 `SiteChrome`，两布局仅差 `lang`+`locale` |
| 英文初稿术语错误 | `enDraft` 标记 + 覆盖度清单，联盟终审；专有名词优先官方中文/官方英文 |
