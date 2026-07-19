import type { MetadataRoute } from 'next'

import { getPublishedNews } from '@/content/news'
import { PUBLIC_STATIC_ROUTES } from '@/config/site'
import { LOCALES } from '@/i18n/locales'
import { absoluteCanonicalUrl, buildAlternates } from '@/i18n/routing'

// 静态导出（output: export）要求元数据路由在构建期固化为静态文件。
export const dynamic = 'force-static'

function languagesFor(zhPath: string): Record<string, string> {
  return buildAlternates(zhPath, 'zh').languages
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const route of PUBLIC_STATIC_ROUTES) {
    for (const locale of LOCALES) {
      entries.push({
        alternates: { languages: languagesFor(route) },
        changeFrequency: route === '/' ? 'weekly' : 'monthly',
        priority: route === '/' ? 1 : 0.7,
        url: absoluteCanonicalUrl(route, locale),
      })
    }
  }

  for (const entry of getPublishedNews()) {
    const path = `/news/${entry.slug}`

    for (const locale of LOCALES) {
      entries.push({
        alternates: { languages: languagesFor(path) },
        changeFrequency: 'never',
        lastModified: entry.date,
        priority: 0.6,
        url: absoluteCanonicalUrl(path, locale),
      })
    }
  }

  return entries
}
