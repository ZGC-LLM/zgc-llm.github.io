import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { allDictionaries, dict } from '@/i18n/dictionary'
import { LanguageToggle } from '@/components/site/language-toggle'
import { PageHero } from '@/components/site/page-hero'

let pathname = '/cybersecurity'
vi.mock('next/navigation', () => ({ usePathname: () => pathname }))

afterEach(cleanup)

describe('allDictionaries', () => {
  it('enumerates every supported locale paired with its dictionary', () => {
    const entries = allDictionaries()

    expect(entries.map((e) => e.locale).sort()).toEqual(['en', 'zh'])
    expect(entries.find((e) => e.locale === 'zh')?.dictionary).toBe(dict('zh'))
    expect(entries.find((e) => e.locale === 'en')?.dictionary).toBe(dict('en'))
  })
})

describe('LanguageToggle', () => {
  it('targets the /en-prefixed page when switching from zh to en', () => {
    pathname = '/cybersecurity'
    render(<LanguageToggle locale="zh" />)

    expect(screen.getByRole('link', { name: /切换语言/ }).getAttribute('href')).toBe(
      '/en/cybersecurity',
    )
  })

  it('strips the /en prefix when switching from an en subpage back to zh', () => {
    pathname = '/en/cybersecurity'
    render(<LanguageToggle locale="en" />)

    expect(screen.getByRole('link', { name: /切换语言/ }).getAttribute('href')).toBe(
      '/cybersecurity',
    )
  })

  it('maps the bare /en root back to the zh root path', () => {
    pathname = '/en'
    render(<LanguageToggle locale="en" />)

    expect(screen.getByRole('link', { name: /切换语言/ }).getAttribute('href')).toBe('/')
  })

  it('strips trailing slashes before deriving the target path', () => {
    pathname = '/en/members/'
    render(<LanguageToggle locale="en" />)

    expect(screen.getByRole('link', { name: /切换语言/ }).getAttribute('href')).toBe('/members')
  })
})

describe('PageHero', () => {
  it('omits the eyebrow element when no eyebrow prop is given', () => {
    const { container } = render(<PageHero description="描述" title="标题" />)

    expect(container.querySelector('.eyebrow')).toBeNull()
    expect(screen.getByRole('heading', { level: 1, name: '标题' })).toBeTruthy()
  })

  it('renders the eyebrow element when provided', () => {
    render(<PageHero description="描述" eyebrow="专题" title="标题" />)

    expect(screen.getByText('专题')).toBeTruthy()
  })
})
