import { cleanup, render, screen } from '@testing-library/react'
import { buildAlternates } from '@/i18n/routing'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { MemberSummary, NewsEntry } from '@/types/content'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

import MembersPage, {
  MembersDirectory,
  metadata as membersMetadata,
} from '@/app/(frontend)/members/page'
import NewsArticlePage, {
  createNewsMetadata,
  createNewsStaticParams,
  NewsArticle,
} from '@/app/(frontend)/news/[slug]/page'
import NewsPage, { metadata as newsMetadata, NewsList } from '@/app/(frontend)/news/page'
import { NEWS_ENTRIES } from '@/content/news'

afterEach(cleanup)

const publishedEntry: NewsEntry = {
  body: [
    { text: '阶段进展', type: 'heading' },
    { text: '<script>alert("unsafe")</script>', type: 'paragraph' },
    { items: ['开放协作', '审慎发布'], type: 'list' },
  ],
  category: 'result',
  date: '2026-07-15',
  description: '经确认可公开的阶段信息。',
  published: true,
  slug: 'confirmed-update',
  title: '已确认动态',
}

const draftEntry: NewsEntry = {
  ...publishedEntry,
  body: [],
  published: false,
  slug: 'internal-draft',
  title: '内部草稿',
}

describe('members page', () => {
  it('test_members_page_populated_members_renders_directory', () => {
    render(<MembersPage />)

    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content')
    expect(screen.getByRole('heading', { level: 1, name: '成员伙伴' })).toBeTruthy()
    // MEMBERS 已收录已公开具名的理事会/监事会单位，渲染分组目录而非空态
    expect(screen.getByText('清华大学')).toBeTruthy()
    expect(screen.queryByText('成员信息整理中')).toBeNull()
  })

  it('test_members_directory_empty_members_renders_authorization_state', () => {
    render(<MembersDirectory members={[]} />)

    expect(screen.getByText('成员信息整理中')).toBeTruthy()
  })

  it('test_members_directory_authorized_members_groups_by_member_type', () => {
    const members: readonly MemberSummary[] = [
      { id: 'founder', name: '获授权发起成员', type: 'founding' },
      { id: 'researcher', name: '获授权科研伙伴', type: 'research' },
    ]

    render(<MembersDirectory members={members} />)

    expect(screen.getByRole('heading', { name: '发起成员' })).toBeTruthy()
    expect(screen.getByText('获授权发起成员')).toBeTruthy()
    expect(screen.getByRole('heading', { name: '科研伙伴' })).toBeTruthy()
    expect(screen.getByText('获授权科研伙伴')).toBeTruthy()
  })

  it('test_members_directory_skipped_middle_group_still_alternates_section_style', () => {
    const members: readonly MemberSummary[] = [
      { id: 'founder', name: '获授权发起成员', type: 'founding' },
      { id: 'researcher', name: '获授权科研伙伴', type: 'research' },
    ]

    render(<MembersDirectory members={members} />)

    const foundingHeading = screen.getByRole('heading', { name: '发起成员' })
    const researchHeading = screen.getByRole('heading', { name: '科研伙伴' })
    const foundingSection = foundingHeading.closest('section')
    const researchSection = researchHeading.closest('section')

    expect(foundingSection).not.toBeNull()
    expect(researchSection).not.toBeNull()
    // 契约：跳过中间组后，渲染出的两组仍交替——发起成员为普通区块、科研伙伴为浅色区块
    expect(foundingSection?.classList.contains('block')).toBe(true)
    expect(foundingSection?.classList.contains('block--subtle')).toBe(false)
    expect(researchSection?.classList.contains('block')).toBe(true)
    expect(researchSection?.classList.contains('block--subtle')).toBe(true)
  })

  it('test_members_metadata_page_has_independent_title_and_canonical', () => {
    expect(membersMetadata.title).toBe('成员伙伴')
    expect(membersMetadata.description).toContain('公开授权')
    expect(membersMetadata.alternates).toEqual(buildAlternates('/members', 'zh'))
  })
})

