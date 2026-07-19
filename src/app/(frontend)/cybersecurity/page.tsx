import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { CybersecurityView } from '@/components/pages/cybersecurity-view'
import { getCybersecurityPageContent } from '@/content/cybersecurity'
import { buildPageMetadata } from '@/i18n/routing'

const content = getCybersecurityPageContent('zh')

export const metadata: Metadata = buildPageMetadata({
  description: content.metadataDescription,
  locale: 'zh',
  title: content.title,
  zhPath: '/cybersecurity',
})

export default function CybersecurityPage(): ReactElement {
  return <CybersecurityView locale="zh" />
}
