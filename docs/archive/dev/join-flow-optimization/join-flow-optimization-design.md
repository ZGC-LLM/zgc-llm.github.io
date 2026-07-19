---
feature: join-flow-optimization
complexity: standard
generated_by: architect-planner
generated_at: 2026-07-18T00:00:00+08:00
version: 1
requirements: ./join-flow-optimization-requirements.md
---

# 技术设计文档: 加入路径优化与工作组问卷接入

## 1. 架构概览

### 1.1 现状与目标

当前全站两条加入路径共用同一个应用外链解析：

```
JoinView (/join)                         ── ExternalApplicationLink (无 configuredUrl)
WorkingGroupJoinView (/working-groups/                     │
  [slug]/join, 及 /en 镜像)              ── ExternalApplicationLink (无 configuredUrl)
                                                            │
                                          resolveApplicationTarget(undefined)
                                                            │
                                          默认取 APPLICATION_TARGET.href
                                          = process.env.NEXT_PUBLIC_APPLICATION_URL（联盟问卷）
```

两条路径都落到同一个 `NEXT_PUBLIC_APPLICATION_URL`。目标是让**工作组路径**能按 slug 指向该工作组专属问卷，联盟路径保持不变：

```
JoinView (/join)                         ── ExternalApplicationLink (无 configuredUrl)   → 通用变量（不变）
WorkingGroupJoinView (slug=cybersecurity)── ExternalApplicationLink                       → 专属变量
                                              configuredUrl = resolveWorkingGroupApplicationUrl(group)
                                                            │
                                              process.env[group.applicationEnvKey]
                                                = NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY
                                              未配置/非 https → 回退 NEXT_PUBLIC_APPLICATION_URL
                                              仍不可用 → ExternalApplicationLink 降级 <span>
```

### 1.2 数据流（工作组 join 页，构建期）

```
next build (SSG / output: export，Node 构建环境)
    │
    ▼
WorkingGroupJoinPage (Server Component)  ── locale=zh
EnWorkingGroupJoinPage (Server Component)── locale=en
    │  两者都渲染 →
    ▼
WorkingGroupJoinView(slug, locale)   [Server Component]
    │  group = getWorkingGroupBySlug(slug)
    │  configuredUrl = resolveWorkingGroupApplicationUrl(group)   ← 新增，服务端构建期执行
    │      ├─ key = group.applicationEnvKey
    │      ├─ raw = key ? process.env[key] : undefined            ← 动态 key，构建期 Node 环境可读
    │      ├─ isSafeExternalUrl(raw) ? raw
    │      └─ else → APPLICATION_TARGET.href（通用变量回退）
    ▼
<ExternalApplicationLink configuredUrl={configuredUrl} …/>  [已有组件]
    │  resolveApplicationTarget(configuredUrl)  → https 校验 → isAvailable
    ▼
可用 → <a target="_blank">   /   不可用 → 降级 <span>（unavailableMessage）
```

**关键点**：解析发生在 Server Component 构建期（Node 进程内 `process.env` 对象真实且已注入），因此对动态 key `process.env[key]` 的访问可用。Next.js 对 `process.env.NEXT_PUBLIC_*` 的**客户端内联**限制只影响打进浏览器 bundle 的静态成员访问；本设计不依赖客户端内联——URL 在服务端解析成字符串后作为 `configuredUrl` prop 传给组件，浏览器只拿到最终字符串。content 里保存显式 key 名（而非 URL）使「需要哪些 env」可被 grep 静态审计。

## 2. 组件设计

### 2.1 新增

无新增 React 组件（约束：不新增区块级组件，复用 `ExternalApplicationLink`）。

新增一个纯函数解析器 `resolveWorkingGroupApplicationUrl`（`src/config/site.ts`）。

### 2.2 修改

