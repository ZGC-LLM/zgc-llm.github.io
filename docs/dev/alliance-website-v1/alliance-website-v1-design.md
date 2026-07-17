---
feature: alliance-website-v1
phase: design
status: approved
generated_at: 2026-07-15
version: 1
---

# 技术设计: 中关村自主大模型产业联盟官网一期

> **更新补记（2026-07-16）**：本文件为 alliance-website-v1 开发期的历史设计记录。项目已在 PR #4 中移除 Payload CMS 与 PostgreSQL，收敛为纯静态官网——公开内容由 `src/content/` 驱动，加入申请通过飞书表单外链承接。以下涉及 Payload / 数据库的内容仅作历史留存，不代表当前架构。

## 1. 设计目标

在现有 Next.js 16、React 19、Tailwind CSS 4、Payload CMS 3 项目上，将初始化占位页建设为可正式发布的联盟官网一期。公开内容采用类型化本地配置，由 Server Components 渲染；Payload 与 PostgreSQL 保留，但不作为官网内容展示和飞书申请跳转的运行依赖。

设计必须同时满足：

- 联盟总品牌优先，网络安全生态作为厂商中立的重点专项。
- 首页以机构生态共建为主转化，以专业用户加入为次转化。
- 不在官网收集申请数据，申请由两个可配置的飞书表单承接。
- 在缺少正式 Logo、成员授权、表单地址或新闻素材时仍能安全上线预览，不出现虚假信息或无效入口。
- 以静态、可索引、低客户端 JavaScript 的实现保证访问性能与可维护性。

## 2. 关键技术决策

| 决策 | 选择 | 原因 |
|---|---|---|
| 渲染方式 | Next.js App Router + Server Components | 内容以公开展示为主，无需客户端状态；有利于 SEO、性能与测试 |
| 内容来源 | TypeScript 类型化配置 | 一期由开发人员维护；不增加 Markdown/MDX 解析依赖，编译期即可发现字段错误 |
| 内容后台 | 保留 Payload，不接入一期公开内容 | 保留未来演进能力，同时避免官网内容与数据库可用性耦合 |
| 申请流程 | 集中配置的飞书外链 | 不建设账号、表单、审核、上传或数据同步系统 |
| 样式 | Tailwind CSS 4 + `--alliance-*` CSS Token | 延续现有技术栈，组件中使用语义 Token，避免散落硬编码色值 |
| 页面交互 | Server Components 优先；仅必要交互使用 Client Component | 降低 JavaScript 体积和 hydration 成本 |
| 新闻内容 | 类型化内容块，不开放任意 HTML | 保持简单、安全，避免引入富文本渲染和 XSS 面 |
| 图片 | 本地授权素材优先；无素材时使用抽象图形与纯 CSS | 不引入未经授权的成员 Logo、人物或攻防图片 |

## 3. 路由与信息架构

| 路由 | 页面目的 | 主要行动 |
|---|---|---|
| `/` | 建立联盟认知，展示重点方向、网络安全生态、伙伴与最新动态 | 机构生态共建 |
| `/alliance` | 联盟宗旨、定位、组织机制、发展方向与联系信息 | 了解参与方式 |
| `/working-groups` | 展示联盟工作组和重点专项 | 查看专项 |
| `/cybersecurity` | 厂商中立的网络安全生态独立专题 | 机构共建 / 专业用户加入 |
| `/members` | 按公开授权展示成员或生态伙伴 | 申请加入联盟 |
| `/news` | 新闻、活动、行业观察与成果列表 | 阅读详情 |
| `/news/[slug]` | 单条公开内容详情 | 返回新闻中心 / 生态共建 |
| `/join` | 机构合作价值、参与方式、流程与常见问题 | 跳转机构飞书表单 |
| `/professionals` | 专业用户适用人群、参与方式与权益 | 跳转专业用户飞书表单 |
| `/privacy` | 官网访问与外部表单相关隐私说明 | 联系联盟 |

