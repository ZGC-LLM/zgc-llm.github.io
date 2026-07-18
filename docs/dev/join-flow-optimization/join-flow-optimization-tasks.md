---
feature: join-flow-optimization
complexity: standard
generated_by: architect-planner
generated_at: 2026-07-18T00:00:00+08:00
version: 1
design: ./join-flow-optimization-design.md
---

# 任务清单: 加入路径优化与工作组问卷接入

## 任务总览

| ID | 任务 | priority | complexity | 依赖 | 并行组 |
|----|------|----------|------------|------|--------|
| T-001 | 配置层：类型字段 + content env key + 解析器 | P0 | standard | - | 1 |
| T-002 | 工作组 join 页接线 + 文案润色 + 交叉引导（zh+en）| P1 | standard | T-001 | 2 |
| T-003 | 联盟 join 页文案润色 + 交叉引导（zh+en）| P1 | standard | - | 1 |
| T-004 | 部署/env 四文件声明专属变量 | P1 | simple | - | 1 |
| T-005 | 单元测试（解析器）+ e2e（交叉引导/CTA）| P1 | standard | T-001, T-002, T-003 | 3 |

任务数：5。

## 任务详情

## T-001: 配置层（类型 + content + 解析器） [P0] [standard]

- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 1
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 3
- **dependencies**: 无
- **provides**: src/types/content.ts, src/config/site.ts, src/content/working-groups.ts
- **consumes**: 无
- **injected_skills**: [test-governance]

### 描述
1. `src/types/content.ts`：`WorkingGroupSummary` 增加可选字段 `applicationEnvKey?: string`，带注释（专属问卷 env 变量名，非 URL；未设置回退通用变量）。
2. `src/content/working-groups.ts`：cybersecurity 组增加 `applicationEnvKey: 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY'`。确认 en 覆盖层 `WorkingGroupOverlay` 无需增此字段（env key 不可翻译）。
3. `src/config/site.ts`：新增 `resolveWorkingGroupApplicationUrl(group)`，签名与逻辑见 design §3.1（命中专属 https → 用之；否则回退 `APPLICATION_TARGET.href`）。导入 `WorkingGroupSummary` 类型。

### 验收标准
- [ ] `WorkingGroupSummary.applicationEnvKey?: string` 存在且为可选
- [ ] cybersecurity 组 `applicationEnvKey === 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY'`
- [ ] `resolveWorkingGroupApplicationUrl` 导出；专属 https 命中返回该值，否则回退通用变量，非 https 回退通用变量
- [ ] 不硬编码任何真实 URL；content 仅存 key 名
- [ ] `pnpm typecheck && pnpm lint` 通过

### 涉及文件
- src/types/content.ts
- src/content/working-groups.ts
- src/config/site.ts

---

## T-002: 工作组 join 页接线 + 文案润色 + 交叉引导 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 2
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: T-001
- **provides**: src/app/(frontend)/working-groups/[slug]/join/page.tsx
- **consumes**: src/config/site.ts, src/content/working-groups.ts, src/types/content.ts

### 描述
在 `WorkingGroupJoinView` 中：
1. **接线**：`const configuredUrl = resolveWorkingGroupApplicationUrl(group)`，作为 `configuredUrl` 传入 Hero 的 `<ExternalApplicationLink>`（见 design §3.2）。
2. **文案润色（zh+en STRINGS 成对）**：强化「个人专业用户可参与 / 提交表单 ≠ 正式加入」，CTA 更行动化。
3. **交叉引导（zh+en）**：新增一句指向联盟入口的引导（如「机构合作请看联盟入口 /join」），用现有排版元素承载（hero 描述追加或 faq 增一条），不新增区块级组件。

en 路由 `src/app/(en)/en/working-groups/[slug]/join/page.tsx` 复用同一 View，无需单独改动——但 STRINGS 的 en 段必须同步改。

### 验收标准
- [ ] 网安工作组 join CTA 的 `configuredUrl` 来自 `resolveWorkingGroupApplicationUrl`
- [ ] 配置专属 env 时 CTA 指向专属问卷；未配置时回退通用变量；均不可用时降级 span（行为经 ExternalApplicationLink 保证）
- [ ] zh 与 en STRINGS 交叉引导 + 润色成对存在，术语与「工作组共建伙伴」等既有约定一致
- [ ] 交叉引导未引入新区块级组件
- [ ] `pnpm typecheck && pnpm lint` 通过

### 涉及文件
- src/app/(frontend)/working-groups/[slug]/join/page.tsx

---

## T-003: 联盟 join 页文案润色 + 交叉引导 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 1
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: 无
- **provides**: src/components/pages/join-view.tsx
- **consumes**: 无

### 描述
`JoinView` 的 zh+en STRINGS：
1. 润色：强化「机构入联盟」「提交表单 ≠ 正式加入」，CTA 更行动化。
2. 交叉引导（zh+en）：新增一句「个人专业用户可看网安工作组入口 /working-groups/cybersecurity/join」，用现有排版元素承载（hero 描述追加或 faq 增一条，注意现有 faq 已有「个人可以加入联盟吗」一条，可强化而非重复）。
CTA 行为不变（不传 configuredUrl，继续走通用变量）。

### 验收标准
- [ ] 联盟页含指向网安工作组入口的交叉引导（zh+en 成对）
- [ ] CTA 仍不传 configuredUrl（通用变量行为不变）
- [ ] 未新增区块级组件；术语与既有约定一致
- [ ] `pnpm typecheck && pnpm lint` 通过

