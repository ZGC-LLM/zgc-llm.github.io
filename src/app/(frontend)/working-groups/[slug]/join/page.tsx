import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { ExternalApplicationLink } from '@/components/site/external-application-link'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import {
  getWorkingGroupBySlug,
  getWorkingGroupSlugs,
  localizeWorkingGroup,
} from '@/content/working-groups'
import type { Locale } from '@/i18n/locales'
import { buildAlternates } from '@/i18n/routing'
import type { WorkingGroupSummary } from '@/types/content'

interface WorkingGroupJoinPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  return getWorkingGroupSlugs().map((slug) => ({ slug }))
}

type Pair = readonly [string, string]

const STRINGS: Record<Locale, {
  applyCta: string
  pageTitle: string
  descriptionFor: (title: string) => string
  metaDescriptionFor: (title: string) => string
  ogTitleSuffix: string
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
}> = {
  en: {
    applyCta: 'Apply as a professional user',
    descriptionFor: (title) =>
      `Open to security enterprises, universities, research labs and individual professionals — learn about the value, paths and cooperation process for joining the ${title}.`,
    faq: [
      [
        'Who can apply — individuals or institutions?',
        'Both. Security enterprises, universities, labs and individual researchers are all welcome to express interest in cooperating with the working group.',
      ],
      [
        'Does applying mean formally joining?',
        'No. The form is for establishing contact; specific arrangements are confirmed by the working group.',
      ],
      [
        'What if the application channel is unavailable?',
        'If the channel is not yet open, the page will prompt you to contact the Alliance via the channels published on this site.',
      ],
    ],
    faqEyebrow: 'Answers',
    faqTitle: 'Frequently asked questions',
    metaDescriptionFor: (title) =>
      `Learn about the value, paths and application process for professional users joining the ${title}.`,
    ogTitleSuffix: ' · Join the working group',
    pageTitle: 'Join the working group',
    paths: [
      [
        'Capability validation',
        'Take part in capability testing, trusted validation and dynamic-range tasks for models and agents.',
      ],
      [
        'In-depth data and task co-building',
        'Contribute or use authorized in-depth data and tasks to support continuous accumulation.',
      ],
      [
        'Professional dissemination',
        'Join themed seminars, public events and dissemination of confirmed research results.',
      ],
    ],
    pathsDescription:
      'Choose a suitable entry point based on your research direction, technical ability and available time.',
    pathsEyebrow: 'Ways to Participate',
    pathsTitle: 'How to take part',
    process: [
      [
        'Submit a cooperation application',
        'Introduce your (or your institution’s) research direction, technical background and ways to participate via the professional-user Feishu form.',
      ],
      [
        'Communicate & match',
        'The working group confirms a suitable role and tasks based on public directions and validation conditions.',
      ],
      [
        'Join the collaboration',
        'After clarifying participation boundaries and authorization scope, formally join the working group’s topics.',
      ],
    ],
    processDescription:
      'Submitting an application expresses intent; subsequent collaboration follows the role and scope confirmed by the working group.',
    processEyebrow: 'Collaboration Process',
    processStep: 'Step',
    processTitle: 'Joining process',
    values: [
      [
        'Technical contribution',
        'Channel research, validation and engineering capability into the working group’s in-depth tasks and capability-evaluation system.',
      ],
      [
        'Topic participation',
        'Join real-scenario topics such as offense-defense, competitions and ranges, advancing them together with ecosystem partners.',
      ],
      [
        'Professional growth',
        'Accumulate professional reputation through open collaboration and peer review, with access to frontier directions and first-hand data.',
      ],
    ],
    valuesDescription:
      'Connect individual expertise with real scenarios, in-depth tasks and the capability-validation system over the long term.',
    valuesEyebrow: 'Value',
    valuesTitle: 'The value of joining',
  },
  zh: {
    applyCta: '专业用户申请',
    descriptionFor: (title) =>
      `面向安全企业、高校、科研机构与专业研究人员开放，了解加入${title}的合作价值、参与路径与申请流程。`,
    faq: [
      ['专业用户是否包含机构？', '是。既欢迎专业研究人员以个人身份参与，也欢迎安全企业、高校、实验室等机构表达合作意向。'],
      ['提交申请是否代表正式加入？', '不代表。表单用于建立联系，具体参与安排以工作组后续确认为准。'],
      ['申请通道暂不可用怎么办？', '若申请通道暂未开放，页面会提示您通过官网公布的联系方式与联盟联系。'],
    ],
    faqEyebrow: '问题解答',
    faqTitle: '常见问题',
    metaDescriptionFor: (title) => `了解专业用户加入${title}的参与价值、路径与申请流程。`,
    ogTitleSuffix: ' · 加入工作组',
    pageTitle: '加入工作组',
    paths: [
      ['能力验证', '参与模型与智能体的能力测试、可信验证及动态靶场任务。'],
      ['深度数据与任务共建', '贡献或使用经授权的深度数据与任务，支撑体系持续沉淀。'],
      ['专业传播', '参与专题研讨、公开活动及经确认的研究成果传播。'],
    ],
    pathsDescription: '可根据个人研究方向、技术能力与可投入精力选择合适的参与切入点。',
    pathsEyebrow: '参与路径',
    pathsTitle: '参与方式',
    process: [
      ['提交合作申请', '通过专业用户飞书表单介绍您（或所在机构）的研究方向、技术背景与可参与的方式。'],
      ['沟通与匹配', '工作组根据公开方向与验证条件，确认适合的参与角色与任务。'],
      ['加入协作', '明确参与边界与授权范围后，正式加入工作组相关议题。'],
    ],
    processDescription: '提交申请即表达参与意向，后续协作以工作组确认的角色与范围为准。',
    processEyebrow: '协作流程',
    processStep: '步骤',
    processTitle: '加入流程',
    values: [
      ['技术贡献', '将研究、验证与工程能力汇入工作组的深度任务与能力评测体系。'],
      ['议题参与', '加入真实场景与攻防、赛事、靶场等专项议题，与生态伙伴共同推进。'],
      ['专业成长', '在开放协作与同行评审中积累专业声誉，接触前沿方向与一手数据。'],
    ],
    valuesDescription: '让个人专业能力与真实场景、深度任务和能力验证体系形成长期连接。',
    valuesEyebrow: '参与价值',
    valuesTitle: '加入价值',
  },
}

