---
feature: repository-wide-release-optimization
type: release-readiness-report
task: T-012
assessed_at: 2026-07-19T22:05:34+08:00
candidate_runtime_head: e567124de56542d0d501b368dac9c05a81acaf89
branch: feat/repository-wide-release-optimization
decision: no-go
approved_exceptions: 1
---

# 发布就绪验收报告

## 1. 最终裁决

> **NO-GO / 不可正式发布**

运行时候选 `e567124de56542d0d501b368dac9c05a81acaf89` 已通过本地代码、测试、双构建、
静态导出、浏览器、性能、自动无障碍、安全、Docker 与文档质量门，可以作为进入受保护 PR
流程的**仓库内候选**，且已安全合入验收时的 `origin/main`，相对 `origin/main` 为 29 ahead / 0
behind。原七类外部或人工发布门中，独立 reviewer 门已按 owner 明确决策接受；其余六类仍未通过，当前 `https://zgc-llm.github.io/` 还在服务旧提交
`d624120…` 的不安全公开内容。因此不能合并“仓库候选质量”与“正式对外发布批准”两个结论，
也不能声称已达到正式上线状态。

本轮有一项经用户明确批准的治理例外：短期没有第二名 reviewer 时，main 的强制批准数设为 0；
PR、三个 strict checks、对话解决和管理员保护继续强制生效。该例外不接受任何代码质量、外部事实、
人工验收或其他发布阻塞项。

## 2. 验收范围与主要整改

本轮从治理前锚点 `ca0eb8b5…` 开始，审计并整改了 24 个可索引中英文页面、动态路由、404、
robots/sitemap、全站 chrome、主题、响应式、交互、文案、内容事实、申请分流、SEO、构建、
CI/CD、Docker、依赖、测试目录和项目文档。

关键结果：

- 重构首页、联盟、参与、工作组、网络安全、成员、新闻、隐私和错误页的信息层级与双语文案；
- `/join` 明确区分联盟、专业用户计划、机构生态共建和工作组四类路径；未经核验入口保持
  fail closed；
- 移除占位 ICP、未授权 Logo、错误上线稿、冲突英文全称、未核验具名关系、资质/背书、
  绝对承诺与无效联系动作；
- 统一正式 canonical、i18n 路由、metadata、hreflang、JSON-LD、robots、sitemap 与 404；
- 加固导航焦点、移动菜单、skip link、44px 触控目标、reduced motion 与 system-only theme；
- 固定 Node/pnpm/Actions，收敛权限、缓存、并发取消、失败传播、Pages 同 SHA 部署与 Docker；
- 将测试重组为 unit/integration/e2e/helpers，建立覆盖率硬门、三桌面引擎、两移动设备、Axe、
  Lighthouse、链接、SEO 和静态服务器契约；
- 建立 README/docs 单一入口、历史规格生命周期、内容维护与双部署运行手册，并把格式检查纳入 CI。
- 在 `e567124` 同步当前 `main`：拒绝恢复缺乏独立授权证据的五个具名工作组主体；把上游工作组
  CTA 意图保留在现有参与卡和页底入口，并补充语义化 integration/E2E 断言，避免重复 Hero 导航。

完整数值和命令见 [治理后基线](./baseline-after.md)，逐问题状态见
[审计登记 T-012 附录](./audit-register.md)。

## 3. 质量门结果

