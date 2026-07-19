import { resolve, type Localized } from '@/i18n/localized'
import type { Locale } from '@/i18n/locales'

export interface JoinCard {
  cta?: string
  description: string
  href?: string
  id: string
  title: string
}

export interface JoinFaqItem {
  answer: string
  id: string
  link?: {
    href: string
    label: string
  }
  question: string
}

export interface JoinProcessStep {
  description: string
  id: string
  title: string
}

export interface JoinSection<T> {
  description?: string
  eyebrow: string
  items: readonly T[]
  title: string
}

export interface AllianceJoinContent {
  applyCta: string
  faq: JoinSection<JoinFaqItem>
  heroDescription: string
  heroEyebrow: string
  heroTitle: string
  metadataDescription: string
  metadataTitle: string
  paths: JoinSection<JoinCard>
  process: JoinSection<JoinProcessStep>
  processStepLabel: string
  workingGroupsCta: string
  values: JoinSection<JoinCard>
}

const ALLIANCE_JOIN_CONTENT: Localized<AllianceJoinContent> = {
  en: {
    applyCta: 'Submit an Alliance cooperation enquiry',
    faq: {
      eyebrow: 'Questions',
      items: [
        {
          answer:
            'Visitors seeking Alliance-level cooperation or membership information. Eligible applicant types and criteria depend on confirmation by the Alliance and the current form instructions.',
          id: 'audience',
          question: 'Who should use this page?',
        },
        {
          answer:
            'The current public information does not support a general answer on this site. Membership eligibility depends on confirmation by the Alliance and the current form instructions. Individual professionals may also express interest in working-group topics; that is separate from Alliance membership.',
          id: 'individual-membership',
          link: {
            href: '/working-groups',
            label: 'Explore working-group participation',
          },
          question: 'Can an individual apply for Alliance membership?',
        },
        {
          answer:
            "No. Submission records an enquiry. Any review, follow-up or arrangement depends on the destination form's current instructions and subsequent confirmation.",
          id: 'submission-status',
          question: 'Does submission mean acceptance?',
        },
        {
          answer:
            'This site does not collect applications as a fallback. Please check this site again for updates.',
          id: 'unavailable',
          question: 'What if the channel is unavailable?',
        },
        {
          answer:
            'When available, the link opens a Feishu form. Review the notice there before submitting. Information is handled by the operator identified on the destination page; this site does not receive or store application-form data.',
          id: 'data-handling',
          question: 'How is application information handled?',
        },
      ],
      title: 'Frequently asked questions',
    },
    heroDescription:
      'This page is for cooperation and membership enquiries. Eligible applicant types, criteria and next steps depend on confirmation by the Alliance and the current instructions on the destination form. Submission does not mean acceptance or membership.',
    heroEyebrow: 'Cooperation and Membership Enquiries',
    heroTitle: 'Work with the Alliance',
    metadataDescription:
      'Choose among Alliance enquiries, the dated professional-user program, institutional ecosystem collaboration and working-group participation.',
    metadataTitle: 'Work with the Alliance',
    paths: {
      description:
        'Each path has a different audience and follow-up process. Confirm the destination before sharing any information.',
      eyebrow: 'Participation Paths',
      items: [
        {
          description:
            'For visitors seeking Alliance-level cooperation or membership information. Eligible applicant types and criteria depend on confirmation by the Alliance and the current form instructions.',
          id: 'alliance',
          title: 'Alliance cooperation and membership enquiries',
        },
        {
          cta: 'View the dated notice and status',
          description:
            'For cybersecurity organizations and individual professionals described in the July 2026 public notice. This is dated information; the application route is currently unavailable, and this site does not present the program as ongoing.',
          href: '/news/cybersecurity-open-program',
          id: 'professional-program',
          title: 'Professional-user program (dated notice)',
        },
        {
          cta: 'Review the ecosystem framework',
          description:
            "For organizations that may contribute technology, research, evaluation, tasks, scenarios or engineering resources. Review the cybersecurity topic's collaboration framework and governance boundaries before choosing a working-group path.",
          href: '/cybersecurity',
          id: 'institutional-ecosystem',
          title: 'Institutional ecosystem collaboration',
        },
        {
          cta: 'Explore working groups',
          description:
            'For organizations and individual professionals who want to contribute to a specific topic. Working-group participation is not an application for Alliance membership.',
          href: '/working-groups',
          id: 'working-groups',
          title: 'Working-group participation',
        },
      ],
      title: 'Choose the appropriate path',
    },
    process: {
      description:
        'Submitting an enquiry is the first step. Any arrangement depends on subsequent confirmation.',
      eyebrow: 'Process',
      items: [
        {
          description:
            'Decide whether your enquiry concerns Alliance cooperation, the dated professional-user program, institutional ecosystem collaboration or a working group, then review that page.',
          id: 'choose',
          title: 'Choose a path',
        },
        {
          description:
            "When available, the link opens Feishu. Review the destination form's audience, fields and data notice, then provide only necessary information.",
          id: 'submit',
          title: 'Review and submit the form',
        },
        {
          description:
            "Any follow-up, applicable path and next step depend on the destination form's current instructions and subsequently confirmed information. Submission does not mean acceptance or membership.",
          id: 'follow-up',
          title: 'Follow the current instructions',
        },
      ],
      title: 'Choose a path and submit an enquiry',
    },
    processStepLabel: 'Step',
    values: {
      description: 'Build clearly scoped collaboration around published topics.',
      eyebrow: 'Collaboration',
      items: [
        {
          description:
            'Discuss capabilities, needs and possible contributions in relation to published directions.',
          id: 'alignment',
          title: 'Topic alignment',
        },
        {
          description:
            'Explore research, validation or scenario work after goals, responsibilities and authorization boundaries are clear.',
          id: 'professional-collaboration',
          title: 'Professional collaboration',
        },
        {
          description:
            'Share publishable experience and progress after confirmation by the relevant participants.',
          id: 'public-exchange',
          title: 'Public exchange',
        },
      ],
      title: 'What collaboration can support',
    },
    workingGroupsCta: 'Explore working-group participation',
  },
  zh: {
    applyCta: '提交联盟合作意向',
    faq: {
      eyebrow: '问题解答',
      items: [
        {
          answer:
            '希望了解联盟层面合作或入盟安排的访客。具体申请主体与资格以联盟确认及目标表单当前说明为准。',
          id: 'audience',
          question: '谁适合使用本页？',
        },
        {
          answer:
            '当前公开信息不足以在官网作统一判断。会员资格以联盟确认及目标表单当前说明为准；个人专业人士也可查看工作组参与页面，提交议题合作意向，后者不等同于联盟会员申请。',
          id: 'individual-membership',
          link: {
            href: '/working-groups',
            label: '查看工作组参与方式',
          },
          question: '个人可以申请联盟会员吗？',
        },
        {
          answer: '不代表。提交仅用于表达意向和建立后续沟通，具体安排以确认信息为准。',
          id: 'submission-status',
          question: '提交是否代表正式加入？',
        },
        {
          answer: '本站不代收申请信息。请稍后查看官网更新。',
          id: 'unavailable',
          question: '申请通道暂不可用怎么办？',
        },
        {
          answer:
            '入口开放时将前往飞书表单。提交前请阅读目标表单说明；信息由目标页面所示运营方处理，本站不接收或保存申请表单数据。',
          id: 'data-handling',
          question: '申请信息如何处理？',
        },
      ],
      title: '常见问题',
    },
    heroDescription:
      '本页用于提交合作或入盟意向。具体申请主体、资格条件和后续安排，以联盟确认及目标表单当前说明为准；提交不代表接纳、获得会员资格或正式加入。',
    heroEyebrow: '合作与入盟意向',
    heroTitle: '参与联盟协作',
    metadataDescription:
      '了解联盟合作与入盟意向、专业用户计划、机构生态共建和工作组参与四类路径，以及各自的当前状态与信息边界。',
    metadataTitle: '参与联盟协作',
    paths: {
      description: '不同入口对应不同对象和后续流程。请先确认目标，再提交必要信息。',
      eyebrow: '参与路径',
      items: [
        {
          description:
            '适合希望了解联盟层面合作或入盟安排的访客。申请主体与资格以联盟确认及目标表单当前说明为准。',
          id: 'alliance',
          title: '联盟合作与入盟意向',
        },
        {
          cta: '查看计划与当前状态',
          description:
            '面向 2026 年 7 月公开信息所列的网络安全相关机构与个人专业人士。该计划为有日期的历史信息，申请入口当前不可用，本站不将其表述为持续开放的计划。',
          href: '/news/cybersecurity-open-program',
          id: 'professional-program',
          title: '专业用户计划（时点信息）',
        },
        {
          cta: '查看生态共建框架',
          description:
            '面向可提供技术、研究、评测、任务、场景或工程资源的机构。请先查看网络安全专题的协作框架与治理边界，再选择具体工作组参与方式。',
          href: '/cybersecurity',
          id: 'institutional-ecosystem',
          title: '机构生态共建',
        },
        {
          cta: '查看工作组',
          description:
            '适合希望以机构能力或个人专业经验参与具体议题的访客；参与工作组不等同于申请联盟会员资格。',
          href: '/working-groups',
          id: 'working-groups',
          title: '工作组议题参与',
        },
      ],
      title: '选择适合的参与路径',
    },
    process: {
      description: '提交意向只是第一步，具体安排以确认信息为准。',
      eyebrow: '参与流程',
      items: [
        {
          description:
            '判断是联盟合作、专业用户计划、机构生态共建还是工作组参与，并查看对应页面说明。',
          id: 'choose',
          title: '确认参与路径',
        },
        {
          description:
            '入口开放时将前往飞书。提交前请阅读目标表单的对象、字段和信息处理说明，仅提供必要信息。',
          id: 'submit',
          title: '阅读并提交表单',
        },
        {
          description:
            '后续是否联系、适用路径与下一步，以目标表单说明及后续确认信息为准；提交不代表接纳、会员资格或正式加入。',
          id: 'follow-up',
          title: '以后续确认信息为准',
        },
      ],
      title: '从选择入口到确认后续安排',
    },
    processStepLabel: '步骤',
    values: {
      description: '围绕公开议题建立清楚、可确认的协作关系。',
      eyebrow: '协作价值',
      items: [
        {
          description: '围绕公开方向，交流能力、需求与可参与资源。',
          id: 'alignment',
          title: '议题对接',
        },
        {
          description: '在目标、职责和授权边界明确后，探索研究、验证或场景合作。',
          id: 'professional-collaboration',
          title: '专业协作',
        },
        {
          description: '在相关参与方确认后，交流可公开的经验与阶段信息。',
          id: 'public-exchange',
          title: '公开交流',
        },
      ],
      title: '协作可以支持什么',
    },
    workingGroupsCta: '查看工作组参与方式',
  },
}