### 涉及文件
- src/components/pages/join-view.tsx

---

## T-004: 部署/env 四文件声明专属变量 [P1] [simple]

- **priority**: P1
- **complexity**: simple
- **review_strategy**: self
- **parallel_group**: 1
- **execution**: agent
- **model**: haiku
- **estimated_files**: 4
- **dependencies**: 无
- **provides**: .env.example, .github/workflows/deploy-pages.yml, Dockerfile, .github/workflows/ci.yml
- **consumes**: 无

### 描述
声明 `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`，与既有 `NEXT_PUBLIC_APPLICATION_URL` 相同的注入方式：
- `.env.example`：新增空行 `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY=`（带中文注释，参照现有 APPLICATION_URL 注释风格）。
- `deploy-pages.yml`：build job env 增 `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY: ${{ vars.NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY }}`。
- `Dockerfile`：增对应 `ARG` + `ENV`（紧邻现有 APPLICATION_URL 两行）。
- `ci.yml`：build 相关 env 声明该变量（见下方风险说明——ci 现未设 base APPLICATION_URL，本项为参数/文档对齐，可留空默认降级）。

### 验收标准
- [ ] 四文件均声明 `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`
- [ ] deploy 走 `vars.` 注入；Dockerfile ARG+ENV 成对
- [ ] 不写入任何真实 URL
- [ ] `pnpm build` 不因新变量报错（未配置时正常降级）

### 涉及文件
- .env.example
- .github/workflows/deploy-pages.yml
- Dockerfile
- .github/workflows/ci.yml

---

## T-005: 单元测试 + e2e [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 2
- **dependencies**: T-001, T-002, T-003
- **provides**: tests/unit/site-config.test.ts, tests/e2e/working-groups.e2e.spec.ts
- **consumes**: src/config/site.ts, src/app/(frontend)/working-groups/[slug]/join/page.tsx, src/components/pages/join-view.tsx

### 描述
1. **单元测试**（扩展 `tests/unit/site-config.test.ts`，模式见 design §7.1）：`resolveWorkingGroupApplicationUrl` 的三分支——命中专属 https / 回退通用 / 非 https 回退；并断言「专属 host ≠ 通用 host」的语义。用例须清理 `process.env`（`vi.stubEnv` 或 afterEach 恢复），回退断言对比 `APPLICATION_TARGET.href` 本身。
2. **e2e**（扩展现有 join 相关 spec，host 无关，见 design §7.2）：两页交叉引导文案可见；CTA 沿用 `if (disabledEntry.count()) … else …` 容错断言。不注入 env、不断言真实 host。

> 若判定 e2e 新增应独立文件而非改 `working-groups.e2e.spec.ts`，实施者可改 provides 为新文件路径以保持单一拥有者；但不要与 T-002/T-003 争用同一源文件。

### 验收标准
- [ ] 单测覆盖解析器三分支且断言不同 host 语义；测试后 env 无残留污染
- [ ] e2e 断言两页交叉引导文案可见，CTA 断言 host 无关
- [ ] `pnpm test`（Vitest）与 `pnpm test:e2e`（Playwright）通过
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm build` 全绿

### 涉及文件
- tests/unit/site-config.test.ts
- tests/e2e/working-groups.e2e.spec.ts（或新建 join 专属 spec）

---

## 依赖关系图

```
T-001 (配置层) ──┬──> T-002 (工作组页接线+文案) ──┐
                 │                                  ├──> T-005 (测试)
T-003 (联盟页文案) ───────────────────────────────┤
                                                    │
（T-004 部署/env，独立，不阻塞测试逻辑）            │
T-001 ─────────────────────────────────────────────┘
```

- T-002 依赖 T-001（需要解析器、字段、类型）。
- T-003 无依赖（纯联盟页文案）。
- T-004 无依赖（配置文件）。
- T-005 依赖 T-001（解析器单测）+ T-002 + T-003（两页文案 e2e）。

## 执行计划

| 并行组 | 任务 | 说明 |
|--------|------|------|
| 组 1 | T-001, T-003, T-004 | 文件互不重叠，可并行；T-001 为 P0 先行 |
| 组 2 | T-002 | 待 T-001 完成（同文件唯一拥有者，接线+文案合并避免 provides 冲突）|
| 组 3 | T-005 | 待 T-001/T-002/T-003 完成 |

文件级 provides 无冲突：工作组 join `page.tsx` 由 T-002 单独拥有（接线与文案合并到一个任务，规避同文件被两任务 provides 的冲突）。

## 风险评估

| 风险 | 影响 | 应对 |
|------|------|------|
| 动态 `process.env[key]` 在静态导出被误判客户端内联取不到值 | 工作组 CTA 取不到专属 URL | 解析在 Server Component 构建期执行，仅传字符串给组件；单测 + build 兜底 |
| e2e 无法断言不同真实 host（webServer 无 env，现有用例断言降级态）| R2 的 host 差异无法在默认 e2e 覆盖 | host 差异语义下沉到 Vitest 单测；e2e 只断言 host 无关的交叉引导文案与 CTA 一致性 |
| ci.yml 现未声明 base `NEXT_PUBLIC_APPLICATION_URL`，仅加 cybersecurity 变量显得不对称 | 一致性/文档困惑 | T-004 按需求声明；实施者可同时补齐 base 变量或注释说明 ci 构建走降级态（见下方"需注意点"）|
| zh/en 文案不同步导致术语漂移 | 双语体验不一致 | 强制 zh+en 成对修改；参照近期术语对齐提交 |
</content>
