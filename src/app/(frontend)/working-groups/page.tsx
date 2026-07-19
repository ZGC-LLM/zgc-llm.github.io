import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import {
  getWorkingGroupCatalogContent,
  localizeWorkingGroup,
  WORKING_GROUPS,
} from '@/content/working-groups'
import type { Locale } from '@/i18n/locales'
import { buildPageMetadata, localizePath } from '@/i18n/routing'

const metadataContent = getWorkingGroupCatalogContent('zh')

export const metadata: Metadata = buildPageMetadata({
  description: metadataContent.metadataDescription,
  locale: 'zh',
  title: metadataContent.metadataTitle,
  zhPath: '/working-groups',
})

export function WorkingGroupsListView({ locale }: { locale: Locale }): ReactElement {
  const content = getWorkingGroupCatalogContent(locale)

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        description={content.heroDescription}
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description={content.sectionDescription}
            eyebrow={content.sectionEyebrow}
            title={content.sectionTitle}
          />

          <div className="grid-2">
            {WORKING_GROUPS.map((rawGroup) => {
              const group = localizeWorkingGroup(rawGroup, locale)

              return (
                <article className="card" key={group.id}>
                  <p className="eyebrow">
                    {group.kind === 'initiative' ? content.initiativeLabel : content.groupLabel}
                  </p>
                  <h3 className="text-2xl">{group.title}</h3>
                  <p>{group.description}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      className="button-primary whitespace-normal text-center"
                      href={localizePath(`/working-groups/${group.slug}`, locale)}
                    >
                      {content.viewCta}
                    </Link>
                    <Link
                      className="button-secondary whitespace-normal text-center"
                      href={localizePath(`/working-groups/${group.slug}/join`, locale)}
                    >
                      {content.joinCta}
                    </Link>
                  </div>
                </article>
              )
            })}

            <aside className="empty !mt-0 flex flex-col justify-center !text-left">
              <h3>{content.emptyTitle}</h3>
              <p className="!mx-0">{content.emptyBody}</p>
              <Link
                className="button-secondary mt-6 self-start whitespace-normal text-center"
                href={localizePath('/join', locale)}
              >
                {content.emptyCta}
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
