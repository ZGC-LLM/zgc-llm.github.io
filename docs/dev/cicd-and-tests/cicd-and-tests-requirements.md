---
feature: cicd-and-tests
complexity: standard
generated_by: clarify
generated_at: 2026-07-18T00:00:00+08:00
version: 1
---

# 需求文档: 优化 CI/CD 与补全测试用例

## 1. 概述

一句话描述：为 ZGCLLM 官网工程优化 CI/CD 流水线（更快、不重复构建、加覆盖率采集），并补全单元测试、e2e 关键路径与内容/配置校验测试。

- **核心价值**：用更快、更省的 CI 守住质量红线，通过覆盖率盘点驱动测试补全，降低回归风险。
- **目标用户**：项目维护者与贡献者（PR 作者、评审者）。

## 2. 需求与用户故事

| ID | 需求 | 用户故事 | 验收标准 |
|----|------|---------|---------|
| R1 | CI 提速 | 作为贡献者，我希望 CI 更快返回结果 | 缓存 Playwright 浏览器；job 合理拆分/并行；typecheck·lint·unit 可并行于 e2e |
| R2 | 去除重复 build | 作为维护者，我不希望 build 在 CI 与 deploy 各跑一遍无谓开销 | 明确 CI 与 deploy 构建目标差异（普通 vs `BUILD_TARGET=export`），统一或消除冗余 |
| R3 | 覆盖率采集 | 作为维护者，我希望看到测试覆盖率 | 引入 `@vitest/coverage-v8`，CI 输出覆盖率报告；**仅报告不硬卡**（不设 fail 阈值） |
| R4 | 单元测试补全 | 作为维护者，我希望覆盖率低的模块被补测 | 依据覆盖率盘点，为盲区组件/工具函数补单元测试 |
| R5 | e2e 关键路径 | 作为维护者，我希望核心用户路径有 e2e 保护 | 覆盖加入申请 CTA、i18n、导航等关键路径 |
| R6 | 内容/配置校验 | 作为维护者，我希望配置错误在 CI 被拦截 | 强化 `src/content` 与 `site.ts` 校验（域名、SEO、链接有效性） |

## 3. 功能验收清单

- [ ] Playwright 浏览器在 CI 中被缓存，重复运行无需重装
- [ ] CI 内质量检查合理并行，整体墙钟时间下降
- [ ] CI 与 deploy 的构建目标差异被厘清，不再存在无意义的重复构建
- [ ] `pnpm test` 可产出覆盖率报告；CI 采集并展示覆盖率（不 fail）
- [ ] 完成一次覆盖率盘点，识别盲区并补齐对应单元测试
- [ ] 新增/强化 e2e 关键路径与内容/配置校验测试
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm build` 全绿

## 4. 技术约束

- 保留现有技术栈：Vitest 4 + Playwright 1.58 + pnpm 11 + Node 22，不换框架。
- 部署继续走 GitHub Pages（`deploy-pages.yml`，`BUILD_TARGET=export`）。
- 域名/canonical 相关不变（`www.zgc-llm.org.cn`）。
- 覆盖率门禁**只报告不 fail**（本轮不设硬阈值）。
- 集成点：`.github/workflows/ci.yml`、`.github/workflows/deploy-pages.yml`、`vitest.unit.config.mts`、`package.json`、`tests/**`。

## 5. 排除项

- 不修改产品功能代码 / UI 组件行为。
- 不设置会导致 PR 失败的覆盖率硬阈值。
- 不更换测试框架、包管理器或部署平台。
- 不改动域名与部署目标。

## 6. 风险与依赖

| 风险/依赖 | 说明 | 缓解 |
|-----------|------|------|
| 构建目标差异 | CI 普通 build 与 deploy `export` 产物不同，产物无法直接复用 | 统一构建目标或让 CI 仅校验、deploy 负责 build |
| 新增依赖 | 需安装 `@vitest/coverage-v8` | 锁定版本，`--frozen-lockfile` 校验 |
| e2e 不稳定 | 关键路径 e2e 可能引入 flaky | CI 已配 retries=2；新用例保持确定性选择器 |

## 7. 下一步

用户已选择「直接实施」。按以下顺序推进：R3 覆盖率采集 → 覆盖率盘点 → R1/R2 流水线优化 → R4/R5/R6 测试补全 → 全量校验。
