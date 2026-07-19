import { vi } from 'vitest'

export const APPLICATION_ENV = {
  alliance: 'NEXT_PUBLIC_APPLICATION_URL',
  program: 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM',
  workingGroup: 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY',
} as const

export const APPROVED_APPLICATION_URL = {
  alliance: 'https://clouditera.feishu.cn/share/base/form/shrcnlX5daUGxOitSbOOUc1tkBb',
  program: 'https://clouditera.feishu.cn/share/base/form/shrcnXSRHvrWPehplPdvFuB0juc',
  workingGroup:
    'https://clouditera.feishu.cn/share/base/form/shrcnzfEuj5Wr8mdtX9aUxnP9LB',
} as const

type SiteEnvironment = Partial<
  Record<
    | 'NEXT_PUBLIC_APPLICATION_URL'
    | 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY'
    | 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM'
    | 'NEXT_PUBLIC_SITE_URL',
    string | undefined
  >
>

const ENV_KEYS = [
  'NEXT_PUBLIC_APPLICATION_URL',
  'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY',
  'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM',
  'NEXT_PUBLIC_SITE_URL',
] as const

/** Import the module after creating an explicit, isolated public environment. */
export async function importSiteConfig(environment: SiteEnvironment = {}) {
  vi.unstubAllEnvs()
  for (const key of ENV_KEYS) vi.stubEnv(key, undefined)
  for (const [key, value] of Object.entries(environment)) vi.stubEnv(key, value)
  vi.resetModules()

  return import('@/config/site')
}
