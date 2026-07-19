import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { WorkingGroupsListView } from '@/app/(frontend)/working-groups/page'
import { getWorkingGroupCatalogContent } from '@/content/working-groups'
import { buildPageMetadata } from '@/i18n/routing'

const content = getWorkingGroupCatalogContent('en')

export const metadata: Metadata = buildPageMetadata({
  description: content.metadataDescription,
  locale: 'en',
  title: content.metadataTitle,
  zhPath: '/working-groups',
})

export default function EnWorkingGroupsPage(): ReactElement {
  return <WorkingGroupsListView locale="en" />
}
