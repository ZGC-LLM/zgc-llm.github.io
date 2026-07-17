import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/中关村自主大模型产业联盟/)

    const heading = page.locator('h1').first()

    await expect(heading).toContainText('汇聚自主大模型力量')
  })
})
