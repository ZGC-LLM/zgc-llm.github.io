import { resolve, type Localized } from '@/i18n/localized'
import type { Locale } from '@/i18n/locales'
import type { ValueProposition } from '@/types/content'

// 双语内容：中文权威，英文为初稿（enDraft，待人工校对）。经 getHomeXxx(locale) 访问。

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

const ACTION_SLOGANS: Localized<readonly string[]> = {
  en: [
    'From demonstration agents to production-grade autonomous systems',
    'From scattered exploration to coordinated effort',
    'From closed black boxes to transparent and trustworthy systems',
    'From single-point breakthroughs to long-horizon task deployment',
  ],
  zh: [
    '从示范智能体走向生产级自治系统',
    '从分散探索走向协同攻坚',
    '从封闭黑盒走向透明可信',
    '从单点能力突破走向长程任务落地',
  ],
}

export function getHomeValuePropositions(locale: Locale): readonly ValueProposition[] {
  return resolve(VALUE_PROPOSITIONS, locale)
}

export function getHomeDirections(locale: Locale): readonly string[] {
  return resolve(DIRECTIONS, locale)
}

export function getHomeActionSlogans(locale: Locale): readonly string[] {
  return resolve(ACTION_SLOGANS, locale)
}
