import { cleanup, render, screen, within } from '@testing-library/react'
import { buildAlternates } from '@/i18n/routing'
import { afterEach, describe, expect, it } from 'vitest'

import JoinPage, { metadata as joinMetadata } from '@/app/(frontend)/join/page'
import PrivacyPage, { metadata as privacyMetadata } from '@/app/(frontend)/privacy/page'
import { APPLICATION_TARGETS } from '@/config/site'

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

  it('uses the institution target and safely falls back when its URL is missing', () => {
    render(<JoinPage />)

    const main = screen.getByRole('main')
    expect(within(main).queryByRole('link', { name: /机构合作申请/ })).toBeNull()
    expect(
      within(main)
        .getByText(APPLICATION_TARGETS.institution.unavailableMessage)
        .getAttribute('aria-disabled'),
    ).toBe('true')
    expect(main.textContent).not.toMatch(/站内提交|材料上传|审核进度|进度查询/)
  })

  it('defines page-specific metadata', () => {
    expect(joinMetadata.title).toBe('机构生态共建')
    expect(joinMetadata.description).toMatch(/机构|生态共建/)
    expect(joinMetadata.alternates).toEqual(buildAlternates('/join', 'zh'))
  })
})

describe('professional conversion page', () => {
  it('is reintroduced as a working-group join target, not a standalone /professionals page', () => {
    expect(APPLICATION_TARGETS).toHaveProperty('professional')
    expect(APPLICATION_TARGETS.professional.internalHref).toBe('/working-groups/cybersecurity/join')
    // 历史决策：professional 类型复活仅作为工作组加入入口，/professionals 独立页仍不存在
    expect(APPLICATION_TARGETS.professional.internalHref).not.toMatch(/^\/professionals\b/)
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