| 质量门                         | 结果    | 证据摘要                                                             |
| ------------------------------ | ------- | -------------------------------------------------------------------- |
| 安装与工具链                   | PASS    | Node 22.23.1、pnpm 11.2.2、frozen lockfile                           |
| 同环境治理前/后复跑            | PASS    | baseline `ca0eb8b5…` 与候选均以 Node 22.23.1/pnpm 11.2.2 复跑共同门  |
| TypeScript / ESLint / Prettier | PASS    | 代码与 CI 维护范围 exit 0；4 份 T-012 证据另做显式格式检查           |
| Unit / integration             | PASS    | 31 files、356/356                                                    |
| Coverage                       | PASS    | statements 99.57%、branches 96.19%、functions 99.29%、lines 99.77%   |
| Standalone / export            | PASS    | 两目标均 31/31；CNAME 精确匹配                                       |
| 完整 E2E 稳定性                | PASS    | 8 projects、49/49 × 2；retries 0、workers 1                          |
| 浏览器与移动                   | PASS    | Chromium、Firefox、WebKit、Pixel 5、iPhone 13                        |
| 链接 / SEO / 404 / 静态服务    | PASS    | 24 HTML + 2 SEO endpoint；链接、metadata、编码 traversal、压缩与 406 |
| 自动可访问性                   | PASS    | 自动键盘 5/5；每轮 28 次 Axe，两轮均无 serious/critical violation    |
| Lighthouse                     | PASS    | 桌面全 100；移动 Performance 98–100，其余全 100                      |
| 生产依赖与敏感信息             | PASS    | npm 官方 registry 无已知生产漏洞；高置信扫描无泄漏                   |
| Docker                         | PASS    | 最终 SHA 镜像、非 root、healthy、loopback、HTTP/SEO、SIGTERM 均验证  |
| 真人键盘 / zoom / 屏幕阅读器   | NOT RUN | 模板仍为 `Not run`，自动化不能代签                                   |
| 全页面/状态双主题人工验收      | NOT RUN | 当前仅有代表性自动状态；首帧、禁 JS、系统切换与人工视觉未签字        |
| 当前公开部署一致性             | FAIL    | Pages 为 built，但 `cname:null`；github.io 仍部署旧 `d624120…`       |
| 最终 SHA 远端 CI / 部署        | NOT RUN | GitHub Actions 对 `e567124…` 的 run count 为 0                       |

## 4. 审计闭环状态

初始审计保留 47 个问题：P0 10、P1 25、P2 12。T-012 使用“仓库整改”和“外部/人工门”
两个独立维度，不通过删除历史行降低计数。

| 级别 | Repo closed | Repo partial | Repo open | 正式发布门主承接 ID |
| ---- | ----------: | -----------: | --------: | ------------------: |
| P0   |          10 |            0 |         0 |             9 个 ID |
| P1   |          24 |            1 |         0 |             2 个 ID |
| P2   |          10 |            2 |         0 |         0 个阻断 ID |
| 合计 |          44 |            3 |         0 | 11 个 ID / 6 类开放门 |

主承接 ID 用于避免同一发布门内重复计数；例如 P1-001～007 的人工视觉/辅助技术依赖归入
P0-010，P2-004 的联系恢复依赖归入 P1-008。各行原始状态仍完整保留在审计登记中。

仓库残余债务为：P1-008 缺已核验且可执行的联系替代；P2-002 保留两套按钮 class 兼容别名；
P2-006 保留较大的全局 CSS 与 transitional token 层。后两项是明确登记的非阻断维护债务，
前一项使 F-002/F-014 不能通过，且未经用户例外批准。

## 5. F-001..F-033 严格验收

只有 `PASS` 会在 requirements 中从 `☐` 改为 `✅`。统计：**26 PASS、3 PARTIAL、3 NOT RUN、
1 FAIL**。