页头一级导航建议为“联盟介绍、工作组与专项、网络安全生态、成员伙伴、新闻动态”；“生态共建”使用主按钮，“专业用户加入”放入页头次级入口或移动菜单。

## 4. 内容与配置模型

### 4.1 目录设计

```text
src/
├── app/(frontend)/
│   ├── alliance/page.tsx
│   ├── cybersecurity/page.tsx
│   ├── join/page.tsx
│   ├── members/page.tsx
│   ├── news/[slug]/page.tsx
│   ├── news/page.tsx
│   ├── privacy/page.tsx
│   ├── professionals/page.tsx
│   ├── working-groups/page.tsx
│   ├── not-found.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/site/
│   ├── external-application-link.tsx
│   ├── page-hero.tsx
│   ├── section-heading.tsx
│   ├── site-footer.tsx
│   └── site-header.tsx
├── content/
│   ├── alliance.ts
│   ├── cybersecurity.ts
│   ├── members.ts
│   ├── news.ts
│   └── working-groups.ts
├── config/site.ts
└── types/content.ts
```

若实现时发现单个页面内容很短，可合并配置文件；不得把全部内容重新堆回首页组件。

### 4.2 核心类型

```ts
export interface NavigationItem {
  href: string
  label: string
}

export interface ExternalApplicationTarget {
  href?: string
  label: string
  unavailableMessage: string
}

export interface WorkingGroupSummary {
  description: string
  href: string
  id: string
  title: string
}

export interface MemberSummary {
  description?: string
  id: string
  logo?: string
  name: string
  type: 'founding' | 'institution' | 'research' | 'ecosystem'
}

export interface NewsEntry {
  category: 'news' | 'event' | 'insight' | 'result'
  date: string
  description: string
  featured?: boolean
  published: boolean
  slug: string
  title: string
  body: readonly ContentBlock[]
}

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: readonly string[] }
```

所有导出数组使用 `readonly`，页面不修改内容数据；不得使用 `any`。新闻详情只渲染受控内容块，不使用 `dangerouslySetInnerHTML`。

### 4.3 飞书入口配置

在 `src/config/site.ts` 集中定义：

```ts
export const APPLICATION_TARGETS = {
  institution: {
    href: process.env.NEXT_PUBLIC_INSTITUTION_APPLICATION_URL,
    label: '申请生态共建',
    unavailableMessage: '申请通道准备中，请通过官网联系方式与联盟联系。',
  },
  professional: {
    href: process.env.NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL,
    label: '专业用户加入',
    unavailableMessage: '申请通道准备中，请通过官网联系方式与联盟联系。',
  },
} satisfies Record<string, ExternalApplicationTarget>
```

规则：

- 仅接受 `https:` 地址；配置非法或缺失时渲染不可点击状态和替代联系提示。
- 有效外链使用 `target="_blank"` 与 `rel="noreferrer noopener"`，并在可见文案或无障碍名称中说明将打开外部表单。
- 不使用飞书访问凭证，不调用飞书 API，不把申请参数拼入 URL。
- `.env.example` 只保留示例键，不放真实敏感数据。

## 5. 组件与渲染边界

### 5.1 共享站点外壳

- `SiteHeader`：品牌、桌面导航、移动导航和双入口；优先用语义 HTML/CSS 实现，若移动菜单需要状态，再将最小菜单控件拆成 Client Component。
- `SiteFooter`：站点地图、联系信息、隐私、版权、备案占位；正式备案号缺失时不编造号码。
- `PageHero`：内页标题、摘要和可选行动区。
- `SectionHeading`：统一板块标题、说明和链接层级。
- `ExternalApplicationLink`：统一校验和呈现飞书申请入口及不可用状态。

### 5.2 页面组件

页面组件只负责选择内容、组合共享组件和定义 metadata，不复制导航、页脚、外链校验或日期格式逻辑。默认使用 Server Component；本期不引入 Zustand 或其他全局状态库。

### 5.3 空状态与错误状态

