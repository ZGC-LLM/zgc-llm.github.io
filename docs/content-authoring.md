# 内容录入指南（维护者）

> 面向官网维护者：如何新增/更新成员、新闻、工作组内容。公开内容集中在 `src/content/*.ts`（类型化 TS 常量，无 CMS）。录入错误会被 `src/lib/content-validation.ts` 的校验在 `pnpm test` 阶段拦截。

## 通用原则

- **只收录已授权可公开的内容**。未授权单位不以名单填充页面（`members.ts`、`working-group-members.ts` 的空态即体现此策略）。
- **中文为权威**。i18n 已上线（中文根路径 + `/en`），但**正文英文为后续增量**：当前英文页正文回退中文（`resolve` 缺失回退），chrome（导航/页脚/按钮）已双语（`src/i18n/dictionary.ts`）。为某字段补英文的机制见下文「双语」。
- 改完务必跑：`pnpm typecheck && pnpm lint && pnpm test && pnpm build`。

## 校验规则（`pnpm test` 会强制）

`content-validation.ts` 的 `validateAllContent()` 覆盖：必填非空、枚举合法（member `type` / news `category`）、**唯一性**（news `slug`、working-group `slug`、member `id`、working-group-member `id` 全局唯一）、**外链须 https**（news `ctaHref`、logo）、**日期须 `YYYY-MM-DD`**、`ctaHref`/`ctaLabel` 成对出现。`error` 级问题使测试失败；空态/未匹配引用为 `warning`，不失败。

## 新增新闻（`src/content/news.ts`）

在 `NEWS_ENTRIES` 数组追加一条。`slug` 决定 URL（`/news/<slug>` 与 `/en/news/<slug>`），全局唯一。`published: false` 的条目不会出现在列表/详情/sitemap。

```ts
{
  slug: 'unique-slug',              // 必填、唯一、kebab-case
  title: '新闻标题',                 // 必填
  description: '一句话摘要',          // 必填，用于列表与 OG/description
  date: '2026-07-18',               // 必填，YYYY-MM-DD
  category: 'news',                 // news | event | insight | result
  published: true,                  // false=草稿，不公开
  // featured: true,                // 可选，首页精选
  body: [                           // 必填、非空
    { type: 'paragraph', text: '段落文本' },
    { type: 'heading', text: '小标题' },
    { type: 'list', items: ['要点一', '要点二'] },
  ],
  // 可选外部行动入口（二者成对，href 须 https）：
  // ctaHref: 'https://example.feishu.cn/share/base/form/xxx',
  // ctaLabel: '填写申请',
},
```

## 新增成员（`src/content/members.ts`）

在 `MEMBERS` 追加。**仅对已公开授权具名的单位录入**；理事长/秘书长/监事长单位用 `description` 标注职务，普通成员不加。`id` 全局唯一。

```ts
{
  id: 'unique-id',                  // 必填、唯一
  name: '单位全称',                  // 必填
  type: 'research',                 // founding | institution | research | ecosystem
  // description: '理事长单位',       // 可选，职务/角色
  // logo: 'https://.../logo.png',   // 可选，须 https，须获授权后再加
},
```

## 工作组（`src/content/working-groups.ts` 与 `working-group-members.ts`）

- `WORKING_GROUPS`：`id`/`slug`/`title`/`description` 必填，`slug` 唯一（决定 `/working-groups/<slug>` 路由）。
- `leads`：负责人。**治理边界**——已公开授权具名的填 `named: true` + 真实单位名；未授权的填 `named: false` + 角色化占位描述（不写真实单位名）。`name`/`role` 必填。
- `WORKING_GROUP_MEMBERS[slug]`：工作组共建成员，**默认空数组（空态）**，获授权后再追加 `{ id, name, role?, logo? }`；`id` 全局唯一，`logo` 须 https。

```ts
// working-groups.ts —— leads 授权门示例
leads: [
  { name: '某某大学', named: true, role: '学术指导' },        // 已授权具名
  { name: '安全企业与研究人员，按优势参与共建', named: false, role: '生态伙伴' }, // 未授权，角色化占位
],
```

## 双语（英文回填，后续增量）

- **chrome 文案**：改 `src/i18n/dictionary.ts` 的 `zh`/`en` 两份，键结构必须一致（`i18n.test.ts` 会校验键完整性）。
- **正文英文**：当前正文未做 `LocalizedText` 迁移（见 launch-optimization 设计 T-102/T-109）。回填时按字段改为 `{ zh, en?, enDraft? }` 并用 `resolve(value, locale)` 取值；`en` 缺失自动回退 `zh`，`enDraft: true` 标注待人工校对。专有名词优先官方中文/官方英文。

## 录入后自检清单

- [ ] `slug`/`id` 唯一、`date` 为 `YYYY-MM-DD`、外链 https
- [ ] 未授权内容未具名（`named: false` 或不录入）
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm build` 全绿
- [ ] 如涉双语 chrome，`dict` 的 zh/en 键一致