| ID    | 状态    | 核心证据或未通过原因                                                             |
| ----- | ------- | -------------------------------------------------------------------------------- |
| F-001 | PASS    | 24 个 HTML、2 个 SEO endpoint、动态模板、404、三外部 target 已进入矩阵           |
| F-002 | FAIL    | 仓库仍有 P1-008 partial，且 P0 外部/人工门未获例外，不满足“无未接受 P0/P1”       |
| F-003 | PASS    | 中英文首页首屏身份、价值、主次 CTA 与移动布局通过内容和 E2E 验收                 |
| F-004 | PASS    | tokens、chrome、Hero、卡片、按钮、状态和详情页已统一并跨页复验                   |
| F-005 | PASS    | 主导航、页尾和交叉链接可到达介绍、工作组、成员、新闻和参与入口                   |
| F-006 | PASS    | 关键桌面边界与两移动设备项目均有可复现的溢出、遮挡、bbox 和触控目标断言          |
| F-007 | NOT RUN | 自动键盘 5/5；真人纯键盘与 200% zoom 未签字                                      |
| F-008 | NOT RUN | Axe/Lighthouse 通过；人工地标、标题、对比度与读屏未签字                          |
| F-009 | PARTIAL | system-only 首帧/OS live change 与代表状态有自动保护；全页面/交互双主题未验      |
| F-010 | PASS    | 中文逐页升级，删除空泛、夸大、冲突或不可执行表达                                 |
| F-011 | PASS    | 中英文结构、事实、CTA 与专名策略等价；不新增中文没有的承诺                       |
| F-012 | PARTIAL | 候选事实已来源化/中性化且校验通过；旧公开部署仍暴露未核事实和资产                |
| F-013 | PASS    | 四类参与路径在 `/join` 双语明确区分并互相引导                                    |
| F-014 | PARTIAL | 离站、隐私、异常 URL 与 fail-closed 通过；三表及已核验联系 fallback 阻塞         |
| F-015 | PASS    | 全部渲染内部链接、locale/slug、动态 404 与既有公开 URL 契约通过                  |
| F-016 | PASS    | title、description、canonical、hreflang、robots、sitemap、OG、JSON-LD 全量通过   |
| F-017 | PASS    | 代码、工作流、容器与当前维护文档统一带连字符主域；CHANGELOG 漂移已修复           |
| F-018 | PASS    | 两轮 Lighthouse 均超过约定预算，无例外                                           |
| F-019 | PASS    | 三桌面引擎及两移动设备的关键路径通过                                             |
| F-020 | PASS    | 无已知生产漏洞、密钥或个人信息泄漏；公开表单配置符合静态站边界                   |
| F-021 | PASS    | 重复、死代码、inline style、类型逃逸、依赖和客户端边界已审计；残余 P2 有恢复任务 |
| F-022 | PASS    | 事实内容在 `src/content/`、站点配置在 `src/config/site.ts`，route/view 职责清晰  |
| F-023 | NOT RUN | workflow 静态设计通过，但最终候选没有远端同 SHA CI 与失败传播实跑证据            |
| F-024 | PASS    | standalone、export、Pages 与 Docker 的职责、输入和 artifact 边界明确并本地复验   |
| F-025 | PASS    | 最小权限、固定 Action SHA、环境、并发和无隐式放行通过；批准数 0 为已记录例外    |
| F-026 | PASS    | unit/integration/e2e/helpers 的位置、命名、配置与文档一致                        |
| F-027 | PASS    | 四项覆盖率硬阈值与高风险逻辑分支均通过                                           |
| F-028 | PASS    | 导航、菜单、主题、语言、CTA、异常态、动态详情、404、SEO 已覆盖                   |
| F-029 | PASS    | 零重试完整矩阵连续两次 49/49，无可复现 flaky                                     |
| F-030 | PASS    | README 与 docs 索引可达开发、内容、测试、设计、部署、域名和发布流程              |
| F-031 | PASS    | 12 个 feature 目录的 active/completed/partial/superseded/trace 状态已裁决        |
| F-032 | PASS    | 本地 type/lint/format/coverage/e2e/standalone/export/Docker 全部通过             |
| F-033 | PASS    | 本报告包含范围、结果、性能/无障碍、例外、剩余风险和恢复任务，且如实 NO-GO        |

F-025 的 `PASS` 评价该条文字要求中的 workflow/环境配置；组织尚不具备独立审批人，但 owner 已
明确接受门 7 的短期例外。该决定不允许绕过 PR、required checks、对话解决或管理员保护。

