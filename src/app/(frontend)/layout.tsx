import type { Metadata } from 'next'
import React from 'react'

import { SiteChrome } from '@/components/site/site-chrome'
import { ThemeScript } from '@/components/site/theme-script'
import { buildRootMetadata } from '@/i18n/routing'
import './styles.css'

export const metadata: Metadata = buildRootMetadata('zh')

export default function RootLayout(props: { children: React.ReactNode }): React.ReactElement {
  const { children } = props

  return (
    <html data-scroll-behavior="smooth" lang="zh-CN" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <SiteChrome locale="zh">{children}</SiteChrome>
      </body>
    </html>
  )
}
