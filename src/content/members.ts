import type { Locale } from '@/i18n/locales'
import type {
  FactAuthorizationScope,
  FactReference,
  FactSource,
  MemberSummary,
} from '@/types/content'

const CONTENT_REVIEWER = 'T-001 repository release audit'

export const MEMBER_DIRECTORY_SOURCE = {
  publishedAt: '2025-08-25',
  reviewedAt: '2026-07-19',
  title: '中关村自主大模型产业联盟第一次会员大会结果公示',
  url: 'https://www.zhipuai.cn/zh/news/97',
} satisfies FactSource

function publishedMemberFact(
  factId: string,
  authorizedScopes: readonly FactAuthorizationScope[],
): FactReference {
  return {
    authorizedScopes,
    evidenceStatus: 'public-source',
    factId,
    publication: 'publish',
    reviewedAt: MEMBER_DIRECTORY_SOURCE.reviewedAt,
    reviewer: CONTENT_REVIEWER,
    source: MEMBER_DIRECTORY_SOURCE,
  }
}

export const MEMBER_DIRECTORY_FACTS: readonly FactReference[] = [
  publishedMemberFact('FACT-009', ['result']),
]

export type MemberDirectoryGroupId = 'council' | 'supervisory-board'

export interface MemberDirectoryGroup {
  id: MemberDirectoryGroupId
  memberIds: readonly string[]
}

/**
 * Public groupings follow the source announcement, not the legacy organization-type field.
 * `MemberSummary.type` remains an internal compatibility field for other page previews.
 */
export const MEMBER_DIRECTORY_GROUPS: readonly MemberDirectoryGroup[] = [
  {
    id: 'council',
    memberIds: [
      'tsinghua',
      'zhipu',
      'didi',
      'baai',
      'ict-cas',
      'jingneng-digital',
      'moore-threads',
    ],
  },
  {
    id: 'supervisory-board',
    memberIds: ['paratera', 'shengshu', 'caizhi'],
  },
] as const

export interface MembersPageCopy {
  emptyAction: string
  emptyBody: string
  emptyTitle: string
  groups: Readonly<Record<MemberDirectoryGroupId, { description: string; title: string }>>
  heroDescription: string
  heroEyebrow: string
  heroTitle: string
  logoAltSuffix: string
  metadataDescription: string
  metadataTitle: string
  relationAction: string
  relationNote: string
  roleLabels: Readonly<Record<string, string>>
  sourceDescription: string
  sourcePublishedLabel: string
  sourceEyebrow: string
  sourceLinkLabel: string
  sourceReviewedLabel: string
  sourceTitle: string
}