### 5.1 R-001..R-011 总需求状态

F 项通过数不等于总需求完成。以下按每条 R 的全部验收语句和外部/人工证据严格归并；`PARTIAL`
表示仓库内主要整改已完成但仍缺规定证据，`NOT MET` 表示仍有明确发布阻塞。

| 需求  | 状态    | 判定依据                                                                   |
| ----- | ------- | -------------------------------------------------------------------------- |
| R-001 | NOT MET | F-002 FAIL；P1-008 与外部 P0/P1 门未获用户逐项接受                         |
| R-002 | PARTIAL | 信息架构与组件统一通过；F-009 的全页面/全交互双主题验收未完成              |
| R-003 | NOT MET | F-007/F-008 NOT RUN、F-009 PARTIAL；真人 AT、200% zoom、首帧和禁 JS 未签字 |
| R-004 | NOT MET | 候选内容通过；旧公开部署仍暴露占位/未授权事实、资产、稿件与 CTA            |
| R-005 | PARTIAL | 四路径与 fail-closed 已实现；F-014 的三表和可执行联系替代仍阻塞            |
| R-006 | PASS    | SEO、链接、双构建、跨浏览器、Lighthouse、安全与依赖门通过                  |
| R-007 | PASS    | 代码/依赖审计、严格类型、职责分层和残余 P2 恢复任务均有记录                |
| R-008 | NOT MET | workflow 静态设计通过；F-023 的当前 SHA 远端成功/失败传播尚未实跑          |
| R-009 | PASS    | 目录、覆盖率、风险断言、零重试双轮 E2E 均通过                              |
| R-010 | PASS    | README/docs 权威入口、历史规格状态和维护路径已治理                         |
| R-011 | PASS    | 同环境基线、质量证据和 NO-GO 报告已归档，且未越过未满足发布门              |

总需求口径为：**5 PASS、2 PARTIAL、4 NOT MET**。因此仓库候选成立，但“所有需求完成”与
“可正式发布”均不成立。

### 5.2 F 级证据映射

下面的分组覆盖 F-001..F-033；每组同时指向可复现结果与原始测试/治理记录，避免只依赖本表的
结论性描述。

