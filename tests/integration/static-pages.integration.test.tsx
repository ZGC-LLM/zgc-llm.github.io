import { cleanup, render, screen } from '@testing-library/react'
import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import { afterEach, describe, expect, it } from 'vitest'

import EnAlliancePage, { metadata as enAllianceMetadata } from '@/app/(en)/en/alliance/page'
import EnCybersecurityPage, {
  metadata as enCybersecurityMetadata,
} from '@/app/(en)/en/cybersecurity/page'
import EnJoinPage, { metadata as enJoinMetadata } from '@/app/(en)/en/join/page'
import EnMembersPage, { metadata as enMembersMetadata } from '@/app/(en)/en/members/page'
import EnNewsPage, { metadata as enNewsMetadata } from '@/app/(en)/en/news/page'
import EnHomePage, { metadata as enHomeMetadata } from '@/app/(en)/en/page'
import EnPrivacyPage, { metadata as enPrivacyMetadata } from '@/app/(en)/en/privacy/page'
import EnWorkingGroupsPage, {
  metadata as enWorkingGroupsMetadata,
} from '@/app/(en)/en/working-groups/page'
import AlliancePage, { metadata as allianceMetadata } from '@/app/(frontend)/alliance/page'
import CybersecurityPage, {
  metadata as cybersecurityMetadata,
} from '@/app/(frontend)/cybersecurity/page'
import JoinPage, { metadata as joinMetadata } from '@/app/(frontend)/join/page'
import MembersPage, { metadata as membersMetadata } from '@/app/(frontend)/members/page'
import NewsPage, { metadata as newsMetadata } from '@/app/(frontend)/news/page'
import HomePage, { metadata as homeMetadata } from '@/app/(frontend)/page'
import PrivacyPage, { metadata as privacyMetadata } from '@/app/(frontend)/privacy/page'
import WorkingGroupsPage, {
  metadata as workingGroupsMetadata,
} from '@/app/(frontend)/working-groups/page'

import { expectLocalizedMetadata } from './helpers/metadata-contract'

afterEach(cleanup)

interface StaticPageCase {
  component: ComponentType
  locale: 'zh' | 'en'
  metadata: Metadata
  path: string
}

const STATIC_PAGES: readonly StaticPageCase[] = [
  { component: HomePage, locale: 'zh', metadata: homeMetadata, path: '/' },
  { component: EnHomePage, locale: 'en', metadata: enHomeMetadata, path: '/' },
  { component: AlliancePage, locale: 'zh', metadata: allianceMetadata, path: '/alliance' },
  { component: EnAlliancePage, locale: 'en', metadata: enAllianceMetadata, path: '/alliance' },
  {
    component: WorkingGroupsPage,
    locale: 'zh',
    metadata: workingGroupsMetadata,
    path: '/working-groups',
  },
  {
    component: EnWorkingGroupsPage,
    locale: 'en',
    metadata: enWorkingGroupsMetadata,
    path: '/working-groups',
  },
  {
    component: CybersecurityPage,
    locale: 'zh',
    metadata: cybersecurityMetadata,
    path: '/cybersecurity',
  },
  {
    component: EnCybersecurityPage,
    locale: 'en',
    metadata: enCybersecurityMetadata,
    path: '/cybersecurity',
  },
  { component: MembersPage, locale: 'zh', metadata: membersMetadata, path: '/members' },
  { component: EnMembersPage, locale: 'en', metadata: enMembersMetadata, path: '/members' },
  { component: NewsPage, locale: 'zh', metadata: newsMetadata, path: '/news' },
  { component: EnNewsPage, locale: 'en', metadata: enNewsMetadata, path: '/news' },
  { component: JoinPage, locale: 'zh', metadata: joinMetadata, path: '/join' },
  { component: EnJoinPage, locale: 'en', metadata: enJoinMetadata, path: '/join' },
  { component: PrivacyPage, locale: 'zh', metadata: privacyMetadata, path: '/privacy' },
  { component: EnPrivacyPage, locale: 'en', metadata: enPrivacyMetadata, path: '/privacy' },
]

describe('static locale route composition', () => {
  it.each(STATIC_PAGES)(
    'renders one accessible page shell for $locale $path',
    ({ component: Page, locale, metadata, path }) => {
      render(<Page />)

      const main = screen.getByRole('main')
      expect(main.getAttribute('id')).toBe('main-content')
      expect(main.tabIndex).toBe(-1)
      const headings = screen.getAllByRole('heading', { level: 1 })
      expect(headings).toHaveLength(1)
      expect(headings[0].textContent?.trim()).not.toBe('')
      expectLocalizedMetadata(metadata, path, locale)
    },
  )

  it('publishes reviewed member names but no unapproved member logos', () => {
    const { container } = render(<MembersPage />)

    expect(screen.getByRole('heading', { name: '清华大学' })).toBeTruthy()
    expect(screen.getByRole('link', { name: /查看原始公示/u }).getAttribute('target')).toBe(
      '_blank',
    )
    expect(container.querySelector('.member-card img')).toBeNull()
  })

  it('lists the source-reviewed program and excludes the withdrawn launch draft', () => {
    render(<NewsPage />)

    expect(screen.getByRole('link', { name: /网络安全人员开放计划/u })).toBeTruthy()
    expect(screen.queryByText(/官网发布稿撤回记录/u)).toBeNull()
    expect(screen.queryByText(/联盟官方网站正式上线/u)).toBeNull()
  })

  it('publishes four distinct participation paths while keeping the application unavailable', () => {
    const cases = [
      {
        component: JoinPage,
        headings: [
          '联盟合作与入盟意向',
          '专业用户计划（时点信息）',
          '机构生态共建',
          '工作组议题参与',
        ],
        links: [
          ['查看计划与当前状态', '/news/cybersecurity-open-program'],
          ['查看生态共建框架', '/cybersecurity'],
          ['查看工作组', '/working-groups'],
        ],
        unavailablePattern: /当前不可用/u,
      },
      {
        component: EnJoinPage,
        headings: [
          'Alliance cooperation and membership enquiries',
          'Professional-user program (dated notice)',
          'Institutional ecosystem collaboration',
          'Working-group participation',
        ],
        links: [
          ['View the dated notice and status', '/en/news/cybersecurity-open-program'],
          ['Review the ecosystem framework', '/en/cybersecurity'],
          ['Explore working groups', '/en/working-groups'],
        ],
        unavailablePattern: /not currently available/iu,
      },
    ] as const

    for (const { component: Page, headings, links, unavailablePattern } of cases) {
      const { container, unmount } = render(<Page />)

      for (const heading of headings) {
        expect(screen.getByRole('heading', { level: 3, name: heading })).toBeTruthy()
      }
      for (const [name, href] of links) {
        expect(screen.getByRole('link', { name }).getAttribute('href')).toBe(href)
      }
      expect(container.querySelector('.external-application--unavailable')).not.toBeNull()
      expect(container.querySelector('.external-application a')).toBeNull()
      expect(container.querySelector('.external-application__unavailable')?.textContent).toMatch(
        unavailablePattern,
      )

      unmount()
    }
  })

  it('states the static-site and external-form information boundary', () => {
    render(<PrivacyPage />)

    expect(screen.getByRole('heading', { name: /官网与外部表单/u })).toBeTruthy()
    expect(screen.getByRole('heading', { name: '本站' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: '目标表单' })).toBeTruthy()
    expect(screen.getByText(/不接收、落库或保存/u)).toBeTruthy()
  })
})
