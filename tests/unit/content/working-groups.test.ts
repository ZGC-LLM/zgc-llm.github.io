import {
  CYBERSECURITY_ECOSYSTEM,
  getCybersecurityEcosystem,
  getCybersecurityPageContent,
} from '@/content/cybersecurity'
import { getAllianceJoinContent } from '@/content/join'
import {
  getWorkingGroupBySlug,
  getWorkingGroupCatalogContent,
  getWorkingGroupMembersContent,
  getWorkingGroupOverviewContent,
  getWorkingGroupSlugs,
  localizeWorkingGroup,
  WORKING_GROUPS,
} from '@/content/working-groups'
import { getWorkingGroupMembers, WORKING_GROUP_MEMBERS } from '@/content/working-group-members'
import { describe, expect, it } from 'vitest'

describe('working-group catalog', () => {
  it('derives stable unique slugs from the catalog and resolves only known groups', () => {
    const expectedSlugs = WORKING_GROUPS.map(({ slug }) => slug)

    expect(getWorkingGroupSlugs()).toEqual(expectedSlugs)
    expect(new Set(expectedSlugs).size).toBe(expectedSlugs.length)
    expect(new Set(WORKING_GROUPS.map(({ id }) => id)).size).toBe(WORKING_GROUPS.length)
    for (const group of WORKING_GROUPS) expect(getWorkingGroupBySlug(group.slug)).toBe(group)
    expect(getWorkingGroupBySlug('unknown-working-group')).toBeUndefined()
  })

  it('keeps collaboration roles neutral until a participant is approved for public naming', () => {
    for (const group of WORKING_GROUPS) {
      expect(group.leads.length).toBeGreaterThan(0)
      expect(group.leads.every(({ named }) => !named)).toBe(true)
      expect(group.outcomes).toEqual([])
      expect(group.facts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            authorizedScopes: expect.arrayContaining(['commitment']),
            publication: 'publish',
          }),
        ]),
      )
    }
  })

  it('publishes non-empty scope and research directions without implying completed results', () => {
    for (const group of WORKING_GROUPS) {
      expect(group.description.trim()).not.toBe('')
      expect(group.responsibilities.every((item) => item.trim() !== '')).toBe(true)
      expect(group.researchDirections.every((item) => item.trim() !== '')).toBe(true)
      expect(group.responsibilities.length).toBeGreaterThan(0)
      expect(group.researchDirections.length).toBeGreaterThan(0)
    }
  })
})

describe('working-group localization', () => {
  it('returns the authoritative Chinese group unchanged', () => {
    const group = WORKING_GROUPS[0]

    expect(localizeWorkingGroup(group, 'zh')).toBe(group)
  })

  it('applies an English overlay without changing routing, evidence or application identity', () => {
    const group = WORKING_GROUPS[0]
    const localized = localizeWorkingGroup(group, 'en')

    expect(localized).toEqual(
      expect.objectContaining({
        applicationEnvKey: group.applicationEnvKey,
        ecosystemHref: group.ecosystemHref,
        facts: group.facts,
        id: group.id,
        kind: group.kind,
        slug: group.slug,
      }),
    )
    expect(localized.title).not.toBe(group.title)
    expect(localized.leads.every(({ named }) => !named)).toBe(true)
  })

  it('falls back to the source record when no reviewed English overlay exists', () => {
    const synthetic = {
      ...WORKING_GROUPS[0],
      id: 'synthetic-group',
      slug: 'synthetic-group',
      title: '合成工作组',
    }

    expect(localizeWorkingGroup(synthetic, 'en')).toBe(synthetic)
  })

  it('provides complete bilingual catalog and route-specific copy', () => {
    const zhCatalog = getWorkingGroupCatalogContent('zh')
    const enCatalog = getWorkingGroupCatalogContent('en')
    const zhOverview = getWorkingGroupOverviewContent('zh')
    const enOverview = getWorkingGroupOverviewContent('en')
    const zhMembers = getWorkingGroupMembersContent('zh')
    const enMembers = getWorkingGroupMembersContent('en')

    expect(zhCatalog.heroTitle).not.toBe(enCatalog.heroTitle)
    expect(zhCatalog.metadataDescription).not.toBe('')
    expect(enCatalog.metadataDescription).not.toBe('')
    expect(zhOverview.metadataDescriptionFor('测试工作组')).toContain('测试工作组')
    expect(enOverview.metadataDescriptionFor('Test Group')).toContain('Test Group')
    expect(zhMembers.metadataDescriptionFor('测试工作组')).toContain('测试工作组')
    expect(enMembers.metadataDescriptionFor('Test Group')).toContain('Test Group')
    expect(zhMembers.metadataTitleFor('测试工作组')).toContain('测试工作组')
    expect(enMembers.metadataTitleFor('Test Group')).toContain('Test Group')
    expect(zhMembers.pageDescriptionFor('测试工作组')).toContain('测试工作组')
    expect(enMembers.pageDescriptionFor('Test Group')).toContain('Test Group')
  })
})

