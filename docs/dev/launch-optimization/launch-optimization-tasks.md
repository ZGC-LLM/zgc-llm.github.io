---
feature: launch-optimization
type: tasks
generated_by: architect-planner
generated_at: 2026-07-18T00:00:00+08:00
version: 1
based_on: launch-optimization-design.md
complexity: complex
---

# 任务清单：上线优化版本（i18n + 内容录入机制 + SEO/性能收尾）

> 三批 = 三个可独立开 PR 的边界。批 1（R3）不依赖 i18n，先做见效；批 2（R1 i18n）为架构核心；批 3（R2 录入机制）依赖批 2 的双语模型。
> ⚠️ 标「测试影响」的任务会触碰 e2e/unit 断言，须同步更新测试；否则发布闸门 `pnpm test`/`test:e2e` 变红。

## 任务总览

| ID | 任务 | priority | complexity | execution | model | 依赖 | 并行组 | 测试影响 |
|----|------|----------|-----------|-----------|-------|------|--------|----------|
| **批 1 — R3 优化（独立 PR）** |
| T-001 | 站级 JSON-LD（Organization + WebSite） | P0 | standard | agent | sonnet | — | 1 | unit(seo) |
| T-002 | 新闻详情 Article JSON-LD（+可选 BreadcrumbList） | P1 | standard | agent | sonnet | — | 1 | unit |
| T-003 | logo 压缩至 <100K | P1 | simple | script | haiku | — | 1 | — |
| T-004 | 字体栈修正（删除 Inter） | P1 | simple | script | haiku | — | 1 | — |
| T-005 | 隐藏「即将支持」语言切换入口 | P0 | simple | agent | haiku | — | 1 | ⚠️ unit(language-toggle) |
| **批 2 — R1 i18n（独立 PR）** |
| T-101 | i18n 基础设施（locales/localized/routing/dict 骨架） | P0 | complex | agent | opus | — | 2 | unit(新) |
| T-102 | 双语内容模型迁移（Localized + getXxx(locale)，先包装） | P0 | complex | agent | opus | T-101 | 3 | ⚠️ unit(content) |
| T-103 | UI chrome 字典填充 + 导航双语化 | P0 | standard | agent | sonnet | T-101 | 3 | unit |
| T-104 | 两根布局 + SiteChrome（多根布局，html lang） | P0 | complex | agent | opus | T-101,T-103 | 4 | e2e |
| T-105 | 页面视图抽取 + zh 薄壳（根路径不变） | P0 | complex | agent | opus | T-102,T-103 | 5 | ⚠️ unit(pages) |
| T-106 | `/en/*` 英文子树薄壳 + 动态路由 generateStaticParams | P0 | standard | agent | sonnet | T-104,T-105 | 6 | e2e(新) |
| T-107 | 真实语言切换（路径映射，替换占位） | P1 | standard | agent | sonnet | T-101 | 3 | ⚠️ unit(language-toggle) |
| T-108 | i18n SEO（per-page alternates/hreflang/canonical + 双语 sitemap） | P0 | standard | agent | sonnet | T-105,T-106 | 7 | ⚠️ unit(seo) |
| T-109 | 英文初稿翻译填入（enDraft 标注待校对） | P2 | standard | agent | sonnet | T-102,T-103 | 7 | — |
| T-110 | i18n 测试同步（unit + e2e 全量对齐） | P0 | complex | agent | opus | T-106,T-107,T-108 | 8 | ⚠️ 本任务即测试 |
| **批 3 — R2 内容录入机制（独立 PR）** |
| T-201 | 录入校验模块 + 校验单测 | P0 | standard | agent | sonnet | T-102 | 9 | unit(新) |
| T-202 | 维护者内容录入指南文档 | P2 | simple | agent | haiku | T-102 | 9 | — |
| T-203 | 双语空态/占位核验 + 录入模板示例 | P1 | standard | agent | sonnet | T-102,T-103 | 9 | unit |

---

## 任务详情

### 批 1 — R3 优化（可独立开 PR，先合入）

