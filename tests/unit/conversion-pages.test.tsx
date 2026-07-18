import { cleanup, render, screen, within } from '@testing-library/react'
import { buildAlternates } from '@/i18n/routing'
import { afterEach, describe, expect, it } from 'vitest'

import EnJoinPage from '@/app/(en)/en/join/page'
import JoinPage, { metadata as joinMetadata } from '@/app/(frontend)/join/page'
import PrivacyPage, { metadata as privacyMetadata } from '@/app/(frontend)/privacy/page'
import { WorkingGroupJoinView } from '@/app/(frontend)/working-groups/[slug]/join/page'
import { APPLICATION_TARGET, PUBLIC_STATIC_ROUTES } from '@/config/site'

afterEach(cleanup)

describe('institution conversion page', () => {
  it('explains the value, participation paths, process, and frequently asked questions', () => {
    render(<JoinPage />)

    expect(screen.getByRole('heading', { level: 1, name: '机构生态共建' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '共建价值' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '参与方式' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '参与流程' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '常见问题' })).toBeTruthy()
    expect(screen.getByRole('main').id).toBe('main-content')
  })

  it('defines page-specific metadata', () => {
    expect(joinMetadata.title).toBe('机构生态共建')
    expect(joinMetadata.description).toMatch(/机构|生态共建/)
    expect(joinMetadata.alternates).toEqual(buildAlternates('/join', 'zh'))
  })
})

describe('shared application target across entry points (zh)', () => {
  it('falls back to the same unavailable message on the institutional entry when the URL is missing', () => {
    render(<JoinPage />)

    const main = screen.getByRole('main')
    expect(within(main).queryByRole('link', { name: /机构合作申请/ })).toBeNull()
    expect(
      within(main).getByText(APPLICATION_TARGET.unavailableMessage).getAttribute('aria-disabled'),
    ).toBe('true')
    expect(main.textContent).not.toMatch(/站内提交|材料上传|审核进度|进度查询/)
  })

  it('falls back to the same unavailable message on the cybersecurity working-group entry', () => {
    render(<WorkingGroupJoinView locale="zh" slug="cybersecurity" />)

    const main = screen.getByRole('main')
    expect(within(main).queryByRole('link', { name: /专业用户申请/ })).toBeNull()
    expect(
      within(main).getByText(APPLICATION_TARGET.unavailableMessage).getAttribute('aria-disabled'),
    ).toBe('true')
  })
})

describe('shared application target across entry points (en)', () => {
  it('falls back to the same unavailable message on the institutional entry', () => {
    render(<EnJoinPage />)

    const main = screen.getByRole('main')
    expect(within(main).queryByRole('link', { name: /Partner with Us/ })).toBeNull()
    expect(
      within(main).getByText(APPLICATION_TARGET.unavailableMessage).getAttribute('aria-disabled'),
    ).toBe('true')
  })

  it('falls back to the same unavailable message on the cybersecurity working-group entry', () => {
    render(<WorkingGroupJoinView locale="en" slug="cybersecurity" />)

    const main = screen.getByRole('main')
    expect(within(main).queryByRole('link', { name: /Apply as a professional user/ })).toBeNull()
    expect(
      within(main).getByText(APPLICATION_TARGET.unavailableMessage).getAttribute('aria-disabled'),
    ).toBe('true')
  })
})

describe('no standalone /professionals route', () => {
  it('is not registered as a public static route; the working-group join entry is the only path', () => {
    expect(PUBLIC_STATIC_ROUTES).not.toContain('/professionals')
    expect(PUBLIC_STATIC_ROUTES.some((route) => route.startsWith('/professionals'))).toBe(false)
    expect(PUBLIC_STATIC_ROUTES).toContain('/working-groups/cybersecurity/join')
  })
})

describe('privacy page', () => {
  it('states the website and external form privacy boundary', () => {
    render(<PrivacyPage />)

    const main = screen.getByRole('main')
    expect(screen.getByRole('heading', { level: 1, name: '隐私说明' })).toBeTruthy()
    expect(main.textContent).toMatch(/官网.*不收集或存储.*申请信息/)
    expect(main.textContent).toMatch(/飞书.*外部服务/)
    expect(main.textContent).toMatch(/以.*表单内.*隐私(说明|告知)为准/)
    expect(main.id).toBe('main-content')
  })

  it('defines page-specific metadata', () => {
    expect(privacyMetadata.title).toBe('隐私说明')
    expect(privacyMetadata.description).toMatch(/隐私|外部表单/)
    expect(privacyMetadata.alternates).toEqual(buildAlternates('/privacy', 'zh'))
  })
})
