import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'

import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'

interface NotFoundCopy {
  description: string
  homeAction: string
  metadataDescription: string
  metadataTitle: string
  navigationLabel: string
  newsAction: string
  privacyAction: string
  title: string
}

const NOT_FOUND_COPY: Readonly<Record<Locale, NotFoundCopy>> = {
  en: {
    description:
      'The page you requested does not exist, has moved or is not available for publication. Use one of these verified routes to continue.',
    homeAction: 'Return to the home page',
    metadataDescription: 'The requested ZGCLLM page could not be found.',
    metadataTitle: 'Page not found',
    navigationLabel: 'Error recovery navigation',
    newsAction: 'View Alliance updates',
    privacyAction: 'Read the application notice',
    title: 'Page not found',
  },
  zh: {
    description: '您访问的页面不存在、已移动，或暂未达到公开条件。可通过以下已确认路径继续浏览。',
    homeAction: '返回首页',
    metadataDescription: '未找到请求的中关村自主大模型产业联盟官网页面。',
    metadataTitle: '页面未找到',
    navigationLabel: '错误恢复导航',
    newsAction: '查看联盟动态',
    privacyAction: '查看申请信息说明',
    title: '页面未找到',
  },
}

/** A missing route must never inherit the canonical URL of a valid parent page. */
export function notFoundMetadata(locale: Locale): Metadata {
  const copy = NOT_FOUND_COPY[locale]

  return {
    alternates: { canonical: null },
    description: copy.metadataDescription,
    robots: { follow: false, index: false },
    title: copy.metadataTitle,
  }
}

export function NotFoundView({ locale }: { locale: Locale }): ReactElement {
  const copy = NOT_FOUND_COPY[locale]

  return (
    <main className="site-container" id="main-content" tabIndex={-1}>
      <div className="notfound">
        <p className="eyebrow">404</p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
        <nav aria-label={copy.navigationLabel} className="mt-8 flex flex-wrap gap-3">
          <Link className="btn btn--primary" href={localizePath('/', locale)}>
            {copy.homeAction}
          </Link>
          <Link className="btn btn--ghost" href={localizePath('/news', locale)}>
            {copy.newsAction}
          </Link>
          <Link className="btn btn--ghost" href={localizePath('/privacy', locale)}>
            {copy.privacyAction}
          </Link>
        </nav>
      </div>
    </main>
  )
}
