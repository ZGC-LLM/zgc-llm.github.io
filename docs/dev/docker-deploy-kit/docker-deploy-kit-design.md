---
feature: docker-deploy-kit
complexity: standard
generated_by: dev-spec-dev
generated_at: 2026-08-04T00:00:00+08:00
version: 1
based_on: docker-deploy-kit-requirements.md
---

# 技术设计: Docker 可交付自托管部署包

## 1. 设计目标与范围

把仓库现有 Docker 资产（`Dockerfile` + `docker-compose.prod.yml`）收敛为一条「填域名即用、自动 HTTPS」的自托管路径，交付：

1. `Caddyfile` —— Caddy 自动 ACME 反向代理配置。
2. `docker-compose.caddy.yml` —— **自包含**的生产 + HTTPS 编排（web 本地构建 + Caddy 反代）。
3. `.env.example` 增补 —— 补齐自托管所需变量并逐项注释「构建时/运行时、必填/可选」。
4. `docs/deploy/self-hosting.md` —— 中文单语部署指南，覆盖 R5 全流程。
5. `README.md` 增补一处自托管指引指针。

**不改动**：站点业务代码、`Dockerfile`（复用现有多阶段构建与 `HEALTHCHECK`）、`docker-compose.prod.yml`（保留现有 `127.0.0.1` 绑定用法）、CI/Pages 工作流、静态导出路径。

## 2. 关键设计决策

### 决策 A：Caddy 编排采用「新增自包含 `docker-compose.caddy.yml`」

| 方案 | 说明 | 取舍 |
|------|------|------|
| **A1（选定）自包含新文件** | 新增 `docker-compose.caddy.yml`，内部定义 `web`（`build: context: .`，仅内网暴露不发布主机端口）+ `caddy`（发布 80/443）。用户一条 `docker compose -f docker-compose.caddy.yml up -d --build` 起全栈 | ✅ 现有 `docker-compose.prod.yml` 零改动；✅ 一条命令完整闭环；✅ web 不直接暴露主机端口，攻击面更小 |
| A2 在 prod.yml 加 profile | 在 `docker-compose.prod.yml` 增补 `caddy` profile + override web 端口绑定 | ❌ 需覆盖现有 `127.0.0.1:3000` 绑定，改动现有文件语义，违背「不破坏现有用法」风险项 |

**选定 A1**。理由：现有 `docker-compose.prod.yml`（localhost-only，供用户自带网关场景）与新 `docker-compose.caddy.yml`（自动 HTTPS 全栈）成为**两条并列、互不干扰**的路径，符合排除项「不接管用户已有网关（Caddy 为可替换项）」。

### 决策 B：一键入口用「纯 compose 命令」，不引入脚本

| 方案 | 取舍 |
|------|------|
| **B1（选定）纯 compose 命令** | 主入口 `docker compose -f docker-compose.caddy.yml up -d --build`，文档可复制粘贴；零额外维护面 |
| B2 附轻量脚本 | 额外 `deploy/*.sh`，需维护 + 处理跨平台/权限，边际收益低 |

**选定 B1**。requirements R2 明确「单条 compose 命令（或等价轻量脚本）」，纯命令已满足且更透明。

## 3. 组件设计

### 3.1 `Caddyfile`

```caddyfile
{$SITE_DOMAIN} {
	encode zstd gzip
	reverse_proxy web:3000
}
```

- 站点地址 `{$SITE_DOMAIN}` 与 ACME 邮箱经 compose 环境注入（`email` 由 compose 的 `CADDY_ACME_EMAIL`→Caddy global 或站点级配置提供，见 3.2 注入方式）。
- Caddy 默认对具名站点自动申请 Let's Encrypt 证书并**自动 HTTP→HTTPS 跳转**，无需显式写 80 段。
- `reverse_proxy web:3000` 指向 compose 内网服务名 `web` 的 3000 端口。
- ACME 账户邮箱通过 Caddy 全局选项注入：Caddyfile 顶部 `{ email {$ACME_EMAIL} }` 全局块。

最终结构：

```caddyfile
{
	email {$ACME_EMAIL}
}

{$SITE_DOMAIN} {
	encode zstd gzip
	reverse_proxy web:3000
}
```

### 3.2 `docker-compose.caddy.yml`

```yaml
services:
  web:
    build:
      context: .
      args:
        NEXT_PUBLIC_APPLICATION_URL: ${NEXT_PUBLIC_APPLICATION_URL:-}
        NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY: ${NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY:-}
        NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM: ${NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM:-}
        NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL:?SITE URL 必填，用于烘焙 canonical/sitemap}
    image: zgcllm:latest
    init: true
    restart: unless-stopped
    expose:
      - '3000'           # 仅 compose 内网暴露，不发布到主机
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    stop_grace_period: 15s

  caddy:
    image: caddy:2-alpine
    init: true
    restart: unless-stopped
    depends_on:
      web:
        condition: service_healthy
    ports:
      - '80:80'
      - '443:443'
      - '443:443/udp'    # HTTP/3
    environment:
      SITE_DOMAIN: ${SITE_DOMAIN:?对外域名必填}
      ACME_EMAIL: ${ACME_EMAIL:?ACME 邮箱必填}
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data      # 证书持久化，避免重签触发限流
      - caddy_config:/config
    security_opt:
      - no-new-privileges:true
    stop_grace_period: 15s

volumes:
  caddy_data:
  caddy_config:
```

