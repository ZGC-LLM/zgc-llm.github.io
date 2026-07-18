import { expect, test } from '@playwright/test'

test.describe('conversion and privacy pages', () => {
  test('institution visitors see the participation route', async ({ page }) => {
    await page.goto('/join')
    const institutionMain = page.getByRole('main')
    await expect(institutionMain.getByRole('heading', { level: 1, name: '机构生态共建' })).toBeVisible()
    await expect(institutionMain.getByRole('heading', { level: 2, name: '参与流程' })).toBeVisible()

    // 加入申请 CTA 现内置飞书问卷默认链接（env 可覆盖），dev server 无 env 时渲染真实外链而非降级提示；
    // 容忍两种渲染态，避免与生产 env 配置耦合。
    const disabledEntry = institutionMain.locator('[aria-disabled="true"]', {
      hasText: '申请通道准备中',
    })
    const externalLink = institutionMain.getByRole('link', { name: /机构合作申请/ })

    if (await disabledEntry.count()) {
      await expect(disabledEntry.first()).toBeVisible()
    } else {
      await expect(externalLink).toBeVisible()
      await expect(externalLink).toHaveAttribute('target', '_blank')
      await expect(externalLink).toHaveAttribute('rel', /noopener/)
    }
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
