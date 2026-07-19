import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { HomeView } from '@/components/pages/home-view'
import { buildPageMetadata } from '@/i18n/routing'

export const metadata: Metadata = buildPageMetadata({
  absoluteTitle: true,
  description:
    "ZGCLLM shares the Alliance's focus areas, collaboration model and ways for organizations to participate.",
  locale: 'en',
  title: 'ZGCLLM',
  zhPath: '/',
})

export default function EnHomePage(): ReactElement {
  return <HomeView locale="en" />
}
