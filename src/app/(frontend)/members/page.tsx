import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { MembersDirectory, MembersView } from '@/components/pages/members-view'
import { MEMBERS_PAGE_COPY } from '@/content/members'
import { buildPageMetadata } from '@/i18n/routing'

export { MembersDirectory }

const copy = MEMBERS_PAGE_COPY.zh

export const metadata: Metadata = buildPageMetadata({
  description: copy.metadataDescription,
  locale: 'zh',
  title: copy.metadataTitle,
  zhPath: '/members',
})

export default function MembersPage(): ReactElement {
  return <MembersView locale="zh" />
}
