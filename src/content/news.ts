import type { Locale } from '@/i18n/locales'
import type { FactReference, FactSource, NewsCategory, NewsEntry } from '@/types/content'

const CONTENT_REVIEWER = 'T-001 repository release audit'
const REVIEWED_AT = '2026-07-19'

export const CYBERSECURITY_PROGRAM_SOURCE = {
  publishedAt: '2026-07-08',
  reviewedAt: REVIEWED_AT,
  title: '网安圈专属：智谱GLM-5.2及Coding Plan五折专享权益，限时3个月',
  url: 'https://www.csreviews.cn/?p=11129',
} satisfies FactSource

const CYBERSECURITY_PROGRAM_FACTS: readonly FactReference[] = [
  {
    authorizedScopes: ['display-name', 'result'],
    evidenceStatus: 'partial',
    factId: 'FACT-030',
    publication: 'publish',
    reviewedAt: REVIEWED_AT,
    reviewer: CONTENT_REVIEWER,
    source: CYBERSECURITY_PROGRAM_SOURCE,
  },
  {
    authorizedScopes: ['commitment'],
    evidenceStatus: 'partial',
    factId: 'FACT-031',
    publication: 'publish',
    reviewedAt: REVIEWED_AT,
    reviewer: CONTENT_REVIEWER,
    source: CYBERSECURITY_PROGRAM_SOURCE,
  },
  {
    authorizedScopes: [],
    evidenceStatus: 'partial',
    factId: 'FACT-037',
    publication: 'neutralize',
    reviewedAt: REVIEWED_AT,
    reviewer: CONTENT_REVIEWER,
    source: CYBERSECURITY_PROGRAM_SOURCE,
  },
  {
    authorizedScopes: [],
    evidenceStatus: 'conflict',
    factId: 'FACT-040',
    publication: 'neutralize',
    reviewedAt: REVIEWED_AT,
    reviewer: CONTENT_REVIEWER,
    source: CYBERSECURITY_PROGRAM_SOURCE,
  },
] as const

const WITHDRAWN_LAUNCH_FACTS: readonly FactReference[] = [
  {
    authorizedScopes: [],
    evidenceStatus: 'conflict',
    factId: 'FACT-034',
    publication: 'neutralize',
    reviewedAt: REVIEWED_AT,
    reviewer: CONTENT_REVIEWER,
  },
] as const

export const NEWS_ENTRIES: readonly NewsEntry[] = [
  {
    applicationTargetId: 'cybersecurity-program',
    body: [
      {
        text: '数说安全于 2026 年 7 月 8 日发布的公开信息称，中关村自主大模型产业联盟发起网络安全人员开放计划，在网络安全场景中提供受邀、受控的模型能力访问。本页按公开来源记录当时的计划范围，不将其表述为持续有效的当前承诺。',
        type: 'paragraph',
      },
      { text: '公开信息所列对象', type: 'heading' },
      {
        items: [
          '有关网络安全部门及相关支撑单位',
          '安全研究机构、重点实验室与高校安全团队',
          '网络安全企业、软件安全服务商与基础设施安全团队',
          '经审核的安全研究人员与开源基础设施维护者',
        ],
        type: 'list',
      },
      { text: '使用边界', type: 'heading' },
      {
        items: [
          '仅面向经审核的防御性场景，不作为面向公众的开放服务',
          '使用方需要确认目标授权，并对模型输出进行人工复核与工程验证',
          '漏洞处置和对外披露应遵循适用规则与负责任披露流程',
        ],
        type: 'list',
      },
      { text: '当期安排', type: 'heading' },
      {
        text: '原始信息列出了 2026 年 7 月 1 日至 10 月 1 日的限时模型使用权益，以及技术接入、交流协作和联合评测等安排。这些内容具有明确时效，本页不将其表述为持续有效的服务承诺。',
        type: 'paragraph',
      },
      { text: '当前申请状态', type: 'heading' },
      {
        text: '公开来源列出了对应的飞书表单，但尚未完成匿名访问、信息处理说明与提交回执核验。官网因此默认不启用申请入口；完成逐项核验后，入口才会显示为可用。',
        type: 'paragraph',
      },
    ],
    category: 'news',
    ctaLabel: '前往计划申请表',
    date: '2026-07-08',
    description:
      '记录 2026 年 7 月公开发布的网络安全人员开放计划信息，包括适用对象、当期安排与申请入口的当前状态。',
    facts: CYBERSECURITY_PROGRAM_FACTS,
    published: true,
    slug: 'cybersecurity-open-program',
    title: '网络安全人员开放计划：2026 年 7 月公开信息',
  },
  {
    body: [
      {
        text: '该稿件在正式域名、TLS 与发布链路完成核验前不具备发布条件，现已撤回并仅保留为内部内容治理记录。',
        type: 'paragraph',
      },
    ],
    category: 'news',
    date: '2026-07-17',
    description: '官网发布条件未完成核验，该稿件已撤回。',
    facts: WITHDRAWN_LAUNCH_FACTS,
    featured: false,
    published: false,
    slug: 'alliance-website-launch',
    title: '官网发布稿撤回记录',
  },
] as const