## T-001: 站级 JSON-LD（Organization + WebSite） [P0] [standard]
- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **execution**: agent
- **model**: sonnet
- **parallel_group**: 1
- **dependencies**: []
- **provides**: src/components/site/json-ld.tsx
- **injected_skills**: []

### 描述
新增 `JsonLd` 服务端组件（`<script type="application/ld+json">`，`JSON.stringify` 注入，机制同现有主题脚本），在 `(frontend)/layout.tsx` 注入 `Organization` + `WebSite`。数据取自 `SITE_NAME`/`SITE_URL`/logo。本任务先做中文单布局；批 2 迁入 `SiteChrome` 后自动覆盖 en。

### 验收标准
- [ ] `Organization` + `WebSite` JSON-LD 出现在全站页面 `<head>`/`<body>`
- [ ] Rich Results / Schema 校验通过，字段合法（name/url/logo/inLanguage）
- [ ] `pnpm typecheck && pnpm lint && pnpm test && BUILD_TARGET=export pnpm build` 全绿

### 涉及文件
- src/components/site/json-ld.tsx（新）
- src/app/(frontend)/layout.tsx

---

## T-002: 新闻详情 Article JSON-LD [P1] [standard]
- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **execution**: agent
- **model**: sonnet
- **parallel_group**: 1
- **dependencies**: []
- **consumes**: src/components/site/json-ld.tsx

### 描述
在 `news/[slug]/page.tsx` 注入 `Article` JSON-LD（headline/datePublished/publisher）。可选：二级页 `BreadcrumbList`（P1，可拆子项，不阻塞主线）。依赖 T-001 的 `JsonLd`（若并行，先各自最小实现，评审时合并）。

### 验收标准
- [ ] 新闻详情页含合法 `Article` JSON-LD，Rich Results 校验通过
- [ ] `date` 映射 `datePublished`，`publisher` 指向 Organization
- [ ] 发布闸门全绿

### 涉及文件
- src/app/(frontend)/news/[slug]/page.tsx

---

## T-003: logo 压缩至 <100K [P1] [simple]
- **priority**: P1
- **complexity**: simple
- **review_strategy**: self
- **execution**: script
- **model**: haiku
- **parallel_group**: 1
- **dependencies**: []
- **requires**: [image-tooling]   # sharp/squoosh/pngquant/cwebp 之一

### 描述
`public/brand/llm-alliance-logo.png`（644K）压缩/转格式至 <100K（转 WebP 或缩放到展示尺寸 2×）。更新 `site-header.tsx` 及任何引用 `src`；保留 `alt`/`aria-hidden` 语义。⚠️ 需图像工具（task-implementer 环境预检 `image-tooling`，缺失返回 blocked）。

### 验收标准
- [ ] logo 资产 <100K
- [ ] 页头 logo 渲染正常（尺寸/清晰度无肉眼回退）
- [ ] 引用路径更新，构建/e2e 无坏图；发布闸门全绿

### 涉及文件
- public/brand/llm-alliance-logo.*（优化后资产）
- src/components/site/site-header.tsx

---

## T-004: 字体栈修正（删除 Inter） [P1] [simple]
- **priority**: P1
- **complexity**: simple
- **review_strategy**: self
- **execution**: script
- **model**: haiku
- **dependencies**: []
- **parallel_group**: 1

### 描述
从 `styles.css` 的 `--font-sans`（第 45-47 行）移除 `'Inter'`，消除「声明却从不加载」的不一致（design §5.3 推荐方案）。若用户 D 决策改选 `next/font` 自托管，改走该分支。

### 验收标准
- [ ] `--font-sans` 不再含未加载的 `Inter`；CJK 优先栈保留
- [ ] 页面视觉无回退；发布闸门全绿

### 涉及文件
- src/app/(frontend)/styles.css

---

## T-005: 隐藏「即将支持」语言切换入口 [P0] [simple]
- **priority**: P0
- **complexity**: simple
- **review_strategy**: self
- **execution**: agent
- **model**: haiku
- **dependencies**: []
- **parallel_group**: 1

