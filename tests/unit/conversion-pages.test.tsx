import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import JoinPage, { metadata as joinMetadata } from '@/app/(frontend)/join/page'
import PrivacyPage, { metadata as privacyMetadata } from '@/app/(frontend)/privacy/page'
import ProfessionalsPage, {
  metadata as professionalsMetadata,
} from '@/app/(frontend)/professionals/page'
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
    expect(joinMetadata.alternates).toEqual({ canonical: '/join' })
  })
})

describe('professional conversion page', () => {
  it('explains who can participate, how to participate, and participant benefits', () => {
    render(<ProfessionalsPage />)

    expect(screen.getByRole('heading', { level: 1, name: '专业用户加入' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '适用人群' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '参与方式' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '参与权益' })).toBeTruthy()
    expect(screen.getByRole('main').id).toBe('main-content')
  })

  it('uses the independent professional target and safely falls back when its URL is missing', () => {
    render(<ProfessionalsPage />)

    const main = screen.getByRole('main')
    expect(within(main).queryByRole('link', { name: /专业用户加入/ })).toBeNull()
    expect(
      within(main)
        .getByText(APPLICATION_TARGETS.professional.unavailableMessage)
        .getAttribute('aria-disabled'),
    ).toBe('true')
    expect(APPLICATION_TARGETS.professional.internalHref).not.toBe(
      APPLICATION_TARGETS.institution.internalHref,
    )
  })

  it('defines page-specific metadata', () => {
    expect(professionalsMetadata.title).toBe('专业用户加入')
    expect(professionalsMetadata.description).toMatch(/专业用户/)
    expect(professionalsMetadata.alternates).toEqual({ canonical: '/professionals' })
  })
})

describe('privacy page', () => {
  it('states the website and external form privacy boundary', () => {
    render(<PrivacyPage />)

    const main = screen.getByRole('main')
    expect(screen.getByRole('heading', { level: 1, name: '隐私说明' })).toBeTruthy()
    expect(main.textContent).toMatch(/官网不接收、代理或存储申请数据/)
    expect(main.textContent).toMatch(/飞书.*外部服务/)
    expect(main.textContent).toMatch(/以.*表单内.*隐私告知为准/)
    expect(main.id).toBe('main-content')
  })

  it('defines page-specific metadata', () => {
    expect(privacyMetadata.title).toBe('隐私说明')
    expect(privacyMetadata.description).toMatch(/隐私|外部表单/)
    expect(privacyMetadata.alternates).toEqual({ canonical: '/privacy' })
  })
})
