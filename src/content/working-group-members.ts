import type { Locale } from '@/i18n/locales'
import type { WorkingGroupMember } from '@/types/content'

/**
 * Working-group participation is independent from Alliance membership.
 * Keep each list explicit and empty until the participant, role and public-use
 * authorization have all been confirmed and recorded in `facts`.
 */
export const WORKING_GROUP_MEMBERS: Readonly<Record<string, readonly WorkingGroupMember[]>> = {
  cybersecurity: [],
}

export function getWorkingGroupMembers(
  slug: string,
  locale: Locale = 'zh',
): readonly WorkingGroupMember[] {
  void locale
  return WORKING_GROUP_MEMBERS[slug] ?? []
}
