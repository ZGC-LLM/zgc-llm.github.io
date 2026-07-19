import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { NewsView } from '@/app/(frontend)/news/page'
import { NEWS_PAGE_COPY } from '@/content/news'
import { buildPageMetadata } from '@/i18n/routing'

const copy = NEWS_PAGE_COPY.en

export const metadata: Metadata = buildPageMetadata({
  description: copy.metadataDescription,
  locale: 'en',
  title: copy.metadataTitle,
  zhPath: '/news',
})

export default function EnNewsPage(): ReactElement {
  return <NewsView locale="en" />
}
