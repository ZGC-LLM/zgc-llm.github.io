import Link from 'next/link'
import type { ReactElement } from 'react'

import { ExternalApplicationLink } from '@/components/site/external-application-link'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { APPLICATION_TARGET } from '@/config/site'
import { getAllianceJoinContent } from '@/content/join'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'

export function JoinView({ locale }: { locale: Locale }): ReactElement {
  const content = getAllianceJoinContent(locale)
  const workingGroupsHref = localizePath('/working-groups', locale)

  return (
    <main id="main-content">
      <PageHero
        actions={
          <>
            <ExternalApplicationLink
              className="button-primary whitespace-normal text-center"
              configuredUrl={APPLICATION_TARGET.href ?? ''}
              label={content.applyCta}
              locale={locale}
            >
              {content.applyCta}
            </ExternalApplicationLink>
            <Link
              className="button-secondary whitespace-normal text-center"
              href={workingGroupsHref}
            >
              {content.workingGroupsCta}
            </Link>
          </>
        }
        description={content.heroDescription}
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={content.paths.description}
            eyebrow={content.paths.eyebrow}
            title={content.paths.title}
          />
          <div className="grid-3">
            {content.paths.items.map((path) => (
              <article className="card" key={path.id}>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                {path.href && path.cta ? (
                  <Link
                    className="button-secondary mt-6 whitespace-normal text-center"
                    href={localizePath(path.href, locale)}
                  >
                    {path.cta}
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description={content.values.description}
            eyebrow={content.values.eyebrow}
            title={content.values.title}
          />
          <div className="grid-3">
            {content.values.items.map((value) => (
              <article className="card" key={value.id}>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={content.process.description}
            eyebrow={content.process.eyebrow}
            title={content.process.title}
          />
          <ol className="grid-3">
            {content.process.items.map((step, index) => (
              <li className="card" key={step.id}>
                <p className="eyebrow">
                  {content.processStepLabel} {String(index + 1).padStart(2, '0')}
                </p>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading eyebrow={content.faq.eyebrow} title={content.faq.title} />
          <div className="grid-3">
            {content.faq.items.map((item) => (
              <article className="card" key={item.id}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
                {item.link ? (
                  <Link
                    className="text-link mt-4 inline-flex min-h-11 items-center font-semibold text-[var(--brand-primary)]"
                    href={localizePath(item.link.href, locale)}
                  >
                    {item.link.label}
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
