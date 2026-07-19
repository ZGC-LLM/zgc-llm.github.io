/**
 * Navigation item: a leaf (href, no children) or a group (children, with an
 * optional `href` landing target for the group label itself).
 *
 * Invariant:
 * - Leaf node: must have `href`, must not have `children`
 * - Group node: must have `children`; `href` optional (parent link target)
 */
export interface NavigationItem {
  /** Target route for leaf nodes, or the group label's landing target */
  href?: string
  label: string
  /** Child items; presence indicates this is a group node */
  children?: readonly NavigationItem[]
}

export type ApplicationTargetId =
  'alliance' | 'cybersecurity-program' | 'cybersecurity-working-group'

export type ApplicationAvailability =
  'available' | 'invalid' | 'missing' | 'unapproved' | 'unconfigured'

export interface ExternalApplicationTarget {
  href?: string
  id?: ApplicationTargetId
  label: string
  unavailableMessage: string
}

export interface ResolvedApplicationTarget extends ExternalApplicationTarget {
  isAvailable: boolean
  status: ApplicationAvailability
}

export type FactEvidenceStatus =
  'conflict' | 'editorial' | 'partial' | 'project-decision' | 'public-source' | 'unverified'

export type FactPublicationDecision = 'block' | 'neutralize' | 'publish'

export type FactAuthorizationScope =
  'commitment' | 'display-name' | 'logo' | 'official-english-name' | 'result' | 'role'

export interface FactSource {
  publishedAt?: string
  reviewedAt: string
  title: string
  url: string
}

/**
 * Public-fact evidence attached to content records.
 *
 * `named` and `published` remain rendering flags only. They never imply that a
 * name, role, result or commitment has been reviewed or authorised for public
 * use; that decision is represented explicitly here.
 */
export interface FactReference {
  /** Approved public-use scopes; may be empty for block/neutralize, but not publish. */
  authorizedScopes: readonly FactAuthorizationScope[]
  evidenceStatus: FactEvidenceStatus
  factId: string
  publication: FactPublicationDecision
  reviewedAt: string
  reviewer?: string
  source?: FactSource
}

export interface FactAwareContent {
  /** Optional during the staged T-004–T-006 migration; validation reports omissions. */
  facts?: readonly FactReference[]
}

export interface WorkingGroupLead extends FactAwareContent {
  /** 角色/职责，如「统筹」「技术牵引」「学术指导」 */
  role: string
  /** 授权具名单位；未授权则填角色化占位描述 */
  name: string
  /** true=已公开授权具名；false=按角色描述（治理边界） */
  named: boolean
  /** 该单位在分工中的职责说明；分工唯一权威源，生态页组织机制复用 */
  description?: string
}

export interface WorkingGroupSummary extends FactAwareContent {
  /** 该工作组专属申请问卷的环境变量名；缺失或非法时保持不可用，不回退其他表单。 */
  applicationEnvKey?: string
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

export interface WorkingGroupMember extends FactAwareContent {
  description?: string
  id: string
  logo?: string
  name: string
  /** 参与角色，如「共建单位」「学术支持」 */
  role?: string
}

export interface MemberSummary extends FactAwareContent {
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

/**
 * News actions are validated as an exclusive runtime contract: use either a
 * registered `applicationTargetId` or an ordinary HTTPS `ctaHref`, and pair the
 * selected target with `ctaLabel`. Optional fields remain source-compatible
 * while T-006 migrates existing raw-form content and its render consumers.
 */
export interface NewsEntry extends FactAwareContent {
  applicationTargetId?: ApplicationTargetId
  body: readonly ContentBlock[]
  category: NewsCategory
  ctaHref?: string
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
 * (resources and priority actions).
 */
export interface CybersecurityCard {
  description: string
  title: string
}

export interface CybersecurityEcosystem {
  /** Six-stage continuous loop, in order. */
  cycle: readonly string[]
  /** Six key resource categories the alliance connects. */
  resources: readonly CybersecurityCard[]
  /** Four priority actions the ecosystem drives. */
  actions: readonly CybersecurityCard[]
  /** Pill badges for the many ways partners can contribute. */
  contribution: readonly string[]
  /** Responsible-governance boundaries (no mandatory raw-data delivery). */
  governanceBoundaries: readonly string[]
  /** Open-collaboration principles (vendor-neutral, equal, governable, evolving). */
  openPrinciples: readonly string[]
  summary: string
  title: string
}
