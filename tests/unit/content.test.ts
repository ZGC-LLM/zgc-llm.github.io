import { CYBERSECURITY_ECOSYSTEM } from '@/content/cybersecurity'
import { getPublishedNews, NEWS_ENTRIES } from '@/content/news'
import {
  getWorkingGroupBySlug,
  getWorkingGroupSlugs,
  WORKING_GROUPS,
} from '@/content/working-groups'
import { describe, expect, it } from 'vitest'

describe('public website content', () => {
  const cyberGroup = getWorkingGroupBySlug('cybersecurity')

  it('keeps the cybersecurity ecosystem open to different foundation models', () => {
    expect(CYBERSECURITY_ECOSYSTEM.openPrinciples).toContain('厂商中立')
    expect(CYBERSECURITY_ECOSYSTEM.openPrinciples).toContain('对等参与')
    expect(CYBERSECURITY_ECOSYSTEM.summary).toContain('厂商中立')

    // The model anchor is named but the ecosystem stays open to every vendor on equal terms.
    const modelAnchor = cyberGroup?.leads.find(({ name }) => name.includes('智谱'))
    expect(modelAnchor?.description).toContain('对不同基础模型厂商对等开放')
  })

  it('exposes the redesigned cybersecurity ecosystem structure', () => {
    expect(CYBERSECURITY_ECOSYSTEM.cycle).toHaveLength(6)
    expect(CYBERSECURITY_ECOSYSTEM.resources).toHaveLength(6)
    expect(CYBERSECURITY_ECOSYSTEM.actions).toHaveLength(4)
    expect(CYBERSECURITY_ECOSYSTEM.openPrinciples).toHaveLength(4)

    // The legacy shape is fully replaced; the division of labour now lives only in the working group.
    expect(CYBERSECURITY_ECOSYSTEM).not.toHaveProperty('roles')
    expect(CYBERSECURITY_ECOSYSTEM).not.toHaveProperty('principles')
    expect(CYBERSECURITY_ECOSYSTEM).not.toHaveProperty('organisation')

    for (const card of [...CYBERSECURITY_ECOSYSTEM.resources, ...CYBERSECURITY_ECOSYSTEM.actions]) {
      expect(card.title.length).toBeGreaterThan(0)
      expect(card.description.length).toBeGreaterThan(0)
    }
  })

  it('keeps a single authoritative division of labour in the working group leads', () => {
    // 智谱 is the lead (not merely a supporter); Tsinghua is academic-only.
    const zhipu = cyberGroup?.leads.find(({ name }) => name.includes('智谱'))
    expect(zhipu?.role).toContain('牵引')
    const tsinghua = cyberGroup?.leads.find(({ name }) => name.includes('清华'))
    expect(tsinghua?.role).toBe('学术指导')

    // 数说安全 / 云起无垠 stay as two independent leads (never merged into one).
    expect(cyberGroup?.leads.some(({ name }) => name.includes('数说安全'))).toBe(true)
    expect(cyberGroup?.leads.some(({ name }) => name.includes('云起无垠'))).toBe(true)

    // 监管 is not a division-of-labour role; it is covered by governance boundaries.
    expect(cyberGroup?.leads.some(({ role }) => role.includes('监管'))).toBe(false)
    expect(
      CYBERSECURITY_ECOSYSTEM.governanceBoundaries.some((rule) =>
        rule.includes('不被强制交付原始数据'),
      ),
    ).toBe(true)
  })

  it('links the cybersecurity initiative from the working group catalog', () => {
    expect(WORKING_GROUPS).toContainEqual(
      expect.objectContaining({
        ecosystemHref: '/cybersecurity',
        id: 'cybersecurity',
        slug: 'cybersecurity',
      }),
    )
  })

  it('exposes working group lookup helpers without fabricating leads or outcomes', () => {
    expect(getWorkingGroupSlugs()).toEqual(['cybersecurity'])

    const group = getWorkingGroupBySlug('cybersecurity')
    expect(group).toBeDefined()
    expect(group?.title).toBe('网络安全工作组')
    expect(group?.responsibilities.length).toBeGreaterThan(0)
    expect(group?.researchDirections.length).toBeGreaterThan(0)

    const authorisedLeads = ['联盟', '智谱', '清华', '数说安全', '云起无垠']
    for (const lead of authorisedLeads) {
      expect(group?.leads.some(({ name, named }) => named && name.includes(lead))).toBe(true)
    }
    const unnamedLead = group?.leads.find(({ named }) => !named)
    expect(unnamedLead?.role).toBe('生态伙伴')

    expect(getWorkingGroupBySlug('unknown-slug')).toBeUndefined()
  })

  it('publishes only explicitly published news with unique slugs', () => {
    const publishedNews = getPublishedNews(NEWS_ENTRIES)
    const slugs = publishedNews.map(({ slug }) => slug)

    expect(publishedNews.every(({ published }) => published)).toBe(true)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
