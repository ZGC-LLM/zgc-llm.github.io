---
feature: revert-pr29-page-ui
complexity: standard
generated_by: clarify
generated_at: 2026-07-19
version: 2
---

# 需求文档: 全撤 PR 29 打底 + 搬回独立好料（混合方案）

## 1. 概述

- **一句话描述**：用 `git revert a0ce815` 把仓库整体退回 PR 29 合并前的自洽状态（父提交 `d624120`），再把**不依赖被退测试套件**的独立改进（文档、Docker、Pages 部署逻辑、模板、引擎/脚本升级）作为一个干净的 follow-up 显式搬回来。
- **核心价值**：站长不认可 PR 29 的页面观感/信息架构。全撤得到一棵自洽、CI 天然为绿、图片 Logo 自动恢复的 pre-29 树（零底座协调、零测试破碎风险）；再挑回真正独立的工程价值，避免"纯外科式"那种保不住、还易留半坏树的问题。
- **目标用户**：仓库维护者（单一协作者 m0xiaoxi）。

## 2. 需求与用户故事

### R1 全撤打底
作为维护者，我希望仓库回到 PR 29 合并前状态，页面视觉/内容/测试/覆盖率门互相自洽。
- 验收：`git revert a0ce815` 后工作树等价于 `d624120`；`pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm build:export` 全绿；页面视觉/内容/交互与 pre-29 一致（首页、alliance、members、news、working-groups、privacy、404 人工比对）。

### R2 图片 Logo 自动恢复
作为维护者，我希望 header 恢复图片 Logo。
- 验收：全撤后 `public/brand/llm-alliance-logo.png` 恢复存在，`site-header.tsx` 恢复 `<Image src="/brand/llm-alliance-logo.png" className="brand-logo">`，渲染正常。
- ✅ **Logo 授权状态**：用户 2026-07-19 明确确认该 Logo 已获授权使用。保留图片 Logo，全撤后自动恢复，header 不做额外改动。（授权为用户口头确认，按 CLAUDE.md 由用户担责。）

### R3 搬回独立好料（follow-up commit）
作为维护者，我希望不依赖 PR-29 测试套件的工程改进保留下来，不随全撤丢失。
- **搬回（carry-forward）**：
  - 文档（免费、零编译耦合）：`docs/**`、`README.md`、`CONTRIBUTING.md`、`CHANGELOG.md`、`CLAUDE.md`、`LICENSE`
  - 容器：`Dockerfile`、`docker-compose.prod.yml`
  - 部署：`.github/workflows/deploy-pages.yml` 的同-SHA 部署逻辑
  - 模板与格式：`.github/ISSUE_TEMPLATE/*`、`.prettierignore`
  - 引擎/脚本（页面无关部分）：`package.json` 的 `engines`（node `>=22.19.0 <23`、pnpm `11.x`）、`build:export`、`format:check` 脚本及其所需 devDep（如 `cross-env`、`prettier`）、`pnpm-workspace.yaml`、`pnpm-lock.yaml` 对应条目
  - 可选：`src/config/site.ts` 的域名校验加固、`next.config.ts` 的构建/路由加固（页面无关部分，按是否引入回归判断）
- 验收：搬回后 typecheck/test/build/build:export 仍全绿；上述文件的目标内容与 PR 29 版本一致（或经删减后的页面无关子集）。

### R4 明确不搬（随测试重建再挣回）
作为维护者，我理解绑定 PR-29 测试套件的 CI 硬门无法在退页面后保留。
- **不搬**：`vitest.unit.config.mts` 的覆盖率阈值加高（保持 pre-29）、`ci.yml` 的 `release-e2e` job、`*.release.e2e.spec.ts`、`lighthouse`/`@axe-core/playwright` 依赖、`playwright.config.ts` 的 release 项目矩阵、`ci.yml:85` 覆盖率步骤对应的高阈值。
- 验收：`pnpm test:coverage` 在 pre-29 测试套件下通过（阈值与 pre-29 一致）；CI 不再引用已删除的 release specs。

## 3. 功能验收清单

