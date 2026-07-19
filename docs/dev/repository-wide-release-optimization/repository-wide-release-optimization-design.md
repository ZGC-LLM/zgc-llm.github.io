---
feature: repository-wide-release-optimization
type: design
complexity: complex
generated_by: spec-dev
generated_at: 2026-07-19T02:30:00+08:00
version: 1
based_on:
  - repository-wide-release-optimization-requirements.md
---

# 技术设计文档: 全仓发布级深度优化

## 0. 设计结论

本轮采用“**证据冻结 → 全量审计 → 共享基础治理 → 页面族整改 → 工程与测试治理 → 文档收口 → 发布复验**”的渐进式方案，不做脱离事实与现状的整站推倒重写。

核心决策如下：

1. 保持 Next.js 16、React 19、TypeScript、Tailwind CSS 4 和纯静态官网边界；中文根路径与 `/en/*` 英文路径保持兼容。
2. `www.zgc-llm.org.cn` 继续作为唯一正式 canonical 域名；飞书公开问卷继续作为外部申请入口，官网不接收或保存申请人个人信息。
3. 先统一设计 token、全站 chrome、交互状态和 SEO/路由基础，再分页面族优化，避免多个任务同时争用共享文件。
4. 中文是事实权威源，英文保持信息等价；具名机构、数字、成果、政策和备案信息必须进入事实核验登记，不以“文案优化”为由推定其正确。
5. 覆盖率、浏览器矩阵、链接、无障碍、性能与双构建目标均成为可复现发布证据；覆盖率不以低价值断言换数字。
6. 既有 `docs/dev/` 规格是审计输入。实施时为其标注“完成 / 部分完成 / 被替代 / 仅供追溯”，本规格作为本轮发布治理的总入口，但不抹除历史。

## 1. 架构概览

### 1.1 当前系统

```text
类型化内容 src/content/* ─┐
站点配置 src/config/* ─────┼─> locale 感知页面视图 src/components/pages/*
i18n src/i18n/* ───────────┘              │
                                           v
中文 App Router 路由 /(frontend)/* + 英文 /en/*
                                           │
                       ┌───────────────────┴──────────────────┐
                       v                                      v
             GitHub Pages 静态导出                    Docker standalone
```

已观察到的治理重点：

- 全局样式集中在约 1,400 行的 `styles.css`，页面视觉已具备 v2 基础，但 token、状态和页面细节仍需系统复核。
- 中文根路径与 `/en/*` 已并存，页面视图大多复用，但仍存在页面内文案、内容配置和元数据多处维护的可能。
- CI 已具备类型、lint、coverage、e2e 和依赖审计，但覆盖率只报告不阻断，Playwright 当前仅 Chromium，CI 与 Pages 部署仍各自安装和构建。
- `next.config.ts` 支持 export/standalone 双目标；Docker、Actions 和 `.env.example` 的公开环境变量必须逐项比对，防止漂移。
- 现有 unit/e2e 数量较多，但需要按风险重新划分职责、消除重复断言并补齐浏览器、可访问性、链接与发布产物验证。
- 历史上线、页面重设计、CI/测试等规格多份并存，状态未形成统一索引。
- 公开内容中可能存在需核验的“主管部门指导”、具名合作关系、占位备案号、英文初稿等事实风险。

### 1.2 目标架构

```text
事实与内容层
  ├─ src/content/*：公开事实、双语内容、授权/发布状态
  ├─ src/config/site.ts：域名、导航、外部申请入口
  └─ content/fact audit：事实来源与待确认项
              │
              v
展示与交互层
  ├─ 共享设计 token + 可访问状态
  ├─ SiteChrome / Header / Footer / Navigation
  ├─ 页面族视图（定位、参与、信息）
  └─ 中文根路径 + /en 对应路径
              │
              v
质量与发布层
  ├─ unit / component / integration / e2e
  ├─ Chromium / Firefox / WebKit + 移动视口
  ├─ metadata / links / static export / Docker
  ├─ CI 质量门 + Pages 部署
  └─ baseline-before / baseline-after / release report
```

## 2. 审计模型

### 2.1 审计矩阵

实施阶段创建可追踪的 `audit-register.md`，至少覆盖以下维度：

