import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { MembersView } from '@/components/pages/members-view'
import { MEMBERS_PAGE_COPY } from '@/content/members'
import { buildPageMetadata } from '@/i18n/routing'

const copy = MEMBERS_PAGE_COPY.en

export const metadata: Metadata = buildPageMetadata({
  description: copy.metadataDescription,
  locale: 'en',
  title: copy.metadataTitle,
  zhPath: '/members',
})

export default function EnMembersPage(): ReactElement {
  return <MembersView locale="en" />
}
