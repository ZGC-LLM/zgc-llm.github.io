import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { ExternalApplicationLink } from '@/components/site/external-application-link'
import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { resolveWorkingGroupApplicationUrl } from '@/config/site'
import { getWorkingGroupJoinContent } from '@/content/join'
import {
  getWorkingGroupBySlug,
  getWorkingGroupSlugs,
  localizeWorkingGroup,
} from '@/content/working-groups'
import type { Locale } from '@/i18n/locales'
import { buildPageMetadata, localizePath } from '@/i18n/routing'
import type { WorkingGroupSummary } from '@/types/content'

interface WorkingGroupJoinPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  return getWorkingGroupSlugs().map((slug) => ({ slug }))
}

export function createWorkingGroupJoinMetadata(
  group: WorkingGroupSummary,
  locale: Locale = 'zh',
): Metadata {
  const localized = localizeWorkingGroup(group, locale)
  const content = getWorkingGroupJoinContent(locale)

  return buildPageMetadata({
    description: content.metadataDescriptionFor(localized.title),
    locale,
    title: content.metadataTitleFor(localized.title),
    zhPath: `/working-groups/${group.slug}/join`,
  })
}

export async function generateMetadata({ params }: WorkingGroupJoinPageProps): Promise<Metadata> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return createWorkingGroupJoinMetadata(group, 'zh')
}

export function WorkingGroupJoinView({
  slug,
  locale,
}: {
  slug: string
  locale: Locale
}): ReactElement {
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  const localized = localizeWorkingGroup(group, locale)
  const content = getWorkingGroupJoinContent(locale)
  const configuredUrl = resolveWorkingGroupApplicationUrl(group)
  const detailHref = localizePath(`/working-groups/${group.slug}`, locale)

  return (
    <main id="main-content">
      <PageHero
        actions={
          <>
            <ExternalApplicationLink
              className="button-primary whitespace-normal text-center"
              configuredUrl={configuredUrl}
              label={content.applyCta}
              locale={locale}
            >
              {content.applyCta}
            </ExternalApplicationLink>
            <Link className="button-secondary whitespace-normal text-center" href={detailHref}>
              {content.detailCta}
            </Link>
          </>
        }
        description={content.heroDescriptionFor(localized.title)}
        eyebrow={localized.title}
        title={content.pageTitle}
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={content.participation.description}
            eyebrow={content.participation.eyebrow}
            title={content.participation.title}
          />
          <div className="grid-3">
            {content.participation.items.map((item) => (
              <article className="card" key={item.id}>
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
            description={content.requirements.description}
            eyebrow={content.requirements.eyebrow}
            title={content.requirements.title}
          />
          <div className="grid-3">
            {content.requirements.items.map((item) => (
              <article className="card" key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
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

export default async function WorkingGroupJoinPage({
  params,
}: WorkingGroupJoinPageProps): Promise<ReactElement> {
  const { slug } = await params

  return <WorkingGroupJoinView locale="zh" slug={slug} />
}