| 文件 | 修改点 |
|------|--------|
| `src/types/content.ts` | `WorkingGroupSummary` 增加可选字段 `applicationEnvKey?: string`（注释说明：专属问卷的 env 变量名，非 URL 本身；未设置则回退通用变量）|
| `src/content/working-groups.ts` | cybersecurity 组增加 `applicationEnvKey: 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY'`。en 覆盖层 `WorkingGroupOverlay` **不含**此字段（env key 不可翻译，无需改动）|
| `src/config/site.ts` | 新增 `resolveWorkingGroupApplicationUrl(group)`；导入类型 `WorkingGroupSummary`|
| `src/app/(frontend)/working-groups/[slug]/join/page.tsx` | `WorkingGroupJoinView` 中计算 `configuredUrl` 并传入 `ExternalApplicationLink`；zh+en STRINGS 润色文案 + 交叉引导（en 路由镜像复用同一 View，自动覆盖两语言）|
| `src/components/pages/join-view.tsx` | zh+en STRINGS 润色文案 + 交叉引导；CTA 行为不变（不传 configuredUrl）|
| `.env.example` / `.github/workflows/deploy-pages.yml` / `Dockerfile` / `.github/workflows/ci.yml` | 声明 `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY` |
| `tests/unit/site-config.test.ts` | 扩展：新解析器的 3 分支（命中专属 / 回退通用 / 非 https 回退）|
| `tests/e2e/*.spec.ts` | 断言两页交叉引导文案 + CTA 渲染一致性（host 无关）|

## 3. 接口设计

### 3.1 新增解析器（`src/config/site.ts`）

```ts
import type { WorkingGroupSummary } from '@/types/content'

/**
 * 解析某工作组加入 CTA 应使用的外部问卷 URL。
 * - 命中 group.applicationEnvKey 且值为 https → 返回该值
 * - 否则回退通用 APPLICATION_TARGET.href（联盟问卷）
 * - 由 ExternalApplicationLink 内部的 resolveApplicationTarget 再做一次 https 校验与降级
 *
 * 仅在 Server Component 构建期调用；依赖 process.env 的动态 key 访问（构建期 Node 可用）。
 */
export function resolveWorkingGroupApplicationUrl(
  group: Pick<WorkingGroupSummary, 'applicationEnvKey'>,
): string | undefined {
  const key = group.applicationEnvKey
  const specific = key ? process.env[key] : undefined
  return isSafeExternalUrl(specific) ? specific : APPLICATION_TARGET.href
}
```

设计说明：
- 返回类型为 `string | undefined`。返回值直接喂给 `ExternalApplicationLink` 的 `configuredUrl`；组件已有的 `resolveApplicationTarget` 会再次 `isSafeExternalUrl` 校验并在不可用时降级——因此本解析器不重复构造 `ResolvedApplicationTarget`，避免逻辑分叉。
- 回退链：专属 https → 通用 `APPLICATION_TARGET.href` → （组件层）降级 span。满足 R2/R3。
- 参数用 `Pick<…, 'applicationEnvKey'>` 而非整个 group，降低耦合、便于单测。

### 3.2 调用点（`WorkingGroupJoinView`）

```tsx
const group = getWorkingGroupBySlug(slug)
if (!group) notFound()
const configuredUrl = resolveWorkingGroupApplicationUrl(group)
// …
<ExternalApplicationLink className="button-primary" configuredUrl={configuredUrl} label={t.applyCta}>
  {t.applyCta}
</ExternalApplicationLink>
```

`JoinView`（联盟页）不改这一行，继续走默认通用变量。

## 4. 数据设计

### 4.1 类型变更

```ts
export interface WorkingGroupSummary {
  // …既有字段…
  /** 该工作组专属申请问卷的环境变量名（非 URL 本身）；未设置则回退通用 NEXT_PUBLIC_APPLICATION_URL */
  applicationEnvKey?: string
  // …
}
```

可选字段，向后兼容：现有唯一工作组 cybersecurity 设值，未来新增工作组不设即自动回退通用变量（R2 「未来零回归」）。

### 4.2 环境变量约定

| 变量 | 用途 | 注入位置 |
|------|------|----------|
| `NEXT_PUBLIC_APPLICATION_URL` | 联盟通用问卷（既有）| GitHub Variable / `.env.local` / Docker ARG |
| `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY` | 网安工作组专属问卷（新增）| 同上 |

命名约定：`NEXT_PUBLIC_APPLICATION_URL_<SLUG_UPPER>`。真实 URL 不进仓库，仅 content 存 key 名。

## 5. 技术选型

