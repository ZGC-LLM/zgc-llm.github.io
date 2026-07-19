import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { ExternalApplicationLink } from '@/components/site/external-application-link'
import { JsonLd } from '@/components/site/json-ld'
import { PageHero } from '@/components/site/page-hero'
import { isSafeExternalUrl, resolveConfiguredApplicationTarget } from '@/config/site'
import {
  formatNewsDate,
  getNewsSources,
  getNewsStatus,
  getPublishedNews,
  getPublishedNewsBySlug,
  localizeNewsEntryWithStatus,
  NEWS_ENTRIES,
  NEWS_PAGE_COPY,
} from '@/content/news'
import type { Locale } from '@/i18n/locales'
import { buildPageMetadata, localizePath } from '@/i18n/routing'
import { articleStructuredData } from '@/lib/structured-data'
import type { ContentBlock, NewsEntry } from '@/types/content'

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>
}

interface NewsArticleProps {
  entry: NewsEntry
  locale?: Locale
}

// Only reviewed, published records are emitted into the static route graph.
export const dynamicParams = false

export function createNewsStaticParams(entries: readonly NewsEntry[]): { slug: string }[] {
  return getPublishedNews(entries).map((entry) => ({ slug: entry.slug }))
}

export function generateStaticParams(): { slug: string }[] {
  return createNewsStaticParams(NEWS_ENTRIES)
}

export function createNewsMetadata(entry: NewsEntry, locale: Locale = 'zh'): Metadata {
  const localized = localizeNewsEntryWithStatus(entry, locale).entry

  return buildPageMetadata({
    description: localized.description,
    locale,
    publishedTime: entry.date,
    title: localized.title,
    type: 'article',
    zhPath: `/news/${entry.slug}`,
  })
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const entry = getPublishedNewsBySlug(slug)

  if (!entry) notFound()

  return createNewsMetadata(entry)
}

export function createNewsArticleJsonLd(
  entry: NewsEntry,
  locale: Locale = 'zh',
): Record<string, unknown> {
  const localized = localizeNewsEntryWithStatus(entry, locale).entry

  return articleStructuredData({
    datePublished: entry.date,
    description: localized.description,
    headline: localized.title,
    locale,
    zhPath: `/news/${entry.slug}`,
  })
}

function ContentBlockView({ block }: { block: ContentBlock }): ReactElement {
  switch (block.type) {
    case 'heading':
      return <h2>{block.text}</h2>
    case 'list':
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case 'paragraph':
      return <p>{block.text}</p>
  }
}

export function NewsArticle({ entry: raw, locale = 'zh' }: NewsArticleProps): ReactElement {
  const { entry, isFallback } = localizeNewsEntryWithStatus(raw, locale)
  const copy = NEWS_PAGE_COPY[locale]
  const sources = getNewsSources(raw)
  const applicationTarget = entry.applicationTargetId
    ? resolveConfiguredApplicationTarget(entry.applicationTargetId)
    : undefined
  const status = copy.statusLabels[getNewsStatus(raw)]
  const category = copy.categoryLabels[entry.category]

  return (
    <>
      <PageHero
        description={entry.description}
        eyebrow={`${category} · ${status}`}
        title={entry.title}
      />
      <section className="block">
        <div className="site-container">
          <article className="prose">
            <p className="meta">
              {copy.publishedLabel}:{' '}
              <time dateTime={entry.date}>{formatNewsDate(entry.date, locale)}</time>
              <span aria-hidden="true"> · </span>
              {status}
            </p>

            {entry.body.map((block, index) => (
              <ContentBlockView block={block} key={`${block.type}-${index}`} />
            ))}

            {isFallback ? (
              <p>
                <Link className="text-link" href={`/news/${raw.slug}`}>
                  {copy.fallbackAction}
                </Link>
              </p>
            ) : null}

            {sources.length > 0 ? (
              <section aria-labelledby="news-public-source">
                <h2 id="news-public-source">{copy.sourceTitle}</h2>
                {sources.map((source) => (
                  <div
                    className="mt-4 rounded-2xl border border-[var(--border)] p-5"
                    key={source.url}
                  >
                    <a
                      className="text-link inline-flex min-h-11 items-center"
                      href={source.url}
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {copy.sourceLinkLabel}
                      <span aria-hidden="true"> ↗</span>
                    </a>
                    <dl className="mt-2 grid gap-2 text-sm text-[var(--text-muted)] sm:grid-cols-2">
                      {source.publishedAt ? (
                        <div>
                          <dt className="font-semibold">{copy.sourcePublishedLabel}</dt>
                          <dd>
                            <time dateTime={source.publishedAt}>
                              {formatNewsDate(source.publishedAt, locale)}
                            </time>
                          </dd>
                        </div>
                      ) : null}
                      <div>
                        <dt className="font-semibold">{copy.sourceReviewedLabel}</dt>
                        <dd>
                          <time dateTime={source.reviewedAt}>
                            {formatNewsDate(source.reviewedAt, locale)}
                          </time>
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </section>
            ) : null}

            {entry.applicationTargetId && entry.ctaLabel ? (
              <section aria-labelledby="news-application-route">
                <h2 id="news-application-route">{copy.applicationTitle}</h2>
                <p>{copy.applicationDescription}</p>
                <div className="mt-5">
                  <ExternalApplicationLink
                    className="btn btn--primary"
                    configuredUrl={applicationTarget?.href ?? ''}
                    label={entry.ctaLabel}
                    locale={locale}
                  >
                    {entry.ctaLabel}
                  </ExternalApplicationLink>
                </div>
              </section>
            ) : null}

            {entry.ctaHref && entry.ctaLabel && isSafeExternalUrl(entry.ctaHref) ? (
              <div className="mt-8">
                <a
                  className="btn btn--primary"
                  href={entry.ctaHref}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {entry.ctaLabel}
                  <span aria-hidden="true"> ↗</span>
                </a>
                <small className="mt-2 block text-[var(--text-muted)]">{copy.externalNotice}</small>
              </div>
            ) : null}

            <div className="back">
              <Link className="btn btn--ghost" href={localizePath('/news', locale)}>
                {copy.backLabel}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

export function NewsDetailView({
  entry,
  locale,
}: {
  entry: NewsEntry
  locale: Locale
}): ReactElement {
  return (
    <main id="main-content">
      <JsonLd data={createNewsArticleJsonLd(entry, locale)} />
      <NewsArticle entry={entry} locale={locale} />
    </main>
  )
}

export default async function NewsDetailPage({
  params,
}: NewsDetailPageProps): Promise<ReactElement> {
  const { slug } = await params
  const entry = getPublishedNewsBySlug(slug)

  if (!entry) notFound()

  return <NewsDetailView entry={entry} locale="zh" />
}