- [ ] `git revert a0ce815` 干净应用，工作树等价 `d624120`
- [ ] 全撤后 `pnpm typecheck` / `pnpm lint` / `pnpm test` / `pnpm test:coverage` / `pnpm build` / `pnpm build:export` 全绿
- [ ] 页面视觉/内容/Logo 与 pre-29 一致（人工比对 7 个页面）
- [ ] follow-up 搬回后上述命令仍全绿
- [ ] 搬回清单（R3）逐项 diff 与 PR 29 版本一致（或页面无关子集）
- [ ] 不搬清单（R4）确认未被引入，CI 无悬空引用
- [ ] `src/config/site.ts` 的 canonical 域名值仍为 `https://www.zgc-llm.org.cn`（全撤不改域名值）

## 4. 技术约束

- **执行手段**：base commit 用 `git revert a0ce815`（PR 29 是 squash 单提交，不带 `-m`）；follow-up 用 `git checkout a0ce815 -- <搬回子集>` + 对 `package.json`/`ci.yml` 等混合文件做**选择性编辑**（只取页面/测试无关部分），不整文件照搬。
- **混合文件逐一判定**：
  - `package.json`：搬 engines + build:export + format:check + 其 devDep；**不搬** `test:e2e`/`test:e2e:chromium` 里引用 release 矩阵的部分与 `lighthouse`/`axe` 依赖。
  - `ci.yml`：若要搬其中的部署/lint 加固，需剔除 `release-e2e` job 与高覆盖率门；否则整体保持 pre-29。
  - `.env.example`：搬回与保留申请 target 三变量 fail-closed 的说明部分（若 pre-29 已含则免搬）。
- **域名红线**：全撤会把 `site.ts` 退回 pre-29（`DEFAULT_SITE_URL` 弱校验），但域名值 `www.zgc-llm.org.cn` 前后一致，域名不受影响；域名校验加固是否搬回列为 R3 可选项，不得改变域名值本身。
- **落地方式**：从 `main` 开短分支 `revert/pr29-pages` → revert commit + follow-up commit → PR → 必需 CI + 评审后合入。**不直接 push main、不自动合并、不触发正式发布**（CLAUDE.md 分支与发布流程）。

## 5. 排除项

- **不**做"纯外科式"逐文件页面回退（已否决：底座耦合 + CI 门做不干净）。
- **不**保留绑定 PR-29 测试套件的 CI 硬门（覆盖率高阈值、release-E2E 矩阵）——见 R4。
- **不**改域名值、canonical 或 `NEXT_PUBLIC_SITE_URL` 语义。
- **不**直接改 `main`、不合并 PR、不改 DNS、不做正式生产发布。
- **不**引入任何 pre-29 不存在的新内容或新的未核验事实。

## 6. 风险与依赖

| 风险/依赖 | 说明 | 应对 |
| --- | --- | --- |
| Logo 合规红线 | 放回旧 PNG 违反"未授权不上 Logo" | 用户已确认担责；无授权则 header 单独改回文字 wordmark（R2） |
| 混合文件误搬测试耦合部分 | package.json/ci.yml 半独立 | 逐项判定，只取页面/测试无关子集；搬后立即跑全套命令收敛 |
| 全撤丢失 pre-29 之后、PR 29 之外的 main 提交 | 需确认 `a0ce815` 是 main 上最新且其后无其他相关提交 | 实施前 `git log a0ce815..main` 核对（当前 a0ce815 即最新发布提交） |
| 域名校验被削弱 | 全撤退回弱校验 | 域名值不变；加固作为可选搬回项 |
| 单一协作者、分支保护需 1 审批 | 无第二 reviewer | 走 PR，合入决策留给用户 |

## 7. 下一步

- 复杂度 **standard**（全撤是 1 命令；搬回是有界的文件子集 + 少量选择性编辑）。可直接实施，无需再走完整 SDD 设计阶段。
- 建议执行顺序：
  1. `git switch -c revert/pr29-pages`
  2. `git log a0ce815..main` 确认其后无需保留的提交
  3. `git revert a0ce815`（base commit），跑全套命令确认全绿
  4. 若 Logo 无授权 → 单独把 header 改回文字 wordmark
  5. follow-up commit：`git checkout a0ce815 -- docs/ README.md CONTRIBUTING.md CHANGELOG.md CLAUDE.md LICENSE Dockerfile docker-compose.prod.yml .github/ISSUE_TEMPLATE .prettierignore pnpm-workspace.yaml`；对 `package.json`/`deploy-pages.yml` 做选择性编辑（R3）；剔除 R4 不搬项
  6. 再跑全套命令收敛全绿
  7. 开 PR（不合并，等 CI + 评审）
- 可直接让我按此执行，或先只做第 1–3 步（全撤打底）给你看效果，再决定搬回范围。
