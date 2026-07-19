import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { WorkingGroupOverview } from '@/app/(frontend)/working-groups/[slug]/page'
import {
  WorkingGroupMembersDirectory,
  WorkingGroupMembersView,
} from '@/app/(frontend)/working-groups/[slug]/members/page'
import { WorkingGroupJoinView } from '@/app/(frontend)/working-groups/[slug]/join/page'
import { getWorkingGroupJoinContent } from '@/content/join'
import {
  getWorkingGroupBySlug,
  getWorkingGroupMembersContent,
  getWorkingGroupOverviewContent,
} from '@/content/working-groups'
import type { WorkingGroupMember, WorkingGroupSummary } from '@/types/content'

const { viewMembers } = vi.hoisted(() => ({
  viewMembers: { current: [] as unknown[] },
}))

vi.mock('@/content/working-group-members', () => ({
  getWorkingGroupMembers: () => viewMembers.current,
}))

afterEach(() => {
  cleanup()
  viewMembers.current = []
})

const group = getWorkingGroupBySlug('cybersecurity')!

describe('WorkingGroupOverview', () => {
  it('renders the current empty-results state and all three navigation paths', () => {
    const copy = getWorkingGroupOverviewContent('zh')

    render(<WorkingGroupOverview group={group} locale="zh" />)

    expect(screen.getByRole('heading', { level: 1, name: group.title })).toBeTruthy()
    expect(screen.getByRole('heading', { name: copy.outcomesEmptyTitle })).toBeTruthy()
    expect(screen.getAllByRole('link', { name: copy.joinCta })[0].getAttribute('href')).toBe(
      `/working-groups/${group.slug}/join`,
    )
    expect(screen.getAllByRole('link', { name: copy.membersCta })[0].getAttribute('href')).toBe(
      `/working-groups/${group.slug}/members`,
    )
    expect(screen.getByRole('link', { name: copy.ecosystemCta }).getAttribute('href')).toBe(
      group.ecosystemHref,
    )
  })

  it('renders initiative results while omitting absent optional details and ecosystem link', () => {
    const copy = getWorkingGroupOverviewContent('zh')
    const initiative: WorkingGroupSummary = {
      ...group,
      ecosystemHref: undefined,
      ecosystemLabel: undefined,
      id: 'test-initiative',
      kind: 'initiative',
      leads: [{ name: '协作角色', named: false, role: '协调' }],
      outcomes: ['经确认可公开的阶段结果'],
      slug: 'test-initiative',
      title: '测试专项',
    }

    render(<WorkingGroupOverview group={initiative} locale="zh" />)

    expect(screen.getByText(copy.initiativeLabel)).toBeTruthy()
    expect(screen.getByText('经确认可公开的阶段结果')).toBeTruthy()
    expect(screen.getByRole('heading', { name: '协作角色' }).nextElementSibling).toBeNull()
    expect(screen.queryByRole('link', { name: copy.ecosystemCta })).toBeNull()
    expect(screen.queryByText(copy.outcomesEmptyTitle)).toBeNull()
  })
})

describe('WorkingGroupMembersDirectory', () => {
  it('renders the localized publication-gated empty state', () => {
    const copy = getWorkingGroupMembersContent('en')

    render(<WorkingGroupMembersDirectory group={group} locale="en" members={[]} />)

    expect(screen.getByRole('heading', { name: copy.emptyTitle })).toBeTruthy()
    expect(screen.getByRole('link', { name: copy.emptyCta }).getAttribute('href')).toBe(
      `/en/working-groups/${group.slug}/join`,
    )
  })

  it('renders only the optional member fields that are present', () => {
    const copy = getWorkingGroupMembersContent('zh')
    const members: readonly WorkingGroupMember[] = [
      {
        description: '负责能力验证',
        id: 'with-details',
        logo: '/brand-mark.svg',
        name: '示例共建方',
        role: '验证伙伴',
      },
      { id: 'without-details', name: '专业参与方' },
    ]

    render(<WorkingGroupMembersDirectory group={group} members={members} />)

    expect(screen.getByRole('heading', { name: copy.directoryTitle })).toBeTruthy()
    expect(screen.getByRole('img', { name: `示例共建方${copy.logoAltSuffix}` })).toBeTruthy()
    expect(screen.getByText('验证伙伴')).toBeTruthy()
    expect(screen.getByText('负责能力验证')).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: '专业参与方' }).parentElement?.querySelector('img'),
    ).toBeNull()
  })
})

describe('WorkingGroupMembersView', () => {
  it('shows the Alliance-directory relationship only when public collaborators exist', () => {
    const copy = getWorkingGroupMembersContent('en')
    viewMembers.current = [{ id: 'partner', name: 'Confirmed collaborator' }]

    render(<WorkingGroupMembersView locale="en" slug={group.slug} />)

    expect(screen.getByText(copy.relationBody, { exact: false })).toBeTruthy()
    expect(screen.getByRole('link', { name: copy.relationLinkLabel }).getAttribute('href')).toBe(
      '/en/members',
    )
    expect(screen.getByRole('heading', { name: 'Confirmed collaborator' })).toBeTruthy()
  })

  it('omits the relationship note when the public collaborator list is empty', () => {
    const copy = getWorkingGroupMembersContent('zh')

    render(<WorkingGroupMembersView locale="zh" slug={group.slug} />)

    expect(screen.queryByText(copy.relationBody, { exact: false })).toBeNull()
    expect(screen.getByRole('heading', { name: copy.emptyTitle })).toBeTruthy()
  })
})

describe('WorkingGroupJoinView', () => {
  it.each(['zh', 'en'] as const)('renders every participation section in %s', (locale) => {
    const copy = getWorkingGroupJoinContent(locale)

    render(<WorkingGroupJoinView locale={locale} slug={group.slug} />)

    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content')
    expect(screen.getByRole('heading', { level: 1, name: copy.pageTitle })).toBeTruthy()
    expect(screen.getByRole('heading', { name: copy.participation.title })).toBeTruthy()
    expect(screen.getByRole('heading', { name: copy.requirements.title })).toBeTruthy()
    expect(screen.getByRole('heading', { name: copy.process.title })).toBeTruthy()
    expect(screen.getByRole('heading', { name: copy.faq.title })).toBeTruthy()
    expect(screen.getByRole('link', { name: copy.detailCta }).getAttribute('href')).toBe(
      `${locale === 'en' ? '/en' : ''}/working-groups/${group.slug}`,
    )

    const faqWithLink = copy.faq.items.find((item) => item.link)
    expect(faqWithLink).toBeDefined()
    expect(screen.getByRole('link', { name: faqWithLink!.link!.label }).getAttribute('href')).toBe(
      `${locale === 'en' ? '/en' : ''}${faqWithLink!.link!.href}`,
    )
  })
})
