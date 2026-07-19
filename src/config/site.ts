import { WORKING_GROUPS } from '@/content/working-groups'
import type { Locale } from '@/i18n/locales'
import type {
  ApplicationTargetId,
  ExternalApplicationTarget,
  NavigationItem,
  ResolvedApplicationTarget,
  WorkingGroupSummary,
} from '@/types/content'

export const SITE_NAME = '中关村自主大模型产业联盟'
export const SITE_DESCRIPTION =
  '中关村自主大模型产业联盟官网，发布联盟动态、重点工作、工作组信息与参与指引。'

/** 官方英文全称尚待权利人确认；英文公开面只使用缩写或 “the Alliance”。 */
export const SITE_NAMES: Readonly<Record<Locale, string>> = {
  en: 'ZGCLLM',
  zh: SITE_NAME,
}

export const SITE_DESCRIPTIONS: Readonly<Record<Locale, string>> = {
  en: 'Information from ZGCLLM about the Alliance, its working groups, public initiatives and ways to participate.',
  zh: SITE_DESCRIPTION,
}

export function getSiteName(locale: Locale): string {
  return SITE_NAMES[locale]
}

export function getSiteDescription(locale: Locale): string {
  return SITE_DESCRIPTIONS[locale]
}

export const CANONICAL_SITE_URL = 'https://www.zgc-llm.org.cn'

/**
 * Fail closed: canonical metadata is never allowed to follow an arbitrary
 * runtime host. The environment variable may confirm the approved root origin,
 * but cannot replace it with localhost, a defensive domain, path or query.
 */
