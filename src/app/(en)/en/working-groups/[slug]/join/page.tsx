import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'

import {
  createWorkingGroupJoinMetadata,
  generateStaticParams,
  WorkingGroupJoinView,
} from '@/app/(frontend)/working-groups/[slug]/join/page'
import { getWorkingGroupBySlug } from '@/content/working-groups'

interface EnPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export { generateStaticParams }

export async function generateMetadata({ params }: EnPageProps): Promise<Metadata> {
  const { slug } = await params
  const group = getWorkingGroupBySlug(slug)

  if (!group) notFound()

  return createWorkingGroupJoinMetadata(group, 'en')
}

export default async function EnWorkingGroupJoinPage({ params }: EnPageProps): Promise<ReactElement> {
  const { slug } = await params

  return <WorkingGroupJoinView locale="en" slug={slug} />
}
