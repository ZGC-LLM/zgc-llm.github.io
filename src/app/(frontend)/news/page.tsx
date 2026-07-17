import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { getPublishedNews, NEWS_ENTRIES } from '@/content/news'
import type { NewsCategory, NewsEntry } from '@/types/content'

export const metadata: Metadata = {
  alternates: { canonical: '/news' },
  description: '查看联盟动态、活动通知、行业观察与阶段成果。',
  title: '新闻动态',
}

const NEWS_CATEGORY_LABELS: Readonly<Record<NewsCategory, string>> = {
  event: '活动',
  insight: '行业观察',
  news: '联盟动态',
  result: '阶段成果',
}

interface NewsListProps {
  entries: readonly NewsEntry[]
}

export function NewsList({ entries }: NewsListProps): ReactElement {
  const publishedEntries = getPublishedNews(entries)

  if (publishedEntries.length === 0) {
    return (
      <div className="empty" style={{ marginTop: 0 }}>
        <h3>最新动态即将发布</h3>
        <p>联盟的新闻、活动与阶段成果正在陆续整理，敬请关注后续更新。</p>
      </div>
    )
  }

  return (
    <div className="grid-2 news" style={{ marginTop: 0 }}>
      {publishedEntries.map((entry) => (
        <article className="card" key={entry.slug}>
          <div className="news__meta">
            <span className="news__cat">{NEWS_CATEGORY_LABELS[entry.category]}</span>
            <time className="news__date" dateTime={entry.date}>
              {entry.date}
            </time>
          </div>
          <h3>
            <Link href={`/news/${entry.slug}`}>{entry.title}</Link>
          </h3>
          <p>{entry.description}</p>
          <Link
            aria-label={`阅读${entry.title}`}
            className="text-link"
            href={`/news/${entry.slug}`}
            style={{ display: 'inline-block', marginTop: '20px' }}
          >
            阅读详情 →
          </Link>
        </article>
      ))}
    </div>
  )
}

export default function NewsPage(): ReactElement {
  return (
    <main id="main-content">
      <PageHero
        description="发布经联盟确认的新闻、活动、行业观察与阶段成果，记录生态协作的真实进展。"
        eyebrow="最新动态"
        title="新闻动态"
      />
      <section className="block">
        <div className="site-container">
          <NewsList entries={NEWS_ENTRIES} />
        </div>
      </section>
    </main>
  )
}
