import { resolve, type Localized } from '@/i18n/localized'
import type { Locale } from '@/i18n/locales'
import type { ValueProposition } from '@/types/content'

// 双语内容：中文权威，英文为初稿（enDraft，待人工校对）。经 getHomeXxx(locale) 访问。

export interface HomeParticipationPath {
  readonly action: string
  readonly description: string
  readonly href: '/join' | '/members' | '/news' | '/working-groups'
  readonly id: string
  readonly title: string
}

const VALUE_PROPOSITIONS: Localized<readonly ValueProposition[]> = {
  en: [
    {
      description:
        'Keeping core foundation models open, connecting models, chips, computing power, data, platforms and industry applications to build an open collaboration network.',
      id: 'open',
      title: 'Open & Shared',
    },
    {
      description:
        'Around security-oriented large models, cybersecurity agents, capability evaluation and governance, moving black-box systems toward transparency and building a self-reliant, trustworthy and reliable security capability system.',
      id: 'trustworthy',
      title: 'Secure & Trustworthy',
    },
    {
      description:
        'Pooling the strength of the whole industry to tackle core technologies, long-horizon tasks and autonomous-agent systems, and pushing self-reliant large-model capabilities to new heights.',
      id: 'collaborative',
      title: 'Collaborative Effort',
    },
  ],
  zh: [
    {
      description: '坚持核心基座模型开源共享，连接模型、芯片、算力、数据、平台及行业应用力量，构建开放协作网络。',
      id: 'open',
      title: '开放共享',
    },
    {
      description:
        '围绕安全大模型、网络安全智能体、能力评测与治理，推动黑盒系统向透明可解释系统演进，构建自主可控、可信可靠的安全能力体系。',
      id: 'trustworthy',
      title: '安全可信',
    },
    {
      description: '汇聚产业各方力量，集中资源攻坚核心技术、长程任务与自治智能体系统，推动自主大模型能力持续迈向新高峰。',
      id: 'collaborative',
      title: '协同攻坚',
    },
  ],
}

const DIRECTIONS: Localized<readonly string[]> = {
  en: [
    'Core technology innovation for self-reliant large models',
    'Coordinated development across the industry chain',
    'Industry scenarios and high-quality data co-creation',
    'Joint evaluation of models and agents',
    'Security-oriented large models and trustworthy agents',
    'International development of AI enterprises',
  ],
  zh: [
    '自主大模型核心技术创新',
    '产业链上下游协同发展',
    '行业场景与高质量数据共建',
    '模型与智能体联合评测',
    '安全大模型与可信智能体建设',
    '人工智能企业国际化发展',
  ],
}

const PARTICIPATION_PATHS: Localized<readonly HomeParticipationPath[]> = {
  en: [
    {
      action: 'Apply to join',
      description:
        'Bring your organization into the Alliance and work with partners across the industry.',
      href: '/join',
      id: 'alliance-participation',
      title: 'Join as an organization',
    },
    {
      action: 'Explore working groups',
      description: 'Individuals and teams can take part in a working group around a specific topic.',
      href: '/working-groups',
      id: 'working-groups',
      title: 'Join a working group',
    },
    {
      action: 'See the members',
      description: 'See which organizations have already joined the Alliance.',
      href: '/members',
      id: 'members',
      title: 'Who has joined',
    },
    {
      action: 'Read the updates',
      description: 'Catch up on the latest news, events and progress from the Alliance.',
      href: '/news',
      id: 'news',
      title: 'Latest updates',
    },
  ],
  zh: [
    {
      action: '申请加入',
      description: '让你的机构加入联盟，与产业各方一起协作。',
      href: '/join',
      id: 'alliance-participation',
      title: '机构加入联盟',
    },
    {
      action: '了解工作组',
      description: '个人和团队都可以围绕具体议题参与工作组。',
      href: '/working-groups',
      id: 'working-groups',
      title: '参与工作组',
    },
    {
      action: '看看成员单位',
      description: '看看已经加入联盟的机构有哪些。',
      href: '/members',
      id: 'members',
      title: '谁已加入',
    },
    {
      action: '查看最新动态',
      description: '了解联盟最新的新闻、活动与进展。',
      href: '/news',
      id: 'news',
      title: '最新动态',
    },
  ],
}

export function getHomeValuePropositions(locale: Locale): readonly ValueProposition[] {
  return resolve(VALUE_PROPOSITIONS, locale)
}

export function getHomeDirections(locale: Locale): readonly string[] {
  return resolve(DIRECTIONS, locale)
}

export function getHomeParticipationPaths(locale: Locale): readonly HomeParticipationPath[] {
  return resolve(PARTICIPATION_PATHS, locale)
}
