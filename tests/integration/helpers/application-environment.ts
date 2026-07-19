import { vi } from 'vitest'

export const APPLICATION_ENVIRONMENTS = {
  alliance: {
    key: 'NEXT_PUBLIC_APPLICATION_URL',
    url: 'https://clouditera.feishu.cn/share/base/form/shrcnlX5daUGxOitSbOOUc1tkBb',
  },
  program: {
    key: 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM',
    url: 'https://clouditera.feishu.cn/share/base/form/shrcnXSRHvrWPehplPdvFuB0juc',
  },
  workingGroup: {
    key: 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY',
    url: 'https://clouditera.feishu.cn/share/base/form/shrcnzfEuj5Wr8mdtX9aUxnP9LB',
  },
} as const

const ALL_KEYS = Object.values(APPLICATION_ENVIRONMENTS).map(({ key }) => key)

export function isolateApplicationEnvironment(
  enabled?: (typeof APPLICATION_ENVIRONMENTS)[keyof typeof APPLICATION_ENVIRONMENTS],
): void {
  vi.unstubAllEnvs()
  for (const key of ALL_KEYS) vi.stubEnv(key, undefined)
  if (enabled) vi.stubEnv(enabled.key, enabled.url)
  vi.resetModules()
}
