'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactElement } from 'react'

import { dict } from '@/i18n/dictionary'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'

/**
 * 语言切换：跳转到「对应语言的同一页面」。
 * 从当前路径去掉/加上 `/en` 前缀得到中文规范路径，再 localizePath 到另一语言。
 * 纯前端路径映射，目标始终站内派生（无开放重定向）。
 */
export function LanguageToggle({ locale }: { locale: Locale }): ReactElement {
  const pathname = usePathname()
  const t = dict(locale).languageToggle

  const raw = pathname.replace(/\/+$/, '') || '/'
  const zhPath = raw === '/en' ? '/' : raw.startsWith('/en/') ? raw.slice(3) : raw
  const otherLocale: Locale = locale === 'zh' ? 'en' : 'zh'
  const targetHref = localizePath(zhPath, otherLocale)
  const targetLanguage = otherLocale === 'en' ? 'English' : '中文'

  return (
    <span className="language-toggle">
      <Link
        aria-label={`${t.label}: ${targetLanguage}`}
        className="toggle toggle--seg"
        href={targetHref}
        hrefLang={otherLocale === 'zh' ? 'zh-CN' : 'en'}
      >
        <svg
          aria-hidden="true"
          className="toggle__globe"
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
          width="16"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" x2="22" y1="12" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
        </svg>
        <span aria-hidden="true" className={locale === 'zh' ? 'on' : undefined} lang="zh-CN">
          {t.zh}
        </span>
        <span aria-hidden="true" className={locale === 'en' ? 'on' : undefined} lang="en">
          {t.en}
        </span>
      </Link>
    </span>
  )
}
