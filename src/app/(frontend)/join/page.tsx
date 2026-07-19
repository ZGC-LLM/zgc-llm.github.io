import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { JoinView } from '@/components/pages/join-view'
import { getAllianceJoinContent } from '@/content/join'
import { buildPageMetadata } from '@/i18n/routing'

const content = getAllianceJoinContent('zh')

export const metadata: Metadata = buildPageMetadata({
  description: content.metadataDescription,
  locale: 'zh',
  title: content.metadataTitle,
  zhPath: '/join',
})

export default function JoinPage(): ReactElement {
  return <JoinView locale="zh" />
}
