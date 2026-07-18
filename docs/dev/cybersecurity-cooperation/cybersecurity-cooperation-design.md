---
feature: cybersecurity-cooperation
complexity: standard
generated_by: architect-planner
generated_at: 2026-07-18T00:00:00+08:00
version: 1
---

# 技术设计文档: 统一合作/加入入口（共享一张飞书问卷）

> 需求权威来源：`cybersecurity-cooperation-requirements.md` v2。核心：官网侧保留分场景入口与文案，但所有 CTA 收敛到**同一张外部飞书问卷**；代码侧把现有 `institution` / `professional` 双 target + 双环境变量收敛为**单一问卷 target**，保证 `/join`、`/working-groups/cybersecurity/join` 中英双语不回归；官网零个人信息落库。

## 1. 架构概览

### 1.1 系统架构（现状 → 目标）

现状：官网存在**两条并列的外链申请通道**，各自独立环境变量与 target：

```
ApplicationKind = 'institution' | 'professional'
        │
        ├─ institution   ← NEXT_PUBLIC_INSTITUTION_APPLICATION_URL   → /join (JoinView)
        └─ professional  ← NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL   → /working-groups/cybersecurity/join (WorkingGroupJoinView)

                共用：resolveApplicationTarget(kind) → isSafeExternalUrl → ExternalApplicationLink
```

目标：收敛为**单一问卷 target + 单一环境变量**，官网多入口通过「按语境传入的 CTA 文案」区分，后端（飞书问卷）只有一个：

```
单一问卷 target  ← NEXT_PUBLIC_APPLICATION_URL
        │
  resolveApplicationTarget() → isSafeExternalUrl → ExternalApplicationLink(label=语境文案)
        │
        ├─ /join (JoinView, zh + /en)                → label「机构合作申请 / Partner with Us」
        └─ /working-groups/cybersecurity/join         → label「专业用户申请 / Apply as a professional user」
           (WorkingGroupJoinView, zh + /en)
```

关键点：**一个 URL，多个语境入口**。语境差异只体现在页面文案与 CTA label 上，不在后端分叉——分叉逻辑（意向类型 + 专家/机构身份）完全在飞书问卷侧配置，代码不硬编码字段。

### 1.2 数据流

1. 构建期：`NEXT_PUBLIC_APPLICATION_URL` 注入 → `APPLICATION_TARGET.href`。
2. 渲染期：`resolveApplicationTarget()` 用 `isSafeExternalUrl`（`https:` 校验）判定 `isAvailable`。
3. 组件期：`ExternalApplicationLink` 可用则渲染 `<a target=_blank rel=noreferrer noopener>`（label 由调用方按语境传入），不可用则渲染降级 `<span aria-disabled>` 文案。
4. 运行期：用户点击外链跳转飞书问卷；**官网不接收、不落库任何个人信息**（硬约束，零后端）。

## 2. 组件设计

### 2.1 修改组件

| 组件 / 模块 | 变更 |
|------|------|
| `src/types/content.ts` | 收敛 `ApplicationKind` 与 target 类型（见 §4.1）|
| `src/config/site.ts` | `APPLICATION_TARGETS`(record) → 单一 `APPLICATION_TARGET`；`resolveApplicationTarget` 去掉 `kind` 参数；读单一 env；**保留 `isSafeExternalUrl` 导出**（`news/[slug]/page.tsx` 亦依赖它校验 `ctaHref`）|
| `src/components/site/external-application-link.tsx` | 去掉 `kind` prop，新增可选 `label`（语境文案 → aria-label 与 fallback children），保持 https 校验 / `target=_blank` / `rel=noreferrer noopener` / 降级文案不变 |
| `src/components/pages/join-view.tsx` | CTA 由 `kind="institution"` 改为无 kind + `label={t.applyCta}`（zh/en 复用同组件，一次改动覆盖两语）|
| `src/app/(frontend)/working-groups/[slug]/join/page.tsx` | CTA 由 `kind="professional"` 改为无 kind + `label={t.applyCta}`；`(en)` 版复用 `WorkingGroupJoinView`，一次改动覆盖 zh + /en |
| `.env.example` | 两变量 → 单一 `NEXT_PUBLIC_APPLICATION_URL`（不含真实链接）|

### 2.2 不新增组件 / 不新增页面

- **不**新增独立「合作招募」页面或路由，**不**新增 `/professionals`（历史决策：见 `conversion-pages.test.tsx`）。
- 网安组合作展示内容**就地增强** `WorkingGroupJoinView`（已含 价值/路径/流程/FAQ 四段，聚焦网络安全工作组），只做 CTA 收敛与必要文案微调，不重构页面结构（Decision 4）。

## 3. 接口设计

### 3.1 外部接口

- 唯一外部依赖：飞书问卷公开链接（外部/匿名可填），经 `NEXT_PUBLIC_APPLICATION_URL` 注入。官网只放外链，不代理、不回传。
- **不依赖飞书 URL 参数预填**（Decision 2）：本期语境区分纯前端文案实现，避免绑定不确定的问卷能力。若将来运营确认支持参数预填，可在 `ExternalApplicationLink` 增加可选 `hrefSuffix`/query 追加点扩展，默认关闭——本期不实现。

