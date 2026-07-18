# 技术设计文档: 区分「联盟成员伙伴」与「工作组伙伴」

> 对应需求：`member-partner-distinction-requirements.md`（R1 术语区分 / R2 关系互链 / R3 导航二级分组 / R4 首页体现）。
> 复杂度：standard。纯静态展示层 + 导航配置改动，不动数据结构、不引后端。

## 1. 架构概览

### 1.1 现状（与本需求相关的既有结构）

```
src/types/content.ts          NavigationItem { href, label }   ← 待扩展 children
src/config/site.ts            SITE_NAVIGATION（扁平 5 项）      ← 「成员伙伴」改为分组
                              PUBLIC_STATIC_ROUTES（激活态/静态路由来源）
src/i18n/dictionary.ts        dict(locale).nav（chrome 导航文案，zh/en 双份，含 key-parity 测试）
src/components/site/
  site-header.tsx             NavigationLinks 服务端 helper：SITE_NAVIGATION → NAV_LABEL_KEYS → dict
                              桌面 <nav> + 移动 <details className="mobile-menu">，两处复用同一 helper
  site-navigation-link.tsx    'use client'，usePathname() 计算 aria-current（激活态）
  language-toggle.tsx         既有 client toggle（参考模式）
src/components/pages/
  members-view.tsx            STRINGS(zh/en)，MembersView + MembersDirectory
  home-view.tsx               STRINGS(zh/en)，HomeView（含「成员伙伴」区块）
src/app/(frontend)/
  members/page.tsx            metadata.title='成员伙伴'（待改术语）
  working-groups/[slug]/members/page.tsx  STRINGS(zh/en)，WorkingGroupMembersView/Directory/Metadata
  styles.css                 .site-header / .site-nav-link / .mobile-menu 等样式
```

**关键约定（不可违背）**：
- 页面正文文案走各视图文件内的本地 `STRINGS: Record<Locale, ...>`；框架/导航文案走 `src/i18n/dictionary.ts` 的 `dict(locale)`。两套机制均已存在，**不新增第三套 i18n 机制**。
- `dict` 有 key-parity 测试（`i18n.test.ts`「every locale dictionary shares the same key structure」），凡新增 `nav` 键必须 zh/en 同步，否则测试红。

### 1.2 数据流（导航二级分组，改造后）

```
SITE_NAVIGATION (site.ts, 含 group 节点 + children)
   │  结构来源（href / children / zh 字面 label 作兜底）
   ▼
site-header.tsx  逐节点判定：
   ├─ 叶子节点(有 href, 无 children) → <SiteNavigationLink>（client, 既有）
   └─ 分组节点(有 children)          → <NavGroup>（新增 client 组件）
                                        ├─ 触发器（summary/button）+ 分组标签(dict)
                                        └─ 子项列表 → <SiteNavigationLink> ×N
   │  桌面 <nav> 与移动 <details> 面板复用同一渲染逻辑（variant 区分样式）
   ▼
localizePath(href, locale) → 最终 /members、/working-groups（en 加 /en 前缀）
```

## 2. 组件设计

### 2.1 新增组件

#### `src/components/site/nav-group.tsx`（'use client'）
二级分组渲染组件，桌面下拉 + 移动内联折叠共用。

- **Props**：`{ label: string; children: readonly { href: string; label: string }[]; variant: 'desktop' | 'mobile' }`（`label`/子项 `label` 由 header 传入已本地化文案；`href` 已 `localizePath`）。
- **交互与可访问性**（R3 验收核心）：
  - 触发器为原生可聚焦元素：`<button type="button" aria-expanded={open} aria-controls={panelId}>` 控制展开面板 `<ul id={panelId} role="menu">`（或等价 disclosure 结构）。
  - 键盘：Enter/Space 切换展开；Escape 关闭并把焦点还给触发器；子项为原生 `<a>`，Tab 序自然可达。
  - 桌面 `variant='desktop'`：面板为绝对定位下拉；鼠标 hover 与键盘 focus-within 均可展开；点击外部（pointerdown 监听）与路由变化时关闭。
  - 移动 `variant='mobile'`：面板内联展开（不用绝对定位），嵌在既有 `.mobile-menu__panel` 内。
  - **激活态**：触发器在「任一子项路由命中」时置 `aria-current="page"` / 激活样式（复用 usePathname 判定，与 `SiteNavigationLink` 同源逻辑）；子项自身激活态由 `SiteNavigationLink` 负责。
