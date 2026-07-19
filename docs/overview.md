# 项目总览

> 中关村自主大模型产业联盟官网（ZGCLLM）工程总览。面向第一次接触本仓库的开发者与协作者，帮助快速建立整体认知。
> 更详细的上手与命令见根目录 [`README.md`](../README.md) 与 [`CONTRIBUTING.md`](../CONTRIBUTING.md)。

## 一句话定位

纯静态展示型官网：公开内容由仓库内类型化配置（`src/content/`）驱动，加入申请通过飞书表单外链承接。**官网不接收、不落库、不保存任何申请人数据**，无内容管理后台，无数据库。

## 技术栈

| 领域 | 选型 |
|------|------|
| 框架 | Next.js 16（App Router）+ React 19 |
| 语言 | TypeScript 5.7（严格模式，禁用 `any`） |
| 样式 | Tailwind CSS 4 + 全局设计 Token（`src/app/(frontend)/styles.css`） |
| 测试 | Vitest（单元/组件，jsdom）、Playwright（E2E） |
| 质量 | ESLint、Prettier |
| 交付 | Docker（Next.js standalone）、GitHub Actions |
| 运行时 | Node.js 22（`engines` 下限 20.9.0）、pnpm 11 |

## 目录结构

```text
src/
├── app/
│   ├── (frontend)/       # 官网 App Router 页面、布局、样式、sitemap
│   │   ├── layout.tsx     # 站点外壳（页头/页脚）
│   │   ├── page.tsx       # 首页
│   │   ├── styles.css     # 全局视觉 Token 与响应式断点
│   │   ├── not-found.tsx  # 统一中文 404
│   │   ├── sitemap.ts     # /sitemap.xml 生成
│   │   ├── alliance/ working-groups/ cybersecurity/
│   │   ├── members/ news/ news/[slug]/
│   │   └── join/ professionals/ privacy/
│   └── robots.ts          # 根级 /robots.txt 生成
├── components/site/       # 站点 UI 组件（页头、页脚、导航、Hero、申请外链等）
├── config/site.ts         # 站点名称、导航、公开路由、统一申请目标配置
├── content/               # 类型化的公开内容（各业务领域一个文件）
│   ├── alliance.ts cybersecurity.ts home.ts
│   └── members.ts news.ts working-groups.ts
└── types/content.ts       # 内容与申请目标的类型定义
tests/
├── unit/                  # 单元与组件测试（Vitest + jsdom）
├── e2e/                   # 浏览器端到端测试（Playwright）
└── helpers/               # 测试辅助（如 E2E 端口/URL 配置）
```

## 公开路由

- 内容页：`/`、`/alliance`、`/working-groups`、`/cybersecurity`、`/members`、`/news`、`/news/[slug]`
- 转化页：`/join`（机构生态共建）、`/working-groups/cybersecurity/join`（网安组参与/合作）、`/privacy`。两个入口的 CTA 共用同一张飞书问卷。
- SEO：`/sitemap.xml`、`/robots.txt`

公开静态路由集中在 `src/config/site.ts` 的 `PUBLIC_STATIC_ROUTES`，`sitemap.ts` 与导航均从此派生，避免不一致。

## 内容与申请入口维护

- **站点级配置**：`src/config/site.ts`（站点名、导航、公开路由、`APPLICATION_TARGET` 单一申请目标）。
- **业务内容**：`src/content/*.ts`，按领域拆分，开发者直接维护，无需 CMS。
- **申请外链**：机构入口与网安组入口共用同一张飞书问卷，通过单个环境变量注入，仅接受 HTTPS：
  - `NEXT_PUBLIC_APPLICATION_URL`（问卷须外部/匿名可填）
  未配置或非法时页面安全降级为不可点击状态并给出联系回退，**不产生死链**。
- 这些 `NEXT_PUBLIC_*` 变量在**构建时**写入静态页；生产 Docker 镜像必须通过 `--build-arg` 传入（详见 README「内容与申请入口维护」）。

## 常用命令

```bash
pnpm dev             # 开发服务器（http://localhost:3000）
pnpm build           # 生产构建
pnpm typecheck       # 类型检查
pnpm lint            # ESLint
pnpm test            # 单元测试
pnpm test:e2e        # Playwright E2E（默认隔离在 127.0.0.1:3100）
```

## 架构演进（重要）

一期开发早期方案曾包含 **Payload CMS + PostgreSQL**，后于 **PR #4** 移除，收敛为当前纯静态架构。`docs/dev/alliance-website-v1/` 下的 SDD 规划文档为该演进的**历史记录**，其中涉及 Payload / 数据库的内容仅作留存，不代表当前架构（各文档顶部均有「更新补记」声明）。

## 部署要点

生产使用 Docker 构建 Next.js standalone 镜像。上线前需完成：正式域名与 301 跳转、ICP 备案与 HTTPS/WAF、正式 Logo 与成员/新闻授权材料、两份飞书表单正式 URL、联系人与备案号。详见 README「部署说明」。

## 延伸阅读

- [`README.md`](../README.md) — 上手、命令、环境变量、部署
- [`CONTRIBUTING.md`](../CONTRIBUTING.md) — 协作与提交约定
- [`docs/README.md`](./README.md) — 文档目录索引
- [`docs/dev/alliance-website-v1/`](./dev/alliance-website-v1/) — 一期 SDD 历史规划文档
