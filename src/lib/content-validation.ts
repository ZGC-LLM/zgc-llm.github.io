import {
  isAllowedApplicationUrl,
  isKnownApplicationTargetId,
  isKnownWorkingGroupApplicationEnvKey,
  isSafeExternalUrl,
  resolveApplicationTarget,
} from '@/config/site'
import { MEMBERS } from '@/content/members'
import { NEWS_ENTRIES } from '@/content/news'
import { WORKING_GROUP_MEMBERS } from '@/content/working-group-members'
import { WORKING_GROUPS } from '@/content/working-groups'
import type {
  FactAwareContent,
  FactReference,
  MemberSummary,
  NewsEntry,
  WorkingGroupMember,
  WorkingGroupSummary,
} from '@/types/content'

/**
 * Central release-content validation. Errors fail the release gate; warnings
 * are enumerated migration/readiness work and must be driven to zero before
 * T-012 can claim release readiness.
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
const WORKING_GROUP_KINDS: readonly WorkingGroupSummary['kind'][] = ['initiative', 'working-group']
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const KEBAB_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const FACT_ID_RE = /^FACT-\d{3,}$/
const FACT_EVIDENCE_STATUSES: readonly FactReference['evidenceStatus'][] = [
  'conflict',
  'editorial',
  'partial',
  'project-decision',
  'public-source',
  'unverified',
]
const FACT_PUBLICATION_DECISIONS: readonly FactReference['publication'][] = [
  'block',
  'neutralize',
  'publish',
]
const FACT_AUTHORIZATION_SCOPES: readonly FactReference['authorizedScopes'][number][] = [
  'commitment',
  'display-name',
  'logo',
  'official-english-name',
  'result',
  'role',
]

function isBlank(value?: string): boolean {
  return value === undefined || value.trim() === ''
}

export function isIsoCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

function looksLikeApplicationForm(value: string): boolean {
  if (!isSafeExternalUrl(value)) return false

  const url = new URL(value)

  return url.hostname.endsWith('feishu.cn') && url.pathname.includes('/share/base/form/')
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

  const validateIdentifier = (value: string, where: string, label: string): void => {
    if (!isBlank(value) && !KEBAB_RE.test(value)) {
      add('error', 'identifier', where, `${label} 须为 lowercase kebab-case: ${value}`)
    }
  }

  const validateFacts = (
    content: FactAwareContent,
    where: string,
    requiresEvidence: boolean,
  ): void => {
    const warnUnreviewed = (): void => {
      if (requiresEvidence) {
        add('warning', 'fact-unreviewed', where, '尚无通过校验且获准发布的事实记录')
      }
    }

    if (!content.facts) {
      warnUnreviewed()
      return
    }
    if (!Array.isArray(content.facts)) {
      add('error', 'fact-type', where, 'facts 必须为数组')
      warnUnreviewed()
      return
    }
    if (content.facts.length === 0) {
      warnUnreviewed()
      return
    }

    const factIdCounts = new Map<unknown, number>()
    content.facts.forEach((fact) => {
      if (typeof fact === 'object' && fact !== null && !Array.isArray(fact)) {
        factIdCounts.set(fact.factId, (factIdCounts.get(fact.factId) ?? 0) + 1)
      }
    })

    const seenFactIds = new Set<unknown>()
    let hasValidPublishedFact = false

    content.facts.forEach((fact, index) => {
      const factWhere = `${where}.facts[${index}]`
      if (typeof fact !== 'object' || fact === null || Array.isArray(fact)) {
        add('error', 'fact-type', factWhere, 'fact 必须为非空对象')
        return
      }

      const localIssueStart = issues.length
      validateFactReference(fact, factWhere, add)

      const isDuplicate = (factIdCounts.get(fact.factId) ?? 0) > 1
      if (seenFactIds.has(fact.factId)) {
        add('error', 'fact-unique', factWhere, `同一内容记录内 factId 重复: ${String(fact.factId)}`)
      }
      seenFactIds.add(fact.factId)

      const hasLocalError = issues
        .slice(localIssueStart)
        .some((issue) => issue.severity === 'error')
      if (fact.publication === 'publish' && !isDuplicate && !hasLocalError) {
        hasValidPublishedFact = true
      }
    })

    if (!hasValidPublishedFact) warnUnreviewed()
  }

  // ---- Members ----
  const memberIds = new Set<string>()
  const memberNames = new Set<string>()
  bundle.members.forEach((member, index) => {
    const where = `members[${index}]${member.id ? ` #${member.id}` : ''}`
    if (isBlank(member.id)) add('error', 'required', where, 'member id 必填')
    if (isBlank(member.name)) add('error', 'required', where, 'member name 必填')
    validateIdentifier(member.id, where, 'member id')
    if (!MEMBER_TYPES.includes(member.type)) {
      add('error', 'enum', where, `member type 非法: ${member.type}`)
    }
    if (member.id) {
      if (memberIds.has(member.id)) add('error', 'unique', where, `member id 重复: ${member.id}`)
      memberIds.add(member.id)
    }
    if (member.name) {
      if (memberNames.has(member.name)) {
        add('error', 'unique', where, `member name 重复: ${member.name}`)
      }
      memberNames.add(member.name)
    }
    if (member.logo !== undefined && !isSafeExternalUrl(member.logo)) {
      add('error', 'https', where, `member logo 须为安全 https URL: ${member.logo}`)
    }
    validateFacts(member, where, !isBlank(member.name))
  })

  // ---- News ----
  const newsSlugs = new Set<string>()
  bundle.news.forEach((entry, index) => {
    const where = `news[${index}]${entry.slug ? ` #${entry.slug}` : ''}`
    for (const field of ['slug', 'title', 'description'] as const) {
      if (isBlank(entry[field])) add('error', 'required', where, `news ${field} 必填`)
    }
    validateIdentifier(entry.slug, where, 'news slug')
    if (!isIsoCalendarDate(entry.date)) {
      add('error', 'date', where, `news date 须为真实的 YYYY-MM-DD 日历日期: ${entry.date}`)
    }
    if (!NEWS_CATEGORIES.includes(entry.category)) {
      add('error', 'enum', where, `news category 非法: ${entry.category}`)
    }
    if (typeof entry.published !== 'boolean') {
      add('error', 'type', where, 'news published 须为 boolean')
    }
    if (entry.body.length === 0) add('error', 'required', where, 'news body 不能为空')
    entry.body.forEach((block, blockIndex) => {
      const blockWhere = `${where}.body[${blockIndex}]`
      if (typeof block !== 'object' || block === null || Array.isArray(block)) {
        add('error', 'block-type', blockWhere, 'content block 必须为非空对象')
        return
      }

      switch (block.type) {
        case 'list':
          if (
            !Array.isArray(block.items) ||
            block.items.length === 0 ||
            block.items.some((item) => typeof item !== 'string' || isBlank(item))
          ) {
            add('error', 'empty-block', blockWhere, 'list block 至少包含一个非空条目')
          }
          break
        case 'heading':
        case 'paragraph':
          if (typeof block.text !== 'string' || isBlank(block.text)) {
            add('error', 'empty-block', blockWhere, `${block.type} block 文本不能为空`)
          }
          break
        default:
          add(
            'error',
            'block-type',
            blockWhere,
            `未知 content block type: ${String((block as { type?: unknown }).type)}`,
          )
      }
    })
    if (entry.slug) {
      if (newsSlugs.has(entry.slug)) {
        add('error', 'unique', where, `news slug 重复: ${entry.slug}`)
      }
      newsSlugs.add(entry.slug)
    }
    const hasHref = !isBlank(entry.ctaHref)
    const hasApplicationTarget = entry.applicationTargetId !== undefined
    const hasLabel = !isBlank(entry.ctaLabel)
    if (hasHref && hasApplicationTarget) {
      add('error', 'cta', where, 'ctaHref 与 applicationTargetId 互斥')
    }
    if ((hasHref || hasApplicationTarget) !== hasLabel) {
      add('error', 'cta', where, '行动目标与 ctaLabel 必须成对出现')
    }
    if (hasApplicationTarget && !isKnownApplicationTargetId(entry.applicationTargetId)) {
      add(
        'error',
        'application-target',
        where,
        `applicationTargetId 未注册: ${String(entry.applicationTargetId)}`,
      )
    }
    if (hasHref && entry.ctaHref) {
      if (!isSafeExternalUrl(entry.ctaHref)) {
        add('error', 'https', where, `news ctaHref 须为安全 https URL: ${entry.ctaHref}`)
      } else if (looksLikeApplicationForm(entry.ctaHref)) {
        if (!isAllowedApplicationUrl(entry.ctaHref)) {
          add('error', 'application-url', where, 'Feishu CTA 不在精确批准的 host/path allowlist')
        } else if (!resolveApplicationTarget(entry.ctaHref).isAvailable) {
          add(
            'warning',
            'application-unconfigured',
            where,
            '表单 URL 已登记但尚未由对应显式环境变量启用',
          )
        }
        add(
          'warning',
          'application-target-migration',
          where,
          '申请表 CTA 应迁移为 applicationTargetId，并通过 target-specific readiness 解析',
        )
      }
    }
    validateFacts(entry, where, entry.published === true)
  })

  // ---- Working groups ----
  const workingGroupIds = new Set<string>()
  const workingGroupSlugs = new Set<string>()
  bundle.workingGroups.forEach((group, index) => {
    const where = `working-groups[${index}]${group.slug ? ` #${group.slug}` : ''}`
    for (const field of ['id', 'slug', 'title', 'description'] as const) {
      if (isBlank(group[field])) add('error', 'required', where, `working-group ${field} 必填`)
    }
    validateIdentifier(group.id, where, 'working-group id')
    validateIdentifier(group.slug, where, 'working-group slug')
    if (!WORKING_GROUP_KINDS.includes(group.kind)) {
      add('error', 'enum', where, `working-group kind 非法: ${String(group.kind)}`)
    }
    if (group.id) {
      if (workingGroupIds.has(group.id)) {
        add('error', 'unique', where, `working-group id 重复: ${group.id}`)
      }
      workingGroupIds.add(group.id)
    }
    if (group.slug) {
      if (workingGroupSlugs.has(group.slug)) {
        add('error', 'unique', where, `working-group slug 重复: ${group.slug}`)
      }
      workingGroupSlugs.add(group.slug)
    }
    if (
      group.applicationEnvKey !== undefined &&
      !isKnownWorkingGroupApplicationEnvKey(group.applicationEnvKey)
    ) {
      add(
        'error',
        'application-env',
        where,
        `未登记的 working-group applicationEnvKey: ${group.applicationEnvKey}`,
      )
    }
    if (group.leads.length === 0) add('warning', 'empty', where, 'working-group leads 为空')
    const leadNames = new Set<string>()
    group.leads.forEach((lead, leadIndex) => {
      const leadWhere = `${where}.leads[${leadIndex}]`
      if (isBlank(lead.name)) add('error', 'required', leadWhere, 'lead name 必填')
      if (isBlank(lead.role)) add('error', 'required', leadWhere, 'lead role 必填')
      if (typeof lead.named !== 'boolean') {
        add('error', 'type', leadWhere, 'lead named 须为 boolean')
      }
      if (lead.name && leadNames.has(lead.name)) {
        add('error', 'unique', leadWhere, `lead name 重复: ${lead.name}`)
      }
      leadNames.add(lead.name)
      validateFacts(lead, leadWhere, lead.named === true)
    })
    if (group.responsibilities.length === 0) add('warning', 'empty', where, 'responsibilities 为空')
    if (group.researchDirections.length === 0)
      add('warning', 'empty', where, 'researchDirections 为空')
    if (group.responsibilities.some((item) => isBlank(item))) {
      add('error', 'empty-block', where, 'responsibilities 不得包含空项')
    }
    if (group.researchDirections.some((item) => isBlank(item))) {
      add('error', 'empty-block', where, 'researchDirections 不得包含空项')
    }
    validateFacts(group, where, true)
  })

  // ---- Working-group members (IDs are globally unique; empty lists are valid) ----
  const workingGroupMemberIds = new Set<string>()
  for (const [slug, list] of Object.entries(bundle.workingGroupMembers)) {
    if (!bundle.workingGroups.some((group) => group.slug === slug)) {
      add('error', 'ref', `working-group-members.${slug}`, `未匹配到工作组: ${slug}`)
    }
    const names = new Set<string>()
    list.forEach((member, index) => {
      const where = `working-group-members.${slug}[${index}]${member.id ? ` #${member.id}` : ''}`
      if (isBlank(member.id)) add('error', 'required', where, 'working-group-member id 必填')
      if (isBlank(member.name)) add('error', 'required', where, 'working-group-member name 必填')
      validateIdentifier(member.id, where, 'working-group-member id')
      if (member.id) {
        if (workingGroupMemberIds.has(member.id)) {
          add('error', 'unique', where, `working-group-member id 重复: ${member.id}`)
        }
        workingGroupMemberIds.add(member.id)
      }
      if (member.name && names.has(member.name)) {
        add('error', 'unique', where, `working-group-member name 重复: ${member.name}`)
      }
      names.add(member.name)
      if (member.logo !== undefined && !isSafeExternalUrl(member.logo)) {
        add('error', 'https', where, `working-group-member logo 须为安全 https URL: ${member.logo}`)
      }
      validateFacts(member, where, !isBlank(member.name))
    })
  }

  return issues
}

type AddIssue = (
  severity: ValidationIssue['severity'],
  code: string,
  where: string,
  message: string,
) => void

function validateFactReference(fact: FactReference, where: string, add: AddIssue): void {
  if (typeof fact.factId !== 'string' || !FACT_ID_RE.test(fact.factId)) {
    add('error', 'fact-id', where, `factId 须匹配 FACT-NNN: ${String(fact.factId)}`)
  }
  if (!isIsoCalendarDate(fact.reviewedAt)) {
    add('error', 'fact-date', where, `reviewedAt 须为真实日历日期: ${fact.reviewedAt}`)
  }
  if (!FACT_EVIDENCE_STATUSES.includes(fact.evidenceStatus)) {
    add('error', 'fact-enum', where, `evidenceStatus 非法: ${String(fact.evidenceStatus)}`)
  }
  if (!FACT_PUBLICATION_DECISIONS.includes(fact.publication)) {
    add('error', 'fact-enum', where, `publication 非法: ${String(fact.publication)}`)
  }

  const authorizedScopes = Array.isArray(fact.authorizedScopes) ? fact.authorizedScopes : []
  if (!Array.isArray(fact.authorizedScopes)) {
    add('error', 'fact-scope', where, 'authorizedScopes 必须为数组')
  } else if (fact.publication === 'publish' && authorizedScopes.length === 0) {
    add('error', 'fact-scope', where, 'publish 事实的 authorizedScopes 不能为空')
  }
  const invalidScopes = authorizedScopes.filter(
    (scope) => !FACT_AUTHORIZATION_SCOPES.includes(scope),
  )
  if (invalidScopes.length > 0) {
    add(
      'error',
      'fact-scope',
      where,
      `authorizedScopes 含非法值: ${invalidScopes.map(String).join(', ')}`,
    )
  }
  if (new Set(authorizedScopes).size !== authorizedScopes.length) {
    add('error', 'fact-scope', where, 'authorizedScopes 不得重复')
  }
  if (
    (fact.evidenceStatus === 'conflict' || fact.evidenceStatus === 'unverified') &&
    fact.publication === 'publish'
  ) {
    add('error', 'fact-publication', where, '冲突或未核实事实不得标记 publish')
  }
  if (
    authorizedScopes.includes('official-english-name') &&
    !['project-decision', 'public-source'].includes(fact.evidenceStatus)
  ) {
    add('error', 'fact-scope', where, '官方英文名范围必须由公开来源或项目权威决定支持')
  }
  if (
    fact.publication === 'publish' &&
    (typeof fact.reviewer !== 'string' || isBlank(fact.reviewer))
  ) {
    add('error', 'fact-reviewer', where, 'publish 事实必须登记 reviewer')
  }

  const sourceRequired =
    fact.publication === 'publish' && ['partial', 'public-source'].includes(fact.evidenceStatus)
  if (sourceRequired && !fact.source) {
    add('error', 'fact-source', where, '该 evidenceStatus 的 publish 决策必须登记 source')
  }
  if (!fact.source) return
  if (typeof fact.source !== 'object' || Array.isArray(fact.source)) {
    add('error', 'fact-type', where, 'source 必须为非空对象')
    return
  }

  if (typeof fact.source.title !== 'string' || isBlank(fact.source.title)) {
    add('error', 'fact-source', where, 'source title 必填')
  }
  if (typeof fact.source.url !== 'string' || !isSafeExternalUrl(fact.source.url)) {
    add('error', 'fact-source', where, `source URL 须为安全 https: ${String(fact.source.url)}`)
  }
  if (typeof fact.source.reviewedAt !== 'string' || !isIsoCalendarDate(fact.source.reviewedAt)) {
    add('error', 'fact-date', where, `source reviewedAt 非法: ${String(fact.source.reviewedAt)}`)
  }
  if (
    fact.source.publishedAt !== undefined &&
    (typeof fact.source.publishedAt !== 'string' || !isIsoCalendarDate(fact.source.publishedAt))
  ) {
    add('error', 'fact-date', where, `source publishedAt 非法: ${String(fact.source.publishedAt)}`)
  }
}

/** Validate the repository's current typed content sources. */
export function validateAllContent(): ValidationIssue[] {
  return validateContent({
    members: MEMBERS,
    news: NEWS_ENTRIES,
    workingGroupMembers: WORKING_GROUP_MEMBERS,
    workingGroups: WORKING_GROUPS,
  })
}

/** Error-only release-gate view. */
export function contentErrors(): ValidationIssue[] {
  return validateAllContent().filter((issue) => issue.severity === 'error')
}
