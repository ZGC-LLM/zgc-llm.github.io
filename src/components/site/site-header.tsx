import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { SITE_NAME, SITE_NAVIGATION } from '@/config/site'
import { dict, type Dictionary } from '@/i18n/dictionary'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'
import { LanguageToggle } from './language-toggle'
import { SiteNavigationLink } from './site-navigation-link'

// 导航路由 → 字典 nav 键，用于按 locale 取标签。
const NAV_LABEL_KEYS: Readonly<Record<string, keyof Dictionary['nav']>> = {
  '/alliance': 'alliance',
  '/cybersecurity': 'cybersecurity',
  '/members': 'members',
  '/news': 'news',
  '/working-groups': 'workingGroups',
}

function NavigationLinks({ locale }: { locale: Locale }): ReactElement {
  const nav = dict(locale).nav

  return (
    <>
      {SITE_NAVIGATION.map((item) => {
        const labelKey = NAV_LABEL_KEYS[item.href]

        return (
          <SiteNavigationLink
            href={localizePath(item.href, locale)}
            key={item.href}
            label={labelKey ? nav[labelKey] : item.label}
          />
        )
      })}
    </>
  )
}

export function SiteHeader({ locale }: { locale: Locale }): ReactElement {
  const t = dict(locale).header

  return (
    <header className="site-header">
      <div className="site-container flex min-h-20 items-center justify-between gap-4">
        <Link className="flex min-w-0 items-center gap-3" href={localizePath('/', locale)}>
          <Image
            alt=""
            aria-hidden="true"
            className="brand-logo"
            height={40}
            priority
            src="/brand/llm-alliance-logo.png"
            width={40}
          />
          <span className="max-w-72 whitespace-nowrap text-sm font-semibold leading-5 text-[var(--alliance-text-title)] sm:text-base">
            {SITE_NAME}
          </span>
        </Link>

        <nav aria-label={t.mainNav} className="hidden items-center gap-1 min-[1280px]:flex">
          <NavigationLinks locale={locale} />
        </nav>

        <div className="hidden items-center gap-3 min-[1280px]:flex">
          <Link className="button-primary" href={localizePath('/join', locale)}>
            {t.institutionApply}
          </Link>
          <LanguageToggle locale={locale} />
        </div>

        {/* 窄屏(<1280px)常驻控件簇：「菜单」按钮在任何宽度都伸手可点，
            不再埋进折叠菜单里。桌面端(≥1280px)仍用上方的控件簇。 */}
        <div className="flex items-center gap-2 min-[1280px]:hidden">
          <details className="mobile-menu">
            <summary aria-label={t.openNav} className="mobile-menu__trigger">
              <span aria-hidden="true">{t.menu}</span>
            </summary>
            <div className="mobile-menu__panel">
              <nav aria-label={t.mobileNav} className="grid gap-1">
                <NavigationLinks locale={locale} />
              </nav>
              <div className="mt-4 grid gap-3 border-t border-[var(--alliance-border)] pt-4">
                <Link
                  className="button-primary justify-center"
                  href={localizePath('/join', locale)}
                >
                  {t.institutionApply}
                </Link>
              </div>
              <div className="mt-4 flex justify-center gap-3 border-t border-[var(--alliance-border)] pt-4">
                <LanguageToggle locale={locale} />
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  )
}
