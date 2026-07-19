import { expect, test } from '@playwright/test'

import {
  expectApplicationChannelsUnavailable,
  expectSingleH1,
  expectVisibleFocusIndicator,
  gotoRoute,
} from '../helpers/assertions'

test.describe('cross-browser release journeys', () => {
  test('desktop navigation exposes its grouped member destinations', async ({ page }) => {
    await gotoRoute(page, '/')

    const navigation = page.getByRole('navigation', { name: '主导航' })
    const members = navigation.getByRole('button', { name: '成员伙伴' })
    await members.press('Enter')
    await expect(members).toHaveAttribute('aria-expanded', 'true')

    const allianceMembers = navigation.getByRole('link', { name: '联盟成员' })
    await expectVisibleFocusIndicator(allianceMembers)
    await allianceMembers.press('Enter')

    await expect(page).toHaveURL(/\/members\/$/u)
    await expect(page.getByRole('heading', { level: 1, name: '联盟成员公示' })).toBeVisible()
  })

  test('English visitor can move from the catalog to working-group details', async ({ page }) => {
    await gotoRoute(page, '/en/working-groups')
    await expect(page.getByRole('heading', { level: 1, name: 'Working Groups' })).toBeVisible()

    await page
      .getByRole('main')
      .locator('a[href$="/en/working-groups/cybersecurity/"]')
      .first()
      .click()
    await expect(page).toHaveURL(/\/en\/working-groups\/cybersecurity\/$/u)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Cybersecurity Working Group' }),
    ).toBeVisible()

    await page
      .getByRole('main')
      .locator('a[href$="/en/working-groups/cybersecurity/members/"]')
      .first()
      .click()
    await expect(page).toHaveURL(/\/en\/working-groups\/cybersecurity\/members\/$/u)
    await expectSingleH1(page, '/en/working-groups/cybersecurity/members')
  })

  test('published news remains discoverable and its reviewed application route stays closed', async ({
    page,
  }) => {
    await gotoRoute(page, '/news')
    await page
      .getByRole('main')
      .locator('a[href$="/news/cybersecurity-open-program/"]')
      .first()
      .click()

    await expect(page).toHaveURL(/\/news\/cybersecurity-open-program\/$/u)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: '网络安全人员开放计划：2026 年 7 月公开信息',
      }),
    ).toBeVisible()
    await expectApplicationChannelsUnavailable(page)
    await expect(page.locator('main a[href^="https://www.csreviews.cn/"]')).toHaveAttribute(
      'rel',
      /noopener/iu,
    )
  })

  test('Alliance participation explains privacy before exposing any application action', async ({
    page,
  }) => {
    await gotoRoute(page, '/en/join')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Work with the Alliance' }),
    ).toBeVisible()
    await expectApplicationChannelsUnavailable(page)
    await expect(
      page.getByText(
        'Information is handled by the operator identified on the destination page; this site does not receive or store application-form data.',
        { exact: false },
      ),
    ).toBeVisible()

    const privacyLink = page
      .getByRole('contentinfo')
      .getByRole('link', { name: 'Privacy', exact: true })
    await expect(privacyLink).toBeVisible()
    await privacyLink.click()
    await expect(page).toHaveURL(/\/en\/privacy\/$/u)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Application information notice' }),
    ).toBeVisible()
  })

  test('locale switch preserves a published news slug', async ({ page }) => {
    await gotoRoute(page, '/news/cybersecurity-open-program')
    await page.getByRole('link', { name: '切换语言 / Switch language: English' }).first().click()

    await expect(page).toHaveURL(/\/en\/news\/cybersecurity-open-program\/$/u)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Cybersecurity access program: July 2026 public notice',
      }),
    ).toBeVisible()
  })

  test('missing dynamic content has localized recovery without indexable metadata', async ({
    page,
  }) => {
    for (const route of ['/working-groups/not-published', '/en/news/alliance-website-launch']) {
      await gotoRoute(page, route, 404)
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/iu)
      await expect(
        page.getByRole('navigation', { name: /(?:错误恢复导航|Error recovery navigation)/u }),
      ).toBeVisible()
    }
  })
})
