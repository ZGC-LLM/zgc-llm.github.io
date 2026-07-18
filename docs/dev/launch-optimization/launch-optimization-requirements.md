---
feature: launch-optimization
complexity: complex
generated_by: clarify
generated_at: 2026-07-18T00:00:00+08:00
version: 1
---

# 需求文档：上线优化版本（i18n + 内容录入机制 + SEO/性能收尾）

## 1. 概述

- **一句话**：为 ZGCLLM 官网正式上线打磨一个版本——落地**中英双语（i18n）**、搭建**内容录入机制**、补齐体检报告中的 **P0/P1 SEO 与性能项**。
- **核心价值**：从"能发布的静态站"升级到"面向国际访客、内容可持续录入、SEO 完整"的正式上线版本。
- **目标用户**：中英文访客、合作方；官网维护者（内容录入者）。
- **来源**：由 [launch-optimization-report.md](./launch-optimization-report.md) 体检结论确认而来。

## 2. 需求与用户故事

| # | 需求 | 验收标准 |
|---|------|---------|
| **R1** | **中英双语 i18n** | 全站支持 `zh`（默认，根路径）+ `en`（`/en/*`）；语言切换按钮真实生效、不再显示"即将支持"；切换后停留在对应语言的同一页面 |
| R1.1 | 路由静态化 | 用 `[locale]` 段 + `generateStaticParams` 预渲染全部 locale；`BUILD_TARGET=export pnpm build` 成功产出 zh + en 全部 HTML |
| R1.2 | 内容模型双语化 | `src/content/` 结构支持按 locale 取文案；中文为权威源，英文缺失时有明确回退策略 |
| R1.3 | 英文文案初稿 | 由我产出**机器/初稿翻译**填入，代码内标注"待人工校对"；上线前由联盟终审 |
| R1.4 | i18n SEO | 每页 `alternates.languages`（hreflang zh/en）、canonical 按 locale 正确；sitemap 含双语条目 |
| **R2** | **内容录入机制** | 成员/新闻内容可通过**类型化模板 + 校验**低成本录入；当前不录入真实数据，先把机制与占位/空态做好 |
| R2.1 | 录入模板与校验 | 提供成员/新闻录入的类型约束与单元测试校验（必填字段、授权标志、slug 唯一等），错误录入在 `typecheck`/`test` 阶段暴露 |
| R2.2 | 空态与授权门 | 保持"未授权不填充"策略；具名/角色化占位与真实数据切换清晰、可控 |
| R2.3 | 录入文档 | 补一份维护者录入指南（如何加成员/新闻、双语字段怎么填） |
| **R3** | **P0/P1 SEO 与性能收尾** | 体检报告 P0/P1 项落地 |
| R3.1 | 结构化数据 | 全站补 `Organization` + `WebSite` JSON-LD；新闻详情补 `Article` JSON-LD |
| R3.2 | logo 优化 | 644K logo 压缩/转格式至 <100K，页面渲染正常 |
| R3.3 | 字体栈修正 | 用 `next/font` 自托管 Inter，或从 `--font-sans` 删除 Inter（消除"声明了但从不加载"的不一致） |

## 3. 功能验收清单

- [ ] 语言切换在页头（桌面 + 移动）真实生效，无"即将支持"占位
- [ ] `/` 与 `/alliance` 等中文 URL **保持不变**；`/en/`、`/en/alliance` 等英文页可访问
- [ ] `BUILD_TARGET=export pnpm build` 成功，`out/` 含 zh + en 全部 HTML
- [ ] `pnpm typecheck` / `pnpm lint` / `pnpm test`（unit）/ `pnpm test:e2e` 全绿
- [ ] 每页 hreflang / canonical 正确；sitemap 含双语
- [ ] `Organization` + `WebSite` + 新闻 `Article` JSON-LD 存在且合法（Rich Results 校验通过）
- [ ] logo <100K 且显示正常；Inter 字体一致性问题消除
- [ ] 内容录入模板 + 校验测试就位；维护者录入指南存在
- [ ] 英文文案已填入并标注"待人工校对"

## 4. 技术约束

- Next.js 16 / React 19 / Tailwind v4 / pnpm；**双部署形态（Pages export + Docker standalone）必须继续同时可用**。
- **i18n 硬约束**：`output: export` + App Router **不能用** Next 内置 `i18n` 配置、**不能用中间件**做语言检测/重定向（静态导出无服务端）。方案限定为：`[locale]` 路由段 + `generateStaticParams` 预渲染 + 字典/文案分离。
- **路由策略（提议，design 阶段定死）**：`zh` 为默认、留在**根路径**（不加前缀，保住现有 URL、sitemap、e2e URL 断言稳定）；`en` 置于 `/en/*` 前缀。
- 域名维持 `www.zgc-llm.org.cn`（`src/config/site.ts`）。
- 动态路由（`news/[slug]`、`working-groups/[slug]`）需与 `[locale]` 组合后仍能 `generateStaticParams` 全量预渲染。
- 现有 CI 质量门（typecheck/lint/unit/e2e/build + `pnpm audit`）保持为发布闸门。

## 5. 排除项

- 不引入运行时语言检测 / 中间件 / SSR-only 方案（与静态导出冲突）。
- 不做 >2 语言（本轮仅中 + 英）。
- **本轮不录入真实成员/新闻数据**（只搭机制与占位），真实数据待授权后按机制填入。
- 英文文案本轮为**初稿**，不承诺终审质量（联盟人工校对后定稿）。
- 不改动 Docker 部署形态本身。

## 6. 风险与依赖

| 风险/依赖 | 说明 | 缓解 |
|-----------|------|------|
| App Router 静态导出 i18n 无官方开箱方案 | 需手写 `[locale]` + 字典模式 | design 阶段先定路由与文案加载架构，再实施 |
| 现有 e2e 依赖具体 URL/文案断言 | 引入 `[locale]` 可能大面积破坏断言 | 中文留根路径以最小化断言变更；e2e 随 i18n 同步更新 |
| 双语 × 动态路由 `generateStaticParams` 组合爆炸/遗漏 | 某 locale/slug 组合漏预渲染导致导出报错或死链 | 集中生成 params，加导出后链接校验 |
| 英文初稿质量 | 机器初稿可能有术语/品牌名错误 | 全部标注"待人工校对"，联盟名/专有名词优先保留官方中文或指定译名 |
| hreflang/canonical 配错 | 影响 SEO、可能被判重复内容 | 补 SEO 单元测试断言双语 alternates |
| 内容模型双语化触及既有类型 | `types/content.ts` 改动波及全站页面 | 设计向后兼容的双语字段结构，分步迁移 |

## 7. 下一步

复杂度 **complex**，且 i18n 涉及路由与内容模型架构决策——**建议进入 `dev-spec-dev` 设计阶段**，先产出 design.md（路由方案、双语内容模型、文案加载、SEO alternates）+ tasks.md，评审通过后再实施。

建议实施顺序（可分 PR）：
1. **R3 优化项（P0/P1）** — 独立、低风险，可先落地快速见效。
2. **R1 i18n** — 架构核心，需 design 先行。
3. **R2 内容录入机制** — 与 i18n 双语内容模型一并设计。