- 沿用现有「env 注入 + 服务端解析 + 组件降级」三段式，无新增依赖。
- 显式 key 映射（content 存 key 名）优于「按 slug 拼 key」的隐式约定：可静态 grep 审计、非法/未来 slug 不会静默拼出错误 key。（本设计用显式 `applicationEnvKey` 字段，非运行时拼接，二者取显式。）

## 6. 安全考量

- URL 安全校验完全复用 `isSafeExternalUrl`（仅放行 https），阻断 `javascript:` / `http:` / `data:` 等。
- 不硬编码真实链接，无密钥入库（遵守 CLAUDE.md / `.env.example` 约束）。
- 外链保持 `rel="noreferrer noopener"` + `target="_blank"`（既有组件行为）。

## 7. 测试策略

### 7.1 单元测试（Vitest）— 承担「解析正确性」主验证

在 `tests/unit/site-config.test.ts` 扩展（该文件已直接测 `resolveApplicationTarget` / `isSafeExternalUrl`，模式一致）：

- 命中专属 https：设 `process.env.NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY = 'https://a.feishu.cn/x'`，`resolveWorkingGroupApplicationUrl({ applicationEnvKey: 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY' })` 返回该 URL。
- 回退通用：未设专属 key（或 `applicationEnvKey` undefined），返回 `APPLICATION_TARGET.href`。
- 非 https 回退：专属 key 设为 `http://…`，返回通用变量（不返回该 http 值）。
- 「两条路径不同 host」的**语义**在单测层验证：专属 host ≠ 通用 host（用两个 https 常量断言）。

> ⚠️ 用例需在断言后恢复/清理 `process.env`（`afterEach` 或 `vi.stubEnv`），避免污染其它用例。`site.ts` 顶层 `APPLICATION_TARGET.href` 在模块加载时读取 `process.env.NEXT_PUBLIC_APPLICATION_URL`，因此对「回退通用」的断言应对比 `APPLICATION_TARGET.href` 本身，而非假设某具体值。

### 7.2 e2e（Playwright）— host 无关的渲染与文案

现状：playwright webServer 以 `next dev` 启动且**不注入任何 application env**，故两页 CTA 在 e2e 环境均渲染降级 `<span>`「申请通道准备中」。现有 `conversion.e2e` 与 `working-groups.e2e` 正是断言此降级态（后者用 `if (count)` 容错分支）。因此 e2e **不适合**直接断言「两 CTA 指向不同真实 host」——那需要给 webServer 注入 env，会破坏现有降级断言。

e2e 只做 host 无关、env 无关的断言（与现有风格一致）：
- 两页各自渲染成功、CTA 存在（沿用 `if (disabledEntry.count()) … else …` 容错模式）。
- **交叉引导文案可见**（env 无关，稳定信号）：联盟页含指向网安工作组入口的语句；网安工作组页含指向联盟入口的语句（zh 断言即可，en 镜像由单测/构建覆盖）。
- 若 CTA 渲染为链接（有 env 的环境）则断言 `target="_blank"`（沿用现有分支）。

（可选，不在本次范围）若团队后续想在 e2e 真正验证不同 host，可新增独立 playwright project + 注入两个 dummy https env，单独 describe，不影响默认降级用例。

### 7.3 提交前门禁

`pnpm typecheck && pnpm lint && pnpm test && pnpm build` 全绿。

## 8. 迁移计划

1. 配置层（类型 + content + 解析器）先落地，向后兼容，不改变任何现有页面行为（未设新 env 时工作组页仍回退通用变量，与今日一致）。
2. 工作组 join 页接线：仅在新 env 配置后才切到专属问卷；未配置则行为不变。
3. 文案润色纯前端文本，无行为风险。
4. 部署/env 文件声明新变量；真实值由用户在 GitHub Variables 填入（不在本次交付范围）。
5. 回滚：删除 cybersecurity 组的 `applicationEnvKey` 即回到共用通用变量；解析器与字段可保留。

### 交付清单（供用户配置）
- GitHub 仓库 Settings → Variables：`NEXT_PUBLIC_APPLICATION_URL`（联盟）、`NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`（网安）。
- 本地 `.env.local`（gitignored）同名两项。
</content>
</invoke>
