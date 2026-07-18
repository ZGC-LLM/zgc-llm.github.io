import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// 支持两种部署形态：
//   - GitHub Pages 静态托管：BUILD_TARGET=export → 产出 out/，关闭服务端图片优化
//   - Docker/容器部署：默认 standalone → 保留 SSR 与服务端图片优化
const isStaticExport = process.env.BUILD_TARGET === 'export'

// 开发期允许的跨源 host（allowedDevOrigins）。Next 16 默认仅信任 localhost，
// 从局域网 IP 访问 dev server 时会拦截 HMR/dev 资源，导致 Turbopack 客户端运行时
// 引导失败、整页不水合（导航下拉、语言切换等所有交互失效）。仅影响 next dev；
// 生产 standalone/export 不使用。
//
// Next 的匹配按 `.` 分段、`*` 仅匹配「整段」（段内部分通配如 172.2* 无效，见
// csrf-protection.js#matchWildcardDomain），故私有网段（RFC 1918）需逐段列出：
//   10.*.*.* / 172.16–31.*.* / 192.168.*.*
// 这样团队任何人用不同局域网 IP 都无需改配置；非常规网段/自定义域名可通过
// NEXT_PUBLIC_DEV_ORIGIN（逗号分隔）追加。
const privateLanOrigins = [
  '10.*.*.*',
  '192.168.*.*',
  // 172.16.0.0/12 → 第二段 16..31 逐一展开（段内通配不被支持）
  ...Array.from({ length: 16 }, (_, i) => `172.${16 + i}.*.*`),
]

const extraDevOrigins =
  process.env.NEXT_PUBLIC_DEV_ORIGIN?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ?? []

const nextConfig: NextConfig = {
  allowedDevOrigins: [...privateLanOrigins, ...extraDevOrigins],
  experimental: {
    globalNotFound: true,
  },
  output: isStaticExport ? 'export' : 'standalone',
  // GitHub Pages 直接托管静态文件、不会把 /alliance 重写到 /alliance.html。
  // 导出时开启 trailingSlash，使每个路由产出 alliance/index.html（目录索引，Pages 必然可服务），
  // 保证无扩展名链接、分享链接与 sitemap 抓取都能解析。standalone/dev 不受影响（避免改变 e2e 的 URL 断言）。
  trailingSlash: isStaticExport,
  images: {
    unoptimized: isStaticExport,
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default nextConfig
