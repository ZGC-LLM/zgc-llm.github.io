import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { generateStaticParams as generateJoinStaticParams } from '@/app/(frontend)/working-groups/[slug]/join/page'
import { generateStaticParams as generateMembersStaticParams } from '@/app/(frontend)/working-groups/[slug]/members/page'
import { generateStaticParams as generateOverviewStaticParams } from '@/app/(frontend)/working-groups/[slug]/page'
import { PUBLIC_STATIC_ROUTES, resolveApplicationTarget } from '@/config/site'
import { MEMBERS } from '@/content/members'
import { getWorkingGroupMembers, WORKING_GROUP_MEMBERS } from '@/content/working-group-members'
import { getWorkingGroupBySlug, getWorkingGroupSlugs } from '@/content/working-groups'
import { describe, expect, it } from 'vitest'

describe('resolveApplicationTarget("professional")', () => {
  it('is available when given a valid https URL', () => {
    const target = resolveApplicationTarget(
      'professional',
      'https://example.feishu.cn/share/form/professional',
    )

    expect(target.isAvailable).toBe(true)
    expect(target.href).toBe('https://example.feishu.cn/share/form/professional')
    expect(target.internalHref).toBe('/working-groups/cybersecurity/join')
  })

  it.each([[undefined], ['http://example.feishu.cn/share/form/professional'], ['not-a-url']])(
    'falls back to unavailable when the configured URL is %s',
    (configuredUrl) => {
      const target = resolveApplicationTarget('professional', configuredUrl)

      expect(target.isAvailable).toBe(false)
      expect(target.href).toBeUndefined()
    },
  )
})

describe('working group lookup helpers', () => {
  it('returns a group for every slug reported by getWorkingGroupSlugs', () => {
    const slugs = getWorkingGroupSlugs()

    expect(slugs.length).toBeGreaterThan(0)
    for (const slug of slugs) {
      expect(getWorkingGroupBySlug(slug)?.slug).toBe(slug)
    }
  })

  it('returns undefined for a slug that does not exist', () => {
    expect(getWorkingGroupBySlug('does-not-exist')).toBeUndefined()
  })
})

describe('getWorkingGroupMembers', () => {
  it('returns an empty list before any member is publicly authorised', () => {
    expect(getWorkingGroupMembers('cybersecurity')).toEqual([])
  })

  it('returns an empty list for an unknown slug', () => {
    expect(getWorkingGroupMembers('does-not-exist')).toEqual([])
  })
})

describe('working-group route generateStaticParams', () => {
  const expectedParams = getWorkingGroupSlugs().map((slug) => ({ slug }))

  it('pre-renders every working-group slug on the overview route', () => {
    expect(generateOverviewStaticParams()).toEqual(expectedParams)
  })

  it('pre-renders every working-group slug on the members route', () => {
    expect(generateMembersStaticParams()).toEqual(expectedParams)
  })

  it('pre-renders every working-group slug on the join route', () => {
    expect(generateJoinStaticParams()).toEqual(expectedParams)
  })
})

describe('working-group routes are registered as public static routes', () => {
  it('includes the overview, members, and join routes for every working group', () => {
    for (const slug of getWorkingGroupSlugs()) {
      expect(PUBLIC_STATIC_ROUTES).toContain(`/working-groups/${slug}`)
      expect(PUBLIC_STATIC_ROUTES).toContain(`/working-groups/${slug}/members`)
      expect(PUBLIC_STATIC_ROUTES).toContain(`/working-groups/${slug}/join`)
    }
    expect(PUBLIC_STATIC_ROUTES).toContain('/working-groups')
  })
})

describe('working-group member data source separation (F-014)', () => {
  it('does not import the alliance-level member source', () => {
    const filePath = join(process.cwd(), 'src/content/working-group-members.ts')
    const source = readFileSync(filePath, 'utf-8')

    expect(source).not.toMatch(/from ['"]@\/content\/members['"]/)
  })

  it('keeps alliance-level members and working-group members as independent data structures', () => {
    expect(MEMBERS).not.toBe(WORKING_GROUP_MEMBERS)
    expect(Array.isArray(MEMBERS)).toBe(true)
    expect(Array.isArray(WORKING_GROUP_MEMBERS)).toBe(false)
    expect(Object.keys(WORKING_GROUP_MEMBERS)).not.toContain('length')
  })
})
