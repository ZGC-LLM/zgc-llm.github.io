import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'
import { MEMBERS } from '@/content/members'
import type { MemberSummary } from '@/types/content'

export const metadata: Metadata = {
  alternates: { canonical: '/members' },
  description: '按公开授权范围展示联盟成员与生态伙伴，连接产业、科研与生态协作力量。',
  title: '成员伙伴',
}

const MEMBER_GROUPS: readonly {
  description: string
  label: string
  type: MemberSummary['type']
}[] = [
  { description: '参与联盟发起与长期建设的成员单位。', label: '发起成员', type: 'founding' },
  { description: '参与产业协作与场景共建的机构成员。', label: '机构成员', type: 'institution' },
  { description: '参与研究、人才与技术交流的科研伙伴。', label: '科研伙伴', type: 'research' },
  { description: '共同连接技术、服务与产业资源的生态伙伴。', label: '生态伙伴', type: 'ecosystem' },
] as const

interface MembersDirectoryProps {
  members: readonly MemberSummary[]
}

export function MembersDirectory({ members }: MembersDirectoryProps): ReactElement {
  if (members.length === 0) {
    return (
      <section className="block">
        <div className="site-container">
          <div className="empty">
            <h3>成员信息整理中</h3>
            <p>成员名称与品牌标识将在完成公开授权确认后发布。我们不会使用未获授权的名单或标识填充页面。</p>
            <Link className="btn btn--primary" href="/join">
              了解生态共建
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {MEMBER_GROUPS.map((group) => ({
        group,
        groupMembers: members.filter((member) => member.type === group.type),
      }))
        .filter(({ groupMembers }) => groupMembers.length > 0)
        .map(({ group, groupMembers }, renderIndex) => (
          <section
            className={renderIndex % 2 === 1 ? 'block block--subtle' : 'block'}
            key={group.type}
          >
            <div className="site-container">
              <SectionHeading description={group.description} title={group.label} />
              <div className="grid-3">
                {groupMembers.map((member) => (
                  <article className="card min-w-0" key={member.id}>
                    {member.logo ? (
                      <div className="logo-tile">
                        <Image
                          alt={`${member.name}标识`}
                          className="max-h-14 w-auto object-contain"
                          height={56}
                          src={member.logo}
                          width={180}
                        />
                      </div>
                    ) : null}
                    <h3>{member.name}</h3>
                    {member.description ? <p>{member.description}</p> : null}
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
    </>
  )
}

export default function MembersPage(): ReactElement {
  return (
    <main id="main-content">
      <PageHero
        description="在获得公开授权的前提下，展示参与联盟建设的产业、科研与生态协作力量。"
        eyebrow="MEMBERS & PARTNERS"
        title="成员伙伴"
      />
      <MembersDirectory members={MEMBERS} />
    </main>
  )
}
