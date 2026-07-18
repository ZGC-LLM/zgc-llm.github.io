'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactElement } from 'react'

import { dict } from '@/i18n/dictionary'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'

/**
 * 语言切换：单按钮，显示「目标语言」，点击跳转到对应语言的同一页面。
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
  const targetLabel = otherLocale === 'en' ? t.en : t.zh

  return (
    <Link
      aria-label={t.label}
      className="toggle toggle--lang"
      href={targetHref}
      hrefLang={otherLocale}
    >
      <svg
        aria-hidden="true"
        className="toggle__globe"
        fill="none"
        height="16"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
        width="16"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" />
      </svg>
      {targetLabel}
    </Link>
  )
}
