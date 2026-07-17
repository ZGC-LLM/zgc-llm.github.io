import { expect, test } from '@playwright/test'

test.describe('工作组导航链路', () => {
  test('工作组总览卡片跳转到独立的工作组页面（而非直接跳到生态专题页）', async ({ page }) => {
    await page.goto('/working-groups')
    const main = page.locator('main#main-content')

    await expect(main.getByRole('heading', { level: 1, name: '工作组' })).toBeVisible()

    const cardLink = main.getByRole('link', { name: '查看网络安全工作组' })
    await expect(cardLink).toHaveAttribute('href', '/working-groups/cybersecurity')

    await cardLink.click()
    // next dev 首次访问 [slug] 路由需按需编译，客户端跳转可能超过默认 5s；放宽超时并容忍尾斜杠
    await expect(page).toHaveURL(/\/working-groups\/cybersecurity\/?$/, { timeout: 20000 })
    await expect(
      page.locator('main#main-content').getByRole('heading', { level: 1, name: '网络安全工作组' }),
    ).toBeVisible({ timeout: 20000 })
  })

  test('工作组介绍页展示职责/研究方向/负责人/成果四个区块及三个下游入口', async ({ page }) => {
    await page.goto('/working-groups/cybersecurity')
    const main = page.locator('main#main-content')

    await expect(main.getByRole('heading', { level: 1, name: '网络安全工作组' })).toBeVisible()
    await expect(main.getByRole('heading', { level: 2, name: '持续推进的核心职责' })).toBeVisible()
    await expect(main.getByRole('heading', { level: 2, name: '聚焦的研究与验证方向' })).toBeVisible()
    await expect(main.getByRole('heading', { level: 2, name: '统筹与共建单位' })).toBeVisible()
    await expect(main.getByRole('heading', { level: 2, name: '对外发布的阶段性成果' })).toBeVisible()

    const membersLink = main.getByRole('link', { name: '查看成员名单' })
    const joinLink = main.getByRole('link', { name: '加入网络安全工作组' })
    const ecosystemLink = main.getByRole('link', { name: '查看生态专题' })

    await expect(membersLink).toBeVisible()
    await expect(membersLink).toHaveAttribute('href', '/working-groups/cybersecurity/members')

    await expect(joinLink).toBeVisible()
    await expect(joinLink).toHaveAttribute('href', '/working-groups/cybersecurity/join')

    await expect(ecosystemLink).toBeVisible()
    await expect(ecosystemLink).toHaveAttribute('href', '/cybersecurity')
  })

  test('成员名单页在未获授权数据时展示整理中的空态占位', async ({ page }) => {
    await page.goto('/working-groups/cybersecurity/members')
    const main = page.locator('main#main-content')

    await expect(main.getByRole('heading', { level: 1, name: '成员名单' })).toBeVisible()
    await expect(main.getByRole('heading', { level: 3, name: '成员名单整理中' })).toBeVisible()
    await expect(
      main.getByText('成员名单将在获得公开授权后发布', { exact: false }),
    ).toBeVisible()
    await expect(main.getByRole('link', { name: '申请加入本工作组' })).toHaveAttribute(
      'href',
      '/working-groups/cybersecurity/join',
    )
  })

  test('加入工作组页提供专业用户申请入口（按当前渲染状态断言）', async ({ page }) => {
    await page.goto('/working-groups/cybersecurity/join')
    const main = page.locator('main#main-content')

    await expect(main.getByRole('heading', { level: 1, name: '加入工作组' })).toBeVisible()

    const disabledEntry = main.locator('[aria-disabled="true"]', { hasText: '申请通道准备中' })
    const externalLink = main.getByRole('link', { name: '专业用户申请' })

    if (await disabledEntry.count()) {
      await expect(disabledEntry.first()).toBeVisible()
    } else {
      await expect(externalLink).toBeVisible()
      await expect(externalLink).toHaveAttribute('target', '_blank')
    }
  })

  test('网络安全生态专题页回链到工作组介绍页', async ({ page }) => {
    await page.goto('/cybersecurity')
    const main = page.locator('main#main-content')

    const backLink = main.getByRole('link', { name: '查看工作组组织信息' })
    await expect(backLink).toBeVisible()
    await expect(backLink).toHaveAttribute('href', '/working-groups/cybersecurity')
  })

  test('未知工作组 slug 渲染 404 未找到页面', async ({ page }) => {
    const response = await page.goto('/working-groups/does-not-exist')
    expect(response?.status()).toBe(404)

    const main = page.locator('main#main-content')
    await expect(main.getByText('404')).toBeVisible()
    await expect(main.getByRole('heading', { level: 1, name: '页面未找到' })).toBeVisible()
  })
})

test.describe('回归性冒烟检查', () => {
  test('机构版加入页保持可访问并提供机构合作申请入口', async ({ page }) => {
    await page.goto('/join')
    const main = page.getByRole('main')

    await expect(main.getByRole('heading', { level: 1, name: '机构生态共建' })).toBeVisible()
    await expect(main).toContainText('申请通道准备中，请通过官网联系方式与联盟联系。')
  })

  test('联盟介绍与新闻动态页保持可正常访问', async ({ page }) => {
    const allianceResponse = await page.goto('/alliance')
    expect(allianceResponse?.ok()).toBeTruthy()
    await expect(
      page.locator('main#main-content').getByRole('heading', { level: 1, name: '联盟介绍' }),
    ).toBeVisible()

    const newsResponse = await page.goto('/news')
    expect(newsResponse?.ok()).toBeTruthy()
    await expect(
      page.locator('main#main-content').getByRole('heading', { level: 1, name: '新闻动态' }),
    ).toBeVisible()
  })
})
