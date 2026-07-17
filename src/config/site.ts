import { WORKING_GROUPS } from '@/content/working-groups'
import type {
  ApplicationKind,
  ExternalApplicationTarget,
  NavigationItem,
  ResolvedApplicationTarget,
} from '@/types/content'

// 主题持久化 key。内联在 layout.tsx 的无闪烁脚本因无法 import，
// 以同值字符串字面量 'zgcllm-theme' 重复一次，务必与此常量保持一致。
export const THEME_STORAGE_KEY = 'zgcllm-theme'

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

export const APPLICATION_TARGETS: Readonly<Record<ApplicationKind, ExternalApplicationTarget>> = {
  institution: {
    href: process.env.NEXT_PUBLIC_INSTITUTION_APPLICATION_URL,
    internalHref: '/join',
    label: '机构合作申请',
    unavailableMessage: '申请通道准备中，请通过官网联系方式与联盟联系。',
  },
  professional: {
    href: process.env.NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL,
    internalHref: '/working-groups/cybersecurity/join',
    label: '专业用户申请',
    unavailableMessage: '申请通道准备中，请通过官网联系方式与联盟联系。',
  },
} as const

export function isSafeExternalUrl(value?: string): value is string {
  if (!value) return false

  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function resolveApplicationTarget(
  kind: ApplicationKind,
  configuredUrl: string | undefined = APPLICATION_TARGETS[kind].href,
): ResolvedApplicationTarget {
  const target = APPLICATION_TARGETS[kind]
  const href = isSafeExternalUrl(configuredUrl) ? configuredUrl : undefined

  return {
    ...target,
    href,
    isAvailable: Boolean(href),
  }
}
