import type { Metadata } from 'next'
import React from 'react'

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/config/site'
import './styles.css'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}｜官方网站`,
    template: `%s｜${SITE_NAME}`,
  },
}

export default function RootLayout(props: { children: React.ReactNode }): React.ReactElement {
  const { children } = props

  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