设计要点：
- **web 复用现有 `Dockerfile`**（`build.context: .`），构建参数与 `docker-compose.prod.yml` 对齐；`NEXT_PUBLIC_SITE_URL` 用 `:?` 强约束必填（换域名必重建的护栏）。
- web 用 `expose` 而非 `ports`，**不发布主机端口**，仅 Caddy 可达 → 对外只有 80/443。
- `HEALTHCHECK` 继承自 Dockerfile；`caddy` 经 `depends_on: condition: service_healthy` 等 web 就绪。
- `caddy_data` 卷持久化证书（缓解「证书未持久化触发限流」风险）。
- caddy 未加 `cap_drop: ALL`（需绑定 80/443 特权端口能力，Caddy 官方镜像已以受控方式处理）；保留 `no-new-privileges`。
- 未硬编码官方域名，全部经 `.env` 变量注入。

### 3.3 `.env.example` 增补

在现有基础上补充并强化注释（区分构建时/运行时）：

```bash
# ── 构建时烘焙（build-time，改动后必须 --build 重建）──
# 站点对外完整 URL，烘焙进 canonical / sitemap / 问卷链接。自托管填你自己的 https 域名。
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APPLICATION_URL=
NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY=
NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM=

# ── 运行时（runtime，仅 docker-compose.caddy.yml 使用，改动无需重建 web）──
# 对外服务域名（不含协议），Caddy 据此自动签发 HTTPS。须已解析到本机且开放 80/443。
SITE_DOMAIN=example.com
# ACME/Let's Encrypt 账户邮箱，用于证书到期通知。
ACME_EMAIL=admin@example.com
```

> 注：`NEXT_PUBLIC_SITE_URL`（构建时）与 `SITE_DOMAIN`（运行时）是两个变量：前者烘焙进产物需带协议，后者供 Caddy 签证；自托管时二者域名部分应一致（`NEXT_PUBLIC_SITE_URL=https://$SITE_DOMAIN`）。指南会显式说明。

### 3.4 `docs/deploy/self-hosting.md`（中文单语）

章节结构（覆盖 R5）：
1. **前提条件** —— Docker/Compose 版本、域名已解析到本机、放行 80/443、构建时烘焙提示。
2. **配置 `.env`** —— 从 `.env.example` 复制，逐项填 `NEXT_PUBLIC_SITE_URL` / `SITE_DOMAIN` / `ACME_EMAIL`，强调二者一致。
3. **本地构建 + 一键启动** —— `docker compose -f docker-compose.caddy.yml up -d --build`。
4. **HTTPS / 域名** —— Caddy 自动签证说明、如何确认签发成功（`docker compose ... logs caddy`）。
5. **升级** —— `git pull` → 同一条 `up -d --build`（强调换域名/改公开链接必须 `--build`）。
6. **故障排查** —— 证书签发失败（DNS/端口/防火墙）、查看 web 与 caddy 日志、健康检查判读。

### 3.5 `README.md` 增补

在部署相关处新增一行指针，指向 `docs/deploy/self-hosting.md`（不重复正文）。

## 4. 数据流与集成点

```text
用户 .env ──build args──▶ Dockerfile(builder) ──烘焙 NEXT_PUBLIC_*──▶ standalone 产物
                                                                          │
用户 .env ──runtime env──▶ Caddy(SITE_DOMAIN/ACME_EMAIL) ──ACME──▶ Let's Encrypt
                                    │
外网 :80/:443 ──▶ Caddy ──reverse_proxy──▶ web:3000 (expose, HEALTHCHECK)
```

- 构建时：`.env` 的 `NEXT_PUBLIC_*` → compose `build.args` → Dockerfile `ARG/ENV` → `pnpm build` 烘焙。
- 运行时：`.env` 的 `SITE_DOMAIN`/`ACME_EMAIL` → caddy `environment` → Caddyfile 占位符。
- 网络：compose 默认 bridge 网络，Caddy 以服务名 `web` DNS 解析。

## 5. 安全与兼容性

- 沿用现有加固：web 保留 `no-new-privileges`、`cap_drop: ALL`、`restart: unless-stopped`、非 root（Dockerfile）、`init`。
- web 不再直接发布主机端口（较 prod.yml 的 `127.0.0.1:3000` 更收敛）。
- 不触碰 `BUILD_TARGET`，Docker 走 `standalone`，与 Pages 的 `export` 完全隔离；`deploy-pages.yml` / `ci.yml` 零影响。
- `.dockerignore` 已忽略 `.env`/`.env.*`（保留 `.env.example`），无需改动。

## 6. 验收对齐（对 §3 功能验收清单）

| 验收项 | 由哪些交付覆盖 |
|--------|----------------|
| 本地构建为主的生产编排、一键启动 | `docker-compose.caddy.yml`（3.2）+ 指南 §3 |
| Caddy 自动签发 + HTTP→HTTPS | `Caddyfile`（3.1）+ compose caddy 服务 |
| `.env` 模板列全并注释构建/运行时 | `.env.example`（3.3）+ 指南 §2 |
| 构建时值正确注入 | compose `build.args`（3.2）复用 Dockerfile ARG |
| 部署指南覆盖 R5 全环节 | `docs/deploy/self-hosting.md`（3.4）|
| healthy + 日志/健康说明 | 继承 HEALTHCHECK + 指南 §6 |
| 安全加固不削弱 | §5 |
| 提交前门禁全绿、不破坏 Pages | §5 + 任务 T6 跑 `typecheck/lint/test/build` |

## 7. 风险应对（承接需求 §6）

- 构建时烘焙误解 → 指南前提条件与升级章节双处强调「换域名必 `--build`」；compose 用 `:?` 让缺失即报错。
- ACME 失败 → 前提条件列 DNS/端口要求，故障排查给 `logs caddy` 步骤。
- 证书未持久化 → `caddy_data`/`caddy_config` 命名卷。
- 破坏现有 compose → 全部新增文件，`docker-compose.prod.yml` 零改动。
