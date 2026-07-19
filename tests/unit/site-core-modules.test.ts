import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { generateStaticParams as generateJoinStaticParams } from '@/app/(frontend)/working-groups/[slug]/join/page'
import { generateStaticParams as generateMembersStaticParams } from '@/app/(frontend)/working-groups/[slug]/members/page'
import { generateStaticParams as generateOverviewStaticParams } from '@/app/(frontend)/working-groups/[slug]/page'
import { APPLICATION_TARGET, PUBLIC_STATIC_ROUTES, resolveApplicationTarget } from '@/config/site'
import { MEMBERS } from '@/content/members'
import { getWorkingGroupMembers, WORKING_GROUP_MEMBERS } from '@/content/working-group-members'
import { getWorkingGroupBySlug, getWorkingGroupSlugs } from '@/content/working-groups'
import { describe, expect, it } from 'vitest'

describe('resolveApplicationTarget', () => {
  it('is available when given a valid https URL', () => {
    const target = resolveApplicationTarget('https://example.feishu.cn/share/form/application')

    expect(target.isAvailable).toBe(true)
    expect(target.href).toBe('https://example.feishu.cn/share/form/application')
  })

  it('is available using the built-in default target when no configured URL is provided', () => {
    // configuredUrl 缺省时，默认参数回退到 APPLICATION_TARGET.href（内置飞书问卷默认链接），
    // 而不是保持不可用——这是新行为，不再需要显式 env 才能获得可用 CTA。
    const target = resolveApplicationTarget()

    expect(target.isAvailable).toBe(true)
    expect(target.href).toBe(APPLICATION_TARGET.href)
  })

  it.each([[''], ['http://example.feishu.cn/share/form/application'], ['not-a-url']])(
    'falls back to unavailable when an explicit configured URL is invalid (%s)',
    (configuredUrl) => {
      const target = resolveApplicationTarget(configuredUrl)

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
  it('returns the publicly authorised cybersecurity partners in governance order', () => {
    expect(getWorkingGroupMembers('cybersecurity').map(({ name }) => name)).toEqual([
      '中关村自主大模型产业联盟',
      '智谱',
      '清华大学',
      '数说安全',
      '云起无垠',
    ])
  })

  it('localizes the publicly authorised cybersecurity partners', () => {
    expect(getWorkingGroupMembers('cybersecurity', 'en').map(({ name }) => name)).toEqual([
      'Zhongguancun Independent Large Model Industry Alliance',
      'Zhipu',
      'Tsinghua University',
      'Datainsecurity',
      'CloudInfinite',
    ])
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
