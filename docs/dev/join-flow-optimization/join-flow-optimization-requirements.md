---
feature: join-flow-optimization
complexity: standard
generated_by: clarify
generated_at: 2026-07-18T00:00:00+08:00
version: 1
---

# 需求文档: 加入联盟 / 加入工作组 路径优化与问卷接入

## 1. 概述

- **一句话描述**：让「加入联盟」与「加入网安工作组」两条转化路径能各自接入独立的飞书问卷，并打磨两页的引导文案与交叉引导。
- **核心价值**：当前全站两条加入路径共用同一个 `NEXT_PUBLIC_APPLICATION_URL`，无法区分投递目标——机构合作与网安专业用户被引向同一张表单，存在申请人填错表的转化损耗。本次让每条路径指向正确问卷，并通过文案降低「我该走哪条路径」的认知门槛。
- **目标用户**：拟入盟的机构（联盟路径）、拟加入网安工作组的安全企业/高校/科研机构/个人专业用户（工作组路径）。

## 2. 需求与用户故事

| 编号 | 用户故事 | 验收标准 |
|------|----------|----------|
| R1 | 作为机构访客，我在 `/join` 点击「合作申请」应打开**联盟**飞书问卷 | CTA `href` 解析自通用变量 `NEXT_PUBLIC_APPLICATION_URL`（联盟问卷） |
| R2 | 作为网安专业用户，我在 `/working-groups/cybersecurity/join` 点击申请应打开**网安工作组**飞书问卷 | CTA `href` 解析自该工作组专属变量 `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`；未配置时回退到通用变量 |
| R3 | 作为访客，当对应问卷变量未配置或非 https 时，页面显示降级文案而非空链接 | 复用现有 `ExternalApplicationLink` 降级路径，行为不变 |
| R4 | 作为访客，我能从两页文案快速判断自己该走哪条路径 | 联盟页与网安工作组页各含一句交叉引导（互指对方入口）；zh + en 双语 |
| R5 | 作为运维，我能在 GitHub 仓库变量与本地 `.env.local` 中分别配置两个问卷地址 | `.env.example`、`deploy-pages.yml`、`Dockerfile`、`ci.yml` 均声明第二个变量 |

## 3. 功能验收清单

- [ ] `working-groups.ts` 为工作组增加可选字段（如 `applicationEnvKey`），网安组值为 `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`。
- [ ] `site.ts` 增加解析器：按 env key 读取 URL，缺省回退 `NEXT_PUBLIC_APPLICATION_URL`，非 https 判定为不可用（复用 `isSafeExternalUrl`）。
- [ ] 工作组 join 页把该组解析出的 URL 通过 `configuredUrl` 传入 `ExternalApplicationLink`；`/join` 保持通用变量。
- [ ] 联盟页（`join-view.tsx`）与网安工作组 join 页文案润色：强化「个人可入网安工作组 / 机构入联盟」「提交表单 ≠ 正式加入」，CTA 更行动化。
- [ ] 两页各新增一句交叉引导文案（zh + en），不新增区块级组件。
- [ ] `.env.example` / `deploy-pages.yml` / `Dockerfile` / `ci.yml` 增加 `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`（deploy 走 `vars.`）。
- [ ] e2e 断言两条路径 CTA 指向不同 host 的外链（或在变量缺省时的降级行为）。
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm build` 全绿。

## 4. 技术约束

- **不硬编码真实链接**：两个飞书问卷地址不进仓库，经环境变量注入；生产存 GitHub 仓库 Variable，本地放 gitignored 的 `.env.local`（遵守 CLAUDE.md / `.env.example` 约束）。
- **Next.js 静态导出 + RSC**：join 页为 Server Component，`process.env[key]` 在构建期读取，动态 key 访问可用；仍以显式 key 映射（content 存 key 名）保证可静态审计。
- **每工作组可独立配问卷**：命名约定 `NEXT_PUBLIC_APPLICATION_URL_<SLUG_UPPER>`；未配置时回退通用变量，未来新增工作组零回归。
- **复用现有组件**：沿用 `ExternalApplicationLink` 与其降级/安全 URL 逻辑，不新造入口组件。
- **双语一致**：所有文案改动 zh 与 en 同步。

## 5. 排除项

- 不重构「联盟 vs 工作组」信息架构，不在首页/加入页新增分流决策卡片区块。
- 不迁移 `news.ts:50` 已有的硬编码飞书链接（超出本次范围）。
- 不改动除 `/join` 与 `/working-groups/[slug]/join` 外的页面。
- 不接收/落库任何申请人个人信息（官网定位不变）。
- 不创建 GitHub 仓库变量本身（由用户在仓库设置中粘贴两个真实链接）。

## 6. 风险与依赖

| 项 | 说明 | 应对 |
|----|------|------|
| 依赖 | 两个真实问卷地址需用户配置为 GitHub Variable + 本地 `.env.local` | 交付时提供变量名与配置位置清单 |
| 风险 | 动态 env key 在静态导出下若被误判为客户端内联，可能取不到值 | 用显式 key 映射 + 服务端解析器，构建期读取；e2e 兜底验证 |
| 风险 | 文案 zh/en 不同步导致术语漂移（如「工作组共建伙伴」） | 参照近期已对齐术语的提交，改动时 zh+en 成对修改 |

## 7. 下一步

- 推荐进入 `/devagent:dev-spec-dev join-flow-optimization --skip-requirements` 生成 design.md + tasks.md 并按 TDD 实施。
- 实施后由用户在 GitHub 仓库 Variables 填入：`NEXT_PUBLIC_APPLICATION_URL`（联盟问卷）、`NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`（网安工作组问卷）。
