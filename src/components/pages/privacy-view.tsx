import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import type { Locale } from '@/i18n/locales'

interface PrivacyStrings {
  description: string
  heroEyebrow: string
  heroTitle: string
  boundaryEyebrow: string
  boundaryTitle: string
  boundaryDescription: string
  siteCardTitle: string
  siteCardBody: string
  formCardTitle: string
  formCardBody: string
  beforeEyebrow: string
  beforeTitle: string
  beforeBody: string
  contactEyebrow: string
  contactTitle: string
  contactDescription: string
}

const STRINGS: Record<Locale, PrivacyStrings> = {
  en: {
    beforeBody:
      'External forms usually explain what information is collected, the purpose of use, how it is stored and how to get in touch. Please read carefully before submitting; the privacy notice within the form prevails, and this page does not replace it.',
    beforeEyebrow: 'Before You Submit',
    beforeTitle: 'Please confirm before submitting',
    boundaryDescription:
      'After clicking an application entry, you will be taken to an external form used by the Alliance; this page helps you understand how information is handled before and after that jump.',
    boundaryEyebrow: 'Data Boundary',
    boundaryTitle: 'Application data boundary',
    contactDescription:
      'If you have any questions about website privacy or the application entry, please contact the Alliance via the channels published on this site.',
    contactEyebrow: 'Contact Us',
    contactTitle: 'Contact the Alliance',
    description:
      'Understand how your information and privacy are handled and protected when submitting a partnership application on this site.',
    formCardBody:
      'Applications are completed through a Feishu form, an independent external service. Once you leave this site, the information you enter is received and processed by that form page.',
    formCardTitle: 'External form',
    heroEyebrow: 'Privacy',
    heroTitle: 'Privacy Notice',
    siteCardBody:
      'The website itself does not collect or store your application information, nor does it process application materials or track progress on-site.',
    siteCardTitle: 'This website',
  },
  zh: {
    beforeBody:
      '外部表单通常会说明收集哪些信息、使用目的、保存方式及联系渠道。请在提交前仔细阅读，并以表单内的隐私说明为准；本页不替代该说明。',
    beforeEyebrow: '提交前须知',
    beforeTitle: '提交前请确认',
    boundaryDescription: '点击申请入口后，您将前往联盟使用的外部表单；本页帮助您了解信息在跳转前后如何处理。',
    boundaryEyebrow: '数据边界',
    boundaryTitle: '申请数据边界',
    contactDescription: '如对官网隐私或申请入口有任何疑问，欢迎通过官网公布的联系方式咨询联盟。',
    contactEyebrow: '联系我们',
    contactTitle: '联系联盟',
    description: '了解在官网提交合作申请时，您的信息与隐私如何被处理和保护。',
    formCardBody:
      '申请通过飞书表单完成，它是独立的外部服务。离开官网后，您填写的信息由该表单页面负责接收与处理。',
    formCardTitle: '外部表单',
    heroEyebrow: '隐私保护',
    heroTitle: '隐私说明',
    siteCardBody: '官网本身不收集或存储您的申请信息，也不在站内处理申请材料或查询进度。',
    siteCardTitle: '官网',
  },
}

export function privacyStrings(locale: Locale): PrivacyStrings {
  return STRINGS[locale]
}

export function PrivacyView({ locale }: { locale: Locale }): ReactElement {
  const t = STRINGS[locale]

  return (
    <main id="main-content">
      <PageHero description={t.description} eyebrow={t.heroEyebrow} title={t.heroTitle} />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={t.boundaryDescription}
            eyebrow={t.boundaryEyebrow}
            title={t.boundaryTitle}
          />
          <div className="grid-2">
            <article className="card">
              <h3>{t.siteCardTitle}</h3>
              <p>{t.siteCardBody}</p>
            </article>
            <article className="card">
              <h3>{t.formCardTitle}</h3>
              <p>{t.formCardBody}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading eyebrow={t.beforeEyebrow} title={t.beforeTitle} />
          <div className="prose">
            <p>{t.beforeBody}</p>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={t.contactDescription}
            eyebrow={t.contactEyebrow}
            title={t.contactTitle}
          />
        </div>
      </section>
    </main>
  )
}
