import { createContext, Script } from 'node:vm'

import { cleanup, render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'

import EnNotFound, {
  metadata as enNotFoundMetadata,
} from '@/app/(en)/not-found'
import EnRootLayout, { metadata as enRootMetadata } from '@/app/(en)/layout'
import NotFound, {
  metadata as zhNotFoundMetadata,
} from '@/app/(frontend)/not-found'
import RootLayout, { metadata as zhRootMetadata } from '@/app/(frontend)/layout'
import sitemap from '@/app/(frontend)/sitemap'
import GlobalNotFound, {
  metadata as globalNotFoundMetadata,
} from '@/app/global-not-found'
import robots from '@/app/robots'
import { PUBLIC_STATIC_ROUTES, SITE_URL } from '@/config/site'
import { getPublishedNews } from '@/content/news'
import { LOCALES } from '@/i18n/locales'
import { absoluteCanonicalUrl, buildAlternates } from '@/i18n/routing'

import { expectLocalizedMetadata } from './helpers/metadata-contract'

afterEach(cleanup)

describe('sitemap release graph', () => {
  it('contains each indexable static and published-news URL exactly once in both locales', () => {
    const entries = sitemap()
    const expectedPaths = [
      ...PUBLIC_STATIC_ROUTES,
      ...getPublishedNews().map(({ slug }) => `/news/${slug}`),
    ]
    const expectedUrls = expectedPaths.flatMap((path) =>
      LOCALES.map((locale) => absoluteCanonicalUrl(path, locale)),
    )
    const actualUrls = entries.map(({ url }) => url)

    expect(entries).toHaveLength(expectedPaths.length * LOCALES.length)
    expect(new Set(actualUrls).size).toBe(actualUrls.length)
    expect(new Set(actualUrls)).toEqual(new Set(expectedUrls))
    expect(actualUrls.some((url) => /\/(?:admin|api|404)(?:\/|$)/u.test(new URL(url).pathname))).toBe(
      false,
    )
    expect(actualUrls).not.toContain(
      absoluteCanonicalUrl('/news/alliance-website-launch', 'zh'),
    )
  })

  it('attaches complete absolute hreflang alternates to every entry', () => {
    for (const entry of sitemap()) {
      const pathname = new URL(entry.url).pathname
      const zhPath = pathname === '/en' ? '/' : pathname.startsWith('/en/') ? pathname.slice(3) : pathname

      expect(entry.alternates?.languages).toEqual(buildAlternates(zhPath, 'zh').languages)
    }
  })

  it('uses deliberate update policies for home, static pages and dated news', () => {
    const entries = sitemap()
    const home = entries.find(({ url }) => url === absoluteCanonicalUrl('/', 'zh'))
    const alliance = entries.find(({ url }) => url === absoluteCanonicalUrl('/alliance', 'zh'))
    const news = entries.find(({ url }) => new URL(url).pathname.includes('/news/cybersecurity-open-program'))

    expect(home).toMatchObject({ changeFrequency: 'weekly', priority: 1 })
    expect(alliance).toMatchObject({ changeFrequency: 'monthly', priority: 0.7 })
    expect(news).toMatchObject({
      changeFrequency: 'never',
      lastModified: '2026-07-08',
      priority: 0.6,
    })
  })
})

describe('robots release policy', () => {
  it('allows the public static site without inventing nonexistent private surfaces', () => {
    const value = robots()

    expect(value).toEqual({
      host: SITE_URL,
      rules: { allow: '/', userAgent: '*' },
      sitemap: 'https://www.zgc-llm.org.cn/sitemap.xml',
    })
    expect(value.rules).not.toHaveProperty('disallow')
  })
})

describe('localized and global not-found contracts', () => {
  it.each([
    ['zh', NotFound, zhNotFoundMetadata, '/', '/news', '/privacy'],
    ['en', EnNotFound, enNotFoundMetadata, '/en', '/en/news', '/en/privacy'],
  ] as const)('renders a non-indexable %s recovery page', (_locale, Page, metadata, home, news, privacy) => {
    render(<Page />)

    expect(metadata).toMatchObject({
      alternates: { canonical: null },
      robots: { follow: false, index: false },
    })
    expect(screen.getByRole('main').tabIndex).toBe(-1)
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      home,
      news,
      privacy,
    ])
  })

  it('renders one bilingual global recovery document without duplicating Next noindex metadata', () => {
    const html = renderToStaticMarkup(GlobalNotFound())
    const documentNode = new DOMParser().parseFromString(html, 'text/html')

    expect(globalNotFoundMetadata).not.toHaveProperty('robots')
    expect(documentNode.documentElement.getAttribute('lang')).toBe('zh-CN')
    expect(documentNode.querySelector('main')?.getAttribute('tabindex')).toBe('-1')
    expect(documentNode.querySelector('a[href="/"]')).not.toBeNull()
    expect(documentNode.querySelector('a[href="/en"]')).not.toBeNull()
    expect(documentNode.body.textContent).toContain('页面未找到')
    expect(documentNode.body.textContent).toContain('Page not found')
  })

  it.each([
    {
      expectedLocale: 'zh',
      expectedLanguage: 'zh-CN',
      expectedTitle: '页面未找到｜中关村自主大模型产业联盟',
      pathname: '/不存在的页面',
    },
    {
      expectedLocale: 'en',
      expectedLanguage: 'en',
      expectedTitle: 'Page not found | ZGCLLM',
      pathname: '/en/missing-page',
    },
  ])(
    'executes the global recovery policy for $expectedLocale unknown paths',
    ({ expectedLanguage, expectedLocale, expectedTitle, pathname }) => {
      const html = renderToStaticMarkup(GlobalNotFound())
      const documentNode = new DOMParser().parseFromString(html, 'text/html')
      const context = createContext({
        document: documentNode,
        location: { pathname },
        window: {},
      })

      for (const element of documentNode.querySelectorAll('script')) {
        if (element.textContent) {
          new Script(element.textContent).runInContext(context)
        }
      }

      expect(documentNode.documentElement.lang).toBe(expectedLanguage)
      expect(documentNode.documentElement.dataset.errorLocale).toBe(expectedLocale)
      expect(documentNode.title).toBe(expectedTitle)
    },
  )
})

describe('locale root layouts', () => {
  it('declares the correct document language and root metadata for both trees', () => {
    const child = <main>content</main>
    const zhLayout = RootLayout({ children: child })
    const enLayout = EnRootLayout({ children: child })

    expect((zhLayout.props as { lang: string }).lang).toBe('zh-CN')
    expect((enLayout.props as { lang: string }).lang).toBe('en')
    expectLocalizedMetadata(zhRootMetadata, '/', 'zh')
    expectLocalizedMetadata(enRootMetadata, '/', 'en')
    expect(zhRootMetadata.metadataBase?.toString()).toBe(`${SITE_URL}/`)
    expect(enRootMetadata.metadataBase?.toString()).toBe(`${SITE_URL}/`)
  })
})
