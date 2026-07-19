import { vi } from 'vitest'

/** Reload routing because canonical trailing-slash policy is captured at import time. */
export async function importRouting(buildTarget?: string) {
  vi.unstubAllEnvs()
  vi.stubEnv('BUILD_TARGET', buildTarget)
  vi.resetModules()

  return import('@/i18n/routing')
}
