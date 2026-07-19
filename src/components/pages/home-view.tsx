import Link from 'next/link'
import type { ReactElement } from 'react'

import { SectionHeading } from '@/components/site/section-heading'
import { getSiteName } from '@/config/site'
import {
  getHomeFocusAreas,
  getHomeParticipationPaths,
  getHomeTrustPrinciples,
} from '@/content/home'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'

interface HomeStrings {
  endBody: string
  endPrimaryAction: string
  endSecondaryAction: string
  endTitle: string
  focusDescription: string
  focusEyebrow: string
  focusTitle: string
  glass1Key: string
  glass1Tags: readonly string[]
  glass1Value: string
  glass2Key: string
  glass2Tags: readonly string[]
  glass2Value: string
  heroLead: string
  heroPrimaryAction: string
  heroSecondaryAction: string
  heroTitle: string
  participationDescription: string
  participationEyebrow: string
  participationTitle: string
  trustDescription: string
  trustEyebrow: string
  trustTitle: string
}

const STRINGS: Readonly<Record<Locale, HomeStrings>> = {
  en: {
    endBody:
      'Review the participation guidance and current availability, then choose the relevant Alliance or working-group path.',
    endPrimaryAction: 'View ways to participate',
    endSecondaryAction: 'Explore working groups',
    endTitle: 'Start with the path that fits your organization',
    focusDescription:
      'The Alliance groups its focus into technology, industry and governance topics that organizations can explore together.',
    focusEyebrow: 'Focus areas',
    focusTitle: 'Shared priorities for practical collaboration',
    glass1Key: 'Alliance focus',
    glass1Tags: ['Technology', 'Industry', 'Applications', 'Security'],
    glass1Value: 'Technology and industry collaboration around shared priorities',
    glass2Key: 'Explore',
    glass2Tags: ['About', 'Working groups', 'Members', 'Participation'],
    glass2Value:
      "From the Alliance's role to working groups, member information and ways to participate",
    heroLead:
      "ZGCLLM focuses on technology, industry coordination, practical applications and security governance. This site presents the Alliance's priorities, public information and ways for organizations to participate.",
    heroPrimaryAction: 'View ways to participate',
    heroSecondaryAction: 'About the Alliance',
    heroTitle: 'Open, secure collaboration for large-model technology and industry',
    participationDescription:
      'For organizations interested in collaboration on large-model technology, industry applications or security governance. Eligibility, required materials and application availability are stated on the relevant page.',
    participationEyebrow: 'Ways to participate',
    participationTitle: 'Clear paths for organizations',
    trustDescription:
      'The Alliance promotes collaboration around defined questions and publishes related information after reviewing its source and authorization.',
    trustEyebrow: 'Collaboration principles',
    trustTitle: 'Trust through clear goals and responsibilities',
  },
  zh: {
    endBody: '先查看参与说明与入口状态，再选择联盟或工作组的协作方式。',
    endPrimaryAction: '查看参与方式',
    endSecondaryAction: '浏览工作组',
    endTitle: '从适合贵机构的路径开始',
    focusDescription: '从技术、产业与治理三个层面，识别适合跨机构协作的议题。',
    focusEyebrow: '联盟关注',
    focusTitle: '聚焦可共同推进的问题',
    glass1Key: '联盟关注',
    glass1Tags: ['技术创新', '产业协同', '场景实践', '安全治理'],
    glass1Value: '围绕共同议题组织技术与产业协作',
    glass2Key: '浏览路径',
    glass2Tags: ['联盟介绍', '工作组', '成员信息', '参与方式'],
    glass2Value: '从联盟定位到工作组、成员信息与参与方式',
    heroLead:
      '中关村自主大模型产业联盟聚焦技术创新、产业协同、场景实践与安全治理。本网站集中呈现联盟方向、公开信息与机构参与路径。',
    heroPrimaryAction: '查看参与方式',
    heroSecondaryAction: '了解联盟',
    heroTitle: '连接大模型技术与产业力量，推动开放、安全、务实的协作',
    participationDescription:
      '适合希望围绕大模型技术、产业应用或安全治理开展协作的机构。具体资格、材料要求与入口状态以相应页面为准。',
    participationEyebrow: '参与路径',
    participationTitle: '为机构伙伴提供清晰入口',
    trustDescription: '联盟倡导围绕明确问题开展协作，并在确认来源与授权后公开相关信息。',
    trustEyebrow: '协作原则',
    trustTitle: '以清晰目标和责任边界建立信任',
  },
}

export function HomeView({ locale }: { locale: Locale }): ReactElement {
  const t = STRINGS[locale]

  return (
    <main id="main-content">
      <section className="hero page-hero">
        <div className="hero__inner site-container">
          <div>
            <p className="eyebrow">{getSiteName(locale)}</p>
            <h1>{t.heroTitle}</h1>
            <p className="hero__lead">{t.heroLead}</p>
            <div className="hero__cta">
              <Link
                className="btn btn--primary w-full sm:w-auto"
                href={localizePath('/join', locale)}
              >
                {t.heroPrimaryAction}
              </Link>
              <Link
                className="btn btn--ghost w-full sm:w-auto"
                href={localizePath('/alliance', locale)}
              >
                {t.heroSecondaryAction}
              </Link>
            </div>
          </div>

          <div className="hero__cards">
            <div className="glass">
              <p className="glass__k">{t.glass1Key}</p>
              <p className="glass__v">{t.glass1Value}</p>
              <ul className="glass__tags">
                {t.glass1Tags.map((tag) => (
                  <li className="glass__tag" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass">
              <p className="glass__k">{t.glass2Key}</p>
              <p className="glass__v">{t.glass2Value}</p>
              <ul className="glass__tags">
                {t.glass2Tags.map((tag) => (
                  <li className="glass__tag" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={t.focusDescription}
            eyebrow={t.focusEyebrow}
            title={t.focusTitle}
          />
          <div className="grid-3">
            {getHomeFocusAreas(locale).map((item, index) => (
              <article className="card" key={item.id}>
                <p className="card__num">0{index + 1}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description={t.trustDescription}
            eyebrow={t.trustEyebrow}
            title={t.trustTitle}
          />
          <div className="grid-3">
            {getHomeTrustPrinciples(locale).map((principle, index) => (
              <article className="card" key={principle.id}>
                <p className="card__num">0{index + 1}</p>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={t.participationDescription}
            eyebrow={t.participationEyebrow}
            title={t.participationTitle}
          />
          <div className="grid-2">
            {getHomeParticipationPaths(locale).map((path) => (
              <article className="card" key={path.id}>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <Link className="text-link mt-4" href={localizePath(path.href, locale)}>
                  {path.action}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container">
        <div className="end-cta">
          <div>
            <h2>{t.endTitle}</h2>
            <p>{t.endBody}</p>
          </div>
          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <Link
              className="btn btn--primary w-full sm:w-auto"
              href={localizePath('/join', locale)}
            >
              {t.endPrimaryAction}
            </Link>
            <Link
              className="btn btn--ghost w-full sm:w-auto"
              href={localizePath('/working-groups', locale)}
            >
              {t.endSecondaryAction}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
