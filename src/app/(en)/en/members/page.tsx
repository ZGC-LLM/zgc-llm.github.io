import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { MembersView } from '@/components/pages/members-view'
import { buildAlternates } from '@/i18n/routing'

export const metadata: Metadata = {
  alternates: buildAlternates('/members', 'en'),
  description:
    'Publicly authorized Alliance members and ecosystem partners, connecting industry, research and ecosystem collaboration.',
  title: 'Members',
}

export default function EnMembersPage(): ReactElement {
  return <MembersView locale="en" />
}
