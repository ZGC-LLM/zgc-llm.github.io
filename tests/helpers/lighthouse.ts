import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'

export type LighthouseMode = 'desktop' | 'mobile'
export type LighthouseCategoryId = 'accessibility' | 'best-practices' | 'performance' | 'seo'

export interface LighthouseRun {
  readonly rawReport: string
  readonly scores: Readonly<Record<LighthouseCategoryId, number>>
}

interface LighthouseCategory {
  readonly score: number | null
}

interface LighthouseReport {
  readonly categories: Partial<Record<LighthouseCategoryId, LighthouseCategory>>
}

const LIGHTHOUSE_CLI = fileURLToPath(
  new URL('../../node_modules/lighthouse/cli/index.js', import.meta.url),
)
const CATEGORY_IDS: readonly LighthouseCategoryId[] = [
  'performance',
  'accessibility',
  'best-practices',
  'seo',
]

function executeLighthouse(
  args: readonly string[],
  chromePath: string,
): Promise<{ stderr: string; stdout: string }> {
  return new Promise((resolvePromise, rejectPromise) => {
    execFile(
      process.execPath,
      [LIGHTHOUSE_CLI, ...args],
      {
        encoding: 'utf8',
        env: { ...process.env, CHROME_PATH: chromePath },
        maxBuffer: 100 * 1024 * 1024,
        timeout: 180_000,
      },
      (error, stdout, stderr) => {
        if (error) {
          rejectPromise(
            new Error(`Lighthouse failed: ${error.message}${stderr ? `\n${stderr.trim()}` : ''}`),
          )
          return
        }

        resolvePromise({ stderr, stdout })
      },
    )
  })
}

function parseReport(rawReport: string): LighthouseReport {
  const parsed: unknown = JSON.parse(rawReport)

  if (typeof parsed !== 'object' || parsed === null || !('categories' in parsed)) {
    throw new Error('Lighthouse returned a report without categories')
  }

  return parsed as LighthouseReport
}

export function parseLighthouseScores(
  rawReport: string,
  reportLabel = 'report',
): Readonly<Record<LighthouseCategoryId, number>> {
  const report = parseReport(rawReport)

  return Object.fromEntries(
    CATEGORY_IDS.map((categoryId) => {
      const score = report.categories[categoryId]?.score

      if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 1) {
        throw new Error(`Lighthouse did not produce a valid ${categoryId} score for ${reportLabel}`)
      }

      return [categoryId, score * 100]
    }),
  ) as Record<LighthouseCategoryId, number>
}

export async function runLighthouse(
  url: string,
  mode: LighthouseMode,
  chromePath: string,
): Promise<LighthouseRun> {
  const args = [
    url,
    '--output=json',
    '--output-path=stdout',
    '--quiet',
    '--only-categories=performance,accessibility,best-practices,seo',
    '--throttling-method=simulate',
    '--disable-full-page-screenshot',
    '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage --disable-gpu',
  ]

  if (mode === 'desktop') args.push('--preset=desktop')

  const { stdout } = await executeLighthouse(args, chromePath)
  const scores = parseLighthouseScores(stdout, url)

  return { rawReport: stdout, scores }
}

export function median(values: readonly number[]): number {
  if (values.length === 0) throw new Error('Cannot calculate a median without values')

  const sorted = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)

  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle]
}
