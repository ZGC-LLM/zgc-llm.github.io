import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { localizeWorkingGroup, WORKING_GROUPS } from '@/content/working-groups'
import type { Locale } from '@/i18n/locales'
import { buildAlternates, localizePath } from '@/i18n/routing'

export const metadata: Metadata = {
  alternates: buildAlternates('/working-groups', 'zh'),
  description: '了解联盟工作组，查看已公开的协作方向与参与入口。',
  title: '工作组',
}

const STRINGS: Record<Locale, {
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  sectionEyebrow: string
  sectionTitle: string
  sectionDescription: string
  initiativeLabel: string
  groupLabel: string
  viewPrefix: string
  joinPrefix: string
  emptyTitle: string
  emptyBody: string
  emptyCta: string
}> = {
  en: {
    emptyBody:
      'Other working groups will be made public once preparation matures; we only publish confirmed directions, responsible units and results.',
    emptyCta: 'Learn how to participate',
    emptyTitle: 'Collaboration directions stay open',
    groupLabel: 'Working Group',
    heroDescription:
      'Organising sustained collaboration around shared industry topics, connecting research, validation, scenarios and result exchange through working groups.',
    heroEyebrow: 'Collaboration Network',
    heroTitle: 'Working Groups',
    initiativeLabel: 'Priority Initiative',
    sectionDescription: 'The following are public working groups; more collaboration directions will be released.',
    sectionEyebrow: 'Public Working Groups',
    sectionTitle: 'Focusing on real topics for sustained collaboration',
    viewPrefix: 'View ',
    joinPrefix: 'Join ',
  },
  zh: {
    emptyBody: '其余工作组将在筹备成熟后公开，我们只发布已确认的方向、负责单位与成果。',
    emptyCta: '了解联盟参与方式',
    emptyTitle: '持续开放协作方向',
    groupLabel: '工作组',
    heroDescription: '围绕产业共同议题组织持续协作，通过工作组连接研究、验证、场景与成果交流。',
    heroEyebrow: '协作网络',
    heroTitle: '工作组',
    initiativeLabel: '重点专项',
    sectionDescription: '以下为已公开的工作组，更多协作方向将陆续发布。',
    sectionEyebrow: '公开工作组',
    sectionTitle: '聚焦真实议题，形成持续协作',
    viewPrefix: '查看',
    joinPrefix: '加入',
  },
}

export function WorkingGroupsListView({ locale }: { locale: Locale }): ReactElement {
  const t = STRINGS[locale]

  return (
    <main id="main-content">
      <PageHero description={t.heroDescription} eyebrow={t.heroEyebrow} title={t.heroTitle} />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={t.sectionDescription}
            eyebrow={t.sectionEyebrow}
            title={t.sectionTitle}
          />

          <div className="grid-2">
            {WORKING_GROUPS.map((raw) => {
              const group = localizeWorkingGroup(raw, locale)

              return (
                <article className="card" key={group.id}>
                  <p className="eyebrow">
                    {group.kind === 'initiative' ? t.initiativeLabel : t.groupLabel}
                  </p>
                  <h3 style={{ fontSize: '24px' }}>{group.title}</h3>
                  <p>{group.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
                    <Link
                      className="button-primary"
                      href={localizePath(`/working-groups/${group.slug}`, locale)}
                    >
                      {t.viewPrefix}
                      {group.title}
                    </Link>
                    <Link
                      className="button-secondary"
                      href={localizePath(`/working-groups/${group.slug}/join`, locale)}
                    >
                      {t.joinPrefix}
                      {group.title}
                    </Link>
                  </div>
                </article>
              )
            })}

            <aside
              className="empty"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginTop: 0,
                textAlign: 'left',
              }}
            >
              <h3>{t.emptyTitle}</h3>
              <p style={{ marginLeft: 0 }}>{t.emptyBody}</p>
              <Link
                className="button-secondary"
                href={localizePath('/join', locale)}
                style={{ alignSelf: 'flex-start', marginTop: '22px' }}
              >
                {t.emptyCta}
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function WorkingGroupsPage(): ReactElement {
  return <WorkingGroupsListView locale="zh" />
}