### 描述
上线前移除页头（桌面+移动）「即将支持」半成品观感（report P0 #1）。本轮**批 1** 先隐藏入口；批 2 的 T-107 用真实切换替换回来。⚠️ 会破坏 `language-toggle.test.tsx` 对「即将支持」的断言，须同步调整（隐藏后测试应验证入口不渲染或组件缺省）。

### 验收标准
- [ ] 页头桌面 + 移动均无「即将支持」占位
- [ ] `language-toggle.test.tsx` 同步更新并通过；发布闸门全绿

### 涉及文件
- src/components/site/site-header.tsx
- src/components/site/language-toggle.tsx
- tests/unit/language-toggle.test.tsx

---

### 批 2 — R1 i18n（架构核心，独立 PR）

## T-101: i18n 基础设施 [P0] [complex]
- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **execution**: agent
- **model**: opus
- **dependencies**: []
- **parallel_group**: 2
- **provides**: src/i18n/locales.ts, src/i18n/localized.ts, src/i18n/dictionary.ts, src/i18n/routing.ts

### 描述
建 `src/i18n/*` 骨架（design §3.1）：`Locale`/`LOCALES`/`DEFAULT_LOCALE`/`isLocale`；`Localized<T>`/`LocalizedText`/`resolve`/`isUntranslated`；`dict(locale)` 字典结构（键先占位）；`routing` 的 `pathFor(pageKey,locale)`/`buildAlternates(pageKey)`（zh→根、en→`/en/*` 单一来源）。配套单测覆盖回退与路径映射。

### 验收标准
- [ ] `resolve` en 缺失回退 zh；`pathFor`/`buildAlternates` zh/en 映射正确（含 `x-default`=zh）
- [ ] 新增 i18n 单测通过；`pnpm typecheck` 严格模式无 any
- [ ] 发布闸门全绿

### 涉及文件
- src/i18n/locales.ts, localized.ts, dictionary.ts, routing.ts（新）
- tests/unit/i18n.test.ts（新）

---

## T-102: 双语内容模型迁移 [P0] [complex]
- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **execution**: agent
- **model**: opus
- **dependencies**: [T-101]
- **parallel_group**: 3
- **consumes**: src/i18n/localized.ts, src/i18n/locales.ts

### 描述
按 design §4.1 两步迁移：先把 `types/content.ts` 字符串字段改 `LocalizedText`、`src/content/*` 各集合导出 `getXxx(locale)` 访问器，内部把现有中文常量包装为 `{ zh: <原值> }`（en 暂空）——**此步页面与断言行为等价**。保留 `named`/`published`/`type`/`slug` 等治理与路由字段。⚠️ 触碰 `content.test.ts` 读取方式，同步调整（`getXxx('zh')` 等价原数据）。

### 验收标准
- [ ] 所有 content 集合有 `getXxx(locale)`，`getXxx('zh')` 输出等价迁移前
- [ ] 类型严格通过，无 any；slug/id 与迁移前一致（动态路由不受影响）
- [ ] `content.test.ts` 同步更新并通过；发布闸门全绿

