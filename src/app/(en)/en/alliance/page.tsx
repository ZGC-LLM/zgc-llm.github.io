import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { AllianceView } from '@/components/pages/alliance-view'
import { buildAlternates } from '@/i18n/routing'

// 英文联盟页：已做正文英文初稿（AllianceView locale="en"），不再回退中文。
export const metadata: Metadata = {
  alternates: buildAlternates('/alliance', 'en'),
  description:
    'Learn about the Zhongguancun Self-Reliant Large Model Industry Alliance — its purpose, overview, shared values and collaboration mechanisms.',
  title: 'About the Alliance',
}

export default function EnAlliancePage(): ReactElement {
  return <AllianceView locale="en" />
}
