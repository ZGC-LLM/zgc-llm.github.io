export interface NavigationItem {
  href: string
  label: string
}

export interface ExternalApplicationTarget {
  href?: string
  label: string
  unavailableMessage: string
}

export interface ResolvedApplicationTarget extends ExternalApplicationTarget {
  isAvailable: boolean
}

export interface WorkingGroupLead {
  /** 角色/职责，如「统筹」「技术牵引」「学术指导」 */
  role: string
  /** 授权具名单位；未授权则填角色化占位描述 */
  name: string
  /** true=已公开授权具名；false=按角色描述（治理边界） */
  named: boolean
}

export interface WorkingGroupSummary {
  description: string
  /** 互链业务专题页，如 '/cybersecurity' */
  ecosystemHref?: string
  /** 互链标签，如 '网络安全生态' */
  ecosystemLabel?: string
  id: string
  kind: 'working-group' | 'initiative'
  /** 负责人（治理：仅授权者具名） */
  leads: readonly WorkingGroupLead[]
  /** 成果（本期可空态占位） */
  outcomes: readonly string[]
  /** 职责 */
  responsibilities: readonly string[]
  /** 研究方向 */
  researchDirections: readonly string[]
  /** 路由键，如 'cybersecurity' */
  slug: string
  title: string
}

export interface WorkingGroupMember {
  description?: string
  id: string
  logo?: string
  name: string
  /** 参与角色，如「共建单位」「学术支持」 */
  role?: string
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
  /** 可选外部行动入口链接（如飞书申请表），须为 https */
  ctaHref?: string
  /** 外部行动入口按钮文案，与 ctaHref 成对出现 */
  ctaLabel?: string
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
