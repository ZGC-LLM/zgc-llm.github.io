# 项目总览

中关村自主大模型产业联盟官网是一个类型化内容驱动的 Next.js 网站。它公开联盟定位、工作组、成员来源、新闻和参与指引，不包含 CMS、数据库、登录系统或官网内申请接口。

快速上手见 [README](../README.md)，协作和质量门见 [贡献指南](../CONTRIBUTING.md)。

## 技术基线

| 领域    | 当前实现                                                 |
| ------- | -------------------------------------------------------- |
| 框架    | Next.js 16.2.6 App Router、React 19.2.6                  |
| 语言    | TypeScript 5.7.3，严格模式                               |
| 样式    | Tailwind CSS 4 与全局语义 token                          |
| Node.js | CI/Docker 使用 22.23.1；engine 为 `>=22.19.0 <23`        |
| 包管理  | pnpm 11.2.2                                              |
| 测试    | Vitest unit/integration、Playwright E2E、Axe、Lighthouse |
| 交付    | GitHub Pages 静态导出为主，Docker standalone 为备选      |

## 目录与职责

```text
src/
├── app/
│   ├── (frontend)/        中文页面、共享样式、sitemap
│   ├── (en)/              /en 英文页面
│   ├── global-not-found.tsx
│   └── robots.ts
├── components/
│   ├── pages/             页面级视图
│   └── site/              header、footer、导航、SEO 与外链状态
├── config/site.ts         canonical、导航、公开路由、申请 target
├── content/               类型化公开内容与来源记录
├── i18n/                  locale、路由、字典与 localized helper
├── lib/                   内容校验与结构化数据
└── types/content.ts       内容、事实和申请 target 类型

tests/
├── unit/                  纯函数、内容、配置和组件行为
├── integration/           路由、metadata、SEO 与跨模块契约
├── e2e/                   快速与发布级浏览器旅程
└── helpers/               路由清单、静态服务器、Axe 与 Lighthouse
```

## 请求与内容流

```text
src/content + src/config/site.ts
          │
          ├── locale accessor / route shell
          │          └── page views and site components
          │
          ├── content-validation release contract
          │
          └── sitemap / metadata / structured data
```

页面默认使用 Server Components。页头导航、语言切换等需要浏览器状态的交互才使用 Client Components。

内容中的具名主体、角色、结果和承诺通过 `FactReference` 登记来源、复核信息、发布决定和允许公开的范围。`published` 与 `named` 只影响渲染，不能作为授权证据。维护流程见 [内容录入指南](./content-authoring.md)。

## 公开路由

中文使用根路径，英文使用相同路径的 `/en` 前缀。当前有 12 组页面：

| 页面           | 中文路径                                |
| -------------- | --------------------------------------- |
| 首页           | `/`                                     |
| 联盟介绍       | `/alliance`                             |
| 工作组目录     | `/working-groups`                       |
| 网络安全工作组 | `/working-groups/cybersecurity`         |
| 工作组公开伙伴 | `/working-groups/cybersecurity/members` |
| 工作组参与指引 | `/working-groups/cybersecurity/join`    |
| 网络安全专题   | `/cybersecurity`                        |
| 联盟成员公示   | `/members`                              |
| 新闻列表       | `/news`                                 |
| 已发布新闻详情 | `/news/cybersecurity-open-program`      |
| 联盟参与入口   | `/join`                                 |
| 隐私说明       | `/privacy`                              |

12 组页面乘以两个 locale，共 24 个可索引 HTML。发布矩阵另覆盖 `/robots.txt` 和 `/sitemap.xml` 两个 SEO 路径；图像 Route Handler 与其他静态资产不计入这 26 条页面/SEO 路径。该数量由 `src/config/site.ts`、已发布新闻和测试路由清单共同保护；新增工作组或新闻后必须同步验证。

未知路由、未知动态 slug 和撤回的 `alliance-website-launch` 新闻返回 404、`noindex`，不输出 canonical，也不进入 sitemap。

## 双语与主题

- 中文内容是事实语义的基础；英文页面通过领域 accessor 和明确的英文内容读取。
- 没有已核验官方英文名称的机构在英文页保留中文专名，不自行造译名；页面用语言标记区分这些名称。
- 官方英文全称尚未确认，对外英文只使用 `ZGCLLM` 或 `the Alliance`。
- 语言切换保持当前静态或动态路径，不允许开放重定向。
- 明暗主题只跟随 `prefers-color-scheme`。head 中的脚本负责首帧，媒体查询监听负责系统偏好实时变化；没有手动开关和本地持久化。

视觉规范见 [设计系统](./design/design-system.md)。

## 申请 target 与隐私边界

| Target                        | 环境变量                                            | 使用位置             |
| ----------------------------- | --------------------------------------------------- | -------------------- |
| `alliance`                    | `NEXT_PUBLIC_APPLICATION_URL`                       | `/join`              |
| `cybersecurity-working-group` | `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`         | 网络安全工作组参与页 |
| `cybersecurity-program`       | `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM` | 对应历史计划新闻     |

三个变量默认为空。解析器只接受登记过的 Feishu origin 和精确路径；缺失、格式错误、未批准或未配置都会显示不可点击的说明状态，不会回退到另一 target。

官网没有本地申请表单、提交接口或申请数据库，因此不接收和保存申请表单字段。这一技术边界不覆盖 CDN/托管日志，也不替 Feishu 承诺数据控制者、用途、保存期或联系渠道。用户提交前仍需查看目标表单实际告知。

## 构建、测试与部署

`pnpm build` 生成 standalone 产物，`pnpm build:export` 生成 GitHub Pages 使用的 `out/`。静态导出启用 trailing slash 和无服务端图片优化；standalone 保留 Next.js server 与 `sharp`。

当前质量基线：

- 31 个 Vitest 文件、354 项 unit/integration 测试；
- statements 99.57%、branches 96.19%、functions 99.29%、lines 99.77%；
- 6 个 E2E spec，含 7 项 Chromium 快速集；项目展开数量以 Playwright `--list` 的当次结果为准；
- Chromium、Firefox、WebKit、双移动设备、quality 与 Lighthouse 项目均设置 `retries: 0`；
- 28 次 Axe 扫描无 serious/critical；
- 最近一次完整复跑的桌面 Lighthouse 为 100，移动 Performance 为 99–100，其余类别为 100；长期判定以配置门槛和当次验收报告为准。

这些数值是本轮测试治理快照，后续以实际命令和配置硬门为准。人工键盘和辅助技术模板仍为 `Not run`，自动结果不能替代人工签字。

生产路径为 GitHub Pages，部署只接受成功 main CI 的同一 SHA。Docker 为需要自有运行环境时的备选。仓库配置完成不代表正式域名、外部表单、备案或评审人员已经就绪：

- [Pages 与 DNS](./deploy-pages-dns.md)
- [Docker standalone](./deploy-docker.md)

## 文档与历史

当前文档入口在 [docs/README.md](./README.md)。历史需求、设计和任务保留在 [`docs/dev/`](./dev/README.md)，生命周期由集中索引裁决，不从未勾选的历史任务推断当前待办。
