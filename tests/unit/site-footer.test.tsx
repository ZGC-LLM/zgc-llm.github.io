import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { SiteFooter } from '@/components/site/site-footer'

afterEach(cleanup)

describe('site footer', () => {
  it('renders the alliance brand, contact email on the canonical domain, and legal links', () => {
    render(<SiteFooter locale="zh" />)

    expect(screen.getByText('中关村自主大模型产业联盟')).toBeTruthy()

    const contactLink = screen.getByRole('link', { name: 'contact@zgc-llm.org.cn' })
    expect(contactLink.getAttribute('href')).toBe('mailto:contact@zgc-llm.org.cn')

    // The placeholder ICP filing number is intentionally absent until a real
    // filing is issued; no beian.miit.gov.cn link should render.
    expect(screen.queryByRole('link', { name: /京ICP备/ })).toBeNull()
    expect(document.body.textContent).not.toMatch(/beian\.miit\.gov\.cn/)
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
