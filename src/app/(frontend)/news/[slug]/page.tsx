import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { JsonLd } from '@/components/site/json-ld'
import { PageHero } from '@/components/site/page-hero'
import { isSafeExternalUrl, SITE_NAME, SITE_URL } from '@/config/site'
import {
  getPublishedNews,
  getPublishedNewsBySlug,
  localizeNewsEntry,
  NEWS_ENTRIES,
} from '@/content/news'
import { HTML_LANG, type Locale } from '@/i18n/locales'
import { buildAlternates, localizePath } from '@/i18n/routing'
import type { ContentBlock, NewsEntry } from '@/types/content'

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>
}

// 仅预渲染 generateStaticParams 返回的 slug；未知 slug 一律 404。
export const dynamicParams = false

interface NewsArticleProps {
  entry: NewsEntry
  locale?: Locale
}

const DETAIL_STRINGS: Record<Locale, { publishedLabel: string; back: string }> = {
  en: { back: '← Back to news', publishedLabel: 'Published: ' },
  zh: { back: '← 返回新闻中心', publishedLabel: '发布日期：' },
}

export function createNewsStaticParams(entries: readonly NewsEntry[]): { slug: string }[] {
  return getPublishedNews(entries).map((entry) => ({ slug: entry.slug }))
}

export function generateStaticParams(): { slug: string }[] {
  return createNewsStaticParams(NEWS_ENTRIES)
}

export function createNewsMetadata(entry: NewsEntry, locale: Locale = 'zh'): Metadata {
  const localized = localizeNewsEntry(entry, locale)

  return {
    alternates: buildAlternates(`/news/${entry.slug}`, locale),
    description: localized.description,
    openGraph: {
      description: localized.description,
      title: localized.title,
      type: 'article',
      url: localizePath(`/news/${entry.slug}`, locale),
    },
    title: localized.title,
  }
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const entry = getPublishedNewsBySlug(slug)

  if (!entry) notFound()

  return createNewsMetadata(entry)
}

// 新闻详情结构化数据：帮助搜索引擎将其识别为文章并展示富媒体结果。
export function createNewsArticleJsonLd(
  entry: NewsEntry,
  locale: Locale = 'zh',
): Record<string, unknown> {
  const localized = localizeNewsEntry(entry, locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    datePublished: entry.date,
    description: localized.description,
    headline: localized.title,
    inLanguage: HTML_LANG[locale],
    mainEntityOfPage: new URL(localizePath(`/news/${entry.slug}`, locale), SITE_URL).toString(),
    publisher: {
      '@type': 'Organization',
      logo: new URL('/brand/llm-alliance-logo.png', SITE_URL).toString(),
      name: SITE_NAME,
    },
  }
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
  const entry = localizeNewsEntry(raw, locale)
  const t = DETAIL_STRINGS[locale]

  return (
    <>
      <PageHero description={entry.description} eyebrow={entry.category} title={entry.title} />
      <section className="block">
        <div className="site-container">
          <article className="prose">
            <p className="meta">
              {t.publishedLabel}
              <time dateTime={entry.date}>{entry.date}</time>
            </p>
            {entry.body.map((block, index) => (
              <ContentBlockView block={block} key={`${block.type}-${index}`} />
            ))}
            {entry.ctaHref && entry.ctaLabel && isSafeExternalUrl(entry.ctaHref) ? (
              <p className="cta">
                <a
                  className="btn btn--primary"
                  href={entry.ctaHref}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {entry.ctaLabel}
                </a>
              </p>
            ) : null}
            <div className="back">
              <Link className="btn btn--ghost" href={localizePath('/news', locale)}>
                {t.back}
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

export default async function NewsDetailPage({ params }: NewsDetailPageProps): Promise<ReactElement> {
  const { slug } = await params
  const entry = getPublishedNewsBySlug(slug)

  if (!entry) notFound()

  return <NewsDetailView entry={entry} locale="zh" />
}
