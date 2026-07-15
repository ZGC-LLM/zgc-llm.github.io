# 中关村自主大模型产业联盟官网

中关村自主大模型产业联盟（ZGCLLM）官方网站工程。正式主域名为
[`www.zgcllm.org.cn`](https://www.zgcllm.org.cn)，`zgcllm.cn` 和 `zgcllm.net` 作为品牌保护域名，
上线时统一 301 跳转到主域名。

## 首期范围

- 联盟介绍
- 加入联盟申请
- 工作组介绍
- 工作组成员列表
- 加入工作组申请
- 新闻板块

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
pnpm test:int        # Payload 集成测试，需要 PostgreSQL
pnpm test:e2e        # Playwright 端到端测试
pnpm generate:types  # 根据 Payload 配置生成类型
```

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
- 生产密钥和数据库凭据通过部署平台注入，不写入仓库。