### 3.2 内部接口（收敛后）

```ts
// src/config/site.ts
export const APPLICATION_TARGET: ExternalApplicationTarget
export function isSafeExternalUrl(value?: string): value is string   // 保留，news 复用
export function resolveApplicationTarget(
  configuredUrl?: string,          // 默认 APPLICATION_TARGET.href
): ResolvedApplicationTarget       // 去掉 kind 参数
```

```tsx
// ExternalApplicationLink props
interface ExternalApplicationLinkProps {
  children?: ReactNode
  className?: string
  configuredUrl?: string
  label?: string            // 语境文案；缺省回退 APPLICATION_TARGET.label
}
```

## 4. 数据设计

### 4.1 类型变更（`src/types/content.ts`）

- `ApplicationKind`：**移除**（双 kind 语义消失）。全仓库仅 2 处 `kind=` 使用点，均迁移为 label 传参。
  - ⚠️ 注意区分：`MemberSummary.type: 'institution' | ...` 与散文中的 institution/professional **与本收敛无关**，不得改动。
- `ExternalApplicationTarget`：移除 `internalHref`（仅测试断言用的描述性字段，页面不渲染；`/join`、`/working-groups/cybersecurity/join` 路由本身不变）。保留 `href?` / `label` / `unavailableMessage`。
- `ResolvedApplicationTarget`：保持 `extends ExternalApplicationTarget + isAvailable`。

### 4.2 内容 / 存储

- 无数据库、无落库。工作组维度仍走 `src/content/working-groups.ts`（含 `WORKING_GROUPS_EN` 覆盖层），结构不变，将来加组只增配置。
- 合作展示文案沿用 `WorkingGroupJoinView` 内 `STRINGS: Record<Locale, ...>`（zh 权威 + en）；如需强化「合作/共建」措辞在此就地微调，保持中英同步。

## 5. 技术选型与关键决策权衡

### Decision 1：双 target 收敛方式 —— 推荐【单一 target + 语境 label 覆盖】

| 方案 | 说明 | 取舍 |
|------|------|------|
| A（推荐）单一 target，去 kind，组件加 `label` | 语义最清晰，「一个 URL」在类型层强约束；改动面 = 2 组件调用点 + 组件 + config/types + 测试 | 改动稍大但一次到位，杜绝再出现双通道 |
| B 保留 record，收敛为单一 `cooperation` kind | 改动更小（仅改 record 内容与 env） | 仍保留「按 kind 取 target」的多通道形状，语义半吊子，易回潮 |
| C 复用其一改语义 | 改动最小 | 语义误导（institution/professional 名称与「统一问卷」不符），可读性差 |

**推荐 A**：对外只暴露一个问卷 URL，语境差异下放到调用方 label。**需用户确认**（见文末决策点）。

### Decision 2：多入口共享同一 URL —— 推荐【纯前端文案区分，不依赖 URL 参数预填】

不确定飞书问卷是否支持 query 预填意向类型；设计成**不依赖该能力**，各入口仅文案不同、URL 相同。预留扩展点但本期不实现。**需运营确认**是否需要参数预填（若需要，再走 §3.1 扩展点）。

### Decision 3：环境变量收敛与兼容 —— 推荐【硬切换到单一变量】

| 方案 | 说明 |
|------|------|
| A（推荐）硬切换：只读 `NEXT_PUBLIC_APPLICATION_URL` | `.env.example` 现两变量均为空、站点尚未正式上线（无生产旧值需保留），硬切换最干净 |
| B 兼容别名一段时间：`APPLICATION_URL ?? INSTITUTION ?? PROFESSIONAL` | 若生产已配旧变量则平滑；但会残留过渡代码与两套语义 |

**推荐 A**（上线前一次性切换）。**需用户确认**生产环境是否已配置旧变量——若已配，改用 B 兜底一版。

### Decision 4：网安组合作展示落位 —— 推荐【就地增强现有 WG join 视图】

R2 要求保留网安组「参与/合作」入口且内容聚焦工作组。现有 `WorkingGroupJoinView` 已覆盖 价值/路径/流程/FAQ，**就地增强 + CTA 收敛**即可，不新增独立板块、不重构页面。

## 6. 安全与合规考量

- 外链一律经 `isSafeExternalUrl` 强制 `https:`，`rel="noreferrer noopener"` + `target="_blank"` 防 tabnabbing / referrer 泄露。
- 官网**零个人信息收集/存储**：无表单、无后端、无 DB；`/privacy` 页已声明「官网不收集或存储申请信息、以飞书表单内隐私说明为准」，收敛后仍成立。
- 文档与 `.env.example` **不得**出现真实问卷链接或密钥。
- 域名合规沿用现状：canonical / alternates 以带连字符 `www.zgc-llm.org.cn` 为准，本期不涉及域名改动。

