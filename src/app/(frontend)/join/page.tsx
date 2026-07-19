import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { JoinView } from '@/components/pages/join-view'
import { buildAlternates } from '@/i18n/routing'

export const metadata: Metadata = {
  alternates: buildAlternates('/join', 'zh'),
  description: '了解机构参与联盟生态共建的合作价值、参与方式、协作流程与常见问题。',
  title: '机构生态共建',
}

export default function JoinPage(): ReactElement {
  return <JoinView locale="zh" />
}
