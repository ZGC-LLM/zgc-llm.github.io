import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { CybersecurityView } from '@/components/pages/cybersecurity-view'
import { getCybersecurityEcosystem } from '@/content/cybersecurity'
import { buildAlternates } from '@/i18n/routing'

const PAGE_DESCRIPTION =
  'Connecting professional users, institutional partners, real scenarios and capability evaluation to build a vendor-neutral, governable and continuously evolving cybersecurity industry ecosystem.'

export const metadata: Metadata = {
  alternates: buildAlternates('/cybersecurity', 'en'),
  description: PAGE_DESCRIPTION,
  openGraph: {
    description: PAGE_DESCRIPTION,
    title: getCybersecurityEcosystem('en').title,
    url: '/en/cybersecurity',
  },
  title: getCybersecurityEcosystem('en').title,
}

export default function EnCybersecurityPage(): ReactElement {
  return <CybersecurityView locale="en" />
}
