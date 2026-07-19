import { resolve, type Localized } from '@/i18n/localized'
import type { Locale } from '@/i18n/locales'
import type { WorkingGroupSummary } from '@/types/content'

export const WORKING_GROUPS: readonly WorkingGroupSummary[] = [
  {
    applicationEnvKey: 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY',
    description:
      '围绕大模型与智能体在网络安全场景中的研究、评测与应用，公开工作范围、关注方向和参与指引。机构与个人专业人士可根据相关能力提出合作意向，具体议题和安排以确认信息为准。',
    ecosystemHref: '/cybersecurity',
    ecosystemLabel: '网络安全专题',
    facts: [
      {
        authorizedScopes: ['commitment'],
        evidenceStatus: 'editorial',
        factId: 'FACT-029',
        publication: 'publish',
        reviewedAt: '2026-07-19',
        reviewer: 'T-005 content review',
      },
    ],
    id: 'cybersecurity',
    kind: 'working-group',
    leads: [
      {
        description: '发布公开议题与参与指引，并根据实际协作安排开展沟通协调。',
        name: '联盟协调',
        named: false,
        role: '议题与协作协调',
      },
      {
        description: '可围绕模型评测、能力验证与工程实践提出合作意向。',
        name: '模型与工程参与方',
        named: false,
        role: '技术与验证',
      },
      {
        description: '可围绕研究方法、评测设计与专业交流提出合作意向。',
        name: '高校、实验室与专业研究人员',
        named: false,
        role: '研究与评测',
      },
      {
        description: '可在具备必要权利基础与授权条件时，围绕任务、环境、产品或场景提出合作意向。',
        name: '安全企业与场景参与方',
        named: false,
        role: '任务与场景',
      },
    ],
    outcomes: [],
    responsibilities: [
      '发布并维护网络安全模型与智能体的公开关注方向和参与指引',
      '围绕经授权的任务、场景、环境和评测方法组织交流，具体协作以确认范围为准',
      '支持参与方讨论研究、验证、工程适配与场景实践',
      '依法依规推进相关协作；公开信息需完成必要授权、风险评估与发布审查',
    ],
    researchDirections: ['模型与智能体安全评测', '安全研发与代码分析', '网络测绘与威胁研判'],
    slug: 'cybersecurity',
    title: '网络安全工作组',
  },
] as const

type WorkingGroupLocalizedFields = Pick<
  WorkingGroupSummary,
  | 'description'
  | 'ecosystemLabel'
  | 'leads'
  | 'outcomes'
  | 'researchDirections'
  | 'responsibilities'
  | 'title'
>

const WORKING_GROUPS_EN: Readonly<Record<string, WorkingGroupLocalizedFields>> = {
  cybersecurity: {
    description:
      'The Cybersecurity Working Group publishes its scope, areas of interest and participation guidance for research, evaluation and application of large models and agents in cybersecurity. Organizations and individual professionals may express interest based on relevant capabilities. Specific topics and arrangements require confirmation.',
    ecosystemLabel: 'Cybersecurity Topic',
    leads: [
      {
        description:
          'Publishes public topics and participation guidance, and coordinates communication for confirmed collaboration.',
        name: 'Alliance coordination',
        named: false,
        role: 'Topic and collaboration coordination',
      },
      {
        description:
          'May propose collaboration around model evaluation, capability validation and engineering practice.',
        name: 'Model and engineering participants',
        named: false,
        role: 'Technology and validation',
      },
      {
        description:
          'May propose collaboration around research methods, evaluation design and professional exchange.',
        name: 'Universities, laboratories and professional researchers',
        named: false,
        role: 'Research and evaluation',
      },
      {
        description:
          'May propose tasks, environments, products or scenarios where the necessary rights and authorization conditions are in place.',
        name: 'Security organizations and scenario participants',
        named: false,
        role: 'Tasks and scenarios',
      },
    ],
    outcomes: [],
    researchDirections: [
      'Security evaluation for models and agents',
      'Secure development and code analysis',
      'Cyber mapping and threat assessment',
    ],
    responsibilities: [
      "Publish and maintain the working group's public areas of interest and participation guidance for cybersecurity models and agents",
      'Organize discussion around appropriately authorized tasks, scenarios, environments and evaluation methods, with collaboration limited to confirmed scope',
      'Support participants in discussing research, validation, engineering adaptation and scenario practice',
      'Proceed in accordance with applicable requirements; public information is subject to necessary authorization, risk assessment and publication review',
    ],
    title: 'Cybersecurity Working Group',
  },
}

export interface WorkingGroupCatalogContent {
  emptyBody: string
  emptyCta: string
  emptyTitle: string
  groupLabel: string
  heroDescription: string
  heroEyebrow: string
  heroTitle: string
  initiativeLabel: string
  joinCta: string
  metadataDescription: string
  metadataTitle: string
  sectionDescription: string
  sectionEyebrow: string
  sectionTitle: string
  viewCta: string
}

