import { expect, test } from '@playwright/test'

test.describe('Members and news', () => {
  test('test_members_page_shows_published_governance_members', async ({ page }) => {
    await page.goto('/members')

    await expect(page).toHaveTitle(/成员伙伴/)
    await expect(page.locator('main#main-content')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: '成员伙伴' })).toBeVisible()
    // MEMBERS 已收录已公开具名的理事会/监事会单位，展示分组目录而非空态
    await expect(page.getByRole('heading', { level: 3, name: '清华大学' })).toBeVisible()
    await expect(page.getByText('成员信息整理中')).toHaveCount(0)
  })

  test('test_news_page_lists_the_published_launch_announcement', async ({ page }) => {
    await page.goto('/news')

    await expect(page).toHaveTitle(/新闻动态/)
    await expect(page.locator('main#main-content')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: '新闻动态' })).toBeVisible()
    await expect(
      page.getByRole('link', { name: '联盟官方网站正式上线' }).first(),
    ).toHaveAttribute('href', '/news/alliance-website-launch')
  })

  test('test_news_detail_unknown_slug_returns_site_not_found', async ({ page }) => {
    const response = await page.goto('/news/not-a-published-entry')

    expect(response?.status()).toBe(404)
    await expect(page.locator('main#main-content')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: '页面未找到' })).toBeVisible()
  })
})
