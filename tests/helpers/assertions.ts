import { expect, type Locator, type Page } from '@playwright/test'

export async function gotoRoute(page: Page, path: string, expectedStatus = 200): Promise<void> {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' })

  expect(response, `${path} should return a document response`).not.toBeNull()
  expect(response?.status(), `${path} should return HTTP ${expectedStatus}`).toBe(expectedStatus)
}

export async function expectSingleH1(page: Page, path: string): Promise<void> {
  await expect(
    page.locator('main h1'),
    `${path} should expose exactly one main heading`,
  ).toHaveCount(1)
}

export async function expectNoHorizontalOverflow(page: Page, path: string): Promise<void> {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))

  expect(
    dimensions.scrollWidth,
    `${path} should not overflow horizontally (${dimensions.scrollWidth}px > ${dimensions.clientWidth}px)`,
  ).toBeLessThanOrEqual(dimensions.clientWidth)
}

export async function expectVisibleFocusIndicator(locator: Locator): Promise<void> {
  await locator.focus()
  await expect(locator).toBeFocused()

  const focusState = await locator.evaluate((element) => {
    const style = window.getComputedStyle(element)

    return {
      boxShadow: style.boxShadow,
      focusVisible: element.matches(':focus-visible'),
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    }
  })

  expect(focusState.focusVisible, 'keyboard focus should match :focus-visible').toBe(true)
  expect(
    (focusState.outlineStyle !== 'none' && focusState.outlineWidth > 0) ||
      focusState.boxShadow !== 'none',
    'keyboard focus should have a visible outline or shadow',
  ).toBe(true)
}

export async function expectApplicationChannelsUnavailable(
  page: Page,
  expectedMinimum = 1,
): Promise<void> {
  const unavailable = page.locator('[aria-disabled="true"].external-application__unavailable')

  expect(
    await unavailable.count(),
    'the page should expose its unavailable application channel as non-interactive copy',
  ).toBeGreaterThanOrEqual(expectedMinimum)
  await expect(unavailable.first()).toBeVisible()
  await expect(page.locator('a.external-application__link')).toHaveCount(0)
}
