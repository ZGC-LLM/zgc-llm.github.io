import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { MembersDirectory, MembersView } from '@/components/pages/members-view'
import {
  MEMBER_DIRECTORY_GROUPS,
  MEMBER_DIRECTORY_SOURCE,
  MEMBERS,
  MEMBERS_PAGE_COPY,
} from '@/content/members'
import type { FactAuthorizationScope, FactReference, MemberSummary } from '@/types/content'

afterEach(cleanup)

function publicFact(scopes: readonly FactAuthorizationScope[]): FactReference {
  return {
    authorizedScopes: scopes,
    evidenceStatus: 'project-decision',
    factId: `TEST-${scopes.join('-')}`,
    publication: 'publish',
    reviewedAt: '2026-07-19',
  }
}

function memberById(id: string): MemberSummary {
  const member = MEMBERS.find((candidate) => candidate.id === id)
  if (!member) throw new Error(`Missing member fixture: ${id}`)
  return member
}

describe('MembersDirectory', () => {
  it('fails closed when no recognized member has display-name publication scope', () => {
    const source = memberById(MEMBER_DIRECTORY_GROUPS[0].memberIds[0])
    const member = { ...source, facts: [publicFact(['role'])] }
    const copy = MEMBERS_PAGE_COPY.en

    render(<MembersDirectory locale="en" members={[member]} />)

    expect(screen.getByRole('heading', { name: copy.emptyTitle })).toBeTruthy()
    expect(screen.getByRole('link', { name: copy.emptyAction }).getAttribute('href')).toBe(
      '/en/news',
    )
    expect(screen.queryByText(member.name)).toBeNull()
  })

  it('groups recognized records, alternates section styling, and gates logo and role separately', () => {
    const council = {
      ...memberById(MEMBER_DIRECTORY_GROUPS[0].memberIds[0]),
      facts: [publicFact(['display-name', 'logo', 'role'])],
      logo: '/brand-mark.svg',
    }
    const supervisorSource = memberById(MEMBER_DIRECTORY_GROUPS[1].memberIds[0])
    const supervisor = {
      ...supervisorSource,
      description: undefined,
      facts: [publicFact(['display-name'])],
    }
    const unlisted: MemberSummary = {
      facts: [publicFact(['display-name'])],
      id: 'not-in-public-directory',
      name: '不在公开分组中的记录',
      type: 'ecosystem',
    }
    const copy = MEMBERS_PAGE_COPY.en

    render(<MembersDirectory locale="en" members={[council, supervisor, unlisted]} />)

    const firstHeading = screen.getByRole('heading', { name: copy.groups.council.title })
    const secondHeading = screen.getByRole('heading', {
      name: copy.groups['supervisory-board'].title,
    })
    const firstSection = firstHeading.closest('section')
    const secondSection = secondHeading.closest('section')
    expect(firstSection).not.toBeNull()
    expect(secondSection).not.toBeNull()
    expect(firstSection?.classList.contains('block')).toBe(true)
    expect(firstSection?.classList.contains('block--subtle')).toBe(false)
    expect(secondSection?.classList.contains('block')).toBe(true)
    expect(secondSection?.classList.contains('block--subtle')).toBe(true)
    expect(
      screen
        .getByRole('img', { name: `${council.name}${copy.logoAltSuffix}` })
        .getAttribute('lang'),
    ).toBe('zh-CN')
    expect(screen.getByText(copy.roleLabels[council.description!])).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: supervisor.name }).parentElement?.querySelector('img'),
    ).toBeNull()
    expect(screen.queryByText(unlisted.name)).toBeNull()
  })
})

describe('MembersView', () => {
  it.each([
    { locale: 'zh' as const, pathPrefix: '' },
    { locale: 'en' as const, pathPrefix: '/en' },
  ])(
    'renders the reviewed source and localized navigation in $locale',
    ({ locale, pathPrefix }) => {
      const copy = MEMBERS_PAGE_COPY[locale]

      const { container } = render(<MembersView locale={locale} />)

      expect(screen.getByRole('main').getAttribute('id')).toBe('main-content')
      expect(screen.getByRole('heading', { level: 1, name: copy.heroTitle })).toBeTruthy()
      expect(screen.getByRole('link', { name: copy.relationAction }).getAttribute('href')).toBe(
        `${pathPrefix}/working-groups`,
      )
      const sourceLink = screen.getByRole('link', { name: copy.sourceLinkLabel })
      expect(sourceLink.getAttribute('href')).toBe(MEMBER_DIRECTORY_SOURCE.url)
      expect(sourceLink.getAttribute('rel')).toBe('noreferrer noopener')
      expect(
        container.querySelector(`time[datetime="${MEMBER_DIRECTORY_SOURCE.publishedAt}"]`),
      ).not.toBeNull()
      expect(
        container.querySelector(`time[datetime="${MEMBER_DIRECTORY_SOURCE.reviewedAt}"]`),
      ).not.toBeNull()
    },
  )
})
