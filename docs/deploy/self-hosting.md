# 自托管部署指南（Docker + 自动 HTTPS）

本指南面向熟悉 Docker 的运维/技术人员，在自己的单机或 VPS 上自托管中关村自主大模型产业联盟官网，通过**本地构建 + 一条命令**起站，并由 [Caddy](https://caddyserver.com/) 自动为你的域名签发 HTTPS 证书。

> 本指南仅覆盖 **Docker 自托管**路径。仓库同时通过 GitHub Pages 发布官方站点（见 [README](../../README.md)），二者互不影响。

---

## 0. 为什么必须本地构建（重要）

站点用 Next.js `output: 'standalone'` 构建，`NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_APPLICATION_URL*` 等公开变量会在 `pnpm build` 时**烘焙进产物**，影响 `canonical`、`sitemap` 与飞书问卷链接。

因此本方案**不发布预构建镜像**——用你自己的域名时，这些值必须在你的机器上构建时注入才正确。

> ⚠️ **换域名 / 改公开链接后，必须带 `--build` 重新构建**。仅改 `.env` 不重建对已烘焙的 `NEXT_PUBLIC_*` 无效。

---

## 1. 前提条件

- **Docker Engine 24+** 与 **Docker Compose v2**（`docker compose version` 可用）。
- 一个你拥有的**域名**，其 A/AAAA 记录已解析到本机公网 IP。
- 本机放行 **80 与 443** 端口（Caddy 签发证书 + 对外服务都需要）：
  - 云服务器需在安全组/防火墙同时放行 80、443（TCP，443 建议同时放行 UDP 以启用 HTTP/3）。
  - 本机 80/443 不能被其他进程（如已有 Nginx）占用。
- 已 `git clone` 本仓库到本机。

---

## 2. 配置 `.env`

从模板复制并按需填写：

```bash
cp .env.example .env
```

自托管必填/关注项：

| 变量 | 类型 | 说明 |
|------|------|------|
| `NEXT_PUBLIC_SITE_URL` | 构建时 | 站点对外完整 URL，**含协议**，如 `https://example.com`。烘焙进 canonical/sitemap。 |
| `SITE_DOMAIN` | 运行时 | 对外服务域名，**不含协议**，如 `example.com`。Caddy 据此签发证书。 |
| `ACME_EMAIL` | 运行时 | 你的邮箱，用于 Let's Encrypt 证书到期/异常通知。 |
| `NEXT_PUBLIC_APPLICATION_URL*` | 构建时 | 可选。飞书问卷外链，留空则用仓库内置默认值。 |

> **一致性要求**：`NEXT_PUBLIC_SITE_URL` 的域名部分应与 `SITE_DOMAIN` 一致。
> 例：`NEXT_PUBLIC_SITE_URL=https://example.com` ↔ `SITE_DOMAIN=example.com`。

示例 `.env` 片段：

```bash
NEXT_PUBLIC_SITE_URL=https://example.com
SITE_DOMAIN=example.com
ACME_EMAIL=admin@example.com
```

---

## 3. 本地构建 + 一键启动

在仓库根目录执行：

```bash
docker compose -f docker-compose.caddy.yml up -d --build
```

该命令会：

1. 用你的 `.env` 中 `NEXT_PUBLIC_*` 作为构建参数，本地构建 web 镜像（`zgcllm:latest`）；
2. 启动 `web`（standalone Node 服务，仅 compose 内网可达）与 `caddy`（对外 80/443）；
3. `caddy` 等待 `web` 进入 healthy 后再对外提供服务。

查看状态：

```bash
docker compose -f docker-compose.caddy.yml ps
```

`web` 显示 `healthy` 即表示服务就绪。

---

## 4. HTTPS 与域名

- Caddy 首次启动会依据 `SITE_DOMAIN` 自动向 Let's Encrypt 申请证书，并**自动将 HTTP(80) 跳转到 HTTPS(443)**，无需手动配置。
- 证书与账户数据持久化在命名卷 `caddy_data` / `caddy_config`，重建容器不会丢失，避免频繁重签触发 Let's Encrypt 限流。

确认证书签发成功：

```bash
docker compose -f docker-compose.caddy.yml logs caddy | grep -i "certificate obtained"
```

看到类似 `certificate obtained successfully` 且浏览器访问 `https://<你的域名>` 显示有效证书，即签发成功。

---

## 5. 升级

```bash
git pull
docker compose -f docker-compose.caddy.yml up -d --build
```

> ⚠️ 只要改动了域名或任何 `NEXT_PUBLIC_*`（构建时烘焙值），**必须带 `--build`** 才能生效。仅 `git pull` 不加 `--build` 不会重新烘焙。

停止 / 清理：

```bash
docker compose -f docker-compose.caddy.yml down          # 停止并移除容器（保留证书卷）
docker compose -f docker-compose.caddy.yml down -v       # 连同 caddy_data 卷一并删除（会导致重签）
```

---

## 6. 故障排查

**证书签发失败 / 一直是自签或无证书**

- 确认域名 A/AAAA 记录已正确解析到本机公网 IP：`dig +short <你的域名>`。
- 确认公网可达本机 80、443，未被云安全组/防火墙拦截，且本机端口未被占用。
- 查看 Caddy 日志定位 ACME 错误：

  ```bash
  docker compose -f docker-compose.caddy.yml logs -f caddy
  ```

- Let's Encrypt 有速率限制：短时间反复重建 + 删卷（`down -v`）可能触发限流，排障期可用 staging 环境或减少重试。

**web 容器不健康 / 502**

- 查看 web 日志：

  ```bash
  docker compose -f docker-compose.caddy.yml logs -f web
  ```

- 健康检查：Dockerfile 内置 `HEALTHCHECK` 每 30s 探测 `http://127.0.0.1:3000/`。`docker compose ps` 中 `web` 应为 `healthy`；若长期 `starting`/`unhealthy`，多为构建产物异常或端口配置问题。

**改了域名却没生效**

- 检查是否遗漏 `--build`（见 §5）。构建时烘焙值只能通过重建更新。

---

## 附：与 `docker-compose.prod.yml` 的区别

| 文件 | 用途 |
|------|------|
| `docker-compose.caddy.yml` | 自托管全栈：本地构建 web + Caddy 自动 HTTPS，对外 80/443。**本指南主路径。** |
| `docker-compose.prod.yml` | 仅本地构建 web 并绑定 `127.0.0.1:3000`，供你**自带网关**（Nginx/Traefik 等）反代的场景。不含 HTTPS。 |

两者是并列的两条路径，按你的场景二选一即可。
