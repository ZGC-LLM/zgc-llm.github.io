import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { CYBERSECURITY_ECOSYSTEM } from '@/content/cybersecurity'

const PAGE_DESCRIPTION =
  '连接专业用户、机构伙伴、真实场景与能力评测，共建厂商中立、安全可治理、可持续演进的网络安全产业生态。'

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
            <Link className="btn btn--primary" href="/join">
              机构合作申请
            </Link>
            <Link className="btn btn--ghost" href="/working-groups/cybersecurity">
              查看工作组组织信息
            </Link>
          </>
        }
        description={CYBERSECURITY_ECOSYSTEM.summary}
        eyebrow="安全工作组"
        title={CYBERSECURITY_ECOSYSTEM.title}
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description="与其各方分别研究、分别验证、分别落地，不如把一次性合作沉淀为持续运行的用户网络、任务体系、评测标准与产业关系。"
            eyebrow="持续闭环"
            title="从一次性活动升级为持续运行的生态闭环"
          />
          <div className="grid-3" data-testid="ecosystem-cycle">
            {CYBERSECURITY_ECOSYSTEM.cycle.map((stage, index) => (
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
            description="联盟的价值不在于增加一个组织名称，而在于长期的资源组织能力：专业用户入口 + 模型发布渠道 + 场景验证网络 + 深度数据来源 + 行业成果平台。"
            eyebrow="关键资源"
            title="联盟连接的五类关键资源"
          />
          <div className="grid-3">
            {CYBERSECURITY_ECOSYSTEM.resources.map((resource, index) => (
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
            description="从专业用户运营到验证发布，形成可参与、可积累、可复用的长期机制。"
            eyebrow="重点行动"
            title="重点推进四项行动"
          />
          <div className="grid-2">
            {CYBERSECURITY_ECOSYSTEM.actions.map((action, index) => (
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
            description="不设置统一的数据交付要求，也不强制交付原始数据。伙伴可通过数据、任务、环境、专家、产品、评测或场景参与共建。"
            eyebrow="参与方式"
            title="多种方式参与共建"
          />
          <ul className="badges" style={{ marginTop: 36 }}>
            {CYBERSECURITY_ECOSYSTEM.contribution.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description="采用「联盟统筹、模型厂商牵引、高校指导、联合运营、伙伴共建、监管协同」，不新设复杂组织，以专项项目与联合行动方式推进。"
            eyebrow="运行机制"
            title="组织机制"
          />
          <div className="grid-2">
            {CYBERSECURITY_ECOSYSTEM.organisation.map((body) => (
              <article className="card" key={body.title}>
                <h3>{body.title}</h3>
                <p>{body.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block band-dark">
        <div className="site-container split">
          <div>
            <p className="eyebrow">责任治理</p>
            <h2>治理边界</h2>
            <p>
              公开信息以生态协作与治理原则为限，在数据合规与高风险能力治理事项上主动接受有关部门与专家指导。
            </p>
          </div>
          <ul>
            {CYBERSECURITY_ECOSYSTEM.governanceBoundaries.map((boundary) => (
              <li key={boundary}>{boundary}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block" aria-labelledby="participate-title">
        <div className="site-container">
          <div className="card" style={{ padding: 44 }}>
            <p className="eyebrow">开放共建</p>
            <h2
              id="participate-title"
              style={{
                color: 'var(--text-title)',
                fontSize: 'clamp(24px, 3vw, 32px)',
                margin: '12px 0 0',
              }}
            >
              欢迎不同基础模型厂商与技术生态参与
            </h2>
            <p
              style={{
                color: 'var(--text-muted)',
                lineHeight: 1.8,
                margin: '16px 0 0',
                maxWidth: '64ch',
              }}
            >
              网络安全工作组坚持厂商中立与对等参与，不将参与资格、生态能力或共建成果归属于任何单一技术路线，共同推动中国自主网络安全大模型与智能体体系建设。
            </p>
            <ul aria-label="生态治理原则" className="badges">
              {CYBERSECURITY_ECOSYSTEM.openPrinciples.map((principle) => (
                <li key={principle}>{principle}</li>
              ))}
            </ul>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                marginTop: 26,
              }}
            >
              <Link className="btn btn--primary" href="/join">
                机构合作申请
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
