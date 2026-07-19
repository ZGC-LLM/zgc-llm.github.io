import { afterEach, describe, expect, it, vi } from 'vitest'

import { importRouting } from '../helpers/import-routing'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('locale-safe internal paths', () => {
  it.each([
    ['', '/', '/en'],
    ['/', '/', '/en'],
    ['/en', '/', '/en'],
    ['/alliance/', '/alliance', '/en/alliance'],
    ['/en/alliance/', '/alliance', '/en/alliance'],
    ['/news/confirmed-update', '/news/confirmed-update', '/en/news/confirmed-update'],
  ])('normalizes %s into canonical locale paths', async (input, zh, en) => {
    const { localeFromPathname, localizePath, switchLocalePath, toZhPath } = await importRouting()

    expect(toZhPath(input)).toBe(zh)
    expect(localizePath(input, 'zh')).toBe(zh)
    expect(localizePath(input, 'en')).toBe(en)
    expect(switchLocalePath(input, 'en')).toBe(en)
    expect(localeFromPathname(en)).toBe('en')
    expect(localeFromPathname(zh)).toBe('zh')
  })

  it.each([
    'relative/path',
    '//example.com/path',
    '/news//item',
    '/news\\item',
    '/news/item?preview=1',
    '/news/item#section',
    '/news/./item',
    '/news/../item',
    '/news/%2e%2e/item',
    '/news/%2Fitem',
    '/news/%5citem',
    '/news/\u0000item',
  ])('rejects an unsafe or ambiguous internal pathname: %s', async (path) => {
    const { absoluteSiteUrl, localizePath, toZhPath } = await importRouting()

    expect(() => toZhPath(path)).toThrow()
    expect(() => localizePath(path, 'en')).toThrow()
    expect(() => absoluteSiteUrl(path)).toThrow()
  })
})

describe('canonical URL policy', () => {
  it('uses extensionless paths without trailing slashes outside export builds', async () => {
    const { absoluteCanonicalUrl, canonicalPath } = await importRouting(undefined)

    expect(canonicalPath('/', 'zh')).toBe('/')
    expect(canonicalPath('/alliance/', 'zh')).toBe('/alliance')
    expect(canonicalPath('/alliance', 'en')).toBe('/en/alliance')
    expect(absoluteCanonicalUrl('/alliance', 'en')).toBe('https://www.zgc-llm.org.cn/en/alliance')
  })

  it('uses directory URLs in export builds without duplicating the root slash', async () => {
    const { absoluteCanonicalUrl, canonicalPath } = await importRouting('export')

    expect(canonicalPath('/', 'zh')).toBe('/')
    expect(canonicalPath('/alliance', 'zh')).toBe('/alliance/')
    expect(canonicalPath('/alliance/', 'en')).toBe('/en/alliance/')
    expect(absoluteCanonicalUrl('/alliance', 'en')).toBe('https://www.zgc-llm.org.cn/en/alliance/')
  })

  it('preserves an intentional safe trailing slash in an absolute URL', async () => {
    const { absoluteSiteUrl } = await importRouting()

    expect(absoluteSiteUrl('/')).toBe('https://www.zgc-llm.org.cn/')
    expect(absoluteSiteUrl('/news/')).toBe('https://www.zgc-llm.org.cn/news/')
    expect(absoluteSiteUrl('/news')).toBe('https://www.zgc-llm.org.cn/news')
  })

  it.each(['zh', 'en'] as const)(
    'builds absolute canonical and complete hreflang for %s',
    async (locale) => {
      const { buildAlternates } = await importRouting()
      const alternates = buildAlternates('/news/item', locale)

      expect(alternates.canonical).toBe(
        locale === 'zh'
          ? 'https://www.zgc-llm.org.cn/news/item'
          : 'https://www.zgc-llm.org.cn/en/news/item',
      )
      expect(alternates.languages).toEqual({
        en: 'https://www.zgc-llm.org.cn/en/news/item',
        'x-default': 'https://www.zgc-llm.org.cn/news/item',
        'zh-CN': 'https://www.zgc-llm.org.cn/news/item',
      })
    },
  )
})

describe('metadata construction', () => {
  it('builds a localized website metadata contract', async () => {
    const { buildPageMetadata } = await importRouting()
    const metadata = buildPageMetadata({
      description: 'English description',
      locale: 'en',
      title: 'Alliance updates',
      zhPath: '/news',
    })

    expect(metadata.alternates).toMatchObject({
      canonical: 'https://www.zgc-llm.org.cn/en/news',
    })
    expect(metadata.title).toBe('Alliance updates')
    expect(metadata.openGraph).toMatchObject({
      locale: 'en_US',
      siteName: 'ZGCLLM',
      title: 'Alliance updates | ZGCLLM',
      type: 'website',
      url: 'https://www.zgc-llm.org.cn/en/news',
    })
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Alliance updates | ZGCLLM',
    })
  })

  it('adds article publication time only when supplied', async () => {
    const { buildPageMetadata } = await importRouting()
    const withTime = buildPageMetadata({
      description: '描述',
      locale: 'zh',
      publishedTime: '2026-07-08',
      title: '公开信息',
      type: 'article',
      zhPath: '/news/public-update',
    })
    const withoutTime = buildPageMetadata({
      description: '描述',
      locale: 'zh',
      title: '公开信息',
      type: 'article',
      zhPath: '/news/public-update',
    })

    expect(withTime.openGraph).toMatchObject({
      publishedTime: '2026-07-08',
      title: '公开信息｜中关村自主大模型产业联盟',
      type: 'article',
    })
    expect(withoutTime.openGraph).not.toHaveProperty('publishedTime')
  })

  it('supports an absolute title and complete root metadata for each locale', async () => {
    const { buildPageMetadata, buildRootMetadata } = await importRouting()
    const absolute = buildPageMetadata({
      absoluteTitle: true,
      description: 'Description',
      locale: 'en',
      title: 'ZGCLLM',
      zhPath: '/',
    })
    const zhRoot = buildRootMetadata('zh')
    const enRoot = buildRootMetadata('en')

    expect(absolute.title).toEqual({ absolute: 'ZGCLLM' })
    expect(absolute.openGraph).toMatchObject({ title: 'ZGCLLM' })
    expect(zhRoot.metadataBase?.toString()).toBe('https://www.zgc-llm.org.cn/')
    expect(zhRoot.title).toMatchObject({ template: '%s｜中关村自主大模型产业联盟' })
    expect(enRoot.title).toMatchObject({ default: 'ZGCLLM', template: '%s | ZGCLLM' })
    expect(enRoot.icons).toMatchObject({
      apple: [{ sizes: '180x180', type: 'image/png', url: '/apple-icon.png' }],
      icon: [{ sizes: '64x64', type: 'image/png', url: '/icon.png' }],
    })
  })
})
