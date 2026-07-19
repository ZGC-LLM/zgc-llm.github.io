import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import {
  MEMBER_DIRECTORY_GROUPS,
  MEMBER_DIRECTORY_SOURCE,
  MEMBERS,
  MEMBERS_PAGE_COPY,
  memberHasPublishedScope,
} from '@/content/members'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'
import type { MemberSummary } from '@/types/content'

function formatDirectoryDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

function PublishedMemberCard({
  locale,
  member,
}: {
  locale: Locale
  member: MemberSummary
}): ReactElement {
  const t = MEMBERS_PAGE_COPY[locale]
  const canPublishLogo = Boolean(member.logo && memberHasPublishedScope(member, 'logo'))
  const canPublishRole = Boolean(member.description && memberHasPublishedScope(member, 'role'))
  const role = member.description
    ? locale === 'en'
      ? t.roleLabels[member.description]
      : member.description
    : undefined
  const nameLanguage = locale === 'en' ? 'zh-CN' : undefined

  return (
    <article className="card member-card min-w-0" key={member.id}>
      {canPublishLogo && member.logo ? (
        <div className="logo-tile">
          <Image
            alt={`${member.name}${t.logoAltSuffix}`}
            className="max-h-14 w-auto object-contain"
            height={56}
            lang={nameLanguage}
            src={member.logo}
            width={180}
          />
        </div>
      ) : null}
      <h3 className="break-words [overflow-wrap:anywhere]" lang={nameLanguage}>
        {member.name}
      </h3>
      {canPublishRole && role ? <p>{role}</p> : null}
    </article>
  )
}

// The injectable list keeps filled, partial-authorization and empty states testable.
export function MembersDirectory({
  members,
  locale = 'zh',
}: {
  members: readonly MemberSummary[]
  locale?: Locale
}): ReactElement {
  const t = MEMBERS_PAGE_COPY[locale]
  const membersById = new Map(
    members
      .filter((member) => memberHasPublishedScope(member, 'display-name'))
      .map((member) => [member.id, member] as const),
  )
  const publicGroups = MEMBER_DIRECTORY_GROUPS.map((group) => ({
    ...group,
    members: group.memberIds.flatMap((memberId) => {
      const member = membersById.get(memberId)
      return member ? [member] : []
    }),
  })).filter(({ members: groupMembers }) => groupMembers.length > 0)

  if (publicGroups.length === 0) {
    return (
      <section className="block">
        <div className="site-container">
          <div className="empty">
            <h2 className="text-xl font-bold text-[var(--text-title)]">{t.emptyTitle}</h2>
            <p>{t.emptyBody}</p>
            <Link className="btn btn--primary" href={localizePath('/news', locale)}>
              {t.emptyAction}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {publicGroups.map(({ id, members: groupMembers }, renderIndex) => {
        const groupCopy = t.groups[id]

        return (
          <section className={renderIndex % 2 === 1 ? 'block block--subtle' : 'block'} key={id}>
            <div className="site-container">
              <SectionHeading description={groupCopy.description} title={groupCopy.title} />
              <div className="grid-3">
                {groupMembers.map((member) => (
                  <PublishedMemberCard key={member.id} locale={locale} member={member} />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

export function MembersView({ locale }: { locale: Locale }): ReactElement {
  const t = MEMBERS_PAGE_COPY[locale]

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        actions={
          <p className="hero-note">
            {t.relationNote}{' '}
            <Link className="hero-note__link" href={localizePath('/working-groups', locale)}>
              {t.relationAction}
            </Link>
          </p>
        }
        description={t.heroDescription}
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
      />

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description={t.sourceDescription}
            eyebrow={t.sourceEyebrow}
            title={t.sourceTitle}
          />
          <div className="card mt-10 max-w-[72ch]">
            <p className="mt-0 text-sm">
              {t.sourcePublishedLabel}:{' '}
              <time dateTime={MEMBER_DIRECTORY_SOURCE.publishedAt}>
                {formatDirectoryDate(MEMBER_DIRECTORY_SOURCE.publishedAt, locale)}
              </time>
              {' · '}
              {t.sourceReviewedLabel}:{' '}
              <time dateTime={MEMBER_DIRECTORY_SOURCE.reviewedAt}>
                {formatDirectoryDate(MEMBER_DIRECTORY_SOURCE.reviewedAt, locale)}
              </time>
            </p>
            <p>
              <a
                className="text-link"
                href={MEMBER_DIRECTORY_SOURCE.url}
                rel="noreferrer noopener"
                target="_blank"
              >
                {t.sourceLinkLabel}
                <span aria-hidden="true"> ↗</span>
              </a>
            </p>
          </div>
        </div>
      </section>

      <MembersDirectory locale={locale} members={MEMBERS} />
    </main>
  )
}
