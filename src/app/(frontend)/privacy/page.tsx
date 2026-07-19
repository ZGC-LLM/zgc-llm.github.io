import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { PrivacyView } from '@/components/pages/privacy-view'
import { PRIVACY_PAGE_COPY } from '@/content/privacy'
import { buildPageMetadata } from '@/i18n/routing'

const copy = PRIVACY_PAGE_COPY.zh

export const metadata: Metadata = buildPageMetadata({
  description: copy.metadataDescription,
  locale: 'zh',
  title: copy.metadataTitle,
  zhPath: '/privacy',
})

export default function PrivacyPage(): ReactElement {
  return <PrivacyView locale="zh" />
}
