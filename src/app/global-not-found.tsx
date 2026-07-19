import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { ThemeScript } from '@/components/site/theme-script'
import { SITE_NAME, SITE_URL } from '@/config/site'
import './(frontend)/styles.css'

/**
 * A static host cannot infer the locale of an arbitrary missing pathname at
 * build time. The global fallback is therefore intentionally concise and
 * bilingual, with explicit recovery routes for both locale trees.
 */
export const metadata: Metadata = {
  description: '页面未找到。Page not found. Choose a language to return to the ZGCLLM website.',
  metadataBase: new URL(SITE_URL),
  title: `页面未找到 / Page not found｜${SITE_NAME}`,
}

// Next.js automatically emits a single `noindex` directive for global 404s.
// Do not add `metadata.robots`, which would duplicate the generated directive.

const ERROR_LOCALE_SCRIPT = `(function(){var isEnglish=location.pathname==='/en'||location.pathname.indexOf('/en/')===0;var locale=isEnglish?'en':'zh';var title=isEnglish?${JSON.stringify('Page not found | ZGCLLM')}:${JSON.stringify(`页面未找到｜${SITE_NAME}`)};var root=document.documentElement;root.lang=isEnglish?'en':'zh-CN';root.dataset.errorLocale=locale;document.title=title;if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){document.title=title},{once:true})}})();`

export default function GlobalNotFound(): ReactElement {
  return (
    <html
      data-error-locale="bilingual"
      data-scroll-behavior="smooth"
      lang="zh-CN"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <script dangerouslySetInnerHTML={{ __html: ERROR_LOCALE_SCRIPT }} />
        <style>{`html[data-error-locale='zh'] [data-error-copy='en'],html[data-error-locale='en'] [data-error-copy='zh'],html:not([data-error-locale='bilingual']) [data-error-copy='bilingual']{display:none}`}</style>
      </head>
      <body>
        <a
          className="skip-link"
          data-error-copy="zh"
          href="#main-content"
          hrefLang="zh-CN"
          lang="zh-CN"
        >
          跳到主要内容
        </a>
        <a className="skip-link" data-error-copy="en" href="#main-content" hrefLang="en" lang="en">
          Skip to main content
        </a>
        <header className="site-header">
          <div className="site-container site-header__inner">
            <Link
              aria-label={SITE_NAME}
              className="site-brand"
              data-error-copy="zh"
              href="/"
              hrefLang="zh-CN"
              lang="zh-CN"
            >
              <span className="site-brand__name">{SITE_NAME}</span>
            </Link>
            <Link
              aria-label="ZGCLLM"
              className="site-brand"
              data-error-copy="en"
              href="/en"
              hrefLang="en"
              lang="en"
            >
              <span className="site-brand__name">ZGCLLM</span>
            </Link>
          </div>
        </header>
        <main className="site-container" id="main-content">
          <div className="notfound">
            <p className="eyebrow">404</p>
            <h1>
              <span data-error-copy="zh" lang="zh-CN">
                页面未找到
              </span>
              <span aria-hidden="true" data-error-copy="bilingual">
                {' '}
                /{' '}
              </span>
              <span data-error-copy="en" lang="en">
                Page not found
              </span>
            </h1>
            <p data-error-copy="zh" lang="zh-CN">
              你访问的页面不存在、已移动，或暂未公开。
            </p>
            <p data-error-copy="en" lang="en">
              The page you requested does not exist, has moved, or is not public.
            </p>
            <nav
              aria-label="错误恢复导航"
              className="mt-8 flex flex-wrap gap-3"
              data-error-copy="zh"
              lang="zh-CN"
            >
              <Link className="btn btn--primary" href="/" hrefLang="zh-CN" lang="zh-CN">
                返回中文首页
              </Link>
              <Link className="btn btn--ghost" href="/news" hrefLang="zh-CN" lang="zh-CN">
                查看联盟动态
              </Link>
            </nav>
            <nav
              aria-label="Error recovery navigation"
              className="mt-8 flex flex-wrap gap-3"
              data-error-copy="en"
              lang="en"
            >
              <Link className="btn btn--primary" href="/en" hrefLang="en" lang="en">
                English home
              </Link>
              <Link className="btn btn--ghost" href="/en/news" hrefLang="en" lang="en">
                View Alliance news
              </Link>
            </nav>
          </div>
        </main>
        <footer className="footer">
          <div className="site-container footer__bottom">
            <p data-error-copy="zh" lang="zh-CN">
              © {new Date().getFullYear()} {SITE_NAME}
            </p>
            <p data-error-copy="en" lang="en">
              © {new Date().getFullYear()} ZGCLLM
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