| 维度 | 覆盖范围 | 主要证据 |
|------|----------|----------|
| 路由 | 中文静态页、英文对应页、动态 slug、404、sitemap、robots | 构建产物、链接扫描、路由测试 |
| 视口 | 360、390、768、1024、1280、1440+ | Playwright 截图与人工复核 |
| 输入 | 键盘、鼠标、触控、减少动态效果 | 焦点路径、语义和交互测试 |
| 主题 | light、dark、系统偏好、首帧与持久化 | 主题测试、截图和对比度检查 |
| 浏览器 | Chromium、Firefox、WebKit | 发布矩阵 e2e |
| 内容状态 | filled、empty、缺失外链、未知 slug、长英文 | 单元/组件/e2e 断言 |
| SEO | title、description、canonical、hreflang、OG、JSON-LD | 单元测试与导出 HTML 扫描 |
| 工程 | type、lint、依赖、死代码、配置漂移 | 命令输出与 git grep |
| 交付 | 普通 build、export、Docker 配置、Pages | CI 结果和产物核验 |
| 文档 | README、docs 索引、历史规格、域名与命令 | 文档审计表 |

问题条目统一包含：ID、页面/文件、复现条件、证据、严重度 P0/P1/P2、关联需求、整改任务、复验结果和例外批准。发布前 P0 必须为零；P1 必须修复或由用户明确接受。

### 2.2 历史规格裁决

`docs/dev/` 下的历史规格不直接驱动本轮实施。文档治理任务按以下规则处理：

- **完成**：需求已被当前实现与测试完整满足。
- **部分完成**：保留未完成项并链接到本轮对应任务。
- **被替代**：在文档顶部标明由本规格替代及原因。
- **仅供追溯**：实现已演进，文档不再作为当前操作指南。

当前 requirements、design、tasks、baseline 和 release report 不被历史文档任务改写，其所有权保留给本功能的规划与最终验收任务。

## 3. UI/UX 与内容设计

### 3.1 共享设计基础

- 保留现有品牌蓝与明暗主题方向，审计后统一颜色、排版、间距、圆角、阴影、动效、断点和焦点 token。
- `SiteHeader`、`SiteFooter`、`NavGroup`、`LanguageToggle`、`PageHero`、`SectionHeading`、按钮、卡片、空态和外链组件作为共享交互基础，先于页面族整改。
- 导航必须支持当前页、展开状态、点击外部关闭、Escape、焦点返回和移动端可触达性；纯 `<details>` 方案如无法可靠满足这些行为，应以小型 client component 替代。
- 主题切换（若保留）必须无首帧闪烁、尊重系统偏好、持久化且具有准确 accessible name；若审计确认实际产品不需要主题切换，则移除无效脚本和文档承诺，不能保留半成品。
- 动效仅用于层级和状态反馈，尊重 `prefers-reduced-motion`。

### 3.2 页面族划分

| 页面族 | 页面 | 优化重点 |
|--------|------|----------|
| 联盟定位 | 首页、联盟介绍 | 首屏价值、可信依据、重点工作、主次 CTA、联盟级表达 |
| 参与转化 | 加入联盟、工作组、工作组详情/成员/加入、网络安全生态 | 对象分流、价值与门槛、流程、外部表单和隐私边界 |
| 信息发布 | 成员伙伴、新闻列表/详情、隐私、404 | 授权状态、空态、信息密度、时间/分类、返回路径与错误恢复 |

每个页面族同时修改中文、英文、metadata 和测试，不允许只润色中文后让英文继续承载过时承诺。

### 3.3 文案治理

文案按“身份—价值—证据—参与方式—下一步”组织，避免抽象口号堆叠。建立以下规则：

- CTA 采用动作 + 对象：如“申请加入联盟”“参与网络安全工作组”“查看联盟动态”，不让不同目标共用“立即加入”。
- “提交申请”不等于“正式加入”，外部问卷前说明平台、信息处理方和后续预期。
- 所有具名机构、成员、专家、成果、数字、政策、主管部门、备案号和官方英文名进入 `content-fact-register.md`。
- 无仓库依据或公开授权的事实改为中性角色描述、待确认标记或从公开页面移除。
- 中文为事实权威源；英文必须信息等价、术语一致、符合自然商务表达，不新增承诺。

## 4. 共享技术设计

### 4.1 内容与配置边界

- 公开内容继续集中在 `src/content/`；页面组件不新增大段事实性常量。
- 域名、导航、公开申请 URL 和对外邮箱继续集中在 `src/config/site.ts`。
- 对内容增加或强化校验：slug/id 唯一、必填字段、日期、HTTPS 外链、授权/发布状态、双语覆盖和禁止错误 canonical 域名。
- 页面视图只消费已经解析的 locale 数据；路由壳负责 params、metadata 和 not-found。

