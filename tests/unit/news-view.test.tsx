import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { NewsArticle } from '@/app/(frontend)/news/[slug]/page'
import { NewsList, NewsView } from '@/app/(frontend)/news/page'
import { NEWS_PAGE_COPY } from '@/content/news'
import type { FactReference, NewsEntry } from '@/types/content'

afterEach(cleanup)

const sourceFact: FactReference = {
  authorizedScopes: ['result'],
  evidenceStatus: 'public-source',
  factId: 'TEST-NEWS-SOURCE',
  publication: 'publish',
  reviewedAt: '2026-07-19',
  source: {
    publishedAt: '2026-07-15',
    reviewedAt: '2026-07-19',
    title: '测试公开来源',
    url: 'https://example.com/public-source',
  },
}

const publishedEntry: NewsEntry = {
  body: [
    { text: '阶段进展', type: 'heading' },
    { text: '<script>alert("unsafe")</script>', type: 'paragraph' },
    { items: ['开放协作', '审慎发布'], type: 'list' },
  ],
  category: 'result',
  date: '2026-07-15',
  description: '经确认可公开的阶段信息。',
  facts: [sourceFact],
  published: true,
  slug: 'confirmed-update',
  title: '已确认动态',
}

const draftEntry: NewsEntry = {
  ...publishedEntry,
  facts: undefined,
  published: false,
  slug: 'internal-draft',
  title: '内部草稿',
}

describe('NewsList', () => {
  it('renders the localized honest empty state when no entry is public', () => {
    const copy = NEWS_PAGE_COPY.en

    render(<NewsList entries={[draftEntry]} locale="en" />)

    expect(screen.getByRole('heading', { name: copy.emptyTitle })).toBeTruthy()
    expect(screen.queryByText(draftEntry.title)).toBeNull()
  })

  it('sorts and links only published entries using localized routes', () => {
    const newer = {
      ...publishedEntry,
      date: '2026-07-18',
      slug: 'newer-update',
      title: '较新动态',
    }

    render(<NewsList entries={[publishedEntry, draftEntry, newer]} locale="zh" />)

    const links = screen.getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(['较新动态', '已确认动态'])
    expect(links[0].getAttribute('href')).toBe('/news/newer-update')
    expect(screen.queryByText('内部草稿')).toBeNull()
  })
})

describe('NewsArticle', () => {
  it('renders controlled content blocks and reviewed source metadata without injecting HTML', () => {
    const { container } = render(<NewsArticle entry={publishedEntry} />)
    const copy = NEWS_PAGE_COPY.zh

    expect(screen.getByRole('heading', { level: 1, name: publishedEntry.title })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '阶段进展' })).toBeTruthy()
    expect(screen.getByText('<script>alert("unsafe")</script>')).toBeTruthy()
    expect(screen.getByRole('list').children).toHaveLength(2)
    expect(container.querySelector('script')).toBeNull()
    expect(screen.getByRole('heading', { name: copy.sourceTitle })).toBeTruthy()
    expect(
      screen.getByRole('link', { name: new RegExp(copy.sourceLinkLabel) }).getAttribute('href'),
    ).toBe(sourceFact.source!.url)
    expect(
      container.querySelector(`time[datetime="${sourceFact.source!.publishedAt}"]`),
    ).not.toBeNull()
    expect(
      container.querySelector(`time[datetime="${sourceFact.source!.reviewedAt}"]`),
    ).not.toBeNull()
  })

  it('renders a safe generic HTTPS action and drops unsafe or incomplete actions', () => {
    const safeEntry = {
      ...publishedEntry,
      ctaHref: 'https://example.com/verified-form',
      ctaLabel: '前往已核验页面',
      facts: undefined,
    }
    const { rerender } = render(<NewsArticle entry={safeEntry} />)

    const safeLink = screen.getByRole('link', { name: /前往已核验页面/ })
    expect(safeLink.getAttribute('href')).toBe(safeEntry.ctaHref)
    expect(safeLink.getAttribute('rel')).toBe('noreferrer noopener')

    rerender(
      <NewsArticle
        entry={{ ...safeEntry, ctaHref: 'javascript:alert(1)', ctaLabel: '不安全入口' }}
      />,
    )
    expect(screen.queryByRole('link', { name: /不安全入口/ })).toBeNull()

    rerender(<NewsArticle entry={{ ...safeEntry, ctaLabel: undefined }} />)
    expect(screen.queryByRole('link', { name: /前往已核验页面/ })).toBeNull()
  })

  it('shows registered application status independently from generic links', () => {
    const copy = NEWS_PAGE_COPY.zh
    const entry: NewsEntry = {
      ...publishedEntry,
      applicationTargetId: 'cybersecurity-program',
      ctaLabel: '提交计划申请',
      facts: undefined,
    }

    render(<NewsArticle entry={entry} />)

    expect(screen.getByRole('heading', { name: copy.applicationTitle })).toBeTruthy()
    expect(screen.getByText(copy.applicationDescription)).toBeTruthy()
    expect(screen.getByText((text) => text.startsWith('提交计划申请：'))).toBeTruthy()
    expect(screen.queryByRole('link', { name: '提交计划申请' })).toBeNull()
  })

  it('uses a safe English fallback without carrying Chinese actions or source-only text', () => {
    const raw: NewsEntry = {
      ...publishedEntry,
      ctaHref: 'https://example.com/form',
      ctaLabel: '中文操作',
      facts: undefined,
      slug: 'entry-without-reviewed-english',
    }
    const copy = NEWS_PAGE_COPY.en

    render(<NewsArticle entry={raw} locale="en" />)

    expect(screen.getByRole('heading', { level: 1, name: copy.fallbackTitle })).toBeTruthy()
    expect(screen.getByText(copy.fallbackBody)).toBeTruthy()
    expect(screen.getByRole('link', { name: copy.fallbackAction }).getAttribute('href')).toBe(
      `/news/${raw.slug}`,
    )
    expect(screen.queryByText('中文操作')).toBeNull()
  })

  it('omits the optional source publication date when the source does not provide one', () => {
    const factWithoutPublishedAt: FactReference = {
      ...sourceFact,
      factId: 'TEST-NEWS-SOURCE-WITHOUT-DATE',
      source: { ...sourceFact.source!, publishedAt: undefined, url: 'https://example.com/no-date' },
    }

    render(<NewsArticle entry={{ ...publishedEntry, facts: [factWithoutPublishedAt] }} />)

    const sourceSection = screen
      .getByRole('heading', { name: NEWS_PAGE_COPY.zh.sourceTitle })
      .closest('section')!
    expect(sourceSection.querySelectorAll('time')).toHaveLength(1)
    expect(sourceSection.querySelector('time')?.getAttribute('datetime')).toBe(
      factWithoutPublishedAt.source!.reviewedAt,
    )
  })
})

describe('NewsView', () => {
  it.each(['zh', 'en'] as const)('renders the localized page shell in %s', (locale) => {
    const copy = NEWS_PAGE_COPY[locale]

    render(<NewsView locale={locale} />)

    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content')
    expect(screen.getByRole('heading', { level: 1, name: copy.heroTitle })).toBeTruthy()
    expect(screen.getByRole('region', { name: copy.heroTitle })).toBeTruthy()
  })
})
