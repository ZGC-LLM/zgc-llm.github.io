# 全站页面重新设计 — 需求规格（pages-redesign-requirements）

> 产出方：`/devagent:ui-design`（设计稿）。下游：`/devagent:dev-spec-dev pages-redesign`（代码落地）。
> 本轮范围：对 ZGCLLM 官网全部页面进行一轮重新设计与优化，产出统一设计语言 v2 + 全站高保真原型。
> 本文档只定义需求与验收；**不含框架代码**。

## 1. 需求陈述

> **本轮实施范围（2026-07-16 确认）**：v2 设计 tokens + 完整 light/dark 主题 + 全站重样式 + 主题 toggle（含持久化与 SSR 无闪烁）+ 网络安全页新中文文案。**语言 toggle 仅保留 UI 占位，完整中英 i18n 延后另开 feature**（待联盟确认正式英文译文）。

将现有官网从「克制专业的品牌蓝白」升级为 **设计语言 v2**：以 Z.ai 的干净现代商务蓝白为基调，
吸收 Linear/Supabase 的精密暗色手法，新增 **light/dark 双主题**（本轮落地）与**语言切换 UI 占位**（完整中英 i18n 延后，见 §1 范围）——
并统一 hero、卡片、区块、留白与组件语言。锚点保留现有品牌蓝 `#1464d2`，不推翻信息架构。

覆盖页面（11 个原型）：首页、联盟介绍、工作组与专项、网络安全生态、成员伙伴、新闻动态、
新闻详情、机构生态共建、专业用户加入、隐私说明、404。

## 2. 验收标准

### 通用（每个页面）
- [ ] 采用 `_design-system.css` 的 token 与组件类，视觉与原型一致；无硬编码脱离 token 的色值。
- [ ] **响应式**：≥900 桌面 / <900 移动两套布局；页面多列网格在 900/520 降为单列；**header 主导航在 <1280 收起为汉堡**（完整控件集——品牌名 + 5 个中文导航 + 两条 CTA + 主题/语言 toggle 自然宽约 1220px，低于 1280 会被挤压换行，故整体收进汉堡）。
- [ ] **双主题**：light/dark 均正常，切换由 `data-theme` 驱动，`prefers-color-scheme` 作首帧兜底；文本对比度 ≥ 4.5:1。
- [ ] **语言 toggle（本轮仅 UI 占位）**：header 保留 `中/EN` 分段切换控件（含 `aria-label`），但**本轮不做完整内容双语切换**——完整中英 i18n（next-intl + 全部内容 EN 字段）延后另开 feature，待联盟确认正式英文译文后实施。控件当前可点击但暂不切换正文（或标注"即将支持"）。
- [ ] **a11y**：保留 skip-link；当前导航项 `aria-current="page"`；主题/语言 toggle 带 `aria-label`；`focus-visible` 3px 描边；语义标签（`main/section/article/nav/time/dl`）。
- [ ] header sticky + 毛玻璃；footer 深色四列。

### 分页要点
- [ ] **首页**：双栏 hero（文案 + 两张 glass 卡）；价值三卡（序号）；方向左标题右双列；深色 CTA band；成员/新闻区块需实现 **filled + empty** 两态；收尾 CTA 条。
- [ ] **联盟介绍**：大字宗旨；共同价值三卡；协作机制编号列表；发展方向双卡；联系 CTA。
- [ ] **工作组与专项**：已确认专项卡 + 虚线「持续开放协作方向」占位卡（不虚构未确认信息）。
- [ ] **网络安全生态**（内容口径：**厂商中立**，面向"自主大模型"而非单一厂商；**仅点名已授权牵头方**，受邀企业只用角色描述，不放具体数字/个人姓名）：
  - Hero：连接专业用户/真实场景/深度数据/能力评测/产业落地。
  - **生态闭环**（6 段网格，真实闭环）：模型发布 → 专业验证 → 场景落地 → 数据沉淀 → 模型增强 → 行业推广。
  - **五类关键资源**（5 卡）：模型与算力 / 学术与评测 / 数据与任务 / 专业人才 / 产业场景。
  - **四项重点行动**（4 卡）：专业用户开放计划 / 生态共建计划 / 深度数据与任务体系 / 先锋验证与发布机制。
  - **参与方式**（pill badges）：数据·任务·环境·专家·产品·评测·场景；**不强制交付原始数据**。
  - **组织机制**（6 卡，点名已授权牵头方）：联盟统筹 · 智谱模型技术牵引（对不同厂商对等开放）· 清华大学学术指导 · 数说安全 & 云起无垠联合运营 · 生态伙伴共建 · 监管协同。⚠️ 上线前须确认各牵头方公开授权；未授权者改回角色描述。
  - 深色「治理边界」band：数据合规、高风险能力治理、成果公开需授权评审、伙伴不强制交付原始数据。
  - 「开放共建」原则 pill（厂商中立/对等参与/安全可治理/持续演进）+ 双 CTA。
