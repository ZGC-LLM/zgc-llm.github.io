import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { AllianceView } from '@/components/pages/alliance-view'
import { buildAlternates } from '@/i18n/routing'

export const metadata: Metadata = {
  alternates: buildAlternates('/alliance', 'zh'),
  description: '了解中关村自主大模型产业联盟的宗旨、联盟简介、共同价值与协作机制，及其如何连接产业力量、推动开放安全协同。',
  title: '联盟介绍',
}

export default function AlliancePage(): ReactElement {
  return <AllianceView locale="zh" />
}
