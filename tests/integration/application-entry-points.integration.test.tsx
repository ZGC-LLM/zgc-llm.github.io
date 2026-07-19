import { cleanup, render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  APPLICATION_ENVIRONMENTS,
  isolateApplicationEnvironment,
} from './helpers/application-environment'

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
  vi.resetModules()
})

async function loadEntryPoints() {
  const [{ default: JoinPage }, { WorkingGroupJoinView }, { NewsArticle }, news] =
    await Promise.all([
      import('@/app/(frontend)/join/page'),
      import('@/app/(frontend)/working-groups/[slug]/join/page'),
      import('@/app/(frontend)/news/[slug]/page'),
      import('@/content/news'),
    ])

  return {
    alliance: JoinPage(),
    news: <NewsArticle entry={news.getPublishedNews()[0]} locale="zh" />,
    workingGroup: <WorkingGroupJoinView locale="zh" slug="cybersecurity" />,
  }
}

function applicationHref(element: ReactElement): string | null {
  const view = render(element)
  const anchor = view.container.querySelector('.external-application a')
  const href = anchor?.getAttribute('href') ?? null
  view.unmount()
  return href
}

function expectUnavailable(element: ReactElement): void {
  const view = render(element)

  expect(view.container.querySelector('.external-application a')).toBeNull()
  expect(view.container.querySelector('[aria-disabled="true"]')).not.toBeNull()
  view.unmount()
}

describe('application target isolation across public entry points', () => {
  it('keeps Alliance, working-group and program entry points unavailable by default', async () => {
    isolateApplicationEnvironment()
    const entries = await loadEntryPoints()

    expectUnavailable(entries.alliance)
    expectUnavailable(entries.workingGroup)
    expectUnavailable(entries.news)
  })

  it.each([
    ['alliance', APPLICATION_ENVIRONMENTS.alliance],
    ['workingGroup', APPLICATION_ENVIRONMENTS.workingGroup],
    ['news', APPLICATION_ENVIRONMENTS.program],
  ] as const)(
    'enables only the %s entry point from its exact dedicated environment',
    async (enabledId, environment) => {
      isolateApplicationEnvironment(environment)
      const entries = await loadEntryPoints()

      for (const [id, element] of Object.entries(entries) as Array<
        [keyof typeof entries, ReactElement]
      >) {
        if (id === enabledId) {
          expect(applicationHref(element)).toBe(environment.url)
        } else {
          expectUnavailable(element)
        }
      }
    },
  )
})
