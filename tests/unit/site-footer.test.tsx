import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { SiteFooter } from '@/components/site/site-footer'
import { dict } from '@/i18n/dictionary'

afterEach(cleanup)

describe('site footer', () => {
  it('renders only verified brand and navigation information', () => {
    render(<SiteFooter locale="zh" />)

    expect(screen.getByText('中关村自主大模型产业联盟')).toBeTruthy()
    expect(document.body.textContent).not.toMatch(/contact@|ICP备/u)
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull()
    expect(screen.getByRole('navigation', { name: dict('zh').footer.sectionUnderstand })).toBeTruthy()
    expect(screen.getByRole('navigation', { name: dict('zh').footer.sectionParticipate })).toBeTruthy()
    expect(screen.getByRole('navigation', { name: dict('zh').footer.sectionMore })).toBeTruthy()
  })

  it('localizes navigation links under /en for the English locale', () => {
    render(<SiteFooter locale="en" />)

    expect(screen.getByRole('link', { name: /Cybersecurity/ }).getAttribute('href')).toBe(
      '/en/cybersecurity',
    )
    expect(screen.getByRole('link', { name: 'Members' }).getAttribute('href')).toBe('/en/members')
    expect(screen.getByRole('link', { name: 'News' }).getAttribute('href')).toBe('/en/news')
    expect(screen.getByRole('link', { name: 'Privacy' }).getAttribute('href')).toBe('/en/privacy')
  })

  it('keeps zh navigation links on the root path', () => {
    render(<SiteFooter locale="zh" />)

    expect(screen.getByRole('link', { name: /网络安全生态/ }).getAttribute('href')).toBe(
      '/cybersecurity',
    )
    expect(screen.getByRole('link', { name: '成员伙伴' }).getAttribute('href')).toBe('/members')
    expect(screen.getByRole('link', { name: '新闻动态' }).getAttribute('href')).toBe('/news')
    expect(screen.getByRole('link', { name: '隐私说明' }).getAttribute('href')).toBe('/privacy')
  })

  it('shows the current year in the copyright line', () => {
    render(<SiteFooter locale="zh" />)

    const year = String(new Date().getFullYear())
    expect(screen.getByText((text) => text.includes(year))).toBeTruthy()
  })
})
