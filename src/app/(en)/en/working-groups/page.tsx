import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { WorkingGroupsListView } from '@/app/(frontend)/working-groups/page'
import { buildAlternates } from '@/i18n/routing'

export const metadata: Metadata = {
  alternates: buildAlternates('/working-groups', 'en'),
  description: 'Learn about the Alliance working groups, public collaboration directions and ways to join.',
  title: 'Working Groups',
}

export default function EnWorkingGroupsPage(): ReactElement {
  return <WorkingGroupsListView locale="en" />
}
