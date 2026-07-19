import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { AllianceView } from '@/components/pages/alliance-view'
import { buildPageMetadata } from '@/i18n/routing'

export const metadata: Metadata = buildPageMetadata({
  description:
    "Learn about the Alliance's purpose, shared principles, collaboration model, focus areas and ways to participate.",
  locale: 'en',
  title: 'About the Alliance',
  zhPath: '/alliance',
})

export default function EnAlliancePage(): ReactElement {
  return <AllianceView locale="en" />
}
