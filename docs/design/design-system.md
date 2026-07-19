# ZGCLLM 设计系统

本文件描述当前网站已经实现的视觉与交互规范。运行时代码、token、断点和状态以 [`src/app/(frontend)/styles.css`](<../../src/app/(frontend)/styles.css>) 为准；本文件负责解释设计意图和维护约束。

[历史原型](../archive/design/prototypes/) 已归档，只用于追溯设计过程，不是当前组件、文案、主题或路由的权威来源。

## 设计原则

1. 信息层级先于装饰。页面从身份、范围和来源进入，再提供参与路径。
2. 使用商务蓝、低饱和背景、细边框和克制阴影，不以强渐变或动效替代信息结构。
3. light 与 dark 都使用语义 token，正文和交互状态满足可读性要求。
4. 中文和英文共享组件结构，但英文文案允许自然调整长度；没有核验的官方英文专名不自行翻译。
5. 申请、来源和公开状态必须直白。不可用入口显示说明文本，不伪装成可点击按钮。

## 色彩 token

| Token                  | Light     | Dark      | 用途                   |
| ---------------------- | --------- | --------- | ---------------------- |
| `--brand-primary`      | `#1464d2` | `#78a7ff` | 链接、当前态、品牌强调 |
| `--brand-vivid`        | `#2f6bff` | `#8db4ff` | focus 与渐变强调       |
| `--brand-hover`        | `#0f54b5` | `#9cbfff` | hover                  |
| `--accent`             | `#18a7bd` | `#54d8e6` | 辅助强调               |
| `--accent-soft`        | `#8ee5ed` | `#8ee8f1` | 深色区 eyebrow         |
| `--bg-page`            | `#f7f9fc` | `#0a0d12` | 页面背景               |
| `--bg-surface`         | `#ffffff` | `#12161f` | 卡片与浮层             |
| `--bg-subtle`          | `#eef3f9` | `#10141c` | 次级区块               |
| `--bg-hero`            | `#071b37` | `#05070b` | Hero、深色带、footer   |
| `--border`             | `#e2e8f1` | `#303947` | 常规边框               |
| `--border-strong`      | `#8493a8` | `#56647c` | 控件与当前态边框       |
| `--text-title`         | `#0d1f38` | `#f2f5fa` | 标题                   |
| `--text-body`          | `#31445e` | `#c2ccda` | 正文                   |
| `--text-muted`         | `#607086` | `#9aa8bc` | 次要信息               |
| `--text-inverse`       | `#ffffff` | `#f7f9fc` | 深色背景正文           |
| `--text-inverse-muted` | `#b9c8da` | `#b8c3d3` | 深色背景次要信息       |

主要控制 token：

- `--button-primary-bg` / `--button-primary-hover` / `--button-primary-text`
- `--focus-ring`
- `--radius-card: 16px`
- `--radius-ctrl: 10px`
- `--radius-pill: 999px`
- `--control-min-size: 44px`
- `--shadow-card` / `--shadow-pop`
- `--maxw: 1200px`

`--alliance-*` 是旧组件兼容 alias。新代码优先使用无前缀语义 token；不要为新组件扩展第二套颜色系统。

## 主题策略

主题只跟随操作系统：

- head 中的 `ThemeScript` 在首帧读取 `prefers-color-scheme`，设置 `html[data-theme]` 和 `color-scheme`；
- 页面打开期间监听系统偏好变化，并实时更新 light/dark；
- 不显示手动主题 toggle；
- 不读写 localStorage，也不维护用户主题偏好；
- 无 `matchMedia` 时回退到 light；
- 全局 404 使用同一脚本，不复制另一套主题逻辑。

未来若产品决定增加手动或三态主题，必须先更新产品契约、首帧策略、持久化边界、404 和自动测试，不能只添加一个按钮。

## 排版与布局

- 字体栈：`ui-sans-serif, system-ui, -apple-system, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif`。
- 内容容器最大宽度为 1200px；header 容器最大宽度为 1440px。
- 桌面横向 padding 为 24px，520px 及以下为 16px。
- 页面标题和 Hero 标题使用 CSS `clamp()`，不要在组件内写固定字号。
- 正文保持舒展行高和受控行宽，中文、英文长词和链接都不能造成横向页面滚动。

断点：