- 无公开成员：显示“成员信息整理中”，不展示虚构 Logo。
- 无新闻：显示“最新动态即将发布”，不伪造发布时间或成果。
- 表单 URL 缺失：显示申请通道准备中和联系替代方案。
- 新闻 slug 不存在或未发布：调用 `notFound()`，显示站点统一 404。
- 图片缺失：使用文字标识或抽象背景，不显示破图。

## 6. 视觉与内容设计系统

### 6.1 视觉方向

采用“可信、开放、前沿、克制”的联盟官网风格。深海军蓝作为权威基础，明亮蓝青作为技术与连接的强调色，大面积浅色内容背景保证长文阅读。当前占位页的荧光暗色风格仅保留为局部品牌氛围，不作为全站唯一背景。

正式 Logo 与 VI 尚未提供前，使用文字标识和可替换的几何标记；不得将临时字母图标包装为正式联盟 Logo。

### 6.2 Token

在 `styles.css` 的 `:root` 定义 `--alliance-*` 语义 Token：

- 品牌：`--alliance-brand-primary`、`--alliance-brand-hover`、`--alliance-brand-active`、`--alliance-brand-ink`、`--alliance-accent`。
- 文本：`--alliance-text-title`、`--alliance-text-primary`、`--alliance-text-secondary`、`--alliance-text-inverse`。
- 背景：`--alliance-bg-page`、`--alliance-bg-surface`、`--alliance-bg-subtle`、`--alliance-bg-hero`。
- 边框与状态：`--alliance-border`、`--alliance-focus`、`--alliance-success`、`--alliance-warning`。
- 间距与圆角：采用 4/8 px 网格及 4、8、12、16、24 px 标准圆角。

组件内不得散落十六进制色值；颜色对比度至少达到 WCAG AA 正文 4.5:1。所有可交互元素覆盖 hover、active 与 focus-visible 状态，并尊重 `prefers-reduced-motion`。

### 6.3 文案

- 专项统一使用“网络安全生态”，不在专项名称中绑定任何基础模型品牌。
- 用“基础模型厂商”或“模型伙伴”表达参与主体，不暗示由单一模型品牌独占。
- 主按钮统一为“申请生态共建”，次按钮统一为“专业用户加入”。
- 不声称尚未发生的合作、成果、成员身份、监管认可或能力指标。
- 按钮和导航使用简短中文，外链行为明确可预期。

## 7. 响应式与可访问性

- 内容最大宽度保持一致；桌面、平板、移动端分别验证约 1280、768、390 px 视口。
- 页面不依赖固定高度，卡片网格使用 CSS Grid，弹性子项设置 `min-width: 0` 防止溢出。
- 页首提供“跳到主要内容”的跳过链接；每页只有一个主 `h1`，标题顺序不跳级。
- 导航具有明确 `aria-label`；当前页使用 `aria-current="page"`（如需客户端路径判断，可由页面传入当前项）。
- 图标按钮必须有可访问名称；装饰图形使用 `aria-hidden="true"`。
- 键盘可访问所有链接与移动导航；焦点不被 sticky header 遮挡。
- 动效只用于层级和反馈，不影响阅读；减少动态偏好下关闭非必要位移与渐变动画。

## 8. SEO、分享与索引

- 根布局定义 `metadataBase`、标题模板、默认描述和基础 Open Graph。
- 每个主要页面导出独立 metadata；新闻详情使用 `generateMetadata`，未发布内容不生成索引页。
- `sitemap.ts` 包含全部公开静态路由和已发布新闻详情。
- `robots.ts` 允许索引公开官网，禁止索引 `/admin`、`/api` 和 Payload 管理路径。
- 正式域名使用 `https://www.zgc-llm.org.cn` canonical；开发环境可由 `NEXT_PUBLIC_SITE_URL` 覆盖。
- 社交分享图在正式品牌素材缺失时使用统一站点级默认图或无图 metadata，不生成伪 Logo。

## 9. 安全、隐私与合规

