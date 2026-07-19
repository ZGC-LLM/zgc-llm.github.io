import { describe, expect, it } from 'vitest'

import { articleStructuredData, siteStructuredData } from '@/lib/structured-data'

describe('site structured data', () => {
  it.each([
    ['zh', '中关村自主大模型产业联盟', 'zh-CN', 'https://www.zgc-llm.org.cn/'],
    ['en', 'ZGCLLM', 'en', 'https://www.zgc-llm.org.cn/en'],
  ] as const)(
    'emits an approved Organization and localized WebSite for %s',
    (locale, name, language, url) => {
      const [organization, website] = siteStructuredData(locale)

      expect(organization).toEqual({
        '@context': 'https://schema.org',
        '@id': 'https://www.zgc-llm.org.cn/#organization',
        '@type': 'Organization',
        name: '中关村自主大模型产业联盟',
        url: 'https://www.zgc-llm.org.cn/',
      })
      expect(organization).not.toHaveProperty('logo')
      expect(website).toMatchObject({
        '@context': 'https://schema.org',
        '@id': `${url}#website`,
        '@type': 'WebSite',
        inLanguage: language,
        name,
        publisher: { '@id': 'https://www.zgc-llm.org.cn/#organization' },
        url,
      })
    },
  )
})

describe('article structured data', () => {
  it.each([
    ['zh', 'zh-CN', 'https://www.zgc-llm.org.cn/news/public-update'],
    ['en', 'en', 'https://www.zgc-llm.org.cn/en/news/public-update'],
  ] as const)('uses the localized canonical URL and language for %s', (locale, language, url) => {
    const article = articleStructuredData({
      datePublished: '2026-07-08',
      description: 'Reviewed public information',
      headline: 'Public update',
      locale,
      zhPath: '/news/public-update',
    })

    expect(article).toMatchObject({
      '@id': `${url}#article`,
      '@type': 'Article',
      datePublished: '2026-07-08',
      inLanguage: language,
      mainEntityOfPage: { '@id': url },
      publisher: { '@id': 'https://www.zgc-llm.org.cn/#organization' },
      url,
    })
    expect(article).not.toHaveProperty('dateModified')
    expect(article).not.toHaveProperty('logo')
  })

  it('includes dateModified only when it is explicitly supplied', () => {
    expect(
      articleStructuredData({
        dateModified: '2026-07-19',
        datePublished: '2026-07-08',
        description: '描述',
        headline: '标题',
        locale: 'zh',
        zhPath: '/news/item',
      }),
    ).toHaveProperty('dateModified', '2026-07-19')
  })
})
