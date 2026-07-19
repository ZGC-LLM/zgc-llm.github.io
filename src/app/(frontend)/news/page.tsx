import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import {
  formatNewsDate,
  getNewsStatus,
  getPublishedNews,
  localizeNewsEntryWithStatus,
  NEWS_ENTRIES,
  NEWS_PAGE_COPY,
} from '@/content/news'
import type { Locale } from '@/i18n/locales'
import { buildPageMetadata, localizePath } from '@/i18n/routing'
import type { NewsEntry } from '@/types/content'

const metadataCopy = NEWS_PAGE_COPY.zh

export const metadata: Metadata = buildPageMetadata({
  description: metadataCopy.metadataDescription,
  locale: 'zh',
  title: metadataCopy.metadataTitle,
  zhPath: '/news',
})

interface NewsListProps {
  entries: readonly NewsEntry[]
  locale?: Locale
}

export function NewsList({ entries, locale = 'zh' }: NewsListProps): ReactElement {
  const publishedEntries = getPublishedNews(entries)
  const copy = NEWS_PAGE_COPY[locale]

  if (publishedEntries.length === 0) {
    return (
      <div className="empty !mt-0">
        <h2 className="text-xl font-bold text-[var(--text-title)]">{copy.emptyTitle}</h2>
        <p>{copy.emptyBody}</p>
      </div>
    )
  }

  return (
    <div className="news grid-2 !mt-0">
      {publishedEntries.map((raw) => {
        const { entry } = localizeNewsEntryWithStatus(raw, locale)
        const href = localizePath(`/news/${entry.slug}`, locale)

        return (
          <article className="card" key={entry.slug}>
            <div className="news__meta flex-wrap">
              <span className="news__cat">{copy.categoryLabels[entry.category]}</span>
              <span>{copy.statusLabels[getNewsStatus(raw)]}</span>
              <time className="news__date" dateTime={entry.date}>
                {formatNewsDate(entry.date, locale)}
              </time>
            </div>
            <h2 className="mt-3.5 text-xl font-bold">
              <Link
                className="inline-flex min-h-11 items-center hover:text-[var(--brand-primary)]"
                href={href}
              >
                {entry.title}
              </Link>
            </h2>
            <p>{entry.description}</p>
          </article>
        )
      })}
    </div>
  )
}

export function NewsView({ locale }: { locale: Locale }): ReactElement {
  const copy = NEWS_PAGE_COPY[locale]

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        description={copy.heroDescription}
        eyebrow={copy.heroEyebrow}
        title={copy.heroTitle}
      />
      <section aria-label={copy.heroTitle} className="block">
        <div className="site-container">
          <NewsList entries={NEWS_ENTRIES} locale={locale} />
        </div>
      </section>
    </main>
  )
}

export default function NewsPage(): ReactElement {
  return <NewsView locale="zh" />
}
