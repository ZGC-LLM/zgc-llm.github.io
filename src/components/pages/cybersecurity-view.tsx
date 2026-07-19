import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { getCybersecurityPageContent } from '@/content/cybersecurity'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'

export function CybersecurityView({ locale }: { locale: Locale }): ReactElement {
  const content = getCybersecurityPageContent(locale)
  const detailHref = localizePath('/working-groups/cybersecurity', locale)
  const joinHref = localizePath('/working-groups/cybersecurity/join', locale)

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        actions={
          <>
            <Link className="button-primary whitespace-normal text-center" href={detailHref}>
              {content.detailCta}
            </Link>
            <Link className="button-secondary whitespace-normal text-center" href={joinHref}>
              {content.joinCta}
            </Link>
          </>
        }
        description={content.summary}
        eyebrow={content.heroEyebrow}
        title={content.title}
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={content.cycleDescription}
            eyebrow={content.cycleEyebrow}
            title={content.cycleTitle}
          />
          <div className="grid-3" data-testid="ecosystem-cycle">
            {content.cycle.map((stage, index) => (
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
            description={content.resourcesDescription}
            eyebrow={content.resourcesEyebrow}
            title={content.resourcesTitle}
          />
          <div className="grid-3">
            {content.resources.map((resource, index) => (
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
            description={content.actionsDescription}
            eyebrow={content.actionsEyebrow}
            title={content.actionsTitle}
          />
          <div className="grid-2">
            {content.actions.map((action, index) => (
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
            description={content.contributionDescription}
            eyebrow={content.contributionEyebrow}
            title={content.contributionTitle}
          />
          <ul className="badges mt-9" aria-label={content.contributionTitle}>
            {content.contribution.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block band-dark">
        <div className="site-container split">
          <div>
            <p className="eyebrow">{content.governanceEyebrow}</p>
            <h2>{content.governanceTitle}</h2>
            <p>{content.governanceBody}</p>
          </div>
          <ul>
            {content.governanceBoundaries.map((boundary) => (
              <li key={boundary}>{boundary}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="site-container">
        <div className="end-cta">
          <div className="max-w-[68ch]">
            <span className="eyebrow">{content.organizationEyebrow}</span>
            <h2>{content.organizationTitle}</h2>
            <p>{content.organizationBody}</p>
            <ul aria-label={content.principlesLabel} className="badges mt-4">
              {content.openPrinciples.map((principle) => (
                <li key={principle}>{principle}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="button-primary whitespace-normal text-center" href={detailHref}>
              {content.detailCta}
            </Link>
            <Link className="button-secondary whitespace-normal text-center" href={joinHref}>
              {content.joinCta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
