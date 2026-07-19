---
feature: repository-wide-release-optimization
type: baseline-before
task: T-000
captured_at: 2026-07-19T10:13:17+08:00
baseline_head: ca0eb8b52914a55509c94cffbc1c3e0617c72b08
branch: feat/repository-wide-release-optimization
---

# 治理前基线

本文件冻结全仓发布级治理开始前的可复现状态。它只记录结果，不修复失败，也不把“未执行 / 被环境阻断”写成通过。最终验收必须在相同口径下生成 `baseline-after.md` 并逐项比较。

## 1. 采集边界与环境

| 项目 | 治理前证据 |
| --- | --- |
| 采集时间 | `2026-07-19T10:13:17+08:00`（Asia/Shanghai） |
| 分支 | `feat/repository-wide-release-optimization` |
| HEAD | `ca0eb8b52914a55509c94cffbc1c3e0617c72b08` |
| 工作区 | `rtk git status --short` exit `0`，rtk 压缩输出为 `ok`；补充的原始 `git status --short` 输出为空，表示采集前无已跟踪或未跟踪变更 |
| Node.js | `v24.16.0`；仓库协作说明要求 Node.js 22，因此本机版本存在可复现环境偏差，不能用本次结果代替 Node 22 CI 证据 |
| pnpm | `11.2.2`，符合仓库要求的 pnpm 11 |
| Next.js | 构建输出为 `16.2.6` |
| 命令包装 | 全部 shell 命令按仓库规则经 `rtk` 执行；e2e 与 export build 使用 `rtk proxy` 保留原始摘要 |

## 2. 命令与退出码总表

| # | 命令 | Exit | 结果摘要 |
| ---: | --- | ---: | --- |
| 1 | `rtk git rev-parse HEAD` | 0 | `ca0eb8b52914a55509c94cffbc1c3e0617c72b08` |
| 2 | `rtk git status --short` | 0 | 工作区干净；rtk 压缩输出 `ok` |
| 3 | `rtk node --version` | 0 | `v24.16.0`；与项目固定 Node 22 的要求不一致 |
| 4 | `rtk pnpm --version` | 0 | `11.2.2` |
| 5 | `rtk pnpm typecheck` | 0 | `TypeScript: No errors found` |
| 6 | `rtk pnpm lint` | 0 | ESLint 完成，无错误输出 |
| 7 | `rtk pnpm test:coverage` | 0 | 20 个测试文件、164 个测试全部通过；覆盖率低于目标，详见下文 |
| 8 | `rtk proxy pnpm test:e2e` | 0 | Chromium 37/37 通过，用时 14.2 秒 |
| 9 | `rtk pnpm build` | 0 | standalone 默认目标编译成功，静态页生成 33/33 |
| 10 | `rtk proxy env BUILD_TARGET=export pnpm build` | 0 | Pages export 目标编译成功，静态页生成 33/33 |
| 11 | `rtk docker version` | 0 | Docker Desktop 4.60.0，Engine 29.2.0，linux/arm64 daemon 可用 |
| 12 | `rtk docker build -t zgcllm-site:governance-baseline .` | 0 | 镜像成功生成；image SHA 起始为 `sha256:0ea3989348ec`；有 3 条 Dockerfile 警告 |
| 13 | `rtk pnpm audit --prod --audit-level high` | 1 | `registry.npmmirror.com` 的 audit endpoint 不存在；安全审计被 registry 能力阻断 |
| 14 | 跟踪文件债务模式扫描（完整命令见 §5.4） | 0 | 2 个跟踪文件匹配，均为文档中的历史说明 / 本基线命令文本，未命中跟踪源码 |
| 15 | 跟踪文件域名扫描（完整命令见 §5.4） | 0 | 66 行匹配；既包含正式域名，也包含有意记录的防御性域名，不能直接等同为问题数 |
| 16 | 工作流 / 公开变量扫描（完整命令见 §5.4） | 0 | 45 行匹配；覆盖 workflow、Dockerfile、compose 与 `.env.example` |

> `git grep` 的 exit `0` 表示发现匹配，不表示对应内容已通过治理。扫描范围是 Git 跟踪文件；构建产物和依赖目录不在该口径中。

## 3. 质量与测试基线

### 3.1 类型与 lint