type NewsOverlay = Partial<Pick<NewsEntry, 'body' | 'ctaLabel' | 'description' | 'title'>>

const NEWS_EN: Readonly<Record<string, NewsOverlay>> = {
  'alliance-website-launch': {
    body: [
      {
        text: 'The production domain, TLS and release path had not passed verification, so this draft was withdrawn and retained only as an internal content-governance record.',
        type: 'paragraph',
      },
    ],
    description:
      'The website release conditions had not passed verification, so this draft was withdrawn.',
    title: 'Website release draft withdrawal record',
  },
  'cybersecurity-open-program': {
    body: [
      {
        text: 'A public notice posted at csreviews.cn on July 8, 2026 states that ZGCLLM introduced a controlled model-access program for cybersecurity use. This page records the scope described in that dated source and does not present it as a current, ongoing service commitment.',
        type: 'paragraph',
      },
      { text: 'Audience described in the notice', type: 'heading' },
      {
        items: [
          'Cybersecurity departments and their support organizations',
          'Security research organizations, key laboratories and university security teams',
          'Cybersecurity companies, software security providers and infrastructure security teams',
          'Approved security researchers and open-source infrastructure maintainers',
        ],
        type: 'list',
      },
      { text: 'Use boundaries', type: 'heading' },
      {
        items: [
          'Access was intended for reviewed defensive scenarios, not as a public service',
          'Users remain responsible for target authorization, human review and engineering validation',
          'Vulnerability handling and external disclosure should follow applicable rules and responsible-disclosure processes',
        ],
        type: 'list',
      },
      { text: 'Dated terms', type: 'heading' },
      {
        text: 'The source lists time-limited model-access terms running from July 1 through October 1, 2026, along with technical onboarding, closed discussions and joint evaluation. This page does not present those dated terms as an ongoing service commitment.',
        type: 'paragraph',
      },
      { text: 'Current application status', type: 'heading' },
      {
        text: 'The source links to a Feishu form. Anonymous access, the form information-handling notice and its submission receipt have not been verified. The application entry therefore remains unavailable by default and can be enabled only after those checks pass.',
        type: 'paragraph',
      },
    ],
    ctaLabel: 'Open the program application form',
    description:
      'A dated public notice from July 2026 describing the program audience, time-limited terms and the current status of its application route.',
    title: 'Cybersecurity access program: July 2026 public notice',
  },
}

export type NewsPublicationStatus = 'historical' | 'update' | 'withdrawn'

export interface NewsLocalizationResult {
  entry: NewsEntry
  isFallback: boolean
}

export interface NewsPageCopy {
  applicationDescription: string
  applicationTitle: string
  backLabel: string
  categoryLabels: Readonly<Record<NewsCategory, string>>
  emptyBody: string
  emptyTitle: string
  externalNotice: string
  fallbackAction: string
  fallbackBody: string
  fallbackDescription: string
  fallbackTitle: string
  heroDescription: string
  heroEyebrow: string
  heroTitle: string
  metadataDescription: string
  metadataTitle: string
  publishedLabel: string
  sourceLinkLabel: string
  sourcePublishedLabel: string
  sourceReviewedLabel: string
  sourceTitle: string
  statusLabels: Readonly<Record<NewsPublicationStatus, string>>
}

