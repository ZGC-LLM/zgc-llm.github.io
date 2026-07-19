---
feature: repository-wide-release-optimization
type: baseline-after
task: T-012
captured_at: 2026-07-19T22:05:34+08:00
baseline_head: ca0eb8b52914a55509c94cffbc1c3e0617c72b08
audit_snapshot_head: a37e9a388caf52ce0959dfddb440d0c864a7676e
normalized_before_head: ca0eb8b52914a55509c94cffbc1c3e0617c72b08
candidate_runtime_head: e567124de56542d0d501b368dac9c05a81acaf89
branch: feat/repository-wide-release-optimization
result: release-blocked
---

# 治理后基线

本文件记录 T-012 对最终运行时候选
`e567124de56542d0d501b368dac9c05a81acaf89` 的本地可复验证据。仓库内质量门全部通过，
但外部与人工发布门尚未全部满足，因此 `result` 为 `release-blocked`，不能解读为正式发布批准。

## 1. 采集边界与环境

| 项目       | 治理后证据                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| 采集时间   | `2026-07-19T22:05:34+08:00`（Asia/Shanghai）                                                            |
| 分支       | `feat/repository-wide-release-optimization`                                                             |
| 运行时候选 | `e567124de56542d0d501b368dac9c05a81acaf89`                                                              |
| 主干同步   | 候选 `e567124` 含验收时 main `d624120`；固定比较为 29 ahead / 0 behind                                  |
| 工作区     | 运行时源码/配置相对候选无漂移；仅 T-012 证据文档和人工模板处于未提交收尾状态；相对远端特性分支 ahead 28 |
| 操作系统   | macOS 26.2（25C56），arm64                                                                              |
| Node.js    | `v22.23.1`，通过 `fnm exec --using=22.23.1` 固定                                                        |
| pnpm       | `11.2.2`                                                                                                |
| Next.js    | `16.2.6`                                                                                                |
| Playwright | `1.58.2`                                                                                                |
| Docker     | Docker Desktop 4.60.0；Engine 29.2.0，linux/arm64 daemon                                                |
| canonical  | `https://www.zgc-llm.org.cn`                                                                            |
| 命令包装   | 全部 agent shell 命令按仓库规则经 `rtk` 执行；需要原始输出时使用 `rtk proxy`                            |

### 环境可比性说明

[治理前基线](./baseline-before.md)误用了 Node.js `v24.16.0`，而仓库要求 Node.js 22。该原始
记录保留为历史事实，不能改写为同环境通过。为满足 T-012 的可比性要求，本轮另在
`ca0eb8b52914a55509c94cffbc1c3e0617c72b08` 的临时 detached worktree 中，以与治理后完全相同
的 Node.js `22.23.1`、pnpm `11.2.2` 和 macOS/Docker 环境执行 normalized-before replay。

### Normalized-before replay

| 共同命令                             | Node 22 治理前结果                           | Node 22 治理后结果                              |
| ------------------------------------ | -------------------------------------------- | ----------------------------------------------- |
| frozen install                       | PASS，9.3s                                   | PASS，125ms（依赖已存在）                       |
| typecheck / lint                     | PASS / PASS                                  | PASS / PASS                                     |
| coverage                             | 20 files、164 tests；83.36/73.88/85.78/85.24 | 31 files、356 tests；99.57/96.19/99.29/99.77    |
| `pnpm build`                         | PASS，33/33                                  | PASS，31/31                                     |
| `env BUILD_TARGET=export pnpm build` | PASS，33/33                                  | PASS，31/31                                     |
| `pnpm test:e2e`                      | Chromium 37/37，13.4s                        | 8 projects 49/49 × 2，分别 4.1m / 4.0m          |
| npm official production audit        | exit 0，1 moderate vulnerability             | exit 0，`No known vulnerabilities found`        |
| Docker build                         | PASS，3 Dockerfile warnings                  | PASS，0 Dockerfile warning；另完成 runtime 验证 |

replay 未修改基线提交；临时 worktree `/tmp/zgcllm-normalized-before.X1nKv1` 与临时镜像
`zgcllm-site:normalized-before` 在取证后已精确删除。原始 before 文件中的 npmmirror audit 失败
仍保持不变；上表额外使用与治理后相同的 npm 官方 registry，提供可比的漏洞结果。

