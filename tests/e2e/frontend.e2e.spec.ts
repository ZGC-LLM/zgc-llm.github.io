import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/中关村自主大模型产业联盟/)

    const heading = page.locator('h1').first()

    await expect(heading).toContainText('汇聚自主大模型力量')
  })
})
