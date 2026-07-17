import { expect, test } from '@playwright/test'

test.describe('home, alliance, and working groups', () => {
  test('home communicates the alliance and institution-first participation path', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/首页.*中关村自主大模型产业联盟/)
    await expect(
      page.getByRole('heading', { level: 1, name: /汇聚自主大模型力量/ }),
    ).toBeVisible()
    await expect(page.getByRole('main')).toHaveAttribute('id', 'main-content')

    const institutionLink = page.getByRole('main').getByRole('link', { name: '机构合作申请' })
    const professionalLink = page.getByRole('main').getByRole('link', { name: '个人专业用户加入' })

    await expect(institutionLink).toHaveAttribute('href', '/join')
    await expect(institutionLink).toHaveClass(/btn--primary/)
    await expect(professionalLink).toHaveAttribute('href', '/professionals')
    await expect(professionalLink).toHaveClass(/btn--ghost/)
    await expect(page.getByRole('link', { name: /了解网络安全生态/ })).toHaveAttribute(
      'href',
      '/cybersecurity',
    )
    await expect(page.getByText(/项目初始化版本|进入内容后台|管理后台/)).toHaveCount(0)
  })

  test('alliance introduction is reachable and structured', async ({ page }) => {
    await page.goto('/alliance')

    await expect(page).toHaveTitle(/联盟介绍.*中关村自主大模型产业联盟/)
    await expect(page.getByRole('heading', { level: 1, name: '联盟介绍' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: '联盟宗旨' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: '协作机制' })).toBeVisible()
  })

  test('working groups exposes the confirmed cybersecurity initiative', async ({ page }) => {
    await page.goto('/working-groups')

    await expect(page).toHaveTitle(/工作组.*中关村自主大模型产业联盟/)
    await expect(page.getByRole('heading', { level: 1, name: '工作组', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3, name: '网络安全生态' })).toBeVisible()
    await expect(page.getByRole('link', { name: /查看网络安全生态/ })).toHaveAttribute(
      'href',
      '/cybersecurity',
    )
  })
})
