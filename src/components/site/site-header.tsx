import Link from 'next/link'
import type { ReactElement } from 'react'

import { SITE_NAME, SITE_NAVIGATION } from '@/config/site'
import { SiteNavigationLink } from './site-navigation-link'

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
      <div className="site-container flex min-h-20 items-center justify-between gap-6">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <span aria-hidden="true" className="brand-mark">
            中
          </span>
          <span className="max-w-72 text-sm font-semibold leading-5 text-[var(--alliance-text-title)] sm:text-base">
            {SITE_NAME}
          </span>
        </Link>

        <nav aria-label="主导航" className="hidden items-center gap-1 xl:flex">
          <NavigationLinks />
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link className="button-secondary" href="/professionals">
            专业用户加入
          </Link>
          <Link className="button-primary" href="/join">
            申请生态共建
          </Link>
        </div>

        <details className="mobile-menu xl:hidden">
          <summary aria-label="打开网站导航" className="mobile-menu__trigger">
            <span aria-hidden="true">菜单</span>
          </summary>
          <div className="mobile-menu__panel">
            <nav aria-label="移动导航" className="grid gap-1">
              <NavigationLinks />
            </nav>
            <div className="mt-4 grid gap-3 border-t border-[var(--alliance-border)] pt-4">
              <Link className="button-secondary justify-center" href="/professionals">
                专业用户加入
              </Link>
              <Link className="button-primary justify-center" href="/join">
                申请生态共建
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  )
}
