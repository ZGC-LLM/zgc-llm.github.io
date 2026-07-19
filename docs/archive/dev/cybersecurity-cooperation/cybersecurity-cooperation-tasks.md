---
feature: cybersecurity-cooperation
complexity: standard
generated_by: architect-planner
generated_at: 2026-07-18T00:00:00+08:00
version: 1
---

# 任务清单: 统一合作/加入入口（共享一张飞书问卷）

> 基于 `cybersecurity-cooperation-design.md`。收敛双 target/env 为单一问卷 target，官网多入口共享同一 URL，中英双语不回归。全程 TDD（先测后码）；非纯文档任务均含测试。

## 任务总览

| ID | 任务 | priority | complexity | 依赖 | 并行组 |
|----|------|----------|-----------|------|--------|
| T-001 | 类型与配置收敛（单一 target/env，去 kind）| P0 | complex | - | 1 |
| T-002 | ExternalApplicationLink 组件收敛（去 kind，加 label）| P0 | standard | T-001 | 2 |
| T-003 | `.env.example` 环境变量收敛 | P1 | simple | T-001 | 2 |
| T-004 | JoinView（机构入口）CTA 收敛 + 双语 | P1 | standard | T-002 | 3 |
| T-005 | 网安组 join 视图 CTA 收敛 + 合作文案 + 双语 | P1 | standard | T-002 | 3 |
| T-006 | 页面级测试对齐 + 全量闸门回归验证 | P1 | standard | T-004, T-005, T-003 | 4 |

任务总数：6。并行分组：4 组（组1→组2→组3→组4）。

---

## 任务详情

## T-001: 类型与配置收敛（单一 target/env，去 kind） [P0] [complex]

- **priority**: P0
- **complexity**: complex
- **review_strategy**: two-stage
- **parallel_group**: 1
- **execution**: agent
- **model**: opus
- **estimated_files**: 3
- **dependencies**: []
- **provides**: [src/types/content.ts, src/config/site.ts, tests/unit/site-config.test.ts]
- **consumes**: []
- **must_not_create**: [新的 ApplicationKind 多成员联合, 新环境变量别名（除非 Decision 3 选 B）]

### 描述
收敛申请 target 机制底座。`src/types/content.ts`：移除 `ApplicationKind`、从 `ExternalApplicationTarget` 移除 `internalHref`，保留 `href?`/`label`/`unavailableMessage` 与 `ResolvedApplicationTarget`。`src/config/site.ts`：`APPLICATION_TARGETS`(record) → 单一 `APPLICATION_TARGET`；`resolveApplicationTarget` 去掉 `kind` 参数、默认读 `APPLICATION_TARGET.href`；env 读取收敛为 `NEXT_PUBLIC_APPLICATION_URL`；**保留 `isSafeExternalUrl` 导出**（news 复用）。先改 `site-config.test.ts` 断言（红→绿）。禁止改动 `MemberSummary.type` 等无关 institution/professional。

### 验收标准
- [ ] `ApplicationKind` 已移除；无遗留 import 报错
- [ ] `APPLICATION_TARGET` 为单一对象，`href` 源自 `NEXT_PUBLIC_APPLICATION_URL`
- [ ] `resolveApplicationTarget()` 无 kind 参数，缺省 URL 时 `isAvailable=false`
- [ ] `isSafeExternalUrl` 仍导出且六组用例通过
- [ ] `site-config.test.ts` 更新并通过；`MemberSummary.type` 未被改动

### 涉及文件
- src/types/content.ts
- src/config/site.ts
- tests/unit/site-config.test.ts

---

## T-002: ExternalApplicationLink 组件收敛（去 kind，加 label） [P0] [standard]

- **priority**: P0
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 2
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 2
- **dependencies**: [T-001]
- **provides**: [src/components/site/external-application-link.tsx, tests/unit/site-components.test.tsx]
- **consumes**: [src/types/content.ts, src/config/site.ts]
- **must_not_create**: []

