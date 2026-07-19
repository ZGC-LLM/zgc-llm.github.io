# GitHub Pages 与 DNS 部署

GitHub Pages 是本站的主部署路径。仓库通过 [CI](../.github/workflows/ci.yml) 验证质量与两种生产构建，再由 [Pages 工作流](../.github/workflows/deploy-pages.yml) 对通过 CI 的同一提交重新生成并部署静态产物。

正式 canonical 目标为 `https://www.zgc-llm.org.cn`。截至 2026-07-19 的发布审计，正式域名没有可用 DNS 记录，HTTPS 无法连接，GitHub Pages API 的 `cname` 为空；仓库中的 CNAME、canonical 和 workflow 配置不能作为已上线证据。

需要自托管时使用 [Docker standalone 指南](./deploy-docker.md)。

## 部署链

main push 的正常路径：

```text
push main
  → CI: security + type/lint/coverage + standalone/export + Chromium fast E2E
  → CI conclusion=success
  → deploy-pages workflow_run
  → checkout CI 通过的精确 SHA
  → BUILD_TARGET=export 重新构建
  → 验证 out/CNAME
  → upload-pages-artifact
  → deploy-pages
```

Pages 不直接消费开发机或旧 workflow 的产物。重新构建是为了在拥有部署权限的干净 runner 上，为同一已批准 SHA 和公开变量生成正式 artifact。

手动 `workflow_dispatch` 只能在 `main` 上执行，工作流还会查询该 SHA 最近一次 main push CI；没有成功结果时部署失败。PR、fork、schedule 或手动触发的 CI 不能授予部署资格。

## 固定版本与公开变量

两个 workflow 均使用：

- Node.js `22.23.1`
- pnpm `11.2.2`
- frozen lockfile
- `NEXT_PUBLIC_SITE_URL=https://www.zgc-llm.org.cn`

三个申请变量来自仓库 Settings → Secrets and variables → Actions → Variables：

| Variable                                            | Target                   |
| --------------------------------------------------- | ------------------------ |
| `NEXT_PUBLIC_APPLICATION_URL`                       | 联盟合作与入会申请       |
| `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`         | 网络安全工作组申请       |
| `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM` | 网络安全人员开放计划申请 |

它们是构建时公开输入，不是密钥。三者默认留空并分别 fail closed。只有对应表单完成标题、对象、匿名提交、信息处理告知、字段和回执核验后，才配置该变量；不能将一个表单 URL 复制给多个 target。

## 域名规则

| 类型           | 域名                                       | 目标行为                               |
| -------------- | ------------------------------------------ | -------------------------------------- |
| 正式主域名     | `www.zgc-llm.org.cn`                       | 唯一对外服务与 canonical 域名          |
| 正式域裸域     | `zgc-llm.org.cn`                           | HTTPS 301 到正式主域名                 |
| 品牌保护域     | `zgc-llm.cn`、`zgc-llm.net`                | HTTPS 301 到正式主域名                 |
| 无连字符防御域 | `zgcllm.org.cn`、`zgcllm.cn`、`zgcllm.net` | HTTPS 301 到正式主域名，不提供独立服务 |

无连字符形式只用于品牌名、包名、内部 key 和防御域，不得出现在 canonical、sitemap、robots 或正式服务链接中。当前没有已核验公开邮箱；未来启用邮箱时，应使用正式域名并先验证收件能力，文档不能提前提供占位地址。

## DNS 配置

在 `zgc-llm.org.cn` 的 DNS 服务商配置：

```dns
www.zgc-llm.org.cn.   CNAME   zgc-llm.github.io.

zgc-llm.org.cn.   A      185.199.108.153
zgc-llm.org.cn.   A      185.199.109.153
zgc-llm.org.cn.   A      185.199.110.153
zgc-llm.org.cn.   A      185.199.111.153
zgc-llm.org.cn.   AAAA   2606:50c0:8000::153
zgc-llm.org.cn.   AAAA   2606:50c0:8001::153
zgc-llm.org.cn.   AAAA   2606:50c0:8002::153
zgc-llm.org.cn.   AAAA   2606:50c0:8003::153
```

GitHub 可能更新 apex IP。操作前以 [GitHub 官方自定义域名文档](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site) 为准，不从历史截图复制。

