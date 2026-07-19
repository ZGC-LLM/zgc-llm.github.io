import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { notFoundMetadata, NotFoundView } from '@/components/pages/not-found-view'

export const metadata: Metadata = notFoundMetadata('en')

export default function EnNotFound(): ReactElement {
  return <NotFoundView locale="en" />
}
