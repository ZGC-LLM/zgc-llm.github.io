import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import {
  getAllianceDirections,
  getAllianceIntro,
  getAllianceMechanism,
  getAllianceMission,
  getAllianceValues,
} from '@/content/alliance'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'

// 页面级双语文案（chrome 与正文中的静态标题/引导语）。中文权威，英文初稿待校对。
interface AllianceStrings {
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  heroAction: string
  missionEyebrow: string
  missionTitle: string
  introEyebrow: string
  introTitle: string
  introDescription: string
  valuesEyebrow: string
  valuesTitle: string
  valuesDescription: string
  mechanismEyebrow: string
  mechanismTitle: string
  mechanismDescription: string
  directionsEyebrow: string
  directionsTitle: string
  directionsDescription: string
  ctaTitle: string
  ctaBody: string
  ctaAction: string
}

const STRINGS: Record<Locale, AllianceStrings> = {
  en: {
    ctaAction: 'Apply to become an ecosystem partner',
    ctaBody:
      'We welcome industry, research and ecosystem partners to join the Alliance and build the self-reliant large-model industry ecosystem together.',
    ctaTitle: 'Get in Touch',
    directionsDescription:
      'Starting from shared topics, we build industry collaboration that is participatory, verifiable and worth sharing.',
    directionsEyebrow: 'Focus Areas',
    directionsTitle: 'Turning shared priorities into sustained action',
    heroAction: 'Explore how to participate',
    heroDescription:
      'Bringing together the strength of self-reliant large models to build an open, secure and collaborative industry ecosystem — advancing technology innovation, industrial collaboration, real-world deployment and international cooperation.',
    heroEyebrow: 'About',
    heroTitle: 'About the Alliance',
    introDescription:
      'Connecting universities, research institutions and industry partners to help build an internationally competitive self-reliant large-model industry ecosystem.',
    introEyebrow: 'Overview',
    introTitle: 'About the Zhongguancun Self-Reliant Large Model Industry Alliance',
    mechanismDescription:
      'The Alliance coordinates priority directions, sets up working groups (such as the Cybersecurity Working Group) for specialised topics, and advances priority projects through them.',
    mechanismEyebrow: 'Organization',
    mechanismTitle: 'How We Collaborate',
    missionEyebrow: 'Mission',
    missionTitle: 'Our Purpose',
    valuesDescription:
      'Connecting different technical paths, institutional strengths and professional experience through shared principles.',
    valuesEyebrow: 'Values',
    valuesTitle: 'Shared Values',
  },
  zh: {
    ctaAction: '申请成为生态伙伴',
    ctaBody: '欢迎产业、科研与生态伙伴加入联盟，携手共建自主大模型产业生态。',
    ctaTitle: '联系与参与',
    directionsDescription: '从共同议题出发，持续形成可参与、可验证、可传播的产业协作。',
    directionsEyebrow: '重点方向',
    directionsTitle: '把共同议题转化为持续行动',
    heroAction: '了解参与方式',
    heroDescription:
      '汇聚自主大模型力量，共建开放、安全、协同的产业生态，推动技术创新、产业协同、场景落地与国际合作。',
    heroEyebrow: '关于联盟',
    heroTitle: '联盟介绍',
    introDescription: '连接高校、科研机构和产业伙伴，推动形成具有国际竞争力的自主大模型产业生态。',
    introEyebrow: '联盟简介',
    introTitle: '关于中关村自主大模型产业联盟',
    mechanismDescription:
      '联盟统筹重点方向，下设工作组（如网络安全工作组）聚焦专业议题，并依托工作组推进重点项目。',
    mechanismEyebrow: '组织方式',
    mechanismTitle: '协作机制',
    missionEyebrow: '使命',
    missionTitle: '联盟宗旨',
    valuesDescription: '以共同原则连接不同技术路线、机构能力与专业经验。',
    valuesEyebrow: '价值主张',
    valuesTitle: '共同价值',
  },
}

export function AllianceView({ locale }: { locale: Locale }): ReactElement {
  const t = STRINGS[locale]
  const joinHref = localizePath('/join', locale)

  return (
    <main id="main-content">
      <PageHero
        actions={
          <Link className="button-primary" href={joinHref}>
            {t.heroAction}
          </Link>
        }
        description={t.heroDescription}
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading eyebrow={t.missionEyebrow} title={t.missionTitle} />
          <p className="mt-7 max-w-[60ch] text-xl leading-relaxed text-[var(--text-body)]">
            {getAllianceMission(locale)}
          </p>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description={t.introDescription}
            eyebrow={t.introEyebrow}
            title={t.introTitle}
          />
          <div className="mt-7 flex max-w-[70ch] flex-col gap-5">
            {getAllianceIntro(locale).map((paragraph) => (
              <p className="text-lg leading-relaxed text-[var(--text-body)]" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={t.valuesDescription}
            eyebrow={t.valuesEyebrow}
            title={t.valuesTitle}
          />
          <div className="grid-3">
            {getAllianceValues(locale).map((value) => (
              <article className="card" key={value.id}>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container split">
          <SectionHeading
            description={t.mechanismDescription}
            eyebrow={t.mechanismEyebrow}
            title={t.mechanismTitle}
          />
          <ol className="dir-list" style={{ gridTemplateColumns: '1fr' }}>
            {getAllianceMechanism(locale).map((item, index) => (
              <li className="dir-item" key={item}>
                <span className="n">{index + 1}</span>
                <div className="body">
                  <p>{item}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={t.directionsDescription}
            eyebrow={t.directionsEyebrow}
            title={t.directionsTitle}
          />
          <div className="grid-2">
            {getAllianceDirections(locale).map(([title, description]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container">
        <div className="end-cta">
          <div>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaBody}</p>
          </div>
          <Link className="button-primary" href={joinHref}>
            {t.ctaAction}
          </Link>
        </div>
      </section>
    </main>
  )
}
