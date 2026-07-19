# ZGCLLM 设计系统 v2（Design Language）

> 本文件为项目本地设计规范，优先级高于内置参考。锚定现有 `src/app/(frontend)/styles.css`，
> 向 Z.ai 干净现代 + Linear/Supabase 精密暗色演进，light/dark 双主题，中英双语为原型演示 + 语言切换 UI 占位（正式 i18n 后续实施，正文不切换）。
> 落地实现由 `dev-spec-dev` 负责；本文件只定义 token 与组件语言。

## 1. 设计原则

1. **商务蓝白为底**：保留品牌蓝 `#1464d2` 作锚点，向更亮的交互蓝 `#2f6bff`（Z.ai 味）过渡。
2. **暗色为一等公民**：dark 不是反色，海军蓝 hero 压到近黑 `#05070b`，品牌蓝提亮保证对比度 ≥ 4.5:1。
3. **中英双语层级（原型演示）**：section 标题 = 中文主标题 + 英文 eyebrow；原型正文提供 CN/EN 双份 + `data-lang` 显隐**仅为演示**。落地本轮仅保留语言切换 UI 占位，不切换正文；完整 i18n 后续实施。
4. **克制装饰**：留白优先，卡片细描边 + 极轻阴影；深区用 glow + 细网格。

## 2. 色彩 Token（双主题）

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `--brand-primary` | `#1464d2` | `#4c8dff` | 主操作/链接 |
| `--brand-vivid` | `#2f6bff` | `#5b8cff` | 渐变端/hover |
| `--brand-hover` | `#0f54b5` | `#6f9dff` | 按钮 hover |
| `--accent` | `#18a7bd` | `#3fd0e0` | 点缀/数据 |
| `--accent-soft` | `#8ee5ed` | `#7fe6f2` | eyebrow/深区强调 |
| `--bg-page` | `#f7f9fc` | `#0a0d12` | 页面底 |
| `--bg-surface` | `#ffffff` | `#12161f` | 卡片 |
| `--bg-subtle` | `#eef3f9` | `#10141c` | 次级区块底 |
| `--bg-hero` | `#071b37` | `#05070b` | Hero/深区/footer |
| `--border` | `#e2e8f1` | `#1e2530` | 描边 |
| `--border-strong` | `#cdd8e6` | `#2a3340` | 强描边/ghost 按钮 |
| `--text-title` | `#0d1f38` | `#f2f5fa` | 标题 |
| `--text-body` | `#31445e` | `#aab6c8` | 正文 |
| `--text-muted` | `#65758a` | `#6b7688` | 次要 |
| `--text-inverse` | `#ffffff` | `#f2f5fa` | 深区文字 |
| `--text-inverse-muted` | `#b9c8da` | `#8b98ab` | 深区次要 |

> 主题切换：`html[data-theme="dark"]` 覆盖 `:root`；`prefers-color-scheme` 作首帧兜底。

## 3. 排版

- 字体：`Inter, ui-sans-serif, system-ui, "PingFang SC", "Microsoft YaHei"`；英文/数字走 Inter，中文走 PingFang/思源。
- 标题：`clamp(26px,3vw,34px)`，`font-weight:700`，`letter-spacing:-.01em`。
- Hero H1：`clamp(34px,5vw,58px)`，`line-height:1.08`。
- eyebrow：`12px / 700 / letter-spacing .16em / UPPERCASE`，light 用 `--brand-primary`，深区用 `--accent-soft`。
- 正文行高 1.75；深区 lead 行高 1.8。

## 4. 尺寸与系统

| 项 | 值 |
|---|---|
| 容器最大宽 | `1200px`，`padding-inline: 24px`（≤640 收到 16px） |
| 圆角 | 卡片 `16px`、按钮/输入/toggle `10px`、pill `999px` |
| 区块纵向留白 | `80px`（桌面），移动 `64px` |
| 阴影 | card `0 8px 30px rgb(7 27 55/6%)`；dark 用 shadow-as-border 高光内阴影 |
| 断点 | 内容网格 900px（三→单列）、520px（4/2 列→单列）；**header 主导航 <1280px 收汉堡**（品牌名 + 5 个中文导航 + 两条 CTA + 主题/语言 toggle 自然宽约 1220px，需 ≥1280 才不换行） |

## 5. 组件语言

- **Header**：sticky + 毛玻璃；右侧 `中/EN` 分段 toggle + 日/夜 toggle + 两条 CTA；header 容器放宽至 1320px；<1280 收汉堡（汉堡面板含导航 + CTA + toggle）。
- **按钮**：`.btn--primary`（实心蓝）、`.btn--ghost`（描边）；高 42px，hover 上浮 1px。
- **Hero**：深底 + 品牌蓝径向 glow + 细网格（radial mask）；右侧 glass 卡承载「定位/行动」。
- **卡片**：白底细描边，hover 上浮 3px + 强描边；序号用渐变蓝小方块或 tabular 数字。
- **深色 CTA band**：`linear-gradient(120deg, hero, #0d3a6e)` + glow，圆角 22px。
- **空态**：虚线描边卡片，居中标题 + 说明（成员、新闻均需提供）。
- **Footer**：深底 hero 色，4 列（品牌/了解联盟/参与/更多）+ 底部版权。

## 6. UX 维度基线（每页必须覆盖）

- **响应式**：≥900 桌面 / <900 移动两套布局最低要求。
- **主题**：light/dark 均需校对对比度 ≥ 4.5:1。
- **状态**：列表型区块提供 filled + empty；表单页需 error/submitting。
- **i18n**：CN/EN 双份文案，英文更长时不破版（测 `Working Groups` 等长词）。
- **a11y**：skip-link、toggle `aria-label`、focus-visible 3px 描边、语义标签。

## 7. 参考来源

- 锚点：`src/app/(frontend)/styles.css`（现有品牌 token）
- 风格参考：Z.ai（智谱，干净现代商务蓝白）、Linear（暗色精密）、Supabase（暗色 shadow-as-border）
- 原型（全站入口）：`docs/design/prototypes/index.html`；共享 token `_design-system.css`、共享壳 `_shell.js`
- 需求规格：`docs/dev/pages-redesign/pages-redesign-requirements.md`
