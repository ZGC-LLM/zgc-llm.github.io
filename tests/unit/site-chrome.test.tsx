import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { SiteChrome } from '@/components/site/site-chrome'

vi.mock('next/navigation', () => ({ usePathname: () => '/alliance' }))

afterEach(cleanup)

describe('SiteChrome', () => {
  it('renders the skip link, site-level JSON-LD, header, footer and page content', () => {
    const { container } = render(
      <SiteChrome locale="zh">
        <main id="main-content">页面正文</main>
      </SiteChrome>,
    )

    expect(screen.getByRole('link', { name: '跳到主要内容' }).getAttribute('href')).toBe(
      '#main-content',
    )
    expect(container.querySelector('script[type="application/ld+json"]')).not.toBeNull()
    expect(screen.getAllByText('中关村自主大模型产业联盟').length).toBeGreaterThan(0)
    expect(screen.getByText('页面正文')).toBeTruthy()
  })

  it('uses the English skip-to-content label for the en locale', () => {
    render(
      <SiteChrome locale="en">
        <main>content</main>
      </SiteChrome>,
    )

    expect(screen.getByRole('link', { name: 'Skip to main content' })).toBeTruthy()
  })
})
