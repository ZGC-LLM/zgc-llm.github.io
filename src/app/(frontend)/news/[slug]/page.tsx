import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { JsonLd } from '@/components/site/json-ld'
import { PageHero } from '@/components/site/page-hero'
import { isSafeExternalUrl, SITE_NAME, SITE_URL } from '@/config/site'
import { getPublishedNews, getPublishedNewsBySlug, NEWS_ENTRIES } from '@/content/news'
import type { ContentBlock, NewsEntry } from '@/types/content'

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>
}

// 仅预渲染 generateStaticParams 返回的 slug；未知 slug 一律 404。
// 静态导出（output: export）要求路由无运行时渲染需求，新闻为空时也能正常导出。
export const dynamicParams = false

interface NewsArticleProps {
  entry: NewsEntry
}

export function createNewsStaticParams(
  entries: readonly NewsEntry[],
): { slug: string }[] {
  return getPublishedNews(entries).map((entry) => ({ slug: entry.slug }))
}

export function generateStaticParams(): { slug: string }[] {
  return createNewsStaticParams(NEWS_ENTRIES)
}

export function createNewsMetadata(entry: NewsEntry): Metadata {
  return {
    alternates: { canonical: `/news/${entry.slug}` },
    description: entry.description,
    openGraph: {
      description: entry.description,
      title: entry.title,
      type: 'article',
      url: `/news/${entry.slug}`,
    },
    title: entry.title,
  }
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const entry = getPublishedNewsBySlug(slug)

  if (!entry) notFound()

  return createNewsMetadata(entry)
}

// 新闻详情结构化数据：帮助搜索引擎将其识别为文章并展示富媒体结果。
export function createNewsArticleJsonLd(entry: NewsEntry): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    datePublished: entry.date,
    description: entry.description,
    headline: entry.title,
    inLanguage: 'zh-CN',
    mainEntityOfPage: new URL(`/news/${entry.slug}`, SITE_URL).toString(),
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

export function NewsArticle({ entry }: NewsArticleProps): ReactElement {
  return (
    <>
      <PageHero description={entry.description} eyebrow={entry.category} title={entry.title} />
      <section className="block">
        <div className="site-container">
          <article className="prose">
            <p className="meta">
              发布日期：<time dateTime={entry.date}>{entry.date}</time>
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
              <Link className="btn btn--ghost" href="/news">
                ← 返回新闻中心
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps): Promise<ReactElement> {
  const { slug } = await params
  const entry = getPublishedNewsBySlug(slug)

  if (!entry) notFound()

  return (
    <main id="main-content">
      <JsonLd data={createNewsArticleJsonLd(entry)} />
      <NewsArticle entry={entry} />
    </main>
  )
}
