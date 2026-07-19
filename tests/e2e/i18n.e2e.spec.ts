import { expect, test } from '@playwright/test'

test.describe('i18n 英文子树 /en', () => {
  test('英文首页渲染 lang=en 与英文 chrome', async ({ page }) => {
    await page.goto('/en')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Working Groups' })).toBeVisible()
  })

  test('英文静态页可访问且 lang=en（联盟页正文已英文化）', async ({ page }) => {
    await page.goto('/en/alliance')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('main#main-content')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Our Purpose' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Shared Values' })).toBeVisible()
  })

  test('英文动态新闻详情页可访问', async ({ page }) => {
    await page.goto('/en/news/cybersecurity-open-program')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('main#main-content')).toBeVisible()
  })

  test('中文根路径不变（zh 页 lang=zh-CN）', async ({ page }) => {
    await page.goto('/alliance')

    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
  })

  test('语言切换：中文页 → 英文同页 → 切回中文', async ({ page }) => {
    await page.goto('/alliance')

    await page.getByRole('link', { name: '切换语言 / Switch language' }).first().click()
    await expect(page).toHaveURL(/\/en\/alliance\/?$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    await page.getByRole('link', { name: '切换语言 / Switch language' }).first().click()
    await expect(page).toHaveURL(/\/alliance\/?$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
  })
})
