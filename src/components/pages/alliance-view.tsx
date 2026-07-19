import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import {
  getAllianceDirections,
  getAllianceMechanism,
  getAllianceOverview,
  getAllianceValues,
} from '@/content/alliance'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'

interface AllianceStrings {
  ctaBody: string
  ctaPrimaryAction: string
  ctaSecondaryAction: string
  ctaTitle: string
  directionsDescription: string
  directionsEyebrow: string
  directionsTitle: string
  heroDescription: string
  heroEyebrow: string
  heroPrimaryAction: string
  heroSecondaryAction: string
  heroTitle: string
  mechanismDescription: string
  mechanismEyebrow: string
  mechanismTitle: string
  positionEyebrow: string
  positionTitle: string
  valuesDescription: string
  valuesEyebrow: string
  valuesTitle: string
}

const STRINGS: Readonly<Record<Locale, AllianceStrings>> = {
  en: {
    ctaBody:
      'Organizations with relevant capabilities or needs in large-model technology, infrastructure, data, industry applications, evaluation, security governance or research can review the Alliance and working-group participation guidance. Eligibility, required materials and application availability are stated on the relevant page.',
    ctaPrimaryAction: 'View ways to participate',
    ctaSecondaryAction: 'Explore working groups',
    ctaTitle: 'Who should explore participation',
    directionsDescription:
      'These areas organize discussion and collaboration. They are not presented as completed projects or results.',
    directionsEyebrow: 'Focus areas',
    directionsTitle: 'Topics for continued collaboration',
    heroDescription:
      'The Alliance connects organizational capabilities around shared large-model technology and industry priorities, with a focus on open collaboration, security governance and practical applications.',
    heroEyebrow: 'About',
    heroPrimaryAction: 'View ways to participate',
    heroSecondaryAction: 'Explore working groups',
    heroTitle: 'About ZGCLLM',
    mechanismDescription:
      'Start with a shared topic and make participation, delivery and publication boundaries clear.',
    mechanismEyebrow: 'Collaboration model',
    mechanismTitle: 'How focused work moves forward',
    positionEyebrow: 'Our role',
    positionTitle: 'Sustained collaboration around shared questions',
    valuesDescription:
      'Shared principles guide how organizations discuss priorities and define responsibilities.',
    valuesEyebrow: 'Shared principles',
    valuesTitle: 'Principles for working together',
  },
  zh: {
    ctaBody:
      '如果贵机构在大模型技术、基础设施、数据、行业应用、评测、安全治理或相关研究方面具有明确能力或需求，可先查看联盟与工作组的参与说明。具体资格、材料和入口开放状态以相应页面为准。',
    ctaPrimaryAction: '查看参与方式',
    ctaSecondaryAction: '浏览工作组',
    ctaTitle: '适合怎样的机构参与',
    directionsDescription: '以下方向用于组织议题与协作，不代表已形成对应成果。',
    directionsEyebrow: '重点方向',
    directionsTitle: '持续开展协作的议题',
    heroDescription:
      '联盟面向大模型技术与产业协作，围绕共同议题连接机构能力，关注开放协作、安全治理与真实场景实践。',
    heroEyebrow: '联盟介绍',
    heroPrimaryAction: '查看参与方式',
    heroSecondaryAction: '查看工作组',
    heroTitle: '中关村自主大模型产业联盟',
    mechanismDescription: '以共同议题为起点，明确参与、推进和公开边界。',
    mechanismEyebrow: '协作机制',
    mechanismTitle: '专业议题如何推进',
    positionEyebrow: '联盟定位',
    positionTitle: '从共同问题出发，形成可持续协作',
    valuesDescription: '共同原则用于讨论优先事项、明确参与边界和责任分工。',
    valuesEyebrow: '共同价值',
    valuesTitle: '开展协作的基本原则',
  },
}

export function AllianceView({ locale }: { locale: Locale }): ReactElement {
  const t = STRINGS[locale]

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        actions={
          <>
            <Link className="button-primary w-full sm:w-auto" href={localizePath('/join', locale)}>
              {t.heroPrimaryAction}
            </Link>
            <Link
              className="button-secondary w-full sm:w-auto"
              href={localizePath('/working-groups', locale)}
            >
              {t.heroSecondaryAction}
            </Link>
          </>
        }
        description={t.heroDescription}
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading eyebrow={t.positionEyebrow} title={t.positionTitle} />
          <div className="mt-7 flex max-w-[70ch] flex-col gap-5">
            {getAllianceOverview(locale).map((paragraph) => (
              <p className="text-lg leading-relaxed text-[var(--text-body)]" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--subtle">
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

      <section className="block">
        <div className="site-container split">
          <SectionHeading
            description={t.mechanismDescription}
            eyebrow={t.mechanismEyebrow}
            title={t.mechanismTitle}
          />
          <ol className="grid gap-4">
            {getAllianceMechanism(locale).map((item, index) => (
              <li className="dir-item" key={item.id}>
                <span className="n">{index + 1}</span>
                <div className="body">
                  <h3 className="m-0 text-base font-semibold leading-relaxed text-[var(--text-title)]">
                    {item.title}
                  </h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="block block--subtle">
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
          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <Link className="button-primary w-full sm:w-auto" href={localizePath('/join', locale)}>
              {t.ctaPrimaryAction}
            </Link>
            <Link
              className="button-secondary w-full sm:w-auto"
              href={localizePath('/working-groups', locale)}
            >
              {t.ctaSecondaryAction}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