- [ ] **成员伙伴**：按 `founding/institution/research/ecosystem` 分组目录 + logo tile；**empty 态**（成员整理中）。仅展示公开授权成员。
- [ ] **新闻动态**：分类标签 + 日期 + 卡片列表；**empty 态**（即将发布）。
- [ ] **新闻详情**：prose 排版支持 `heading/paragraph/list` 块；发布日期；返回新闻中心。
- [ ] **机构生态共建**：共建价值 / 参与方式 / 参与流程（STEP 01-03）/ FAQ 四段；申请入口不可用时显示联系提示（沿用 `ExternalApplicationLink` 逻辑）。
- [ ] **专业用户加入**：适用人群 / 参与方式 / 参与权益（编号列表）。
- [ ] **隐私说明**：官网 vs 外部表单边界双卡 + 提交前提示 + 联系。
- [ ] **404**：左对齐大字 + 返回首页/新闻双按钮。

## 3. 设计稿引用

- 全站原型（浏览入口）：`docs/design/prototypes/index.html`
- 逐页：`alliance.html`/`working-groups.html`/`cybersecurity.html`/`members.html`/`news.html`/`news-detail.html`/`join.html`/`professionals.html`/`privacy.html`/`404.html`
- 共享样式（token 单一来源）：`docs/design/prototypes/_design-system.css`
- 共享壳（header/footer/toggle 注入）：`docs/design/prototypes/_shell.js`

## 4. Design Token 来源

- 规范文件：`docs/design/design-system.md`（本地规范，**优先级最高**）
- 命名空间：`--brand-*`、`--accent*`、`--bg-*`、`--border*`、`--text-*`、`--radius-*`、`--shadow-*`
- 锚点来源：现有 `src/app/(frontend)/styles.css`（品牌蓝 `#1464d2` 等保留）
- 风格参考：Z.ai（智谱）、Linear、Supabase（仅调性参考，数值以本地规范为准）
- 双主题：`:root`（light）+ `html[data-theme="dark"]` 覆盖；token 均为**字面值展开**（无 `{ref}` 链式引用）。

## 5. UX 维度清单（覆盖情况）

| 维度 | 状态 | 说明 |
|---|---|---|
| 响应式 | ✅ | 页面网格 900/520 双断点；header 主导航 <1280 收汉堡（控件集较宽） |
| 主题 | ✅ | light/dark 完整，含对比度校对 |
| 状态 | ✅ | 首页/成员/新闻 filled+empty；⚠️ loading 态跳过——纯静态展示站无异步加载 |
| a11y | ✅ | skip-link / aria-current / aria-label / focus-visible / 语义标签 |
| i18n | 🟡 本轮部分 | **本轮仅语言 toggle UI 占位**（含 aria-label，不切换正文、不改 `html lang`、无 next-intl）；完整 CN/EN 双份内容延后另开 feature（以 §1 范围、§2 语言 toggle 项为准）。RTL 暂不考虑（无阿拉伯/希伯来语需求）。 |

## 6. 落地建议（不强制，由 dev-spec-dev 决定）

- 技术栈沿用 Next.js 16 App Router + Tailwind CSS 4；token 落到 `styles.css` 的 `:root` 与 `[data-theme="dark"]`。
- 主题/语言状态：建议 `next-themes` 或轻量 `data-*` + `localStorage`；SSR 首帧防闪烁。
- 双语：本轮为静态站，建议逐步引入 `next-intl` 或按 `src/content/` 增加 EN 字段；原型的 `data-cn/data-en` 仅为演示，不作为最终实现约束。
- 组件复用现有 `PageHero`/`SectionHeading`/`SiteHeader`/`SiteFooter`，按 v2 扩展主题/语言 toggle 与深色变体。

## 7. 待确认（落地前）

- EN 文案：原型英文为设计占位，正式上线需联盟确认译文。
- 主题/语言是否需要持久化与 SSR 无闪烁（影响实现选型）。
- 成员/新闻真实数据接入时机（当前 `src/content/` 为空或少量）。
- **网络安全页牵头方授权**：组织机制点名的智谱、清华大学、数说安全、云起无垠须确认已获**公开授权**；未授权者上线前改回角色描述。
- **网络安全页内容边界**：受邀但未授权企业不点名、不放具体申请数字与个人姓名、不含 GLM 独家/竞争先发等内部战略口径——公开页保持厂商中立与治理边界。
