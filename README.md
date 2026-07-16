# 中关村自主大模型产业联盟官网

中关村自主大模型产业联盟（ZGCLLM）官方网站工程。正式主域名为
[`www.zgcllm.org.cn`](https://www.zgcllm.org.cn)，`zgcllm.cn` 和 `zgcllm.net` 作为品牌保护域名，
上线时统一 301 跳转到主域名。

## 首期范围

- 联盟介绍与工作组/重点专项
- 厂商中立的网络安全生态专题
- 机构生态共建与专业用户双申请路径
- 成员伙伴与新闻动态
- 隐私说明、基础 SEO、sitemap 与 robots

一期公开内容来自仓库内的类型化配置，不依赖 Payload 数据库。Payload CMS、PostgreSQL、管理后台与 API 基础仍然保留，供后续能力演进使用。

## 技术栈

- Next.js 16（App Router）与 React 19
- Payload CMS 3（内容管理、权限与后续审核流程）
- PostgreSQL 16
- TypeScript、Tailwind CSS 4
- Vitest、Playwright、ESLint、Prettier
- Docker Compose、GitHub Actions

## 本地开发

要求 Node.js 22、pnpm 11 和 Docker。

```bash
cp .env.example .env
docker compose up postgres -d
pnpm install
pnpm dev
```

访问：

- 官网：`http://localhost:3000`
- Payload 后台：`http://localhost:3000/admin`

首次进入后台时创建管理员账号。生产环境必须将 `PAYLOAD_SECRET` 替换为至少 32 位的随机密钥。

## 常用命令

```bash
pnpm dev             # 启动开发服务器
pnpm build           # 生产构建
pnpm typecheck       # TypeScript 类型检查
pnpm lint            # ESLint 检查
pnpm test            # 无外部依赖的单元测试
pnpm test:int        # Payload 集成测试，需要本机 zgcllm_test 数据库
pnpm test:e2e        # Playwright 端到端测试，需要本机 zgcllm_test 数据库
pnpm generate:types  # 根据 Payload 配置生成类型
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
  --build-arg NEXT_PUBLIC_SITE_URL=https://www.zgcllm.org.cn \
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
│   ├── (frontend)/  # 官网 App Router 页面与样式
│   └── (payload)/   # Payload 管理后台与 API
├── collections/     # Payload 数据集合
├── config/          # 站点级配置
└── payload.config.ts
tests/
├── unit/            # 单元测试
├── int/             # Payload 集成测试
└── e2e/             # 浏览器端到端测试
```

具体协作约定见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 部署说明

生产部署使用 Docker 构建 Next.js standalone 镜像，并连接托管 PostgreSQL 与对象存储。上线前需要完成：

- `www.zgcllm.org.cn` 指向正式服务，其他注册域名配置 HTTPS 301 跳转；
- ICP 备案、HTTPS 证书、WAF、备份与日志脱敏；
- 申请表隐私告知、明确同意、附件权限和数据保留策略；
- 正式联盟 Logo、成员名单、新闻材料及公开授权确认；
- 两份飞书表单 URL、联系人、ICP备案号和合规文案；
- 生产密钥和数据库凭据通过部署平台注入，不写入仓库。

测试种子脚本只接受 `test.env` 中显式配置的本机 `_test` 数据库，拒绝连接其他数据库。
