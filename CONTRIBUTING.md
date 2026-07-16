# 贡献指南

## 开发准备

1. 安装 Node.js 22 和 pnpm 11。
2. 执行 `cp .env.example .env`，按需填写两类飞书申请表单链接。
3. 执行 `pnpm install && pnpm dev`，访问 `http://localhost:3000`。

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
- 页面内容按业务领域拆分，公开内容集中在 `src/content/`，不在页面组件中混入复杂逻辑。
- 加入申请统一通过飞书表单收集，官网不落库、不记录或保存申请人个人信息。
- 新增环境变量时同步更新 `.env.example`，不得提交真实密钥或链接。
