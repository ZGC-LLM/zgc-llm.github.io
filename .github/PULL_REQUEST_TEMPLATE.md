<!-- 感谢贡献！请填写以下信息，帮助评审更快理解你的改动。 -->

## 变更说明

<!-- 简述本次改动的内容与动机 -->

## 变更类型

- [ ] feat：新功能
- [ ] fix：缺陷修复
- [ ] content：公开内容更新（src/content/）
- [ ] docs：文档
- [ ] chore / ci：构建、工具或流水线

## 提交前检查

- [ ] 本地 `pnpm typecheck && pnpm lint && pnpm test && pnpm build` 全部通过
- [ ] 提交信息符合 Conventional Commits（如 `feat: add alliance introduction page`）
- [ ] 分支命名符合约定（`feat/` `fix/` `docs/` `content/`）
- [ ] 若涉及域名改动，已按 [`CLAUDE.md`](../CLAUDE.md) 同步 `src/config/site.ts`、`public/CNAME`、两个工作流、`Dockerfile`、`site-footer.tsx` 与文档
- [ ] 未提交任何真实密钥或飞书表单链接（新增环境变量已同步 `.env.example`）

## 关联 Issue

<!-- 如有，请填写，例如：Closes #123 -->
