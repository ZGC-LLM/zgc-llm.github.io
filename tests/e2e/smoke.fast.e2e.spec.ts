import { expect, test } from '@playwright/test'

import {
  expectApplicationChannelsUnavailable,
  expectNoHorizontalOverflow,
  expectSingleH1,
  gotoRoute,
} from '../helpers/assertions'
import { canonicalUrl } from '../helpers/routes'

test.describe('required Chromium release gate', () => {
  test('Chinese visitor can discover and open the working-group participation path', async ({
    page,
  }) => {
    await gotoRoute(page, '/')
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: '连接大模型技术与产业力量，推动开放、安全、务实的协作',
      }),
    ).toBeVisible()

    await page.getByRole('main').getByRole('link', { name: '查看工作组' }).click()
    await expect(page).toHaveURL(/\/working-groups\/$/u)
    await page
      .getByRole('main')
      .locator('a[href$="/working-groups/cybersecurity/"]')
      .first()
      .click()
    await expect(page).toHaveURL(/\/working-groups\/cybersecurity\/$/u)
    await expect(page.getByRole('heading', { level: 1, name: '网络安全工作组' })).toBeVisible()

    await page
      .getByRole('main')
      .locator('a[href$="/working-groups/cybersecurity/join/"]')
      .first()
      .click()
    await expect(page).toHaveURL(/\/working-groups\/cybersecurity\/join\/$/u)
    await expect(page.getByRole('heading', { level: 1, name: '参与工作组' })).toBeVisible()
  })

  test('application calls to action fail closed when no reviewed endpoint is configured', async ({
    page,
  }) => {
    for (const route of [
      '/join',
      '/working-groups/cybersecurity/join',
      '/news/cybersecurity-open-program',
    ]) {
      await gotoRoute(page, route)
      await expectApplicationChannelsUnavailable(page)
    }
  })

  test('language switch keeps a dynamic route and can return to Chinese', async ({ page }) => {
    await gotoRoute(page, '/working-groups/cybersecurity/members')

    await page.getByRole('link', { name: '切换语言 / Switch language: English' }).first().click()
    await expect(page).toHaveURL(/\/en\/working-groups\/cybersecurity\/members\/$/u)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    await page.getByRole('link', { name: '切换语言 / Switch language: 中文' }).first().click()
    await expect(page).toHaveURL(/\/working-groups\/cybersecurity\/members\/$/u)
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
  })

  test('mobile menu closes on Escape and restores focus', async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 390 })
    await gotoRoute(page, '/')

    const trigger = page.locator('header details.mobile-menu summary')
    await expect(trigger).toHaveAttribute('aria-label', '打开网站导航')
    await expect(trigger).toHaveAttribute('aria-controls', /\S/u)
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('navigation', { name: '移动导航' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()
    await expectNoHorizontalOverflow(page, '/')
  })

  test('system theme follows OS changes across published and 404 documents', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await gotoRoute(page, '/en')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    expect(await page.locator('html').evaluate((element) => element.style.colorScheme)).toBe('dark')

    await page.emulateMedia({ colorScheme: 'light' })
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    expect(await page.locator('html').evaluate((element) => element.style.colorScheme)).toBe(
      'light',
    )

    await gotoRoute(page, '/en/alliance')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    expect(await page.locator('html').evaluate((element) => element.style.colorScheme)).toBe(
      'light',
    )

    await page.emulateMedia({ colorScheme: 'dark' })
    await gotoRoute(page, '/en/not-a-public-route', 404)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    expect(await page.locator('html').evaluate((element) => element.style.colorScheme)).toBe('dark')
  })

  test('published pages expose canonical metadata and one main heading', async ({ page }) => {
    for (const route of ['/', '/en/news/cybersecurity-open-program']) {
      await gotoRoute(page, route)
      await expectSingleH1(page, route)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        canonicalUrl(route),
      )
      expect(await page.locator('meta[name="robots"][content*="noindex" i]').count()).toBe(0)
    }
  })

  test('unknown and withdrawn news routes are real non-indexable 404 documents', async ({
    page,
  }) => {
    for (const route of [
      '/this-route-does-not-exist',
      '/news/alliance-website-launch',
      '/en/news/alliance-website-launch',
    ]) {
      await gotoRoute(page, route, 404)
      await expect(page.locator('main h1')).toBeVisible()
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/iu)
    }
  })
})
