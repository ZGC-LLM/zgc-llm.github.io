import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { ExternalApplicationLink } from '@/components/site/external-application-link'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'

const PAGE_DESCRIPTION =
  '面向关注自主大模型产业与网络安全生态的专业用户，介绍适用人群、参与方式与参与权益。'

const AUDIENCES = [
  ['技术与研究人员', '从事基础模型、人工智能工程、网络安全、数据治理或相关研究的专业人士。'],
  ['产业与场景专家', '熟悉行业需求、产品实践、合规治理或真实业务场景的从业者。'],
  ['生态贡献者', '愿意参与专业交流、议题研讨、任务验证与经验分享的个人。'],
] as const

const WAYS = [
  ['参与议题与活动', '关注公开活动与专题议题，结合专业背景参与交流和研讨。'],
  ['贡献专业反馈', '在明确授权和安全边界内，为任务定义、方案验证与结果反馈提供专业意见。'],
  ['连接协作机会', '通过联盟公开渠道了解适合个人参与的专项、研究与生态活动。'],
] as const

const BENEFITS = [
  '获取联盟公开活动、重点议题与生态进展信息',
  '与来自技术、产业、研究和应用场景的专业伙伴交流',
  '在符合授权和发布规则的前提下参与成果共创与专业贡献展示',
] as const

export const metadata: Metadata = {
  alternates: { canonical: '/professionals' },
  description: PAGE_DESCRIPTION,
  title: '专业用户加入',
}

export default function ProfessionalsPage(): ReactElement {
  return (
    <main id="main-content">
      <PageHero
        actions={
          <ExternalApplicationLink className="button-primary" kind="professional">
            专业用户加入
          </ExternalApplicationLink>
        }
        description={PAGE_DESCRIPTION}
        eyebrow="PROFESSIONAL COMMUNITY"
        title="专业用户加入"
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description="无论来自技术、研究、产业还是应用一线，都可以基于真实经验参与开放交流。"
            eyebrow="WHO CAN JOIN"
            title="适用人群"
          />
          <div className="grid-3">
            {AUDIENCES.map(([title, description]) => (
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
            description="参与内容取决于公开计划、议题需求和必要的授权边界。"
            eyebrow="WAYS TO PARTICIPATE"
            title="参与方式"
          />
          <div className="grid-3">
            {WAYS.map(([title, description]) => (
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
            description="联盟提供专业连接和公开参与机会，具体安排以各项活动或专项说明为准。"
            eyebrow="PARTICIPANT BENEFITS"
            title="参与权益"
          />
          <ol className="dir-list" style={{ gridTemplateColumns: '1fr' }}>
            {BENEFITS.map((benefit, index) => (
              <li className="dir-item" key={benefit}>
                <span className="n">{index + 1}</span>
                <div className="body">
                  <p>{benefit}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}