### 涉及文件
- src/types/content.ts
- src/content/*.ts（members/news/home/alliance/cybersecurity/working-groups/working-group-members）
- src/config/site.ts（SITE_NAVIGATION 标签、en 站名/描述）
- tests/unit/content.test.ts

---

## T-103: UI chrome 字典填充 + 导航双语化 [P0] [standard]
- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **execution**: agent
- **model**: sonnet
- **dependencies**: [T-101]
- **parallel_group**: 3
- **consumes**: src/i18n/dictionary.ts

### 描述
填充 `dict(locale)`：导航标签、页头/页脚按钮与文案、skip-link、空态、aria-label 等 chrome 字符串（zh 权威 + en）。`SITE_NAVIGATION` 标签接入字典。为 T-104/T-105/T-107 供词条。

### 验收标准
- [ ] chrome 全部可见文案有 zh/en 词条；键完整性单测覆盖（en 缺失回退 zh）
- [ ] 发布闸门全绿

### 涉及文件
- src/i18n/dictionary.ts
- src/config/site.ts

---

## T-104: 两根布局 + SiteChrome [P0] [complex]
- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **execution**: agent
- **model**: opus
- **dependencies**: [T-101, T-103]
- **parallel_group**: 4
- **provides**: src/app/(en)/en/layout.tsx, src/components/site/site-chrome.tsx
- **consumes**: src/i18n/dictionary.ts, src/components/site/json-ld.tsx

### 描述
抽 `SiteChrome locale`（skip-link + SiteHeader + children + SiteFooter + 主题脚本 + 站级 JSON-LD）。改 `(frontend)/layout.tsx` → `<html lang="zh-CN"><SiteChrome locale="zh">`；新增 `(en)` 路由组根布局 `(en)/en/layout.tsx` → `<html lang="en"><SiteChrome locale="en">`（多根布局，design §2.1）。SiteHeader/Footer/LanguageToggle 接 `locale`。

### 验收标准
- [ ] `/` 出 `html[lang=zh-CN]`，`/en` 出 `html[lang=en]`
- [ ] 两布局仅 lang+locale 不同，chrome 无逻辑重复
- [ ] 站级 JSON-LD 在两 locale 均注入；发布闸门全绿

### 涉及文件
- src/app/(frontend)/layout.tsx
- src/app/(en)/en/layout.tsx（新）
- src/components/site/site-chrome.tsx（新）
- src/components/site/site-header.tsx, site-footer.tsx

---

## T-105: 页面视图抽取 + zh 薄壳 [P0] [complex]
- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **execution**: agent
- **model**: opus
- **dependencies**: [T-102, T-103]
- **parallel_group**: 5
- **provides**: src/components/pages/*-view.tsx

### 描述
把各页 JSX 抽到 `src/components/pages/*-view.tsx`（接 `locale`，从 `getXxx(locale)`+`dict(locale)` 取数）。现有 `(frontend)/*/page.tsx` 改为薄壳：`export default () => <XxxView locale="zh"/>`，metadata 用 `buildAlternates`。**物理路径不变 → 中文 URL 零变更**。动态页 zh 树保留原 `generateStaticParams`。⚠️ pages 单测读取点随视图抽取调整。

### 验收标准
- [ ] 全部 zh 页面经 `*View` 渲染，视觉/内容与迁移前一致
- [ ] 中文 URL、canonical、sitemap 路径不变；e2e zh 断言不变即通过
- [ ] pages 相关单测同步更新；发布闸门全绿

### 涉及文件
- src/components/pages/*-view.tsx（新，逐页）
- src/app/(frontend)/**/page.tsx（改薄壳，全部静态+动态页）
- tests/unit/home-alliance-pages.test.tsx, news-members-pages.test.tsx, conversion-pages.test.tsx

---

## T-106: `/en/*` 英文子树薄壳 [P0] [standard]
- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **execution**: agent
- **model**: sonnet
- **dependencies**: [T-104, T-105]
- **parallel_group**: 6
- **provides**: src/app/(en)/en/**/page.tsx

### 描述
按中文树一一对应建 `(en)/en/**/page.tsx` 薄壳（`locale="en"`）：静态页 + 动态页（`news/[slug]`、`working-groups/[slug]` 及 `members`/`join` 子路由）。动态页在英文树各自 `generateStaticParams`（slug 集合来自同一 content 源）、`dynamicParams=false`。metadata 用 `buildAlternates`。

### 验收标准
- [ ] `/en`、`/en/alliance`、`/en/news/[slug]` 等全部可访问
- [ ] `BUILD_TARGET=export pnpm build` 产出 `out/en/**` 全量 HTML（zh+en 组合无遗漏）
- [ ] 发布闸门全绿

### 涉及文件
- src/app/(en)/en/**/page.tsx（新，与中文树对应）

---

## T-107: 真实语言切换 [P1] [standard]
- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **execution**: agent
- **model**: sonnet
- **dependencies**: [T-101]
- **parallel_group**: 3

### 描述
重写 `LanguageToggle`（design §3.4）：`usePathname()` 计算对侧 locale 同页 URL（`/x`↔`/en/x`，`/`↔`/en`），移除「即将支持」与 `setShowHint`，恢复批 1 隐藏的入口为真实切换。⚠️ 破坏性改写 `language-toggle.test.tsx`（从占位断言改为路径映射断言）。