## 2. 命令与退出码

下列代码、构建、浏览器和最终 Docker 结果均绑定运行时候选 `e567124…`；验收期间未提交的改动
只涉及本文件、发布报告、审计/事实登记、索引/部署说明和人工证据模板，不改变运行时产物。

|   # | 命令或检查                                                                   | Exit | 结果摘要                                                                                          |
| --: | ---------------------------------------------------------------------------- | ---: | ------------------------------------------------------------------------------------------------- |
|   1 | `pnpm install --frozen-lockfile`                                             |    0 | lockfile 无变更，125ms                                                                            |
|   2 | `pnpm typecheck`                                                             |    0 | TypeScript strict 检查通过                                                                        |
|   3 | `pnpm lint`                                                                  |    0 | ESLint 无错误                                                                                     |
|   4 | `pnpm format:check` + T-012 证据显式检查                                     |    0 | CI 维护范围与 report/baseline/audit/facts 符合 Prettier                                           |
|   5 | `pnpm test:coverage`                                                         |    0 | 31 files、356 tests 全部通过，四项硬阈值通过                                                      |
|   6 | `pnpm build`                                                                 |    0 | standalone 编译成功，静态页生成 31/31                                                             |
|   7 | `pnpm build:export`                                                          |    0 | export 编译成功，静态页生成 31/31                                                                 |
|   8 | `test "$(cat out/CNAME)" = 'www.zgc-llm.org.cn'`                             |    0 | Pages artifact 域名精确一致                                                                       |
|   9 | `pnpm test:e2e --list`                                                       |    0 | 6 spec files、8 projects、49 expanded tests；retries 0、workers 1                                 |
|  10 | `pnpm test:e2e`（第 1 次）                                                   |    0 | 49/49，通过，4.1 分钟                                                                             |
|  11 | `pnpm test:e2e`（第 2 次）                                                   |    0 | 49/49，通过，4.0 分钟；无重试掩盖                                                                 |
|  12 | `pnpm audit --prod --audit-level high --registry https://registry.npmjs.org` |    0 | `No known vulnerabilities found`                                                                  |
|  13 | `docker build --progress=plain -t zgcllm-site:t012-e567124 .`                |    0 | 最终 SHA 镜像构建成功，无 Dockerfile warning                                                      |
|  14 | Docker inspect、health 与 HTTP/SEO 端点复验                                  |    0 | 非 root、healthy、loopback 绑定、代表端点 200、正式域正确                                         |
|  15 | Docker stop、inspect、精确清理                                               |    0 | SIGTERM 停止在超时内完成，exit 143、OOM=false；临时容器和标签已删除                               |
|  16 | 跟踪源码债务模式扫描                                                         |    0 | 无 TODO/FIXME/HACK、ts-ignore/eslint-disable 债务指令或 explicit TypeScript `any` 逃逸            |
|  17 | 敏感文件名扫描                                                               |    0 | 未跟踪生产 env、私钥或证书文件                                                                    |
|  18 | `git diff --check` 与 status                                                 |    0 | 无 whitespace error；合并提交后、恢复 T-012 证据改动前 clean；最终仅有列明的文档/人工模板收尾改动 |
|  19 | Node 22 normalized-before replay                                             |    0 | 同一 OS/Node/pnpm 下复跑共同门；临时 worktree/镜像已清理                                          |
|  20 | `git rev-list --left-right --count e567124...d624120`                        |    0 | `29 0`；候选已包含验收时当前 main                                                                 |
|  21 | GitHub Actions / Pages / live endpoint 只读核验                              |    0 | 候选 Actions count=0；Pages built、`cname:null`，仍服务旧 `d624120…`                              |

`NO_COLOR` 与 Playwright TTY 的提示来自测试运行器同时设置颜色变量，不影响构建、页面或测试结果。

`.prettierignore` 按仓库政策排除 `docs/dev/*` 历史 feature specs；本轮对 report、baseline、audit 和
facts 使用 `--ignore-path /dev/null` 额外检查。requirements 只回填 26 个有证据的 checkbox，tasks
只更新 T-012 状态；两者通过 diff、链接和状态一致性复核，不声称属于 Prettier PASS 范围。

## 3. 测试与覆盖率

### 3.1 Vitest

