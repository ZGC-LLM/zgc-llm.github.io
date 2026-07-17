import type { WorkingGroupMember } from '@/types/content'

// Member units are added after public authorization is obtained.
// Placeholder with empty state before authorization.
export const WORKING_GROUP_MEMBERS: Readonly<Record<string, readonly WorkingGroupMember[]>> = {
  cybersecurity: [],
} as const

export function getWorkingGroupMembers(slug: string): readonly WorkingGroupMember[] {
  return WORKING_GROUP_MEMBERS[slug] ?? []
}