### 验收标准
- [ ] 任一页切换后停留在对应语言的同一页面，往返正确
- [ ] 无「即将支持」；`language-toggle.test.tsx` 重写并通过
- [ ] 发布闸门全绿

### 涉及文件
- src/components/site/language-toggle.tsx
- tests/unit/language-toggle.test.tsx

---

## T-108: i18n SEO [P0] [standard]
- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **execution**: agent
- **model**: sonnet
- **dependencies**: [T-105, T-106]
- **parallel_group**: 7

### 描述
每页 metadata 经 `buildAlternates` 输出 `alternates.languages`（hreflang zh-CN/en/x-default）+ 按 locale 的 canonical；`sitemap.ts` 升级为双语条目（`PUBLIC_STATIC_ROUTES`×locale + news slug×locale），每条带 `alternates`。robots 不变。⚠️ 触碰 `seo.test.ts`。

### 验收标准
- [ ] 每页含正确 hreflang（zh/en/x-default）与 locale canonical
- [ ] sitemap 含 zh+en 全量条目及 alternates；`seo.test.ts` 更新并通过
- [ ] 发布闸门全绿

### 涉及文件
- src/app/(frontend)/sitemap.ts
- src/i18n/routing.ts（如需微调）
- 各 page.tsx metadata 接线（zh+en 树）
- tests/unit/seo.test.ts

---

## T-109: 英文初稿翻译填入 [P2] [standard]
- **priority**: P2
- **complexity**: standard
- **review_strategy**: combined
- **execution**: agent
- **model**: sonnet
- **dependencies**: [T-102, T-103]
- **parallel_group**: 7

### 描述
回填 content 与字典的 `en` 字段初稿（通用译法），逐条标 `enDraft: true` + 注释「待人工校对」。专有名词（联盟全称、成员单位、工作组名）按 D2 决策：优先官方中文/官方英文，无则通用译法并标记。不承诺终审质量。

### 验收标准
- [ ] 主要页面英文可读、无缺失回退空洞（关键 chrome/标题/描述有 en）
- [ ] 未校对项以 `enDraft` 标注，覆盖度测试可枚举
- [ ] 发布闸门全绿

