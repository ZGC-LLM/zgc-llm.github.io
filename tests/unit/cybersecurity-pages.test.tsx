import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { CybersecurityView } from '@/components/pages/cybersecurity-view'
import { getCybersecurityEcosystem } from '@/content/cybersecurity'
import { getWorkingGroupBySlug, localizeWorkingGroup } from '@/content/working-groups'
import { buildAlternates } from '@/i18n/routing'

import CybersecurityPage, { metadata as zhMetadata } from '@/app/(frontend)/cybersecurity/page'
import EnCybersecurityPage, { metadata as enMetadata } from '@/app/(en)/en/cybersecurity/page'

afterEach(cleanup)

describe('CybersecurityView', () => {
  it('renders the zh ecosystem narrative with cta links and cycle/resources/actions content', () => {
    const eco = getCybersecurityEcosystem('zh')
    render(<CybersecurityView locale="zh" />)

    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content')
    expect(screen.getByRole('heading', { level: 1, name: eco.title })).toBeTruthy()
    expect(
      screen.getAllByRole('link', { name: '加入联盟' })[0].getAttribute('href'),
    ).toBe('/join')
    expect(screen.getByRole('link', { name: '查看工作组组织信息' }).getAttribute('href')).toBe(
      '/working-groups/cybersecurity',
    )
    expect(screen.getByTestId('ecosystem-cycle').children.length).toBe(eco.cycle.length)
    expect(screen.getByText(eco.resources[0].title)).toBeTruthy()
    expect(screen.getByText(eco.actions[0].title)).toBeTruthy()
    expect(screen.getByText(eco.contribution[0])).toBeTruthy()
    // 组织机制区块复用工作组分工 leads（分工单一数据源）。
    const cyberGroup = getWorkingGroupBySlug('cybersecurity')
    const leads = cyberGroup ? localizeWorkingGroup(cyberGroup, 'zh').leads : []
    expect(screen.getByText(leads[1].role)).toBeTruthy()
    expect(screen.getByText(eco.governanceBoundaries[0])).toBeTruthy()
    expect(screen.getByLabelText('生态治理原则').textContent).toContain(eco.openPrinciples[0])
  })

  it('renders the en ecosystem narrative with localized cta links', () => {
    render(<CybersecurityView locale="en" />)

    expect(
      screen.getAllByRole('link', { name: 'Join the Alliance' })[0].getAttribute('href'),
    ).toBe('/en/join')
    expect(
      screen.getByRole('link', { name: 'View working-group information' }).getAttribute('href'),
    ).toBe('/en/working-groups/cybersecurity')
  })
})

describe('cybersecurity route pages', () => {
  it('zh page renders the CybersecurityView and exposes independent canonical metadata', () => {
    render(<CybersecurityPage />)

    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content')
    expect(zhMetadata.title).toBe(getCybersecurityEcosystem('zh').title)
    expect(zhMetadata.alternates).toEqual(buildAlternates('/cybersecurity', 'zh'))
  })

  it('en page renders the CybersecurityView and exposes independent canonical metadata', () => {
    render(<EnCybersecurityPage />)

    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content')
    expect(enMetadata.title).toBe(getCybersecurityEcosystem('en').title)
    expect(enMetadata.alternates).toEqual(buildAlternates('/cybersecurity', 'en'))
  })
})
