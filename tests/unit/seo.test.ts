import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PUBLIC_STATIC_ROUTES, SITE_URL } from '@/config/site'

vi.mock('@/content/news', () => ({
  getPublishedNews: () => [
    {
      body: [],
      category: 'news',
      date: '2026-07-15',
      description: '已公开动态',
      published: true,
      slug: 'published-update',
      title: '已公开动态',
    },
  ],
}))

import NotFound from '@/app/(frontend)/not-found'
import sitemap from '@/app/(frontend)/sitemap'
import robots from '@/app/robots'

describe('SEO metadata routes', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('includes every public static route on the canonical site', () => {
    const urls = sitemap().map(({ url }) => url)

    for (const route of PUBLIC_STATIC_ROUTES) {
      expect(urls).toContain(new URL(route, SITE_URL).toString())
    }
  })

  it('includes published news without exposing administrative routes', () => {
    const urls = sitemap().map(({ url }) => new URL(url).pathname)

    expect(urls).toContain('/news/published-update')
    expect(urls.some((url) => url.startsWith('/admin'))).toBe(false)
    expect(urls.some((url) => url.startsWith('/api'))).toBe(false)
  })

  it('allows the public site while blocking the admin and API surfaces', () => {
    const metadata = robots()

    expect(metadata.rules).toEqual(
      expect.objectContaining({
        allow: '/',
        disallow: expect.arrayContaining(['/admin', '/api']),
      }),
    )
    expect(metadata.sitemap).toBe(new URL('/sitemap.xml', SITE_URL).toString())
    expect(metadata.host).toBe(SITE_URL)
  })
})

describe('not found page', () => {
  it('explains the missing page and offers a route back home', () => {
    render(createElement(NotFound))

    expect(screen.getByRole('heading', { level: 1, name: /页面未找到/ })).toBeTruthy()
    expect(screen.getByRole('link', { name: /返回首页/ }).getAttribute('href')).toBe('/')
  })
})
