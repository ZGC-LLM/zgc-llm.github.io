import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { SITE_NAME, SITE_NAVIGATION } from '@/config/site'
import { dict, type Dictionary } from '@/i18n/dictionary'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'
import { LanguageToggle } from './language-toggle'
import { NavGroup } from './nav-group'
import { SiteNavigationLink } from './site-navigation-link'

// 叶子导航路由 → 字典 nav 键，用于按 locale 取标签。
const NAV_LABEL_KEYS: Readonly<Record<string, keyof Dictionary['nav']>> = {
  '/alliance': 'alliance',
  '/cybersecurity': 'cybersecurity',
  '/members': 'members',
  '/news': 'news',
  '/working-groups': 'workingGroups',
}

// 分组节点标题 → 字典键（按 site.ts 中稳定的 zh 字面 label 索引）。
const NAV_GROUP_TITLE_KEYS: Readonly<Record<string, keyof Dictionary['nav']>> = {
  成员伙伴: 'members',
}

// 分组子项 href → 字典键。与 NAV_LABEL_KEYS 独立：解决「工作组成员」子项复用
// /working-groups 却需与顶层「工作组」不同标签的 href 键冲突（见 design §3.2）。
const NAV_GROUP_CHILD_LABEL_KEYS: Readonly<Record<string, keyof Dictionary['nav']>> = {
  '/members': 'allianceMembers',
  '/working-groups': 'workingGroupMembers',
}

function NavigationLinks({
  locale,
  variant,
}: {
  locale: Locale
  variant: 'desktop' | 'mobile'
}): ReactElement {
  const nav = dict(locale).nav
  const { expandSubmenu } = dict(locale).header

  return (
    <>
      {SITE_NAVIGATION.map((item) => {
        if (item.children) {
          const titleKey = NAV_GROUP_TITLE_KEYS[item.label]

          return (
            <NavGroup
              expandLabel={expandSubmenu}
              href={localizePath(item.href ?? '/', locale)}
              items={item.children.map((child) => {
                const childKey = child.href ? NAV_GROUP_CHILD_LABEL_KEYS[child.href] : undefined

                return {
                  href: localizePath(child.href ?? '/', locale),
                  label: childKey ? nav[childKey] : child.label,
                }
              })}
              key={item.label}
              label={titleKey ? nav[titleKey] : item.label}
              variant={variant}
            />
          )
        }

        const labelKey = item.href ? NAV_LABEL_KEYS[item.href] : undefined

        return (
          <SiteNavigationLink
            href={localizePath(item.href ?? '/', locale)}
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

        <nav aria-label={t.mainNav} className="hidden items-center gap-1 min-[1024px]:flex">
          <NavigationLinks locale={locale} variant="desktop" />
        </nav>

        <div className="hidden items-center gap-3 min-[1024px]:flex">
          <Link className="button-primary" href={localizePath('/join', locale)}>
            {t.institutionApply}
          </Link>
          <LanguageToggle locale={locale} />
        </div>

        {/* 窄屏(<1024px)常驻控件簇：「菜单」按钮在任何宽度都伸手可点，
            不再埋进折叠菜单里。桌面端(≥1024px)仍用上方的控件簇。 */}
        <div className="flex items-center gap-2 min-[1024px]:hidden">
          <details className="mobile-menu">
            <summary aria-label={t.openNav} className="mobile-menu__trigger">
              <span aria-hidden="true">{t.menu}</span>
            </summary>
            <div className="mobile-menu__panel">
              <nav aria-label={t.mobileNav} className="grid gap-1">
                <NavigationLinks locale={locale} variant="mobile" />
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
