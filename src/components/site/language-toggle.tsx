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

  return (
    <span className="language-toggle">
      <Link aria-label={t.label} className="toggle toggle--seg" href={targetHref}>
        <span className={locale === 'zh' ? 'on' : undefined}>{t.zh}</span>
        <span className={locale === 'en' ? 'on' : undefined}>{t.en}</span>
      </Link>
    </span>
  )
}
