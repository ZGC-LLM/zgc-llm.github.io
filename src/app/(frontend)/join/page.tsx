import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { ExternalApplicationLink } from '@/components/site/external-application-link'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'

const PAGE_DESCRIPTION =
  '了解机构参与联盟生态共建的合作价值、参与方式、协作流程与常见问题。'

const VALUES = [
  ['产业连接', '连接模型、芯片、算力、数据、平台及行业应用力量与科研机构、产业伙伴，促进跨领域协作。'],
  ['联合创新', '围绕明确议题组织交流、研究、验证与成果传播，汇聚互补能力。'],
  ['生态共创', '在开放、厂商中立与合规治理的边界内，共建可持续的产业生态。'],
] as const

const PARTICIPATION_PATHS = [
  ['专项共建', '结合机构能力参与工作组、重点项目及专题活动。'],
  ['场景协作', '在完成必要授权和边界确认后，共同定义需求、验证方案与总结经验。'],
  ['研究与传播', '参与产业研究、标准研讨、公开活动及经确认的成果传播。'],
] as const

const PROCESS = [
  ['提交合作意向', '通过机构飞书表单介绍机构情况、关注方向与可参与的合作方式。'],
  ['沟通与匹配', '联盟根据公开方向与协作条件，与机构进一步确认适合的参与路径。'],
  ['启动协作', '双方明确目标、职责、授权及合规边界后，按约定开展共建。'],
] as const

const FAQ = [
  ['哪些机构可以参与？', '模型、芯片、算力、数据、平台及行业应用等产业伙伴，以及高校与科研机构，都欢迎与联盟洽谈合作。'],
  ['提交表单代表正式加入吗？', '不代表。表单仅用于与联盟建立初步联系，具体合作安排以双方后续沟通确认为准。'],
  ['个人可以加入联盟吗？', '联盟会员均为单位会员，个人无法直接入盟；但个人专业用户可通过网络安全工作组等面向专业用户开放的计划参与。'],
] as const

export const metadata: Metadata = {
  alternates: { canonical: '/join' },
  description: PAGE_DESCRIPTION,
  title: '机构生态共建',
}

export default function JoinPage(): ReactElement {
  return (
    <main id="main-content">
      <PageHero
        actions={
          <ExternalApplicationLink className="button-primary" kind="institution">
            机构合作申请
          </ExternalApplicationLink>
        }
        description={PAGE_DESCRIPTION}
        eyebrow="机构参与"
        title="机构生态共建"
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description="让机构能力与产业议题、真实场景和生态伙伴形成长期连接。"
            eyebrow="参与价值"
            title="共建价值"
          />
          <div className="grid-3">
            {VALUES.map(([title, description]) => (
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
            description="可根据机构定位、专业能力与资源条件选择合适的协作切入点。"
            eyebrow="参与路径"
            title="参与方式"
          />
          <div className="grid-3">
            {PARTICIPATION_PATHS.map(([title, description]) => (
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
            description="申请入口承接合作意向，后续协作以双方确认的目标与边界为准。"
            eyebrow="协作流程"
            title="参与流程"
          />
          <ol className="grid-3">
            {PROCESS.map(([title, description], index) => (
              <li className="card" key={title}>
                <p className="eyebrow">步骤 {String(index + 1).padStart(2, '0')}</p>
                <h3>{title}</h3>
                <p>{description}</p>
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