### 描述
组件去掉 `kind` prop，新增可选 `label`（语境文案，用于 aria-label 与 fallback children，缺省回退 `APPLICATION_TARGET.label`）。保持 https 校验、`target=_blank`、`rel="noreferrer noopener"`、降级 `<span aria-disabled>` 文案不变。先更新 `site-components.test.tsx`（改 `kind="institution"` 用法为 label 用法，含 `javascript:` 降级用例、header 内链断言）。

### 验收标准
- [ ] `ExternalApplicationLinkProps` 无 `kind`，有可选 `label`
- [ ] 可用时 aria-label 使用传入 label，属性含 `_blank` / `noopener` / `noreferrer`
- [ ] 不安全/缺省 URL 渲染 `aria-disabled` 降级文案
- [ ] `site-components.test.tsx` 更新并通过

### 涉及文件
- src/components/site/external-application-link.tsx
- tests/unit/site-components.test.tsx

---

## T-003: `.env.example` 环境变量收敛 [P1] [simple]

- **priority**: P1
- **complexity**: simple
- **review_strategy**: self
- **parallel_group**: 2
- **execution**: script
- **model**: haiku
- **estimated_files**: 1
- **dependencies**: [T-001]
- **provides**: [.env.example]
- **consumes**: [src/config/site.ts]
- **must_not_create**: [真实问卷链接, 密钥]

### 描述
将 `NEXT_PUBLIC_INSTITUTION_APPLICATION_URL` / `NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL` 替换为单一 `NEXT_PUBLIC_APPLICATION_URL=`（留空），保留 `NEXT_PUBLIC_SITE_URL`。变量名须与 T-001 config 读取一致。若 Decision 3 最终选兼容别名（B），则保留旧变量并加弃用注释——默认走硬切换（A）。

### 验收标准
- [ ] `.env.example` 含 `NEXT_PUBLIC_APPLICATION_URL=`（空值）
- [ ] 旧两变量已移除（除非确认走兼容方案）
- [ ] 无真实链接 / 密钥

### 涉及文件
- .env.example

---

## T-004: JoinView（机构入口）CTA 收敛 + 双语 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-002]
- **provides**: [src/components/pages/join-view.tsx]
- **consumes**: [src/components/site/external-application-link.tsx]
- **must_not_create**: [新的 /join 变体路由, 站内表单]

### 描述
`join-view.tsx` 的 CTA 由 `kind="institution"` 改为无 kind + `label={t.applyCta}`，指向单一问卷 target。zh/en 均复用 `JoinView`，`STRINGS` 中 zh `applyCta='机构合作申请'` / en `'Partner with Us'` 作为语境 label。保留机构语境的 价值/路径/流程/FAQ 文案；如需可微调「共用统一问卷」措辞，保持中英同步。`/join` 与 `/en/join` 页壳无需改动。

### 验收标准
- [ ] CTA 不再传 `kind`，改传语境 `label`，指向单一 target
- [ ] URL 缺省时降级文案，不报错
- [ ] zh/en 机构语境文案齐备无缺项
- [ ] 机构语境（价值/参与方式/流程/常见问题）保留

### 涉及文件
- src/components/pages/join-view.tsx

---

## T-005: 网安组 join 视图 CTA 收敛 + 合作文案 + 双语 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 3
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 1
- **dependencies**: [T-002]
- **provides**: ["src/app/(frontend)/working-groups/[slug]/join/page.tsx"]
- **consumes**: [src/components/site/external-application-link.tsx]
- **must_not_create**: ["新的 /professionals 独立页", "新的合作招募独立路由/板块", "站内表单"]

