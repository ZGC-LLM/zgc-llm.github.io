# GitHub Pages 部署与 DNS 配置

本站生产环境部署在 **GitHub Pages**，仓库 [`ZGC-LLM/zgc-llm.github.io`](https://github.com/ZGC-LLM/zgc-llm.github.io)（组织 Pages 仓库）。构建走 GitHub Actions 工作流（[`deploy-pages.yml`](../.github/workflows/deploy-pages.yml)）做 Next.js 静态导出，非 Jekyll。

> 需要绕开 Pages 的自主容器部署方案，见 [`deploy-docker.md`](./deploy-docker.md)。

## 部署机制

- push 到 `main` 或手动 `workflow_dispatch` 触发 `deploy-pages.yml`。
- 工作流以 `BUILD_TARGET=export`、`NEXT_PUBLIC_SITE_URL=https://www.zgc-llm.org.cn` 构建，产物 `out/` 上传并部署到 Pages。
- 飞书表单地址通过仓库 **Settings → Secrets and variables → Actions → Variables** 注入（未配置时 `/join` CTA 优雅降级）：
  - `NEXT_PUBLIC_INSTITUTION_APPLICATION_URL`
  - `NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL`
- Pages 构建来源须为 **GitHub Actions**（Settings → Pages → Build and deployment → Source = GitHub Actions），不是 Deploy from a branch。

默认可访问地址：<https://zgc-llm.github.io/>。

## 域名规约（与 [`../CLAUDE.md`](../CLAUDE.md) 一致）

- **正式主域名：`www.zgc-llm.org.cn`（带连字符）** —— canonical、sitemap、robots、邮箱均以此为准。
- 裸域 `zgc-llm.org.cn` 301 跳转到 `www.zgc-llm.org.cn`。
- 品牌保护域名 `zgc-llm.cn`、`zgc-llm.net` 与防御性注册的无连字符 `zgcllm.org.cn` / `zgcllm.cn` / `zgcllm.net`，上线时统一 301 跳转到主域名，不作正式对外服务域名。

## DNS 配置（在域名 DNS 服务商处操作）

在 DNS 服务商为 `zgc-llm.org.cn` 添加以下记录：

```dns
# 主域名（www）—— CNAME 指向组织 Pages 仓库
www.zgc-llm.org.cn.   CNAME   zgc-llm.github.io.

# 裸域（apex）—— GitHub Pages 官方 IP（A / AAAA）
zgc-llm.org.cn.   A      185.199.108.153
zgc-llm.org.cn.   A      185.199.109.153
zgc-llm.org.cn.   A      185.199.110.153
zgc-llm.org.cn.   A      185.199.111.153
zgc-llm.org.cn.   AAAA   2606:50c0:8000::153
zgc-llm.org.cn.   AAAA   2606:50c0:8001::153
zgc-llm.org.cn.   AAAA   2606:50c0:8002::153
zgc-llm.org.cn.   AAAA   2606:50c0:8003::153
```

> GitHub Pages 的 apex IP 可能随官方文档更新，以 [GitHub 官方文档](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site) 为准。

## 启用自定义域名（DNS 生效后再做）

1. 验证 DNS 已解析：

   ```bash
   dig +short www.zgc-llm.org.cn    # 期望返回 zgc-llm.github.io. 及 Pages IP
   dig +short zgc-llm.org.cn        # 期望返回 4 个 185.199.x.153
   ```

2. 仓库 **Settings → Pages → Custom domain** 填入 `www.zgc-llm.org.cn`，保存并等待域名验证通过。
   - 仓库内已有 [`public/CNAME`](../public/CNAME)（内容为 `www.zgc-llm.org.cn`），静态导出会带上它。
3. 勾选 **Enforce HTTPS**（证书签发可能需要几分钟到几十分钟）。

> ⚠️ **顺序很重要**：DNS 未指向 GitHub 前不要在 Pages 设置自定义域名 —— 一旦设置，`zgc-llm.github.io` 会 301 跳到尚不可达的自定义域名，导致站点整体无法访问。

## 品牌/防御域名 301

`zgc-llm.cn`、`zgc-llm.net` 及无连字符系列域名，在各自 DNS/注册商或前置反代层配置到 `https://www.zgc-llm.org.cn` 的 301 永久跳转即可，无需指向 Pages。

## 排障

- **站点 404 / “There isn't a GitHub Pages site here”**：确认 Pages Source 为 GitHub Actions，且 `deploy-pages.yml` 最近一次运行成功。
- **改了域名相关配置**：按 [`../CLAUDE.md`](../CLAUDE.md) 同步 `src/config/site.ts`、`public/CNAME`、两个 workflow、`Dockerfile`、`site-footer.tsx` 及文档。
- **CTA 显示“申请通道准备中”**：Actions Variables 里的飞书表单地址未配置或为空。
