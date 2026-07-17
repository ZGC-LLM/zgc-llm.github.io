import Link from 'next/link'
import type { ReactElement } from 'react'

import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import './(frontend)/styles.css'

export default function GlobalNotFound(): ReactElement {
  return (
    <html data-scroll-behavior="smooth" lang="zh-CN" suppressHydrationWarning>
      <head>
        {/*
          首帧无闪烁主题脚本：与 (frontend)/layout.tsx 保持一致。
          global-not-found 是独立 HTML 页，不经过分组 layout，需自带脚本，
          否则未知路由 404 页无法应用 data-theme（深色失效）。
          key 字面量须与 src/config/site.ts 的 THEME_STORAGE_KEY 一致（内联脚本无法 import）。
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
        <main className="site-container" id="main-content">
          <div className="notfound">
            <p className="eyebrow">404</p>
            <h1>页面未找到</h1>
            <p>抱歉，你访问的页面不存在、已移动，或暂未公开。</p>
            <div style={{ marginTop: '34px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link className="btn btn--primary" href="/">
                返回首页
              </Link>
              <Link className="btn btn--ghost" href="/news">
                查看新闻动态
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
