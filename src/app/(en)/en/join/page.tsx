import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { JoinView } from '@/components/pages/join-view'
import { buildAlternates } from '@/i18n/routing'

export const metadata: Metadata = {
  alternates: buildAlternates('/join', 'en'),
  description:
    'Learn about the value, ways to participate, collaboration process and FAQs for institutions joining the Alliance ecosystem.',
  title: 'Institutional Ecosystem Co-building',
}

export default function EnJoinPage(): ReactElement {
  return <JoinView locale="en" />
}
