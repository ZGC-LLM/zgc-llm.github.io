import { resolve, type Localized } from '@/i18n/localized'
import type { Locale } from '@/i18n/locales'
import type { ValueProposition } from '@/types/content'

export interface HomeParticipationPath {
  readonly action: string
  readonly description: string
  readonly href: '/join' | '/members' | '/news' | '/working-groups'
  readonly id: string
  readonly title: string
}

const FOCUS_AREAS: Localized<readonly ValueProposition[]> = {
  en: [
    {
      description:
        'Focus on shared research and validation questions in core large-model technology, long-horizon tasks and agent systems.',
      id: 'technology',
      title: 'Technology and systems',
    },
    {
      description:
        'Connect needs and capabilities across models, chips, computing, data, platforms and industry applications.',
      id: 'industry',
      title: 'Industry and applications',
    },
    {
      description:
        'Address evaluation, security, compliance, authorization and accountability as foundations for trustworthy use.',
      id: 'governance',
      title: 'Security and governance',
    },
  ],
  zh: [
    {
      description: '关注大模型核心技术、长程任务与智能体系统，识别可共同研究和验证的问题。',
      id: 'technology',
      title: '技术与系统',
    },
    {
      description: '连接模型、芯片、算力、数据、平台与行业应用，围绕真实需求寻找协作切入点。',
      id: 'industry',
      title: '产业与场景',
    },
    {
      description: '关注评测、安全、合规、授权与责任边界，为可信应用建立清晰前提。',
      id: 'governance',
      title: '安全与治理',
    },
  ],
}

const TRUST_PRINCIPLES: Localized<readonly ValueProposition[]> = {
  en: [
    {
      description:
        'Start with practical needs and define the question, participation model and intended output.',
      id: 'shared-priorities',
      title: 'Shared priorities',
    },
    {
      description:
        'Include security, compliance, authorization and accountability in the collaboration process.',
      id: 'responsibilities',
      title: 'Clear responsibilities',
    },
    {
      description:
        'Publish member, event and progress information after reviewing its source and authorization.',
      id: 'confirmed-information',
      title: 'Confirmed information',
    },
  ],
  zh: [
    {
      description: '从真实需求出发，明确问题、参与方式与预期产出。',
      id: 'shared-priorities',
      title: '共同议题',
    },
    {
      description: '将安全、合规、授权与责任边界纳入协作过程。',
      id: 'responsibilities',
      title: '责任边界',
    },
    {
      description: '成员、活动与阶段材料在完成来源和授权确认后发布。',
      id: 'confirmed-information',
      title: '确认后公开',
    },
  ],
}

const PARTICIPATION_PATHS: Localized<readonly HomeParticipationPath[]> = {
  en: [
    {
      action: 'View ways to participate',
      description: 'Review the Alliance participation guidance and current application status.',
      href: '/join',
      id: 'alliance-participation',
      title: 'Alliance participation',
    },
    {
      action: 'Explore working groups',
      description: "Explore each working group's focus and participation guidance.",
      href: '/working-groups',
      id: 'working-groups',
      title: 'Working-group collaboration',
    },
    {
      action: 'View member information',
      description: 'Browse public member information and source notes.',
      href: '/members',
      id: 'members',
      title: 'Member information',
    },
    {
      action: 'View Alliance updates',
      description: 'Read confirmed news, event and progress information.',
      href: '/news',
      id: 'news',
      title: 'Alliance updates',
    },
  ],
  zh: [
    {
      action: '查看参与方式',
      description: '了解联盟层面的参与说明与当前入口状态。',
      href: '/join',
      id: 'alliance-participation',
      title: '联盟参与',
    },
    {
      action: '查看工作组',
      description: '浏览各工作组方向与对应的参与说明。',
      href: '/working-groups',
      id: 'working-groups',
      title: '专题协作',
    },
    {
      action: '查看成员信息',
      description: '查阅联盟成员公开信息与来源说明。',
      href: '/members',
      id: 'members',
      title: '成员信息',
    },
    {
      action: '查看联盟动态',
      description: '查看经确认后发布的新闻、活动与阶段信息。',
      href: '/news',
      id: 'news',
      title: '联盟动态',
    },
  ],
}

export function getHomeFocusAreas(locale: Locale): readonly ValueProposition[] {
  return resolve(FOCUS_AREAS, locale)
}

export function getHomeTrustPrinciples(locale: Locale): readonly ValueProposition[] {
  return resolve(TRUST_PRINCIPLES, locale)
}

export function getHomeParticipationPaths(locale: Locale): readonly HomeParticipationPath[] {
  return resolve(PARTICIPATION_PATHS, locale)
}
