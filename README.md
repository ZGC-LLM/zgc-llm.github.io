# 中关村自主大模型产业联盟官网

中关村自主大模型产业联盟（ZGCLLM）官方网站工程。正式主域名为
[`www.zgc-llm.org.cn`](https://www.zgc-llm.org.cn)，`zgc-llm.cn` 和 `zgc-llm.net` 作为品牌保护域名，
上线时统一 301 跳转到主域名。

## 首期范围

- 联盟介绍与工作组/重点专项
- 厂商中立的网络安全生态专题
- 机构生态共建与专业用户双申请路径
- 成员伙伴与新闻动态
- 隐私说明、基础 SEO、sitemap 与 robots

本站为纯静态展示官网，公开内容来自仓库内的类型化配置（`src/content/`），不含内容管理后台与数据库。加入申请通过飞书表单收集，官网不接收或保存申请数据。

## 技术栈

- Next.js 16（App Router）与 React 19
- TypeScript、Tailwind CSS 4
- Vitest、Playwright、ESLint、Prettier
- Docker、GitHub Actions

## 本地开发

要求 Node.js 22 和 pnpm 11。

```bash
cp .env.example .env
pnpm install
pnpm dev
```

访问：`http://localhost:3000`

## 常用命令

```bash
pnpm dev             # 启动开发服务器
pnpm build           # 生产构建
pnpm typecheck       # TypeScript 类型检查
pnpm lint            # ESLint 检查
pnpm test            # 单元测试
pnpm test:e2e        # Playwright 端到端测试
```

Playwright 默认在隔离的 `127.0.0.1:3100` 启动测试站点，避免误复用开发中的 3000 端口。可通过 `E2E_PORT` 或 `E2E_BASE_URL` 覆盖。

设置 `E2E_BASE_URL` 时，Playwright 仅访问该外部目标，不再启动本地开发服务器。

## 内容与申请入口维护

- 站点名称、导航、公开路由和申请目标：`src/config/site.ts`
- 首页、联盟、专项、成员和新闻内容：`src/content/`
- 页面实现：`src/app/(frontend)/`
- 全局视觉 Token 与响应式规则：`src/app/(frontend)/styles.css`

两类飞书表单链接通过环境变量独立配置：

```bash
NEXT_PUBLIC_INSTITUTION_APPLICATION_URL=https://example.feishu.cn/share/base/form/...
NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL=https://example.feishu.cn/share/base/form/...
```

仅接受 HTTPS 地址。未配置或地址非法时，页面会显示不可点击状态和联系回退，不会产生死链。申请数据由飞书表单及飞书多维表格承接，官网不接收或保存申请数据。

这些公开环境变量会在 Next.js 构建时写入静态页面。构建生产 Docker 镜像时必须传入：

```bash
docker build \
  --build-arg NEXT_PUBLIC_INSTITUTION_APPLICATION_URL=https://example.feishu.cn/share/base/form/... \
  --build-arg NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL=https://example.feishu.cn/share/base/form/... \
  --build-arg NEXT_PUBLIC_SITE_URL=https://www.zgc-llm.org.cn \
  -t zgcllm-website .
```

仅在容器启动时注入上述变量不会改变已经静态生成的申请链接。

## 公开路由

- `/`、`/alliance`、`/working-groups`
- `/cybersecurity`、`/members`、`/news`、`/news/[slug]`
- `/join`、`/professionals`、`/privacy`
- `/sitemap.xml`、`/robots.txt`

## 项目结构

```text
src/
├── app/
│   ├── (frontend)/  # 官网 App Router 页面、布局、样式与 sitemap
│   └── robots.ts    # 根级 /robots.txt 生成
├── components/      # 站点 UI 组件
├── config/          # 站点级配置（site.ts）
├── content/         # 类型化的公开内容
└── types/           # 内容类型定义
tests/
├── unit/            # 单元与组件测试（Vitest）
├── e2e/             # 浏览器端到端测试（Playwright）
└── helpers/         # 测试辅助
```

`/sitemap.xml` 由 `src/app/(frontend)/sitemap.ts` 生成，`/robots.txt` 由 `src/app/robots.ts` 生成。

> 注：`src/app/my-route/` 为空的脚手架残留目录，未对应任何公开路由，可安全删除。

更多说明：项目总览见 [docs/overview.md](./docs/overview.md)，文档索引见 [docs/README.md](./docs/README.md)，协作约定见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 部署说明

生产部署使用 Docker 构建 Next.js standalone 镜像。上线前需要完成：

- `www.zgc-llm.org.cn` 指向正式服务，其他注册域名配置 HTTPS 301 跳转；
- ICP 备案、HTTPS 证书、WAF、访问日志脱敏；
- 申请页隐私告知与合规文案；个人信息收集、同意与保留由飞书表单侧承担；
- 正式联盟 Logo、成员名单、新闻材料及公开授权确认；
- 两份飞书表单 URL、联系人、ICP 备案号和合规文案；
- 生产环境变量通过部署平台注入，不写入仓库。
