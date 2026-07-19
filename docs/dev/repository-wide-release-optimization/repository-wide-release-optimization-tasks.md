---
feature: repository-wide-release-optimization
type: tasks
complexity: complex
generated_by: spec-dev
generated_at: 2026-07-19T02:30:00+08:00
version: 1
design: ./repository-wide-release-optimization-design.md
---

# 任务清单: 全仓发布级深度优化

## 1. 任务总览

| ID | 任务 | 优先级 | 复杂度 | 依赖 | 并行标签 |
|----|------|--------|--------|------|----------|
| T-000 | 冻结治理前基线并推送独立提交 | P0 | standard | - | G0 |
| T-001 | 建立全仓审计与事实核验登记 | P0 | complex | T-000 | audit |
| T-002 | 治理设计系统、全站 chrome 与交互基础 | P0 | complex | T-001 | foundation-ui |
| T-003 | 治理站点配置、i18n、SEO 与路由基础 | P0 | complex | T-001,T-002 | foundation-seo |
| T-004 | 优化首页与联盟介绍页面族 | P0 | complex | T-002,T-003 | pages-a |
| T-005 | 优化参与、工作组与网络安全页面族 | P0 | complex | T-002,T-003 | pages-b |
| T-006 | 优化成员、新闻、隐私与错误页面族 | P0 | complex | T-002,T-003 | pages-c |
| T-007 | 优化 CI/CD、依赖与部署配置 | P0 | complex | T-001 | engineering-a |
| T-008 | 治理工程配置、代码与资产债务 | P1 | standard | T-001 | engineering-b |
| T-009 | 重构 unit/integration 测试与覆盖率门 | P0 | complex | T-004,T-005,T-006,T-007,T-008 | tests-unit |
| T-010 | 治理 e2e、多浏览器、无障碍与性能验证 | P0 | complex | T-004,T-005,T-006,T-007,T-008 | tests-e2e |
| T-011 | 治理 README、docs 与历史规格状态 | P1 | standard | T-002,T-003,T-004,T-005,T-006,T-007,T-008,T-009,T-010 | docs |
| T-012 | 生成治理后基线并完成发布验收 | P0 | complex | T-002..T-011 | acceptance |

任务数：13。`parallel_group` 仅是可读标签；调度以 `dependencies` 与 `provides/consumes` 派生边为准。

## 2. 任务详情

## T-000: 冻结治理前基线并推送独立提交 [P0] [standard]

- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: G0
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: []
- **requires**: []
- **provides**: [docs/dev/repository-wide-release-optimization/baseline-before.md]
- **consumes**: []
- **must_not_create**: [docs/dev/repository-wide-release-optimization/baseline-after.md, docs/dev/repository-wide-release-optimization/release-readiness-report.md]
- **injected_skills**: []

### 描述

执行 design §8.2 的完整命令集，记录治理前 HEAD、环境、命令、原始结果摘要、计数、coverage、测试与构建状态、路由/SEO/链接初始问题数、P0/P1/P2 数量及外部无法验证项。所有 shell 命令以 `rtk` 开头；需要原始输出时使用 `rtk proxy`。生成文档后只提交该基线文件，提交信息为 `chore: freeze baseline before repository-wide governance`，并推送当前 feature 分支。该远端提交存在前不得解锁任何后继任务。

### 验收标准

- [ ] `baseline-before.md` 时间戳早于所有 Execution 修改任务
- [ ] 记录 typecheck、lint、coverage、e2e、普通 build、export build、依赖审计和全跟踪文件扫描
- [ ] 扫描覆盖 `.github/workflows/*.yml`、`*.yaml`、`*.toml`、Dockerfile 与 `.env.example`
- [ ] 每个失败有 exit code、计数与简短诊断，不因基线失败而“修到全绿”后再记录
- [ ] 基线作为独立 commit，已推送至 `feat/repository-wide-release-optimization`

### 涉及文件

- docs/dev/repository-wide-release-optimization/baseline-before.md

---

