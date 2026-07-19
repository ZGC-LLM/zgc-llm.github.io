import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { JoinView } from '@/components/pages/join-view'
import { getAllianceJoinContent } from '@/content/join'
import { buildPageMetadata } from '@/i18n/routing'

const content = getAllianceJoinContent('en')

export const metadata: Metadata = buildPageMetadata({
  description: content.metadataDescription,
  locale: 'en',
  title: content.metadataTitle,
  zhPath: '/join',
})

export default function EnJoinPage(): ReactElement {
  return <JoinView locale="en" />
}