- **实现约束**：优先复用既有 `SiteNavigationLink` 渲染子项，避免重复激活态逻辑。open 状态用 `useState`；关闭副作用（Escape / outside-click / pathname 变化）用 `useEffect`。SSR 首帧默认收起、`aria-expanded={false}`，保证纯静态导出下无水合告警。

### 2.2 修改组件

#### `src/types/content.ts` — `NavigationItem` 扩展
```ts
export interface NavigationItem {
  /** 叶子节点目标路由；分组节点（有 children）可省略 */
  href?: string
  label: string
  /** 二级子项；存在即视为分组节点 */
  children?: readonly NavigationItem[]
}
```
- **向后兼容**：`href` 由必填改可选是类型放宽，现有全部扁平项都带 `href`，编译与运行行为不变。新增不变式（文档 + 测试保证）：**叶子有 `href` 无 `children`；分组有 `children` 无 `href`**。
- `SiteNavigationLink` 仅用于叶子，其入参可保持 `{ href: string; label: string }`（header 在渲染叶子时已确保 `href` 存在）。

#### `src/config/site.ts` — `SITE_NAVIGATION`
将扁平项 `{ href: '/members', label: '成员伙伴' }` 替换为分组节点：
```ts
{
  label: '成员伙伴',
  children: [
    { href: '/members', label: '联盟成员' },
    { href: '/working-groups', label: '工作组成员' },
  ],
}
```
- `PUBLIC_STATIC_ROUTES` **无需改动**（`/members`、`/working-groups` 已在列）。
- zh 字面 `label` 仅作兜底；实际展示走 dict（见下）。

#### `src/i18n/dictionary.ts` — `dict.nav` 扩展
- 保留 `members`（作为分组标题「成员伙伴」/「Members」）。
- 新增 `allianceMembers`（联盟成员 / Alliance Members）、`workingGroupMembers`（工作组成员 / Working Group Members），zh/en 同步。
- **标签解析改造**（关键，见 §3.2）：header 现有 `NAV_LABEL_KEYS`（href → dict key）在「子项 `工作组成员` 复用 `/working-groups`，却需要与顶层 `工作组` 不同的标签」处会发生 **href 键冲突**。因此标签解析不能再纯以 href 为键，需按节点身份解析（叶子按 href、分组标题与其子项显式指定 dict 键）。

#### `src/components/site/site-header.tsx`
- `NavigationLinks` helper 改为按节点类型分发：叶子 → `SiteNavigationLink`，分组 → `NavGroup`。桌面 `<nav>` 与移动 `.mobile-menu__panel` 继续复用同一 helper（避免两处逻辑漂移）。
- 标签解析：叶子沿用 href→dict 键；分组标题与子项使用显式 dict 键（`members` / `allianceMembers` / `workingGroupMembers`），规避 §3.2 的 href 冲突。

#### 页面文案组件（R1/R2/R4，彼此独立）
- `members-view.tsx` + `members/page.tsx`：`heroTitle` / `heroEyebrow` 术语「成员伙伴」→「联盟成员伙伴」；新增关系说明「部分成员亦参与工作组共建」+ 链接至 `/working-groups`（zh/en）；`members/page.tsx` 的 `metadata.title` 同步术语。
- `working-groups/[slug]/members/page.tsx`：`pageTitle` / eyebrow / og 后缀术语改为「工作组共建伙伴/成员」；新增关系说明「名单单位多为联盟会员」+ 链接至 `/members`（zh/en）。
- `home-view.tsx`：成员区块改为体现两类入口（联盟成员 → `/members`、工作组成员 → `/working-groups`），文案与顶栏分组语义一致（zh/en）。

## 3. 接口设计

### 3.1 组件接口
- `NavGroup(props: { label: string; children: readonly {href: string; label: string}[]; variant: 'desktop' | 'mobile' })`。
- `SiteNavigationLink(props: NavigationItem)` 保持不变（仅叶子使用）。

