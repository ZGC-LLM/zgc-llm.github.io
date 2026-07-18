import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { getCybersecurityEcosystem } from '@/content/cybersecurity'
import { getWorkingGroupBySlug, localizeWorkingGroup } from '@/content/working-groups'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'

interface CyberStrings {
  applyCta: string
  workingGroupCta: string
  heroEyebrow: string
  cycleEyebrow: string
  cycleTitle: string
  cycleDescription: string
  resourcesEyebrow: string
  resourcesTitle: string
  resourcesDescription: string
  actionsEyebrow: string
  actionsTitle: string
  actionsDescription: string
  contributionEyebrow: string
  contributionTitle: string
  contributionDescription: string
  orgEyebrow: string
  orgTitle: string
  orgDescription: string
  governanceEyebrow: string
  governanceTitle: string
  governanceBody: string
  openEyebrow: string
  openTitle: string
  openBody: string
  openPrinciplesLabel: string
}

const STRINGS: Record<Locale, CyberStrings> = {
  en: {
    actionsDescription:
      'From professional-user operations to validation and release, forming a long-term mechanism that is participatory, cumulative and reusable.',
    actionsEyebrow: 'Priority Actions',
    actionsTitle: 'Four priority actions',
    applyCta: 'Join the Alliance',
    contributionDescription:
      'No uniform data-delivery requirement and no mandatory delivery of raw data. Partners can take part through data, tasks, environments, experts, products, evaluation or scenarios.',
    contributionEyebrow: 'Ways to Participate',
    contributionTitle: 'Multiple ways to co-build',
    cycleDescription:
      'Building cybersecurity capability should not stop at a single study, validation or deployment. The working group turns scattered stage-based cooperation into a continuously running user network, task system, evaluation standards and industry relationships — a long-term mechanism that is cumulative and reusable.',
    cycleEyebrow: 'Continuous Loop',
    cycleTitle: 'From one-off campaigns to a continuously running ecosystem loop',
    governanceBody:
      'Public information is limited to ecosystem collaboration and governance principles; on data compliance and high-risk-capability governance, we proactively accept guidance from relevant authorities and experts.',
    governanceEyebrow: 'Responsible Governance',
    governanceTitle: 'Governance boundaries',
    heroEyebrow: 'Security Working Group',
    openBody:
      'The Cybersecurity Working Group upholds vendor neutrality and equal participation, and does not attribute participation eligibility, ecosystem capability or co-building results to any single technical path — jointly advancing China’s self-reliant cybersecurity large-model and agent systems.',
    openEyebrow: 'Open Co-building',
    openPrinciplesLabel: 'Ecosystem governance principles',
    openTitle: 'Different foundation-model vendors and technical ecosystems are welcome',
    orgDescription:
      'Adopting “alliance coordination, model-vendor lead, academic guidance and partner co-building” — without building a complex new organisation, advancing through dedicated projects and joint actions.',
    orgEyebrow: 'Operating Mechanism',
    orgTitle: 'Organisation mechanism',
    resourcesDescription:
      'The Alliance’s value lies not in adding another organisation name but in long-term resource-organising capability: a professional-user entry + model release channels + a scenario-validation network + in-depth data sources + an industry results platform + a professional outreach matrix.',
    resourcesEyebrow: 'Key Resources',
    resourcesTitle: 'Six categories of key resources the Alliance connects',
    workingGroupCta: 'View working-group information',
  },
  zh: {
    actionsDescription: '从专业用户运营到验证发布，形成可参与、可积累、可复用的长期机制。',
    actionsEyebrow: '重点行动',
    actionsTitle: '重点推进四项行动',
    applyCta: '加入联盟',
    contributionDescription:
      '不设置统一的数据交付要求，也不强制交付原始数据。伙伴可通过数据、任务、环境、专家、产品、评测或场景参与共建。',
    contributionEyebrow: '参与方式',
    contributionTitle: '多种方式参与共建',
    cycleDescription:
      '网络安全能力的建设，不应止步于单次研究、单次验证与单次落地。工作组把分散的阶段性合作，沉淀为持续运行的用户网络、任务体系、评测标准与产业关系，形成可积累、可复用的长期机制。',
    cycleEyebrow: '持续闭环',
    cycleTitle: '从一次性活动升级为持续运行的生态闭环',
    governanceBody:
      '公开信息以生态协作与治理原则为限，在数据合规与高风险能力治理事项上主动接受有关部门与专家指导。',
    governanceEyebrow: '责任治理',
    governanceTitle: '治理边界',
    heroEyebrow: '安全工作组',
    openBody:
      '网络安全工作组坚持厂商中立与对等参与，不将参与资格、生态能力或共建成果归属于任何单一技术路线，共同推动中国自主网络安全大模型与智能体体系建设。',
    openEyebrow: '开放共建',
    openPrinciplesLabel: '生态治理原则',
    openTitle: '欢迎不同基础模型厂商与技术生态参与',
    orgDescription:
      '采用「联盟统筹、模型厂商牵引、高校指导、伙伴共建」的协作方式，不新设复杂组织，以专项项目与联合行动方式推进。',
    orgEyebrow: '运行机制',
    orgTitle: '组织机制',
    resourcesDescription:
      '联盟的价值不在于增加一个组织名称，而在于长期的资源组织能力：专业用户入口 + 模型发布渠道 + 场景验证网络 + 深度数据来源 + 行业成果平台 + 专业传播矩阵。',
    resourcesEyebrow: '关键资源',
    resourcesTitle: '联盟连接的六类关键资源',
    workingGroupCta: '查看工作组组织信息',
  },
}