export const MEMBERS_PAGE_COPY: Readonly<Record<Locale, MembersPageCopy>> = {
  en: {
    emptyAction: 'View Alliance updates',
    emptyBody:
      'A name appears here only after its source, review date and approved display scope have been recorded.',
    emptyTitle: 'No member records meet the publication requirements',
    groups: {
      council: {
        description:
          'Seven organizations named as members of the first council in the public announcement dated August 25, 2025.',
        title: 'First council',
      },
      'supervisory-board': {
        description:
          'Three organizations named as members of the first supervisory board in the same announcement.',
        title: 'First supervisory board',
      },
    },
    heroDescription:
      'The announcement dated August 25, 2025 records 32 organizational members at the first member meeting. This page lists the seven council and three supervisory board organizations named in that announcement; it is not a current directory of all members.',
    heroEyebrow: 'Public records',
    heroTitle: 'Member records',
    logoAltSuffix: ' logo',
    metadataDescription:
      'Council and supervisory board organizations named in the public announcement dated August 25, 2025, with roles shown only where the source states them.',
    metadataTitle: 'Member records',
    relationAction: 'View working groups',
    relationNote: 'Working-group participants are reviewed under a separate publication scope.',
    roleLabels: {
      监事长单位: 'Chief Supervisor organization',
      理事长单位: 'Chair organization',
      秘书长单位: 'Secretary-General organization',
    },
    sourceDescription:
      'Organization names remain in Chinese because verified official English names are not available. This page does not infer logos, English names or other partnership roles.',
    sourceEyebrow: 'Source and scope',
    sourceLinkLabel: 'View the source announcement',
    sourcePublishedLabel: 'Published',
    sourceReviewedLabel: 'Reviewed',
    sourceTitle: 'Reviewed public announcement',
  },
  zh: {
    emptyAction: '查看联盟动态',
    emptyBody: '成员名称只在公开来源、复核日期与展示范围齐备后显示。',
    emptyTitle: '暂无符合公开条件的成员记录',
    groups: {
      council: {
        description: '2025 年 8 月 25 日结果公示列明的第一届理事会成员单位，共 7 家。',
        title: '第一届理事会',
      },
      'supervisory-board': {
        description: '同一公示列明的第一届监事会成员单位，共 3 家。',
        title: '第一届监事会',
      },
    },
    heroDescription:
      '2025 年 8 月 25 日发布的第一次会员大会结果公示记录了 32 家单位会员。本页仅列出公示中的 7 家理事会和 3 家监事会成员单位，不作为全部会员的实时名录。',
    heroEyebrow: '公开名录',
    heroTitle: '联盟成员公示',
    logoAltSuffix: '标识',
    metadataDescription:
      '依据 2025 年 8 月 25 日第一次会员大会结果公示，展示第一届理事会、监事会成员单位及公示职务。',
    metadataTitle: '联盟成员公示',
    relationAction: '查看工作组',
    relationNote: '工作组参与名单按独立的公开范围核验。',
    roleLabels: {},
    sourceDescription:
      '本页只展示原始公示明确列出的中文名称与职务，不据此推定机构标识、官方英文名称或其他合作关系。',
    sourceEyebrow: '来源与范围',
    sourceLinkLabel: '查看原始公示',
    sourcePublishedLabel: '公示日期',
    sourceReviewedLabel: '本站复核',
    sourceTitle: '已复核公开来源',
  },
}

export function memberHasPublishedScope(
  member: MemberSummary,
  scope: FactAuthorizationScope,
): boolean {
  return Boolean(
    member.facts?.some(
      (fact) => fact.publication === 'publish' && fact.authorizedScopes.includes(scope),
    ),
  )
}

// The first three records retain their existing order for home-page compatibility.
// Public council/supervisory grouping is defined independently above.
export const MEMBERS: readonly MemberSummary[] = [
  {
    description: '理事长单位',
    facts: [publishedMemberFact('FACT-010', ['display-name', 'role'])],
    id: 'tsinghua',
    name: '清华大学',
    type: 'research',
  },
  {
    description: '秘书长单位',
    facts: [publishedMemberFact('FACT-011', ['display-name', 'role'])],
    id: 'zhipu',
    name: '北京智谱华章科技股份有限公司',
    type: 'institution',
  },
  {
    description: '监事长单位',
    facts: [publishedMemberFact('FACT-012', ['display-name', 'role'])],
    id: 'paratera',
    name: '北京并行科技股份有限公司',
    type: 'institution',
  },
  {
    facts: [publishedMemberFact('FACT-013', ['display-name'])],
    id: 'didi',
    name: '北京嘀嘀无限科技发展有限公司',
    type: 'institution',
  },
  {
    facts: [publishedMemberFact('FACT-014', ['display-name'])],
    id: 'jingneng-digital',
    name: '京能数字产业有限公司',
    type: 'institution',
  },
  {
    facts: [publishedMemberFact('FACT-015', ['display-name'])],
    id: 'moore-threads',
    name: '摩尔线程智能科技（北京）股份有限公司',
    type: 'institution',
  },
  {
    facts: [publishedMemberFact('FACT-016', ['display-name'])],
    id: 'shengshu',
    name: '北京生数科技有限公司',
    type: 'institution',
  },
  {
    facts: [publishedMemberFact('FACT-017', ['display-name'])],
    id: 'caizhi',
    name: '北京彩智科技有限公司',
    type: 'institution',
  },
  {
    facts: [publishedMemberFact('FACT-018', ['display-name'])],
    id: 'baai',
    name: '北京智源人工智能研究院',
    type: 'research',
  },
  {
    facts: [publishedMemberFact('FACT-019', ['display-name'])],
    id: 'ict-cas',
    name: '中国科学院计算技术研究所',
    type: 'research',
  },
] as const
