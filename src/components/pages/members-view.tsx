import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { MEMBERS } from '@/content/members'
import type { Locale } from '@/i18n/locales'
import { localizePath } from '@/i18n/routing'
import type { MemberSummary } from '@/types/content'

interface MembersStrings {
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  relationNote: string
  relationLinkLabel: string
  emptyTitle: string
  emptyBody: string
  emptyCta: string
  groups: Readonly<Record<MemberSummary['type'], { label: string; description: string }>>
  roleLabels: Readonly<Record<string, string>>
  logoAltSuffix: string
}

const STRINGS: Record<Locale, MembersStrings> = {
  en: {
    emptyBody:
      'More member names and logos will be released gradually after public authorization. Please stay tuned.',
    emptyCta: 'Apply to become an ecosystem partner',
    emptyTitle: 'Member information is being prepared',
    groups: {
      ecosystem: {
        description: 'Ecosystem partners connecting technology, services and industry resources together.',
        label: 'Ecosystem Partners',
      },
      founding: {
        description: 'Member organisations that took part in founding and long-term building of the Alliance.',
        label: 'Founding Members',
      },
      institution: {
        description: 'Institutional members engaged in industry collaboration and scenario co-building.',
        label: 'Institutional Members',
      },
      research: {
        description: 'Research partners engaged in research, talent and technical exchange.',
        label: 'Research Partners',
      },
    },
    heroDescription:
      'The Alliance currently has 32 organisational members. The following are publicly announced council and supervisory member organisations; more members will be disclosed after authorization.',
    heroEyebrow: 'Ecosystem Partners',
    heroTitle: 'Alliance Member Partners',
    logoAltSuffix: ' logo',
    relationLinkLabel: 'View working groups',
    relationNote: 'Some members also take part in working group co-building.',
    roleLabels: {
      监事长单位: 'Chief Supervisor unit',
      理事长单位: 'Chair unit',
      秘书长单位: 'Secretary-General unit',
    },
  },
  zh: {
    emptyBody: '更多成员名称与标识将在完成公开授权后陆续发布，敬请关注。',
    emptyCta: '申请成为生态伙伴',
    emptyTitle: '成员信息整理中',
    groups: {
      ecosystem: { description: '共同连接技术、服务与产业资源的生态伙伴。', label: '生态伙伴' },
      founding: { description: '参与联盟发起与长期建设的成员单位。', label: '发起成员' },
      institution: { description: '参与产业协作与场景共建的机构成员。', label: '机构成员' },
      research: { description: '参与研究、人才与技术交流的科研伙伴。', label: '科研伙伴' },
    },
    heroDescription:
      '联盟现有 32 家单位会员。以下为已公开的理事会与监事会成员单位，更多成员将在获得授权后陆续公开。',
    heroEyebrow: '生态伙伴',
    heroTitle: '联盟成员伙伴',
    logoAltSuffix: '标识',
    relationLinkLabel: '查看工作组',
    relationNote: '部分成员亦参与工作组共建，',
    roleLabels: {},
  },
}

const GROUP_ORDER: readonly MemberSummary['type'][] = [
  'founding',
  'institution',
  'research',
  'ecosystem',
]

// 分组目录（可注入 members，供单测测试空态/填充态；locale 默认中文以兼容既有测试）。
export function MembersDirectory({
  members,
  locale = 'zh',
}: {
  members: readonly MemberSummary[]
  locale?: Locale
}): ReactElement {
  const t = STRINGS[locale]
  const roleLabel = (description: string): string => t.roleLabels[description] ?? description

  if (members.length === 0) {
    return (
      <section className="block">
        <div className="site-container">
          <div className="empty">
            <h3>{t.emptyTitle}</h3>
            <p>{t.emptyBody}</p>
            <Link className="btn btn--primary" href={localizePath('/join', locale)}>
              {t.emptyCta}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {GROUP_ORDER.map((type) => ({
        group: t.groups[type],
        groupMembers: members.filter((member) => member.type === type),
        type,
      }))
        .filter(({ groupMembers }) => groupMembers.length > 0)
        .map(({ group, groupMembers, type }, renderIndex) => (
          <section className={renderIndex % 2 === 1 ? 'block block--subtle' : 'block'} key={type}>
            <div className="site-container">
              <SectionHeading description={group.description} title={group.label} />
              <div className="grid-3">
                {groupMembers.map((member) => (
                  <article className="card member-card min-w-0" key={member.id}>
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
                    {member.description ? <p>{roleLabel(member.description)}</p> : null}
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
    </>
  )
}

export function MembersView({ locale }: { locale: Locale }): ReactElement {
  const t = STRINGS[locale]

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        actions={
          <p className="hero-note">
            {t.relationNote}{' '}
            <Link className="hero-note__link" href={localizePath('/working-groups', locale)}>
              {t.relationLinkLabel}
            </Link>
          </p>
        }
        description={t.heroDescription}
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
      />
      <MembersDirectory locale={locale} members={MEMBERS} />
    </main>
  )
}
