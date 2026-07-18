import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

import { WorkingGroupMembersView } from '@/app/(frontend)/working-groups/[slug]/members/page'

afterEach(cleanup)

describe('working group members page', () => {
  it('test_wg_members_page_zh_uses_partner_terminology_in_title', () => {
    render(<WorkingGroupMembersView locale="zh" slug="cybersecurity" />)

    expect(screen.getByRole('heading', { level: 1, name: '工作组共建伙伴' })).toBeTruthy()
  })

  it('test_wg_members_page_en_uses_partner_terminology_in_title', () => {
    render(<WorkingGroupMembersView locale="en" slug="cybersecurity" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Working Group Partners' })).toBeTruthy()
  })

  it('test_wg_members_page_zh_links_to_alliance_members_page', () => {
    render(<WorkingGroupMembersView locale="zh" slug="cybersecurity" />)

    expect(screen.getByText(/名单单位多为联盟会员/)).toBeTruthy()
    const link = screen.getByRole('link', { name: '联盟成员' })
    expect(link.getAttribute('href')).toBe('/members')
  })

  it('test_wg_members_page_en_links_to_alliance_members_page', () => {
    render(<WorkingGroupMembersView locale="en" slug="cybersecurity" />)

    expect(screen.getByText(/mostly also alliance members/)).toBeTruthy()
    const link = screen.getByRole('link', { name: 'Alliance Members' })
    expect(link.getAttribute('href')).toBe('/en/members')
  })

  it('test_wg_members_page_empty_members_still_renders_authorization_state', () => {
    render(<WorkingGroupMembersView locale="zh" slug="cybersecurity" />)

    // 当前 cybersecurity 工作组名单为空数据，空态文案应正常渲染，不回归
    expect(screen.getByText('工作组共建伙伴名单整理中')).toBeTruthy()
    expect(screen.getByRole('link', { name: '申请加入本工作组' })).toBeTruthy()
  })
})
