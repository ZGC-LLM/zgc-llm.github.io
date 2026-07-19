import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/config/site'

// 静态导出（output: export）要求元数据路由在构建期固化为静态文件。
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    host: new URL(SITE_URL).origin,
    rules: {
      allow: '/',
      disallow: ['/admin', '/api'],
      userAgent: '*',
    },
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
  }
}
