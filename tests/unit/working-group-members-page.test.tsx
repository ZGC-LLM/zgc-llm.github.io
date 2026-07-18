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
    expect(screen.getByRole('heading', { level: 3, name: '云起无垠' })).toBeTruthy()
  })

  it('test_wg_members_page_en_uses_partner_terminology_in_title', () => {
    render(<WorkingGroupMembersView locale="en" slug="cybersecurity" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Working Group Partners' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 3, name: 'CloudInfinite' })).toBeTruthy()
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

  it('test_wg_members_page_renders_all_publicly_authorised_members', () => {
    render(<WorkingGroupMembersView locale="zh" slug="cybersecurity" />)

    expect(screen.getAllByRole('article')).toHaveLength(5)
    expect(screen.queryByText('工作组共建伙伴名单整理中')).toBeNull()
  })
})
