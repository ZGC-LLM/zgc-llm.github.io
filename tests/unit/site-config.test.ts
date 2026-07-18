import {
  APPLICATION_TARGET,
  isSafeExternalUrl,
  PUBLIC_STATIC_ROUTES,
  resolveApplicationTarget,
  resolveSiteUrl,
  SITE_NAME,
  SITE_NAVIGATION,
} from '@/config/site'
import { describe, expect, it } from 'vitest'

describe('site configuration', () => {
  it('uses the alliance brand and canonical production domain', () => {
    expect(SITE_NAME).toBe('中关村自主大模型产业联盟')
    expect(resolveSiteUrl()).toBe('https://www.zgc-llm.org.cn')
    expect(resolveSiteUrl('http://localhost:3000')).toBe('http://localhost:3000')
    expect(resolveSiteUrl('not-a-url')).toBe('https://www.zgc-llm.org.cn')
    expect(resolveSiteUrl('javascript:alert(1)')).toBe('https://www.zgc-llm.org.cn')
  })

  it('defines unique public navigation destinations', () => {
    const destinations = SITE_NAVIGATION.map(({ href }) => href)

    expect(destinations).toContain('/cybersecurity')
    expect(new Set(destinations).size).toBe(destinations.length)
    expect(PUBLIC_STATIC_ROUTES).toContain('/privacy')
    expect(PUBLIC_STATIC_ROUTES).not.toContain('/admin')
    expect(PUBLIC_STATIC_ROUTES).not.toContain('/professionals')
  })

  it('derives working-group sub-routes from WORKING_GROUPS', () => {
    expect(PUBLIC_STATIC_ROUTES).toContain('/working-groups/cybersecurity')
    expect(PUBLIC_STATIC_ROUTES).toContain('/working-groups/cybersecurity/members')
    expect(PUBLIC_STATIC_ROUTES).toContain('/working-groups/cybersecurity/join')
  })

  it('exposes a single application target sourced from the shared env var', () => {
    expect(APPLICATION_TARGET.href).toBe(process.env.NEXT_PUBLIC_APPLICATION_URL)
    expect(APPLICATION_TARGET.label).toBeTruthy()
    expect(APPLICATION_TARGET.unavailableMessage).toContain('联系')
  })

  it.each([
    ['https://example.feishu.cn/share/base/form/example', true],
    ['http://example.feishu.cn/share/base/form/example', false],
    ['javascript:alert(1)', false],
    ['data:text/html,unsafe', false],
    ['', false],
    [undefined, false],
  ])('validates external application URL %s', (value, expected) => {
    expect(isSafeExternalUrl(value)).toBe(expected)
  })

  it('returns an unavailable state for a missing application URL', () => {
    const target = resolveApplicationTarget(undefined)

    expect(target.href).toBeUndefined()
    expect(target.isAvailable).toBe(false)
    expect(target.unavailableMessage).toContain('联系')
  })

  it('returns an available state for a valid configured URL', () => {
    const target = resolveApplicationTarget('https://example.feishu.cn/share/base/form/example')

    expect(target.href).toBe('https://example.feishu.cn/share/base/form/example')
    expect(target.isAvailable).toBe(true)
  })
})
