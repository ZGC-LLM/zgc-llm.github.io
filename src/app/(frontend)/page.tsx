import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { HomeView } from '@/components/pages/home-view'
import { buildPageMetadata } from '@/i18n/routing'

export const metadata: Metadata = buildPageMetadata({
  absoluteTitle: true,
  description:
    '中关村自主大模型产业联盟聚焦大模型技术与产业协作，公开联盟方向、协作机制与参与路径。',
  locale: 'zh',
  title: '中关村自主大模型产业联盟',
  zhPath: '/',
})

export default function HomePage(): ReactElement {
  return <HomeView locale="zh" />
}
