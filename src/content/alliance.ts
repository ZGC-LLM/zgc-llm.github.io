import { resolve, type Localized } from '@/i18n/localized'
import type { Locale } from '@/i18n/locales'
import type { ValueProposition } from '@/types/content'

// 双语内容：中文权威，英文为初稿（enDraft，待联盟人工校对）。
// 通过 getAllianceXxx(locale) 访问；en 缺失时 resolve 自动回退中文。

const MISSION: Localized<string> = {
  en: 'Bringing together the strength of self-reliant large models to build an open, secure and collaborative industry ecosystem — advancing core-technology breakthroughs, long-horizon tasks and autonomous-agent systems, and fostering industrial collaboration, real-world deployment and international cooperation.',
  zh: '汇聚自主大模型力量，共建开放、安全、协同的产业生态，持续推动核心技术攻坚、长程任务与自治智能体系统建设，促进产业协同、场景落地与国际合作。',
}

const INTRO: Localized<readonly string[]> = {
  en: [
    'The Zhongguancun Self-Reliant Large Model Industry Alliance was established under the guidance of the relevant authorities. Guided by the principles of independent innovation, open collaboration, security and trustworthiness, and joint industry development, it connects the strengths of models, chips, computing power, data, platforms and industry applications to help build an internationally competitive self-reliant large-model industry ecosystem.',
    'The Alliance invests continuously in frontier directions such as long-horizon tasks and autonomous-agent systems, moving large-model capabilities from single-turn demonstrations toward sustainable production environments. It also places great emphasis on the convergence of large models and cybersecurity — building, around security-oriented large models, cybersecurity agents, professional data, capability evaluation and real-world applications, a self-reliant, trustworthy and reliable large-model security capability system that evolves from black-box toward transparent, interpretable systems.',
  ],
  zh: [
    '中关村自主大模型产业联盟在相关主管部门指导下推动组建，以自主创新、开放协作、安全可信和产业共建为原则，连接模型、芯片、算力、数据、平台及行业应用力量，推动形成具有国际竞争力的自主大模型产业生态。',
    '联盟围绕长程任务、自治智能体系统等前沿方向持续投入，推动大模型能力从单回合演示走向可持续运行的生产环境；同时高度重视大模型与网络安全的融合发展，围绕安全大模型、网络安全智能体、专业数据、能力评测和真实场景应用，推动构建自主可控、可信可靠、由黑盒向透明系统演进的大模型安全能力体系。',
  ],
}

const VALUES: Localized<readonly ValueProposition[]> = {
  en: [
    {
      description:
        'Committed to independent innovation — tackling long-horizon tasks and autonomous-agent systems, breaking through the core technologies of self-reliant large models and strengthening the foundation for industry development.',
      id: 'independent',
      title: 'Independent Innovation',
    },
    {
      description:
        'Connecting models, chips, computing power, data, platforms and industry applications, keeping core foundation models open, and expanding shared industry value through open collaboration.',
      id: 'open',
      title: 'Open Collaboration',
    },
    {
      description:
        'Valuing security, compliance, authorization and boundaries of responsibility — moving black-box systems toward transparent, interpretable ones and building a self-reliant, trustworthy and reliable security capability system.',
      id: 'trustworthy',
      title: 'Secure & Trustworthy',
    },
  ],
  zh: [
    {
      description: '坚持自主创新，持续攻坚长程任务与自治智能体系统，突破自主大模型核心技术，夯实产业发展根基。',
      id: 'independent',
      title: '自主创新',
    },
    {
      description: '连接模型、芯片、算力、数据、平台及行业应用力量，坚持核心基座模型开源共享，以开放合作扩大产业共同价值。',
      id: 'open',
      title: '开放协作',
    },
    {
      description: '重视安全、合规、授权与责任边界，推动黑盒系统向透明可解释系统演进，构建自主可控、可信可靠的安全能力体系。',
      id: 'trustworthy',
      title: '安全可信',
    },
  ],
}

const MECHANISM: Localized<readonly string[]> = {
  en: [
    'The Alliance coordinates priority directions and ecosystem-cooperation mechanisms.',
    'Working groups (such as the Cybersecurity Working Group) advance specialised topics on an ongoing basis.',
    'Member partners take part in priority projects through the working groups, according to their capabilities and interests.',
    'Stage results are released publicly through events, reports and case studies.',
  ],
  zh: [
    '联盟统筹重点方向与生态合作机制',
    '下设工作组（如网络安全工作组）围绕专业议题持续推进',
    '依托工作组组织成员伙伴按能力与意愿参与重点项目',
    '阶段成果通过活动、报告与案例公开发布',
  ],
}

const DIRECTIONS: Localized<readonly (readonly [string, string])[]> = {
  en: [
    [
      'Core technology innovation for self-reliant large models',
      'Break through the core technologies of self-reliant large models and strengthen the foundation for industry development.',
    ],
    [
      'Coordinated development across the industry chain',
      'Connect models, chips, computing power, data, platforms and industry applications to drive upstream–downstream coordination.',
    ],
    [
      'Industry scenarios and high-quality data co-creation',
      'Organise scenario co-creation, needs analysis and high-quality data accumulation around real industry problems.',
    ],
    [
      'Joint evaluation of models and agents',
      'Build benchmarks, cyber ranges and real-task evaluation systems, advancing capability evaluation and standards research that move agents from demonstration to production.',
    ],
    [
      'Security-oriented large models and trustworthy agents',
      'Build security-oriented large models and cybersecurity agents, move black-box systems toward transparency, and strengthen large-model security governance and trustworthy applications.',
    ],
    [
      'International development of AI enterprises',
      'Connect international cooperation resources and support AI enterprises in reaching global markets.',
    ],
  ],
  zh: [
    ['自主大模型核心技术创新', '突破自主大模型核心技术，夯实产业发展根基。'],
    ['产业链上下游协同发展', '连接模型、芯片、算力、数据、平台及行业应用，推动上下游协同。'],
    ['行业场景与高质量数据共建', '围绕真实行业问题组织场景共建、需求梳理与高质量数据沉淀。'],
    [
      '模型与智能体联合评测',
      '建设 Benchmark、靶场与真实任务评测体系，推动智能体从示范走向生产环境的能力评测与标准研究。',
    ],
    [
      '安全大模型与可信智能体建设',
      '建设安全大模型与网络安全智能体，推动黑盒系统向透明可解释系统演进，强化大模型安全治理与可信应用。',
    ],
    ['人工智能企业国际化发展', '连接国际合作资源，支持人工智能企业走向全球市场。'],
  ],
}

export function getAllianceMission(locale: Locale): string {
  return resolve(MISSION, locale)
}

export function getAllianceIntro(locale: Locale): readonly string[] {
  return resolve(INTRO, locale)
}

export function getAllianceValues(locale: Locale): readonly ValueProposition[] {
  return resolve(VALUES, locale)
}

export function getAllianceMechanism(locale: Locale): readonly string[] {
  return resolve(MECHANISM, locale)
}

export function getAllianceDirections(locale: Locale): readonly (readonly [string, string])[] {
  return resolve(DIRECTIONS, locale)
}
