import type { Metadata } from 'next'
import React from 'react'

import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/config/site'
import './styles.css'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
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
        {/*
          首帧无闪烁主题脚本：在 <body> 绘制前同步设定 html[data-theme]。
          优先级 localStorage['zgcllm-theme'] > prefers-color-scheme > 'light'。
          key 字面量须与 src/config/site.ts 的 THEME_STORAGE_KEY 保持一致
          （内联脚本无法 import）。try/catch 兜底隐私模式 localStorage 抛错。
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('zgcllm-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}})();`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