## T-001: 建立全仓审计与事实核验登记 [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: audit
- **execution**: agent
- **model**: opus
- **estimated_files**: 2
- **dependencies**: [T-000]
- **requires**: []
- **provides**: [docs/dev/repository-wide-release-optimization/audit-register.md, docs/dev/repository-wide-release-optimization/content-fact-register.md]
- **consumes**: [docs/dev/repository-wide-release-optimization/baseline-before.md]
- **must_not_create**: [docs/dev/repository-wide-release-optimization/baseline-after.md]
- **injected_skills**: [ui-walkthrough, review-all]

### 描述

按 design §2 建立全路由、语言、主题、视口、输入方式、浏览器、内容状态、SEO、工程、交付和文档审计矩阵。每项问题写明证据、P0/P1/P2、关联 requirements、整改任务和复验位。另建事实登记，覆盖具名机构/成员/专家、数字/成果、主管部门或政策表述、备案号、官方英文名、外部表单及公开授权。不能从仓库确认的事实必须标记为发布阻塞或建议中性替换。

### 验收标准

- [ ] 每个公开路由模板和 zh/en 对应关系均在审计矩阵中
- [ ] 所有 P0/P1 有后续任务归属，不出现“仅记录不处理”
- [ ] 备案号、主管部门指导、具名合作与英文专名均有证据状态
- [ ] 历史 specs 初步标记完成/部分/替代/追溯状态
- [ ] F-001、F-002、F-012 的审计证据可复核

### 涉及文件

- docs/dev/repository-wide-release-optimization/audit-register.md
- docs/dev/repository-wide-release-optimization/content-fact-register.md

---

## T-002: 治理设计系统、全站 chrome 与交互基础 [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: foundation-ui
- **execution**: agent
- **model**: opus
- **estimated_files**: 14
- **dependencies**: [T-001]
- **requires**: []
- **provides**: [src/app/(frontend)/styles.css, src/components/site/site-chrome.tsx, src/components/site/site-header.tsx, src/components/site/site-footer.tsx, src/components/site/nav-group.tsx, src/components/site/site-navigation-link.tsx, src/components/site/language-toggle.tsx, src/components/site/theme-script.tsx, src/components/site/external-application-link.tsx, src/components/site/page-hero.tsx, src/components/site/section-heading.tsx]
- **consumes**: [docs/dev/repository-wide-release-optimization/audit-register.md]
- **must_not_create**: [src/config/site.ts, src/content/home.ts, src/content/alliance.ts, package.json, playwright.config.ts]
- **injected_skills**: [dev-frontend-standards, test-governance]

### 描述

统一 token、排版、间距、断点、按钮、卡片、空态、焦点、减少动态效果和明暗主题状态；优化 Header/Footer、导航分组、移动菜单、语言/主题控制和外链提示。处理审计中重复/无效 CSS 和不可访问交互，但不把页面事实文案迁入共享组件。导航应具备准确当前态、键盘顺序、Escape/焦点返回和移动触控目标；若保留主题，必须首帧稳定和持久化。

### 验收标准

- [ ] 共享组件与 token 成为全站唯一视觉/状态基础，无新增散落硬编码主题色
- [ ] 360–1440+ 视口无共享 chrome 溢出、遮挡或不可触达控件
- [ ] 键盘、focus-visible、skip link、reduced motion 与 accessible name 完整
- [ ] 语言切换保持同一路由/slug；外链组件具有离站与不可用状态
- [ ] light/dark 决策与实现、测试和设计文档一致
- [ ] 覆盖 F-004、F-006、F-007、F-008、F-009

### 涉及文件

