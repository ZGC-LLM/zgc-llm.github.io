import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { AllianceView } from '@/components/pages/alliance-view'
import { buildPageMetadata } from '@/i18n/routing'

export const metadata: Metadata = buildPageMetadata({
  description: '了解中关村自主大模型产业联盟的定位、共同价值、协作机制、重点方向与参与方式。',
  locale: 'zh',
  title: '联盟介绍',
  zhPath: '/alliance',
})

export default function AlliancePage(): ReactElement {
  return <AllianceView locale="zh" />
}
