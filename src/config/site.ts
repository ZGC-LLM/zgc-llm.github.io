import { WORKING_GROUPS } from '@/content/working-groups'
import type {
  ExternalApplicationTarget,
  NavigationItem,
  ResolvedApplicationTarget,
} from '@/types/content'

export const SITE_NAME = '中关村自主大模型产业联盟'
export const SITE_DESCRIPTION =
  '中关村自主大模型产业联盟官方网站，汇聚自主大模型力量，共建开放、安全、协同的产业生态，发布联盟动态、重点工作与生态合作信息。'

const DEFAULT_SITE_URL = 'https://www.zgc-llm.org.cn'

export function resolveSiteUrl(configuredUrl?: string): string {
  if (!configuredUrl) return DEFAULT_SITE_URL

  try {
    const url = new URL(configuredUrl)

    return url.protocol === 'http:' || url.protocol === 'https:' ? configuredUrl : DEFAULT_SITE_URL
  } catch {
    return DEFAULT_SITE_URL
  }
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

export const SITE_NAVIGATION: readonly NavigationItem[] = [
  { href: '/alliance', label: '联盟介绍' },
  { href: '/working-groups', label: '工作组' },
  { href: '/cybersecurity', label: '网络安全生态' },
  { href: '/members', label: '成员伙伴' },
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

export const APPLICATION_TARGET: ExternalApplicationTarget = {
  href: process.env.NEXT_PUBLIC_APPLICATION_URL,
  label: '合作申请',
  unavailableMessage: '申请通道准备中，请通过官网联系方式与联盟联系。',
}

export function isSafeExternalUrl(value?: string): value is string {
  if (!value) return false

  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function resolveApplicationTarget(
  configuredUrl: string | undefined = APPLICATION_TARGET.href,
): ResolvedApplicationTarget {
  const href = isSafeExternalUrl(configuredUrl) ? configuredUrl : undefined

  return {
    ...APPLICATION_TARGET,
    href,
    isAvailable: Boolean(href),
  }
}
