import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import {
  CYBERSECURITY_ECOSYSTEM,
  CYBERSECURITY_GOVERNANCE,
  CYBERSECURITY_PARTICIPATION_PATHS,
} from '@/content/cybersecurity'

const PAGE_DESCRIPTION =
  '连接专业用户、机构伙伴、真实场景与能力评测，共建厂商中立、安全可治理、可持续演进的网络安全产业生态。'

type CybersecurityRole = (typeof CYBERSECURITY_ECOSYSTEM.roles)[number]

const ROLE_DESCRIPTIONS = {
  专业用户: '参与任务定义、专业验证与结果反馈。',
  安全企业: '提供产品经验、工具链与合规的行业需求。',
  基础模型厂商: '以开放、对等的方式参与能力验证与持续改进。',
  高校与实验室: '贡献研究方法、评测体系与专业人才。',
  行业客户: '开放经授权的业务需求，验证产品化与落地价值。',
  生态运营伙伴: '协调活动、资源与产业链协作，支持成果推广。',
} satisfies Readonly<Record<CybersecurityRole, string>>

export const metadata: Metadata = {
  alternates: {
    canonical: '/cybersecurity',
  },
  description: PAGE_DESCRIPTION,
  openGraph: {
    description: PAGE_DESCRIPTION,
    title: CYBERSECURITY_ECOSYSTEM.title,
    url: '/cybersecurity',
  },
  title: CYBERSECURITY_ECOSYSTEM.title,
}

export default function CybersecurityPage(): ReactElement {
  return (
    <main id="main-content">
      <PageHero
        actions={
          <>
            <Link className="button-primary" href="/join">
              申请生态共建
            </Link>
            <Link className="button-secondary" href="/professionals">
              专业用户加入
            </Link>
          </>
        }
        description={CYBERSECURITY_ECOSYSTEM.summary}
        eyebrow="CYBERSECURITY ECOSYSTEM"
        title={CYBERSECURITY_ECOSYSTEM.title}
      />

      <section className="site-container py-16 sm:py-20 lg:py-24">
        <SectionHeading
          description="让能力在专业验证、真实场景与合规数据之间形成可追溯、可反馈的持续循环。"
          eyebrow="SIX-STAGE CYCLE"
          title="六阶段生态闭环"
        />
        <ol
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          data-testid="ecosystem-cycle"
        >
          {CYBERSECURITY_ECOSYSTEM.cycle.map((stage, index) => (
            <li className="surface-card flex min-w-0 items-center gap-4 p-6" key={stage}>
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--alliance-bg-subtle)] text-sm font-semibold text-[var(--alliance-brand-primary)]"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-semibold text-[var(--alliance-text-title)]">{stage}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-[var(--alliance-bg-subtle)] py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <SectionHeading
            description="联盟提供开放协作的连接与治理机制，让不同专业能力在明确边界内共同发挥价值。"
            eyebrow="PARTICIPANTS"
            title="参与角色"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <article className="surface-card min-w-0 p-6">
              <p className="eyebrow">COORDINATOR</p>
              <h3 className="mt-3 text-xl font-semibold text-[var(--alliance-text-title)]">联盟</h3>
              <p className="mt-3 leading-7 text-[var(--alliance-text-secondary)]">
                组织多方协作、治理评审与公开成果的边界管理。
              </p>
            </article>
            {CYBERSECURITY_ECOSYSTEM.roles.map((role) => (
              <article className="surface-card min-w-0 p-6" key={role}>
                <h3 className="text-xl font-semibold text-[var(--alliance-text-title)]">{role}</h3>
                <p className="mt-3 leading-7 text-[var(--alliance-text-secondary)]">
                  {ROLE_DESCRIPTIONS[role]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container py-16 sm:py-20 lg:py-24">
        <SectionHeading
          description="从数据、任务和环境，到专家评测、产品化与行业场景，均可以在明确授权与责任边界后参与。"
          eyebrow="CO-CREATION"
          title="共建方向"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {CYBERSECURITY_PARTICIPATION_PATHS.map((path) => (
            <article className="surface-card min-w-0 p-7" key={path.id}>
              <h3 className="text-xl font-semibold text-[var(--alliance-text-title)]">
                {path.title}
              </h3>
              <p className="mt-3 leading-7 text-[var(--alliance-text-secondary)]">
                {path.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[var(--alliance-brand-ink)] py-16 text-[var(--alliance-text-inverse)] sm:py-20">
        <div className="site-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow text-[var(--alliance-accent-soft)]">RESPONSIBLE GOVERNANCE</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">治理边界</h2>
            <p className="mt-5 max-w-xl leading-8 text-[var(--alliance-text-inverse-muted)]">
              公开信息以生态协作和治理原则为限，不披露未经授权的敏感材料、高风险能力或可操作的攻击细节。
            </p>
          </div>
          <ul className="grid gap-4">
            {CYBERSECURITY_GOVERNANCE.map((principle) => (
              <li
                className="rounded-2xl border border-white/15 bg-white/5 p-5 leading-7 text-[var(--alliance-text-inverse-muted)]"
                key={principle}
              >
                {principle}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="site-container py-16 sm:py-20 lg:py-24"
        aria-labelledby="participate-title"
      >
        <div className="surface-card overflow-hidden p-8 sm:p-10 lg:p-14">
          <div className="max-w-3xl">
            <p className="eyebrow">开放共建</p>
            <h2
              className="mt-3 text-3xl font-semibold tracking-tight text-[var(--alliance-text-title)] sm:text-4xl"
              id="participate-title"
            >
              欢迎不同基础模型厂商与技术生态参与
            </h2>
            <p className="mt-5 leading-8 text-[var(--alliance-text-secondary)]">
              专项坚持厂商中立，不将参与资格、生态能力或共建成果归属于任何单一技术路线。
            </p>
            <ul className="mt-6 flex flex-wrap gap-3" aria-label="生态治理原则">
              {CYBERSECURITY_ECOSYSTEM.principles.map((principle) => (
                <li
                  className="rounded-full border border-[var(--alliance-border)] bg-[var(--alliance-bg-subtle)] px-4 py-2 text-sm font-medium text-[var(--alliance-text-title)]"
                  key={principle}
                >
                  {principle}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="button-primary" href="/join">
                申请生态共建
              </Link>
              <Link className="button-secondary" href="/professionals">
                专业用户加入
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
