import { chromium, expect, test } from '@playwright/test'

import {
  median,
  parseLighthouseScores,
  runLighthouse,
  type LighthouseCategoryId,
  type LighthouseMode,
} from '../helpers/lighthouse'

const LIGHTHOUSE_CASES: Readonly<Record<LighthouseMode, readonly string[]>> = {
  desktop: ['/', '/en', '/en/working-groups/cybersecurity'],
  mobile: ['/', '/en', '/join'],
}
const RUNS_PER_ROUTE = 3
const NON_PERFORMANCE_CATEGORIES: readonly LighthouseCategoryId[] = [
  'accessibility',
  'best-practices',
  'seo',
]

function attachmentSlug(path: string): string {
  return path === '/' ? 'home' : path.replace(/^\/+|\/+$/gu, '').replaceAll('/', '-')
}

test('Lighthouse score normalization preserves exact release-threshold boundaries', () => {
  const scores = parseLighthouseScores(
    JSON.stringify({
      categories: {
        accessibility: { score: 0.949 },
        'best-practices': { score: 0.949 },
        performance: { score: 0.899 },
        seo: { score: 0.949 },
      },
    }),
    'threshold boundary fixture',
  )

  expect(scores.performance).toBeCloseTo(89.9)
  expect(scores.performance).toBeLessThan(90)

  for (const category of NON_PERFORMANCE_CATEGORIES) {
    expect(scores[category]).toBeCloseTo(94.9)
    expect(scores[category]).toBeLessThan(95)
  }
})

for (const mode of ['desktop', 'mobile'] as const) {
  test(`${mode} Lighthouse release thresholds hold across representative journeys`, async ({
    baseURL,
  }, testInfo) => {
    test.setTimeout(12 * 60_000)
    expect(baseURL, 'Lighthouse requires the configured Playwright base URL').toBeTruthy()

    const summary: Record<string, readonly Record<LighthouseCategoryId, number>[]> = {}

    for (const path of LIGHTHOUSE_CASES[mode]) {
      const url = new URL(path, baseURL).toString()
      const scores = []

      for (let run = 1; run <= RUNS_PER_ROUTE; run += 1) {
        const result = await runLighthouse(url, mode, chromium.executablePath())

        scores.push(result.scores)
        await testInfo.attach(`lighthouse-${mode}-${attachmentSlug(path)}-run-${run}.json`, {
          body: Buffer.from(result.rawReport),
          contentType: 'application/json',
        })
      }

      summary[path] = scores
      expect(
        median(scores.map(({ performance }) => performance)),
        `${mode} ${path} median performance score`,
      ).toBeGreaterThanOrEqual(90)

      for (const category of NON_PERFORMANCE_CATEGORIES) {
        expect(
          Math.min(...scores.map((score) => score[category])),
          `${mode} ${path} minimum ${category} score`,
        ).toBeGreaterThanOrEqual(95)
      }
    }

    await testInfo.attach(`lighthouse-${mode}-summary.json`, {
      body: Buffer.from(JSON.stringify(summary, null, 2)),
      contentType: 'application/json',
    })
    process.stdout.write(`\nLighthouse ${mode} scores: ${JSON.stringify(summary)}\n`)
  })
}
