import { resolve, type Localized } from '@/i18n/localized'
import type { Locale } from '@/i18n/locales'
import type { ValueProposition } from '@/types/content'

const OVERVIEW: Localized<readonly string[]> = {
  en: [
    'The Alliance focuses on core large-model technology, industry coordination, practical applications, evaluation and security governance. It provides a structure for organizations to compare needs, identify collaboration opportunities and advance focused work.',
    'Focused topics may be advanced through working groups. Participation scope, milestones and public information are based on confirmed information.',
  ],
  zh: [
    '联盟关注大模型核心技术、产业链协同、真实场景、评测与安全治理等议题，为机构之间交流需求、识别协作机会和推进专题工作提供组织框架。',
    '专业议题可通过工作组等方式推进。参与范围、阶段目标与公开内容以经确认的信息为准。',
  ],
}

const VALUES: Localized<readonly ValueProposition[]> = {
  en: [
    {
      description:
        'Focus on core large-model technology, long-horizon tasks and agent systems, guided by long-term technical questions.',
      id: 'independent',
      title: 'Independent innovation',
    },
    {
      description:
        'Connect different technical approaches and organizational capabilities, with clear authorization and responsibilities.',
      id: 'open',
      title: 'Open collaboration',
    },
    {
      description:
        'Include security, compliance, evaluation, interpretability and accountability in technical and application discussions.',
      id: 'trustworthy',
      title: 'Security and trust',
    },
  ],
  zh: [
    {
      description: '关注大模型核心技术、长程任务与智能体系统等方向，以长期问题牵引技术探索。',
      id: 'independent',
      title: '自主创新',
    },
    {
      description: '连接不同技术路线与机构能力，在授权和责任边界内交流经验、形成合作。',
      id: 'open',
      title: '开放协作',
    },
    {
      description: '将安全、合规、评测、可解释性与责任边界纳入议题设计和应用讨论。',
      id: 'trustworthy',
      title: '安全可信',
    },
  ],
}

const MECHANISM: Localized<readonly ValueProposition[]> = {
  en: [
    {
      description:
        'Start with practical needs and professional questions, then define the goal, scope and intended output.',
      id: 'define',
      title: 'Define a shared topic',
    },
    {
      description:
        'Match relevant organizations and expertise to the topic, with clear roles and responsibilities.',
      id: 'organize',
      title: 'Organize participation',
    },
    {
      description:
        'Use working groups, discussions or project collaboration as the topic requires.',
      id: 'advance',
      title: 'Advance focused work',
    },
    {
      description:
        'Release activity and progress information after reviewing its source, authorization and wording.',
      id: 'publish',
      title: 'Publish confirmed information',
    },
  ],
  zh: [
    {
      description: '从真实需求与专业问题出发，明确目标、范围和预期产出。',
      id: 'define',
      title: '形成议题',
    },
    {
      description: '根据议题匹配相关机构与专业能力，明确分工和责任边界。',
      id: 'organize',
      title: '组织参与',
    },
    {
      description: '根据议题需要，通过工作组、交流活动或项目协作开展阶段性工作。',
      id: 'advance',
      title: '专题推进',
    },
    {
      description: '对来源、授权和表述完成确认后，再发布相关活动与阶段信息。',
      id: 'publish',
      title: '确认公开',
    },
  ],
}

const DIRECTIONS: Localized<readonly (readonly [string, string])[]> = {
  en: [
    [
      'Core technology and system capabilities',
      'Explore shared research questions in core large-model technology, long-horizon tasks and agent systems.',
    ],
    [
      'Industry coordination',
      'Connect needs and capabilities across models, chips, computing, data, platforms and industry applications.',
    ],
    [
      'Applications and data',
      'Examine use-case needs, data conditions and authorization boundaries around practical industry problems.',
    ],
    [
      'Evaluation and validation',
      'Focus on methods, benchmarks and validation conditions for models and agents in real tasks.',
    ],
    [
      'Security and governance',
      'Address security, compliance, interpretability and accountability for large models and agents.',
    ],
    [
      'International engagement',
      'Examine market, standards and collaboration topics relevant to AI organizations working across borders.',
    ],
  ],
  zh: [
    [
      '核心技术与系统能力',
      '关注大模型核心技术、长程任务与智能体系统等方向，识别可共同研究的问题。',
    ],
    ['产业链协同', '围绕模型、芯片、算力、数据、平台与行业应用，促进需求与能力对接。'],
    ['场景与数据', '从真实行业问题出发，讨论场景需求、数据条件与授权边界。'],
    ['评测与验证', '关注模型与智能体在真实任务中的评测方法、基准与验证条件。'],
    ['安全与治理', '讨论大模型与智能体的安全、合规、可解释性和责任边界。'],
    ['国际交流', '关注人工智能机构开展国际业务时涉及的市场、标准与合作议题。'],
  ],
}

export function getAllianceOverview(locale: Locale): readonly string[] {
  return resolve(OVERVIEW, locale)
}

export function getAllianceValues(locale: Locale): readonly ValueProposition[] {
  return resolve(VALUES, locale)
}

export function getAllianceMechanism(locale: Locale): readonly ValueProposition[] {
  return resolve(MECHANISM, locale)
}

export function getAllianceDirections(locale: Locale): readonly (readonly [string, string])[] {
  return resolve(DIRECTIONS, locale)
}