export function CybersecurityView({ locale }: { locale: Locale }): ReactElement {
  const t = STRINGS[locale]
  const eco = getCybersecurityEcosystem(locale)
  // 分工单一权威源：组织机制复用工作组 leads，避免两页各自维护导致漂移。
  const workingGroup = getWorkingGroupBySlug('cybersecurity')
  const leads = workingGroup ? localizeWorkingGroup(workingGroup, locale).leads : []

  return (
    <main id="main-content">
      <PageHero
        actions={
          <>
            <Link className="btn btn--primary" href={localizePath('/join', locale)}>
              {t.applyCta}
            </Link>
            <Link
              className="btn btn--ghost"
              href={localizePath('/working-groups/cybersecurity', locale)}
            >
              {t.workingGroupCta}
            </Link>
          </>
        }
        description={eco.summary}
        eyebrow={t.heroEyebrow}
        title={eco.title}
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={t.cycleDescription}
            eyebrow={t.cycleEyebrow}
            title={t.cycleTitle}
          />
          <div className="grid-3" data-testid="ecosystem-cycle">
            {eco.cycle.map((stage, index) => (
              <div className="dir-item" key={stage}>
                <span className="n">{String(index + 1).padStart(2, '0')}</span>
                <b>{stage}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description={t.resourcesDescription}
            eyebrow={t.resourcesEyebrow}
            title={t.resourcesTitle}
          />
          <div className="grid-3">
            {eco.resources.map((resource, index) => (
              <article className="card" key={resource.title}>
                <p className="card__num">{String(index + 1).padStart(2, '0')}</p>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={t.actionsDescription}
            eyebrow={t.actionsEyebrow}
            title={t.actionsTitle}
          />
          <div className="grid-2">
            {eco.actions.map((action, index) => (
              <article className="card" key={action.title}>
                <p className="card__num">{String(index + 1).padStart(2, '0')}</p>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description={t.contributionDescription}
            eyebrow={t.contributionEyebrow}
            title={t.contributionTitle}
          />
          <ul className="badges" style={{ marginTop: 36 }}>
            {eco.contribution.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading description={t.orgDescription} eyebrow={t.orgEyebrow} title={t.orgTitle} />
          <div className="grid-2">
            {leads.map((lead) => (
              <article className="card" key={`${lead.role}-${lead.name}`}>
                <p className="eyebrow">{lead.role}</p>
                {lead.named ? <h3>{lead.name}</h3> : <p>{lead.name}</p>}
                {lead.description ? <p>{lead.description}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block band-dark">
        <div className="site-container split">
          <div>
            <p className="eyebrow">{t.governanceEyebrow}</p>
            <h2>{t.governanceTitle}</h2>
            <p>{t.governanceBody}</p>
          </div>
          <ul>
            {eco.governanceBoundaries.map((boundary) => (
              <li key={boundary}>{boundary}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block" aria-labelledby="participate-title">
        <div className="site-container">
          <div className="card" style={{ padding: 44 }}>
            <p className="eyebrow">{t.openEyebrow}</p>
            <h2
              id="participate-title"
              style={{
                color: 'var(--text-title)',
                fontSize: 'clamp(24px, 3vw, 32px)',
                margin: '12px 0 0',
              }}
            >
              {t.openTitle}
            </h2>
            <p
              style={{
                color: 'var(--text-muted)',
                lineHeight: 1.8,
                margin: '16px 0 0',
                maxWidth: '64ch',
              }}
            >
              {t.openBody}
            </p>
            <ul aria-label={t.openPrinciplesLabel} className="badges">
              {eco.openPrinciples.map((principle) => (
                <li key={principle}>{principle}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 26 }}>
              <Link className="btn btn--primary" href={localizePath('/join', locale)}>
                {t.applyCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
