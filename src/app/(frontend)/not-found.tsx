import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { notFoundMetadata, NotFoundView } from '@/components/pages/not-found-view'

export const metadata: Metadata = notFoundMetadata('zh')

export default function NotFound(): ReactElement {
  return <NotFoundView locale="zh" />
}
