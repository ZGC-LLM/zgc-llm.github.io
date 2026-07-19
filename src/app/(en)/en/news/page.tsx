import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { NewsView } from '@/app/(frontend)/news/page'
import { buildAlternates } from '@/i18n/routing'

export const metadata: Metadata = {
  alternates: buildAlternates('/news', 'en'),
  description: 'Alliance updates, event notices, industry observations and stage results.',
  title: 'News',
}

export default function EnNewsPage(): ReactElement {
  return <NewsView locale="en" />
}
