---
feature: docker-deploy-kit
complexity: standard
generated_by: dev-spec-dev
generated_at: 2026-08-04T00:00:00+08:00
version: 1
based_on: docker-deploy-kit-design.md
execution: batch
parallel: auto
---

# 任务拆分: Docker 可交付自托管部署包

## 任务概览

| ID | 任务 | 复杂度 | 依赖 | 变更规模 |
|----|------|--------|------|----------|
| T1 | 新增 `Caddyfile`（自动 HTTPS 反代配置）| simple | — | 微小 |
| T2 | 新增 `docker-compose.caddy.yml`（自包含生产+HTTPS 编排）| standard | — | 小 |
| T3 | 增补 `.env.example`（自托管变量 + 构建时/运行时注释）| simple | — | 微小 |
| T4 | 编写 `docs/deploy/self-hosting.md`（中文部署指南）| standard | T1, T2, T3 | 中等 |
| T5 | `README.md` 增补自托管指南指针 | simple | T4 | 微小 |
| T6 | 提交前门禁验证（typecheck/lint/test/build）| simple | T1–T5 | — |

T1、T2、T3 无相互依赖，可并行；T4 汇总三者内容；T5 指向 T4；T6 收口。

---

## T1: 新增 Caddyfile

- **复杂度**: simple
- **provides**: `Caddyfile`
- **consumes**: —
- **描述**: 创建仓库根目录 `Caddyfile`，全局块注入 `{$ACME_EMAIL}`，具名站点 `{$SITE_DOMAIN}` 启用 `encode zstd gzip` 并 `reverse_proxy web:3000`（依赖 Caddy 默认自动 ACME 与 HTTP→HTTPS 跳转）。
- **验收**:
  - [ ] Caddyfile 使用环境占位符，不硬编码任何域名/邮箱
  - [ ] 反代目标为 compose 内网服务名 `web:3000`
  - [ ] `docker run --rm -v $PWD/Caddyfile:/etc/caddy/Caddyfile caddy:2-alpine caddy validate --config /etc/caddy/Caddyfile`（占位符缺省下）语法可解析（如本地有 docker 则验证，否则文档记录）

## T2: 新增 docker-compose.caddy.yml

- **复杂度**: standard
- **provides**: `docker-compose.caddy.yml`
- **consumes**: `Dockerfile`, `Caddyfile`
- **描述**: 按设计 §3.2 创建自包含编排：`web`（`build.context: .`，构建参数对齐 prod.yml，`NEXT_PUBLIC_SITE_URL` 用 `:?` 必填，`expose: 3000` 不发布主机端口，保留 `init`/`no-new-privileges`/`cap_drop: ALL`/`restart`/`stop_grace_period`）；`caddy`（`caddy:2-alpine`，发布 80/443 + 443/udp，`depends_on web service_healthy`，注入 `SITE_DOMAIN`/`ACME_EMAIL`，挂载 `./Caddyfile:ro` + `caddy_data`/`caddy_config` 命名卷，`no-new-privileges`）；顶层 `volumes` 声明两卷。
- **验收**:
  - [ ] `docker compose -f docker-compose.caddy.yml config` 解析通过（本地有 docker 时验证）
  - [ ] web 不发布主机端口（仅 `expose`），对外仅 caddy 的 80/443
  - [ ] 现有安全加固项齐全，未削弱
  - [ ] 未改动 `docker-compose.prod.yml`

## T3: 增补 .env.example

- **复杂度**: simple
- **provides**: —（编辑现有文件）
- **consumes**: —
- **must_not_create**: `.env`
- **描述**: 按设计 §3.3 增补 `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM`、`SITE_DOMAIN`、`ACME_EMAIL`，并用分组注释区分「构建时烘焙 / 运行时」，逐项标注必填/可选/默认值；保留现有变量。
- **验收**:
  - [ ] 构建时与运行时变量分组、注释清晰
  - [ ] 明确 `NEXT_PUBLIC_SITE_URL` 与 `SITE_DOMAIN` 的关系（域名部分应一致）
  - [ ] 不含任何真实密钥/凭证，仅占位示例

## T4: 编写 docs/deploy/self-hosting.md

- **复杂度**: standard
- **provides**: `docs/deploy/self-hosting.md`
- **consumes**: `Caddyfile`, `docker-compose.caddy.yml`, `.env.example`
- **描述**: 中文单语指南，覆盖设计 §3.4 六章节（前提条件 → 配置 `.env` → 本地构建+一键启动 → HTTPS/域名 → 升级 → 故障排查），命令可复制粘贴，显要处强调「换域名必须 `--build` 重建」。
- **验收**:
  - [ ] 覆盖 requirements R5 全部环节
  - [ ] 所有命令与实际交付文件名/变量名一致（`docker-compose.caddy.yml`、`SITE_DOMAIN` 等）
  - [ ] 至少两处强调构建时烘焙重建约束
  - [ ] 故障排查含 `docker compose ... logs caddy` 与证书签发判读

## T5: README.md 增补指针

- **复杂度**: simple
- **provides**: —（编辑现有文件）
- **consumes**: `docs/deploy/self-hosting.md`
- **描述**: 在 README 部署相关处新增一行/一小节，链接到 `docs/deploy/self-hosting.md`，一句话说明「Docker 自托管 + 自动 HTTPS」，不重复正文。
- **验收**:
  - [ ] README 含指向部署指南的有效相对链接
  - [ ] 不与现有 Pages 部署说明冲突

## T6: 提交前门禁验证

- **复杂度**: simple
- **provides**: —
- **consumes**: 全部
- **描述**: 运行 `pnpm typecheck && pnpm lint && pnpm test && pnpm build` 确认全绿（本次仅新增配置/文档，不应破坏构建）；确认未触碰 `BUILD_TARGET`，Pages 路径不受影响。
- **验收**:
  - [ ] 四项门禁全绿
  - [ ] 无对 `deploy-pages.yml` / `ci.yml` / 站点业务代码的改动
