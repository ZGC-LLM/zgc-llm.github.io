import { resolve, type Localized } from '@/i18n/localized'
import type { Locale } from '@/i18n/locales'
import type { CybersecurityEcosystem } from '@/types/content'

export interface CybersecurityPageContent extends CybersecurityEcosystem {
  actionsDescription: string
  actionsEyebrow: string
  actionsTitle: string
  contributionDescription: string
  contributionEyebrow: string
  contributionTitle: string
  cycleDescription: string
  cycleEyebrow: string
  cycleTitle: string
  detailCta: string
  governanceBody: string
  governanceEyebrow: string
  governanceTitle: string
  heroEyebrow: string
  joinCta: string
  metadataDescription: string
  organizationBody: string
  organizationEyebrow: string
  organizationTitle: string
  principlesLabel: string
  resourcesDescription: string
  resourcesEyebrow: string
  resourcesTitle: string
}

const CYBERSECURITY_CONTENT: Localized<CybersecurityPageContent> = {
  en: {
    actions: [
      {
        description:
          'Discuss methods for evaluating capability, risk, robustness and appropriate-use boundaries.',
        title: 'Model and agent evaluation',
      },
      {
        description:
          'Discuss reproducible tasks, controlled environments, adjudication methods and review mechanisms.',
        title: 'Task and environment design',
      },
      {
        description:
          'Discuss validation needs for tools, products and business scenarios within a clearly defined scope.',
        title: 'Scenario validation and adaptation',
      },
      {
        description:
          'Exchange research experience and confirm authorization, sensitive-information and risk boundaries before publication.',
        title: 'Research exchange and publication review',
      },
    ],
    actionsDescription:
      'Whether a topic proceeds, who participates and what it produces all require separate confirmation.',
    actionsEyebrow: 'Topic Areas',
    actionsTitle: 'Possible collaboration topics',
    contribution: [
      'Topic proposals',
      'Evaluation methods',
      'Test environments',
      'Appropriately authorized task materials',
      'Professional feedback',
      'Tool and product adaptation',
      'Application scenarios',
      'Research exchange',
    ],
    contributionDescription:
      'You may express interest through one or more contribution types. The final scope depends on confirmation.',
    contributionEyebrow: 'Participation',
    contributionTitle: 'Possible contributions',
    cycle: [
      'Topic definition',
      'Professional evaluation',
      'Scenario validation',
      'Knowledge capture',
      'Capability improvement',
      'Public exchange',
    ],
    cycleDescription:
      'Each topic may use the stages it needs, with goals, authorization and output boundaries confirmed at every step.',
    cycleEyebrow: 'Collaboration Framework',
    cycleTitle: 'Reference stages for collaboration',
    detailCta: 'Explore the working group',
    governanceBody:
      'Collaboration should proceed in accordance with applicable requirements, with authorization confirmation, risk assessment and publication review where the topic requires them.',
    governanceBoundaries: [
      'Discuss or use data, tasks and environments only where lawful source, necessary authorization and clear scope are established.',
      'Do not publicly disclose sensitive materials, credentials, personal information or actionable attack details.',
      'Information intended for publication requires confirmation by the relevant participants and any necessary compliance and risk review.',
    ],
    governanceEyebrow: 'Responsible Collaboration',
    governanceTitle: 'Governance boundaries',
    heroEyebrow: 'Cybersecurity Topic',
    joinCta: 'See how to contribute',
    metadataDescription:
      'Explore collaboration stages, resources, topics and governance for large models and agents in cybersecurity, with links to the Cybersecurity Working Group.',
    openPrinciples: [
      'Vendor-neutral',
      'Clear boundaries',
      'Governable security',
      'Careful disclosure',
    ],
    organizationBody:
      'The Cybersecurity Working Group publishes the detailed scope, collaboration roles and participation guidance. Organizations and individual professionals may express interest in the published areas. Eligibility, topics, roles and arrangements depend on confirmation by the working group.',
    organizationEyebrow: 'Organization and Participation',
    organizationTitle: 'Continue with the Cybersecurity Working Group',
    principlesLabel: 'Collaboration principles',
    resources: [
      {
        description:
          'Models, interfaces, tools and engineering experience that may support evaluation and adaptation discussions.',
        title: 'Models and engineering',
      },
      {
        description: 'Research methods, benchmark design, review mechanisms and risk analysis.',
        title: 'Research and evaluation methods',
      },
      {
        description:
          'Tasks, environments and business scenarios that may be discussed after rights and authorization scope are clear.',
        title: 'Appropriately authorized tasks and scenarios',
      },
      {
        description:
          'Organizational representatives and individual professionals from research, engineering, security operations and application teams.',
        title: 'Professional participants',
      },
      {
        description:
          'Products and controlled environments for capability validation, tool adaptation or scenario testing.',
        title: 'Products and validation environments',
      },
      {
        description:
          'Discussion and content channels for information confirmed as suitable for public disclosure.',
        title: 'Public exchange channels',
      },
    ],
    resourcesDescription:
      'These are resource types that may be relevant. They do not imply that the Alliance has committed to provide them or already covers every category.',
    resourcesEyebrow: 'Possible Resources',
    resourcesTitle: 'Resources that may support collaboration',
    summary:
      'This topic connects professional participants, task scenarios and evaluation methods for research, validation and application of large models and agents in cybersecurity. This page explains the collaboration framework and governance boundaries. The Cybersecurity Working Group publishes the detailed scope and participation guidance.',
    title: 'Cybersecurity Ecosystem Collaboration',
  },
  zh: {
    actions: [
      {
        description: '讨论能力、风险、鲁棒性与适用边界的评测方法。',
        title: '模型与智能体评测',
      },
      {
        description: '讨论可复现任务、受控环境、判定方法与复核机制。',
        title: '任务与环境设计',
      },
      {
        description: '在范围明确的前提下，讨论工具、产品与业务场景的验证需求。',
        title: '场景验证与适配',
      },
      {
        description: '交流研究经验，并在公开前确认授权、敏感信息和风险边界。',
        title: '研究交流与发布审查',
      },
    ],
    actionsDescription: '具体议题是否启动、由谁参与以及形成何种输出，均需另行确认。',
    actionsEyebrow: '协作议题',
    actionsTitle: '可讨论的协作议题',
    contribution: [
      '议题建议',
      '评测方法',
      '测试环境',
      '经授权的任务素材',
      '专业反馈',
      '工具与产品适配',
      '应用场景',
      '研究交流',
    ],
    contributionDescription: '可从一种或多种方式表达合作意向，最终范围以确认结果为准。',
    contributionEyebrow: '参与资源',
    contributionTitle: '可以提出的参与资源',
    cycle: ['议题提出', '专业评测', '场景验证', '经验沉淀', '能力改进', '公开交流'],
    cycleDescription: '不同议题可按实际需要选择环节，并在每一步确认目标、授权和输出边界。',
    cycleEyebrow: '协作框架',
    cycleTitle: '协作参考环节',
    detailCta: '查看网络安全工作组',
    governanceBody: '相关协作应依法依规推进，并根据议题需要完成授权确认、风险评估和公开审查。',
    governanceBoundaries: [
      '仅在具备合法来源、必要授权与明确范围时讨论或使用数据、任务和环境。',
      '不公开敏感材料、密钥、个人信息或可操作攻击细节。',
      '拟公开信息需经相关参与方确认，并完成必要的合规与风险审查。',
    ],
    governanceEyebrow: '责任治理',
    governanceTitle: '治理边界',
    heroEyebrow: '网络安全专题',
    joinCta: '查看参与方式',
    metadataDescription:
      '介绍大模型与智能体网络安全协作的参考环节、可连接资源、议题方向与治理边界，并引导至网络安全工作组。',
    openPrinciples: ['厂商中立', '边界清楚', '安全可治理', '审慎公开'],
    organizationBody:
      '网络安全工作组发布具体工作范围、协作角色和参与指引。机构与个人专业人士可根据公开方向提出合作意向，具体资格、议题、角色和安排以工作组确认信息为准。',
    organizationEyebrow: '组织与参与',
    organizationTitle: '前往网络安全工作组继续了解',
    principlesLabel: '协作原则',
    resources: [
      {
        description: '模型、接口、工具与工程经验，可用于讨论评测和适配需求。',
        title: '模型与工程能力',
      },
      {
        description: '研究方法、基准设计、复核机制与风险分析。',
        title: '研究与评测方法',
      },
      {
        description: '在权利基础和授权范围明确后，可讨论的任务、环境与业务场景。',
        title: '经授权的任务与场景',
      },
      {
        description: '来自研究、工程、安全运营与应用侧的机构代表和个人专业人士。',
        title: '专业参与者',
      },
      {
        description: '用于能力验证、工具适配或场景测试的产品与受控环境。',
        title: '产品与验证环境',
      },
      {
        description: '用于交流经确认、可公开信息的研讨与内容渠道。',
        title: '公开交流渠道',
      },
    ],
    resourcesDescription: '以下是协作中可能涉及的资源类型，不代表联盟已承诺提供或已覆盖全部资源。',
    resourcesEyebrow: '协作资源',
    resourcesTitle: '可连接的协作资源',
    summary:
      '围绕大模型与智能体在网络安全场景中的研究、验证和应用，连接专业参与者、任务场景与评测方法。本页介绍协作框架与治理边界；具体工作范围和参与方式请前往网络安全工作组。',
    title: '网络安全生态协作',
  },
}

export function getCybersecurityPageContent(locale: Locale): CybersecurityPageContent {
  return resolve(CYBERSECURITY_CONTENT, locale)
}

export function getCybersecurityEcosystem(locale: Locale): CybersecurityEcosystem {
  return getCybersecurityPageContent(locale)
}

/** 中文权威常量：向后兼容既有引用与单测。 */
export const CYBERSECURITY_ECOSYSTEM: CybersecurityEcosystem = CYBERSECURITY_CONTENT.zh
