# Docker standalone 部署

Docker 是 GitHub Pages 之外的自托管备选。镜像运行 Next.js standalone server，适合已有云主机、容器平台或反向代理的环境；它不改变正式 canonical 和保护域规则。

正式主路径和域名状态见 [GitHub Pages 与 DNS 部署](./deploy-pages-dns.md)。

## 构建契约

- builder 与 runner 基于 Node.js `22.23.1-alpine`。
- 依赖使用 pnpm，并以 frozen lockfile 安装。
- 默认 `pnpm build` 生成 standalone，不设置 `BUILD_TARGET=export`。
- `NEXT_PUBLIC_*` 在构建时写入产物，容器启动时修改不会更新页面。
- runner 使用非 root 用户，compose 丢弃全部 Linux capabilities，并启用 `no-new-privileges`。
- 容器在 3000 端口提供服务，并通过 `/` 执行 healthcheck。

## 公开构建变量

| 变量                                                | 用途                     | 未设置时                          |
| --------------------------------------------------- | ------------------------ | --------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                              | canonical 根地址         | 使用 `https://www.zgc-llm.org.cn` |
| `NEXT_PUBLIC_APPLICATION_URL`                       | 联盟申请                 | target 不可用                     |
| `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY`         | 网络安全工作组申请       | target 不可用                     |
| `NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM` | 网络安全人员开放计划申请 | target 不可用                     |

三个申请变量互相独立，且只接受代码中登记的 Feishu origin 和精确 path。任意 HTTPS 地址不会自动生效。表单未完成匿名提交、信息处理告知和回执核验时保持空值。

## 使用 compose

准备环境文件。不要在仓库中提交实际部署配置：

```bash
cp .env.example .env
```

保留 `NEXT_PUBLIC_SITE_URL=https://www.zgc-llm.org.cn`。三个申请变量默认为空；只有逐项核验完成后才在部署环境中写入对应公开 URL。

检查并启动：

```bash
docker compose -f docker-compose.prod.yml config
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
curl --fail --silent --show-error --head http://127.0.0.1:3000/
```

查看健康状态和日志：

```bash
docker inspect --format '{{json .State.Health}}' zgcllm-website-web-1
docker compose -f docker-compose.prod.yml logs --no-log-prefix web
```

实际容器名可能受 compose project name 影响，先以 `docker compose ps` 的结果为准。

## 使用 `docker build`

默认关闭三个外部申请 target：

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://www.zgc-llm.org.cn \
  --build-arg NEXT_PUBLIC_APPLICATION_URL= \
  --build-arg NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY= \
  --build-arg NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM= \
  -t zgcllm:latest \
  .

docker run -d \
  --name zgcllm \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  zgcllm:latest
```

核验后的表单 URL 通过对应 `--build-arg` 传入。它们公开可见，不应放入 secret manager 后期待运行期注入生效；如果 secret manager 只在容器启动时提供值，必须改为构建阶段读取。

## 反向代理与域名

容器只提供内部 HTTP 服务。生产环境由 Nginx、Caddy、云负载均衡或入口控制器负责 TLS、转发和访问日志策略。

正式域名：

```caddyfile
www.zgc-llm.org.cn {
    reverse_proxy 127.0.0.1:3000
}
```

以下域名必须分别取得有效 TLS，并精确 301 到 `https://www.zgc-llm.org.cn`：

- `zgc-llm.org.cn`
- `zgc-llm.cn`
- `zgc-llm.net`
- `zgcllm.org.cn`
- `zgcllm.cn`
- `zgcllm.net`

防御域不运行独立站点，不生成自己的 canonical。反向代理还应保留真实协议和 host 转发头，并按运营与合规要求处理访问日志；不要在文档中承诺未配置的 WAF、日志保留期或数据处理措施。

## 验证

构建后至少检查：

```bash
docker image inspect zgcllm:latest
docker inspect --format '{{.Config.User}}' zgcllm:latest
curl --fail --silent --show-error http://127.0.0.1:3000/ > /dev/null
curl --fail --silent --show-error http://127.0.0.1:3000/robots.txt
curl --fail --silent --show-error http://127.0.0.1:3000/sitemap.xml
```

页面验收还应确认：

- canonical、hreflang、Open Graph 和 sitemap 只使用 `www.zgc-llm.org.cn`；
- 三个申请 target 在空变量时都不可点击；
- 只启用一个变量时，其他两个仍保持关闭；
- 容器以非 root 用户运行，healthcheck 变为 healthy；
- 停止信号可在 `stop_grace_period` 内完成；
- 正式域名和全部备用域的 TLS/301 由外部入口实测通过。

镜像大小、运行内存和性能必须附测量命令、平台与日期。当前没有可复现基线，因此不在本指南承诺固定数字。
