# CLAUDE.md

中关村自主大模型产业联盟（ZGCLLM）官方网站工程的 AI 协作说明。当前项目边界和操作入口以 [README](./README.md)、[贡献指南](./CONTRIBUTING.md) 与 [文档索引](./docs/README.md) 为准。

## 项目边界

- 纯展示官网，使用 Next.js 16 App Router、React 19、TypeScript 与 Tailwind CSS 4，支持 standalone 和 GitHub Pages 静态导出两种构建目标。
- 公开内容来自仓库内的类型化配置（`src/content/`），无 CMS、数据库、用户账户或官网内申请接口。
- 中文根路径与 `/en` 英文路径信息等价。官方英文全称尚未确认，英文公开面只使用 `ZGCLLM` 或 `the Alliance`。
- 申请由三个独立 Feishu 表单 target 承担。官网不接收或保存申请表单字段，也不替外部平台承诺用途、保存期或联系渠道。
- 当前主题只跟随操作系统偏好，没有手动开关或本地持久化。

## 域名（重要）

- **唯一 canonical 目标：`https://www.zgc-llm.org.cn`（带连字符）**。仓库配置不代表 DNS、TLS 或 GitHub Pages custom domain 已完成；外部状态以发布验收报告为准。
- `zgc-llm.org.cn` 裸域、`zgc-llm.cn`、`zgc-llm.net` 以及无连字符的 `zgcllm.org.cn`、`zgcllm.cn`、`zgcllm.net` 只作为备用/防御入口，启用时必须通过 HTTPS 单跳 301 到正式主域名，不作独立服务或 canonical。
- canonical 固定在 `src/config/site.ts` 的 `CANONICAL_SITE_URL`；`NEXT_PUBLIC_SITE_URL` 只能确认该精确 origin，不能替换为其他 host、路径或端口。
- 改动域名时必须同步检查 `src/config/site.ts`、`public/CNAME`、`.github/workflows/ci.yml`、`.github/workflows/deploy-pages.yml`、`Dockerfile`、`docker-compose.prod.yml`、站点 chrome、README 与部署文档。
- 当前没有已核验公开邮箱。未来启用邮箱时必须使用正式域名，并先完成收发与公开授权验证。

## 申请 target

| Target                   | 环境变量                                            |
| ------------------------ | --------------------------------------------------- |
| 联盟申请                 | `NEXT_PUBLIC_APPLICATION_URL`                       |
| 网络安全工作组申请       | `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`         |
| 网络安全人员开放计划申请 | `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM` |

三个变量默认留空并分别 fail closed。公开分享 URL 不是密钥，但只有对应表单逐一完成对象、匿名提交、信息处理告知、字段与回执核验后，才可在构建环境中配置；不能提交源码默认值、跨 target 复用或用任意 HTTPS 地址替代。

## 开发与质量命令

CI 与 Docker 使用 Node.js `22.23.1`，pnpm 固定为 `11.2.2`。`package.json` 接受 `>=22.19.0 <23`，统一使用 pnpm，不要使用 npm 或 yarn。

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm test:coverage
pnpm build
pnpm build:export
pnpm test:e2e:chromium
pnpm test:e2e
```

普通提交至少通过 typecheck、lint、test 与 standalone build。发布候选还必须通过 coverage 硬门、静态导出和完整 Playwright 矩阵。人工键盘、屏幕阅读器、真实域名、表单与运营条件未执行时必须写明 `Not run` 或 blocked，不能由自动测试推定为通过。

## 开发约定

- 提交信息使用 Conventional Commits。
- 默认使用 React Server Components，仅在真实浏览器交互需要时使用 Client Components。
- TypeScript 保持严格模式，不使用 `any`、宽泛 ignore 或降低规则掩盖问题。
- 公开内容集中在 `src/content/`，站点与申请配置集中在 `src/config/site.ts`，页面组件不混入大段事实性文案。
- `published`、`named`、历史规格、测试 fixture 和仓库旧文案都不是事实或授权证据。具名主体、角色、成果、Logo 与官方英文名必须按 [内容录入指南](./docs/content-authoring.md) 复核。
- 新增环境变量时同步 `.env.example`、Docker、workflows 与文档，不得提交 API key、token、口令或其他凭证。
- UI 改动以 `src/app/(frontend)/styles.css` 和 [设计系统](./docs/design/design-system.md) 为实现与说明入口。

## 分支与发布流程

采用 trunk-based 流程：从 `main` 创建短生命周期 `feat/`、`fix/`、`docs/` 或 `content/` 分支，经 PR、必需 CI 和评审后合入。

`main` 的 push 会触发 CI；Pages 工作流只为通过 CI 的同一 SHA 重建并部署静态产物。部署 workflow 成功也不代表正式域名、外部表单、备案、品牌授权或人工无障碍验收已经完成。当前分支保护需要一名批准者，但仓库只有一名协作者；应增加第二名合格 reviewer，不能降低门禁绕过该外部条件。

团队使用 git worktree 时参见 `.gtrconfig`。未经明确授权，不创建 PR、不合并、不修改 DNS，也不执行正式生产发布。