export const NEWS_PAGE_COPY: Readonly<Record<Locale, NewsPageCopy>> = {
  en: {
    applicationDescription:
      'The application route is enabled only after its destination and submission flow pass review.',
    applicationTitle: 'Application route',
    backLabel: '← Back to Alliance updates',
    categoryLabels: {
      event: 'Event',
      insight: 'Industry insight',
      news: 'Alliance update',
      result: 'Published result',
    },
    emptyBody:
      'When no item meets the publication requirements, this page remains empty instead of using sample or unverified content.',
    emptyTitle: 'No published updates',
    externalNotice:
      'Opens an external website in a new tab. Review the destination before continuing.',
    fallbackAction: 'View the Chinese source',
    fallbackBody:
      'An English version has not been reviewed for publication. Use the Chinese page for the source content.',
    fallbackDescription:
      'This item is available in Chinese. An English version has not been reviewed for publication.',
    fallbackTitle: 'Alliance update available in Chinese',
    heroDescription:
      'This page lists items whose sources and publication scope have been reviewed. Dated notices identify their source and current status; drafts remain unpublished.',
    heroEyebrow: 'Published information',
    heroTitle: 'Alliance updates',
    metadataDescription:
      'Source-reviewed ZGCLLM updates with publication dates, content status and current application availability.',
    metadataTitle: 'Alliance updates',
    publishedLabel: 'Published',
    sourceLinkLabel: 'View the public source',
    sourcePublishedLabel: 'Source published',
    sourceReviewedLabel: 'Source reviewed',
    sourceTitle: 'Public source',
    statusLabels: {
      historical: 'Dated notice',
      update: 'Published update',
      withdrawn: 'Withdrawn draft',
    },
  },
  zh: {
    applicationDescription: '申请入口只在目标页面与提交流程完成核验后启用。',
    applicationTitle: '申请入口',
    backLabel: '← 返回联盟动态',
    categoryLabels: {
      event: '活动',
      insight: '行业观察',
      news: '联盟动态',
      result: '公开成果',
    },
    emptyBody: '没有内容满足发布条件时，本页保持空态，不以示例或未核实信息填充。',
    emptyTitle: '暂无可公开动态',
    externalNotice: '将在新窗口打开外部网站，继续前请核对目标页面。',
    fallbackAction: '查看中文原文',
    fallbackBody: '该条目尚无经复核的英文版本，请查看中文页面中的原始内容。',
    fallbackDescription: '该条目尚无经复核的英文版本。',
    fallbackTitle: '联盟动态',
    heroDescription:
      '仅展示已复核来源与公开范围的内容。历史信息会标明来源、发布日期和当前状态，未发布稿不进入列表。',
    heroEyebrow: '公开动态',
    heroTitle: '联盟动态',
    metadataDescription: '发布已复核来源和公开范围的联盟动态，并标明历史信息与申请入口状态。',
    metadataTitle: '联盟动态',
    publishedLabel: '发布日期',
    sourceLinkLabel: '查看原始公开信息',
    sourcePublishedLabel: '来源发布日期',
    sourceReviewedLabel: '来源复核日期',
    sourceTitle: '公开来源',
    statusLabels: {
      historical: '时点信息',
      update: '已发布动态',
      withdrawn: '已撤回稿件',
    },
  },
}

const NEWS_STATUS_BY_SLUG: Readonly<Record<string, NewsPublicationStatus>> = {
  'alliance-website-launch': 'withdrawn',
  'cybersecurity-open-program': 'historical',
}

export function getNewsStatus(entry: NewsEntry): NewsPublicationStatus {
  return NEWS_STATUS_BY_SLUG[entry.slug] ?? 'update'
}

export function getPublishedNews(
  entries: readonly NewsEntry[] = NEWS_ENTRIES,
): readonly NewsEntry[] {
  return entries
    .filter((entry) => entry.published)
    .sort((left: NewsEntry, right: NewsEntry) => right.date.localeCompare(left.date))
}

export function getPublishedNewsBySlug(slug: string): NewsEntry | undefined {
  return getPublishedNews().find((entry) => entry.slug === slug)
}

export function localizeNewsEntryWithStatus(
  entry: NewsEntry,
  locale: Locale,
): NewsLocalizationResult {
  if (locale === 'zh') return { entry, isFallback: false }

  const overlay = NEWS_EN[entry.slug]
  if (overlay) return { entry: { ...entry, ...overlay }, isFallback: false }

  const fallback = NEWS_PAGE_COPY.en

  return {
    entry: {
      ...entry,
      applicationTargetId: undefined,
      body: [{ text: fallback.fallbackBody, type: 'paragraph' }],
      ctaHref: undefined,
      ctaLabel: undefined,
      description: fallback.fallbackDescription,
      title: fallback.fallbackTitle,
    },
    isFallback: true,
  }
}

export function localizeNewsEntry(entry: NewsEntry, locale: Locale): NewsEntry {
  return localizeNewsEntryWithStatus(entry, locale).entry
}

export function formatNewsDate(value: string, locale: Locale): string {
  const date = new Date(`${value}T00:00:00Z`)

  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(date)
}

export function getNewsSources(entry: NewsEntry): readonly FactSource[] {
  const sources = entry.facts?.flatMap((fact) => (fact.source ? [fact.source] : [])) ?? []

  return Array.from(new Map(sources.map((source) => [source.url, source])).values())
}
