import type { Metadata } from 'next'
import React from 'react'

import { SiteChrome } from '@/components/site/site-chrome'
import { ThemeScript } from '@/components/site/theme-script'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/config/site'
import { buildAlternates } from '@/i18n/routing'
import './styles.css'

export const metadata: Metadata = {
  alternates: buildAlternates('/', 'zh'),
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description: SITE_DESCRIPTION,
    locale: 'zh_CN',
    siteName: SITE_NAME,
    title: SITE_NAME,
    type: 'website',
    url: '/',
  },
  title: {
    default: `${SITE_NAME}｜官方网站`,
    template: `%s｜${SITE_NAME}`,
  },
}

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
