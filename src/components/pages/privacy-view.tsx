import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { PRIVACY_PAGE_COPY, type PrivacyPageCopy } from '@/content/privacy'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'

export function privacyStrings(locale: Locale): PrivacyPageCopy {
  return PRIVACY_PAGE_COPY[locale]
}

export function PrivacyView({ locale }: { locale: Locale }): ReactElement {
  const t = PRIVACY_PAGE_COPY[locale]

  return (
    <main id="main-content">
      <PageHero description={t.heroDescription} eyebrow={t.heroEyebrow} title={t.heroTitle} />

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
              <h3>{t.externalCardTitle}</h3>
              <p>{t.externalCardBody}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description={t.beforeDescription}
            eyebrow={t.beforeEyebrow}
            title={t.beforeTitle}
          />
          <div className="prose">
            <ul>
              {t.beforeItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={t.recoveryDescription}
            eyebrow={t.recoveryEyebrow}
            title={t.recoveryTitle}
          />
          <Link className="btn btn--primary mt-8" href={localizePath('/join', locale)}>
            {t.recoveryAction}
          </Link>
        </div>
      </section>
    </main>
  )
}
