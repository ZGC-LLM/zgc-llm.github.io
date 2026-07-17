---
feature: launch-readiness-ghpages
complexity: complex
generated_by: clarify
generated_at: 2026-07-17T00:00:00+08:00
version: 1
---

# 需求文档: 上线就绪度收尾（GitHub Pages）

> **更新补记（2026-07-17）**：本文件为该轮上线收尾的历史规划记录。正式主域名已统一为带连字符的 `www.zgc-llm.org.cn`（CNAME 同步更正）。文中域名表述已随之更正，但**现行事实以 [CLAUDE.md](../../../CLAUDE.md) 与 [README.md](../../../README.md) 为准**，本历史文档不作为配置源。

## 1. 概述

- **一句话**：把 `Clouditera/zgcllm` 官网收尾到「可发布到 GitHub Pages（自定义域名，CNAME）」的干净可发布状态，并开 PR 到 main。
- **核心价值**：让仓库上线不出洋相——静态导出就绪、部署配置到位、散落产物归位、下线的内容彻底清理。
- **目标用户**：联盟官网访客；维护者（发布者）。

## 2. 需求与用户故事

| # | 需求 | 验收标准 |
|---|------|---------|
| R1 | Next.js 迁移到静态导出 | `next.config` 改为 `output: 'export'`；`pnpm build` 产出 `out/` 且成功 |
| R2 | 动态路由静态化 | `news/[slug]` 补 `generateStaticParams`，导出无报错 |
| R3 | 图片导出兼容 | `images.unoptimized: true`；`next/image` 页面（members）正常渲染 |
| R4 | GitHub Pages 部署 | 新增 Pages 部署 workflow；`.nojekyll`；`CNAME`=www.zgc-llm.org.cn |
| R5 | 接入 logo | `public/brand/llm-alliance-logo.png` 提交并在页面（页头/品牌处）引用 |
| R6 | 下线「个人专业用户加入」 | 删除 `/professionals` 页；移除 site.ts/页头×2/页脚/首页/cybersecurity×2 全部入口，无死链 |
| R7 | 就绪度检查 | favicon/OG/meta/404 存在且正确；lint/typecheck/unit/e2e 绿灯 |
| R8 | 收尾交付 | 在 `feat/homepage-alliance-copy` 收尾并开 PR 到 main |

## 3. 功能验收清单

- [ ] `pnpm build` 静态导出成功，产出 `out/`
- [ ] `pnpm typecheck` / `pnpm lint` / `pnpm test`（unit）/ `pnpm test:e2e` 全绿
- [ ] 全站无指向 `/professionals` 的死链
- [ ] logo 已提交并在页面正确显示
- [ ] Pages 部署 workflow + `.nojekyll` + `CNAME` 就位
- [ ] 404 页、favicon、OG 图正常

## 4. 技术约束

- Next.js 16 / React 19 / Tailwind v4 / pnpm。
- **双部署形态并存**：一套代码同时支持 (a) GitHub Pages 静态导出 与 (b) Docker/standalone SSR。通过 `BUILD_TARGET` 环境变量在 `next.config` 内切换 `output`（`export` vs `standalone`）与 `images.unoptimized`。
- GitHub Pages：自定义域名 `www.zgc-llm.org.cn`（CNAME），**无 basePath**（根路径）；`BUILD_TARGET=export`。
- Docker：保持默认 `standalone`，保留 SSR / 服务端图片优化 / 动态渲染。
- `news/[slug]` 补 `generateStaticParams`：export 时预渲染，standalone 时不受影响。
- 现有 CI（`.github/ci.yml`）保持质量门；新增独立的 Pages 部署 workflow。

## 5. 排除项

- 不做「个人/专业用户加入」相关任何功能与文案（本次彻底下线 `/professionals`）。
- 不改动业务文案（除移除入口所必须）。
- **不删除 Docker 部署形态**（Dockerfile/docker-compose 为受支持的容器部署方式，予以保留）。

## 6. 风险与依赖

| 风险/依赖 | 说明 | 缓解 |
|-----------|------|------|
| `output` 单值不能同时 export+standalone | 两种部署互斥 | 用 `BUILD_TARGET` 环境变量在 config 内条件切换 |
| export 破坏动态特性 | dynamic route、image、globalNotFound 可能不兼容 export | 补 `generateStaticParams`；export 分支设 `images.unoptimized`；验证 `experimental.globalNotFound` |
| 两形态需分别验证 | export 与 standalone 行为差异 | `BUILD_TARGET=export pnpm build`（out/）与默认 `pnpm build`（standalone）各验证一次 |
| DNS/CNAME 需仓库外配置 | 域名解析非代码可控 | 代码侧放 CNAME 文件，DNS 由维护者配置 |

## 7. 下一步

进入实施：配置静态导出 → 静态化动态路由 → Pages 部署配置 → 接入 logo → 下线 professionals → 就绪度检查与全绿 → 开 PR。
