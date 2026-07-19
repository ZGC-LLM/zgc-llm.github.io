import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { getWorkingGroupMembers } from '@/content/working-group-members'
import {
  getWorkingGroupBySlug,
  getWorkingGroupSlugs,
  localizeWorkingGroup,
} from '@/content/working-groups'
import type { Locale } from '@/i18n/locales'
import { buildAlternates, localizePath } from '@/i18n/routing'
import type { WorkingGroupMember, WorkingGroupSummary } from '@/types/content'

interface WorkingGroupMembersPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  return getWorkingGroupSlugs().map((slug) => ({ slug }))
}

const STRINGS: Record<Locale, {
  pageTitle: string
  descriptionFor: (title: string) => string
  ogTitleSuffix: string
  emptyTitle: string
  emptyBody: string
  emptyCta: string
  logoAltSuffix: string
  relationNotePrefix: string
  relationLinkLabel: string
  relationNoteSuffix: string
}> = {
  en: {
    descriptionFor: (title) =>
      `View the publicly authorized Working Group Partners list of the ${title}.`,
    emptyBody:
      'More Working Group Partners will be disclosed after public authorization. Please stay tuned.',
    emptyCta: 'Apply to join this working group',
    emptyTitle: 'Working Group Partners list is being prepared',
    logoAltSuffix: ' logo',
    ogTitleSuffix: ' · Working Group Partners',
    pageTitle: 'Working Group Partners',
    relationLinkLabel: 'Alliance Members',
    relationNotePrefix: 'Organisations on this list are mostly also alliance members. Visit ',
    relationNoteSuffix: ' for the full list.',
  },
  zh: {
    descriptionFor: (title) => `查看${title}公开授权的工作组共建伙伴名单。`,
    emptyBody: '更多工作组共建伙伴名单将在获得公开授权后陆续公开，敬请关注。',
    emptyCta: '申请加入本工作组',
    emptyTitle: '工作组共建伙伴名单整理中',
    logoAltSuffix: '标识',
    ogTitleSuffix: ' · 工作组共建伙伴',
    pageTitle: '工作组共建伙伴',
    relationLinkLabel: '联盟成员',
    relationNotePrefix: '名单单位多为联盟会员，可前往',
    relationNoteSuffix: '页查看完整名单。',
  },
}

export function createWorkingGroupMembersMetadata(
  group: WorkingGroupSummary,
  locale: Locale = 'zh',
): Metadata {
  const localized = localizeWorkingGroup(group, locale)
  const t = STRINGS[locale]
  const description = t.descriptionFor(localized.title)

  return {
    alternates: buildAlternates(`/working-groups/${group.slug}/members`, locale),
    description,
    openGraph: {
      description,
      title: `${localized.title}${t.ogTitleSuffix}`,
      type: 'website',
      url: localizePath(`/working-groups/${group.slug}/members`, locale),
    },
    title: `${localized.title}${t.ogTitleSuffix}`,
  }
}

export async function generateMetadata({
  params,
}: WorkingGroupMembersPageProps): Promise<Metadata> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return createWorkingGroupMembersMetadata(group)
}

interface WorkingGroupMembersDirectoryProps {
  group: WorkingGroupSummary
  members: readonly WorkingGroupMember[]
  locale?: Locale
}

export function WorkingGroupMembersDirectory({
  group,
  members,
  locale = 'zh',
}: WorkingGroupMembersDirectoryProps): ReactElement {
  const t = STRINGS[locale]

  if (members.length === 0) {
    return (
      <section className="block">
        <div className="site-container">
          <div className="empty">
            <h3>{t.emptyTitle}</h3>
            <p>{t.emptyBody}</p>
            <Link
              className="btn btn--primary"
              href={localizePath(`/working-groups/${group.slug}/join`, locale)}
            >
              {t.emptyCta}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="block">
      <div className="site-container">
        <div className="grid-3">
          {members.map((member) => (
            <article className="card min-w-0" key={member.id}>
              {member.logo ? (
                <div className="logo-tile">
                  <Image
                    alt={`${member.name}${t.logoAltSuffix}`}
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
  const t = STRINGS[locale]
  const members = getWorkingGroupMembers(slug, locale)

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        description={t.descriptionFor(localized.title)}
        eyebrow={localized.title}
        title={t.pageTitle}
      />
      <section className="block block--subtle">
        <div className="site-container">
          <p>
            {t.relationNotePrefix}
            <Link href={localizePath('/members', locale)}>{t.relationLinkLabel}</Link>
            {t.relationNoteSuffix}
          </p>
        </div>
      </section>
      <WorkingGroupMembersDirectory group={group} locale={locale} members={members} />
    </main>
  )
}

export default async function WorkingGroupMembersPage({
  params,
}: WorkingGroupMembersPageProps): Promise<ReactElement> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return <WorkingGroupMembersView locale="zh" slug={slug} />
}
