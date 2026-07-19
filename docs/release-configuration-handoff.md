# 官网发布配置交接清单

本文件交给负责域名、GitHub Pages、邮箱、备案和飞书表单的同事执行。仓库维护者负责代码与
CI；外部配置负责人必须逐项回填证据。未勾选的项目不能口头视为完成。

## 1. 已确认的发布策略

- 正式主域名：`https://www.zgc-llm.org.cn`。
- GitHub Pages 仓库：`ZGC-LLM/zgc-llm.github.io`。
- 旧 github.io 页面通过受保护 PR 尽快替换；这次替换是安全遏制，不等同于正式域名上线。
- 没有真实备案号时隐藏 ICP 信息，不使用占位号。
- 预留联系邮箱：`contact@zgc-llm.org.cn`；完成邮件系统和收发验证前不在官网公开为 `mailto:`。
- 三个飞书申请入口保持关闭，直到各自通过匿名访问、信息告知、字段和回执验收。
- main 暂不要求 PR approval；三个 strict status checks、对话解决和管理员保护继续生效。

## 2. 负责人回填

| 范围                     | 负责人 | 完成时间 | 证据链接或截图 |
| ------------------------ | ------ | -------- | -------------- |
| 域名所有权与 DNS         |        |          |                |
| GitHub 组织/仓库 Pages   |        |          |                |
| TLS 与六个跳转入口       |        |          |                |
| 备案适用性与备案号       |        |          |                |
| 联系邮箱与邮件 DNS       |        |          |                |
| 联盟申请表单             |        |          |                |
| 网络安全工作组表单       |        |          |                |
| 网络安全人员开放计划表单 |        |          |                |

## 3. GitHub Pages 与 CNAME

按以下顺序操作，避免域名接管风险：

1. 在 GitHub 组织 Settings → Pages 验证 `zgc-llm.org.cn` 所有权，并长期保留 GitHub 给出的
   TXT 记录。
2. 在仓库 Settings → Pages 选择 **GitHub Actions** 作为 Source。
3. 将 Custom domain 设置为 `www.zgc-llm.org.cn`。仓库中的 `public/CNAME` 已固定为同一值。
4. 确认 Pages 设置已接受该域名后，再修改 DNS。
5. 等证书签发成功后启用 **Enforce HTTPS**。

主站 DNS：

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

操作前再次核对 GitHub 官方文档中的 apex IP，不能只依赖本文件的历史快照。

以下六个入口都要有有效 TLS，并且一次 301 到
`https://www.zgc-llm.org.cn/`，不能多跳、循环或降级到 HTTP：

- `https://zgc-llm.org.cn/`
- `https://zgc-llm.cn/`
- `https://zgc-llm.net/`
- `https://zgcllm.org.cn/`
- `https://zgcllm.cn/`
- `https://zgcllm.net/`

## 4. 联系邮箱预留

计划地址：`contact@zgc-llm.org.cn`。

公开前必须完成：

- [ ] 创建真实邮箱或可追踪的转发目标；
- [ ] 配置并验证 MX；
- [ ] 配置 SPF、DKIM 和 DMARC；
- [ ] 从外部邮箱发送测试邮件并收到；
- [ ] 从该地址回复并确认对方收到；
- [ ] 明确处理人、响应范围和离职/交接机制；
- [ ] 完成后再提交 PR 恢复 footer 和不可用申请状态中的联系动作。

邮箱尚未通过以上检查时，可以保留域名和地址规划，但不能在公开页面提供不可用的链接。

## 5. 三张飞书表单是什么

| 用途                     | 官网 target                   | GitHub Actions Variable                             | 当前公开分享地址                                                           | 当前状态 |
| ------------------------ | ----------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------- | -------- |
| 联盟合作与入会意向       | `alliance`                    | `NEXT_PUBLIC_APPLICATION_URL`                       | `https://clouditera.feishu.cn/share/base/form/shrcnlX5daUGxOitSbOOUc1tkBb` | 关闭     |
| 参与网络安全工作组       | `cybersecurity-working-group` | `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`         | `https://clouditera.feishu.cn/share/base/form/shrcnzfEuj5Wr8mdtX9aUxnP9LB` | 关闭     |
| 申请网络安全人员开放计划 | `cybersecurity-program`       | `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM` | `https://clouditera.feishu.cn/share/base/form/shrcnXSRHvrWPehplPdvFuB0juc` | 关闭     |

截至 2026-07-19，三个地址都能打开，但页面配置均显示
`enableAnonymousSubmit:false`。HTTP 200 不代表访客可以无登录提交。

每张表必须单独验收：

- [ ] 无登录、无租户账号的新浏览器可以打开并完成提交；
- [ ] 标题、申请对象和官网入口一致；
- [ ] 提交前展示信息处理方、用途和必要告知；
- [ ] 字段只收集当前申请所必需的信息；
- [ ] 成功提交后有明确回执；
- [ ] 运营负责人确认当前受理范围和后续时效；
- [ ] 只配置该表对应的 Actions Variable，不把一张表复用到其他 target。

未完成时保持 Variable 为空，官网会显示不可用说明而不是按钮。

## 6. 备案处理

- 当前没有可验证备案号，官网候选已经隐藏 ICP 展示。
- 由运营/法务确认当前托管方式是否需要备案，并保留书面结论。
- 如需展示备案号，只能使用工信部可查询的真实记录；同步补齐链接、主体和站点信息。
- 禁止为了视觉完整性加入示例号或占位号。

## 7. 发布与线上验收

PR 必须通过：

- `Security audit`
- `Types, lint & unit tests`
- `End-to-end tests`

合并后确认 Pages 部署 SHA 与合并提交完全一致，并检查：

- [ ] `https://zgc-llm.github.io/` 不再出现占位备案号、未核邮箱或旧 Logo；
- [ ] 旧“正式上线”新闻路由返回 404/noindex；
- [ ] 工作组页面不出现未授权具名关系；
- [ ] 三个申请入口保持不可点击，除非对应表单已验收并配置；
- [ ] `robots.txt`、`sitemap.xml`、canonical 和 hreflang 使用正式主域名；
- [ ] 正式域可访问，证书有效；六个备用入口均一次 301；
- [ ] 再生成一份带线上 SHA 和验证时间的发布验收记录。

常用只读验证命令：

```bash
dig +short www.zgc-llm.org.cn CNAME
dig +short www.zgc-llm.org.cn A
dig +short zgc-llm.org.cn A
gh api repos/ZGC-LLM/zgc-llm.github.io/pages
gh run list --repo ZGC-LLM/zgc-llm.github.io --workflow deploy-pages.yml --limit 5
curl --fail --silent --show-error --head https://www.zgc-llm.org.cn/
```

更完整的操作顺序见 [GitHub Pages 与 DNS 部署指南](./deploy-pages-dns.md)。
