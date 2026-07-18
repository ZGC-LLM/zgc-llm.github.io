import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import {
  createNewsMetadata,
  generateStaticParams,
  NewsDetailView,
} from '@/app/(frontend)/news/[slug]/page'
import { getPublishedNewsBySlug } from '@/content/news'

interface EnNewsDetailProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export { generateStaticParams }

export async function generateMetadata({ params }: EnNewsDetailProps): Promise<Metadata> {
  const { slug } = await params
  const entry = getPublishedNewsBySlug(slug)

  if (!entry) notFound()

  return createNewsMetadata(entry, 'en')
}

export default async function EnNewsDetailPage({ params }: EnNewsDetailProps): Promise<ReactElement> {
  const { slug } = await params
  const entry = getPublishedNewsBySlug(slug)

  if (!entry) notFound()

  return <NewsDetailView entry={entry} locale="en" />
}
