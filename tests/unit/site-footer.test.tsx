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
  })

  it('shows the verified ICP filing number linking to the MIIT lookup', () => {
    render(<SiteFooter locale="zh" />)

    const icpLink = screen.getByRole('link', { name: /京ICP备/ })
    expect(icpLink.textContent).toBe('京ICP备2026046932号-1')
    expect(icpLink.getAttribute('href')).toBe('https://beian.miit.gov.cn/')
    expect(icpLink.getAttribute('target')).toBe('_blank')
    expect(icpLink.getAttribute('rel')).toMatch(/noreferrer/)
  })

  it('shows the same ICP filing number on the English locale', () => {
    render(<SiteFooter locale="en" />)

    const icpLink = screen.getByRole('link', { name: /京ICP备/ })
    expect(icpLink.textContent).toBe('京ICP备2026046932号-1')
    expect(icpLink.getAttribute('href')).toBe('https://beian.miit.gov.cn/')
  })

  it('shows the public security filing with its official badge and lookup link', () => {
    render(<SiteFooter locale="zh" />)

    const filingLink = screen.getByRole('link', { name: /京公网安备/ })
    expect(filingLink.textContent).toBe('京公网安备11010802049661号')
    expect(filingLink.getAttribute('href')).toBe(
      'https://beian.mps.gov.cn/#/query/webSearch?code=11010802049661',
    )
    expect(filingLink.getAttribute('target')).toBe('_blank')
    expect(filingLink.getAttribute('rel')).toMatch(/noreferrer/)

    const filingBadge = filingLink.querySelector('img')
    expect(filingBadge?.getAttribute('src')).toBe(
      'https://beian.mps.gov.cn/img/logo01.dd7ff50e.png',
    )
    expect(filingBadge?.getAttribute('alt')).toBe('')
  })

  it('shows the same public security filing on the English locale', () => {
    render(<SiteFooter locale="en" />)

    const filingLink = screen.getByRole('link', { name: /京公网安备/ })
    expect(filingLink.textContent).toBe('京公网安备11010802049661号')
  })

  it('never renders the removed placeholder ICP number', () => {
    render(<SiteFooter locale="zh" />)

    expect(document.body.textContent).not.toMatch(/2025000000/)
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
    expect(screen.getByText((text) => text.includes('©') && text.includes(year))).toBeTruthy()
  })
})
