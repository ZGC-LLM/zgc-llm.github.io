---
feature: docker-deploy-kit
complexity: standard
generated_by: clarify
generated_at: 2026-08-04T00:00:00+08:00
version: 1
---

# 需求文档: Docker 可交付自托管部署包

## 1. 概述

**一句话描述**：把仓库现有的 Docker 基建（`Dockerfile` + `docker-compose.yml` + `docker-compose.prod.yml`）打磨成一套「可交付的自托管部署包」，让外部运维/技术用户拿到源码后，在自己的机器/VPS 上通过本地构建 + 一条命令即可起站，并由 Caddy 自动为其域名签发 HTTPS 证书。

**核心价值**：降低外部自托管门槛，把「已有但零散」的 Docker 资产收敛为一条清晰、可复现、带自动 HTTPS 的部署路径，并配套独立部署指南。

**目标用户**：熟悉 Docker 的运维/技术人员（能自行准备域名、开放端口、执行 `docker compose`），在单机/VPS 上自托管本官网。

## 2. 需求与用户故事

| 编号 | 用户故事 | 验收标准 |
|------|----------|----------|
| R1 | 作为自托管用户，我希望用**本地构建**方式部署，这样用我自己的域名时 `NEXT_PUBLIC_SITE_URL` 等构建时烘焙值才正确 | 提供以 `context: .` 本地构建为主路径的生产 compose；域名/公开链接经构建参数注入；不依赖任何预构建远程镜像 |
| R2 | 作为自托管用户，我希望**一条命令**就能起站 | 文档给出单条 `docker compose ... up -d --build` 入口（或等价轻量脚本）；执行后容器进入 healthy 状态 |
| R3 | 作为自托管用户，我希望站点能**自动 HTTPS 对外服务** | 交付 `Caddyfile` + 含 Caddy 的 compose 编排；用户仅需在 `.env` 填域名与邮箱，Caddy 自动向 Let's Encrypt 申请/续签证书并反代到 web 容器 |
| R4 | 作为自托管用户，我希望有清晰的**环境变量模板与说明** | 在现有 `.env.example` 基础上补齐自托管所需变量（`NEXT_PUBLIC_SITE_URL`、域名、ACME 邮箱等），每项含注释说明「构建时/运行时、是否必填、默认值」 |
| R5 | 作为自托管用户，我希望有一份**独立部署指南**覆盖全流程 | `docs/deploy/` 下新增中文单语指南，覆盖：前提条件 → 配置 `.env` → 本地构建 → 一键启动 → HTTPS/域名 → 升级 → 故障排查 |
| R6 | 作为自托管用户，我希望能感知服务健康与失败 | 复用/校验现有 `HEALTHCHECK`；文档说明如何查看容器与 Caddy 日志、如何判断证书签发成功 |

## 3. 功能验收清单