- 官网不接收、代理或存储申请数据；隐私页明确飞书表单为外部服务，并提示用户以表单内隐私告知为准。
- 外链只允许 `https:`，阻止 `javascript:`、`data:` 或无效 URL。
- 成员名称、Logo、案例和成果必须经过公开授权后再进入内容配置。
- 网络安全专题不公开未经授权的漏洞细节、攻击步骤、敏感数据或高风险能力材料。
- Payload 现有密钥校验保持不变；公开内容实现不得新增绕过认证的 Payload API。

## 10. 测试策略

### 单元测试（Vitest）

- 站点名称、正式域名、导航路由和两个申请目标唯一且集中配置。
- 飞书目标 URL 校验覆盖有效 HTTPS、缺失、非法协议和畸形 URL。
- 新闻 slug 唯一、日期可解析、只输出 `published: true` 条目。
- sitemap 不包含管理/API 路由，且包含所有公开静态路由。

### 组件测试（Testing Library）

- 扩展 `vitest.unit.config.mts` 以包含 `tests/unit/**/*.test.tsx`，并为单元/组件测试使用已安装的 `jsdom` 环境。
- 外链组件在有效 URL 时输出安全属性，在无效 URL 时输出不可用状态。
- 页头包含主导航、主次 CTA 和可访问名称。
- 空成员、空新闻、无表单 URL 的回退文案可见。

### E2E（Playwright）

- 首页能进入网络安全生态专题。
- 首页和 `/join` 的机构 CTA 指向同一飞书目标。
- 专业用户入口能到达 `/professionals`，再进入独立飞书目标。
- 移动视口可访问导航和双入口，无横向溢出。
- 新闻列表可进入已发布详情；未知 slug 返回 404。

### 验证命令

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

集成与 E2E 测试需要按现有项目约定提供 `test.env` 和本地测试数据库。若外部飞书地址未配置，测试使用安全的示例 HTTPS URL，不访问真实飞书服务。
移动端 E2E 在用例中显式设置 390 px 视口，避免依赖当前仅配置桌面 Chromium 的 Playwright project。

## 11. 交付与回滚

1. 在功能分支完成基础配置、组件和页面后先运行无数据库依赖的单元测试、类型检查与 lint。
2. 使用测试环境变量执行 build 和 E2E，确认 Payload 保留能力未被破坏。
3. 上线前由联盟提供或确认 Logo、成员授权、正式文案、联系人、隐私说明、备案号和两份飞书表单地址。
4. 飞书表单未准备好时允许部署官网，但申请入口必须显示“准备中”，不得链接到占位或个人表格。
5. 回滚时恢复到前一个应用镜像；内容配置和页面不涉及数据库迁移。

## 12. 需求追踪

| 需求主题 | 设计覆盖 |
|---|---|
| 联盟总品牌与重点专项 | 路由 `/`、`/alliance`、`/cybersecurity`，共享站点外壳 |
| 机构主转化、个人次转化 | 集中 `APPLICATION_TARGETS`、首页与加入页 CTA 层级 |
| 厂商中立 | 专题文案规范、内容模型与验收测试 |
| 静态内容维护 | `src/content/*` 类型化配置、Server Components |
| 保留 Payload | 不改 Payload 集合与后台；公开页不读取数据库 |
| 响应式与可访问性 | Token、断点、键盘、焦点、标题与动效规范 |
| SEO 与分享 | metadata、sitemap、robots、canonical |
| 合规与隐私 | 安全外链、授权内容、隐私页与高风险内容边界 |

## 13. 待运营方提供的上线资料

- 正式联盟 Logo、品牌色或 VI 文件。
- 可公开的组织介绍、工作组、成员与合作伙伴名单及 Logo 授权。
- 首批新闻、活动、成果正文和发布日期。
- 机构生态共建与专业用户加入的正式飞书表单 URL。
- 联盟联系人、邮箱、地址、隐私说明、备案号和版权主体。

以上资料缺失不阻塞技术实施，但会触发设计中定义的占位或不可用状态，不能用虚构内容替代。
