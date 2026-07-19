import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { LanguageToggle } from '@/components/site/language-toggle'

const navigationState = vi.hoisted(() => ({ pathname: '/cybersecurity' }))

vi.mock('next/navigation', () => ({ usePathname: () => navigationState.pathname }))

afterEach(() => {
  cleanup()
  navigationState.pathname = '/cybersecurity'
})

describe('LanguageToggle', () => {
  it.each([
    ['zh', '/', '/en', 'en'],
    ['zh', '/cybersecurity', '/en/cybersecurity', 'en'],
    ['en', '/en', '/', 'zh-CN'],
    ['en', '/en/cybersecurity', '/cybersecurity', 'zh-CN'],
    ['en', '/en/members/', '/members', 'zh-CN'],
  ] as const)('maps %s pathname %s to the same page in the other locale', (locale, pathname, href, hrefLang) => {
    navigationState.pathname = pathname
    render(<LanguageToggle locale={locale} />)

    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe(href)
    expect(link.getAttribute('hrefLang')).toBe(hrefLang)
    expect(link.getAttribute('aria-label')).toMatch(locale === 'zh' ? /English/u : /中文/u)
  })
})