- [ ] 存在以本地构建为主路径的生产编排（Caddy + web），可 `docker compose ... up -d --build` 一键启动
- [ ] `Caddyfile` 依据 `.env` 中的域名/邮箱自动签发并反代 HTTPS，HTTP 自动跳转 HTTPS
- [ ] `.env` 模板（自托管版）列全必填/可选变量并逐项注释，明确「构建时烘焙 vs 运行时」
- [ ] `NEXT_PUBLIC_SITE_URL` 等构建时值经构建参数正确注入，用户自有域名下 canonical/sitemap/问卷链接正确
- [ ] `docs/deploy/` 部署指南（中文单语）完整覆盖 §2 R5 的全部环节，命令可复制粘贴执行
- [ ] web 容器进入 healthy 状态；文档说明健康检查与日志查看方式
- [ ] 沿用现有安全加固（非 root、`no-new-privileges`、`cap_drop: ALL`、`restart: unless-stopped`）不被削弱
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm build` 全绿；不破坏 GitHub Pages 部署（`deploy-pages.yml`）与静态导出路径

## 4. 技术约束

- **构建时烘焙约束（核心）**：`NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_APPLICATION_URL*` 在 `pnpm build` 时烘焙进产物，影响 canonical、sitemap、飞书问卷链接。自托管用户换域名**必须本地重建**，这是选择「本地构建分发」而非预构建镜像的根本原因。
- **技术栈**：Next.js 16 `output: 'standalone'`（`next.config.ts`），Node 22 Alpine，pnpm 11，产物 `node server.js`，端口 3000。
- **反代选型**：Caddy（自动 ACME/Let's Encrypt），配置最简，最契合「填域名即用」。需处理 ACME 证书持久化（挂载 volume）与 HTTP→HTTPS 跳转。
- **域名规范**：canonical 与对外服务统一用带连字符主域名 `www.zgc-llm.org.cn`（见 CLAUDE.md「域名」），但自托管用户使用**自有域名**，模板需以变量形式呈现，不硬编码官方域名为强制值。
- **集成点**：Caddy ↔ web 服务网络；构建参数 ↔ `.env`；现有 `HEALTHCHECK`；现有 `.dockerignore`。
- **兼容性**：改动不得影响 GitHub Pages 静态部署与 CI（`ci.yml` / `deploy-pages.yml`），Docker 部署与静态导出为并行两条路径。
- **文档语言**：中文单语（自托管指南受众可控，双语维护成本翻倍，本期不做）。

## 5. 排除项

- ❌ 不发布 GHCR/Docker Hub 预构建镜像（受构建时烘焙约束，预构建镜像的 SITE_URL 会失配）。
- ❌ 不引入数据库、内容后台或任何服务端持久化——站点纯静态展示性质不变。
- ❌ 不做多副本/编排集群（k8s、Swarm）方案；仅面向单机/单 VPS 自托管。
- ❌ 不做部署文档的英文版（本期中文单语）。
- ❌ 不改动站点业务内容/页面逻辑。
- ❌ 不接管用户已有的 Nginx/Traefik 网关（如用户自带网关，Caddy 方案为可替换项，非强绑定）。

## 6. 风险与依赖

| 风险/依赖 | 说明 | 缓解 |
|-----------|------|------|
| 构建时烘焙误解 | 用户误以为改 `.env` 后无需重建即可换域名 | 文档在显要位置强调「换域名必须 `--build` 重建」 |
| ACME 证书签发失败 | 域名未解析到主机、80/443 被占用或防火墙拦截，导致 Caddy 签证失败 | 前提条件章节列明 DNS/端口要求；故障排查给出 Caddy 日志排查步骤 |
| 证书未持久化 | Caddy 数据未挂载 volume，重建后频繁重签触发限流 | compose 为 Caddy 配置 `caddy_data` / `caddy_config` 持久化卷 |
| 现有 compose 语义变更 | 增补编排可能影响现有 `docker-compose.prod.yml` 使用者 | 优先新增独立编排文件或 profile，不破坏现有 127.0.0.1 绑定用法 |
| 提交前门禁 | 依赖 `pnpm typecheck && lint && test && build` 通过（CLAUDE.md 要求） | 实施后跑全套门禁；注意 E2E 不在 `pnpm test` 内 |

## 7. 下一步

- 复杂度评为 **standard**，建议进入 SDD 流程细化设计与任务拆分：
  - `会话2: /devagent:dev-spec-dev docker-deploy-kit --skip-requirements`
- 设计阶段需重点决策：Caddy 编排采用「新增 `docker-compose.caddy.yml`」还是「在 `docker-compose.prod.yml` 增补 profile」；一键入口用纯 compose 命令还是配轻量脚本。
- 实施后执行提交前门禁：`pnpm typecheck && pnpm lint && pnpm test && pnpm build`，并人工验证一次「本地构建 → 起站 → 本地/自签域名 HTTPS」闭环。
