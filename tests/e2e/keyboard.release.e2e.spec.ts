import { expect, test } from '@playwright/test'

import { expectVisibleFocusIndicator, gotoRoute } from '../helpers/assertions'

test.describe('keyboard release evidence', () => {
  test('skip link is the first keyboard stop and moves focus to main content', async ({ page }) => {
    await gotoRoute(page, '/')
    await page.keyboard.press('Tab')

    const skipLink = page.getByRole('link', { name: '跳到主要内容' })
    await expectVisibleFocusIndicator(skipLink)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main-content$/u)
    await expect(page.locator('#main-content')).toBeFocused()
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('main-content')
  })

  test('desktop member submenu supports Enter, Space and Escape with focus return', async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1280 })
    await gotoRoute(page, '/')

    const navigation = page.getByRole('navigation', { name: '主导航' })
    const trigger = navigation.getByRole('button', { name: '成员伙伴' })
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(navigation.getByRole('link', { name: '联盟成员' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()

    await page.keyboard.press('Space')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Tab')
    await expect(navigation.getByRole('link', { name: '联盟成员' })).toBeFocused()
  })

  test('mobile navigation Escape restores focus to its trigger', async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 390 })
    await gotoRoute(page, '/en')

    const trigger = page.locator('header details.mobile-menu summary')
    await expect(trigger).toHaveAttribute('aria-label', 'Open site navigation')
    await expect(trigger).toHaveAttribute('aria-controls', /\S/u)
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()

    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await page.locator('.mobile-menu__panel .language-toggle a').last().focus()
    await page.keyboard.press('Tab')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(page.getByRole('main').getByRole('link').first()).toBeFocused()
  })

  test('language switch and primary route remain keyboard operable', async ({ page }) => {
    await gotoRoute(page, '/alliance')

    const language = page.getByRole('link', { name: '切换语言 / Switch language: English' }).first()
    await language.focus()
    await expectVisibleFocusIndicator(language)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/en\/alliance\/$/u)

    const primary = page.getByRole('link', { name: 'Work with the Alliance' }).first()
    await primary.focus()
    await expectVisibleFocusIndicator(primary)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/en\/join\/$/u)
  })

  test('404 recovery routes are keyboard operable', async ({ page }) => {
    await gotoRoute(page, '/en/news/alliance-website-launch', 404)

    const recovery = page.getByRole('link', { name: 'English home' })
    await recovery.focus()
    await expectVisibleFocusIndicator(recovery)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/en\/$/u)
  })
})
