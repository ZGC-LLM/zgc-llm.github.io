import { expect, test } from '@playwright/test'

import { expectNoHorizontalOverflow, expectSingleH1, gotoRoute } from '../helpers/assertions'

const RESPONSIVE_WIDTHS = [360, 390, 768, 1024, 1279, 1280, 1440] as const
const REPRESENTATIVE_ROUTES = [
  '/',
  '/working-groups/cybersecurity/join',
  '/en/news/cybersecurity-open-program',
] as const

test.describe('mobile and responsive release evidence', () => {
  test('touch navigation closes on Escape, outside pointer and route changes', async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 390 })
    await gotoRoute(page, '/')

    const trigger = page.locator('header details.mobile-menu summary')
    await expect(trigger).toHaveAttribute('aria-label', '打开网站导航')
    await expect(trigger).toHaveAttribute('aria-controls', /\S/u)
    await trigger.click()
    const navigation = page.getByRole('navigation', { name: '移动导航' })
    await expect(navigation).toBeVisible()
    const submenuTrigger = navigation.getByRole('button', { name: '展开子菜单' })
    await expect(submenuTrigger).toHaveAttribute('aria-controls', /\S/u)
    await submenuTrigger.click()
    await expect(submenuTrigger).toHaveAttribute('aria-expanded', 'true')

    const targetSizes = await page
      .locator(
        'header details.mobile-menu summary, header .mobile-menu__panel a, header .mobile-menu__panel button',
      )
      .evaluateAll((elements) =>
        elements
          .filter((element) => element.getClientRects().length > 0)
          .map((element) => {
            const rectangle = element.getBoundingClientRect()

            return {
              height: rectangle.height,
              label: element.getAttribute('aria-label') ?? element.textContent?.trim() ?? '',
              width: rectangle.width,
            }
          }),
      )

    expect(targetSizes.length).toBeGreaterThan(5)
    for (const target of targetSizes) {
      expect(target.height, `${target.label} touch-target height`).toBeGreaterThanOrEqual(44)
      expect(target.width, `${target.label} touch-target width`).toBeGreaterThanOrEqual(44)
    }

    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await trigger.click()
    const finalMenuControl = page.locator('.mobile-menu__panel .language-toggle a').last()
    await finalMenuControl.focus()
    const outsideFocusTarget = page.getByRole('main').getByRole('link').first()
    await outsideFocusTarget.focus()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(outsideFocusTarget).toBeFocused()

    await trigger.click()
    await page.getByRole('main').click({ position: { x: 8, y: 8 } })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await trigger.click()
    await page
      .getByRole('navigation', { name: '移动导航' })
      .getByRole('link', { name: '联盟介绍' })
      .click()
    await expect(page).toHaveURL(/\/alliance\/$/u)
    await expect(page.locator('header details.mobile-menu summary')).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  test('reduced-motion preference removes meaningful transitions and smooth scrolling', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ height: 844, width: 390 })
    await gotoRoute(page, '/')

    const motion = await page.evaluate(() => {
      const trigger = document.querySelector('.mobile-menu__trigger')

      if (!trigger) throw new Error('mobile menu trigger is missing')

      const style = window.getComputedStyle(trigger)
      const durations = [
        ...style.transitionDuration.split(','),
        ...style.animationDuration.split(','),
      ]
        .map((value) => value.trim())
        .map((value) =>
          value.endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000,
        )

      return {
        maximumDurationMs: Math.max(...durations),
        scrollBehavior: window.getComputedStyle(document.documentElement).scrollBehavior,
      }
    })

    expect(motion.maximumDurationMs).toBeLessThanOrEqual(0.01)
    expect(motion.scrollBehavior).toBe('auto')
  })

  test('critical widths keep every representative page readable at the 1280px boundary', async ({
    page,
  }, testInfo) => {
    test.setTimeout(180_000)

    for (const width of RESPONSIVE_WIDTHS) {
      await page.setViewportSize({ height: width < 768 ? 844 : 900, width })

      for (const route of REPRESENTATIVE_ROUTES) {
        await gotoRoute(page, route)
        await expectSingleH1(page, route)
        await expectNoHorizontalOverflow(page, route)

        const desktopNavigation = page.getByRole('navigation', {
          name: route.startsWith('/en') ? 'Main navigation' : '主导航',
        })
        const mobileTrigger = page.locator('header details.mobile-menu summary')

        if (width >= 1280) {
          await expect(desktopNavigation).toBeVisible()
          await expect(mobileTrigger).toBeHidden()
        } else {
          await expect(desktopNavigation).toBeHidden()
          await expect(mobileTrigger).toBeVisible()
        }
      }

      await gotoRoute(page, '/')
      await testInfo.attach(`responsive-home-${width}px.png`, {
        body: await page.screenshot({ animations: 'disabled', fullPage: true }),
        contentType: 'image/png',
      })
    }
  })
})
