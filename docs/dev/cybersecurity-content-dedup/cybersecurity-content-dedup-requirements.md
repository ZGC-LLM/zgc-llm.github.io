---
feature: cybersecurity-content-dedup
complexity: standard
generated_by: clarify
generated_at: 2026-07-18T00:00:00+08:00
version: 1
---

# 需求文档: 网络安全工作组与网络安全生态两页去重与分工对齐

## 1. 概述

- **一句话描述**：将「网络安全工作组」（`working-groups.ts` 中 slug=`cybersecurity` 条目）与「网络安全生态」（`cybersecurity.ts`）两页的重叠内容与不一致分工按「工作组=组织入口、生态=内容与运作」的定位重新划分，建立单一权威源，消除重复与中英漂移。
- **核心价值**：读者不再在两页看到重复且互相矛盾的分工/职责；内容维护从「两份手工同步」变为「单一权威 + 引用」，从源头杜绝 `support/lead` 这类漂移。
- **目标用户**：官网访问者（工作组入口与生态内容读者）、内容维护者。

## 2. 需求与用户故事

### 需求清单

- **R1 两页定位划分**：工作组页承担「组织与入口」（定位、分工名单、研究方向、加入入口），生态页承担「内容与运作细节」（重点行动、资源、闭环、贡献方式、治理边界）。
- **R2 分工名单单一权威**：具名分工（谁负责什么）以工作组页 `leads` 为唯一权威源；生态页不再单独维护一份 `organisation` 名单，如需展示则引用工作组分工或以一句话概述带过。
- **R3 分工冲突对齐**（用户已逐项确认）：
  - 智谱：统一为「模型与技术牵引 / lead」（原生态 lead 表述为准，工作组 support 改为 lead）。
  - 数说安全 + 云起无垠：保留独立两条分工（产业研究与生态连接 / 技术平台与项目运营），不合并为「联合运营」。
  - 清华大学：统一为「学术指导」，去掉「技术」。
  - 监管/主管部门：移出分工名单，收敛到生态页 `governanceBoundaries` 表述。
- **R4 职责去重**：
  - 「运营网络安全人员开放计划」现出现 3 次 → 详细版留生态页 `actions`，工作组页 `responsibilities` 仅保留一句入口式概述并链接生态页（`ecosystemHref` 已存在），删除工作组 `outcomes` 中的重复项。
  - 深度数据与任务体系、验证与应用机制（工作组 responsibilities ②③ ≈ 生态 actions ③④）→ 详细版留生态页，工作组页职责精简为高层概述。
- **R5 中英一致**：以上每处字段中英各存一份（`WORKING_GROUPS_EN` overlay / `Localized` 结构），改动时中英同步修正。

### 验收标准

- 同一职责/行动不在两页重复出现（工作组页仅保留入口式概述 + 链接）。
- 智谱、数说、云起、清华、监管五处分工在两页（及中英）表述一致，符合 R3。
- 分工名单只有一处权威定义。

## 3. 功能验收清单

- [ ] 工作组页 `cybersecurity` 条目：`leads` 中智谱=牵引/lead、清华=学术指导；数说、云起为独立两条；无监管条目。
- [ ] 工作组页 `responsibilities` 精简为高层概述，「运营开放计划」仅一句 + 指向 `/cybersecurity`；`outcomes` 去除重复项。
- [ ] 生态页 `actions`/`resources`/`cycle`/`contribution`/`governanceBoundaries` 保留为内容权威；监管收敛到 `governanceBoundaries`。
- [ ] 生态页不再维护与工作组重复的 `organisation` 分工名单（改为引用或一句话概述）。
- [ ] 中英双语所有上述字段一致，无 support/lead 类漂移。
- [ ] 两页渲染视图（`working-groups/[slug]`、`cybersecurity-view.tsx` 及 en 对应）正常，无因字段删改导致的类型/渲染错误。
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm build` 全通过。

## 4. 技术约束

- 涉及文件：`src/content/working-groups.ts`（含 `WORKING_GROUPS_EN`）、`src/content/cybersecurity.ts`、可能需调整 `src/types/content.ts`（`WorkingGroupSummary` / `CybersecurityEcosystem` 若 `organisation` 结构变更）、渲染层 `src/components/pages/cybersecurity-view.tsx` 及 `working-groups/[slug]` 页面。
- 内容集中在 `src/content/`，不得在页面组件混入复杂逻辑（遵循 CLAUDE.md 约定）。
- TypeScript 严格模式，不使用 `any`；若删除 `organisation` 字段需同步更新类型与所有引用点。
- 中英双语必须同步；`ecosystemHref: '/cybersecurity'` 互链保持有效。
- 集成点：两个内容文件 + 类型 + 两处（×2 语言）页面渲染。

## 5. 排除项

- 不改动其他工作组（仅网络安全工作组条目）。
- 不改动 `alliance.ts` 的机制描述（除非删字段导致引用失效）。
- 不新增页面、不调整路由结构、不改视觉设计。
- 不改动工作组成员数据（`working-group-members.ts`）的成员维度。

## 6. 风险与依赖

| 风险/依赖 | 说明 | 缓解 |
|---|---|---|
| 类型变更连锁 | 若删除/改造 `organisation` 字段，`types/content.ts` 与所有引用点需同步 | 先全仓搜索引用，改类型再改数据，靠 typecheck 兜底 |
| 中英漂移复发 | 双份副本仍靠人工同步 | 本次对齐后在 PR 描述标注需同步的字段；可评估后续抽共享常量（本次不做） |
| 渲染缺字段 | 生态页移除 organisation 后视图可能引用空值 | 调整 `cybersecurity-view.tsx`，补空态或改引用工作组分工 |

## 7. 下一步

- 进入 `dev-spec-dev`，生成 design.md（确定 `organisation` 是删除还是改为引用、类型调整方案）+ tasks.md。
- 建议命令：`/devagent:dev-spec-dev cybersecurity-content-dedup --skip-requirements`
