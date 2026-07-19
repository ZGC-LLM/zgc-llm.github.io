import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { PrivacyView } from '@/components/pages/privacy-view'
import { buildAlternates } from '@/i18n/routing'

export const metadata: Metadata = {
  alternates: buildAlternates('/privacy', 'en'),
  description:
    'Understand how your information and privacy are handled and protected when submitting a partnership application on this site.',
  title: 'Privacy Notice',
}

export default function EnPrivacyPage(): ReactElement {
  return <PrivacyView locale="en" />
}
