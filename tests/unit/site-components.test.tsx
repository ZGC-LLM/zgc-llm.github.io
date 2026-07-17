import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ExternalApplicationLink } from '@/components/site/external-application-link'
import { SiteHeader } from '@/components/site/site-header'

vi.mock('next/navigation', () => ({ usePathname: () => '/cybersecurity' }))

afterEach(cleanup)

describe('site application links', () => {
  it('renders a safe external application link with protective attributes', () => {
    render(
      <ExternalApplicationLink
        configuredUrl="https://example.feishu.cn/share/base/form/example"
        kind="institution"
      />,
    )

    const link = screen.getByRole('link', { name: /机构合作申请.*外部表单/ })

    expect(link.getAttribute('href')).toBe('https://example.feishu.cn/share/base/form/example')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
  })

  it('renders an unavailable state instead of an unsafe link', () => {
    render(<ExternalApplicationLink configuredUrl="javascript:alert(1)" kind="professional" />)

    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByText(/申请通道准备中/).getAttribute('aria-disabled')).toBe('true')
  })
})

describe('site header', () => {
  it('exposes the alliance brand, primary navigation, and two conversion paths', () => {
    render(<SiteHeader />)

    expect(screen.getAllByText('中关村自主大模型产业联盟').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: '网络安全生态' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: '机构合作申请' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: '个人专业用户加入' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('navigation', { name: '主导航' })).toBeTruthy()
    expect(
      screen.getByRole('navigation', { name: '主导航' }).querySelector('[aria-current="page"]')
        ?.textContent,
    ).toBe('网络安全生态')
  })
})