| 指标       |            治理前 |            治理后 |   硬阈值 | 结果    |
| ---------- | ----------------: | ----------------: | -------: | ------- |
| Test files |                20 |                31 | 全部通过 | 31/31   |
| Tests      |               164 |               356 | 全部通过 | 356/356 |
| Statements | 83.36%（486/583） | 99.57%（935/939） |     ≥90% | 通过    |
| Branches   | 73.88%（232/314） | 96.19%（632/657） |     ≥85% | 通过    |
| Functions  | 85.78%（175/204） | 99.29%（283/285） |     ≥90% | 通过    |
| Lines      | 85.24%（445/522） | 99.77%（877/879） |     ≥90% | 通过    |

测试已按 `tests/unit/`、`tests/integration/`、`tests/e2e/` 与 `tests/helpers/` 分责；内容校验、
域名、i18n 路由、SEO、JSON-LD、申请 target、页面呈现和交互状态均有正反例。

### 3.2 Playwright 发布矩阵

完整矩阵在同一实现 SHA 连续运行两次，均为 49/49：

- 桌面：Chromium、Firefox、WebKit；
- 移动：Pixel 5 Chromium、iPhone 13 WebKit；
- 质量：键盘自动化、24 个可索引 HTML、26 个 HTML/SEO endpoint、内部链接、外链硬化、
  404/noindex、浏览器 console/page/request error、静态服务 traversal/compression/406；
- 可访问性：每轮对 24 个公开页面加 4 个代表性交互/主题/错误状态执行 28 次 Axe 扫描，
  两轮共 56 次执行，均无 serious/critical violation；
- 响应式：关键页面、1024/1279/1280/1440px 桌面边界和两个移动设备项目均有可复现的
  bbox、横向溢出、遮挡与 44px 触控目标断言；
- 稳定性：`retries=0`、`workers=1`，两轮均无需重试。

自动键盘测试 5/5 通过，但真人纯键盘、200% zoom 与屏幕阅读器签字仍为 `Not run`；自动化结果
不能替代 F-007/F-008 的人工部分。F-009 也只具备 system-only 首帧/OS live change 的 unit 与
代表性主题状态 E2E；没有可提交、可复现的“所有页面 × light/dark × 全部有意义交互状态”矩阵，
也没有首帧、禁用 JavaScript 和系统主题切换的人工记录，因此严格判为 `PARTIAL`。

### 3.3 Lighthouse

每个页面/模式连续采样 3 次；两轮完整 E2E 的范围一致。

| 模式    | 页面                                           |          Performance | Accessibility | Best Practices | SEO |
| ------- | ---------------------------------------------- | -------------------: | ------------: | -------------: | --: |
| Desktop | `/`、`/en`、`/en/working-groups/cybersecurity` |    100（18/18 采样） |           100 |            100 | 100 |
| Mobile  | `/`、`/en`、`/join`                            | 98–100（18/18 采样） |           100 |            100 | 100 |

所有结果超过 requirements 的 Performance ≥90、其余类别 ≥95；没有阈值例外。

## 4. 构建、路由与容器

### 4.1 双构建与静态产物

standalone 与 export 均生成 31/31。`out/` 有 27 个物理 HTML 文件，其中 24 个为可索引
中英文页面；其余为 global/local 404 产物。另有 `robots.txt` 与 `sitemap.xml` 两个 SEO endpoint。
上线稿撤回及未发布内容不再生成公开索引路由，因此治理前 33/33 降为 31/31 是事实治理结果，
不是静态导出缺失。

全量浏览器检查确认：

- 24 页的 title、description、canonical、hreflang（含 x-default）、OG 与唯一主标题完整；
- robots、sitemap 只列出正式 canonical 下的公开页面；
- 全部渲染内部链接可解析，外部链接均使用 HTTPS 并具备安全关系属性；
- 未知或撤回路由返回 404、noindex 且无 canonical；
- 三个申请 target 在未完成外部核验时均 fail closed。

### 4.2 最终 SHA Docker

