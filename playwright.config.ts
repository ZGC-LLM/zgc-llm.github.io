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
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: e2eBaseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: remoteBaseURL
    ? undefined
    : {
        // 直接调用 next 二进制，绕过 `pnpm dev`。CI(setup-pnpm)下经 pnpm 启动子进程时，
        // pnpm 会因 package.json `type: module` 去加载不存在的 .pnpmfile.mjs 而崩溃
        // （Error during pnpmfile execution），导致 webServer 无法启动。直连二进制规避该问题。
        command: `node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port ${e2ePort}`,
        env: { NODE_OPTIONS: '--no-deprecation' },
        reuseExistingServer: false,
        timeout: 120_000,
        url: localBaseURL,
      },
})
