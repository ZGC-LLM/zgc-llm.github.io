---
feature: launch-optimization
type: audit-report
generated_by: dev-clarify
generated_at: 2026-07-18T00:00:00+08:00
version: 1
---

# 上线前优化体检报告：ZGCLLM 官网

> 目标：正式上线前的系统性体检。覆盖四个维度：**上线体检/SEO、性能与可访问性、内容真实性、代码质量**。
> 交付形态：**先出报告 + 按优先级排序的改进清单**（本轮不改代码，待确认后实施）。

## 0. 总体结论

底子很干净：**质量门全绿**，静态导出可发布。距离"正式对外"主要差 **3 个高可见度小项**（未完成的语言切换、缺结构化数据、内容空态待业务确认），其余为锦上添花。

| 实测项 | 结果 |
|--------|------|
| `pnpm typecheck` | ✅ 通过 (exit 0) |
| `pnpm lint` | ✅ 通过 (exit 0) |
| `pnpm test:unit` | ✅ 通过 (exit 0) |
| `BUILD_TARGET=export pnpm build` | ✅ 成功，产出 `out/`（16 个 HTML） |
| Pages 部署产物 | ✅ `out/CNAME`、`out/.nojekyll`、`sitemap.xml`、`robots.txt`、OG 图均生成 |

---

## 1. 上线体检 / SEO

**已到位（✅）**：sitemap、robots、canonical、`metadataBase`、title 模板 `%s｜站名`、OpenGraph + 站点级 OG 图、11 个页面均有 `description`/`generateMetadata`、favicon/apple-icon。

**缺口**：

- 🔴 **全站无任何结构化数据 / JSON-LD**。实测 `grep @context / @type / ld+json / Organization` 在 `src` 下**零命中**（layout 里唯一的 `dangerouslySetInnerHTML` 是主题脚本，不是结构化数据）。对一个"官方联盟"站点，缺 `Organization` + `WebSite` 是明显的 SEO 与品牌搜索损失（影响 Google 知识面板、站点链接搜索框）。
  > 注：初次自动扫描曾误报"新闻/工作组页已有 JSON-LD"，经逐文件核实**并不存在**，此处以实测为准。
- 🟡 新闻详情页缺 `Article` / `NewsArticle` JSON-LD，各二级页缺 `BreadcrumbList`。
- 🟡 robots `disallow: ['/admin','/api']` 指向不存在的路径（无害，可保留）。

## 2. 性能与可访问性

**已到位（✅）**：skip-link「跳到主要内容」、`aria-live`/`role=status`、首帧无闪烁主题脚本、`suppressHydrationWarning`、`next/image` 均带 `alt`。

**缺口**：

- 🟡 **字体栈失效**：`styles.css` 把 `'Inter'` 列为首选字体，但**没有 `next/font` 导入、也没有 `@font-face`** → Inter 永远不会加载，静默回退到 `system-ui`。要么用 `next/font` 自托管 Inter，要么从字体栈里删掉 Inter（避免只有装了 Inter 的机器才不一样的隐性不一致）。
- 🟡 **logo 过重**：`public/brand/llm-alliance-logo.png` 为 **644K**，静态导出下 `images.unoptimized` 意味着原样下发、每页页头都加载。建议压缩/缩放（或转 WebP），目标 <100K。OG 图 223K、icon 38K 可接受。
- 🟡 无自动化 a11y 测试（如 axe）—— 可选补强。
- 🟡 无 CSP / 安全响应头（Pages 静态托管本就无法设响应头；Docker/standalone 形态可补 `headers()`）——低优先。

## 3. 内容真实性

- 🔴 **未完成功能暴露在页头**：`LanguageToggle` 在桌面 + 移动页头都渲染，但点击只弹「即将支持」（EN 版不存在）。这是正式站上最扎眼的"半成品"信号。建议**上线前隐藏**该入口，待 i18n 就绪再放出。
- 🟡 **内容空态待业务拍板**：成员仅 10/32 家具名、新闻仅 2 条——代码注释显示这是"未授权不填充"的**有意策略**（诚实、合规）。需业务确认这些空态在上线时可接受。
- ✅ 无 TODO/FIXME 代码债；空态均为设计内、有注释说明。

## 4. 代码质量

- ✅ 整体健康：TS 严格模式、`no-explicit-any: error`、无代码债、单元 + e2e 覆盖较全（内容/SEO/组件/转化/集成）。
- 🟡 `experimental.globalNotFound`（Next 16 实验 API）—— 已验证能导出 404，注意跟随 Next 版本稳定性。
- 🟡 e2e 仅跑 Chromium；上线前可考虑至少补一个引擎（可选）。
- 🟡 组件都堆在单个 `site/` 目录、粒度偏粗——当前规模无需动。

---

## 5. 改进清单（按优先级）

### P0 — 上线前建议处理（高可见度 / 低风险）
1. **隐藏「即将支持」语言切换入口**（`site-header.tsx` × 2 处）——移除半成品观感。
2. **补 `Organization` + `WebSite` JSON-LD**（放 layout，全站生效）——SEO 高性价比，低风险。
3. **业务确认成员/新闻空态可上线**（成员 10/32、新闻 2 条）。

### P1 — 上线前后尽快
4. **压缩 644K logo**（→ WebP / <100K）。
5. **修字体栈**：`next/font` 自托管 Inter，或从 `--font-sans` 删掉 Inter。
6. **新闻详情补 `Article` JSON-LD + 二级页 `BreadcrumbList`**。

### P2 — 可上线后迭代
7. axe 自动化 a11y 测试；逐页 OG 图；多引擎 e2e；Docker 形态补安全响应头。

---

## 6. 下一步

确认清单后，建议按 **P0 → P1** 开一个 `feat/launch-optimization` 分支实施，全绿后开 PR 到 `main`。P0 三项工作量都很小（半天内）。