export function resolveSiteUrl(configuredUrl?: string): string {
  const candidate = configuredUrl ?? CANONICAL_SITE_URL

  if (candidate !== candidate.trim()) return CANONICAL_SITE_URL

  try {
    const url = new URL(candidate)

    if (
      url.protocol === 'https:' &&
      url.hostname === 'www.zgc-llm.org.cn' &&
      url.username === '' &&
      url.password === '' &&
      url.port === '' &&
      url.pathname === '/' &&
      url.search === '' &&
      url.hash === ''
    ) {
      return CANONICAL_SITE_URL
    }
  } catch {
    // Invalid public configuration falls back to the fixed canonical origin.
  }

  return CANONICAL_SITE_URL
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

export const SITE_NAVIGATION: readonly NavigationItem[] = [
  { href: '/alliance', label: '联盟介绍' },
  { href: '/working-groups', label: '工作组' },
  { href: '/cybersecurity', label: '网络安全生态' },
  {
    href: '/members',
    label: '成员伙伴',
    children: [
      { href: '/members', label: '联盟成员' },
      { href: '/working-groups', label: '工作组成员' },
    ],
  },
  { href: '/news', label: '新闻动态' },
] as const

const WORKING_GROUP_SUB_ROUTES = WORKING_GROUPS.flatMap(({ slug }) => [
  `/working-groups/${slug}`,
  `/working-groups/${slug}/members`,
  `/working-groups/${slug}/join`,
])

export const PUBLIC_STATIC_ROUTES = [
  '/',
  '/alliance',
  '/working-groups',
  ...WORKING_GROUP_SUB_ROUTES,
  '/cybersecurity',
  '/members',
  '/news',
  '/join',
  '/privacy',
] as const

type ApplicationEnvironmentKey =
  | 'NEXT_PUBLIC_APPLICATION_URL'
  | 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY'
  | 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM'

interface ApplicationEndpoint {
  readonly envKey: ApplicationEnvironmentKey
  readonly id: ApplicationTargetId
  readonly label: string
  readonly path: string
  readonly read: () => string | undefined
}

const APPLICATION_ORIGIN = 'https://clouditera.feishu.cn'
const APPLICATION_UNAVAILABLE_MESSAGE = '申请通道尚未开放，请稍后查看官网更新。'

/**
 * Each public form has an independent target. Repository-known URLs are an
 * allowlist, not a readiness signal: only a matching explicit environment
 * value enables the corresponding CTA.
 */
const APPLICATION_ENDPOINTS: Readonly<Record<ApplicationTargetId, ApplicationEndpoint>> = {
  alliance: {
    envKey: 'NEXT_PUBLIC_APPLICATION_URL',
    id: 'alliance',
    label: '联盟申请',
    path: '/share/base/form/shrcnlX5daUGxOitSbOOUc1tkBb',
    read: () => process.env.NEXT_PUBLIC_APPLICATION_URL,
  },
  'cybersecurity-program': {
    envKey: 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM',
    id: 'cybersecurity-program',
    label: '网络安全人员开放计划申请',
    path: '/share/base/form/shrcnXSRHvrWPehplPdvFuB0juc',
    read: () => process.env.NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY_PROGRAM,
  },
  'cybersecurity-working-group': {
    envKey: 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY',
    id: 'cybersecurity-working-group',
    label: '网络安全工作组申请',
    path: '/share/base/form/shrcnzfEuj5Wr8mdtX9aUxnP9LB',
    read: () => process.env.NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY,
  },
}

const WORKING_GROUP_APPLICATION_TARGETS: Readonly<Partial<Record<string, ApplicationTargetId>>> = {
  NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY: 'cybersecurity-working-group',
}

export const APPLICATION_ENV_KEYS: readonly ApplicationEnvironmentKey[] = Object.values(
  APPLICATION_ENDPOINTS,
).map(({ envKey }) => envKey)
export const APPLICATION_TARGET_IDS: readonly ApplicationTargetId[] = Object.keys(
  APPLICATION_ENDPOINTS,
) as ApplicationTargetId[]

function parseSafeHttpsUrl(value?: string): URL | undefined {
  if (!value || value !== value.trim() || /[\u0000-\u001f\u007f]/u.test(value)) {
    return undefined
  }

  try {
    const url = new URL(value)

    if (
      url.protocol !== 'https:' ||
      url.username !== '' ||
      url.password !== '' ||
      url.port !== '' ||
      url.hostname === ''
    ) {
      return undefined
    }

    return url
  } catch {
    return undefined
  }
}

/** Generic external-resource policy. Application readiness uses the stricter resolver below. */
export function isSafeExternalUrl(value?: string): value is string {
  return parseSafeHttpsUrl(value) !== undefined
}

export function isKnownApplicationEnvKey(value?: string): value is ApplicationEnvironmentKey {
  return Boolean(value && APPLICATION_ENV_KEYS.includes(value as ApplicationEnvironmentKey))
}

export function isKnownApplicationTargetId(value?: string): value is ApplicationTargetId {
  return Boolean(value && APPLICATION_TARGET_IDS.includes(value as ApplicationTargetId))
}

export function isKnownWorkingGroupApplicationEnvKey(value?: string): boolean {
  return Boolean(value && Object.hasOwn(WORKING_GROUP_APPLICATION_TARGETS, value))
}

export function normalizeApplicationUrl(
  value?: string,
  targetId?: ApplicationTargetId,
): string | undefined {
  const url = parseSafeHttpsUrl(value)

  if (
    !url ||
    (targetId !== undefined && !isKnownApplicationTargetId(targetId)) ||
    url.origin !== APPLICATION_ORIGIN ||
    url.search !== '' ||
    url.hash !== ''
  ) {
    return undefined
  }

  const endpoints = targetId
    ? [APPLICATION_ENDPOINTS[targetId]]
    : Object.values(APPLICATION_ENDPOINTS)
  const match = endpoints.find(({ path }) => url.pathname === path)

  return match ? `${APPLICATION_ORIGIN}${match.path}` : undefined
}

export function isAllowedApplicationUrl(
  value?: string,
  targetId?: ApplicationTargetId,
): value is string {
  return normalizeApplicationUrl(value, targetId) !== undefined
}

function targetDefinition(id: ApplicationTargetId): ExternalApplicationTarget {
  const endpoint = APPLICATION_ENDPOINTS[id]

  return {
    href: normalizeApplicationUrl(endpoint.read(), id),
    id,
    label: endpoint.label,
    unavailableMessage: APPLICATION_UNAVAILABLE_MESSAGE,
  }
}

export const APPLICATION_TARGETS: Readonly<Record<ApplicationTargetId, ExternalApplicationTarget>> =
  {
    alliance: targetDefinition('alliance'),
    'cybersecurity-program': targetDefinition('cybersecurity-program'),
    'cybersecurity-working-group': targetDefinition('cybersecurity-working-group'),
  }

/** Backward-compatible alias used by the general Alliance join page. */
export const APPLICATION_TARGET = APPLICATION_TARGETS.alliance

function configuredApplicationUrls(): readonly string[] {
  return Object.values(APPLICATION_ENDPOINTS).flatMap((endpoint) => {
    const href = normalizeApplicationUrl(endpoint.read(), endpoint.id)

    return href ? [href] : []
  })
}

export function resolveApplicationTarget(
  configuredUrl: string | undefined = APPLICATION_TARGET.href,
): ResolvedApplicationTarget {
  const base = APPLICATION_TARGET

  if (!configuredUrl || configuredUrl.trim() === '') {
    return { ...base, href: undefined, isAvailable: false, status: 'missing' }
  }

  if (!isSafeExternalUrl(configuredUrl)) {
    return { ...base, href: undefined, isAvailable: false, status: 'invalid' }
  }

  const href = normalizeApplicationUrl(configuredUrl)

  if (!href) {
    return { ...base, href: undefined, isAvailable: false, status: 'unapproved' }
  }

  if (!configuredApplicationUrls().includes(href)) {
    return { ...base, href: undefined, isAvailable: false, status: 'unconfigured' }
  }

  const endpoint = Object.values(APPLICATION_ENDPOINTS).find(
    ({ path }) => href === `${APPLICATION_ORIGIN}${path}`,
  )
  const definition = endpoint ? APPLICATION_TARGETS[endpoint.id] : base

  return { ...definition, href, isAvailable: true, status: 'available' }
}

export function resolveConfiguredApplicationTarget(
  id: ApplicationTargetId,
): ResolvedApplicationTarget {
  if (!isKnownApplicationTargetId(id)) {
    return {
      href: undefined,
      isAvailable: false,
      label: '申请通道',
      status: 'invalid',
      unavailableMessage: APPLICATION_UNAVAILABLE_MESSAGE,
    }
  }

  const endpoint = APPLICATION_ENDPOINTS[id]
  const configured = endpoint.read()
  const base = APPLICATION_TARGETS[id]

  if (!configured || configured.trim() === '') {
    return { ...base, href: undefined, isAvailable: false, status: 'missing' }
  }

  if (!isSafeExternalUrl(configured)) {
    return { ...base, href: undefined, isAvailable: false, status: 'invalid' }
  }

  const href = normalizeApplicationUrl(configured, id)

  if (!href) {
    return { ...base, href: undefined, isAvailable: false, status: 'unapproved' }
  }

  return { ...base, href, isAvailable: true, status: 'available' }
}

export function resolveWorkingGroupApplicationTarget(
  group: Pick<WorkingGroupSummary, 'applicationEnvKey'>,
): ResolvedApplicationTarget {
  const envKey = group.applicationEnvKey
  const targetId =
    envKey && isKnownWorkingGroupApplicationEnvKey(envKey)
      ? WORKING_GROUP_APPLICATION_TARGETS[envKey]
      : undefined

  if (!targetId || !isKnownApplicationTargetId(targetId)) {
    return {
      href: undefined,
      isAvailable: false,
      label: '工作组申请',
      status: envKey ? 'unapproved' : 'missing',
      unavailableMessage: APPLICATION_UNAVAILABLE_MESSAGE,
    }
  }

  return resolveConfiguredApplicationTarget(targetId)
}

/**
 * Compatibility adapter for existing page components. The empty string is an
 * explicit unavailable sentinel, preventing JavaScript default parameters from
 * accidentally substituting the general Alliance form.
 */
export function resolveWorkingGroupApplicationUrl(
  group: Pick<WorkingGroupSummary, 'applicationEnvKey'>,
): string {
  return resolveWorkingGroupApplicationTarget(group).href ?? ''
}
