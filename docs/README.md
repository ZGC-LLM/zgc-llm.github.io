# 文档目录

本目录汇总中关村自主大模型产业联盟官网工程的文档。快速上手请优先阅读根目录 [`README.md`](../README.md)。

## 索引

| 文档 | 说明 |
|------|------|
| [`overview.md`](./overview.md) | **项目总览** —— 定位、技术栈、目录结构、路由、内容维护与部署要点，面向新读者的入口地图 |
| [`deploy-pages-dns.md`](./deploy-pages-dns.md) | **GitHub Pages 部署与 DNS 配置** —— 主域名 `www.zgc-llm.org.cn` 的 DNS 记录、自定义域名启用步骤与排障 |
| [`deploy-docker.md`](./deploy-docker.md) | 绕开 Pages 的自主容器（standalone SSR）部署方案 |
| [`../README.md`](../README.md) | 上手指南、常用命令、环境变量、公开路由、部署说明 |
| [`../CONTRIBUTING.md`](../CONTRIBUTING.md) | 协作约定与提交前检查 |
| [`dev/alliance-website-v1/`](./dev/alliance-website-v1/) | 一期 SDD 规划历史文档（见下方说明） |

## 关于 `dev/`

`dev/` 存放规范驱动开发（SDD）过程中的规划产物：需求、设计、任务、上下文与方案评审。这些是**开发期的历史记录**，用于追溯决策，不是当前架构的权威描述。

一期早期方案曾包含 Payload CMS + PostgreSQL，已在 **PR #4** 移除并收敛为纯静态官网。因此 `dev/` 各文档顶部均带有「更新补记」声明，其中涉及 Payload / 数据库的内容仅作历史留存。**当前架构以 [`overview.md`](./overview.md) 与根 [`README.md`](../README.md) 为准。**

| 文件 | 内容 |
|------|------|
| `alliance-website-v1-requirements.md` | 需求文档 |
| `alliance-website-v1-design.md` | 技术设计 |
| `alliance-website-v1-tasks.md` | 开发任务拆分 |
| `alliance-website-v1-context.md` | 执行上下文与各组结果 |
| `alliance-website-v1-review.md` | 方案评审记录 |
