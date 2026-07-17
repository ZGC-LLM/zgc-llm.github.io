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
  '中关村自主大模型产业联盟官方网站，连接自主大模型产业力量，发布联盟动态、重点专项与生态合作信息。'

const DEFAULT_SITE_URL = 'https://www.zgcllm.org.cn'

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
  { href: '/working-groups', label: '工作组与专项' },
  { href: '/cybersecurity', label: '网络安全生态' },
  { href: '/members', label: '成员伙伴' },
  { href: '/news', label: '新闻动态' },
] as const

export const PUBLIC_STATIC_ROUTES = [
  '/',
  '/alliance',
  '/working-groups',
  '/cybersecurity',
  '/members',
  '/news',
  '/join',
  '/professionals',
  '/privacy',
] as const

export const APPLICATION_TARGETS: Readonly<Record<ApplicationKind, ExternalApplicationTarget>> = {
  institution: {
    href: process.env.NEXT_PUBLIC_INSTITUTION_APPLICATION_URL,
    internalHref: '/join',
    label: '申请生态共建',
    unavailableMessage: '申请通道准备中，请通过官网联系方式与联盟联系。',
  },
  professional: {
    href: process.env.NEXT_PUBLIC_PROFESSIONAL_APPLICATION_URL,
    internalHref: '/professionals',
    label: '专业用户加入',
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

export interface CoreModule {
  description: string
  path: string
  slug: string
  title: string
}

export const CORE_MODULES: readonly CoreModule[] = [
  {
    description: '展示联盟宗旨、发展历程、组织架构与重点方向。',
    path: '/alliance',
    slug: 'alliance',
    title: '联盟介绍',
  },
  {
    description: '提供结构化入盟申请、材料上传和进度管理。',
    path: '/alliance/join',
    slug: 'alliance-application',
    title: '加入联盟',
  },
  {
    description: '介绍工作组职责、研究方向、负责人及工作成果。',
    path: '/working-groups/[slug]',
    slug: 'working-group',
    title: '工作组介绍',
  },
  {
    description: '按照成员类型展示单位信息、品牌标识与简介。',
    path: '/working-groups/[slug]/members',
    slug: 'working-group-members',
    title: '工作组成员',
  },
  {
    description: '接收加入工作组的申请并支持后台审核流转。',
    path: '/working-groups/[slug]/join',
    slug: 'working-group-application',
    title: '加入工作组',
  },
  {
    description: '发布联盟新闻、活动通知、行业观察与成果动态。',
    path: '/news',
    slug: 'news',
    title: '新闻板块',
  },
] as const
