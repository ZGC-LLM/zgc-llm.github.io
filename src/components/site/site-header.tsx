import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { SITE_NAME, SITE_NAVIGATION } from '@/config/site'
import { LanguageToggle } from './language-toggle'
import { SiteNavigationLink } from './site-navigation-link'
import { ThemeToggle } from './theme-toggle'

function NavigationLinks(): ReactElement {
  return (
    <>
      {SITE_NAVIGATION.map((item) => (
        <SiteNavigationLink href={item.href} key={item.href} label={item.label} />
      ))}
    </>
  )
}

export function SiteHeader(): ReactElement {
  return (
    <header className="site-header">
      <div className="site-container flex min-h-20 items-center justify-between gap-4">
        <Link className="flex min-w-0 items-center gap-3" href="/">
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

        <nav aria-label="主导航" className="hidden items-center gap-1 min-[1280px]:flex">
          <NavigationLinks />
        </nav>

        <div className="hidden items-center gap-3 min-[1280px]:flex">
          <Link className="button-primary" href="/join">
            机构合作申请
          </Link>
          <ThemeToggle />
          <LanguageToggle />
        </div>

        {/* 窄屏(<1280px)常驻控件簇：主题切换按钮与「菜单」并排，任何宽度都伸手可点，
            不再埋进折叠菜单里。桌面端(≥1280px)仍用上方的控件簇。 */}
        <div className="flex items-center gap-2 min-[1280px]:hidden">
          <ThemeToggle />
          <details className="mobile-menu">
            <summary aria-label="打开网站导航" className="mobile-menu__trigger">
              <span aria-hidden="true">菜单</span>
            </summary>
            <div className="mobile-menu__panel">
              <nav aria-label="移动导航" className="grid gap-1">
                <NavigationLinks />
              </nav>
              <div className="mt-4 grid gap-3 border-t border-[var(--alliance-border)] pt-4">
                <Link className="button-primary justify-center" href="/join">
                  机构合作申请
                </Link>
              </div>
              <div className="mt-4 flex justify-center gap-3 border-t border-[var(--alliance-border)] pt-4">
                <LanguageToggle />
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  )
}
