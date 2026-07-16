import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'

const PAGE_DESCRIPTION = '说明官网访问与外部申请表单之间的数据和隐私责任边界。'

export const metadata: Metadata = {
  alternates: { canonical: '/privacy' },
  description: PAGE_DESCRIPTION,
  title: '隐私说明',
}

export default function PrivacyPage(): ReactElement {
  return (
    <main id="main-content">
      <PageHero description={PAGE_DESCRIPTION} eyebrow="PRIVACY" title="隐私说明" />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description="申请入口会将访客带到联盟配置的外部表单，本页帮助您理解跳转前后的边界。"
            eyebrow="DATA BOUNDARY"
            title="申请数据边界"
          />
          <div className="grid-2">
            <article className="card">
              <h3>官网</h3>
              <p>官网不接收、代理或存储申请数据，也不提供站内申请提交、材料处理或申请状态服务。</p>
            </article>
            <article className="card">
              <h3>外部表单</h3>
              <p>飞书表单为外部服务。离开官网后，您填写和提交的信息将由该外部服务页面承接。</p>
            </article>
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading eyebrow="BEFORE SUBMITTING" title="提交前请确认" />
          <div className="prose">
            <p>
              外部表单可能说明收集字段、使用目的、保存安排及联系渠道。请在提交前阅读相关说明，并以表单内的隐私告知为准；本页不替代该告知。
            </p>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description="如对官网隐私边界或外部申请入口有疑问，请通过官网公布的联盟联系方式咨询；正式联系信息将在发布前补充。"
            eyebrow="CONTACT"
            title="联系联盟"
          />
        </div>
      </section>
    </main>
  )
}