## 7. 测试策略（TDD）

先改/加测试再改实现，覆盖：

1. **config 层**（`tests/unit/site-config.test.ts`）：单一 `APPLICATION_TARGET` 形状、`resolveApplicationTarget()` 无 kind、`isSafeExternalUrl` 六组用例保留、缺省降级 `isAvailable=false`。
2. **组件层**（`tests/unit/site-components.test.tsx`）：`ExternalApplicationLink` 无 kind、`label` 覆盖 aria-label、https 安全链接属性、`javascript:` 降级为 `aria-disabled` span、header 机构入口内链 `/join` 仍在。
3. **页面层**（`tests/unit/conversion-pages.test.tsx`）：`/join`（机构语境）与 `/working-groups/cybersecurity/join`（专业/合作语境）CTA 均指向单一 target；URL 缺省时两页均降级文案不报错；无 `/professionals` 独立页；privacy 边界文案保留；**中英双语**断言齐备。
4. **回归**（`tests/unit/site-core-modules.test.ts` 若引用收敛符号则同步）：`/join`、`/working-groups/cybersecurity/join` 静态路由与降级行为不回归。
5. **闸门**：`pnpm typecheck && pnpm lint && pnpm test && pnpm build` 全绿。

## 8. 影响面 / 引用点清单（收敛不回归的关键）

### 8.1 必须改动（申请 target 机制本体）

| # | 文件 | 引用点 | 变更 |
|---|------|--------|------|
| 1 | `src/types/content.ts` | `ApplicationKind`(L6)、`ExternalApplicationTarget`(L8)、`ResolvedApplicationTarget`(L15) | 移除 kind / internalHref，收敛类型 |
| 2 | `src/config/site.ts` | `APPLICATION_TARGETS`(L55)、`resolveApplicationTarget`(L80)、env 读取(L57/L63)；`isSafeExternalUrl`(L70) | 收敛为单一 target/env，去 kind；**保留** `isSafeExternalUrl` |
| 3 | `src/components/site/external-application-link.tsx` | `kind` prop(L10) 全体 | 去 kind，加 `label` |
| 4 | `src/components/pages/join-view.tsx` | `kind="institution"`(L159) | 去 kind + `label={t.applyCta}` |
| 5 | `src/app/(frontend)/working-groups/[slug]/join/page.tsx` | `kind="professional"`(L223) | 去 kind + `label={t.applyCta}`（`(en)` 复用同 View，自动覆盖）|
| 6 | `.env.example` | 两 `NEXT_PUBLIC_*_APPLICATION_URL`(L1-2) | → 单一 `NEXT_PUBLIC_APPLICATION_URL` |
| 7 | `tests/unit/site-config.test.ts` | L37-45 断言双 target | 改为单一 target 断言 |
| 8 | `tests/unit/site-components.test.tsx` | `kind="institution"`(L16/L28) | 改为 label 用法 |
| 9 | `tests/unit/conversion-pages.test.tsx` | L7/L23-49 institution/professional 断言 | 改为单一 target + 双语言语境断言 |
| 10 | `tests/unit/site-core-modules.test.ts` | 若引用收敛符号 | 同步（实施时确认）|

### 8.2 相关但不因收敛而改（仅确认不回归 / 可选文案）

- `src/components/site/site-header.tsx`（L67-69/L85-90）：`t.institutionApply` 指向**内链 `/join`**（非 ExternalApplicationLink），功能不变，保留「加入联盟」入口；如需文案统一可选微调，非必须。
- `src/i18n/dictionary.ts`（`institutionApply` L22/L55/L90）：同上，仅 chrome 标签。
- `src/app/(en)/en/join/page.tsx`、`src/app/(en)/en/working-groups/[slug]/join/page.tsx`：复用 View，无需单独改逻辑，仅随 View 覆盖。

### 8.3 明确排除（同名但无关，禁止改动）

- `MemberSummary.type: 'institution'`（`src/content/members.ts`、`members-view.tsx`、`lib/content-validation.ts`）——成员分类，与申请 target 无关。
- `src/content/*`、各 view 中散文里的 "professional / institution" 词汇——正文内容，非机制引用。
- `news/[slug]/page.tsx` 的 `isSafeExternalUrl(ctaHref)`——独立复用该函数，**必须保证函数保留导出**，本身不改。

## 9. 迁移计划

1. TDD：先改测试（T-001/T-002/T-006 内），红 → 绿。
2. 类型/配置收敛（T-001）→ 组件（T-002）→ 两入口视图（T-003/T-004）→ `.env.example`（T-005）。
3. 全量闸门（T-006）：typecheck / lint / test / build 全绿，人工确认 `/join` 与网安组 join 中英双语不回归。
4. 运营侧（官网范围外，前置依赖）：飞书新建「意向类型 + 专家/机构身份」分支、外部匿名可填的统一问卷，产出链接配置 `NEXT_PUBLIC_APPLICATION_URL`；用无痕浏览器实测可匿名提交。
