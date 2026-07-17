import { CYBERSECURITY_ECOSYSTEM } from '@/content/cybersecurity'
import { getPublishedNews, NEWS_ENTRIES } from '@/content/news'
import { WORKING_GROUPS } from '@/content/working-groups'
import { describe, expect, it } from 'vitest'

describe('public website content', () => {
  it('keeps the cybersecurity ecosystem open to different foundation models', () => {
    expect(CYBERSECURITY_ECOSYSTEM.openPrinciples).toContain('厂商中立')
    expect(CYBERSECURITY_ECOSYSTEM.openPrinciples).toContain('对等参与')
    expect(CYBERSECURITY_ECOSYSTEM.summary).toContain('厂商中立')

    // The model anchor is named but the ecosystem stays open to every vendor on equal terms.
    const modelAnchor = CYBERSECURITY_ECOSYSTEM.organisation.find(({ title }) =>
      title.includes('智谱'),
    )
    expect(modelAnchor?.description).toContain('对不同基础模型厂商对等开放')
  })

  it('exposes the redesigned cybersecurity ecosystem structure', () => {
    expect(CYBERSECURITY_ECOSYSTEM.cycle).toHaveLength(6)
    expect(CYBERSECURITY_ECOSYSTEM.resources).toHaveLength(5)
    expect(CYBERSECURITY_ECOSYSTEM.actions).toHaveLength(4)
    expect(CYBERSECURITY_ECOSYSTEM.organisation).toHaveLength(6)
    expect(CYBERSECURITY_ECOSYSTEM.openPrinciples).toHaveLength(4)

    // The legacy shape is fully replaced.
    expect(CYBERSECURITY_ECOSYSTEM).not.toHaveProperty('roles')
    expect(CYBERSECURITY_ECOSYSTEM).not.toHaveProperty('principles')

    for (const card of [
      ...CYBERSECURITY_ECOSYSTEM.resources,
      ...CYBERSECURITY_ECOSYSTEM.actions,
      ...CYBERSECURITY_ECOSYSTEM.organisation,
    ]) {
      expect(card.title.length).toBeGreaterThan(0)
      expect(card.description.length).toBeGreaterThan(0)
    }
  })

  it('names only the authorised leads and never mandates raw data delivery', () => {
    const authorisedLeads = ['联盟', '智谱', '清华', '数说安全', '云起无垠']
    for (const lead of authorisedLeads) {
      expect(
        CYBERSECURITY_ECOSYSTEM.organisation.some(({ title }) => title.includes(lead)),
      ).toBe(true)
    }

    // Partners are never forced to hand over raw data.
    expect(
      CYBERSECURITY_ECOSYSTEM.governanceBoundaries.some((rule) =>
        rule.includes('不被强制交付原始数据'),
      ),
    ).toBe(true)
  })

  it('links the cybersecurity initiative from the working group catalog', () => {
    expect(WORKING_GROUPS).toContainEqual(
      expect.objectContaining({ href: '/cybersecurity', id: 'cybersecurity-ecosystem' }),
    )
  })

  it('publishes only explicitly published news with unique slugs', () => {
    const publishedNews = getPublishedNews(NEWS_ENTRIES)
    const slugs = publishedNews.map(({ slug }) => slug)

    expect(publishedNews.every(({ published }) => published)).toBe(true)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
