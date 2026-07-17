import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import { PageHero } from '@/components/site/page-hero'
import { getWorkingGroupBySlug, getWorkingGroupSlugs } from '@/content/working-groups'
import { getWorkingGroupMembers } from '@/content/working-group-members'
import type { WorkingGroupMember, WorkingGroupSummary } from '@/types/content'

interface WorkingGroupMembersPageProps {
  params: Promise<{ slug: string }>
}

// 仅预渲染 generateStaticParams 返回的 slug；未知 slug 一律 404。
export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  return getWorkingGroupSlugs().map((slug) => ({ slug }))
}

export function createWorkingGroupMembersMetadata(group: WorkingGroupSummary): Metadata {
  const description = `查看${group.title}的公开授权成员名单。`

  return {
    alternates: { canonical: `/working-groups/${group.slug}/members` },
    description,
    openGraph: {
      description,
      title: `${group.title} · 成员名单`,
      type: 'website',
      url: `/working-groups/${group.slug}/members`,
    },
    title: `${group.title} · 成员名单`,
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
}

export function WorkingGroupMembersDirectory({
  group,
  members,
}: WorkingGroupMembersDirectoryProps): ReactElement {
  if (members.length === 0) {
    return (
      <section className="block">
        <div className="site-container">
          <div className="empty">
            <h3>成员名单整理中</h3>
            <p>成员名单将在获得公开授权后发布；在此之前，我们不会展示未经授权的名单或标识。</p>
            <Link className="btn btn--primary" href={`/working-groups/${group.slug}/join`}>
              申请加入本工作组
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
                    alt={`${member.name}标识`}
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

export default async function WorkingGroupMembersPage({
  params,
}: WorkingGroupMembersPageProps): Promise<ReactElement> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  const members = getWorkingGroupMembers(slug)

  return (
    <main id="main-content">
      <PageHero
        description={`查看${group.title}的公开授权成员名单。`}
        eyebrow={group.title}
        title="成员名单"
      />
      <WorkingGroupMembersDirectory group={group} members={members} />
    </main>
  )
}