### 描述
`WorkingGroupJoinView` 的 CTA 由 `kind="professional"` 改为无 kind + `label={t.applyCta}`，指向同一问卷 target。`(en)` 版复用同 View，一次改动覆盖 zh + /en。就地增强网安组合作展示（做什么/欢迎谁/合作价值聚焦网络安全工作组），沿用现有 `STRINGS` 四段结构，不新增独立板块、不重构页面。zh `applyCta='专业用户申请'` / en `'Apply as a professional user'` 作为语境 label；合作措辞微调保持中英同步。

### 验收标准
- [ ] CTA 不再传 `kind`，改传语境 `label`，指向单一 target（与 T-004 同一 URL）
- [ ] `/working-groups/cybersecurity/join` zh + `/en/...` 均不回归，降级文案保留
- [ ] 合作展示内容聚焦网络安全工作组，中英同步
- [ ] 未新增 `/professionals` 或独立合作路由

### 涉及文件
- src/app/(frontend)/working-groups/[slug]/join/page.tsx

---

## T-006: 页面级测试对齐 + 全量闸门回归验证 [P1] [standard]

- **priority**: P1
- **complexity**: standard
- **review_strategy**: combined
- **parallel_group**: 4
- **execution**: agent
- **model**: sonnet
- **estimated_files**: 2
- **dependencies**: [T-004, T-005, T-003]
- **provides**: [tests/unit/conversion-pages.test.tsx]
- **consumes**: [src/config/site.ts, src/components/pages/join-view.tsx, "src/app/(frontend)/working-groups/[slug]/join/page.tsx"]
- **must_not_create**: []

### 描述
更新 `conversion-pages.test.tsx`：把 institution/professional 双 target 断言改为「两入口共享单一 target」，覆盖 URL 缺省降级、无 `/professionals`、privacy 边界、**中英双语**语境。确认并同步 `tests/unit/site-core-modules.test.ts`（若引用了收敛符号）。最后运行完整闸门 `pnpm typecheck && pnpm lint && pnpm test && pnpm build`，人工核对 `/join`、`/working-groups/cybersecurity/join` 中英双语渲染不回归。

### 验收标准
- [ ] `conversion-pages.test.tsx` 反映单一 target 语义，双语断言齐备
- [ ] `site-core-modules.test.ts` 无残留旧符号引用
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm build` 全部通过
- [ ] `/join` 与网安组 join 中英双语无回归

### 涉及文件
- tests/unit/conversion-pages.test.tsx
- tests/unit/site-core-modules.test.ts

---

## 依赖关系图

```
T-001 (类型/配置底座, P0)
  ├─→ T-002 (组件, P0) ─┬─→ T-004 (JoinView) ─┐
  │                      └─→ T-005 (WG join)  ─┼─→ T-006 (页面测试+全量闸门)
  └─→ T-003 (.env.example) ────────────────────┘
```

## 执行计划

| 并行组 | 任务 | 说明 |
|--------|------|------|
| 组 1 | T-001 | 底座，须最先完成（被 T-002/T-003 依赖）|
| 组 2 | T-002, T-003 | 组件与 env 并行（改不同文件）|
| 组 3 | T-004, T-005 | 两入口视图并行（改不同文件，均依赖组件）|
| 组 4 | T-006 | 页面测试对齐 + 全量闸门收口 |

## 风险评估

| 风险 | 影响 | 应对 |
|------|------|------|
| 收敛误伤同名符号 | `MemberSummary.type`/散文 institution 被改坏 | design §8.3 明确排除清单；T-001 验收单列不改动断言 |
| `isSafeExternalUrl` 被误删 | news `ctaHref` 校验回归 | T-001 验收强制保留导出 |
| 中英语境入口丢失 | R2 不满足 | T-004/T-005 双语验收 + T-006 双语回归 |
| 环境变量兼容口径 | 生产旧变量已配则硬切换失效 | Decision 3 待用户确认；未确认前按硬切换，确认已配则切兼容别名 |
| 飞书问卷参数预填不确定 | 若假设支持会误导 | Decision 2 设计成不依赖参数，纯文案区分 |
