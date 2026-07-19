import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// 支持两种部署形态：
//   - GitHub Pages 静态托管：BUILD_TARGET=export → 产出 out/，关闭服务端图片优化
//   - Docker/容器部署：默认 standalone → 保留 SSR 与服务端图片优化
const isStaticExport = process.env.BUILD_TARGET === 'export'

const isValidDevHostname = (hostname: string): boolean => {
  if (!hostname || hostname.length > 253 || /[*/:@/?#\\]/.test(hostname)) {
    return false
  }

  const labels = hostname.split('.')

  if (labels.every((label) => /^\d+$/.test(label))) {
    return (
      labels.length === 4 &&
      labels.every((label) => Number(label) <= 255 && String(Number(label)) === label)
    )
  }

  return labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))
}

const getAllowedDevOrigins = (value: string | undefined): string[] => {
  if (!value) {
    return []
  }

  const origins = value.split(',').map((origin) => origin.trim().toLowerCase())

  if (origins.some((origin) => !isValidDevHostname(origin))) {
    throw new Error(
      'NEXT_PUBLIC_DEV_ORIGIN only accepts comma-separated hostnames or IPv4 addresses without schemes, ports, paths, or wildcards.',
    )
  }

  return [...new Set(origins)]
}

// Next.js already trusts localhost and the hostname passed to `next dev`.
// Additional LAN/custom hosts must be opted in explicitly instead of allowing
// every RFC 1918 origin to access development-only assets and endpoints.
const allowedDevOrigins = getAllowedDevOrigins(process.env.NEXT_PUBLIC_DEV_ORIGIN)

const nextConfig: NextConfig = {
  allowedDevOrigins,
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