### 4.2 SEO 与路由

- 共享 helper 生成 canonical、hreflang、Open Graph 和 JSON-LD，页面只提供内容参数。
- 中文 URL 保持根路径；英文映射到同页 `/en/*`；语言切换不能丢失动态 slug 或跳回首页。
- `sitemap` 覆盖全部可索引中英文静态/动态页面并携带 alternates；`robots`、canonical 和环境注入统一使用正式主域名。
- 404 不被 sitemap 收录，未知动态 slug 在 export 与 standalone 下均有确定行为。
- 构建后扫描 HTML，验证 title/description/canonical/lang/hreflang/OG/JSON-LD 和内部链接。

### 4.3 代码债务

- 默认 Server Components；仅导航/主题/语言等浏览器状态使用 Client Components。
- 删除死代码、无效 CSS、重复文案、过时注释和不再使用的依赖；不新增 `any`、宽泛 ignore 或降低 lint 规则。
- `styles.css` 可按层次整理，但不为“目录好看”做高风险大迁移；优先建立 token 与组件状态边界。
- `next.config.ts`、TypeScript、ESLint 和 PostCSS 仅做有证据的收紧，保留 export/standalone 双目标。
- 图片、字体和公开资产设置尺寸/体积预算，移除未引用或过大的历史资产前先核对引用。

## 5. CI/CD 设计

### 5.1 PR 质量流水线

CI 拆为可并行且职责清楚的检查：

1. dependency/security audit；
2. typecheck + lint；
3. unit/integration + coverage hard gate；
4. Chromium 快速 e2e；
5. production build / export contract；
6. 发布或定时完整浏览器矩阵与质量预算。

同一分支的新运行取消旧运行；依赖、pnpm store 和浏览器缓存使用精确 key。工作流保持最小权限、固定 Node 22/pnpm 11、冻结锁文件和明确 timeout。

### 5.2 部署职责

- PR CI 必须证明部署目标可构建；Pages 工作流负责生成并上传正式 export 产物。
- 设计阶段不强行要求跨 workflow 复用 artifact：如果复用会增加触发、权限和可信边界复杂度，可保留一次部署构建，但必须在文档中解释它承担“发布产物生成”而非无意义重复。
- Pages 部署必须依赖质量通过，或由受保护 `main` + 必需 CI 检查保证；不得在失败时继续部署。
- Dockerfile、`.env.example`、CI 和 deploy 对所有 `NEXT_PUBLIC_*` 公共变量保持同表一致，不写入真实密钥。

## 6. 测试治理设计

### 6.1 分层

```text
tests/
├── unit/          # 纯函数、内容/config/SEO/路由约束
├── integration/   # 页面视图、共享组件和多模块协作（确有价值时建立）
├── e2e/           # 核心用户旅程、浏览器、视口和导出行为
└── helpers/       # 端口、fixture、断言与测试数据
```

不为了目录对称机械移动测试；只有当职责确实属于 integration 时才迁移。测试优先使用角色、名称、可见状态与 URL 断言，稳定 `data-testid` 仅用于无法以语义定位的控件。

### 6.2 覆盖率与关键风险

- 全局 lines/statements/functions ≥ 90%，branches ≥ 85%，由 Vitest 阈值和 CI 硬门执行。
- `site.ts`、内容校验、i18n 路由、metadata/structured data、申请入口等关键逻辑覆盖全部重要分支。
- 覆盖率不足先识别真实行为盲区；不得通过调用无意义 getter 或复制实现逻辑填数。

### 6.3 浏览器与非功能验收

- PR 快速路径以 Chromium 为主；发布/定时矩阵覆盖 Chromium、Firefox、WebKit 和代表性移动设备。
- e2e 覆盖导航、移动菜单、主题、语言同页切换、CTA 分流、外链异常态、动态详情、404 与关键 SEO。
- 自动无障碍扫描与人工键盘检查结合；性能使用固定环境、代表性路由和多次运行，阈值遵循 requirements。
- flaky 必须修根因，retry 只用于收集诊断，不作为通过标准。

## 7. 文档治理设计

- README 是首次进入入口；`docs/README.md` 是深度文档索引。
- 域名、环境变量、开发命令、内容录入、测试分层、设计系统、Pages、Docker 和发布验收各自只有一个权威说明，其余文档链接引用。
- 历史规格增加状态标记和总索引，不删除有追溯价值的设计决策。
- 文档中的版本、命令和路径必须通过仓库现状验证；示例不得包含真实凭证。

