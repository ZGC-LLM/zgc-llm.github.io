import { defineConfig, devices } from '@playwright/test'

import { resolveE2EBaseURL, resolveE2EPort } from './tests/helpers/e2eConfig'

const remoteBaseURL = resolveE2EBaseURL(process.env.E2E_BASE_URL)
const e2ePort = resolveE2EPort(remoteBaseURL ? undefined : process.env.E2E_PORT)
const localBaseURL = `http://127.0.0.1:${e2ePort}`
const e2eBaseURL = remoteBaseURL ?? localBaseURL

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  testDir: './tests/e2e',
  forbidOnly: true,
  outputDir: 'test-results/playwright',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  retries: 0,
  timeout: 45_000,
  use: {
    baseURL: e2eBaseURL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  workers: 1,
  projects: [
    {
      name: 'chromium',
      testMatch: '**/*.fast.e2e.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'release-chromium',
      testMatch: '**/journeys.release.e2e.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'release-firefox',
      testMatch: '**/journeys.release.e2e.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'release-webkit',
      testMatch: '**/journeys.release.e2e.spec.ts',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'release-mobile-chromium',
      testMatch: '**/responsive.release.e2e.spec.ts',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'release-mobile-webkit',
      testMatch: '**/responsive.release.e2e.spec.ts',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'release-quality',
      testMatch: /(?:keyboard|quality)\.release\.e2e\.spec\.ts/u,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'release-lighthouse',
      testMatch: '**/lighthouse.release.e2e.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: remoteBaseURL
    ? undefined
    : {
        command: `pnpm build:export && node --no-deprecation --import=tsx/esm tests/helpers/staticExportServer.ts`,
        env: {
          E2E_PORT: String(e2ePort),
          NEXT_PUBLIC_APPLICATION_URL: '',
          NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY: '',
          NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM: '',
          NEXT_PUBLIC_SITE_URL: 'https://www.zgc-llm.org.cn',
          NODE_OPTIONS: '--no-deprecation',
        },
        reuseExistingServer: false,
        timeout: 180_000,
        url: localBaseURL,
      },
})