| 项目        | 结果                                                                       |
| ----------- | -------------------------------------------------------------------------- |
| Image       | `sha256:2d58fe93049aa2ff8fcf8dba5a97a9e89faa4e2ca3599bae792b12c85bd6c343`  |
| Size        | 208,717,840 bytes                                                          |
| Build       | 约 10 秒（使用已存在的安全缓存）；Node 22.23.1 / pnpm 11.2.2；31/31        |
| User        | `nextjs`；运行进程 UID 1001                                                |
| Healthcheck | 连续 3 次 `healthy`，`wget --spider http://127.0.0.1:3000/`                |
| Publish     | `127.0.0.1:3300:3000`，未暴露到所有主机接口                                |
| HTTP        | `/` 200；robots、sitemap、`/join` 与 `/en/join` 内容/正式域校验通过        |
| Stop        | `docker stop --timeout 10` 约 0.1 秒完成；exit 143（SIGTERM），OOM=false   |
| Cleanup     | 精确删除 `zgcllm-t012-e567124` 容器与 `zgcllm-site:t012-e567124` 标签/镜像 |

### 4.3 当前公开部署边界

2026-07-19 只读复验显示 GitHub Pages API 为 `status=built`、`build_type=workflow`、
`html_url=https://zgc-llm.github.io/`、`cname:null`。当前 Pages deployment 对应旧提交
`d624120dcf25e90d86970006a28d3d70f9fe364f`（Deploy run `29671570130`），不是本候选；
`e567124…` 的 Actions run count 为 0。

旧公开端点仍出现候选已删除或关闭的占位 ICP、未核邮箱、legacy Logo、上线稿、五个具名工作组
主体和三个 Feishu CTA。正式域仍无可用 DNS/HTTPS。因此本节的候选构建/Docker PASS 不能外推为
“现网已经修复”。部署/SHA 不一致纳入门 2/4；旧内容分别触发备案、表单/资格和联系门
1/3/6，合计影响门 1/2/3/4/6，并须进入正式 endpoint 负向 smoke。

## 5. Before / after 摘要

| 维度           | 治理前                                                  | 治理后                                              |
| -------------- | ------------------------------------------------------- | --------------------------------------------------- |
| Node 验收      | v24.16.0，偏离政策                                      | v22.23.1，精确固定                                  |
| 格式治理       | 无全仓维护范围门                                        | `format:check` 本地与 CI 强制                       |
| Vitest         | 20 files / 164 tests，无目标硬门                        | 31 files / 356 tests，90/85/90/90 硬门              |
| 覆盖率         | 83.36 / 73.88 / 85.78 / 85.24                           | 99.57 / 96.19 / 99.29 / 99.77                       |
| E2E            | Chromium 37/37，仅单项目                                | 8 projects / 49 tests，连续两轮 49/49               |
| 浏览器/移动    | 未覆盖 Firefox、WebKit                                  | 三桌面引擎 + 两移动设备                             |
| Axe/Lighthouse | 未运行                                                  | 每轮 28 次 Axe；桌面全 100，移动 98–100/100/100/100 |
| 链接/SEO       | 未测定                                                  | 24 HTML + 2 SEO endpoint 全量自动契约               |
| Docker         | 构建成功，3 warnings，未运行                            | 最终 SHA 构建/非 root/health/HTTP/signal 全通过     |
| 生产依赖审计   | 原记录被 registry 阻断；normalized replay 为 1 moderate | npm 官方 registry，无已知漏洞                       |
| 文档/历史规格  | 入口与状态冲突                                          | 统一索引、部署/内容/设计/历史生命周期均治理         |

从治理前锚点到运行时候选共有 29 个提交；raw `git diff --shortstat` 为 170 files changed，
raw `git diff --name-only` 同样枚举 170 个路径。该统计包含历史规格治理、测试重组和格式化，
不应简单解释为新增产品代码规模。

## 6. 治理后结论

仓库侧 hard gates、性能、自动无障碍、浏览器、静态导出、Docker、安全和文档一致性均形成可重复
证据；本地运行时候选质量达到合并候选标准。但是正式域名、三个 Feishu 流程、适用备案判断、
公开联系替代、当前候选远端 CI/部署、真人无障碍签字和第二 reviewer 尚未完成。
当前 github.io 还在服务旧 SHA 的不安全公开内容，仓库候选的安全处理尚未到达现网。

最终裁决、七类恢复任务与 F-001..F-033 映射见
[发布就绪报告](./release-readiness-report.md)。当前结论：**不可正式发布**。