export interface WorkingGroupOverviewContent {
  ctaBody: string
  ctaEyebrow: string
  ctaTitle: string
  directionsDescription: string
  directionsEyebrow: string
  directionsTitle: string
  ecosystemCta: string
  groupLabel: string
  initiativeLabel: string
  joinCta: string
  membersCta: string
  metadataDescriptionFor: (title: string) => string
  outcomesDescription: string
  outcomesEmptyBody: string
  outcomesEmptyTitle: string
  outcomesEyebrow: string
  outcomesTitle: string
  rolesDescription: string
  rolesEyebrow: string
  rolesTitle: string
  scopeDescription: string
  scopeEyebrow: string
  scopeTitle: string
}

export interface WorkingGroupMembersContent {
  directoryTitle: string
  emptyBody: string
  emptyCta: string
  emptyTitle: string
  logoAltSuffix: string
  metadataDescriptionFor: (title: string) => string
  metadataTitleFor: (title: string) => string
  pageDescriptionFor: (title: string) => string
  pageTitle: string
  relationBody: string
  relationLinkLabel: string
}

interface WorkingGroupPageContent {
  catalog: WorkingGroupCatalogContent
  members: WorkingGroupMembersContent
  overview: WorkingGroupOverviewContent
}

const WORKING_GROUP_PAGE_CONTENT: Localized<WorkingGroupPageContent> = {
  en: {
    catalog: {
      emptyBody:
        'Other topics appear here only after their scope and participation path are confirmed. You can review the Alliance cooperation entry in the meantime.',
      emptyCta: 'Explore Alliance cooperation',
      emptyTitle: 'Other collaboration topics',
      groupLabel: 'Working Group',
      heroDescription:
        'Explore published topics, scopes, participation guidance and publicly confirmed collaborators.',
      heroEyebrow: 'Topic-based Collaboration',
      heroTitle: 'Working Groups',
      initiativeLabel: 'Initiative',
      joinCta: 'See how to contribute',
      metadataDescription:
        'Explore the Alliance working groups, their published scopes and ways to contribute.',
      metadataTitle: 'Working Groups',
      sectionDescription:
        'Each working group has a separate scope, participation page and public partner record.',
      sectionEyebrow: 'Published Working Groups',
      sectionTitle: 'Choose a topic to explore',
      viewCta: 'Explore the working group',
    },
    members: {
      directoryTitle: 'Collaborators confirmed for public disclosure',
      emptyBody:
        'Any future participant or role shown here must first be confirmed for public disclosure. You can still review the participation guidance and express interest.',
      emptyCta: 'See how to contribute',
      emptyTitle: 'No public partner list is available',
      logoAltSuffix: ' logo',
      metadataDescriptionFor: (title) =>
        `View collaborators and roles confirmed for public disclosure by the ${title}.`,
      metadataTitleFor: (title) => `${title} Collaborators`,
      pageDescriptionFor: (title) =>
        `This page lists only partners and roles confirmed for public disclosure by the ${title}. Alliance membership and working-group participation are maintained separately.`,
      pageTitle: 'Public Collaborators',
      relationBody:
        'Alliance membership and working-group participation are separate. Appearing in one list does not automatically confer the other status.',
      relationLinkLabel: 'View Alliance members',
    },
    overview: {
      ctaBody:
        'Organizations and individual professionals may express interest in a relevant topic. Review the audience, information to prepare and authorization boundaries before submitting.',
      ctaEyebrow: 'Participation',
      ctaTitle: 'Choose a suitable way to contribute',
      directionsDescription:
        'These areas help visitors assess topic relevance. They do not indicate that a project has started or produced results.',
      directionsEyebrow: 'Areas of Interest',
      directionsTitle: 'Research and validation areas',
      ecosystemCta: 'Explore the cybersecurity topic',
      groupLabel: 'Working Group',
      initiativeLabel: 'Initiative',
      joinCta: 'See how to contribute',
      membersCta: 'View collaborators',
      metadataDescriptionFor: (title) =>
        `Review the published scope, areas of interest, collaboration roles and participation links for the ${title}.`,
      outcomesDescription:
        'Only information confirmed by the relevant participants and cleared for public disclosure appears here.',
      outcomesEmptyBody:
        'Any future progress shown here must first be confirmed by the relevant participants and complete any necessary review.',
      outcomesEmptyTitle: 'No public update is available',
      outcomesEyebrow: 'Public Updates',
      outcomesTitle: 'Confirmed public information',
      rolesDescription:
        'This page describes general collaboration roles. Specific participants and responsibilities will be shown only after public confirmation.',
      rolesEyebrow: 'Collaboration Roles',
      rolesTitle: 'Types of participation',
      scopeDescription:
        'The following describes the current public scope. Specific topics, roles and arrangements depend on subsequent confirmation by the working group.',
      scopeEyebrow: 'Scope',
      scopeTitle: 'Published scope',
    },
  },
  zh: {
    catalog: {
      emptyBody: '其他议题仅在范围与参与方式确认后公开。现阶段可先了解联盟合作入口。',
      emptyCta: '了解联盟合作',
      emptyTitle: '其他协作议题',
      groupLabel: '工作组',
      heroDescription: '围绕已公开议题查看工作范围、参与方式和可公开的共建伙伴信息。',
      heroEyebrow: '议题协作',
      heroTitle: '工作组',
      initiativeLabel: '专项',
      joinCta: '查看参与方式',
      metadataDescription: '了解联盟工作组、公开工作范围与参与方式。',
      metadataTitle: '工作组',
      sectionDescription: '每个工作组分别说明工作范围、参与入口与公开伙伴信息。',
      sectionEyebrow: '已公开工作组',
      sectionTitle: '选择议题，了解协作方式',
      viewCta: '了解工作组',
    },
    members: {
      directoryTitle: '已确认可公开的共建伙伴',
      emptyBody:
        '本页未来如展示参与主体或角色，须先获得公开确认。您仍可查看工作组参与方式并提交合作意向。',
      emptyCta: '查看参与方式',
      emptyTitle: '暂无可公开的共建伙伴名单',
      logoAltSuffix: '标识',
      metadataDescriptionFor: (title) => `查看${title}已确认可公开的共建伙伴及角色信息。`,
      metadataTitleFor: (title) => `${title}｜公开共建伙伴`,
      pageDescriptionFor: (title) =>
        `本页仅展示${title}已确认可公开的共建伙伴及其角色；联盟会员与工作组参与关系分别维护。`,
      pageTitle: '公开共建伙伴',
      relationBody:
        '联盟会员与工作组共建伙伴是不同身份；某一主体出现在其中一处，不代表自动具备另一身份。',
      relationLinkLabel: '查看联盟成员',
    },
    overview: {
      ctaBody:
        '机构与个人专业人士均可提出议题合作意向。提交前请先了解适用对象、准备信息和授权边界。',
      ctaEyebrow: '参与工作组',
      ctaTitle: '选择适合的工作组参与方式',
      directionsDescription: '用于帮助参与者判断议题相关性，不代表已启动项目或已取得成果。',
      directionsEyebrow: '关注方向',
      directionsTitle: '研究与验证方向',
      ecosystemCta: '查看网络安全专题',
      groupLabel: '工作组',
      initiativeLabel: '专项',
      joinCta: '查看参与方式',
      membersCta: '查看共建伙伴',
      metadataDescriptionFor: (title) =>
        `查看${title}公开的工作范围、关注方向、协作角色与参与入口。`,
      outcomesDescription: '本页仅展示经相关参与方确认并完成必要审查的公开信息。',
      outcomesEmptyBody: '本页未来如展示阶段性信息，须先经相关参与方确认并完成必要审查。',
      outcomesEmptyTitle: '暂无可公开进展',
      outcomesEyebrow: '公开进展',
      outcomesTitle: '已确认可公开的信息',
      rolesDescription: '本页仅说明通用协作角色。具体参与主体和分工将在获得公开确认后展示。',
      rolesEyebrow: '协作角色',
      rolesTitle: '可参与的角色类型',
      scopeDescription:
        '以下内容说明当前公开的协作范围，具体议题、角色与安排以工作组后续确认信息为准。',
      scopeEyebrow: '工作范围',
      scopeTitle: '公开的工作范围',
    },
  },
}

export function getWorkingGroupSlugs(): string[] {
  return WORKING_GROUPS.map(({ slug }) => slug)
}

export function getWorkingGroupBySlug(slug: string): WorkingGroupSummary | undefined {
  return WORKING_GROUPS.find((group) => group.slug === slug)
}

export function localizeWorkingGroup(
  group: WorkingGroupSummary,
  locale: Locale,
): WorkingGroupSummary {
  if (locale === 'zh') return group

  const overlay = WORKING_GROUPS_EN[group.slug]

  return overlay ? { ...group, ...overlay } : group
}

export function getWorkingGroupCatalogContent(locale: Locale): WorkingGroupCatalogContent {
  return resolve(WORKING_GROUP_PAGE_CONTENT, locale).catalog
}

export function getWorkingGroupOverviewContent(locale: Locale): WorkingGroupOverviewContent {
  return resolve(WORKING_GROUP_PAGE_CONTENT, locale).overview
}

export function getWorkingGroupMembersContent(locale: Locale): WorkingGroupMembersContent {
  return resolve(WORKING_GROUP_PAGE_CONTENT, locale).members
}
