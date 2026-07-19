import { isSafeExternalUrl } from '@/config/site'
import { MEMBERS } from '@/content/members'
import { NEWS_ENTRIES } from '@/content/news'
import { WORKING_GROUP_MEMBERS } from '@/content/working-group-members'
import { WORKING_GROUPS } from '@/content/working-groups'
import type {
  MemberSummary,
  NewsEntry,
  WorkingGroupMember,
  WorkingGroupSummary,
} from '@/types/content'

/**
 * 内容录入校验（R2.1）：集中式规则，供单测在 `pnpm test` 阶段暴露错误录入。
 * `error` 级问题使发布闸门失败；`warning` 仅提示（如空态、未匹配引用），不判失败。
 */
export interface ValidationIssue {
  severity: 'error' | 'warning'
  code: string
  where: string
  message: string
}

export interface ContentBundle {
  members: readonly MemberSummary[]
  news: readonly NewsEntry[]
  workingGroups: readonly WorkingGroupSummary[]
  workingGroupMembers: Readonly<Record<string, readonly WorkingGroupMember[]>>
}

const MEMBER_TYPES: readonly MemberSummary['type'][] = [
  'founding',
  'institution',
  'research',
  'ecosystem',
]
const NEWS_CATEGORIES: readonly NewsEntry['category'][] = ['news', 'event', 'insight', 'result']
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function isBlank(value?: string): boolean {
  return value === undefined || value.trim() === ''
}

export function validateContent(bundle: ContentBundle): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const add = (
    severity: ValidationIssue['severity'],
    code: string,
    where: string,
    message: string,
  ): void => {
    issues.push({ code, message, severity, where })
  }

  // ---- 成员 ----
  const memberIds = new Set<string>()
  bundle.members.forEach((m, i) => {
    const where = `members[${i}]${m.id ? ` #${m.id}` : ''}`
    if (isBlank(m.id)) add('error', 'required', where, 'member id 必填')
    if (isBlank(m.name)) add('error', 'required', where, 'member name 必填')
    if (!MEMBER_TYPES.includes(m.type)) add('error', 'enum', where, `member type 非法: ${m.type}`)
    if (m.id) {
      if (memberIds.has(m.id)) add('error', 'unique', where, `member id 重复: ${m.id}`)
      memberIds.add(m.id)
    }
    if (m.logo !== undefined && !isSafeExternalUrl(m.logo)) {
      add('error', 'https', where, `member logo 须为 https: ${m.logo}`)
    }
  })

  // ---- 新闻 ----
  const newsSlugs = new Set<string>()
  bundle.news.forEach((n, i) => {
    const where = `news[${i}]${n.slug ? ` #${n.slug}` : ''}`
    for (const field of ['slug', 'title', 'description'] as const) {
      if (isBlank(n[field])) add('error', 'required', where, `news ${field} 必填`)
    }
    if (!DATE_RE.test(n.date)) add('error', 'date', where, `news date 须为 YYYY-MM-DD: ${n.date}`)
    if (!NEWS_CATEGORIES.includes(n.category)) {
      add('error', 'enum', where, `news category 非法: ${n.category}`)
    }
    if (n.body.length === 0) add('error', 'required', where, 'news body 不能为空')
    if (n.slug) {
      if (newsSlugs.has(n.slug)) add('error', 'unique', where, `news slug 重复: ${n.slug}`)
      newsSlugs.add(n.slug)
    }
    const hasHref = !isBlank(n.ctaHref)
    const hasLabel = !isBlank(n.ctaLabel)
    if (hasHref !== hasLabel) {
      add('error', 'cta', where, 'ctaHref 与 ctaLabel 必须成对出现')
    }
    if (hasHref && !isSafeExternalUrl(n.ctaHref)) {
      add('error', 'https', where, `news ctaHref 须为 https: ${n.ctaHref ?? ''}`)
    }
  })

  // ---- 工作组 ----
  const wgSlugs = new Set<string>()
  bundle.workingGroups.forEach((g, i) => {
    const where = `working-groups[${i}]${g.slug ? ` #${g.slug}` : ''}`
    for (const field of ['id', 'slug', 'title', 'description'] as const) {
      if (isBlank(g[field])) add('error', 'required', where, `working-group ${field} 必填`)
    }
    if (g.slug) {
      if (wgSlugs.has(g.slug)) add('error', 'unique', where, `working-group slug 重复: ${g.slug}`)
      wgSlugs.add(g.slug)
    }
    if (g.leads.length === 0) add('warning', 'empty', where, 'working-group leads 为空')
    g.leads.forEach((lead, j) => {
      const leadWhere = `${where}.leads[${j}]`
      if (isBlank(lead.name)) add('error', 'required', leadWhere, 'lead name 必填')
      if (isBlank(lead.role)) add('error', 'required', leadWhere, 'lead role 必填')
      if (typeof lead.named !== 'boolean') add('error', 'type', leadWhere, 'lead named 须为 boolean')
    })
    if (g.responsibilities.length === 0) add('warning', 'empty', where, 'responsibilities 为空')
    if (g.researchDirections.length === 0) add('warning', 'empty', where, 'researchDirections 为空')
  })

  // ---- 工作组成员（id 跨组全局唯一；空态允许）----
  const wgMemberIds = new Set<string>()
  for (const [slug, list] of Object.entries(bundle.workingGroupMembers)) {
    if (!bundle.workingGroups.some((g) => g.slug === slug)) {
      add('warning', 'ref', `working-group-members.${slug}`, `未匹配到工作组: ${slug}`)
    }
    list.forEach((m, i) => {
      const where = `working-group-members.${slug}[${i}]${m.id ? ` #${m.id}` : ''}`
      if (isBlank(m.id)) add('error', 'required', where, 'working-group-member id 必填')
      if (isBlank(m.name)) add('error', 'required', where, 'working-group-member name 必填')
      if (m.id) {
        if (wgMemberIds.has(m.id)) add('error', 'unique', where, `working-group-member id 重复: ${m.id}`)
        wgMemberIds.add(m.id)
      }
      if (m.logo !== undefined && !isSafeExternalUrl(m.logo)) {
        add('error', 'https', where, `working-group-member logo 须为 https: ${m.logo}`)
      }
    })
  }

  return issues
}

/** 校验仓库内真实内容。 */
export function validateAllContent(): ValidationIssue[] {
  return validateContent({
    members: MEMBERS,
    news: NEWS_ENTRIES,
    workingGroupMembers: WORKING_GROUP_MEMBERS,
    workingGroups: WORKING_GROUPS,
  })
}

/** 仅 error 级问题（用于发布闸门断言）。 */
export function contentErrors(): ValidationIssue[] {
  return validateAllContent().filter((issue) => issue.severity === 'error')
}