- src/app/(frontend)/styles.css
- src/components/site/*.tsx（仅 `provides` 所列文件）

---

## T-003: 治理站点配置、i18n、SEO 与路由基础 [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: foundation-seo
- **execution**: agent
- **model**: opus
- **estimated_files**: 18
- **dependencies**: [T-001, T-002]
- **requires**: []
- **provides**: [src/config/site.ts, src/i18n/locales.ts, src/i18n/localized.ts, src/i18n/dictionary.ts, src/i18n/routing.ts, src/lib/content-validation.ts, src/lib/structured-data.ts, src/types/content.ts, src/components/site/json-ld.tsx, src/app/(frontend)/layout.tsx, src/app/(en)/layout.tsx, src/app/(frontend)/sitemap.ts, src/app/robots.ts, src/app/global-not-found.tsx]
- **consumes**: [docs/dev/repository-wide-release-optimization/audit-register.md, docs/dev/repository-wide-release-optimization/content-fact-register.md, src/components/site/site-chrome.tsx]
- **must_not_create**: [src/components/pages/home-view.tsx, src/components/pages/join-view.tsx, .github/workflows/ci.yml]
- **injected_skills**: [dev-frontend-standards, test-governance]

### 描述

集中治理正式域名、导航/申请配置、locale 解析与路径映射、公开内容事实元数据类型与校验、共享 metadata/structured data、根布局、robots、sitemap 和全局 404；CNAME 与部署配置由 T-007 统一拥有。保持中文根路径与 `/en/*`，动态 slug 对应切换不丢失。为页面族提供可复用 canonical/hreflang/OG/JSON-LD helper，并强化域名、HTTPS、内容、授权状态和双语校验；不在本任务改页面正文。

### 验收标准

- [ ] canonical、sitemap、robots、邮件和运行时公开配置只使用带连字符正式主域名；CNAME 由 T-007 同步
- [ ] zh/en path mapping、lang、hreflang、x-default 与动态 slug 一致
- [ ] Organization/WebSite/Article 数据结构安全、合法且使用当前 locale
- [ ] 未知动态路由与全局/局部 404 行为确定，404 不进入 sitemap
- [ ] 申请 URL 缺失/非法时提供确定降级，不暴露密钥或个人信息
- [ ] 覆盖 F-015、F-016、F-017、F-020、F-022

### 涉及文件

- src/config/site.ts
- src/i18n/*
- src/lib/content-validation.ts
- src/lib/structured-data.ts
- src/types/content.ts
- src/components/site/json-ld.tsx
- 根布局、sitemap、robots、global-not-found

---

## T-004: 优化首页与联盟介绍页面族 [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: pages-a
- **execution**: agent
- **model**: opus
- **estimated_files**: 8
- **dependencies**: [T-002, T-003]
- **requires**: []
- **provides**: [src/components/pages/home-view.tsx, src/components/pages/alliance-view.tsx, src/content/home.ts, src/content/alliance.ts, src/app/(frontend)/page.tsx, src/app/(frontend)/alliance/page.tsx, src/app/(en)/en/page.tsx, src/app/(en)/en/alliance/page.tsx]
- **consumes**: [docs/dev/repository-wide-release-optimization/audit-register.md, docs/dev/repository-wide-release-optimization/content-fact-register.md, src/app/(frontend)/styles.css, src/config/site.ts, src/i18n/routing.ts]
- **must_not_create**: [src/app/(frontend)/styles.css, src/components/pages/join-view.tsx, tests/unit]
- **injected_skills**: [dev-frontend-standards, doc-polish, test-governance]

### 描述

围绕“联盟是谁—聚焦什么—为何可信—谁可参与—如何行动”重构首页与联盟介绍的信息层级、主次 CTA、内容密度、中文和英文表达。保留有依据的联盟方向，移除或中性化无法核验的指导、成果和能力承诺；避免首页与联盟页重复整段表达。页面 metadata 使用共享 SEO 基础。

### 验收标准

- [ ] 首页首屏明确身份、核心价值和主次行动，移动端信息完整
- [ ] 联盟介绍提供定位、价值、机制与方向，不复述首页全部段落
- [ ] CTA 动作和对象准确，不同参与入口不再混用含糊标签
- [ ] 中文专业、克制、有号召力；英文自然且未新增中文没有的承诺
- [ ] 所有具名事实与 content-fact-register 一致
- [ ] 覆盖 F-003、F-010、F-011、F-012

### 涉及文件

- 首页/联盟视图、内容和中英文路由壳

---

## T-005: 优化参与、工作组与网络安全页面族 [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: pages-b
- **execution**: agent
- **model**: opus
- **estimated_files**: 18
- **dependencies**: [T-002, T-003]
- **requires**: []
- **provides**: [src/components/pages/join-view.tsx, src/components/pages/cybersecurity-view.tsx, src/content/cybersecurity.ts, src/content/working-groups.ts, src/content/working-group-members.ts, src/app/(frontend)/join/page.tsx, src/app/(en)/en/join/page.tsx, src/app/(frontend)/cybersecurity/page.tsx, src/app/(en)/en/cybersecurity/page.tsx, src/app/(frontend)/working-groups/page.tsx, src/app/(en)/en/working-groups/page.tsx, src/app/(frontend)/working-groups/[slug]/page.tsx, src/app/(frontend)/working-groups/[slug]/members/page.tsx, src/app/(frontend)/working-groups/[slug]/join/page.tsx, src/app/(en)/en/working-groups/[slug]/page.tsx, src/app/(en)/en/working-groups/[slug]/members/page.tsx, src/app/(en)/en/working-groups/[slug]/join/page.tsx]
- **consumes**: [docs/dev/repository-wide-release-optimization/audit-register.md, docs/dev/repository-wide-release-optimization/content-fact-register.md, src/app/(frontend)/styles.css, src/components/site/external-application-link.tsx, src/config/site.ts, src/i18n/routing.ts]
- **must_not_create**: [src/app/(frontend)/styles.css, src/content/members.ts, .env.example, tests/e2e]
- **injected_skills**: [dev-frontend-standards, doc-polish, test-governance]

### 描述

统一联盟申请、专业用户、工作组和网络安全生态的对象分流、参与价值、适用条件、流程、CTA、离站/隐私边界与异常态。减少工作组组织页和网络安全专题页重复；具名牵头方、成员、数据、成果和治理表述按事实登记处理。中文和英文成对修改，动态 slug 和 unknown state 保持静态导出安全。

### 验收标准

- [ ] 机构加入、工作组参与、专业用户与生态共建路径可清楚区分并互相引导
- [ ] 每条路径说明对象、价值、条件、流程、外部表单和提交后预期
- [ ] 飞书离站、个人信息处理边界、URL 异常和联系替代路径完整
- [ ] 工作组与网络安全页职责清楚、内容不重复、授权不明者不具名
- [ ] 动态工作组详情/成员/加入页及 zh/en 404 行为一致
- [ ] 覆盖 F-005、F-006、F-007、F-011、F-013、F-014

### 涉及文件

- 加入、网络安全、工作组视图/内容与中英文路由

---

## T-006: 优化成员、新闻、隐私与错误页面族 [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: pages-c
- **execution**: agent
- **model**: opus
- **estimated_files**: 14
- **dependencies**: [T-002, T-003]
- **requires**: []
- **provides**: [src/components/pages/members-view.tsx, src/components/pages/privacy-view.tsx, src/content/members.ts, src/content/news.ts, src/app/(frontend)/members/page.tsx, src/app/(en)/en/members/page.tsx, src/app/(frontend)/news/page.tsx, src/app/(frontend)/news/[slug]/page.tsx, src/app/(en)/en/news/page.tsx, src/app/(en)/en/news/[slug]/page.tsx, src/app/(frontend)/privacy/page.tsx, src/app/(en)/en/privacy/page.tsx, src/app/(frontend)/not-found.tsx]
- **consumes**: [docs/dev/repository-wide-release-optimization/audit-register.md, docs/dev/repository-wide-release-optimization/content-fact-register.md, src/app/(frontend)/styles.css, src/config/site.ts, src/i18n/routing.ts, src/lib/structured-data.ts]
- **must_not_create**: [src/app/global-not-found.tsx, src/app/(frontend)/styles.css, src/content/cybersecurity.ts, tests/unit]
- **injected_skills**: [dev-frontend-standards, doc-polish, test-governance]

### 描述

优化成员授权/分类与空态、新闻列表/详情的信息层级和结构化语义、隐私页的官网/飞书责任边界以及局部 404 的恢复路径。新闻与成员英文缺失时遵循明确回退，不把中文事实机械伪装成已校对英文；所有展示成员具备公开依据。

### 验收标准

- [ ] 成员 filled/empty、授权状态和分类可理解，不展示未授权具名实体
- [ ] 新闻列表/详情具备日期、分类、返回路径和 Article metadata
- [ ] 隐私页准确说明官网与飞书的处理边界，无虚假法律承诺
- [ ] 404 提供清晰返回路径并保持品牌与键盘可用性
- [ ] 长英文、空内容和未知 slug 不破版、不产生错误 canonical
- [ ] 覆盖 F-006、F-010、F-011、F-012、F-015、F-016

### 涉及文件

- 成员、新闻、隐私和局部 404 页面族

---

## T-007: 优化 CI/CD、依赖与部署配置 [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: engineering-a
- **execution**: agent
- **model**: opus
- **estimated_files**: 8
- **dependencies**: [T-001]
- **requires**: []
- **provides**: [package.json, pnpm-lock.yaml, .env.example, .github/workflows/ci.yml, .github/workflows/deploy-pages.yml, Dockerfile, public/CNAME]
- **consumes**: [docs/dev/repository-wide-release-optimization/baseline-before.md, docs/dev/repository-wide-release-optimization/audit-register.md]
- **must_not_create**: [playwright.config.ts, vitest.unit.config.mts, tests/unit, tests/e2e]
- **injected_skills**: [test-governance]

### 描述

统一 Node/pnpm、公开环境变量、依赖和双构建目标；优化 CI 并行、缓存、超时、并发取消、最小权限、Action 可追溯性、coverage hard gate、快速 e2e 与 build/export 验证。厘清 CI 与 Pages 部署构建职责：允许为正式产物安全重建，但必须消除没有质量意义的重复并记录理由。同步 Dockerfile、`.env.example`、Actions 和 CNAME；升级/删除依赖必须有风险与锁文件证据。

### 验收标准

- [ ] frozen lockfile、Node 22、pnpm 11 和最小权限在所有工作流一致
- [ ] 独立检查合理并行、旧运行取消、缓存 key 确定、失败可靠传播
- [ ] coverage、关键 e2e、普通 build/export 在合并/发布前有明确质量门
- [ ] Pages 不会绕过失败质量门，部署构建职责有文档说明
- [ ] Docker/Actions/.env 的 `NEXT_PUBLIC_*` 声明无漂移、无真实凭证
- [ ] 无已知 high/critical production 漏洞，或有明确阻塞说明
- [ ] 覆盖 F-017、F-020、F-023、F-024、F-025

### 涉及文件

- package.json、pnpm-lock.yaml、.env.example、GitHub workflows、Dockerfile、public/CNAME

---

## T-008: 治理工程配置、代码与资产债务 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: engineering-b
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 8
- **dependencies**: [T-001]
- **requires**: []
- **provides**: [next.config.ts, tsconfig.json, eslint.config.mjs, postcss.config.mjs, public/brand/llm-alliance-logo.png]
- **consumes**: [docs/dev/repository-wide-release-optimization/baseline-before.md, docs/dev/repository-wide-release-optimization/audit-register.md]
- **must_not_create**: [package.json, pnpm-lock.yaml, src/app/(frontend)/styles.css, tests/unit]
- **injected_skills**: [dev-frontend-standards, test-governance]

### 描述

基于审计治理 Next/TypeScript/ESLint/PostCSS 配置、Server/Client 边界、死代码/注释、重复工具和公开资产。保持 export/standalone 双目标；不得以降低规则、ignore 或 `any` 消除错误。压缩或替换大 logo 前确认全部引用，删除未用资产前留下可复核证据；不存在的可选输出不应为满足任务而空建。

### 验收标准

- [ ] TypeScript strict 与 ESLint 无新增豁免、`any` 或宽泛禁用
- [ ] 双构建目标配置更清晰且无行为回归
- [ ] Client Components 仅保留真实浏览器交互需要
- [ ] 可确认的死代码、无效注释、重复配置和未用资产得到处理
- [ ] logo/关键图片体积与清晰度符合性能预算；若保留 PNG 则不强制创建 WebP
- [ ] 覆盖 F-018、F-020、F-021、F-022

### 涉及文件

- Next/TS/ESLint/PostCSS 配置与品牌资产

---

## T-009: 重构 unit/integration 测试与覆盖率门 [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: tests-unit
- **execution**: agent
- **model**: opus
- **estimated_files**: 30
- **dependencies**: [T-004, T-005, T-006, T-007, T-008]
- **requires**: []
- **provides**: [vitest.unit.config.mts, tests/unit, tests/integration]
- **consumes**: [package.json, docs/dev/repository-wide-release-optimization/audit-register.md, src/config/site.ts, src/content/home.ts, src/content/cybersecurity.ts, src/content/news.ts]
- **must_not_create**: [playwright.config.ts, tests/e2e, .github/workflows/ci.yml]
- **injected_skills**: [test-governance, dev-frontend-standards]

### 描述

盘点现有 unit 测试，按纯函数、内容/config/SEO/路由、组件与跨模块行为重新划分；仅在确有集成职责时建立 `tests/integration/`。先补高风险分支，再配置 lines/statements/functions ≥90%、branches ≥85% 的 CI 阈值。删除重复、实现细节耦合和无意义断言，保留对用户行为与公开契约的保护。

### 验收标准

- [ ] 测试目录、命名和 helper 职责清楚，迁移后无重复执行
- [ ] 全局 coverage 达到 90/90/90/85，并由配置硬门阻断
- [ ] site config、内容校验、i18n 路由、SEO、动态 params、申请降级覆盖关键分支
- [ ] 测试失败能指出真实行为差异，不通过大面积 snapshot 填覆盖
- [ ] 重复运行 unit/integration 无可复现 flaky
- [ ] 覆盖 F-026、F-027、F-029

### 涉及文件

- vitest.unit.config.mts
- tests/unit/**
- tests/integration/**（仅需时创建）

---

## T-010: 治理 e2e、多浏览器、无障碍与性能验证 [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: tests-e2e
- **execution**: agent
- **model**: opus
- **estimated_files**: 16
- **dependencies**: [T-004, T-005, T-006, T-007, T-008]
- **requires**: []
- **provides**: [playwright.config.ts, tests/e2e, tests/helpers]
- **consumes**: [package.json, .github/workflows/ci.yml, docs/dev/repository-wide-release-optimization/audit-register.md, src/app/(frontend)/page.tsx, src/app/(frontend)/join/page.tsx, src/app/(frontend)/news/page.tsx]
- **must_not_create**: [vitest.unit.config.mts, tests/unit, src/app/(frontend)/styles.css]
- **injected_skills**: [test-governance, dev-frontend-standards, ui-walkthrough]

### 描述

重构 Playwright 配置与关键旅程，区分 PR Chromium 快速集和发布 Chromium/Firefox/WebKit 完整集；覆盖代表性移动视口、导航/菜单、主题、同页语言切换、CTA 分流、申请不可用、动态详情、404、metadata 和内部链接。加入可重复的无障碍与 Lighthouse/性能验证或等价脚本；人工键盘和视觉走查结果回填 audit register。修复 flaky 根因，不用 retries 掩盖。

### 验收标准

- [ ] Chromium、Firefox、WebKit 和代表性移动视口关键路径通过
- [ ] zh/en、动态 slug、菜单、主题、CTA、外链异常、404、SEO 与链接均有保护
- [ ] 自动 a11y 无严重/高影响问题，人工键盘路径完整
- [ ] 代表性页面达到 Performance ≥90、其余 Lighthouse 类别 ≥95，或有用户批准例外
- [ ] e2e 可在隔离 `127.0.0.1:3100` 等确定端口运行且重复无 flaky
- [ ] 覆盖 F-006、F-007、F-008、F-009、F-015、F-018、F-019、F-028、F-029

### 涉及文件

- playwright.config.ts
- tests/e2e/**
- tests/helpers/**

---

## T-011: 治理 README、docs 与历史规格状态 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: docs
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 12
- **dependencies**: [T-002, T-003, T-004, T-005, T-006, T-007, T-008, T-009, T-010]
- **requires**: []
- **provides**: [README.md, CONTRIBUTING.md, docs/README.md, docs/overview.md, docs/content-authoring.md, docs/deploy-pages-dns.md, docs/deploy-docker.md, docs/design/design-system.md, docs/dev/README.md]
- **consumes**: [package.json, Dockerfile, .github/workflows/ci.yml, vitest.unit.config.mts, playwright.config.ts, docs/dev/repository-wide-release-optimization/audit-register.md, docs/dev/repository-wide-release-optimization/content-fact-register.md]
- **must_not_create**: [docs/dev/repository-wide-release-optimization/baseline-after.md, docs/dev/repository-wide-release-optimization/release-readiness-report.md]
- **injected_skills**: [doc-update, doc-polish]

### 描述

建立 README → docs index → 专题文档的单一入口；同步真实命令、Node/pnpm、内容录入、测试分层、coverage、设计系统、域名、环境变量、Pages/Docker 和发布流程。创建 `docs/dev/README.md` 作为历史规格状态登记，逐个标注完成/部分/替代/追溯并链接本轮任务；不删除历史决策。消除重复内容，以链接引用权威来源。

### 验收标准

- [ ] 新维护者可从 README 找到开发、内容、测试、设计、部署、域名和验收入口
- [ ] 文档命令、版本、路径、变量和实际实现一致且可执行
- [ ] `docs/dev/README.md` 覆盖现有全部 feature 目录并说明当前状态
- [ ] 正式域名与防御域名口径完全符合 AGENTS.md
- [ ] 无真实凭证、过时 npm/yarn 命令或相互冲突的权威说明
- [ ] 覆盖 F-030、F-031

### 涉及文件

- README.md、CONTRIBUTING.md
- docs 索引、内容/部署/设计系统文档
- docs/dev/README.md

---

## T-012: 生成治理后基线并完成发布验收 [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: acceptance
- **execution**: agent
- **model**: opus
- **estimated_files**: 3
- **dependencies**: [T-002, T-003, T-004, T-005, T-006, T-007, T-008, T-009, T-010, T-011]
- **requires**: []
- **provides**: [docs/dev/repository-wide-release-optimization/baseline-after.md, docs/dev/repository-wide-release-optimization/release-readiness-report.md, docs/dev/repository-wide-release-optimization/repository-wide-release-optimization-requirements.md]
- **consumes**: [docs/dev/repository-wide-release-optimization/baseline-before.md, docs/dev/repository-wide-release-optimization/audit-register.md, docs/dev/repository-wide-release-optimization/content-fact-register.md, package.json, vitest.unit.config.mts, playwright.config.ts, README.md]
- **must_not_create**: [src/app/(frontend)/styles.css, vitest.unit.config.mts, .github/workflows/ci.yml]
- **injected_skills**: [product-acceptance, test-governance]

### 描述

在不修改实现的前提下重复 T-000 的同环境命令集，生成 `baseline-after.md` 与 before/after 对比；执行完整路由、链接、浏览器、视觉/UX、无障碍、SEO、性能、依赖、普通 build、export、Docker（环境可用时）和文档一致性验收。回填 requirements 的 F-001..F-033 复选框，仅对有证据的条目标记完成。生成发布报告，列出范围、关键改进、命令/结果、P0/P1/P2、事实与外部依赖、批准例外和结论。若检查失败，返回对应 owner 任务修复，不在验收任务越权改代码。

### 验收标准

- [ ] baseline-after 与 before 使用相同命令、环境和计数口径并有对比表
- [ ] `rtk pnpm typecheck`、lint、unit/integration/coverage、完整 e2e、普通 build、export build 全部通过；Docker daemon 可用时镜像构建通过，不可用时明确记录环境阻塞
- [ ] coverage、浏览器、链接、SEO、a11y、性能和安全阈值满足 requirements 或有用户批准例外
- [ ] audit register 中 P0=0，未批准 P1=0；所有 F-001..F-033 有证据链接
- [ ] 事实/授权、外部飞书、备案和域名阻塞均已清除或明确阻止发布结论
- [ ] 只有满足所有发布门时报告写“可发布”，否则写“不可发布”并给出恢复任务
- [ ] 覆盖 F-002、F-016、F-018、F-019、F-020、F-032、F-033

### 涉及文件

- docs/dev/repository-wide-release-optimization/baseline-after.md
- docs/dev/repository-wide-release-optimization/release-readiness-report.md
- requirements 验收复选框

## 3. 依赖关系与并行策略

```text
T-000
  └─ T-001
       ├─ T-002 ─> T-003 ─┬─> T-004 ─┐
       │                   ├─> T-005 ─┼─> T-009 ─┐
       │                   └─> T-006 ─┘           │
       ├─ T-007 ──────────────────────> T-009/T-010
       └─ T-008 ──────────────────────> T-009/T-010

T-004/T-005/T-006/T-007/T-008 ─> T-010
T-002..T-010 ─> T-011
T-003..T-011 ─> T-012
```

- 初始 ready set 只有 T-000，满足治理 G0 唯一前置。
- T-002、T-007、T-008 在 T-001 后可并行，文件所有权不重叠。
- T-004、T-005、T-006 在共享基础 T-003 后可并行，各自拥有不同页面族。
- T-009 与 T-010 在实现完成后可并行，分别独占 unit/integration 与 e2e/config。
- T-011、T-012 为收口链，不能提前并行。

## 4. 文件契约静态检查

- `styles.css` 仅 T-002 拥有。
- `src/config/site.ts`、i18n、内容校验/公共内容类型、sitemap/robots/layout 仅 T-003 拥有。
- 三个页面族无重叠页面或内容文件。
- `package.json`、lockfile、workflows、Dockerfile 与 CNAME 仅 T-007 拥有。
- Next/TS/ESLint/PostCSS 与品牌资产仅 T-008 拥有。
- Vitest/unit/integration 仅 T-009 拥有；Playwright/e2e/helpers 仅 T-010 拥有。
- README/docs 索引仅 T-011 拥有；本功能 baseline-after/report/requirements 验收状态仅 T-012 拥有。
- `public/CNAME` 只归 T-007；T-003 不再拥有该文件，避免域名治理并发冲突。

## 5. 需求覆盖矩阵

| 需求/验收 | 主要任务 |
|-----------|----------|
| R-001 / F-001,F-002 | T-000,T-001,T-012 |
| R-002 / F-003,F-004,F-005 | T-002,T-004,T-005,T-006 |
| R-003 / F-006,F-007,F-008,F-009 | T-002,T-010 |
| R-004 / F-010,F-011,F-012 | T-001,T-004,T-005,T-006 |
| R-005 / F-013,F-014 | T-005,T-010 |
| R-006 / F-015..F-020 | T-003,T-007,T-008,T-010,T-012 |
| R-007 / F-021,F-022 | T-002,T-003,T-008,T-009 |
| R-008 / F-023,F-024,F-025 | T-007 |
| R-009 / F-026,F-027,F-028,F-029 | T-009,T-010 |
| R-010 / F-030,F-031 | T-011 |
| R-011 / F-032,F-033 | T-012 |

## 6. Overnight 执行规则

- Execution 使用 `auto`，`continue_on_failure=true`；失败任务的独立后继按依赖安全性决定是否继续。
- 每个任务遵循 TDD，并按 complex/standard 走两阶段或 combined 评审。
- 若 provider 失败，consumer 标记 blocked/terminal，不得自建简化依赖文件。
- 不自动创建 PR、不合并、不部署；G0 强制 push 仅用于治理基线冻结。
- auto 模式默认跳过额外 acceptance-reviewer，但 T-012 是不可删除的功能级发布验收任务。
