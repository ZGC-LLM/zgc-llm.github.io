import type { ReactElement } from 'react'

import { ExternalApplicationLink } from '@/components/site/external-application-link'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import type { Locale } from '@/i18n/locales'

type Pair = readonly [string, string]

interface JoinStrings {
  description: string
  heroEyebrow: string
  heroTitle: string
  applyCta: string
  valuesEyebrow: string
  valuesTitle: string
  valuesDescription: string
  values: readonly Pair[]
  pathsEyebrow: string
  pathsTitle: string
  pathsDescription: string
  paths: readonly Pair[]
  processEyebrow: string
  processTitle: string
  processDescription: string
  processStep: string
  process: readonly Pair[]
  faqEyebrow: string
  faqTitle: string
  faq: readonly Pair[]
}

const STRINGS: Record<Locale, JoinStrings> = {
  en: {
    applyCta: 'Partner with Us',
    description:
      'Learn about the value, ways to participate, collaboration process and FAQs for institutions joining the Alliance ecosystem.',
    faq: [
      [
        'Which institutions can take part?',
        'Industry partners across models, chips, computing power, data, platforms and industry applications, as well as universities and research institutions, are all welcome to discuss cooperation.',
      ],
      [
        'Does submitting the form mean formally joining?',
        'No. The form is only for establishing initial contact with the Alliance; specific arrangements are confirmed through follow-up communication.',
      ],
      [
        'Can individuals join the Alliance?',
        'Alliance members are all organisations; individuals cannot join directly, but individual professionals can participate through programmes open to professional users, such as the Cybersecurity Working Group.',
      ],
    ],
    faqEyebrow: 'Answers',
    faqTitle: 'Frequently asked questions',
    heroEyebrow: 'Institutional Participation',
    heroTitle: 'Institutional Ecosystem Co-building',
    paths: [
      [
        'Dedicated co-building',
        'Take part in working groups, priority projects and themed activities based on institutional capabilities.',
      ],
      [
        'Scenario collaboration',
        'After necessary authorization and boundary confirmation, jointly define needs, validate solutions and summarise experience.',
      ],
      [
        'Research & dissemination',
        'Participate in industry research, standards discussions, public events and dissemination of confirmed results.',
      ],
    ],
    pathsDescription:
      'Choose a suitable entry point based on institutional positioning, expertise and resources.',
    pathsEyebrow: 'Ways to Participate',
    pathsTitle: 'How to take part',
    process: [
      [
        'Submit cooperation intent',
        'Introduce your organisation, areas of interest and possible ways to cooperate via the institutional Feishu form.',
      ],
      [
        'Communicate & match',
        'The Alliance further confirms a suitable participation path based on public directions and collaboration conditions.',
      ],
      [
        'Start collaboration',
        'Once goals, responsibilities, authorization and compliance boundaries are clear, co-building proceeds as agreed.',
      ],
    ],
    processDescription:
      'Submitting an application expresses cooperation intent; subsequent collaboration follows the goals and scope confirmed by both parties.',
    processEyebrow: 'Collaboration Process',
    processStep: 'Step',
    processTitle: 'Participation process',
    valuesDescription:
      'Connect institutional capabilities with industry topics, real scenarios and ecosystem partners over the long term.',
    valuesEyebrow: 'Value',
    valuesTitle: 'Co-building value',
    values: [
      [
        'Industry connection',
        'Connect the strengths of models, chips, computing power, data, platforms and industry applications with research institutions and industry partners to foster cross-domain collaboration.',
      ],
      [
        'Joint innovation',
        'Organise exchange, research, validation and dissemination around clear topics, pooling complementary capabilities.',
      ],
      [
        'Ecosystem co-creation',
        'Build a sustainable industry ecosystem within the boundaries of openness, vendor neutrality and compliant governance.',
      ],
    ],
  },
  zh: {
    applyCta: '机构合作申请',
    description: '了解机构参与联盟生态共建的合作价值、参与方式、协作流程与常见问题。',
    faq: [
      ['哪些机构可以参与？', '模型、芯片、算力、数据、平台及行业应用等产业伙伴，以及高校与科研机构，都欢迎与联盟洽谈合作。'],
      ['提交表单代表正式加入吗？', '不代表。表单仅用于与联盟建立初步联系，具体合作安排以双方后续沟通确认为准。'],
      ['个人可以加入联盟吗？', '联盟会员均为单位会员，个人无法直接入盟；但个人专业用户可通过网络安全工作组等面向专业用户开放的计划参与。'],
    ],
    faqEyebrow: '问题解答',
    faqTitle: '常见问题',
    heroEyebrow: '机构参与',
    heroTitle: '机构生态共建',
    paths: [
      ['专项共建', '结合机构能力参与工作组、重点项目及专题活动。'],
      ['场景协作', '在完成必要授权和边界确认后，共同定义需求、验证方案与总结经验。'],
      ['研究与传播', '参与产业研究、标准研讨、公开活动及经确认的成果传播。'],
    ],
    pathsDescription: '可根据机构定位、专业能力与资源条件选择合适的协作切入点。',
    pathsEyebrow: '参与路径',
    pathsTitle: '参与方式',
    process: [
      ['提交合作意向', '通过机构飞书表单介绍机构情况、关注方向与可参与的合作方式。'],
      ['沟通与匹配', '联盟根据公开方向与协作条件，与机构进一步确认适合的参与路径。'],
      ['启动协作', '双方明确目标、职责、授权及合规边界后，按约定开展共建。'],
    ],
    processDescription: '提交申请即表达合作意向，后续协作以双方确认的目标与范围为准。',
    processEyebrow: '协作流程',
    processStep: '步骤',
    processTitle: '参与流程',
    valuesDescription: '让机构能力与产业议题、真实场景和生态伙伴形成长期连接。',
    valuesEyebrow: '参与价值',
    valuesTitle: '共建价值',
    values: [
      ['产业连接', '连接模型、芯片、算力、数据、平台及行业应用力量与科研机构、产业伙伴，促进跨领域协作。'],
      ['联合创新', '围绕明确议题组织交流、研究、验证与成果传播，汇聚互补能力。'],
      ['生态共创', '在开放、厂商中立与合规治理的边界内，共建可持续的产业生态。'],
    ],
  },
}

export function JoinView({ locale }: { locale: Locale }): ReactElement {
  const t = STRINGS[locale]

  return (
    <main id="main-content">
      <PageHero
        actions={
          <ExternalApplicationLink className="button-primary" label={t.applyCta}>
            {t.applyCta}
          </ExternalApplicationLink>
        }
        description={t.description}
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={t.valuesDescription}
            eyebrow={t.valuesEyebrow}
            title={t.valuesTitle}
          />
          <div className="grid-3">
            {t.values.map(([title, description]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description={t.pathsDescription}
            eyebrow={t.pathsEyebrow}
            title={t.pathsTitle}
          />
          <div className="grid-3">
            {t.paths.map(([title, description]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={t.processDescription}
            eyebrow={t.processEyebrow}
            title={t.processTitle}
          />
          <ol className="grid-3">
            {t.process.map(([title, description], index) => (
              <li className="card" key={title}>
                <p className="eyebrow">
                  {t.processStep} {String(index + 1).padStart(2, '0')}
                </p>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading eyebrow={t.faqEyebrow} title={t.faqTitle} />
          <div className="grid-3">
            {t.faq.map(([question, answer]) => (
              <article className="card" key={question}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
