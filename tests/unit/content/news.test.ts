import {
  CYBERSECURITY_PROGRAM_SOURCE,
  NEWS_ENTRIES,
  NEWS_PAGE_COPY,
  formatNewsDate,
  getNewsSources,
  getNewsStatus,
  getPublishedNews,
  getPublishedNewsBySlug,
  localizeNewsEntry,
  localizeNewsEntryWithStatus,
} from '@/content/news'
import type { FactSource, NewsEntry } from '@/types/content'
import { createValidContentBundle, publishedFact } from '../fixtures/content-bundle'
import { describe, expect, it } from 'vitest'

function syntheticNews(overrides: Partial<NewsEntry> = {}): NewsEntry {
  return {
    ...createValidContentBundle().news[0],
    applicationTargetId: undefined,
    ctaLabel: undefined,
    ...overrides,
  }
}

describe('news publication helpers', () => {
  it('filters unpublished records, sorts newest first and leaves the caller array unchanged', () => {
    const entries = [
      syntheticNews({ date: '2026-01-01', slug: 'older' }),
      syntheticNews({ date: '2026-12-31', published: false, slug: 'draft' }),
      syntheticNews({ date: '2026-06-01', slug: 'newer' }),
    ]
    const originalOrder = entries.map(({ slug }) => slug)

    expect(getPublishedNews(entries).map(({ slug }) => slug)).toEqual(['newer', 'older'])
    expect(entries.map(({ slug }) => slug)).toEqual(originalOrder)
  })

  it('exposes exactly the checked-in records whose publication flag is true', () => {
    const expected = NEWS_ENTRIES.filter(({ published }) => published)
      .map(({ slug }) => slug)
      .sort()
    const actual = getPublishedNews()

    expect(actual.map(({ slug }) => slug).sort()).toEqual(expected)
    expect(actual.every(({ published }) => published)).toBe(true)
    expect(new Set(actual.map(({ slug }) => slug)).size).toBe(actual.length)
  })

  it('never resolves an unpublished record through the public slug helper', () => {
    for (const entry of NEWS_ENTRIES) {
      expect(getPublishedNewsBySlug(entry.slug)).toBe(entry.published ? entry : undefined)
    }
    expect(getPublishedNewsBySlug('missing-update')).toBeUndefined()
  })

  it('distinguishes historical notices, withdrawn records and ordinary updates', () => {
    const historical = NEWS_ENTRIES.find(({ slug }) => slug === 'cybersecurity-open-program')
    const withdrawn = NEWS_ENTRIES.find(({ published }) => !published)

    expect(historical && getNewsStatus(historical)).toBe('historical')
    expect(withdrawn && getNewsStatus(withdrawn)).toBe('withdrawn')
    expect(getNewsStatus(syntheticNews({ slug: 'ordinary-update' }))).toBe('update')
  })

  it('uses a registered target ID rather than embedding a default public form URL', () => {
    for (const entry of getPublishedNews()) {
      expect(entry.ctaHref).toBeUndefined()
      if (entry.ctaLabel) expect(entry.applicationTargetId).toBeDefined()
    }
  })
})

describe('news localization', () => {
  it('returns the authoritative Chinese entry without rewriting it', () => {
    const entry = getPublishedNews()[0]

    expect(localizeNewsEntryWithStatus(entry, 'zh')).toEqual({
      entry,
      isFallback: false,
    })
    expect(localizeNewsEntry(entry, 'zh')).toBe(entry)
  })

  it('applies a reviewed English overlay while retaining publication evidence and routing identity', () => {
    const entry = getPublishedNews()[0]
    const localized = localizeNewsEntryWithStatus(entry, 'en')

    expect(localized.isFallback).toBe(false)
    expect(localized.entry).toEqual(
      expect.objectContaining({
        applicationTargetId: entry.applicationTargetId,
        date: entry.date,
        facts: entry.facts,
        published: true,
        slug: entry.slug,
      }),
    )
    expect(localized.entry.title).not.toBe(entry.title)
    expect(localizeNewsEntry(entry, 'en')).toEqual(localized.entry)
  })

  it('fails closed to a neutral English notice when no reviewed overlay exists', () => {
    const entry = syntheticNews({
      applicationTargetId: 'alliance',
      ctaHref: 'https://resources.example.test/apply',
      ctaLabel: '申请',
      slug: 'entry-without-overlay',
    })
    const localized = localizeNewsEntryWithStatus(entry, 'en')

    expect(localized.isFallback).toBe(true)
    expect(localized.entry).toEqual(
      expect.objectContaining({
        applicationTargetId: undefined,
        ctaHref: undefined,
        ctaLabel: undefined,
        description: NEWS_PAGE_COPY.en.fallbackDescription,
        slug: entry.slug,
        title: NEWS_PAGE_COPY.en.fallbackTitle,
      }),
    )
    expect(localized.entry.body).toEqual([
      { text: NEWS_PAGE_COPY.en.fallbackBody, type: 'paragraph' },
    ])
  })

  it('formats dates deterministically in the requested locale', () => {
    expect(formatNewsDate('2026-07-08', 'zh')).toBe('2026年7月8日')
    expect(formatNewsDate('2026-07-08', 'en')).toBe('July 8, 2026')
  })

  it('provides complete category and publication-status labels in both locales', () => {
    for (const locale of ['zh', 'en'] as const) {
      expect(Object.keys(NEWS_PAGE_COPY[locale].categoryLabels).sort()).toEqual([
        'event',
        'insight',
        'news',
        'result',
      ])
      expect(Object.keys(NEWS_PAGE_COPY[locale].statusLabels).sort()).toEqual([
        'historical',
        'update',
        'withdrawn',
      ])
      expect(NEWS_PAGE_COPY[locale].emptyTitle).not.toBe('')
      expect(NEWS_PAGE_COPY[locale].metadataDescription).not.toBe('')
    }
  })
})

describe('news public sources', () => {
  it('publishes a complete HTTPS source for the dated cybersecurity notice', () => {
    expect(CYBERSECURITY_PROGRAM_SOURCE).toEqual(
      expect.objectContaining({
        publishedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        reviewedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        title: expect.any(String),
        url: expect.stringMatching(/^https:\/\//),
      }),
    )
  })

  it('returns unique sources by URL and ignores facts without a source', () => {
    const first: FactSource = {
      reviewedAt: '2026-07-19',
      title: '来源甲',
      url: 'https://source.example.test/a',
    }
    const duplicate: FactSource = { ...first, title: '来源甲复核版' }
    const second: FactSource = {
      reviewedAt: '2026-07-19',
      title: '来源乙',
      url: 'https://source.example.test/b',
    }
    const entry = syntheticNews({
      facts: [
        publishedFact('FACT-320', ['result'], { source: first }),
        publishedFact('FACT-321', ['result'], { source: duplicate }),
        publishedFact('FACT-322', ['result']),
        publishedFact('FACT-323', ['result'], { source: second }),
      ],
    })

    expect(getNewsSources(entry)).toEqual([duplicate, second])
    expect(getNewsSources(syntheticNews({ facts: undefined }))).toEqual([])
  })
})
