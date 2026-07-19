# 中关村自主大模型产业联盟官网

ZGCLLM 官方网站工程。本站使用 Next.js 静态生成，公开联盟介绍、工作组、成员公示、新闻与参与指引；内容由仓库内的类型化配置维护，不接入 CMS 或数据库。

正式 canonical 目标为 `https://www.zgc-llm.org.cn`。该域名的 DNS、TLS 与 GitHub Pages 自定义域名仍待外部配置和验收，当前不能将其描述为已上线站点。域名状态和启用步骤见 [GitHub Pages 与 DNS 部署指南](./docs/deploy-pages-dns.md)。

## 项目边界

- 中文根路径和 `/en` 英文路径均由同一套类型化内容生成。
- 官网没有申请表单处理接口，不接收或保存申请表单字段。申请入口指向独立的 Feishu 表单，信息处理边界以页面说明和目标表单实际告知为准。
- 联盟申请、网络安全工作组申请、网络安全人员开放计划是三个独立 target。三者默认关闭，只能在各自完成匿名提交、隐私告知与回执核验后单独启用。
- 未经来源和公开范围核验的机构名称、角色、成果、Logo 与英文全称不会作为已确认事实发布。
- 当前主题只跟随操作系统的明暗偏好，不提供手动主题开关或本地持久化。

## 快速开始

项目基线为 Node.js `22.23.1` 和 pnpm `11.2.2`；`package.json` 接受 `>=22.19.0 <23` 的 Node.js 22 版本。统一使用 pnpm。

```bash
git clone git@github.com:ZGC-LLM/zgc-llm.github.io.git
cd zgc-llm.github.io
corepack enable
pnpm --version
cp .env.example .env
pnpm install --frozen-lockfile
pnpm dev
```

开发服务器默认位于 <http://localhost:3000>。三个申请变量应保持为空，除非对应表单已经完成发布前核验。

## 常用命令

| 命令                     | 用途                                                 |
| ------------------------ | ---------------------------------------------------- |
| `pnpm dev`               | 启动开发服务器                                       |
| `pnpm typecheck`         | TypeScript 类型检查                                  |
| `pnpm lint`              | ESLint 检查                                          |
| `pnpm test`              | 运行 Vitest unit 与 integration 测试                 |
| `pnpm test:coverage`     | 运行测试并执行覆盖率硬门                             |
| `pnpm test:e2e:chromium` | 运行 PR 使用的 Chromium 快速集                       |
| `pnpm test:e2e`          | 运行完整浏览器、移动端、无障碍与 Lighthouse 发布矩阵 |
| `pnpm build`             | 构建 Next.js standalone 产物                         |
| `pnpm build:export`      | 构建 GitHub Pages 静态导出产物                       |

提交前检查、完整测试矩阵和当前质量基线见 [贡献指南](./CONTRIBUTING.md)。`pnpm test:all` 只是 unit 与完整 E2E 的组合，不包含 typecheck、lint、coverage 或双构建，不能单独作为发布门。

## 环境变量

公开变量在构建时写入产物。申请变量默认留空，空值或不符合精确 allowlist 的值都会渲染为不可用状态，不会回退到另一张表单。

| 变量                                                | 作用                          | 默认策略                                                      |
| --------------------------------------------------- | ----------------------------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                              | 唯一 canonical 根地址         | 固定为 `https://www.zgc-llm.org.cn`；其他 origin 会回退到该值 |
| `NEXT_PUBLIC_APPLICATION_URL`                       | 联盟合作与入会申请            | 空值，默认关闭                                                |
| `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`         | 网络安全工作组申请            | 空值，默认关闭                                                |
| `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM` | 网络安全人员开放计划申请      | 空值，默认关闭                                                |
| `NEXT_PUBLIC_DEV_ORIGIN`                            | `next dev` 的额外 host 白名单 | 仅开发环境使用；生产留空                                      |

`E2E_PORT` 和 `E2E_BASE_URL` 只控制 Playwright。未设置 `E2E_BASE_URL` 时，测试会在 `127.0.0.1:3100` 构建并服务静态导出；设置绝对 HTTP/HTTPS URL 后，Playwright 访问该目标，不启动本地服务器。

环境变量的完整注释以 [`.env.example`](./.env.example) 为准，申请 target 与 URL allowlist 以 [`src/config/site.ts`](./src/config/site.ts) 为准。公开 Feishu 分享 URL 不是密钥，但“能够打开”不等于匿名提交、隐私告知和回执已经通过核验。

## 内容、路由与项目结构

| 维护对象                                       | 权威位置                                                |
| ---------------------------------------------- | ------------------------------------------------------- |
| 站点名称、导航、路由、申请 target              | `src/config/site.ts`                                    |
| 首页、联盟、参与、成员、新闻、工作组与隐私内容 | `src/content/`                                          |
| 内容事实类型与校验                             | `src/types/content.ts`、`src/lib/content-validation.ts` |
| 中文和英文路由壳                               | `src/app/(frontend)/`、`src/app/(en)/`                  |
| 站点组件                                       | `src/components/`                                       |
| 视觉 token、断点与状态                         | `src/app/(frontend)/styles.css`                         |
| unit、integration、E2E                         | `tests/unit/`、`tests/integration/`、`tests/e2e/`       |

当前发布矩阵包含 12 对中英文页面，共 24 个可索引 HTML，并覆盖 `/robots.txt` 与 `/sitemap.xml` 两个 SEO 路径。图像 Route Handler 和其他静态资产不计入这 26 条页面/SEO 路径。未知路由和已撤回新闻返回不可索引的 404。完整路由和架构说明见 [项目总览](./docs/overview.md)。

内容更新前先阅读 [内容录入指南](./docs/content-authoring.md)。`published` 和 `named` 只控制渲染，不代表来源或授权已经核验。

## 部署

GitHub Pages 是主部署路径。`main` 的 push 必须先通过 CI；Pages 工作流只接受成功的同一 SHA，并在独立 runner 上重建静态导出后部署。仓库配置完成不代表正式域名已经可用。

- Pages、DNS、TLS、保护域 301 与分支门禁：[docs/deploy-pages-dns.md](./docs/deploy-pages-dns.md)
- 自托管 standalone 容器：[docs/deploy-docker.md](./docs/deploy-docker.md)

当前仍需外部完成正式域名、三个 Feishu 表单匿名流程、第二名合格 reviewer，以及适用的备案、公开联系渠道和正式品牌资产核验。官方英文全称未确认，英文公开面只使用 `ZGCLLM` 或 `the Alliance`。这些事项由最终发布验收记录结论，本 README 不代替发布报告。

## 文档入口

- [文档索引](./docs/README.md)
- [项目总览](./docs/overview.md)
- [贡献指南](./CONTRIBUTING.md)
- [设计系统](./docs/design/design-system.md)
- [历史规格状态](./docs/dev/README.md)
- [AI 协作说明](./CLAUDE.md)