| F 项                       | 可复核证据                                                                                                                                                                                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| F-001、F-015～F-017        | [baseline 双构建与静态产物](./baseline-after.md#41-双构建与静态产物)、[quality E2E](../../../tests/e2e/quality.release.e2e.spec.ts)、[路由清单](../../../tests/helpers/routes.ts)、[SEO integration](../../../tests/integration/seo-routes.integration.test.tsx)                                                         |
| F-002                      | [audit T-012 P0/P1 闭环](./audit-register.md#92-p0-闭环10)、[审计统计](./audit-register.md#95-统计仓库闭环与正式发布阻断分开)                                                                                                                                                                                            |
| F-003～F-006、F-010～F-013 | [静态页面 integration](../../../tests/integration/static-pages.integration.test.tsx)、[journeys E2E](../../../tests/e2e/journeys.release.e2e.spec.ts)、[responsive E2E](../../../tests/e2e/responsive.release.e2e.spec.ts)、[事实登记 closure](./content-fact-register.md#6-t-012-closure-appendix2026-07-19)            |
| F-007～F-009               | [keyboard E2E](../../../tests/e2e/keyboard.release.e2e.spec.ts)、[quality/Axe E2E](../../../tests/e2e/quality.release.e2e.spec.ts)、[theme unit](../../../tests/unit/theme-script.test.tsx)、[人工证据模板](../../../tests/e2e/manual-keyboard-evidence.md)、[baseline §3.2](./baseline-after.md#32-playwright-发布矩阵) |
| F-014                      | [application integration](../../../tests/integration/application-entry-points.integration.test.tsx)、[外链 unit](../../../tests/unit/external-application-link.test.tsx)、[audit P0-003/P1-008](./audit-register.md#93-p1-闭环25)                                                                                        |
| F-018、F-019、F-028、F-029 | [baseline §3.2/§3.3](./baseline-after.md#32-playwright-发布矩阵)、[Lighthouse E2E](../../../tests/e2e/lighthouse.release.e2e.spec.ts)、[journeys E2E](../../../tests/e2e/journeys.release.e2e.spec.ts)                                                                                                                   |
| F-020                      | [baseline 命令与退出码](./baseline-after.md#2-命令与退出码)、[site config 负例](../../../tests/unit/site-config.test.ts)、[JSON-LD hostile fixture](../../../tests/unit/json-ld.test.tsx)                                                                                                                                |
| F-021、F-022               | [audit P1/P2 closure](./audit-register.md#93-p1-闭环25)、[内容校验](../../../tests/unit/content-validation.test.ts)、[facts 负例](../../../tests/unit/content/content-validation-facts.test.ts)                                                                                                                          |
| F-023～F-025               | [CI workflow](../../../.github/workflows/ci.yml)、[Pages workflow](../../../.github/workflows/deploy-pages.yml)、[audit P0-008/P1-019/P1-025](./audit-register.md#96-七类正式发布门与恢复任务)                                                                                                                           |
| F-026、F-027               | [baseline Vitest/coverage](./baseline-after.md#31-vitest)、[测试结构](../../../tests)、[Vitest 配置](../../../vitest.unit.config.mts)                                                                                                                                                                                    |
| F-030、F-031               | [docs 入口](../../README.md)、[feature 生命周期索引](../README.md)                                                                                                                                                                                                                                                       |
| F-032                      | [baseline 全命令表](./baseline-after.md#2-命令与退出码)                                                                                                                                                                                                                                                                  |
| F-033                      | 本报告 §1～§8、[baseline](./baseline-after.md) 与 [audit closure](./audit-register.md#98-t-012-closure-结论)                                                                                                                                                                                                             |

## 6. 原七类正式发布门（六类仍开放）

|   # | 门                                | 当前证据                                                                                          | 恢复任务与通过条件                                                                                                                                                             | 建议 owner              |
| --: | --------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
|   1 | 适用备案与运营合规                | 候选已删除占位 ICP；旧 github.io 仍公开该占位号，且没有适用性书面判断或真实备案记录               | 立即遏制旧公开内容；运营/法务根据托管与服务范围给出可追溯裁决，需要备案时提供官方记录                                                                                          | 运营 / 法务             |
|   2 | 正式域、TLS、Pages 与六个跳转入口 | Pages 状态 built、实际端点为 github.io、`cname:null`；正式域 DNS/HTTPS 不可用，六个跳转入口未形成 | 按安全顺序完成组织域验证→仓库 Custom domain→DNS/TLS；正式域 200，apex+五备用域各自有效 TLS 且单跳 301                                                                          | 域名管理员 / 仓库管理员 |
|   3 | 三个 Feishu 申请流程              | 三表 GET 200，但 `enableAnonymousSubmit:false`；旧 github.io 仍启用三张表的 CTA                   | 先关闭未审入口；无登录窗口逐表核 title、对象、字段、信息告知、匿名提交与回执，通过后只配置对应 target                                                                          | 表单 owner / 运营       |
|   4 | 当前候选远端 CI 与部署链          | 现网部署旧 `d624120…`（run `29671570130`）；候选 `e567124…` 未推送且 Actions run count=0          | 推送短分支、开受保护 PR；同 SHA strict checks 全绿；证明失败门不部署、成功只部署获批 SHA，并对实际端点做负向 smoke                                                             | 维护者 / GitHub 管理员  |
|   5 | 真人 UX、双主题与辅助技术         | 自动键盘/Axe/Lighthouse 及代表主题状态通过；人工模板全为 `Not run`，全状态双主题未证              | 在 [人工证据模板](../../../tests/e2e/manual-keyboard-evidence.md) 填 SHA/环境/操作者；完成键盘、200% zoom、读屏、全页面有意义状态的 light/dark、首帧、禁 JS 与系统主题切换验收 | QA / 无障碍测试人       |
|   6 | 已核验公开联系替代                | 候选已移除未核邮箱；旧 github.io 仍暴露 `contact@zgc-llm.org.cn`，该域无可用邮件/DNS 证据         | 先移除旧公开动作；授权一个公开渠道并完成实际收发/到达测试，再补双语、键盘可达的 fallback                                                                                       | 运营 / 联系渠道 owner   |
|   7 | 独立 reviewer 与受保护合并        | `accepted`：owner 已批准短期强制批准数为 0；PR、三个 strict checks、对话解决与 admin enforcement 保留 | 当前可按受保护 PR 合并；具备稳定评审能力后，用独立治理变更恢复至少一名批准者并重新评估 stale dismissal 与 last-push                                                            | 组织 owner              |

外部配置还保留两个已无代码消费者的旧 Actions Variables：
`NEXT_PUBLIC_INSTITUTION_APPLICATION_URL`、`NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL`。
确认没有其他 workflow 消费后应由有权限者删除；它们不会启用当前三个 target，也不能作为表单已配置证据。
组织级 variables API 返回 403，因此本轮不声称已排除组织继承变量。

域名的安全启用顺序和验证命令以
[GitHub Pages 与 DNS 部署指南](../../deploy-pages-dns.md)为准，容器恢复路径见
[Docker 部署指南](../../deploy-docker.md)。

## 7. 事实与授权边界

以下项目尚未取得新授权，但候选源码与候选 export 已删除、中性化或关闭相应断言，因此不额外
阻断仓库内候选：官方英文全称、正式 Logo、主管部门指导、具名工作组关系、会员资格绝对规则、
费用/授权/SLA 绝对承诺和“正式上线”稿。任何恢复动作都必须重新打开对应 FACT/审计项，不能
把本轮中性化视为授权。

该结论**不适用于当前公开的旧部署**。`https://zgc-llm.github.io/` 仍公开占位 ICP、未核邮箱、
legacy Logo、上线稿、五个具名工作组主体、三个未完成匿名核验的 CTA 和部分时效承诺；因此
F-012 为 PARTIAL，门 1/2/3/4/6 均不能关闭。

成员中文名单与有限职务只使用当前登记的公开来源范围；不得外推机构英文名、Logo、工作组角色
或更广合作关系。完整裁决见 [内容事实登记](./content-fact-register.md)。

## 8. 发布操作边界与下一步

截至本报告生成时，最终候选尚未推送、创建 PR、合并 `main` 或触发部署；用户已经明确授权通过
受保护 PR 尽快替换旧 github.io 内容，并继续监控同 SHA CI 与 Pages 部署。DNS、GitHub Variables
和 Feishu 表单仍由对应 owner 按交接清单执行，本轮不会提交任何表单数据。

建议恢复顺序：

1. 立即遏制旧 Pages 暴露：通过受保护 PR 和同 SHA strict checks 后，用事实安全候选替换；保留
   证据与回滚点，不直接把未通过 required checks 的本地分支发布到现网；
2. 完成备案判断、三表和公开联系渠道；
3. 完成人工键盘/zoom/屏幕阅读器、全页面双主题、首帧、禁 JS 与系统切换验收并签字；
4. 推送候选并通过受保护 PR、同 SHA CI 与失败门演练；
5. 按“先验证归属和绑定、后切 DNS”的顺序启用 Pages、TLS 与所有 301；
6. 对实际 github.io 与正式 endpoint 重跑 E2E/SEO/TLS/redirect 及旧事实负向 smoke，所有门通过后
   生成新的 GO 报告。

在以上六类开放门全部关闭前，本报告结论保持：**NO-GO / 不可正式发布**。
