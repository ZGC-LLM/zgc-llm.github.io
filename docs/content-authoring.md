# 内容录入与事实治理

本指南面向维护成员、新闻、工作组和双语页面的编辑者。公开内容集中在 `src/content/`，类型定义位于 `src/types/content.ts`，发布校验位于 `src/lib/content-validation.ts`。

## 录入顺序

1. 确认内容是否需要具名、角色、结果、数据、承诺、Logo 或官方英文名。
2. 找到可公开使用的来源，记录来源标题、URL、发布日期、复核日期和复核人。
3. 在本轮 [事实登记](./dev/repository-wide-release-optimization/content-fact-register.md) 中确认对应事实的边界。该登记是审计记录，不代替原始来源或权利人授权。
4. 编辑相应的 `src/content/*.ts`，为事实性记录附上 `facts`。
5. 补齐中文和英文页面内容。没有核验过的官方英文专名保留中文，不自行翻译。
6. 运行内容校验、覆盖率测试和双构建。

## 发布边界

- 只发布有来源且公开范围明确的内容。仓库旧文案、测试 fixture、`published: true` 或 `named: true` 都不是授权证据。
- `publication: 'publish'` 表示该事实记录已达到当前公开条件；`neutralize` 表示页面只能使用不暗示确定关系的中性说法；`block` 不得进入公开内容。
- 冲突或未核实事实不能标记为 `publish`。
- 申请 target 的分享 URL 是公开配置，不是密钥；但 URL 可打开不等于匿名提交、信息处理告知和回执已经通过核验。
- 官网没有本地申请接口或数据库。文案只能说明本站不接收和保存申请表单字段，不能替外部平台承诺用途、保存期或联系渠道。
- 官方英文全称尚未确认。英文公开面使用 `ZGCLLM` 或 `the Alliance`。

## `FactReference` 契约

事实性内容通过 `facts` 连接审计 ID 与公开证据。下面是结构示例，字段值应替换为真实、可复核信息：

```ts
facts: [
  {
    factId: 'FACT-123',
    evidenceStatus: 'public-source',
    publication: 'publish',
    authorizedScopes: ['display-name', 'role'],
    reviewedAt: '2026-07-19',
    reviewer: '内容复核人或流程标识',
    source: {
      title: '公开来源标题',
      url: 'https://example.org/public-notice',
      publishedAt: '2026-07-01',
      reviewedAt: '2026-07-19',
    },
  },
],
```

主要字段：

| 字段               | 规则                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------- |
| `factId`           | 匹配 `FACT-NNN`，同一内容记录内唯一                                                          |
| `evidenceStatus`   | `conflict`、`editorial`、`partial`、`project-decision`、`public-source` 或 `unverified`      |
| `publication`      | `block`、`neutralize` 或 `publish`                                                           |
| `authorizedScopes` | `commitment`、`display-name`、`logo`、`official-english-name`、`result`、`role` 的无重复组合 |
| `reviewedAt`       | 真实的 `YYYY-MM-DD` 日历日期                                                                 |
| `reviewer`         | `publish` 时必填                                                                             |
| `source`           | `public-source` 或 `partial` 且发布时必填，URL 必须是安全 HTTPS                              |

`publish` 必须至少有一个允许范围。官方英文名范围只能由 `public-source` 或明确的项目权威决定支持；不要从中文名称、Logo 或第三方翻译推导。

## 新闻

新闻定义在 `src/content/news.ts`。`slug` 决定 `/news/<slug>` 和 `/en/news/<slug>`，必须为唯一的 lowercase kebab-case。

```ts
{
  slug: 'public-notice-slug',
  title: '标题',
  description: '用于列表和 metadata 的摘要',
  date: '2026-07-19',
  category: 'news',
  published: true,
  body: [
    { type: 'paragraph', text: '正文' },
    { type: 'heading', text: '小标题' },
    { type: 'list', items: ['非空条目'] },
  ],
  facts: [/* 已复核事实 */],
},
```

规则：

- `published: false` 的记录不进入新闻列表、详情静态参数或 sitemap；未知和撤回 slug 返回不可索引 404。
- `date` 必须是真实日历日期，不能只满足字符串格式。
- 普通外部行动可使用成对的 `ctaHref` 与 `ctaLabel`，URL 必须为安全 HTTPS。
- Feishu 申请行动应使用 `applicationTargetId` 与 `ctaLabel`，不要把表单裸 URL 写进新闻。`applicationTargetId` 和 `ctaHref` 互斥。
- 历史、限时或已撤回信息必须说明来源日期和当前状态，不能改写成持续有效的承诺。
- 英文新闻通过现有 overlay/accessor 补齐；未达到英文发布条件时显示明确回退状态，不静默伪装成已校对英文。

