'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactElement } from 'react'

import type { NavigationItem } from '@/types/content'

interface SiteNavigationLinkProps extends NavigationItem {
  /** Duplicate destinations inside a grouped submenu must not announce a second current page. */
  showCurrent?: boolean
}

export function SiteNavigationLink({
  href,
  label,
  showCurrent = true,
}: SiteNavigationLinkProps): ReactElement {
  const pathname = usePathname()
  // Leaf nodes (used by this component) always have href
  const resolvedHref = href ?? '/'
  const isCurrent =
    showCurrent && (pathname === resolvedHref || pathname.startsWith(`${resolvedHref}/`))

  return (
    <Link
      aria-current={isCurrent ? 'page' : undefined}
      className="site-nav-link"
      href={resolvedHref}
    >
      {label}
    </Link>
  )
}