- TypeScript：exit `0`，无类型错误。
- ESLint：exit `0`，无 lint 错误。
- 扫描未发现跟踪源码中的 `TODO`、`FIXME`、`HACK`、`@ts-ignore`、`eslint-disable` 或 `any` 命中；2 个原始匹配均位于 Markdown 文档，不能据此断言不存在其他形式的代码债务。

### 3.2 单元测试与覆盖率

`rtk pnpm test:coverage` 的原始摘要：

| 指标 | 结果 | 本轮发布目标 | 初始差距 |
| --- | ---: | ---: | ---: |
| Test files | 20 passed / 20 | 全部通过 | 0 失败 |
| Tests | 164 passed / 164 | 全部通过 | 0 失败 |
| Statements | 83.36%（486/583） | ≥ 90% | -6.64 个百分点 |
| Branches | 73.88%（232/314） | ≥ 85% | -11.12 个百分点 |
| Functions | 85.78%（175/204） | ≥ 90% | -4.22 个百分点 |
| Lines | 85.24%（445/522） | ≥ 90% | -4.76 个百分点 |

命令虽然 exit `0`，但四项覆盖率均未达到本轮 requirements 目标，说明当前 Vitest 配置尚未以目标阈值阻断。较明显的薄弱区域包括英文路由壳、全局 not-found、新闻动态路由、导航分支和内容校验分支；具体优先级由 T-001 审计、T-009 测试治理裁决。

### 3.3 端到端测试

- 项目：仅 `chromium`。
- 结果：37 passed / 37，0 failed，exit `0`，14.2 秒。
- 已覆盖的现有断言包括中英文页面、响应式导航、主要参与路径、新闻 / 工作组动态 slug 与 404。
- 本基线未运行 Firefox、WebKit、Lighthouse 或独立无障碍扫描，因此不能据 Chromium 全绿声称浏览器兼容、WCAG 或性能目标已达成。

### 3.4 合并测试计数

本次两条自动测试命令合计执行 **201 个测试，201 通过，0 失败**（Vitest 164 + Playwright Chromium 37）。该合计只描述实际执行的测试，不包含尚未建立 / 尚未运行的多浏览器、链接、性能与视觉检查。

## 4. 构建、路由与容器基线

### 4.1 Next.js 双构建

默认 build 与 `BUILD_TARGET=export` 均：

- Next.js 16.2.6 / Turbopack 编译成功；
- TypeScript 构建阶段成功；
- 报告 `Generating static pages ... (33/33)`；
- 路由表包含中文根路径和 `/en/*`、2 个中英文新闻 slug、网络安全工作组详情 / 加入 / 成员、`robots.txt`、`sitemap.xml` 与 not-found 产物。

构建成功证明当前已声明路由可以产出，不等同于全部内部链接、canonical、hreflang、Open Graph 或 JSON-LD 已逐页正确。

### 4.2 Docker

- Client / Server 均为 29.2.0，daemon 可用；基础镜像为 Node `22.17.0-alpine`。
- 镜像 `zgcllm-site:governance-baseline` 构建成功，exit `0`。
- BuildKit 报告 3 条非阻断警告：Dockerfile 第 54、77 行使用 legacy `ENV key value`；第 81 行的 `CMD` 建议使用 JSON form 以改善 OS signal 行为。
- 容器仅完成镜像构建，未在本任务启动容器做 HTTP / healthcheck 复验。

## 5. 依赖、安全、域名与公开配置

### 5.1 生产依赖审计

`rtk pnpm audit --prod --audit-level high` exit `1`：

```text
[ERR_PNPM_AUDIT_ENDPOINT_NOT_EXISTS]
https://registry.npmmirror.com/-/npm/v1/security/advisories/bulk 不存在
```

因此治理前基线的高危 / 严重生产依赖漏洞数量是 **未知**，不是 0。不得在未切换到支持审计的可信 registry 并复验前声称 F-020 通过；本任务未修改 registry 或认证配置。

### 5.2 域名扫描

- 66 行跟踪文件匹配正式或防御性域名。
- 已观察到主要运行时位置使用 `https://www.zgc-llm.org.cn`，包括 CI、Pages、Dockerfile、`public/CNAME` 与 `src/config/site.ts`。
- 扫描同时有意命中 README / docs 中的裸域、品牌保护域名及历史错误说明；这些必须由 T-001/T-003/T-007/T-011 按“正式服务 / 防御性跳转 / 历史追溯”语义复核，不能仅按文本匹配删除。

### 5.3 公开变量与流水线扫描

