import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// 支持两种部署形态：
//   - GitHub Pages 静态托管：BUILD_TARGET=export → 产出 out/，关闭服务端图片优化
//   - Docker/容器部署：默认 standalone → 保留 SSR 与服务端图片优化
const isStaticExport = process.env.BUILD_TARGET === 'export'

const nextConfig: NextConfig = {
  // 开发期允许通过局域网 IP 访问（跨源 dev host）。Next 16 默认仅信任 localhost，
  // 从 LAN IP 访问时会拦截 HMR/dev 资源，导致 Turbopack 客户端运行时引导失败、整页不水合
  // （表现为导航下拉、语言切换等所有交互失效）。仅影响 next dev；生产 standalone/export 不使用。
  allowedDevOrigins: ['192.168.0.111'],
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
