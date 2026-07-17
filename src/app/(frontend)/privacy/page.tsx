import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'

const PAGE_DESCRIPTION = '了解在官网提交合作申请时，您的信息与隐私如何被处理和保护。'

export const metadata: Metadata = {
  alternates: { canonical: '/privacy' },
  description: PAGE_DESCRIPTION,
  title: '隐私说明',
}

export default function PrivacyPage(): ReactElement {
  return (
    <main id="main-content">
      <PageHero description={PAGE_DESCRIPTION} eyebrow="隐私保护" title="隐私说明" />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description="点击申请入口后，您将前往联盟使用的外部表单；本页帮助您了解信息在跳转前后如何处理。"
            eyebrow="数据边界"
            title="申请数据边界"
          />
          <div className="grid-2">
            <article className="card">
              <h3>官网</h3>
              <p>官网本身不收集或存储您的申请信息，也不在站内处理申请材料或查询进度。</p>
            </article>
            <article className="card">
              <h3>外部表单</h3>
              <p>申请通过飞书表单完成，它是独立的外部服务。离开官网后，您填写的信息由该表单页面负责接收与处理。</p>
            </article>
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading eyebrow="提交前须知" title="提交前请确认" />
          <div className="prose">
            <p>
              外部表单通常会说明收集哪些信息、使用目的、保存方式及联系渠道。请在提交前仔细阅读，并以表单内的隐私说明为准；本页不替代该说明。
            </p>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description="如对官网隐私或申请入口有任何疑问，欢迎通过官网公布的联系方式咨询联盟。"
            eyebrow="联系我们"
            title="联系联盟"
          />
        </div>
      </section>
    </main>
  )
}
