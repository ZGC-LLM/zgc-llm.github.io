import { expect, test } from '@playwright/test'

test.describe('conversion and privacy pages', () => {
  test('institution visitors see the participation route', async ({ page }) => {
    await page.goto('/join')
    const institutionMain = page.getByRole('main')
    await expect(institutionMain.getByRole('heading', { level: 1, name: '机构生态共建' })).toBeVisible()
    await expect(institutionMain.getByRole('heading', { level: 2, name: '参与流程' })).toBeVisible()
    await expect(institutionMain).toContainText('申请通道准备中，请通过官网联系方式与联盟联系。')
  })

  test('privacy page explains the external service boundary', async ({ page }) => {
    await page.goto('/privacy')

    const main = page.getByRole('main')
    await expect(main.getByRole('heading', { level: 1, name: '隐私说明' })).toBeVisible()
    await expect(main).toContainText('官网本身不收集或存储您的申请信息')
    await expect(main).toContainText('独立的外部服务')
    await expect(main).toContainText('以表单内的隐私说明为准')
  })
})