export interface WorkingGroupJoinContent {
  applyCta: string
  detailCta: string
  faq: JoinSection<JoinFaqItem>
  heroDescriptionFor: (title: string) => string
  metadataDescriptionFor: (title: string) => string
  metadataTitleFor: (title: string) => string
  pageTitle: string
  participation: JoinSection<JoinCard>
  process: JoinSection<JoinProcessStep>
  processStepLabel: string
  requirements: JoinSection<JoinCard>
}

const WORKING_GROUP_JOIN_CONTENT: Localized<WorkingGroupJoinContent> = {
  en: {
    applyCta: 'Submit working-group interest',
    detailCta: 'Review the working-group scope',
    faq: {
      eyebrow: 'Questions',
      items: [
        {
          answer:
            'Security organizations, universities, laboratories, other organizations and individual professionals whose work relates to the published scope may express interest. Specific criteria depend on the current destination form instructions and subsequent confirmation.',
          id: 'audience',
          question: 'Who may express interest?',
        },
        {
          answer:
            'No. This page is only for working-group topic collaboration. Use the Alliance cooperation page for Alliance-level cooperation or membership enquiries; eligibility still depends on confirmation by the Alliance and the destination form instructions.',
          id: 'membership',
          link: {
            href: '/join',
            label: 'Work with the Alliance',
          },
          question: 'Is this an Alliance membership application?',
        },
        {
          answer:
            "No. Submission records an expression of interest. Any review, follow-up, topic, role or arrangement depends on the destination form's current instructions and subsequent confirmation.",
          id: 'joining-status',
          question: 'Does submission mean that I have joined?',
        },
        {
          answer:
            'This site does not collect participation information as a fallback. Please check this site again for updates.',
          id: 'unavailable',
          question: 'What if the channel is unavailable?',
        },
        {
          answer:
            'Any fees, resource commitments or other conditions, if applicable, will be stated when a specific project or task is confirmed. This site makes no general commitment.',
          id: 'fees',
          question: 'Are there fees?',
        },
        {
          answer:
            'Do not provide raw sensitive data, credentials or actionable attack details in the initial submission. Any later use of data or tasks requires confirmation of necessity, legal basis, authorization scope and security boundaries. The submitting party remains responsible for the lawful source and authorization of its contribution.',
          id: 'data-and-tasks',
          question: 'How are data and tasks handled?',
        },
      ],
      title: 'Frequently asked questions',
    },
    heroDescriptionFor: (title) =>
      `Participation in the ${title} is intended for organizations and individual professionals with relevant topics, expertise or scenario resources. It is not an application for Alliance membership. Roles, eligibility and next steps depend on the current destination form instructions and subsequent confirmation.`,
    metadataDescriptionFor: (title) =>
      `See who can contribute to the ${title}, what to prepare and what to check before opening the external form.`,
    metadataTitleFor: (title) => `Contribute to the ${title}`,
    pageTitle: 'Contribute to the working group',
    participation: {
      description:
        'Propose a contribution based on relevant capabilities and available resources. An expression of interest does not guarantee a task or role.',
      eyebrow: 'Contribution Options',
      items: [
        {
          description:
            'Contribute ideas on research methods, evaluation design, result review or professional feedback.',
          id: 'research',
          title: 'Research and evaluation',
        },
        {
          description:
            'Describe a task need, test environment or application scenario that may be discussed. Do not provide raw sensitive data in the initial submission.',
          id: 'tasks',
          title: 'Tasks and scenarios',
        },
        {
          description:
            'Propose work on tool adaptation, product validation, technical discussion or confirmed public exchange.',
          id: 'engineering',
          title: 'Engineering and exchange',
        },
      ],
      title: 'Ways you can contribute',
    },
    process: {
      description:
        'The form records an expression of interest. Whether collaboration proceeds, and within what scope, depends on subsequent confirmation.',
      eyebrow: 'Process',
      items: [
        {
          description:
            "Confirm the destination form's current audience, required fields and data notice.",
          id: 'review',
          title: 'Review the form instructions',
        },
        {
          description:
            'When available, the link opens a Feishu form. Provide only necessary information. Information is handled by the operator identified on the destination page; this site does not receive or store application-form data.',
          id: 'submit',
          title: 'Submit your interest',
        },
        {
          description:
            "Any follow-up, relevant topic, role and boundary depend on the destination form's current instructions and subsequently confirmed information. Submission does not mean acceptance or formal participation.",
          id: 'follow-up',
          title: 'Follow the current instructions',
        },
      ],
      title: 'Participation process',
    },
    processStepLabel: 'Step',
    requirements: {
      description:
        'Provide only the information needed to assess a possible collaboration, and make sure you have the right to provide it.',
      eyebrow: 'Before You Submit',
      items: [
        {
          description:
            'Explain how your area relates to the published scope and what problem you want to address.',
          id: 'relevance',
          title: 'Topic relevance',
        },
        {
          description:
            'Do not submit credentials, raw sensitive data or actionable attack details.',
          id: 'information-boundary',
          title: 'Information boundary',
        },
        {
          description:
            'The submitting party is responsible for confirming the lawful source, necessary authorization and permitted use of any information provided.',
          id: 'authorization',
          title: 'Rights and authorization',
        },
      ],
      title: 'Before you submit',
    },
  },
  zh: {
    applyCta: '提交工作组参与意向',
    detailCta: '查看工作组范围',
    faq: {
      eyebrow: '问题解答',
      items: [
        {
          answer:
            '与公开方向相关的安全企业、高校、实验室、其他机构及个人专业人士均可表达合作意向；具体条件以工作组确认及目标表单当前说明为准。',
          id: 'audience',
          question: '哪些人可以提交参与意向？',
        },
        {
          answer:
            '不等同。本页仅用于工作组议题合作意向。联盟层面的合作或入盟意向请前往联盟合作页面，具体资格仍以联盟确认及目标表单说明为准。',
          id: 'membership',
          link: {
            href: '/join',
            label: '参与联盟协作',
          },
          question: '这是否等同于申请联盟会员？',
        },
        {
          answer: '不代表。提交用于建立后续沟通，具体议题、角色和安排需另行确认。',
          id: 'joining-status',
          question: '提交后是否代表加入工作组？',
        },
        {
          answer: '本站不代收参与信息。请稍后查看官网更新。',
          id: 'unavailable',
          question: '参与通道暂不可用怎么办？',
        },
        {
          answer:
            '费用、资源投入或其他条件，如适用，将在具体项目或任务确认时说明；本站不作统一承诺。',
          id: 'fees',
          question: '参与是否收费？',
        },
        {
          answer:
            '初次提交请勿提供原始敏感数据、密钥或可操作攻击细节。后续如需使用数据或任务，应先确认必要性、权利基础、授权范围和安全边界；提交方对其提供内容的合法来源与授权负责。',
          id: 'data-and-tasks',
          question: '数据与任务如何处理？',
        },
      ],
      title: '常见问题',
    },
    heroDescriptionFor: (title) =>
      `${title}参与路径面向具备相关议题、专业能力或场景资源的机构与个人专业人士。本页不是联盟会员资格申请；具体参与角色、条件与安排，以工作组确认及目标表单当前说明为准。`,
    metadataDescriptionFor: (title) =>
      `了解${title}参与对象、可贡献方式、提交条件、外部表单边界与后续流程。`,
    metadataTitleFor: (title) => `${title}｜参与工作组`,
    pageTitle: '参与工作组',
    participation: {
      description: '可根据自身能力与可提供资源提出合作方向；提交意向不保证获得具体任务或角色。',
      eyebrow: '贡献方式',
      items: [
        {
          description: '围绕研究方法、评测设计、结果复核或专业反馈提出建议。',
          id: 'research',
          title: '研究与评测',
        },
        {
          description: '说明可讨论的任务需求、测试环境或应用场景；初次提交无需提供原始敏感数据。',
          id: 'tasks',
          title: '任务与场景',
        },
        {
          description: '围绕工具适配、产品验证、技术研讨或经确认的公开交流提出合作意向。',
          id: 'engineering',
          title: '工程与交流',
        },
      ],
      title: '可以如何贡献',
    },
    process: {
      description: '表单用于收集参与意向；后续是否开展协作及具体范围，以沟通确认结果为准。',
      eyebrow: '参与流程',
      items: [
        {
          description: '确认目标表单当前面向的对象、所需字段与信息处理说明。',
          id: 'review',
          title: '查看表单说明',
        },
        {
          description:
            '入口开放时将前往飞书表单。请只提供必要信息；信息由目标页面所示运营方处理，本站不接收或保存申请表单数据。',
          id: 'submit',
          title: '提交参与意向',
        },
        {
          description:
            '后续是否联系以及适用议题、角色与边界，以目标表单说明及后续确认信息为准；提交不代表接纳或正式参与。',
          id: 'follow-up',
          title: '以后续确认信息为准',
        },
      ],
      title: '参与流程',
    },
    processStepLabel: '步骤',
    requirements: {
      description: '只提交判断合作方向所必需的信息，并确认自身有权提供。',
      eyebrow: '提交准备',
      items: [
        {
          description: '说明关注方向与工作组公开范围的关系，以及希望解决的问题。',
          id: 'relevance',
          title: '议题相关性',
        },
        {
          description: '请勿提交密钥、原始敏感数据或可操作攻击细节。',
          id: 'information-boundary',
          title: '信息边界',
        },
        {
          description: '提交方应确认所提供内容的合法来源、必要授权与可使用范围。',
          id: 'authorization',
          title: '权利与授权',
        },
      ],
      title: '提交前请确认',
    },
  },
}

export function getAllianceJoinContent(locale: Locale): AllianceJoinContent {
  return resolve(ALLIANCE_JOIN_CONTENT, locale)
}

export function getWorkingGroupJoinContent(locale: Locale): WorkingGroupJoinContent {
  return resolve(WORKING_GROUP_JOIN_CONTENT, locale)
}
