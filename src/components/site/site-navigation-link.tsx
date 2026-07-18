'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactElement } from 'react'

import type { NavigationItem } from '@/types/content'

export function SiteNavigationLink({ href, label }: NavigationItem): ReactElement {
  const pathname = usePathname()
  // Leaf nodes (used by this component) always have href
  const resolvedHref = href ?? '/'
  const isCurrent = pathname === resolvedHref || pathname.startsWith(`${resolvedHref}/`)

  return (
    <Link aria-current={isCurrent ? 'page' : undefined} className="site-nav-link" href={resolvedHref}>
      {label}
    </Link>
  )
}
