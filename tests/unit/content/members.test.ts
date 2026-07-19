import {
  MEMBER_DIRECTORY_FACTS,
  MEMBER_DIRECTORY_GROUPS,
  MEMBER_DIRECTORY_SOURCE,
  MEMBERS,
  MEMBERS_PAGE_COPY,
  memberHasPublishedScope,
} from '@/content/members'
import type { MemberSummary } from '@/types/content'
import { publishedFact } from '../fixtures/content-bundle'
import { describe, expect, it } from 'vitest'

describe('public member directory', () => {
  it('publishes only records with reviewed display-name authorization', () => {
    expect(MEMBERS.length).toBeGreaterThan(0)

    for (const member of MEMBERS) {
      expect(memberHasPublishedScope(member, 'display-name')).toBe(true)
      expect(member.logo).toBeUndefined()
      expect(member.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(member.name.trim()).not.toBe('')
    }
  })

  it('keeps public group membership referentially complete and non-overlapping', () => {
    const memberIds = new Set(MEMBERS.map(({ id }) => id))
    const groupedIds = MEMBER_DIRECTORY_GROUPS.flatMap(({ memberIds: ids }) => ids)

    expect(new Set(groupedIds).size).toBe(groupedIds.length)
    expect(new Set(groupedIds)).toEqual(memberIds)
    expect(MEMBER_DIRECTORY_GROUPS.every(({ memberIds: ids }) => ids.length > 0)).toBe(true)
  })

  it('shows a public role only when the role scope was published', () => {
    for (const member of MEMBERS) {
      expect(memberHasPublishedScope(member, 'role')).toBe(member.description !== undefined)
    }
  })

  it('does not infer authorization from a fact that is absent, neutralized or scoped elsewhere', () => {
    const base: MemberSummary = {
      id: 'synthetic-member',
      name: '合成测试成员',
      type: 'ecosystem',
    }
    const neutralized: MemberSummary = {
      ...base,
      facts: [
        {
          authorizedScopes: ['display-name'],
          evidenceStatus: 'editorial',
          factId: 'FACT-301',
          publication: 'neutralize',
          reviewedAt: '2026-07-19',
        },
      ],
    }
    const differentScope: MemberSummary = {
      ...base,
      facts: [publishedFact('FACT-302', ['role'])],
    }

    expect(memberHasPublishedScope(base, 'display-name')).toBe(false)
    expect(memberHasPublishedScope(neutralized, 'display-name')).toBe(false)
    expect(memberHasPublishedScope(differentScope, 'display-name')).toBe(false)
  })

  it('anchors the directory to a complete, reviewed HTTPS source', () => {
    expect(MEMBER_DIRECTORY_SOURCE).toEqual(
      expect.objectContaining({
        publishedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        reviewedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        title: expect.any(String),
        url: expect.stringMatching(/^https:\/\//),
      }),
    )
    expect(MEMBER_DIRECTORY_FACTS).toEqual([
      expect.objectContaining({
        authorizedScopes: expect.arrayContaining(['result']),
        publication: 'publish',
        source: MEMBER_DIRECTORY_SOURCE,
      }),
    ])
  })

  it('provides distinct bilingual copy without inventing official English organization names', () => {
    expect(MEMBERS_PAGE_COPY.zh.heroTitle).not.toBe(MEMBERS_PAGE_COPY.en.heroTitle)
    expect(MEMBERS_PAGE_COPY.en.sourceDescription).toContain('remain in Chinese')
    expect(MEMBERS_PAGE_COPY.en.sourceDescription).toContain('does not infer')
    expect(MEMBERS_PAGE_COPY.zh.groups.council.title).not.toBe('')
    expect(MEMBERS_PAGE_COPY.en.groups['supervisory-board'].title).not.toBe('')
    expect(MEMBERS_PAGE_COPY.en.roleLabels['监事长单位']).toBe(
      'Supervisory board chair organization',
    )
  })
})
