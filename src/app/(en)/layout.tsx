import type { Metadata } from 'next'
import React from 'react'

import { SiteChrome } from '@/components/site/site-chrome'
import { ThemeScript } from '@/components/site/theme-script'
import { buildRootMetadata } from '@/i18n/routing'
import '../(frontend)/styles.css'

// 英文子树根布局（多根布局模式）：渲染 <html lang="en"> + SiteChrome(locale="en")。
// 与中文根布局仅 lang 与 locale 不同，chrome 逻辑不重复。
export const metadata: Metadata = buildRootMetadata('en')

export default function EnRootLayout(props: { children: React.ReactNode }): React.ReactElement {
  const { children } = props

  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <SiteChrome locale="en">{children}</SiteChrome>
      </body>
    </html>
  )
}
