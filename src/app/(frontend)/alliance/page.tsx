import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import {
  ALLIANCE_DIRECTIONS,
  ALLIANCE_MECHANISM,
  ALLIANCE_MISSION,
  ALLIANCE_VALUES,
} from '@/content/alliance'

export const metadata: Metadata = {
  alternates: { canonical: '/alliance' },
  description: '了解联盟宗旨、共同价值与协作机制，以及联盟如何连接产业力量、推动开放协同。',
  title: '联盟介绍',
}

export default function AlliancePage(): ReactElement {
  return (
    <main id="main-content">
      <PageHero
        actions={
          <Link className="button-primary" href="/join">
            了解参与方式
          </Link>
        }
        description="连接自主大模型产业中的技术、场景、人才与生态资源，以开放协作推动可信、可持续的产业发展。"
        eyebrow="关于联盟"
        title="联盟介绍"
      />

      <section className="block">
        <div className="site-container">
          <SectionHeading eyebrow="使命" title="联盟宗旨" />
          <p className="mt-7 max-w-[60ch] text-xl leading-relaxed text-[var(--text-body)]">
            {ALLIANCE_MISSION}
          </p>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description="以共同原则连接不同技术路线、机构能力与专业经验。"
            eyebrow="价值主张"
            title="共同价值"
          />
          <div className="grid-3">
            {ALLIANCE_VALUES.map((value) => (
              <article className="card" key={value.id}>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="site-container split">
          <SectionHeading
            description="联盟统筹方向，工作组和专项聚焦议题，成员伙伴根据能力与意愿参与。"
            eyebrow="组织方式"
            title="协作机制"
          />
          <ol className="dir-list" style={{ gridTemplateColumns: '1fr' }}>
            {ALLIANCE_MECHANISM.map((item, index) => (
              <li className="dir-item" key={item}>
                <span className="n">{index + 1}</span>
                <div className="body">
                  <p>{item}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="block block--subtle">
        <div className="site-container">
          <SectionHeading
            description="从共同议题出发，持续形成可参与、可验证、可传播的产业协作。"
            eyebrow="发展方向"
            title="面向长期价值持续行动"
          />
          <div className="grid-2">
            {ALLIANCE_DIRECTIONS.map(([title, description]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container">
        <div className="end-cta">
          <div>
            <h2>联系与参与</h2>
            <p>正式联系信息将在发布前补充；机构伙伴可先了解联盟的生态共建方式。</p>
          </div>
          <Link className="button-primary" href="/join">
            查看生态共建方式
          </Link>
        </div>
      </section>
    </main>
  )
}
