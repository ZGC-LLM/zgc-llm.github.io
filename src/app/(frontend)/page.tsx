import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { HomeView } from '@/components/pages/home-view'
import { SITE_NAME } from '@/config/site'
import { buildAlternates } from '@/i18n/routing'

export const metadata: Metadata = {
  alternates: buildAlternates('/', 'zh'),
  description: '汇聚自主大模型力量，共建开放、安全、协同的产业生态，推动技术创新、产业协同、场景落地与国际合作。',
  title: { absolute: `首页｜${SITE_NAME}` },
}

export default function HomePage(): ReactElement {
  return <HomeView locale="zh" />
}
