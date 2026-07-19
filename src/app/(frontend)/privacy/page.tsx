import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { PrivacyView } from '@/components/pages/privacy-view'
import { buildAlternates } from '@/i18n/routing'

export const metadata: Metadata = {
  alternates: buildAlternates('/privacy', 'zh'),
  description: '了解在官网提交合作申请时，您的信息与隐私如何被处理和保护。',
  title: '隐私说明',
}

export default function PrivacyPage(): ReactElement {
  return <PrivacyView locale="zh" />
}
