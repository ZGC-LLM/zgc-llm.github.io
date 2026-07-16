import { cleanup, render, screen } from '@testing-library/react'
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
  it('test_members_page_empty_members_renders_authorization_state', () => {
    render(<MembersPage />)

    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content')
    expect(screen.getByRole('heading', { level: 1, name: '成员伙伴' })).toBeTruthy()
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

  it('test_members_metadata_page_has_independent_title_and_canonical', () => {
    expect(membersMetadata.title).toBe('成员伙伴')
    expect(membersMetadata.description).toContain('公开授权')
    expect(membersMetadata.alternates).toEqual({ canonical: '/members' })
  })
})

describe('news list page', () => {
  it('test_news_page_empty_news_renders_honest_state', () => {
    render(<NewsPage />)

    expect(screen.getByRole('main').getAttribute('id')).toBe('main-content')
    expect(screen.getByRole('heading', { level: 1, name: '新闻动态' })).toBeTruthy()
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
    expect(newsMetadata.alternates).toEqual({ canonical: '/news' })
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

  it('test_news_static_params_mixed_entries_includes_only_published_slugs', () => {
    expect(createNewsStaticParams([draftEntry, publishedEntry])).toEqual([
      { slug: 'confirmed-update' },
    ])
  })

  it('test_news_metadata_published_entry_uses_entry_content', () => {
    const metadata = createNewsMetadata(publishedEntry)

    expect(metadata.title).toBe('已确认动态')
    expect(metadata.description).toBe('经确认可公开的阶段信息。')
    expect(metadata.alternates).toEqual({ canonical: '/news/confirmed-update' })
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
