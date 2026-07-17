import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { WORKING_GROUPS } from '@/content/working-groups'

export const metadata: Metadata = {
  alternates: { canonical: '/working-groups' },
  description: '了解联盟工作组，查看已公开的协作方向与参与入口。',
  title: '工作组',
}

export default function WorkingGroupsPage(): ReactElement {
  return (
    <main id="main-content">
      <PageHero
        description="围绕产业共同议题组织持续协作，通过工作组连接研究、验证、场景与成果交流。"
        eyebrow="协作网络"
        title="工作组"
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading
            description="以下为已公开的工作组，更多协作方向将陆续发布。"
            eyebrow="公开工作组"
            title="聚焦真实议题，形成持续协作"
          />

          <div className="grid-2">
            {WORKING_GROUPS.map((group) => (
              <article className="card" key={group.id}>
                <p className="eyebrow">{group.kind === 'initiative' ? '重点专项' : '工作组'}</p>
                <h3 style={{ fontSize: '24px' }}>{group.title}</h3>
                <p>{group.description}</p>
                <div style={{ marginTop: '24px' }}>
                  <Link className="button-primary" href={`/working-groups/${group.slug}`}>
                    查看{group.title}
                  </Link>
                </div>
              </article>
            ))}

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
              <h3>持续开放协作方向</h3>
              <p style={{ marginLeft: 0 }}>
                其余工作组将在筹备成熟后公开，我们只发布已确认的方向、负责单位与成果。
              </p>
              <Link
                className="button-secondary"
                href="/join"
                style={{ alignSelf: 'flex-start', marginTop: '22px' }}
              >
                了解联盟参与方式
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