- 45 行匹配覆盖 `.env.example`、两个 GitHub Actions workflow、Dockerfile 与 `docker-compose.prod.yml`。
- 初始证据显示 `.env.example` / workflow / Dockerfile 使用 `NEXT_PUBLIC_APPLICATION_URL` 与 `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`，而 `docker-compose.prod.yml` 仍出现 `NEXT_PUBLIC_INSTITUTION_APPLICATION_URL` 与 `NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL`；这是待审计的配置漂移证据。
- 扫描只证明配置出现位置已纳入基线，不证明 Actions 权限、版本固定、缓存、失败传播或所有公开变量已正确对齐。

### 5.4 三条跟踪文件扫描命令

以下为实际执行的完整命令；使用代码块是为了避免正则中的 `|` 被 Markdown 表格解析为列分隔符：

```text
rtk git grep -n -E 'TODO|FIXME|HACK|@ts-ignore|eslint-disable|\bany\b'
rtk git grep -n -E 'zgcllm\.(org\.cn|cn|net)|zgc-llm\.(org\.cn|cn|net)'
rtk git grep -n -E 'NEXT_PUBLIC_|permissions:|uses:' -- '*.yml' '*.yaml' '*.toml' 'Dockerfile' '.env.example'
```

## 6. 链接、SEO 与问题分级口径

| 基线计数 | 治理前值 | 说明 |
| --- | --- | --- |
| 专用内部链接问题数 | 未测定（不得解释为 0） | G0 命令集中没有现成链接爬虫；export 成功和现有 e2e 通过不能替代全站链接扫描 |
| 专用 SEO 问题数 | 未测定（不得解释为 0） | 现有 `tests/unit/seo.test.ts` 的 4 个测试随 coverage 通过，但尚未逐页扫描导出 HTML 的 title / description / canonical / hreflang / OG / JSON-LD |
| P0 | 未分类（不得解释为 0） | T-001 尚未建立审计 register |
| P1 | 未分类（不得解释为 0） | T-001 尚未建立审计 register |
| P2 | 未分类（不得解释为 0） | T-001 尚未建立审计 register |

为避免编造严重度，本文件不把命令失败或警告擅自映射为 P0/P1/P2。可直接移交 T-001 的**预审观察项至少 6 组**：覆盖率低于目标、本机 Node 版本偏差、依赖审计 registry 阻断、Dockerfile 3 条警告、公开环境变量命名漂移、链接 / SEO 缺少完整扫描。T-001 必须扩大到全路由 / 全内容 / 全交互审计后再给出可发布问题总数和严重度；这些初始值不能回填为 0。

## 7. 外部检查与环境依赖

| 检查 | 状态 | 治理前说明 |
| --- | --- | --- |
| npm production advisory | 阻断 | 当前 npmmirror registry 不提供 audit endpoint |
| Docker registry / Corepack 下载 | 可达 | Docker build 成功拉取 / 解析 Node 基础镜像并获取 pnpm 11.2.2 |
| GitHub 远端 | 待提交后验证 | 本文件提交后按 G0 要求 push feature branch，并单独记录 push 结果 |
| GitHub Actions / Pages / branch protection | 未检查 | 本地命令不能证明远端必需检查与部署闸门状态 |
| 正式域名 DNS / TLS / 301 | 未检查 | 未对生产网络端点执行探测 |
| 飞书公开问卷匿名可用性 | 未检查 | 未向外部表单提交数据，也未验证匿名访问权限 |
| Firefox / WebKit / 移动设备矩阵 | 未检查 | 当前 Playwright 基线只运行 Chromium |
| Lighthouse / WCAG 自动扫描 / 人工键盘走查 | 未检查 | 留待审计与 T-010 建立可重复证据 |
| 全站视觉与双语文案人工走查 | 未检查 | 留待 T-001 形成 P0/P1/P2 register |

## 8. 治理前结论

当前仓库的类型检查、lint、201 个已执行测试、普通构建、静态导出与 Docker 镜像构建均成功；但**尚未达到可发布证明**。已知证据缺口包括覆盖率未达目标且未硬门、生产依赖审计被 registry 阻断、多浏览器 / 链接 / SEO / 性能 / 无障碍 / 外部入口尚无完整证据，以及公开变量与 Dockerfile 的待治理观察项。后续任务必须保留本文件，并在 `baseline-after.md` 使用相同命令和计数口径复验。
