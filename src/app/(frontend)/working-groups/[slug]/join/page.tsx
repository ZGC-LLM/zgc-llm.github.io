import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { ExternalApplicationLink } from '@/components/site/external-application-link'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { getWorkingGroupBySlug, getWorkingGroupSlugs } from '@/content/working-groups'
import type { WorkingGroupSummary } from '@/types/content'

interface WorkingGroupJoinPageProps {
  params: Promise<{ slug: string }>
}

// 仅预渲染 generateStaticParams 返回的 slug；未知 slug 一律 404。
export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  return getWorkingGroupSlugs().map((slug) => ({ slug }))
}

const VALUES = [
  ['技术贡献', '将研究、验证与工程能力汇入工作组的深度任务与能力评测体系。'],
  ['议题参与', '加入真实场景与攻防、赛事、靶场等专项议题，与生态伙伴共同推进。'],
  ['专业成长', '在开放协作与同行评审中积累专业声誉，接触前沿方向与一手数据。'],
] as const

const PARTICIPATION_PATHS = [
  ['能力验证', '参与模型与智能体的能力测试、可信验证及动态靶场任务。'],
  ['深度数据与任务共建', '贡献或使用经授权的深度数据与任务，支撑体系持续沉淀。'],
  ['专业传播', '参与专题研讨、公开活动及经确认的研究成果传播。'],
] as const

const PROCESS = [
  ['提交个人申请', '通过专业用户飞书表单介绍研究方向、技术背景与可参与的方式。'],
  ['沟通与匹配', '工作组根据公开方向与验证条件，确认适合的参与角色与任务。'],
  ['加入协作', '明确参与边界与授权范围后，正式加入工作组相关议题。'],
] as const

const FAQ = [
  ['哪些专业用户可以申请？', '欢迎安全企业、高校、实验室及专业研究人员以个人身份表达参与意向。'],
  ['提交申请是否代表正式加入？', '不代表。表单用于建立联系，具体参与安排以工作组后续确认为准。'],
  ['申请通道暂不可用怎么办？', '若申请通道暂未开放，页面会提示您通过官网公布的联系方式与联盟联系。'],
] as const

export function createWorkingGroupJoinMetadata(group: WorkingGroupSummary): Metadata {
  const description = `了解专业用户加入${group.title}的参与价值、路径与申请流程。`

  return {
    alternates: { canonical: `/working-groups/${group.slug}/join` },
    description,
    openGraph: {
      description,
      title: `${group.title} · 加入工作组`,
      type: 'website',
      url: `/working-groups/${group.slug}/join`,
    },
    title: `${group.title} · 加入工作组`,
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

export default async function WorkingGroupJoinPage({
  params,
}: WorkingGroupJoinPageProps): Promise<ReactElement> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  const description = `面向专业用户开放，了解加入${group.title}的参与价值、路径与申请流程。`

  return (
    <main id="main-content">
      <PageHero
        actions={
          <ExternalApplicationLink className="button-primary" kind="professional">
            专业用户申请
          </ExternalApplicationLink>
        }
        description={description}
        eyebrow={group.title}
        title="加入工作组"
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description="让个人专业能力与真实场景、深度任务和能力验证体系形成长期连接。"
            eyebrow="参与价值"
            title="加入价值"
          />
          <div className="grid-3">
            {VALUES.map(([title, valueDescription]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{valueDescription}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description="可根据个人研究方向、技术能力与可投入精力选择合适的参与切入点。"
            eyebrow="参与路径"
            title="参与方式"
          />
          <div className="grid-3">
            {PARTICIPATION_PATHS.map(([title, pathDescription]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{pathDescription}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description="提交申请即表达参与意向，后续协作以工作组确认的角色与范围为准。"
            eyebrow="协作流程"
            title="加入流程"
          />
          <ol className="grid-3">
            {PROCESS.map(([title, processDescription], index) => (
              <li className="card" key={title}>
                <p className="eyebrow">步骤 {String(index + 1).padStart(2, '0')}</p>
                <h3>{title}</h3>
                <p>{processDescription}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading eyebrow="问题解答" title="常见问题" />
          <div className="grid-3">
            {FAQ.map(([question, answer]) => (
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
