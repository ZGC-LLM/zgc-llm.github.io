# CLAUDE.md

中关村自主大模型产业联盟（ZGCLLM）官方网站工程的 AI 协作说明。与 [README.md](./README.md) 和 [CONTRIBUTING.md](./CONTRIBUTING.md) 配合阅读。

## 项目概要

- 纯静态展示官网，Next.js 16（App Router）+ React 19 + TypeScript + Tailwind CSS 4。
- 公开内容来自仓库内类型化配置（`src/content/`），无内容后台、无数据库。
- 加入申请通过飞书表单收集，官网**不接收、不落库、不保存**任何申请人个人信息。

## 域名（重要）

- **正式主域名：`www.zgc-llm.org.cn`（带连字符）**。canonical、sitemap、robots、邮箱均以此为准。
- `zgc-llm.cn`、`zgc-llm.net` 为品牌保护域名，上线时 301 跳转到主域名。无连字符的 `zgcllm.org.cn`、`zgcllm.cn`、`zgcllm.net` 仅作防御性注册并 301 跳转到主域名，不作正式对外服务域名。
- 域名集中在 `src/config/site.ts`（`DEFAULT_SITE_URL`），生产由 `NEXT_PUBLIC_SITE_URL` 注入。
- 改动域名时必须同步：`src/config/site.ts`、`public/CNAME`、`.github/workflows/deploy-pages.yml`、`.github/workflows/ci.yml`、`Dockerfile`、`src/components/site/site-footer.tsx`、README 与 docs。正式对外服务与 canonical 一律用带连字符的 `zgc-llm`；无连字符的 `zgcllm` 仅用于品牌名、包名、localStorage key，以及上述防御性注册并 301 跳转的备用域名，不作为对外服务/ canonical 域名。

## 常用命令

```bash
pnpm dev             # 启动开发服务器（localhost:3000）
pnpm build           # 生产构建
pnpm typecheck       # TypeScript 类型检查
pnpm lint            # ESLint 检查
pnpm test            # 单元测试（Vitest）
pnpm test:e2e        # Playwright 端到端测试（隔离在 127.0.0.1:3100）
```

要求 Node.js 22、pnpm 11。**统一使用 pnpm**，不要用 npm/yarn。

## 提交前必须通过

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

## 开发约定

- 提交信息使用 Conventional Commits（如 `feat: add alliance introduction page`）。
- 默认 React Server Components，仅在需要浏览器交互时用 Client Components。
- TypeScript 严格模式，不使用 `any`。
- 公开内容集中在 `src/content/`，不在页面组件混入复杂逻辑。
- 新增环境变量时同步更新 `.env.example`，不得提交真实密钥或表单链接。

## 分支与协作流程

采用 **trunk-based（单 `main` 主干）** 流程：

- `main` 是唯一长期分支，始终可发布；push 到 `main` 会自动部署到 GitHub Pages（`deploy-pages.yml`）。
- 所有改动走**短生命周期特性分支** → 开 PR → CI 通过并评审后合入 `main`。
- 分支命名：`feat/xxx`、`fix/xxx`、`docs/xxx`、`content/xxx`。
- 建议给 `main` 开启分支保护：必须 PR、必须 CI 通过、至少一名评审。
- 特性分支尽量小、尽快合并，避免长期分叉。团队使用 git worktree 时参见 `.gtrconfig`。
