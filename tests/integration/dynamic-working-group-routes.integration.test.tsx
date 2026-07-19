import { cleanup, render, screen } from '@testing-library/react'
import type { Metadata } from 'next'
import type { ReactElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const navigation = vi.hoisted(() => ({
  notFound: vi.fn((): never => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

vi.mock('next/navigation', () => ({ notFound: navigation.notFound }))

import EnWorkingGroupJoinPage, {
  dynamicParams as enJoinDynamicParams,
  generateMetadata as generateEnJoinMetadata,
  generateStaticParams as generateEnJoinStaticParams,
} from '@/app/(en)/en/working-groups/[slug]/join/page'
import EnWorkingGroupMembersPage, {
  dynamicParams as enMembersDynamicParams,
  generateMetadata as generateEnMembersMetadata,
  generateStaticParams as generateEnMembersStaticParams,
} from '@/app/(en)/en/working-groups/[slug]/members/page'
import EnWorkingGroupPage, {
  dynamicParams as enOverviewDynamicParams,
  generateMetadata as generateEnOverviewMetadata,
  generateStaticParams as generateEnOverviewStaticParams,
} from '@/app/(en)/en/working-groups/[slug]/page'
import WorkingGroupJoinPage, {
  dynamicParams as zhJoinDynamicParams,
  generateMetadata as generateZhJoinMetadata,
  generateStaticParams as generateZhJoinStaticParams,
} from '@/app/(frontend)/working-groups/[slug]/join/page'
import WorkingGroupMembersPage, {
  dynamicParams as zhMembersDynamicParams,
  generateMetadata as generateZhMembersMetadata,
  generateStaticParams as generateZhMembersStaticParams,
} from '@/app/(frontend)/working-groups/[slug]/members/page'
import WorkingGroupPage, {
  dynamicParams as zhOverviewDynamicParams,
  generateMetadata as generateZhOverviewMetadata,
  generateStaticParams as generateZhOverviewStaticParams,
} from '@/app/(frontend)/working-groups/[slug]/page'
import { getWorkingGroupSlugs } from '@/content/working-groups'

import { expectLocalizedMetadata } from './helpers/metadata-contract'

afterEach(cleanup)

type RoutePage = (props: { params: Promise<{ slug: string }> }) => Promise<ReactElement>
type RouteMetadata = (props: { params: Promise<{ slug: string }> }) => Promise<Metadata>

interface RouteCase {
  locale: 'zh' | 'en'
  metadata: RouteMetadata
  page: RoutePage
  suffix: '' | '/join' | '/members'
}

const ROUTES: readonly RouteCase[] = [
  { locale: 'zh', metadata: generateZhOverviewMetadata, page: WorkingGroupPage, suffix: '' },
  { locale: 'en', metadata: generateEnOverviewMetadata, page: EnWorkingGroupPage, suffix: '' },
  {
    locale: 'zh',
    metadata: generateZhMembersMetadata,
    page: WorkingGroupMembersPage,
    suffix: '/members',
  },
  {
    locale: 'en',
    metadata: generateEnMembersMetadata,
    page: EnWorkingGroupMembersPage,
    suffix: '/members',
  },
  {
    locale: 'zh',
    metadata: generateZhJoinMetadata,
    page: WorkingGroupJoinPage,
    suffix: '/join',
  },
  {
    locale: 'en',
    metadata: generateEnJoinMetadata,
    page: EnWorkingGroupJoinPage,
    suffix: '/join',
  },
]

describe('working-group dynamic route graph', () => {
  it('disables unknown params and derives all locale route variants from the content source', () => {
    const expected = getWorkingGroupSlugs().map((slug) => ({ slug }))

    expect([
      zhOverviewDynamicParams,
      zhMembersDynamicParams,
      zhJoinDynamicParams,
      enOverviewDynamicParams,
      enMembersDynamicParams,
      enJoinDynamicParams,
    ]).toEqual([false, false, false, false, false, false])
    for (const generate of [
      generateZhOverviewStaticParams,
      generateZhMembersStaticParams,
      generateZhJoinStaticParams,
      generateEnOverviewStaticParams,
      generateEnMembersStaticParams,
      generateEnJoinStaticParams,
    ]) {
      expect(generate()).toEqual(expected)
    }
  })

  it.each(ROUTES)('renders and describes the known $locale route $suffix', async ({ locale, metadata, page, suffix }) => {
    const slug = 'cybersecurity'
    const element = await page({ params: Promise.resolve({ slug }) })
    render(element)
    const routeMetadata = await metadata({ params: Promise.resolve({ slug }) })

    const main = screen.getByRole('main')
    expect(main.getAttribute('id')).toBe('main-content')
    expect(main.tabIndex).toBe(-1)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expectLocalizedMetadata(routeMetadata, `/working-groups/${slug}${suffix}`, locale)
  })

  it.each(ROUTES)('returns notFound for an unknown $locale route $suffix', async ({ metadata, page }) => {
    const params = Promise.resolve({ slug: 'does-not-exist' })
    const element = await page({ params })

    expect(() => render(element)).toThrow('NEXT_NOT_FOUND')
    await expect(
      metadata({ params: Promise.resolve({ slug: 'does-not-exist' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
