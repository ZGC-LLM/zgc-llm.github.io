import Link from 'next/link'
import { buildAlternates } from '@/i18n/routing'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { getWorkingGroupBySlug, getWorkingGroupSlugs } from '@/content/working-groups'
import type { WorkingGroupSummary } from '@/types/content'

interface WorkingGroupPageProps {
  params: Promise<{ slug: string }>
}

// 仅预渲染 generateStaticParams 返回的 slug；未知 slug 一律 404。
export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  return getWorkingGroupSlugs().map((slug) => ({ slug }))
}

export function createWorkingGroupMetadata(group: WorkingGroupSummary): Metadata {
  return {
    alternates: buildAlternates(`/working-groups/${group.slug}`, 'zh'),
    description: group.description,
    openGraph: {
      description: group.description,
      title: group.title,
      type: 'website',
      url: `/working-groups/${group.slug}`,
    },
    title: group.title,
  }
}

export async function generateMetadata({ params }: WorkingGroupPageProps): Promise<Metadata> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return createWorkingGroupMetadata(group)
}

interface WorkingGroupOverviewProps {
  group: WorkingGroupSummary
}

export function WorkingGroupOverview({ group }: WorkingGroupOverviewProps): ReactElement {
  const eyebrow = group.kind === 'initiative' ? '重点专项' : '工作组'

  const joinHref = `/working-groups/${group.slug}/join`

  return (
    <>
      <PageHero
        actions={
          <>
            <Link className="btn btn--primary" href={joinHref}>
              加入工作组
            </Link>
            {group.ecosystemHref ? (
              <Link className="btn btn--ghost" href={group.ecosystemHref}>
                查看网络安全生态
              </Link>
            ) : null}
          </>
        }
        description={group.description}
        eyebrow={eyebrow}
        title={group.title}
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description="工作组以持续运行的机制承接生态建设，覆盖从专业用户运营到发布验证的完整链路。"
            eyebrow="工作职责"
            title="持续推进的核心职责"
          />
          <div className="grid-2">
            {group.responsibilities.map((item, index) => (
              <div className="dir-item" key={item}>
                <span className="n">{String(index + 1).padStart(2, '0')}</span>
                <b>{item}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description="从安全大模型与智能体，到评测靶场与漏洞挖掘，每个方向都对应可参与、可验证的真实任务。"
            eyebrow="研究方向"
            title="聚焦的研究与验证方向"
          />
          <div className="grid-3">
            {group.researchDirections.map((direction, index) => (
              <article className="card" key={direction}>
                <p className="card__num">{String(index + 1).padStart(2, '0')}</p>
                <h3>{direction}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description="已获授权的负责单位以具名方式展示，其余按参与角色说明；我们只公开经确认的信息。"
            eyebrow="负责人"
            title="统筹与共建单位"
          />
          <div className="grid-2">
            {group.leads.map((lead) => (
              <article className="card" key={`${lead.role}-${lead.name}`}>
                <p className="eyebrow">{lead.role}</p>
                {lead.named ? <h3>{lead.name}</h3> : <p>{lead.name}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description="联盟将持续沉淀可公开的阶段性进展，并在成果正式发布后第一时间对外公开。"
            eyebrow="阶段成果"
            title="对外发布的阶段性成果"
          />
          {group.outcomes.length === 0 ? (
            <div className="empty">
              <h3>成果整理中</h3>
              <p>更多阶段性成果将在正式发布后陆续更新，敬请关注。</p>
            </div>
          ) : (
            <div className="grid-2">
              {group.outcomes.map((outcome, index) => (
                <article className="card" key={outcome}>
                  <p className="card__num">{String(index + 1).padStart(2, '0')}</p>
                  <p>{outcome}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <div className="cta-band">
            <div>
              <p className="eyebrow">开放共建</p>
              <h2>加入网络安全工作组，与可信防御者同行</h2>
              <p>
                无论你来自安全企业、高校实验室，还是一线攻防与研究团队，都能在这里找到参与的位置——共享真实任务、共建评测标准，共同推动自主大模型在网络安全场景落地。
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link className="btn btn--primary" href={joinHref}>
                加入{group.title}
              </Link>
              <Link className="btn btn--ghost" href={`/working-groups/${group.slug}/members`}>
                查看成员名单
              </Link>
              {group.ecosystemHref ? (
                <Link className="btn btn--ghost" href={group.ecosystemHref}>
                  查看生态专题
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default async function WorkingGroupPage({
  params,
}: WorkingGroupPageProps): Promise<ReactElement> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return (
    <main id="main-content">
      <WorkingGroupOverview group={group} />
    </main>
  )
}
