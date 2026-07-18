import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

import { getWorkingGroupBySlug, localizeWorkingGroup } from '@/content/working-groups'
import { buildAlternates } from '@/i18n/routing'
import type { WorkingGroupSummary } from '@/types/content'

import WorkingGroupPage, {
  createWorkingGroupMetadata,
  generateMetadata as generateOverviewMetadata,
  WorkingGroupOverview,
  WorkingGroupOverviewView,
} from '@/app/(frontend)/working-groups/[slug]/page'
import WorkingGroupMembersPage, {
  createWorkingGroupMembersMetadata,
  generateMetadata as generateMembersMetadata,
  WorkingGroupMembersDirectory,
  WorkingGroupMembersView,
} from '@/app/(frontend)/working-groups/[slug]/members/page'
import WorkingGroupJoinPage, {
  createWorkingGroupJoinMetadata,
  generateMetadata as generateJoinMetadata,
  WorkingGroupJoinView,
} from '@/app/(frontend)/working-groups/[slug]/join/page'

afterEach(cleanup)

const group = getWorkingGroupBySlug('cybersecurity')!

describe('working-group overview page', () => {
  it('renders the group narrative and join/members cta links for a known slug', async () => {
    render(await WorkingGroupPage({ params: Promise.resolve({ slug: 'cybersecurity' }) }))

    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content')
    expect(screen.getByRole('heading', { level: 1, name: group.title })).toBeTruthy()
    expect(screen.getAllByRole('link', { name: '加入工作组' })[0].getAttribute('href')).toBe(
      '/working-groups/cybersecurity/join',
    )
    expect(
      screen.getAllByRole('link', { name: '查看工作组共建伙伴' })[0].getAttribute('href'),
    ).toBe('/working-groups/cybersecurity/members')
  })

  it('renders the empty-outcomes state when no stage results are public yet', () => {
    const groupWithoutOutcomes: WorkingGroupSummary = { ...group, outcomes: [] }
    render(<WorkingGroupOverview group={groupWithoutOutcomes} locale="zh" />)

    expect(screen.getByText('成果整理中')).toBeTruthy()
  })

  it('renders a stage-results grid once outcomes are public', () => {
    const groupWithOutcome: WorkingGroupSummary = {
      ...group,
      outcomes: ['首批可信防御者名单公开发布'],
    }
    render(<WorkingGroupOverview group={groupWithOutcome} locale="zh" />)

    expect(screen.queryByText('成果整理中')).toBeNull()
    expect(screen.getByText('首批可信防御者名单公开发布')).toBeTruthy()
  })

  it('throws notFound for an unknown slug', async () => {
    await expect(
      WorkingGroupPage({ params: Promise.resolve({ slug: 'does-not-exist' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(() => WorkingGroupOverviewView({ locale: 'zh', slug: 'does-not-exist' })).toThrow(
      'NEXT_NOT_FOUND',
    )
  })

  it('derives independent canonical metadata from the localized group', () => {
    const metadata = createWorkingGroupMetadata(group, 'zh')
    const localized = localizeWorkingGroup(group, 'zh')

    expect(metadata.title).toBe(localized.title)
    expect(metadata.alternates).toEqual(buildAlternates('/working-groups/cybersecurity', 'zh'))
  })

  it('resolves generateMetadata for a known slug and rejects an unknown one', async () => {
    const metadata = await generateOverviewMetadata({
      params: Promise.resolve({ slug: 'cybersecurity' }),
    })
    expect(metadata.title).toBe(localizeWorkingGroup(group, 'zh').title)

    await expect(
      generateOverviewMetadata({ params: Promise.resolve({ slug: 'does-not-exist' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
  })
})

describe('working-group members page', () => {
  it('renders the public empty-authorization state for the cybersecurity group', async () => {
    render(await WorkingGroupMembersPage({ params: Promise.resolve({ slug: 'cybersecurity' }) }))

    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content')
    expect(screen.getByText('工作组共建伙伴名单整理中')).toBeTruthy()
    expect(screen.getByRole('link', { name: '申请加入本工作组' }).getAttribute('href')).toBe(
      '/working-groups/cybersecurity/join',
    )
    expect(screen.getByRole('link', { name: '联盟成员' }).getAttribute('href')).toBe('/members')
  })

  it('renders a member directory grid when members are authorized', () => {
    render(
      <WorkingGroupMembersDirectory
        group={group}
        locale="zh"
        members={[
          { id: 'm1', name: '示例安全企业', role: '共建伙伴', description: '负责能力评测' },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: '示例安全企业' })).toBeTruthy()
    expect(screen.getByText('共建伙伴')).toBeTruthy()
    expect(screen.getByText('负责能力评测')).toBeTruthy()
  })

  it('throws notFound for an unknown slug', async () => {
    await expect(
      WorkingGroupMembersPage({ params: Promise.resolve({ slug: 'does-not-exist' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(() => WorkingGroupMembersView({ locale: 'zh', slug: 'does-not-exist' })).toThrow(
      'NEXT_NOT_FOUND',
    )
  })

  it('derives independent canonical metadata mentioning the group title', () => {
    const metadata = createWorkingGroupMembersMetadata(group, 'zh')

    expect(metadata.title).toContain('工作组共建伙伴')
    expect(metadata.alternates).toEqual(
      buildAlternates('/working-groups/cybersecurity/members', 'zh'),
    )
  })

  it('resolves generateMetadata for a known slug and rejects an unknown one', async () => {
    const metadata = await generateMembersMetadata({
      params: Promise.resolve({ slug: 'cybersecurity' }),
    })
    expect(metadata.title).toContain('工作组共建伙伴')

    await expect(
      generateMembersMetadata({ params: Promise.resolve({ slug: 'does-not-exist' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
  })
})

describe('working-group join page', () => {
  it('renders the value/paths/process/faq sections with an application CTA area', async () => {
    render(await WorkingGroupJoinPage({ params: Promise.resolve({ slug: 'cybersecurity' }) }))

    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content')
    expect(screen.getByRole('heading', { level: 1, name: '加入工作组' })).toBeTruthy()
    expect(screen.getByText('能力验证')).toBeTruthy()
    expect(screen.getByText('提交合作申请')).toBeTruthy()
    expect(screen.getByRole('heading', { name: '专业用户是否包含机构？' })).toBeTruthy()
    // 当前环境未配置 NEXT_PUBLIC_APPLICATION_URL，CTA 降级为不可用提示而非可点击链接。
    expect(screen.getByText('申请通道准备中，请通过官网联系方式与联盟联系。')).toBeTruthy()
  })

  it('throws notFound for an unknown slug', async () => {
    await expect(
      WorkingGroupJoinPage({ params: Promise.resolve({ slug: 'does-not-exist' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(() => WorkingGroupJoinView({ locale: 'zh', slug: 'does-not-exist' })).toThrow(
      'NEXT_NOT_FOUND',
    )
  })

  it('derives independent canonical metadata mentioning the group title', () => {
    const metadata = createWorkingGroupJoinMetadata(group, 'zh')

    expect(metadata.title).toContain('加入工作组')
    expect(metadata.alternates).toEqual(buildAlternates('/working-groups/cybersecurity/join', 'zh'))
  })

  it('resolves generateMetadata for a known slug and rejects an unknown one', async () => {
    const metadata = await generateJoinMetadata({
      params: Promise.resolve({ slug: 'cybersecurity' }),
    })
    expect(metadata.title).toContain('加入工作组')

    await expect(
      generateJoinMetadata({ params: Promise.resolve({ slug: 'does-not-exist' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
