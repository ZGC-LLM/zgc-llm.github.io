<div align="center">

# 中关村自主大模型产业联盟官网

**ZGCLLM · Zhongguancun Independent Large Model Industry Alliance**

厂商中立的纯静态展示官网 · 联盟介绍、生态共建与新闻动态

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-UNLICENSED-lightgrey)](#)

正式主域名 [`www.zgc-llm.org.cn`](https://www.zgc-llm.org.cn) · 品牌保护域名 `zgc-llm.cn` / `zgc-llm.net` 上线时统一 301 跳转到主域名

</div>

---

## 目录

- [项目简介](#项目简介)
- [首期范围](#首期范围)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [常用命令](#常用命令)
- [环境变量](#环境变量)
- [内容与申请入口维护](#内容与申请入口维护)
- [公开路由](#公开路由)
- [项目结构](#项目结构)
- [部署说明](#部署说明)
- [相关文档](#相关文档)

---

## 项目简介

本站为**纯静态展示官网**，公开内容全部来自仓库内的类型化配置（`src/content/`），不含内容管理后台与数据库。加入申请通过飞书表单收集，**官网不接收、不记录、不保存任何申请数据**。

> 域名说明：正式主域名为 `www.zgc-llm.org.cn`（带连字符），`zgc-llm.cn` 与 `zgc-llm.net` 作为品牌保护域名，上线时统一 301 跳转到主域名。带连字符的 `zgc-llm.org.cn`、`zgc-llm.cn`、`zgc-llm.com`、`zgc-llm.net`，以及无连字符的 `zgcllm.org.cn`、`zgcllm.cn`、`zgcllm.net` 均已注册，作为品牌保护与备用域名，统一 301 跳转到主域名。

## 首期范围

| 模块 | 说明 |
| --- | --- |
| 联盟介绍 | 联盟定位、工作组与重点专项 |
| 网络安全专题 | 厂商中立的网络安全生态专题 |
| 生态共建 | 机构生态共建与专业用户双申请路径 |
| 成员与动态 | 成员伙伴展示与新闻动态 |
| 合规基础 | 隐私说明、基础 SEO、`sitemap` 与 `robots` |

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 框架 | Next.js 16（App Router）· React 19 |
| 语言与样式 | TypeScript · Tailwind CSS 4 |
| 测试 | Vitest（单元）· Playwright（E2E） |
| 质量 | ESLint · Prettier |
| 交付 | Docker · GitHub Actions |

## 快速开始

> **环境要求**：Node.js 22 · pnpm 11

```bash
git clone git@github.com:ZGC-LLM/zgc-llm.github.io.git
cd zgc-llm.github.io
cp .env.example .env   # 准备环境变量
pnpm install           # 安装依赖
pnpm dev               # 启动开发服务器
```

启动后访问：<http://localhost:3000>

## 常用命令

```bash
pnpm dev             # 启动开发服务器
pnpm build           # 生产构建
pnpm typecheck       # TypeScript 类型检查
pnpm lint            # ESLint 检查
pnpm test            # 单元测试（Vitest）
pnpm test:e2e        # 端到端测试（Playwright）
pnpm test:all        # 单元 + 端到端测试
```

**关于 E2E 端口**：Playwright 默认在隔离的 `127.0.0.1:3100` 启动测试站点，避免误复用开发中的 `3000` 端口。可通过 `E2E_PORT` 或 `E2E_BASE_URL` 覆盖。设置 `E2E_BASE_URL` 时，Playwright 仅访问该外部目标，不再启动本地开发服务器。

## 环境变量

两类飞书表单链接通过环境变量独立配置，**仅接受 HTTPS 地址**：

```bash
NEXT_PUBLIC_INSTITUTION_APPLICATION_URL=https://example.feishu.cn/share/base/form/...
NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL=https://example.feishu.cn/share/base/form/...
NEXT_PUBLIC_SITE_URL=https://www.zgc-llm.org.cn
```

> ⚠️ 这些 `NEXT_PUBLIC_*` 变量会在 **Next.js 构建时**写入静态页面。未配置或地址非法时，页面会显示不可点击状态和联系回退，不会产生死链。申请数据由飞书表单及飞书多维表格承接，官网不接收或保存申请数据。
>
> 构建生产 Docker 镜像时必须通过 `--build-arg` 传入（见[部署说明](#部署说明)）；仅在容器启动时注入不会改变已静态生成的申请链接。

## 内容与申请入口维护

| 内容 | 位置 |
| --- | --- |
| 站点名称、导航、公开路由、申请目标 | `src/config/site.ts` |
| 首页、联盟、专项、成员、新闻内容 | `src/content/` |
| 页面实现 | `src/app/(frontend)/` |
| 全局视觉 Token 与响应式规则 | `src/app/(frontend)/styles.css` |

## 公开路由

```text
/                     首页
/alliance             联盟介绍
/working-groups       工作组
/cybersecurity        网络安全专题
/members              成员伙伴
/news  ·  /news/[slug]  新闻动态与详情
/join                 机构申请入口
/professionals        专业用户申请入口
/privacy              隐私说明
/sitemap.xml  ·  /robots.txt   SEO 基础
```

`/sitemap.xml` 由 `src/app/(frontend)/sitemap.ts` 生成，`/robots.txt` 由 `src/app/robots.ts` 生成。

## 项目结构

```text
src/
├── app/
│   ├── (frontend)/   # 官网 App Router 页面、布局、样式与 sitemap
│   └── robots.ts     # 根级 /robots.txt 生成
├── components/       # 站点 UI 组件
├── config/           # 站点级配置（site.ts）
├── content/          # 类型化的公开内容
└── types/            # 内容类型定义

tests/
├── unit/             # 单元与组件测试（Vitest）
├── e2e/              # 浏览器端到端测试（Playwright）
└── helpers/          # 测试辅助
```

> 注：`src/app/my-route/` 为空的脚手架残留目录，未对应任何公开路由，可安全删除。

## 部署说明

生产环境部署在 **GitHub Pages**（仓库 [`ZGC-LLM/zgc-llm.github.io`](https://github.com/ZGC-LLM/zgc-llm.github.io)）。push 到 `main` 触发 GitHub Actions 工作流（`.github/workflows/deploy-pages.yml`）做 Next.js 静态导出并发布，默认地址 <https://zgc-llm.github.io/>，正式主域名为 `www.zgc-llm.org.cn`。飞书表单地址通过仓库 Settings → Secrets and variables → Actions 的 Variables 注入。自定义域名与 DNS 配置见 [`docs/deploy-pages-dns.md`](./docs/deploy-pages-dns.md)。

如需绕开 Pages 自主部署，本站也支持 **Docker standalone SSR**（详见 [`docs/deploy-docker.md`](./docs/deploy-docker.md)）。构建时必须传入公开环境变量：

```bash
docker build \
  --build-arg NEXT_PUBLIC_INSTITUTION_APPLICATION_URL=https://example.feishu.cn/share/base/form/... \
  --build-arg NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL=https://example.feishu.cn/share/base/form/... \
  --build-arg NEXT_PUBLIC_SITE_URL=https://www.zgc-llm.org.cn \
  -t zgcllm-website .
```

**上线前检查清单：**

- [ ] `www.zgc-llm.org.cn` 指向正式服务，其他注册域名配置 HTTPS 301 跳转
- [ ] ICP 备案、HTTPS 证书、WAF、访问日志脱敏
- [ ] 申请页隐私告知与合规文案（个人信息收集、同意与保留由飞书表单侧承担）
- [ ] 正式联盟 Logo、成员名单、新闻材料及公开授权确认
- [ ] 两份飞书表单 URL、联系人、ICP 备案号和合规文案
- [ ] 生产环境变量通过部署平台注入，不写入仓库

## 相关文档

| 文档 | 说明 |
| --- | --- |
| [`docs/overview.md`](./docs/overview.md) | 项目总览 |
| [`docs/README.md`](./docs/README.md) | 文档索引 |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | 协作约定与提交前检查 |
