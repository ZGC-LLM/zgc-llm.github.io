import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  APPROVED_APPLICATION_URL,
  importSiteConfig,
} from './helpers/import-site-config'

afterEach(() => {
  cleanup()
  vi.doUnmock('@/config/site')
  vi.unstubAllEnvs()
  vi.resetModules()
})

async function renderApplicationLink(props: {
  children?: string
  className?: string
  configuredUrl?: string
  label?: string
  locale?: 'zh' | 'en'
}) {
  await importSiteConfig()
  const { ExternalApplicationLink } = await import('@/components/site/external-application-link')

  return render(<ExternalApplicationLink {...props} />)
}

describe('ExternalApplicationLink fail-closed behavior', () => {
  it.each([
    [undefined, '提交申请：当前不可用。请稍后查看官网更新。'],
    ['', '提交申请：当前不可用。请稍后查看官网更新。'],
    ['not-a-url', '提交申请：当前不可用。请稍后查看官网更新。'],
    ['https://example.com/form', '提交申请：当前不可用。请稍后查看官网更新。'],
    [APPROVED_APPLICATION_URL.alliance, '提交申请：当前不可用。请稍后查看官网更新。'],
  ])('renders no anchor when the target is unavailable: %s', async (configuredUrl, message) => {
    await renderApplicationLink({ configuredUrl, label: '提交申请', locale: 'zh' })

    expect(screen.queryByRole('link')).toBeNull()
    const status = screen.getByText(message)
    expect(status.getAttribute('aria-disabled')).toBe('true')
    expect(status.getAttribute('aria-live')).toBe('polite')
    expect(status.getAttribute('title')).toBe(message)
  })

  it('localizes the unavailable state from an explicit locale', async () => {
    await renderApplicationLink({ configuredUrl: '', label: '提交申请', locale: 'en' })

    expect(
      screen.getByText(
        '提交申请: This channel is not currently available. Please check this site again for updates.',
      ),
    ).toBeTruthy()
  })

  it.each([
    ['提交申请', /当前不可用/u],
    ['Submit application', /not currently available/u],
  ])('infers unavailable copy from label language when locale is omitted', async (label, message) => {
    await renderApplicationLink({ configuredUrl: '', label })

    expect(screen.getByText(message)).toBeTruthy()
  })

  it('renders an exact, explicitly enabled Feishu target with safe external attributes', async () => {
    await importSiteConfig({ NEXT_PUBLIC_APPLICATION_URL: APPROVED_APPLICATION_URL.alliance })
    const { ExternalApplicationLink } = await import('@/components/site/external-application-link')

    render(
      <ExternalApplicationLink
        className="button-primary"
        configuredUrl={APPROVED_APPLICATION_URL.alliance}
        label="提交联盟合作意向"
        locale="zh"
      >
        立即提交
      </ExternalApplicationLink>,
    )

    const link = screen.getByRole('link', { name: /提交联盟合作意向，打开飞书外部表单/u })
    expect(link.getAttribute('href')).toBe(APPROVED_APPLICATION_URL.alliance)
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noreferrer noopener')
    expect(link.className).toContain('button-primary')
    expect(link.textContent).toContain('立即提交')
    expect(screen.getByText(/本站不接收或保存申请表单数据/u)).toBeTruthy()
  })

  it('uses the target label when label and children are absent', async () => {
    await importSiteConfig({ NEXT_PUBLIC_APPLICATION_URL: APPROVED_APPLICATION_URL.alliance })
    const { ExternalApplicationLink } = await import('@/components/site/external-application-link')

    render(<ExternalApplicationLink configuredUrl={APPROVED_APPLICATION_URL.alliance} locale="zh" />)

    expect(
      screen.getByRole('link', { name: /联盟申请，打开飞书外部表单/u }).textContent,
    ).toContain('联盟申请')
  })

  it('keeps ordinary external-provider disclosure correct when supplied by the resolver contract', async () => {
    vi.doMock('@/config/site', () => ({
      resolveApplicationTarget: () => ({
        href: 'https://applications.example.org/form',
        isAvailable: true,
        label: 'External application',
        status: 'available',
        unavailableMessage: 'Unavailable',
      }),
    }))
    const { ExternalApplicationLink } = await import('@/components/site/external-application-link')

    render(<ExternalApplicationLink configuredUrl="https://applications.example.org/form" locale="en" />)

    expect(
      screen.getByRole('link', { name: /opens an external service/u }).getAttribute('href'),
    ).toBe('https://applications.example.org/form')
    expect(screen.getByText(/this site does not receive or store application-form data/u)).toBeTruthy()
  })
})
