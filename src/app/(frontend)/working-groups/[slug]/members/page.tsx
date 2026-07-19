import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { getWorkingGroupMembers } from '@/content/working-group-members'
import {
  getWorkingGroupBySlug,
  getWorkingGroupMembersContent,
  getWorkingGroupSlugs,
  localizeWorkingGroup,
} from '@/content/working-groups'
import type { Locale } from '@/i18n/locales'
import { buildPageMetadata, localizePath } from '@/i18n/routing'
import type { WorkingGroupMember, WorkingGroupSummary } from '@/types/content'

interface WorkingGroupMembersPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  return getWorkingGroupSlugs().map((slug) => ({ slug }))
}

export function createWorkingGroupMembersMetadata(
  group: WorkingGroupSummary,
  locale: Locale = 'zh',
): Metadata {
  const localized = localizeWorkingGroup(group, locale)
  const content = getWorkingGroupMembersContent(locale)

  return buildPageMetadata({
    description: content.metadataDescriptionFor(localized.title),
    locale,
    title: content.metadataTitleFor(localized.title),
    zhPath: `/working-groups/${group.slug}/members`,
  })
}

export async function generateMetadata({
  params,
}: WorkingGroupMembersPageProps): Promise<Metadata> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return createWorkingGroupMembersMetadata(group, 'zh')
}

interface WorkingGroupMembersDirectoryProps {
  group: WorkingGroupSummary
  locale?: Locale
  members: readonly WorkingGroupMember[]
}

export function WorkingGroupMembersDirectory({
  group,
  members,
  locale = 'zh',
}: WorkingGroupMembersDirectoryProps): ReactElement {
  const content = getWorkingGroupMembersContent(locale)

  if (members.length === 0) {
    return (
      <section className="block">
        <div className="site-container">
          <div className="empty">
            <h2>{content.emptyTitle}</h2>
            <p>{content.emptyBody}</p>
            <Link
              className="button-primary mt-6 whitespace-normal text-center"
              href={localizePath(`/working-groups/${group.slug}/join`, locale)}
            >
              {content.emptyCta}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="block">
      <div className="site-container">
        <SectionHeading title={content.directoryTitle} />
        <div className="grid-3">
          {members.map((member) => (
            <article className="card min-w-0" key={member.id}>
              {member.logo ? (
                <div className="logo-tile">
                  <Image
                    alt={`${member.name}${content.logoAltSuffix}`}
                    className="max-h-14 w-auto object-contain"
                    height={56}
                    src={member.logo}
                    width={180}
                  />
                </div>
              ) : null}
              <h3>{member.name}</h3>
              {member.role ? <p className="eyebrow">{member.role}</p> : null}
              {member.description ? <p>{member.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function WorkingGroupMembersView({
  slug,
  locale,
}: {
  slug: string
  locale: Locale
}): ReactElement {
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  const localized = localizeWorkingGroup(group, locale)
  const content = getWorkingGroupMembersContent(locale)
  const members = getWorkingGroupMembers(slug, locale)

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        description={content.pageDescriptionFor(localized.title)}
        eyebrow={localized.title}
        title={content.pageTitle}
      />
      {members.length > 0 ? (
        <div className="block block--subtle">
          <div className="site-container">
            <p className="max-w-[70ch] text-lg leading-relaxed text-[var(--text-body)]">
              {content.relationBody}{' '}
              <Link
                className="text-link inline-flex min-h-11 items-center font-semibold text-[var(--brand-primary)]"
                href={localizePath('/members', locale)}
              >
                {content.relationLinkLabel}
              </Link>
            </p>
          </div>
        </div>
      ) : null}
      <WorkingGroupMembersDirectory group={group} locale={locale} members={members} />
    </main>
  )
}

export default async function WorkingGroupMembersPage({
  params,
}: WorkingGroupMembersPageProps): Promise<ReactElement> {
  const { slug } = await params

  return <WorkingGroupMembersView locale="zh" slug={slug} />
}
