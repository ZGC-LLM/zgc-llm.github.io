# 容器化部署（Docker / standalone SSR）

本站支持双部署形态。GitHub Pages（静态导出）需付费套餐支持私有仓库 Pages；**本文档提供绕开 Pages 的自主容器部署方案**，把站点作为 Next.js standalone SSR 容器运行在你们自己的服务器/云主机上。

## 前置

- 目标机器可访问公网（构建期需从 npm/Alpine 拉包）。
- 安装 Docker（含 compose 插件）。

## 一、快速启动（docker compose）

```bash
# 1) 构建（把公开变量在构建期注入 —— 这些是 NEXT_PUBLIC_*，会烘焙进产物）
NEXT_PUBLIC_SITE_URL=https://www.zgc-llm.org.cn \
NEXT_PUBLIC_INSTITUTION_APPLICATION_URL=<机构申请飞书表单URL> \
NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL=<专业用户申请飞书表单URL> \
docker compose -f docker-compose.prod.yml build

# 2) 启动（后台，自动重启）
docker compose -f docker-compose.prod.yml up -d

# 站点监听容器 3000 → 宿主 3000
curl -I http://127.0.0.1:3000/
```

未传申请表单 URL 时，页面 CTA 会优雅降级为「申请通道准备中」提示，不影响其余功能。

## 二、纯 docker 命令（等价）

```bash
docker build -t zgcllm:latest \
  --build-arg NEXT_PUBLIC_SITE_URL=https://www.zgc-llm.org.cn \
  --build-arg NEXT_PUBLIC_INSTITUTION_APPLICATION_URL=<...> \
  --build-arg NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL=<...> \
  .

docker run -d --name zgcllm -p 3000:3000 --restart unless-stopped zgcllm:latest
```

## 三、上线到自有域名

容器只负责在 3000 端口提供 SSR。生产上通常在前面加一层反向代理（Nginx/Caddy/云负载均衡）：

- 反代 `www.zgc-llm.org.cn` → `http://<容器宿主>:3000`
- 由反代终止 HTTPS（证书）。
- 品牌保护域名（`zgc-llm.cn` / `zgc-llm.net`）在反代层 301 跳主域名。

Caddy 示例（自动 HTTPS）：

```
www.zgc-llm.org.cn {
    reverse_proxy 127.0.0.1:3000
}
```

## 关键说明

- **`NEXT_PUBLIC_*` 是构建期变量**：会被编译进产物，运行期改这些值无效；改了必须重新 `build`。
- **镜像轻量**：约 197MB，运行时约 40MB 内存、CPU 近乎空载。
- **standalone vs export**：容器走默认 `standalone`（保留 SSR 与服务端 `sharp` 图片优化）；`BUILD_TARGET=export` 才是给 GitHub Pages 的静态导出，两者互不影响。
- **CI/CD 可选**：可在有公网的 CI runner 上 `docker build` 后推送镜像到你们的镜像仓库，再由服务器 `docker pull` 部署。
