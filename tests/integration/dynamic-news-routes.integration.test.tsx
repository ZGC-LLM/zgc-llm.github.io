import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const navigation = vi.hoisted(() => ({
  notFound: vi.fn((): never => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

vi.mock('next/navigation', () => ({ notFound: navigation.notFound }))

import EnNewsDetailPage, {
  dynamicParams as enDynamicParams,
  generateMetadata as generateEnMetadata,
  generateStaticParams as generateEnStaticParams,
} from '@/app/(en)/en/news/[slug]/page'
import NewsDetailPage, {
  createNewsArticleJsonLd,
  createNewsMetadata,
  dynamicParams as zhDynamicParams,
  generateMetadata as generateZhMetadata,
  generateStaticParams as generateZhStaticParams,
} from '@/app/(frontend)/news/[slug]/page'
import { getPublishedNews, NEWS_ENTRIES } from '@/content/news'

import { expectLocalizedMetadata } from './helpers/metadata-contract'

afterEach(cleanup)

const publishedEntry = getPublishedNews()[0]
const withdrawnEntry = NEWS_ENTRIES.find(({ published }) => !published)!

describe('news dynamic route graph', () => {
  it('disables fallback params and emits only reviewed published slugs for both locale trees', () => {
    const expected = getPublishedNews().map(({ slug }) => ({ slug }))

    expect(zhDynamicParams).toBe(false)
    expect(enDynamicParams).toBe(false)
    expect(generateZhStaticParams()).toEqual(expected)
    expect(generateEnStaticParams()).toEqual(expected)
    expect(expected).not.toContainEqual({ slug: withdrawnEntry.slug })
    expect(new Set(expected.map(({ slug }) => slug)).size).toBe(expected.length)
  })

  it('renders the known Chinese article with source-safe JSON-LD and metadata', async () => {
    const element = await NewsDetailPage({
      params: Promise.resolve({ slug: publishedEntry.slug }),
    })
    const { container } = render(element)
    const metadata = await generateZhMetadata({
      params: Promise.resolve({ slug: publishedEntry.slug }),
    })
    const script = container.querySelector('script[type="application/ld+json"]')

    expect(screen.getByRole('main').tabIndex).toBe(-1)
    expect(screen.getByRole('heading', { level: 1, name: publishedEntry.title })).toBeTruthy()
    expect(script).not.toBeNull()
    expect(JSON.parse(script?.textContent ?? '')).toMatchObject({
      '@type': 'Article',
      inLanguage: 'zh-CN',
      url: `https://www.zgc-llm.org.cn/news/${publishedEntry.slug}`,
    })
    expectLocalizedMetadata(metadata, `/news/${publishedEntry.slug}`, 'zh')
  })

  it('renders the reviewed English overlay on the same slug', async () => {
    const element = await EnNewsDetailPage({
      params: Promise.resolve({ slug: publishedEntry.slug }),
    })
    render(element)
    const metadata = await generateEnMetadata({
      params: Promise.resolve({ slug: publishedEntry.slug }),
    })

    expect(screen.getByRole('main').tabIndex).toBe(-1)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/Cybersecurity/u)
    expect(screen.getByRole('link', { name: /Back to Alliance updates/u }).getAttribute('href')).toBe(
      '/en/news',
    )
    expectLocalizedMetadata(metadata, `/news/${publishedEntry.slug}`, 'en')
  })

  it.each([
    ['withdrawn', withdrawnEntry.slug],
    ['missing', 'does-not-exist'],
  ])('returns notFound for a %s Chinese article', async (_case, slug) => {
    await expect(NewsDetailPage({ params: Promise.resolve({ slug }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    )
    await expect(generateZhMetadata({ params: Promise.resolve({ slug }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    )
  })

  it.each([
    ['withdrawn', withdrawnEntry.slug],
    ['missing', 'does-not-exist'],
  ])('returns notFound for a %s English article', async (_case, slug) => {
    await expect(EnNewsDetailPage({ params: Promise.resolve({ slug }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    )
    await expect(generateEnMetadata({ params: Promise.resolve({ slug }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    )
  })

  it('keeps metadata and Article JSON-LD on one canonical contract', () => {
    const metadata = createNewsMetadata(publishedEntry, 'en')
    const jsonLd = createNewsArticleJsonLd(publishedEntry, 'en')
    const canonical = `https://www.zgc-llm.org.cn/en/news/${publishedEntry.slug}`

    expect(metadata.alternates).toMatchObject({ canonical })
    expect(jsonLd).toMatchObject({
      '@id': `${canonical}#article`,
      mainEntityOfPage: { '@id': canonical },
      url: canonical,
    })
  })
})
