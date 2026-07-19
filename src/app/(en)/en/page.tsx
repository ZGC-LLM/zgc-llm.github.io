import type { Metadata } from 'next'
import type { ReactElement } from 'react'

import { HomeView } from '@/components/pages/home-view'
import { SITE_NAME } from '@/config/site'
import { buildAlternates } from '@/i18n/routing'

// 英文首页：正文已英文初稿（HomeView locale="en"）；成员名/新闻标题暂回退中文。
export const metadata: Metadata = {
  alternates: buildAlternates('/', 'en'),
  description:
    'Uniting the strength of self-reliant large models to build an open, secure and collaborative industry ecosystem — advancing technology innovation, industrial collaboration, real-world deployment and international cooperation.',
  title: { absolute: `Home｜${SITE_NAME}` },
}

export default function EnHomePage(): ReactElement {
  return <HomeView locale="en" />
}