| 断点       | 行为                                      |
| ---------- | ----------------------------------------- |
| `<1280px`  | header 使用移动菜单；桌面导航和动作隐藏   |
| `>=1280px` | 展示桌面导航、双 CTA 和语言切换           |
| `<=900px`  | 多列内容收为一列或两列                    |
| `<=520px`  | 卡片与统计网格收为单列，容器 padding 缩小 |

发布级响应式检查覆盖 360、390、768、1024、1279、1280 和 1440px，尤其保护 1280px header 边界。

## 组件与状态

### Header

- sticky、半透明背景与细边框；
- 品牌文字链接到当前 locale 首页；
- 桌面展示主导航、工作组参与 CTA、联盟协作 CTA 和同页语言切换；
- 移动菜单支持 Escape、外部点击、焦点离开和路由变化关闭，并将焦点返回 trigger；
- Safari 使用 focus-in 兼容路径保护菜单内焦点；
- 每个页面只有一个有意义的当前导航状态。

### 按钮与链接

- 主操作使用实心按钮，次操作使用描边按钮；
- 所有触控目标最小 44×44px；
- hover 不能成为唯一状态提示；
- focus-visible 使用 3px 可见轮廓和足够 offset；
- 外部链接显示离站语义，并设置 `noopener noreferrer`；
- 申请 target 不可用时渲染静态说明，不保留按钮外观、pointer 或 hover。

### Hero、卡片与深色区

- Hero 使用深色背景、轻量 glow 和网格，右侧内容只承载当前页面的关键范围或行动；
- 卡片使用 surface、细边框、16px 圆角和轻阴影；
- 深色 CTA band 保持高对比正文，不在未验证入口上制造强转化暗示；
- section eyebrow 辅助定位，不能替代清楚的标题。

### 内容状态

列表和动态内容至少考虑：

- 有来源的 filled；
- 没有符合公开条件内容的 empty；
- 申请 URL 缺失、非法、未批准或未配置的 unavailable；
- 未知 slug 和撤回内容的 localized 404；
- 英文较长、中文专名回退和外部来源链接；
- light、dark 与 reduced-motion。

站点没有内部提交表单，不设计虚构的 submitting/success 状态。Feishu 的表单状态属于外部平台，官网只表达离站和当前可用性。

## 双语

- 中文根路径使用 `lang="zh-CN"`，英文 `/en` 使用 `lang="en"`。
- 语言切换保持当前页面和动态 slug，不返回首页兜底。
- 导航、按钮、404、metadata 和可访问名称都需要本地化。
- 英文内容不得增加中文没有的角色、成果、服务承诺或资格规则。
- 没有核验官方英文名的机构保留中文名称，并使用局部语言标记。
- 英文公开面只使用 `ZGCLLM` 或 `the Alliance`，直到权利人确认完整英文名。

## 无障碍与动效

- 每个页面有可见的 skip link，Enter 后焦点进入带 `tabIndex=-1` 的 `main#main-content`。
- 使用 header、nav、main、footer、heading 和列表语义，不以 `div` 模拟控件。
- `aria-current`、`aria-expanded`、外链和不可用状态应可由辅助技术理解。
- 普通文本对比度至少 4.5:1，关键非文本状态至少 3:1。
- `prefers-reduced-motion: reduce` 下取消 smooth scroll、动画和有意义的 transition。
- 200% zoom 时内容可重排，无重叠、裁切和页面横向滚动。

当前自动证据包括 28 次 Axe 扫描，serious/critical 为 0；最近一次完整复跑的桌面 Lighthouse 为 100，移动 Performance 为 99–100，其余类别为 100，长期判定以配置门槛和当次验收报告为准。人工键盘和辅助技术证据模板仍为 `Not run`，自动结果不能替代人工操作和签字。

## 维护检查

修改 token、header、导航、主题、语言或页面布局后运行：

```bash
pnpm typecheck
pnpm lint
pnpm test:coverage
pnpm build
pnpm build:export
pnpm test:e2e
```

视觉改动还要检查 360–1440px、light/dark、reduced-motion、键盘和 200% zoom。人工结果记录在 [`tests/e2e/manual-keyboard-evidence.md`](../../tests/e2e/manual-keyboard-evidence.md)，没有执行记录时保持 `Not run`。
