import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { getPublishedNews, localizeNewsEntry, NEWS_ENTRIES } from '@/content/news'
import type { Locale } from '@/i18n/locales'
import { localizePath, buildAlternates } from '@/i18n/routing'
import type { NewsCategory, NewsEntry } from '@/types/content'

export const metadata: Metadata = {
  alternates: buildAlternates('/news', 'zh'),
  description: '查看联盟动态、活动通知、行业观察与阶段成果。',
  title: '新闻动态',
}

const CATEGORY_LABELS: Record<Locale, Readonly<Record<NewsCategory, string>>> = {
  en: { event: 'Event', insight: 'Industry Insight', news: 'Alliance Update', result: 'Stage Result' },
  zh: { event: '活动', insight: '行业观察', news: '联盟动态', result: '阶段成果' },
}

const LIST_STRINGS: Record<Locale, {
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  emptyTitle: string
  emptyBody: string
  readMore: string
  readAria: (title: string) => string
}> = {
  en: {
    emptyBody:
      'News, events and stage results from the Alliance are being prepared. Please stay tuned for updates.',
    emptyTitle: 'Latest updates coming soon',
    heroDescription:
      'Publishing Alliance-confirmed news, events, industry observations and stage results, recording real progress in ecosystem collaboration.',
    heroEyebrow: 'Latest',
    heroTitle: 'News',
    readAria: (title) => `Read ${title}`,
    readMore: 'Read more →',
  },
  zh: {
    emptyBody: '联盟的新闻、活动与阶段成果正在陆续整理，敬请关注后续更新。',
    emptyTitle: '最新动态即将发布',
    heroDescription: '发布经联盟确认的新闻、活动、行业观察与阶段成果，记录生态协作的真实进展。',
    heroEyebrow: '最新动态',
    heroTitle: '新闻动态',
    readAria: (title) => `阅读${title}`,
    readMore: '阅读详情 →',
  },
}

interface NewsListProps {
  entries: readonly NewsEntry[]
  locale?: Locale
}

export function NewsList({ entries, locale = 'zh' }: NewsListProps): ReactElement {
  const publishedEntries = getPublishedNews(entries)
  const t = LIST_STRINGS[locale]
  const categoryLabels = CATEGORY_LABELS[locale]

  if (publishedEntries.length === 0) {
    return (
      <div className="empty" style={{ marginTop: 0 }}>
        <h3>{t.emptyTitle}</h3>
        <p>{t.emptyBody}</p>
      </div>
    )
  }

  return (
    <div className="grid-2 news" style={{ marginTop: 0 }}>
      {publishedEntries.map((raw) => {
        const entry = localizeNewsEntry(raw, locale)
        const href = localizePath(`/news/${entry.slug}`, locale)

        return (
          <article className="card" key={entry.slug}>
            <div className="news__meta">
              <span className="news__cat">{categoryLabels[entry.category]}</span>
              <time className="news__date" dateTime={entry.date}>
                {entry.date}
              </time>
            </div>
            <h3>
              <Link href={href}>{entry.title}</Link>
            </h3>
            <p>{entry.description}</p>
            <Link
              aria-label={t.readAria(entry.title)}
              className="text-link"
              href={href}
              style={{ display: 'inline-block', marginTop: '20px' }}
            >
              {t.readMore}
            </Link>
          </article>
        )
      })}
    </div>
  )
}

export function NewsView({ locale }: { locale: Locale }): ReactElement {
  const t = LIST_STRINGS[locale]

  return (
    <main id="main-content">
      <PageHero description={t.heroDescription} eyebrow={t.heroEyebrow} title={t.heroTitle} />
      <section className="block">
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
