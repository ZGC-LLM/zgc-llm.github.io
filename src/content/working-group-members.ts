import type { Locale } from '@/i18n/locales'
import type { WorkingGroupMember } from '@/types/content'

import { getWorkingGroupBySlug, localizeWorkingGroup } from './working-groups'

interface WorkingGroupMemberReference {
  id: string
  leadName: string
}

/**
 * 仅收录已在对应工作组权威文案中公开具名、承担明确角色的单位。
 * 普通背景提及和「生态共建伙伴」等泛称不进入名录；新增单位前须确认公开授权。
 * 名录顺序即此处顺序，角色、简介和双语名称复用 working-groups.ts，避免重复维护。
 */
const WORKING_GROUP_MEMBER_REFERENCES: Readonly<
  Record<string, readonly WorkingGroupMemberReference[]>
> = {
  cybersecurity: [
    { id: 'zgc-llm-alliance', leadName: '中关村自主大模型产业联盟' },
    { id: 'zhipu', leadName: '智谱' },
    { id: 'tsinghua-university', leadName: '清华大学' },
    { id: 'datainsecurity', leadName: '数说安全' },
    { id: 'cloudinfinite', leadName: '云起无垠' },
  ],
} as const

function resolveWorkingGroupMembers(slug: string, locale: Locale): readonly WorkingGroupMember[] {
  const group = getWorkingGroupBySlug(slug)
  const references = WORKING_GROUP_MEMBER_REFERENCES[slug]

  if (!group || !references) return []

  const localizedGroup = localizeWorkingGroup(group, locale)

  return references.map(({ id, leadName }) => {
    const leadIndex = group.leads.findIndex((lead) => lead.named && lead.name === leadName)
    const lead = localizedGroup.leads[leadIndex]

    if (leadIndex === -1 || !lead?.named) {
      throw new Error(`Working-group member reference does not match a named lead: ${slug}/${leadName}`)
    }

    return {
      description: lead.description,
      id,
      name: lead.name,
      role: lead.role,
    }
  })
}

export const WORKING_GROUP_MEMBERS: Readonly<Record<string, readonly WorkingGroupMember[]>> =
  Object.fromEntries(
    Object.keys(WORKING_GROUP_MEMBER_REFERENCES).map((slug) => [
      slug,
      resolveWorkingGroupMembers(slug, 'zh'),
    ]),
  )

export function getWorkingGroupMembers(
  slug: string,
  locale: Locale = 'zh',
): readonly WorkingGroupMember[] {
  if (locale === 'zh') return WORKING_GROUP_MEMBERS[slug] ?? []

  return resolveWorkingGroupMembers(slug, locale)
}