### 涉及文件
- src/content/*.ts（en 字段）
- src/i18n/dictionary.ts（en 词条）

---

## T-110: i18n 测试同步 [P0] [complex]
- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **execution**: agent
- **model**: opus
- **dependencies**: [T-106, T-107, T-108]
- **parallel_group**: 8

### 描述
全量对齐测试：新增 `/en/*` e2e 冒烟（可访问、`html[lang=en]`、切换往返）；确认 zh e2e 断言仍绿（根路径不变的验证）；补 i18n/seo/toggle/content 单测断层；确保 `BUILD_TARGET=export pnpm build` 后 `out/` 含 zh+en 全量 HTML 的校验。

### 验收标准
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e && BUILD_TARGET=export pnpm build` 全绿
- [ ] `out/` 含 zh 与 en 全部页面 HTML，无死链
- [ ] 新增 en e2e 覆盖首页 + 一个静态页 + 一个动态页 + 语言切换

### 涉及文件
- tests/e2e/*.e2e.spec.ts（新增 en 冒烟）
- tests/unit/*（收口）

---

### 批 3 — R2 内容录入机制（独立 PR）

## T-201: 录入校验模块 + 校验单测 [P0] [standard]
- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **execution**: agent
- **model**: sonnet
- **dependencies**: [T-102]
- **parallel_group**: 9
- **provides**: src/lib/content-validation.ts, tests/unit/content-validation.test.ts

### 描述
实现 `validateAllContent()`（design §4.3）：必填非空、授权门（`named` 一致性）、slug/id 唯一、https 外链、日期格式、双语覆盖度清单（不判失败）。单测遍历全部集合断言零致命 issue，让错误录入在 `pnpm test` 暴露（R2.1）。

### 验收标准
- [ ] 规则齐全，故意坏数据能被测试捕获
- [ ] 双语未校对项以清单输出（不使测试失败）
- [ ] 发布闸门全绿

### 涉及文件
- src/lib/content-validation.ts（新）
- tests/unit/content-validation.test.ts（新）

---

## T-202: 维护者内容录入指南 [P2] [simple]
- **priority**: P2
- **complexity**: simple
- **review_strategy**: self
- **execution**: agent
- **model**: haiku
- **dependencies**: [T-102]
- **parallel_group**: 9

### 描述
写维护者录入指南（R2.3）：如何加成员/新闻/工作组、双语字段怎么填（zh 权威/en 初稿/enDraft）、授权门（named）规则、slug 唯一约束、校验如何在 test 阶段兜底。纯文档。

### 验收标准
- [ ] 覆盖成员/新闻/工作组录入步骤 + 双语 + 授权门 + 校验
- [ ] 示例可照抄；与实际类型/访问器一致

### 涉及文件
- docs/ 维护者录入指南（新，如 docs/content-authoring.md）

---

## T-203: 双语空态/占位核验 + 录入模板示例 [P1] [standard]
- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **execution**: agent
- **model**: sonnet
- **dependencies**: [T-102, T-103]
- **parallel_group**: 9

### 描述
核验「未授权不填充」空态在 zh/en 两 locale 均正确（成员 10/32、新闻、工作组成果空态）；提供类型化录入模板示例（占位条目，`published:false`/enDraft），确保真实数据与占位切换清晰可控（R2.2）。

### 验收标准
- [ ] zh/en 空态文案均来自字典、渲染正常
- [ ] 录入模板示例可复制、通过 T-201 校验
- [ ] 发布闸门全绿

### 涉及文件
- src/content/*.ts（占位示例）
- src/i18n/dictionary.ts（空态文案）
- src/components/pages/*-view.tsx（空态接线核验）

---

## 依赖关系图

```
批1（并行组1，互相独立，可全并行）：T-001  T-002  T-003  T-004  T-005
        │（批1 单独 PR 合入后，与批2 解耦）

批2：
  T-101 ─┬─ T-102 ─┬─ T-105 ─┬─ T-106 ─┬─ T-108 ─┐
         ├─ T-103 ─┤         │         │         ├─ T-110
         │         └─ T-104 ─┘         │         │
         └─ T-107 ───────────────────────────────┘
         └─ T-109（依赖 T-102,T-103）─────────────┘

批3（并行组9，依赖批2 的 T-102/T-103）：
  T-201  T-202  T-203
```

## 执行计划

- **批 1**：5 个任务全并行（改不同文件，仅 T-005 与 T-001 无冲突）。P0 先行：T-005、T-001。半天量级，先开 PR 见效。
- **批 2**：按依赖分组串行推进：组2(T-101) → 组3(T-102/T-103/T-107 并行) → 组4(T-104) → 组5(T-105) → 组6(T-106) → 组7(T-108/T-109 并行) → 组8(T-110 收口)。i18n 单独 PR。
- **批 3**：组9 三任务并行，单独 PR。
- 每批以 `pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e && BUILD_TARGET=export pnpm build` 为合入闸门。

## 风险评估

| 风险 | 关联任务 | 缓解 |
|------|----------|------|
| 内容模型迁移 blast radius 大 | T-102 | 先包装（en 空、行为等价）后回填两步，T-102 只做包装，绿色可停 |
| e2e/unit 断言破坏面 | T-005/T-102/T-105/T-107/T-108/T-110 | 中文根路径不变 → zh 断言稳定；破坏集中在这些显式任务，同步改测试 |
| 双语 × 动态路由预渲染遗漏 | T-106/T-110 | slug 集合单一来源；导出后校验 `out/` 含 zh+en 全量 HTML |
| 多根布局 chrome 漂移 | T-104 | 统一 `SiteChrome`，两布局仅差 lang+locale |
| logo 工具缺失 | T-003 | `requires: image-tooling` 环境预检，缺失 blocked 而非硬失败 |
| 英文初稿术语错误 | T-109 | enDraft 标记 + 覆盖度清单，联盟终审 |
