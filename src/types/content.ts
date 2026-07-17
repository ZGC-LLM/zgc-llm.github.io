export interface NavigationItem {
  href: string
  label: string
}

export type ApplicationKind = 'institution' | 'professional'

export interface ExternalApplicationTarget {
  href?: string
  internalHref: string
  label: string
  unavailableMessage: string
}

export interface ResolvedApplicationTarget extends ExternalApplicationTarget {
  isAvailable: boolean
}

export interface WorkingGroupSummary {
  description: string
  href: string
  id: string
  kind: 'working-group' | 'initiative'
  title: string
}

export interface MemberSummary {
  description?: string
  id: string
  logo?: string
  name: string
  type: 'founding' | 'institution' | 'research' | 'ecosystem'
}

export type NewsCategory = 'news' | 'event' | 'insight' | 'result'

export type ContentBlock =
  | { text: string; type: 'heading' }
  | { items: readonly string[]; type: 'list' }
  | { text: string; type: 'paragraph' }

export interface NewsEntry {
  body: readonly ContentBlock[]
  category: NewsCategory
  date: string
  description: string
  featured?: boolean
  published: boolean
  slug: string
  title: string
}

export interface ValueProposition {
  description: string
  id: string
  title: string
}

export interface ParticipationPath {
  description: string
  id: string
  title: string
}

/**
 * Generic titled card used across the cybersecurity ecosystem page
 * (resources, priority actions and the named governance/operations bodies).
 */
export interface CybersecurityCard {
  description: string
  title: string
}

export interface CybersecurityEcosystem {
  /** Six-stage continuous loop, in order. */
  cycle: readonly string[]
  /** Five key resource categories the alliance connects. */
  resources: readonly CybersecurityCard[]
  /** Four priority actions the ecosystem drives. */
  actions: readonly CybersecurityCard[]
  /**
   * How the ecosystem is run — only authorised leads are named; every other
   * participant is described by role, never by name.
   */
  organisation: readonly CybersecurityCard[]
  /** Pill badges for the many ways partners can contribute. */
  contribution: readonly string[]
  /** Responsible-governance boundaries (no mandatory raw-data delivery). */
  governanceBoundaries: readonly string[]
  /** Open-collaboration principles (vendor-neutral, equal, governable, evolving). */
  openPrinciples: readonly string[]
  summary: string
  title: string
}