### 3.2 内部接口：导航标签解析（含 href 冲突处理）
- 现状：`NAV_LABEL_KEYS: Record<string /*href*/, keyof Dictionary['nav']>`。
- 问题：子项「工作组成员」目标为 `/working-groups`，与顶层「工作组」同 href，但需不同标签，纯 href 键无法区分。
- 方案：叶子仍按 href 取键；分组标题与其子项由 header 显式指定 dict 键（分组=`members`，子项=`allianceMembers`/`workingGroupMembers`）。即标签解析随「节点在结构中的位置」而非仅 href。`types/content.ts` 不引入对 dictionary 的依赖（保持分层）。

## 4. 数据设计
- **不新增、不修改任何数据模型**：`MemberSummary`、`WorkingGroupMember` 字段零改动；`MEMBERS`、`WORKING_GROUP_MEMBERS` 名单内容不动。
- 唯一类型改动为 `NavigationItem` 增加可选 `children` 并放宽 `href` 为可选。

## 5. 技术选型
- **导航展开**：采用 `useState` + `useEffect` 的 client `NavGroup`，而非纯 CSS `<details>`。理由：R3 要求键盘可访问 + 激活态高亮 + Escape/外部点击关闭 + 桌面下拉/移动内联两形态，client 组件能精确控制 `aria-expanded`、焦点归还与路由变化关闭；与既有 `SiteNavigationLink`/`LanguageToggle` 的 client 模式一致。移动端既有 `<details className="mobile-menu">` 外层容器保留，`NavGroup` 作为其面板内的内联折叠子项。
- **i18n**：沿用既有双机制（dict 管导航 chrome 文案、页面 STRINGS 管正文），不引入新库。

## 6. 安全考量
- 纯展示层改动，无用户输入、无外链新增（子项均为站内派生 `localizePath`，无开放重定向）。
- 沿用治理边界：未授权单位不具名、空态占位策略不变。

## 7. 测试策略（TDD）
- **单元（Vitest + RTL）**：
  - `NavGroup`：渲染触发器与子项；点击/键盘展开；Escape 关闭并归还焦点；任一子项路由命中时触发器置 `aria-current`；`variant='mobile'` 内联渲染子项。（先写测试）
  - `site-header`：主导航含「成员伙伴」分组触发器 + 两个子项链接（`/members`、`/working-groups`）；既有「网络安全生态」激活态断言不回归（`site-components.test.tsx` 扩展）。
  - `site.ts`：`SITE_NAVIGATION` 含分组节点，其 children 指向 `/members`、`/working-groups`；`PUBLIC_STATIC_ROUTES` 不变（`site-config.test.ts` 更新）。
  - 页面文案：members 页 h1/metadata 术语「联盟成员伙伴」、互链存在（更新 `news-members-pages.test.tsx`）；wg 成员页术语 +互链（**新增** `working-group-members-page.test.tsx`，避免与 members 测试文件写冲突）；home 两类入口（更新 `home-alliance-pages.test.tsx`）。
  - `i18n.test.ts` 的 key-parity 测试自动覆盖新 `nav` 键 zh/en 同步（无需改测试，键不同步即红）。
- **门禁**：全部改动最终须通过 `pnpm typecheck && pnpm lint && pnpm test && pnpm build`。

## 8. 迁移计划
- 无数据迁移。类型放宽向后兼容。分阶段：先落类型 → 配置/字典 → 导航组件 → 页面文案（详见 tasks.md 依赖与并行分组）。
- 回滚：各改动均为独立文件级修改，按任务粒度可单独回退。

## 9. 待确认问题（Open Questions）
1. **「工作组成员」子项目标路由**：设计默认指向 `/working-groups`（工作组列表，用户从中进入各组成员页）。因该 href 与顶层「工作组」相同，在 `/working-groups/*` 下**顶层「工作组」与「成员伙伴」分组会同时呈激活态**。这是需求未明确的取舍：接受此重叠（两者语义上都「当前」），还是希望调整激活态优先级/改变子项落点？建议接受重叠，若不接受需产品确认落点。
2. **术语最终措辞**：工作组成员页统一为「工作组共建伙伴/成员」，最终对外用词（「共建伙伴」vs「共建单位」vs「成员」）建议在实施前定稿，避免全站新旧混用。