describe('news list page', () => {
  it('renders the published inaugural launch announcement', () => {
    render(<NewsPage />)

    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content')
    expect(screen.getByRole('heading', { level: 1, name: '新闻动态' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '联盟官方网站正式上线' }).getAttribute('href')).toBe(
      '/news/alliance-website-launch',
    )
  })

  it('test_news_page_empty_news_renders_honest_state', () => {
    render(<NewsList entries={[]} />)

    expect(screen.getByText('最新动态即将发布')).toBeTruthy()
  })

  it('test_news_list_mixed_entries_renders_only_published_news', () => {
    render(<NewsList entries={[draftEntry, publishedEntry]} />)

    expect(screen.getByRole('link', { name: '已确认动态' }).getAttribute('href')).toBe(
      '/news/confirmed-update',
    )
    expect(screen.queryByText('内部草稿')).toBeNull()
  })

  it('test_news_metadata_page_has_independent_title_and_canonical', () => {
    expect(newsMetadata.title).toBe('新闻动态')
    expect(newsMetadata.description).toContain('联盟动态')
    expect(newsMetadata.alternates).toEqual(buildAlternates('/news', 'zh'))
  })
})

describe('news detail page', () => {
  it('test_news_article_controlled_blocks_renders_without_arbitrary_html', () => {
    const { container } = render(<NewsArticle entry={publishedEntry} />)

    expect(screen.getByRole('heading', { level: 1, name: '已确认动态' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '阶段进展' })).toBeTruthy()
    expect(screen.getByText('<script>alert("unsafe")</script>')).toBeTruthy()
    expect(screen.getByRole('list').children).toHaveLength(2)
    expect(container.querySelector('script')).toBeNull()
  })

  it('test_news_article_renders_https_cta_as_safe_external_link', () => {
    render(
      <NewsArticle
        entry={{
          ...publishedEntry,
          ctaHref: 'https://example.feishu.cn/share/base/form/abc',
          ctaLabel: '填写申请',
        }}
      />,
    )

    const cta = screen.getByRole('link', { name: '填写申请' })
    expect(cta.getAttribute('href')).toBe('https://example.feishu.cn/share/base/form/abc')
    expect(cta.getAttribute('target')).toBe('_blank')
    expect(cta.getAttribute('rel')).toBe('noreferrer noopener')
  })

  it('test_news_article_drops_non_https_cta', () => {
    render(
      <NewsArticle
        entry={{ ...publishedEntry, ctaHref: 'http://insecure.example/form', ctaLabel: '填写申请' }}
      />,
    )

    expect(screen.queryByRole('link', { name: '填写申请' })).toBeNull()
  })

  it.each([
    { case: 'ctaHref only, no label', cta: { ctaHref: 'https://example.feishu.cn/form' } },
    { case: 'ctaLabel only, no href', cta: { ctaLabel: '填写申请' } },
    { case: 'empty href', cta: { ctaHref: '', ctaLabel: '填写申请' } },
    { case: 'empty label', cta: { ctaHref: 'https://example.feishu.cn/form', ctaLabel: '' } },
    { case: 'malformed href', cta: { ctaHref: 'not-a-url', ctaLabel: '填写申请' } },
  ])('test_news_article_renders_no_cta_when_config_incomplete: $case', ({ cta }) => {
    render(<NewsArticle entry={{ ...publishedEntry, ...cta }} />)

    expect(screen.queryByRole('link', { name: '填写申请' })).toBeNull()
  })

  it('test_news_article_open_program_entry_renders_feishu_cta', () => {
    const entry = NEWS_ENTRIES.find((item) => item.slug === 'cybersecurity-open-program')
    expect(entry).toBeDefined()

    render(<NewsArticle entry={entry!} />)

    const cta = screen.getByRole('link', { name: entry!.ctaLabel! })
    expect(cta.getAttribute('href')).toBe(entry!.ctaHref)
    expect(cta.getAttribute('href')?.startsWith('https://')).toBe(true)
    expect(cta.getAttribute('target')).toBe('_blank')
    expect(cta.getAttribute('rel')).toBe('noreferrer noopener')
  })

  it('test_news_static_params_mixed_entries_includes_only_published_slugs', () => {
    expect(createNewsStaticParams([draftEntry, publishedEntry])).toEqual([
      { slug: 'confirmed-update' },
    ])
  })

  it('test_news_metadata_published_entry_uses_entry_content', () => {
    const metadata = createNewsMetadata(publishedEntry)

    expect(metadata.title).toBe('已确认动态')
    expect(metadata.description).toBe('经确认可公开的阶段信息。')
    expect(metadata.alternates).toEqual(buildAlternates('/news/confirmed-update', 'zh'))
  })

  it.each(['internal-draft', 'missing-entry'])(
    'test_news_detail_unknown_or_unpublished_slug_returns_not_found: %s',
    async (slug) => {
      await expect(NewsArticlePage({ params: Promise.resolve({ slug }) })).rejects.toThrow(
        'NEXT_NOT_FOUND',
      )
    },
  )
})
