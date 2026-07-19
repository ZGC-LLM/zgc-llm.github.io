import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import {
  getWorkingGroupBySlug,
  getWorkingGroupOverviewContent,
  getWorkingGroupSlugs,
  localizeWorkingGroup,
} from '@/content/working-groups'
import type { Locale } from '@/i18n/locales'
import { buildPageMetadata, localizePath } from '@/i18n/routing'
import type { WorkingGroupSummary } from '@/types/content'

interface WorkingGroupPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  return getWorkingGroupSlugs().map((slug) => ({ slug }))
}

export function createWorkingGroupMetadata(
  group: WorkingGroupSummary,
  locale: Locale = 'zh',
): Metadata {
  const localized = localizeWorkingGroup(group, locale)
  const content = getWorkingGroupOverviewContent(locale)

  return buildPageMetadata({
    description: content.metadataDescriptionFor(localized.title),
    locale,
    title: localized.title,
    zhPath: `/working-groups/${group.slug}`,
  })
}

export async function generateMetadata({ params }: WorkingGroupPageProps): Promise<Metadata> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return createWorkingGroupMetadata(group, 'zh')
}

interface WorkingGroupOverviewProps {
  group: WorkingGroupSummary
  locale?: Locale
}

export function WorkingGroupOverview({
  group: rawGroup,
  locale = 'zh',
}: WorkingGroupOverviewProps): ReactElement {
  const group = localizeWorkingGroup(rawGroup, locale)
  const content = getWorkingGroupOverviewContent(locale)
  const eyebrow = group.kind === 'initiative' ? content.initiativeLabel : content.groupLabel
  const joinHref = localizePath(`/working-groups/${group.slug}/join`, locale)
  const membersHref = localizePath(`/working-groups/${group.slug}/members`, locale)
  const ecosystemHref = group.ecosystemHref ? localizePath(group.ecosystemHref, locale) : undefined

  return (
    <>
      <PageHero
        actions={
          <>
            <Link className="button-primary whitespace-normal text-center" href={joinHref}>
              {content.joinCta}
            </Link>
            <Link className="button-secondary whitespace-normal text-center" href={membersHref}>
              {content.membersCta}
            </Link>
          </>
        }
        description={group.description}
        eyebrow={eyebrow}
        title={group.title}
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={content.scopeDescription}
            eyebrow={content.scopeEyebrow}
            title={content.scopeTitle}
          />
          <div className="grid-2">
            {group.responsibilities.map((item, index) => (
              <div className="dir-item" key={item}>
                <span className="n">{String(index + 1).padStart(2, '0')}</span>
                <b>{item}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description={content.directionsDescription}
            eyebrow={content.directionsEyebrow}
            title={content.directionsTitle}
          />
          <div className="grid-3">
            {group.researchDirections.map((direction, index) => (
              <article className="card" key={direction}>
                <p className="card__num">{String(index + 1).padStart(2, '0')}</p>
                <h3>{direction}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={content.rolesDescription}
            eyebrow={content.rolesEyebrow}
            title={content.rolesTitle}
          />
          <div className="grid-2">
            {group.leads.map((lead) => (
              <article className="card" key={`${lead.role}-${lead.name}`}>
                <p className="eyebrow">{lead.role}</p>
                <h3>{lead.name}</h3>
                {lead.description ? <p>{lead.description}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description={content.outcomesDescription}
            eyebrow={content.outcomesEyebrow}
            title={content.outcomesTitle}
          />
          {group.outcomes.length === 0 ? (
            <div className="empty">
              <h3>{content.outcomesEmptyTitle}</h3>
              <p>{content.outcomesEmptyBody}</p>
            </div>
          ) : (
            <div className="grid-2">
              {group.outcomes.map((outcome, index) => (
                <article className="card" key={outcome}>
                  <p className="card__num">{String(index + 1).padStart(2, '0')}</p>
                  <p>{outcome}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="block">
        <div className="site-container">
          <div className="cta-band">
            <div>
              <p className="eyebrow">{content.ctaEyebrow}</p>
              <h2>{content.ctaTitle}</h2>
              <p>{content.ctaBody}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link className="button-primary whitespace-normal text-center" href={joinHref}>
                {content.joinCta}
              </Link>
              <Link className="button-secondary whitespace-normal text-center" href={membersHref}>
                {content.membersCta}
              </Link>
              {ecosystemHref ? (
                <Link
                  className="button-secondary whitespace-normal text-center"
                  href={ecosystemHref}
                >
                  {content.ecosystemCta}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function WorkingGroupOverviewView({
  slug,
  locale,
}: {
  slug: string
  locale: Locale
}): ReactElement {
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return (
    <main id="main-content">
      <WorkingGroupOverview group={group} locale={locale} />
    </main>
  )
}

export default async function WorkingGroupPage({
  params,
}: WorkingGroupPageProps): Promise<ReactElement> {
  const { slug } = await params

  return <WorkingGroupOverviewView locale="zh" slug={slug} />
}