export function createWorkingGroupJoinMetadata(
  group: WorkingGroupSummary,
  locale: Locale = 'zh',
): Metadata {
  const localized = localizeWorkingGroup(group, locale)
  const t = STRINGS[locale]
  const description = t.metaDescriptionFor(localized.title)

  return {
    alternates: buildAlternates(`/working-groups/${group.slug}/join`, locale),
    description,
    openGraph: {
      description,
      title: `${localized.title}${t.ogTitleSuffix}`,
      type: 'website',
      url: `/working-groups/${group.slug}/join`,
    },
    title: `${localized.title}${t.ogTitleSuffix}`,
  }
}

export async function generateMetadata({
  params,
}: WorkingGroupJoinPageProps): Promise<Metadata> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return createWorkingGroupJoinMetadata(group)
}

export function WorkingGroupJoinView({
  slug,
  locale,
}: {
  slug: string
  locale: Locale
}): ReactElement {
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  const t = STRINGS[locale]
  const localized = localizeWorkingGroup(group, locale)

  return (
    <main id="main-content">
      <PageHero
        actions={
          <ExternalApplicationLink className="button-primary" label={t.applyCta}>
            {t.applyCta}
          </ExternalApplicationLink>
        }
        description={t.descriptionFor(localized.title)}
        eyebrow={localized.title}
        title={t.pageTitle}
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

export default async function WorkingGroupJoinPage({
  params,
}: WorkingGroupJoinPageProps): Promise<ReactElement> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return <WorkingGroupJoinView locale="zh" slug={slug} />
}
