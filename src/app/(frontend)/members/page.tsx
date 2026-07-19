import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { MembersDirectory, MembersView } from '@/components/pages/members-view'
import { buildAlternates } from '@/i18n/routing'

export { MembersDirectory }

export const metadata: Metadata = {
  alternates: buildAlternates('/members', 'zh'),
  description: '展示经公开授权的联盟成员与生态伙伴，连接产业、科研与生态协作力量。',
  title: '联盟成员伙伴',
}

export default function MembersPage(): ReactElement {
  return <MembersView locale="zh" />
}
