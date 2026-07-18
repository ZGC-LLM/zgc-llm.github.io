import { WORKING_GROUPS } from '@/content/working-groups'
import type {
  ExternalApplicationTarget,
  NavigationItem,
  ResolvedApplicationTarget,
  WorkingGroupSummary,
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
  {
    // 分组节点：href 为父级落点（点击可跳转 /members），children 为二级子项。
    // 标签本地化由 site-header 按显式 dict 键解析（见 NAV_GROUP_* 映射）。
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

// 加入申请飞书问卷（公开分享链接，外部匿名可填）。这些链接部署后本就出现在公开页面 HTML 中，
// 非机密；作为默认值提交以便开箱即用，生产/预览可通过对应 NEXT_PUBLIC_* 环境变量覆盖。
const DEFAULT_APPLICATION_URL =
  'https://clouditera.feishu.cn/share/base/form/shrcnlX5daUGxOitSbOOUc1tkBb'
const DEFAULT_APPLICATION_URL_CYBERSECURITY =
  'https://clouditera.feishu.cn/share/base/form/shrcnzfEuj5Wr8mdtX9aUxnP9LB'

// 各工作组专属申请问卷的内置默认链接（env key → 默认 URL）。缺省环境变量（含 CI 注入空串）时用此默认值。
const WORKING_GROUP_APPLICATION_URL_DEFAULTS: Record<string, string> = {
  NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY: DEFAULT_APPLICATION_URL_CYBERSECURITY,
}

const configuredApplicationUrl = process.env.NEXT_PUBLIC_APPLICATION_URL

export const APPLICATION_TARGET: ExternalApplicationTarget = {
  // 环境变量为合法 https 时优先使用；未设置或为空串（未配置的 GitHub Variable）时回退内置默认链接。
  href: isSafeExternalUrl(configuredApplicationUrl) ? configuredApplicationUrl : DEFAULT_APPLICATION_URL,
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

/**
 * 解析某工作组加入 CTA 应使用的外部问卷 URL。
 * 优先级：专属环境变量（https）→ 该工作组内置默认链接 → 通用申请入口 APPLICATION_TARGET.href。
 * 内置默认保证未配置环境变量时仍开箱即用；仍由 ExternalApplicationLink 内部做一次 https 校验兜底。
 *
 * 仅在 Server Component 构建期调用；依赖 process.env 的动态 key 访问（构建期 Node 可用）。
 */
export function resolveWorkingGroupApplicationUrl(
  group: Pick<WorkingGroupSummary, 'applicationEnvKey'>,
): string {
  const key = group.applicationEnvKey
  const specific = key ? process.env[key] : undefined
  if (isSafeExternalUrl(specific)) return specific

  const dedicatedDefault = key ? WORKING_GROUP_APPLICATION_URL_DEFAULTS[key] : undefined
  return dedicatedDefault ?? APPLICATION_TARGET.href ?? DEFAULT_APPLICATION_URL
}
