# 贡献指南

## 开发环境

- CI 与 Docker 使用 Node.js `22.23.1`。
- `package.json` 接受 `>=22.19.0 <23`，本地建议与 CI 保持一致。
- pnpm 固定为 `11.2.2`，不要使用 npm 或 yarn。

```bash
corepack enable
node --version
pnpm --version
cp .env.example .env
pnpm install --frozen-lockfile
pnpm dev
```

`.env` 中三个申请变量默认保持为空。只有对应 Feishu 表单逐一完成对象、匿名提交、信息处理告知和回执核验后，才可配置相应变量；不能用其他表单兜底。

`NEXT_PUBLIC_DEV_ORIGIN` 只用于额外开发 host，接受逗号分隔的精确 hostname 或 IPv4，不接受 scheme、端口、路径、通配符或空列表项。生产环境不设置该变量。

## 开发约定

- 默认使用 React Server Components；只有浏览器交互需要 Client Component。
- TypeScript 保持严格模式，不使用 `any` 或大范围检查豁免。
- 公开内容放在 `src/content/`，页面组件只负责展示和路由组合。
- `published`、`named`、测试 fixture 或仓库旧文案都不能作为事实来源。具名主体、角色、成果、Logo 和官方英文名必须登记来源、复核人、复核日期与允许公开的范围。
- 官网不实现申请 API、数据库或本地表单。外部申请入口必须保持独立 target 和 fail-closed 行为。
- 新增环境变量时同步 `.env.example`、Docker、workflows 与相关文档，不得提交真实密钥或凭证。
- 改动域名时按 `CLAUDE.md` 同步全部域名承载点。无连字符域名只能作为防御域，不得成为 canonical。
- 更新 UI 时以 `src/app/(frontend)/styles.css` 为实现权威，并同步 [设计系统](./docs/design/design-system.md)。
- 更新成员、新闻或工作组前先阅读 [内容录入指南](./docs/content-authoring.md)。

## 测试分层

| 命令                           | 范围                                      | 使用场景                     |
| ------------------------------ | ----------------------------------------- | ---------------------------- |
| `pnpm test` / `pnpm test:unit` | `tests/unit/**` 与 `tests/integration/**` | 开发中的行为回归             |
| `pnpm test:coverage`           | 同一测试集与覆盖率硬门                    | CI 必需质量门                |
| `pnpm test:e2e:chromium`       | `chromium` 快速项目，共 7 项              | PR 与 main 的必需 E2E        |
| `pnpm test:e2e`                | 8 个 Playwright 项目的完整矩阵            | 定时、手动与发布验收         |
| `pnpm test:all`                | unit/integration 后接完整 E2E             | 本地便捷组合，不是完整发布门 |

Vitest 当前包含 31 个文件、354 项测试。覆盖率为 statements 99.57%、branches 96.19%、functions 99.29%、lines 99.77%；配置硬门为 lines/statements/functions 90%、branches 85%。数值快照会随代码变化，最终判定以 [`vitest.unit.config.mts`](./vitest.unit.config.mts) 和当次命令结果为准。

完整 Playwright 矩阵包括：

- `chromium` 快速集；
- Chromium、Firefox、WebKit 三个桌面发布项目；
- Pixel 5 与 iPhone 13 两个移动项目；
- quality、keyboard 与 Lighthouse 质量项目。

6 个 E2E spec 在不同项目中展开，具体数量以 `pnpm exec playwright test --config=playwright.config.ts --list` 的当次结果为准。Playwright 使用静态导出和 `127.0.0.1:3100` 的隔离服务器，`retries: 0`。当前自动证据覆盖发布矩阵中的 24 个可索引 HTML、`robots.txt` 与 `sitemap.xml` 两个 SEO 路径、28 次 Axe 扫描，以及桌面和移动 Lighthouse；图像 Route Handler 与其他静态资产不计入这 26 条路径。自动 Axe 的 serious/critical 为 0；最近一次完整复跑的桌面 Lighthouse 为 100，移动 Performance 为 99–100，其余类别为 100，最终以配置门槛和当次 T-012 报告为准。

自动检查不能替代人工键盘和辅助技术验收。[人工证据模板](./tests/e2e/manual-keyboard-evidence.md) 当前仍是 `Not run`，没有填写操作人、环境和结果前不得宣称人工验收通过。

## 提交前与发布检查

普通提交至少运行：

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

发布候选需要更完整的证据：

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test:coverage
pnpm build
pnpm build:export
pnpm test:e2e
```

`pnpm format:check` 以 `.prettierignore` 为边界：现行源码、测试、配置和维护文档必须通过；环境托管的 `.agents/`、追溯性 feature 规格和历史原型不做机械重写。`docs/dev/README.md` 作为当前生命周期索引仍在格式门内。

文档改动还应检查 Prettier、相对链接、脚本名称、环境变量和域名漂移。部署相关改动至少运行：

```bash
docker compose -f docker-compose.prod.yml config
```

Docker daemon 可用时，再构建并执行健康检查。最终发布验收必须记录实际命令、环境和失败项，不能把未执行或外部阻塞写成通过。

## 分支与评审

采用 trunk-based 流程：

1. 从 `main` 创建短生命周期分支：`feat/`、`fix/`、`docs/` 或 `content/`。
2. 保持改动聚焦，提交前检查工作区，避免覆盖他人未提交改动。
3. 使用 Conventional Commits，例如 `docs: align deployment guidance with release gates`。
4. 开 PR，等待 strict required checks、对话解决和评审门通过后合入。

main 当前要求 PR、`Security audit`、`Types, lint & unit tests`、`End-to-end tests` 三个严格状态检查、对话解决，并对管理员生效。由于短期没有第二名 reviewer，组织 owner 已于 2026-07-19 明确接受将强制批准数设为 0；该临时策略不允许绕过 required checks、直接推送 main 或跳过对话解决。具备稳定评审能力后，应在独立治理变更中恢复至少一名批准者并重新评估 stale dismissal 与 last-push 限制。
