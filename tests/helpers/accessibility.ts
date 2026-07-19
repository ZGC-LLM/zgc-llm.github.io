import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, type TestInfo } from '@playwright/test'

const RELEASE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'] as const

export async function expectNoSeriousAccessibilityViolations(
  page: Page,
  testInfo: TestInfo,
  stateName: string,
): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags([...RELEASE_TAGS]).analyze()
  const blockingViolations = results.violations.filter(
    ({ impact }) => impact === 'critical' || impact === 'serious',
  )

  await testInfo.attach(`axe-${stateName}.json`, {
    body: Buffer.from(JSON.stringify(results, null, 2)),
    contentType: 'application/json',
  })

  expect(
    blockingViolations,
    `${stateName} should have zero critical or serious axe violations`,
  ).toEqual([])
}