保护域和防御域需要在注册商、DNS 跳转服务或前置代理上分别提供有效 TLS，并返回到正式主域名的精确 301。只做 DNS 指向不等于已经配置 HTTP 重定向。

## 启用顺序

1. 确认域名所有权、适用备案要求、组织权限和 DNS 变更权限。
2. 先在 GitHub 组织 Settings → Pages 验证 `zgc-llm.org.cn`，按页面提示添加并长期保留 TXT 记录。GitHub [建议先验证域名](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)，降低域名接管风险。
3. 在仓库 Settings → Pages 中选择 GitHub Actions 作为 Source，并将 Custom domain 设置为 `www.zgc-llm.org.cn`。仓库内 [`public/CNAME`](../public/CNAME) 必须保持相同值。
4. 完成仓库绑定后，再按上文配置正式域的 CNAME/A/AAAA。GitHub [明确要求先添加 Custom domain、后配置 DNS](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)，避免未绑定的 DNS 被其他 Pages 站点接管。
5. 验证 DNS 已生效，等待证书签发后启用 Enforce HTTPS。
6. 配置 apex、两个保护域和三个防御域的 HTTPS 301。
7. 完成真实域名、TLS、canonical、sitemap、robots 和全部重定向验收后，才能对外声明上线。

步骤 3 到步骤 4 之间，正式域可能暂时不可达；这是先建立归属再切换 DNS 的安全取舍。应在同一维护窗口内连续完成，不要提前宣传域名，也不要先把未绑定的 DNS 指向 GitHub Pages。

## 验证

DNS 与 Pages 状态：

```bash
dig +short www.zgc-llm.org.cn CNAME
dig +short www.zgc-llm.org.cn A
dig +short zgc-llm.org.cn A
gh api repos/ZGC-LLM/zgc-llm.github.io/pages
```

正式服务与 redirect：

```bash
curl --fail --silent --show-error --head https://www.zgc-llm.org.cn/
curl --silent --show-error --head https://zgc-llm.org.cn/
curl --silent --show-error --head https://zgc-llm.cn/
curl --silent --show-error --head https://zgc-llm.net/
curl --silent --show-error --head https://zgcllm.org.cn/
curl --silent --show-error --head https://zgcllm.cn/
curl --silent --show-error --head https://zgcllm.net/
```

验收时保留状态码、`Location`、证书域名、有效期和最终 canonical。每个备用域必须一次 301 到 `https://www.zgc-llm.org.cn/`，不能形成多跳、循环或 HTTP 降级。

构建与 artifact：

```bash
pnpm install --frozen-lockfile
pnpm build:export
test "$(cat out/CNAME)" = 'www.zgc-llm.org.cn'
```

## 分支与外部发布条件

main 当前要求三个 strict status checks：`Security audit`、`Types, lint & unit tests`、`End-to-end tests`；同时要求一名批准者、撤销过期审批、最后推送者限制、解决对话，并对管理员生效。

仓库目前只有一名协作者。增加第二名具备评审权限的 reviewer 前，受保护 PR 无法满足审批门。该限制应通过增加合格 reviewer 解决，不能降低门禁或绕过管理员保护。

正式发布还依赖仓库外状态：

- 三个 Feishu target 的匿名提交与隐私/回执核验；
- 适用的 ICP 备案或运营/法务确认；
- 已验证的公开联系渠道；
- 正式 Logo 的使用权与适用范围；
- 官方英文全称的权利人确认。

没有备案号时不展示占位号；没有已核验邮箱时不提供 `mailto:`；英文全称未确认时只使用 `ZGCLLM` 或 `the Alliance`。以上任一必需条件未完成时，发布验收必须如实记录阻塞。

## 排障

- Pages 404：确认 Source 为 GitHub Actions，CI 与 Pages workflow 对应同一 SHA，且 artifact 包含 `out/index.html`。
- 部署 job 被跳过：检查触发事件、branch、CI conclusion、head repository 和 SHA 条件。
- CNAME 校验失败：同步 `public/CNAME`、`src/config/site.ts`、两个 workflow、Dockerfile 与文档。
- CTA 显示不可用：对应 Actions Variable 为空、格式错误、target 不匹配或不在精确 allowlist。不要改用另一张表单。
- canonical 正确但正式域名打不开：这是 DNS/TLS/Pages custom domain 的外部问题，不是重新构建页面能够修复的问题。
