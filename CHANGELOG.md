# 更新日志（Changelog）

本项目所有值得记录的变更都会记录在本文件中。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本遵循 [语义化版本](https://semver.org/lang/zh-CN/)。日期采用 `YYYY-MM-DD`。

## [未发布]

首个上线版本（v1）准备中，以下为已合入 `main` 的主要变更。

### 新增

- 网络安全工作组详情页及「加入工作组」「成员名单」子页（`/working-groups/[slug]`）。
- 「网络安全人员开放计划」新闻公告，支持文末申请入口。
- 项目根 `CLAUDE.md`：项目概要、域名规范（含改域名需同步的文件清单）、常用命令、开发约定与分支流程。
- GitHub Pages 部署与 CI 工作流，自定义域名 `CNAME`。
- 联盟理事会/监事会成员、工作组组织层真实文案与成员数据。

### 变更

- **统一正式主域名为 `www.zgc-llm.org.cn`（带连字符）**；`zgc-llm.cn`/`zgc-llm.net`/`zgc-llm.com` 作为品牌保护域名，上线时统一 301 跳转到主域名。
- 全站文案回归联盟风格，优化首页卡片 UI 与 CTA 横幅视觉层级。
- 工作组页与生态专题页采用设计系统 v2（`btn` / `cta-band` / `grid-3` 等）。
- 窄屏（<1280px）主题切换按钮常驻可见，语言切换移入移动菜单面板。
- 优化 `.gitignore`（去重、补 `.claude/worktrees/` 忽略、按类分组）；删除无用的 `.yarnrc` 与 `.npmrc`。

### 修复

- 修正 `CNAME` 与部署配置误用无连字符域名 `zgcllm.org.cn` 的问题，避免 Pages 自定义域名绑定失败及线上 canonical/sitemap 使用错误域名。
- 修复 `next dev` 扫描 `.claude/` 目录导致的非法 CSS 解析失败。

[未发布]: https://github.com/Clouditera/zgcllm/commits/main
