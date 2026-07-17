import { expect, test } from '@playwright/test'

const publicRoutes = [
  '/',
  '/alliance',
  '/working-groups',
  '/cybersecurity',
  '/members',
  '/news',
  '/join',
  '/professionals',
  '/privacy',
] as const

const criticalViewports = [
  { height: 844, name: 'mobile', width: 390 },
  { height: 1024, name: 'tablet', width: 768 },
  { height: 900, name: 'desktop', width: 1280 },
] as const

test.describe('site integration', () => {
  test('mobile navigation remains usable without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const menu = page.locator('header details.mobile-menu')

    await menu.locator('summary').click()
    const navigation = page.getByRole('navigation', { name: '移动导航' })
    await expect(navigation.getByRole('link', { name: '联盟介绍' })).toBeVisible()
    await expect(navigation.getByRole('link', { name: '网络安全生态' })).toBeVisible()

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )

    expect(hasHorizontalOverflow).toBe(false)
  })

  test('header collapses to the mobile menu below the 1280px breakpoint', async ({ page }) => {
    // v2 断点为 1280px：完整控件（品牌名 + 5 个中文导航 + 两条 CTA + 主题/语言 toggle）
    // 自然宽度约 1220px，低于 1280 收起为汉堡，避免 flex 挤压导致中文换行。
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto('/')

    await expect(page.getByRole('navigation', { name: '主导航' })).toBeHidden()
    const trigger = page.locator('header details.mobile-menu summary')
    await expect(trigger).toBeVisible()

    // 断点下沿边界：1279px（恰低于 1280）仍应收起为汉堡
    await page.setViewportSize({ width: 1279, height: 768 })
    await expect(page.getByRole('navigation', { name: '主导航' })).toBeHidden()
    await expect(trigger).toBeVisible()

    await trigger.click()
    await expect(
      page.getByRole('navigation', { name: '移动导航' }).getByRole('link', { name: '网络安全生态' }),
    ).toBeVisible()
  })

  test('desktop navigation is shown at the 1280px breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    await expect(
      page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '网络安全生态' }),
    ).toBeVisible()
    await expect(page.locator('header details.mobile-menu summary')).toBeHidden()
  })

  test('primary journey reaches the ecosystem and application pages', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('main').getByRole('link', { name: '了解网络安全生态' }).click()
    await expect(page).toHaveURL(/\/cybersecurity$/)

    await page.getByRole('main').getByRole('link', { name: '机构合作申请' }).last().click()
    await expect(page).toHaveURL(/\/join$/)
    await expect(page.getByRole('heading', { level: 1, name: '机构生态共建' })).toBeVisible()
  })

  test('unknown public route uses the branded not-found page', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist')

    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1, name: '页面未找到' })).toBeVisible()
    await expect(page.getByRole('link', { name: '返回首页' })).toBeVisible()
  })

  for (const viewport of criticalViewports) {
    test(`${viewport.name} public pages have one h1 and no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ height: viewport.height, width: viewport.width })

      for (const route of publicRoutes) {
        await page.goto(route)
        expect(await page.locator('main h1').count(), `${route} should contain one h1`).toBe(1)

        const hasHorizontalOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        )
        expect(hasHorizontalOverflow, `${route} should not overflow at ${viewport.width}px`).toBe(
          false,
        )
      }
    })
  }
})
