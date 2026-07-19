import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { CybersecurityView } from '@/components/pages/cybersecurity-view'
import { getCybersecurityEcosystem } from '@/content/cybersecurity'
import { buildAlternates } from '@/i18n/routing'

const PAGE_DESCRIPTION =
  '连接专业用户、机构伙伴、真实场景与能力评测，共建厂商中立、安全可治理、可持续演进的网络安全产业生态。'

export const metadata: Metadata = {
  alternates: buildAlternates('/cybersecurity', 'zh'),
  description: PAGE_DESCRIPTION,
  openGraph: {
    description: PAGE_DESCRIPTION,
    title: getCybersecurityEcosystem('zh').title,
    url: '/cybersecurity',
  },
  title: getCybersecurityEcosystem('zh').title,
}

export default function CybersecurityPage(): ReactElement {
  return <CybersecurityView locale="zh" />
}
