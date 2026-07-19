import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { ExternalApplicationLink } from '@/components/site/external-application-link'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { resolveWorkingGroupApplicationUrl } from '@/config/site'
import {
  getWorkingGroupBySlug,
  getWorkingGroupSlugs,
  localizeWorkingGroup,
} from '@/content/working-groups'
import type { Locale } from '@/i18n/locales'
import { buildAlternates, localizePath } from '@/i18n/routing'
import type { WorkingGroupSummary } from '@/types/content'

interface WorkingGroupPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  return getWorkingGroupSlugs().map((slug) => ({ slug }))
}

export function createWorkingGroupMetadata(
  group: WorkingGroupSummary,
  locale: Locale = 'zh',
): Metadata {
  const localized = localizeWorkingGroup(group, locale)

  return {
    alternates: buildAlternates(`/working-groups/${group.slug}`, locale),
    description: localized.description,
    openGraph: {
      description: localized.description,
      title: localized.title,
      type: 'website',
      url: localizePath(`/working-groups/${group.slug}`, locale),
    },
    title: localized.title,
  }
}

export async function generateMetadata({ params }: WorkingGroupPageProps): Promise<Metadata> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return createWorkingGroupMetadata(group)
}

const STRINGS: Record<Locale, {
  initiativeLabel: string
  groupLabel: string
  join: string
  applyNow: string
  learnJoin: string
  viewEcosystem: string
  respEyebrow: string
  respTitle: string
  respDescription: string
  dirEyebrow: string
  dirTitle: string
  dirDescription: string
  leadsEyebrow: string
  leadsTitle: string
  leadsDescription: string
  outcomesEyebrow: string
  outcomesTitle: string
  outcomesDescription: string
  outcomesEmptyTitle: string
  outcomesEmptyBody: string
  ctaEyebrow: string
  ctaTitle: string
  ctaBody: string
  joinPrefix: string
  viewMembers: string
  viewTopic: string
}> = {
  en: {
    ctaBody:
      'Whether you come from a security enterprise, a university lab, or a frontline offense-defense and research team, you can find a place to take part here — sharing real tasks, co-building evaluation standards and advancing the deployment of self-reliant large models in cybersecurity scenarios.',
    ctaEyebrow: 'Open Co-building',
    ctaTitle: 'Join the Cybersecurity Working Group and walk alongside trusted defenders',
    dirDescription:
      'From security-oriented large models and agents to evaluation ranges and vulnerability discovery, each direction maps to real tasks that are participatory and verifiable.',
    dirEyebrow: 'Research Directions',
    dirTitle: 'Focused research and validation directions',
    groupLabel: 'Working Group',
    initiativeLabel: 'Priority Initiative',
    join: 'Join the working group',
    joinPrefix: 'Join ',
    applyNow: 'Submit an application',
    learnJoin: 'Learn how to join',
    leadsDescription:
      'Authorized responsible units are shown by name; others are described by participation role. We only disclose confirmed information.',
    leadsEyebrow: 'Leads',
    leadsTitle: 'Coordinating and co-building units',
    outcomesDescription:
      'The Alliance will keep accumulating publishable stage progress and disclose it as soon as results are officially released.',
    outcomesEmptyBody: 'More stage results will be updated after official release. Please stay tuned.',
    outcomesEmptyTitle: 'Results are being prepared',
    outcomesEyebrow: 'Stage Results',
    outcomesTitle: 'Publicly released stage results',
    respDescription:
      'The working group carries ecosystem building through a continuously running mechanism, covering the full chain from professional-user operations to release and validation.',
    respEyebrow: 'Responsibilities',
    respTitle: 'Core responsibilities advanced continuously',
    viewEcosystem: 'View cybersecurity ecosystem',
    viewMembers: 'View Working Group Partners',
    viewTopic: 'View ecosystem topic',
  },
  zh: {
    ctaBody:
      '无论你来自安全企业、高校实验室，还是一线攻防与研究团队，都能在这里找到参与的位置——共享真实任务、共建评测标准，共同推动自主大模型在网络安全场景落地。',
    ctaEyebrow: '开放共建',
    ctaTitle: '加入网络安全工作组，与可信防御者同行',
    dirDescription: '从安全大模型与智能体，到评测靶场与漏洞挖掘，每个方向都对应可参与、可验证的真实任务。',
    dirEyebrow: '研究方向',
    dirTitle: '聚焦的研究与验证方向',
    groupLabel: '工作组',
    initiativeLabel: '重点专项',
    join: '加入工作组',
    joinPrefix: '加入',
    applyNow: '提交加入申请',
    learnJoin: '了解如何加入',
    leadsDescription: '已获授权的负责单位以具名方式展示，其余按参与角色说明；我们只公开经确认的信息。',
    leadsEyebrow: '负责人',
    leadsTitle: '统筹与共建单位',
    outcomesDescription: '联盟将持续沉淀可公开的阶段性进展，并在成果正式发布后第一时间对外公开。',
    outcomesEmptyBody: '更多阶段性成果将在正式发布后陆续更新，敬请关注。',
    outcomesEmptyTitle: '成果整理中',
    outcomesEyebrow: '阶段成果',
    outcomesTitle: '对外发布的阶段性成果',
    respDescription: '工作组以持续运行的机制承接生态建设，覆盖从专业用户运营到发布验证的完整链路。',
    respEyebrow: '工作职责',
    respTitle: '持续推进的核心职责',
    viewEcosystem: '查看网络安全生态',
    viewMembers: '查看工作组共建伙伴',
    viewTopic: '查看生态专题',
  },
}