## 8. 治理基线 G0

### 8.1 强制顺序

`T-000` 是唯一无依赖任务，必须在任何实现或整改任务之前完成，且不可并行、不可跳过、不可后置：

1. 生成 `baseline-before.md`；
2. 记录时间、HEAD、工作区、环境、命令全文、原始结果摘要、计数和失败项；
3. 以独立 Conventional Commit 提交：`chore: freeze baseline before repository-wide governance`；
4. 将该提交推送到当前 feature 分支；
5. 确认远端存在该独立 commit 后才解锁后继任务。

### 8.2 基线命令集

所有命令遵循仓库规则以 `rtk` 开头；需要原始输出时使用 `rtk proxy`：

```text
rtk git rev-parse HEAD
rtk git status --short
rtk node --version
rtk pnpm --version
rtk pnpm typecheck
rtk pnpm lint
rtk pnpm test:coverage
rtk proxy pnpm test:e2e
rtk pnpm build
rtk proxy env BUILD_TARGET=export pnpm build
rtk docker version
rtk docker build -t zgcllm-site:governance-baseline .
rtk pnpm audit --prod --audit-level high
rtk git grep -n -E 'TODO|FIXME|HACK|@ts-ignore|eslint-disable|\bany\b'
rtk git grep -n -E 'zgcllm\.(org\.cn|cn|net)|zgc-llm\.(org\.cn|cn|net)'
rtk git grep -n -E 'NEXT_PUBLIC_|permissions:|uses:' -- '*.yml' '*.yaml' '*.toml' 'Dockerfile' '.env.example'
```

`baseline-before.md` 还需记录：coverage summary、测试数量/失败数、构建路由数量、Docker 可用性/构建结果、内部链接/SEO 初始问题数、P0/P1/P2 初始数，以及无法在本地完成的外部检查。Docker daemon 不可用时记录环境阻塞，不因此伪造通过结果。

### 8.3 治理后对比

最终任务用同一命令、同一环境生成 `baseline-after.md`，表格比较 before/after。阈值变化、失败转绿、问题闭环、仍存在的例外和外部依赖必须可追溯到 audit register。

## 9. 迁移与任务 DAG

```text
T-000 基线冻结
  └─ T-001 审计与事实登记
       ├─ T-002 共享 UI/交互基础 ──> T-003 SEO/路由基础
       │                                 ├─ T-004 首页/联盟
       │                                 ├─ T-005 参与/工作组/网络安全
       │                                 └─ T-006 成员/新闻/隐私/404
       ├─ T-007 CI/CD 与依赖
       └─ T-008 工程配置与资产债务

T-004..T-008 ──> T-009 unit/integration/coverage
T-004..T-008 ──> T-010 e2e/浏览器/a11y/性能
T-002..T-010 ──> T-011 文档治理
T-009..T-011 ──> T-012 baseline-after 与发布验收
```

ready-queue 只依据显式 dependencies 和 provides/consumes 派生边解锁；`parallel_group` 仅作可读标签，不作为波次 barrier。`styles.css`、`package.json`、工作流、测试配置、README/docs 索引均只有一个任务所有者。

## 10. 安全、回滚与发布结论

- 不新增后台、数据库、账户或官网内表单提交。
- 外链必须 HTTPS，noopener/noreferrer 与离站说明完整；公开变量不等于密钥，但不得混入凭证。
- 对不确定事实采用阻塞、移除或中性表达，不用“可能正确”冒充上线依据。
- 每个实现任务开始前记录 base commit，失败修复只触及其文件所有权范围；跨任务热点通过依赖串行。
- 不使用破坏性 Git 操作；用户原工作区和原有未跟踪文件不在本 worktree 范围。
- `T-012` 只有在 P0=0、未接受 P1=0、质量门全绿、事实/外链阻塞清除时才能给出“可发布”。否则报告必须明确写“不可发布”及恢复路径。

## 11. Planning 闸门决策

本设计没有需要改变已确认产品方向的新决策。实施默认采用：

- 当前隔离分支和 worktree；
- overnight 自动执行，单任务失败后继续可独立任务；
- G0 基线独立 commit 并 push；
- 不自动建 PR、不自动合并、不部署生产；
- auto 模式按 SDD 默认不调用额外 acceptance-reviewer，但 `T-012` 保留完整功能级发布验收与报告，因此不会跳过 requirements 中的最终质量门。