## 联盟成员

成员记录位于 `src/content/members.ts`。当前公开名录依据已登记的公开来源，页面分组由 `MEMBER_DIRECTORY_GROUPS` 决定；`MemberSummary.type` 是内部兼容字段，不代表公开组织分类或关系。

```ts
{
  id: 'organization-id',
  name: '来源中的单位全称',
  type: 'institution',
  description: '仅在来源明确时填写职务',
  facts: [/* 至少覆盖 display-name；职务还需 role */],
},
```

- `id` 使用 lowercase kebab-case，并在全部成员中唯一；名称也不能重复。
- 只展示来源明确列出的名称和职务，不据此推导当前全部会员、Logo、官方英文名或其他合作关系。
- 英文页缺少官方英文名称时保留中文专名，并在视图层标记 `lang="zh-CN"`。
- `logo` 必须是安全 HTTPS，且事实范围包含 `logo`；没有使用权时保持无图状态。
- 当前来源、发布日期和本站复核日期集中定义，不在页面组件重复硬编码。

## 工作组与公开伙伴

工作组位于 `src/content/working-groups.ts`，公开伙伴位于 `src/content/working-group-members.ts`。

- 工作组 `id`、`slug`、`title`、`description` 必填；`id` 和 `slug` 使用 lowercase kebab-case 且唯一。
- `applicationEnvKey` 只能使用登记过的工作组申请变量。
- 当前工作组 lead 使用 `named: false` 的角色化描述。未来改为 `named: true` 前，必须为该 lead 登记可发布事实，并覆盖 `display-name` 和所述 `role`。
- `responsibilities` 与 `researchDirections` 不得为空或包含空项。
- `outcomes` 允许为空。没有经过来源和结果范围核验时，使用公开空态，不填示例成果。
- 工作组伙伴列表允许为空。新增伙伴时 `id` 全局唯一，名称在组内唯一，并按名称、角色、Logo 的实际范围分别登记事实。
- 联盟成员和工作组伙伴是两套独立名录，不能从其中一个身份推导另一个身份。

## 三个申请 target

| Target ID                     | 环境变量                                            | 当前默认 |
| ----------------------------- | --------------------------------------------------- | -------- |
| `alliance`                    | `NEXT_PUBLIC_APPLICATION_URL`                       | 关闭     |
| `cybersecurity-working-group` | `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`         | 关闭     |
| `cybersecurity-program`       | `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM` | 关闭     |

配置只接受 `src/config/site.ts` 登记的 Feishu origin 和精确 path。每个 target 必须独立完成以下检查：

- 表单标题和对象与页面一致；
- 无登录环境可以查看并完成匿名提交；
- 信息处理方、用途和必要告知在提交前可见；
- 字段与当前目的相符，不要求不必要的敏感信息；
- 提交后的回执和后续预期清楚；
- 当前运营方批准启用。

未全部通过时保持变量为空。不能用通用联盟表单替代工作组或计划表单，也不能把 HTTP 200 当作发布依据。

## 双语内容

- 导航、页头、页脚等 chrome 文案在 `src/i18n/dictionary.ts` 维护，zh/en 键结构必须一致。
- 页面正文按领域在 `src/content/` 中维护，通过 `getXxx(locale)` 或明确的 localized overlay 读取。
- 中文事实变化时同步检查英文语义。英文可以调整语序，但不能增加中文没有的角色、承诺、成果或资格规则。
- `resolveWithStatus` 可识别中文回退。发布页不应在没有提示的情况下混入大段中文正文。
- 机构官方英文名、商标和专名必须来自对应公开来源；找不到时保留中文。

## 验证

内容校验会检查必填字段、真实日期、枚举、kebab-case、唯一性、HTTPS、内容块、CTA 互斥、申请 allowlist、事实 ID、复核人、来源、发布决定和授权范围。

`error` 会直接失败；`warning` 用于未复核事实或发布准备缺口。最终发布验收要求当前内容的 error 和 warning 都为 0，不能因为 warning 不直接抛错而忽略它。

```bash
pnpm typecheck
pnpm lint
pnpm test:coverage
pnpm build
pnpm build:export
```

涉及路由、语言、metadata、CTA 或外链状态时，再运行：

```bash
pnpm test:e2e:chromium
pnpm test:e2e
```
