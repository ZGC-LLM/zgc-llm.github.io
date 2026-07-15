# 贡献指南

## 开发准备

1. 安装 Node.js 22 和 pnpm 11。
2. 执行 `cp .env.example .env`，并为 `PAYLOAD_SECRET` 设置随机值。
3. 执行 `docker compose up postgres -d` 启动 PostgreSQL。
4. 执行 `pnpm install && pnpm dev`，访问 `http://localhost:3000`。

首次访问 `/admin` 时，按照页面提示创建管理员账号。

## 提交前检查

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

提交信息使用 Conventional Commits，例如：`feat: add alliance introduction page`。

## 开发约定

- 默认使用 React Server Components，仅在需要浏览器交互时使用 Client Components。
- TypeScript 保持严格模式，不使用 `any`。
- 页面内容和后台集合按业务领域拆分，不在页面组件中混入复杂数据操作。
- 申请人信息不得写入日志、测试快照或公开 API。
- 新增环境变量时同步更新 `.env.example`，不得提交真实密钥。
