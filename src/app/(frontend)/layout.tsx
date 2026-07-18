import type { Metadata } from 'next'
import React from 'react'

import { JsonLd } from '@/components/site/json-ld'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/config/site'
import './styles.css'

// 站级结构化数据：全站页面统一注入 Organization + WebSite，
// 供搜索引擎理解官网主体与站点身份（Rich Results / 知识面板）。
const siteStructuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    logo: new URL('/brand/llm-alliance-logo.png', SITE_URL).toString(),
    name: SITE_NAME,
    url: SITE_URL,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    inLanguage: 'zh-CN',
    name: SITE_NAME,
    url: SITE_URL,
  },
]

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
          主题跟随系统 prefers-color-scheme（已移除深浅切换 UI）。
          顺带清理历史遗留的 localStorage['zgcllm-theme']，
          避免老访客被此前的手动选择永久锁定、无法回到跟随系统。
          try/catch 兜底隐私模式 localStorage 抛错。
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{localStorage.removeItem('zgcllm-theme')}catch(e){}document.documentElement.dataset.theme=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'})();`,
          }}
        />
      </head>
      <body>
        <JsonLd data={siteStructuredData} />
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