describe('working-group collaborator directory', () => {
  it('keeps each list explicit and empty until public-use authorization is recorded', () => {
    for (const group of WORKING_GROUPS) {
      expect(Object.hasOwn(WORKING_GROUP_MEMBERS, group.slug)).toBe(true)
      expect(getWorkingGroupMembers(group.slug, 'zh')).toBe(WORKING_GROUP_MEMBERS[group.slug])
      expect(getWorkingGroupMembers(group.slug, 'en')).toBe(WORKING_GROUP_MEMBERS[group.slug])
      expect(getWorkingGroupMembers(group.slug)).toEqual([])
    }
  })

  it('returns an empty list rather than inventing collaborators for an unknown group', () => {
    expect(getWorkingGroupMembers('unknown-working-group', 'zh')).toEqual([])
    expect(getWorkingGroupMembers('unknown-working-group', 'en')).toEqual([])
  })
})

describe('cybersecurity topic relationship', () => {
  it('links the topic page from its working-group record', () => {
    expect(WORKING_GROUPS.some(({ ecosystemHref }) => ecosystemHref === '/cybersecurity')).toBe(
      true,
    )
  })

  it('offers the same collaboration structure and participation gateway in both locales', () => {
    const zh = getCybersecurityPageContent('zh')
    const en = getCybersecurityPageContent('en')
    const expectedPaths = [
      { href: undefined, id: 'alliance' },
      { href: '/news/cybersecurity-open-program', id: 'professional-program' },
      { href: '/cybersecurity', id: 'institutional-ecosystem' },
      { href: '/working-groups', id: 'working-groups' },
    ]

    expect(getCybersecurityEcosystem('zh')).toBe(zh)
    expect(getCybersecurityEcosystem('en')).toBe(en)
    expect(CYBERSECURITY_ECOSYSTEM).toBe(zh)
    expect(zh.title).not.toBe(en.title)
    expect(zh.cycle.length).toBeGreaterThan(0)
    expect(en.cycle).toHaveLength(zh.cycle.length)
    expect(en.resources).toHaveLength(zh.resources.length)
    expect(en.actions).toHaveLength(zh.actions.length)
    expect(en.openPrinciples).toHaveLength(zh.openPrinciples.length)
    expect(zh.governanceBoundaries.every((rule) => rule.trim() !== '')).toBe(true)
    expect(en.governanceBoundaries.every((rule) => rule.trim() !== '')).toBe(true)

    for (const locale of ['zh', 'en'] as const) {
      const paths = getAllianceJoinContent(locale).paths.items

      expect(paths.map(({ href, id }) => ({ href, id }))).toEqual(expectedPaths)
      expect(paths.find(({ id }) => id === 'professional-program')?.description).toMatch(
        locale === 'zh' ? /历史信息.*当前不可用/u : /dated information.*currently unavailable/iu,
      )
    }
  })

  it('does not retain legacy organization or division-of-labour shapes', () => {
    expect(CYBERSECURITY_ECOSYSTEM).not.toHaveProperty('organisation')
    expect(CYBERSECURITY_ECOSYSTEM).not.toHaveProperty('roles')
    expect(CYBERSECURITY_ECOSYSTEM).not.toHaveProperty('principles')
  })
})