interface WorkingGroupOverviewProps {
  group: WorkingGroupSummary
  locale?: Locale
}

export function WorkingGroupOverview({
  group: raw,
  locale = 'zh',
}: WorkingGroupOverviewProps): ReactElement {
  const group = localizeWorkingGroup(raw, locale)
  const t = STRINGS[locale]
  const eyebrow = group.kind === 'initiative' ? t.initiativeLabel : t.groupLabel
  const joinHref = localizePath(`/working-groups/${group.slug}/join`, locale)
  const applicationUrl = resolveWorkingGroupApplicationUrl(raw)
  const ecosystemHref = group.ecosystemHref ? localizePath(group.ecosystemHref, locale) : undefined

  return (
    <>
      <PageHero
        actions={
          <>
            <ExternalApplicationLink
              className="btn btn--primary"
              configuredUrl={applicationUrl}
              label={t.applyNow}
            >
              {t.applyNow}
            </ExternalApplicationLink>
            <Link className="btn btn--ghost" href={joinHref}>
              {t.learnJoin}
            </Link>
            {ecosystemHref ? (
              <Link className="btn btn--ghost" href={ecosystemHref}>
                {t.viewEcosystem}
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
            description={t.respDescription}
            eyebrow={t.respEyebrow}
            title={t.respTitle}
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
            description={t.dirDescription}
            eyebrow={t.dirEyebrow}
            title={t.dirTitle}
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
            description={t.leadsDescription}
            eyebrow={t.leadsEyebrow}
            title={t.leadsTitle}
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
            description={t.outcomesDescription}
            eyebrow={t.outcomesEyebrow}
            title={t.outcomesTitle}
          />
          {group.outcomes.length === 0 ? (
            <div className="empty">
              <h3>{t.outcomesEmptyTitle}</h3>
              <p>{t.outcomesEmptyBody}</p>
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
              <p className="eyebrow">{t.ctaEyebrow}</p>
              <h2>{t.ctaTitle}</h2>
              <p>{t.ctaBody}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ExternalApplicationLink
                className="btn btn--primary"
                configuredUrl={applicationUrl}
                label={t.applyNow}
              >
                {t.applyNow}
              </ExternalApplicationLink>
              <Link className="btn btn--ghost" href={joinHref}>
                {t.learnJoin}
              </Link>
              <Link
                className="btn btn--ghost"
                href={localizePath(`/working-groups/${group.slug}/members`, locale)}
              >
                {t.viewMembers}
              </Link>
              {ecosystemHref ? (
                <Link className="btn btn--ghost" href={ecosystemHref}>
                  {t.viewTopic}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function WorkingGroupOverviewView({
  slug,
  locale,
}: {
  slug: string
  locale: Locale
}): ReactElement {
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return (
    <main id="main-content" tabIndex={-1}>
      <WorkingGroupOverview group={group} locale={locale} />
    </main>
  )
}

export default async function WorkingGroupPage({
  params,
}: WorkingGroupPageProps): Promise<ReactElement> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return <WorkingGroupOverviewView locale="zh" slug={slug} />
}
