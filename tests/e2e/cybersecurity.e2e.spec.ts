import { expect, test } from '@playwright/test'

const ecosystemCycle = [
  '模型发布',
  '专业验证',
  '场景落地',
  '数据沉淀',
  '模型增强',
  '行业推广',
] as const

const authorisedLeads = [
  '智谱',
  '清华大学',
  '数说安全',
  '云起无垠',
] as const

test.describe('网络安全生态专题', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cybersecurity')
  })

  test('呈现独立专题 metadata 和六阶段闭环', async ({ page }) => {
    await expect(page).toHaveTitle(/网络安全生态/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /专业用户.*场景.*产业/,
    )

    const main = page.locator('main#main-content')
    await expect(main.getByRole('heading', { level: 1, name: '网络安全生态' })).toBeVisible()

    const cycle = main.getByTestId('ecosystem-cycle')
    const items = cycle.locator('.dir-item')
    await expect(items).toHaveCount(6)
    await expect(items).toHaveText(
      ecosystemCycle.map((stage, index) => `${String(index + 1).padStart(2, '0')}${stage}`),
    )
  })

  test('呈现五类关键资源与四项重点行动', async ({ page }) => {
    const main = page.locator('main#main-content')

    await expect(main.getByRole('heading', { name: '联盟连接的五类关键资源' })).toBeVisible()
    await expect(main.getByRole('heading', { level: 3, name: '模型与算力' })).toBeVisible()
    await expect(main.getByRole('heading', { level: 3, name: '学术与评测' })).toBeVisible()
    await expect(main.getByRole('heading', { level: 3, name: '产业场景' })).toBeVisible()

    await expect(main.getByRole('heading', { name: '重点推进四项行动' })).toBeVisible()
    await expect(
      main.getByRole('heading', { level: 3, name: '建设深度数据与任务体系' }),
    ).toBeVisible()
  })

  test('组织机制仅点名已授权牵头方并保持数量边界', async ({ page }) => {
    const main = page.locator('main#main-content')

    await expect(main.getByRole('heading', { name: '组织机制' })).toBeVisible()

    // 每个已授权牵头方都出现在页面上
    for (const lead of authorisedLeads) {
      await expect(main.getByText(lead, { exact: false }).first()).toBeVisible()
    }

    // 组织机制卡片恰好 6 张（联盟统筹 / 智谱 / 清华 / 数说安全·云起无垠 / 生态伙伴 / 监管）
    const organisationSection = main.locator('section.block', { hasText: '组织机制' }).first()
    await expect(organisationSection.locator('.card')).toHaveCount(6)

    // 未授权/受邀企业不以具体名字出现（口径护栏，采样常见泛化占位）
    await expect(main.getByText('战略合作伙伴', { exact: false })).toHaveCount(0)
    await expect(main.getByText('独家', { exact: false })).toHaveCount(0)
  })

  test('治理边界强调不强制交付原始数据', async ({ page }) => {
    const main = page.locator('main#main-content')

    await expect(main.getByRole('heading', { name: '治理边界' })).toBeVisible()
    await expect(main.getByText('不被强制交付原始数据', { exact: false })).toBeVisible()
  })

  test('收尾 CTA 保持厂商中立并提供主次参与入口', async ({ page }) => {
    const main = page.locator('main#main-content')

    await expect(
      main.getByText('欢迎不同基础模型厂商与技术生态参与', { exact: false }),
    ).toBeVisible()
    await expect(main.getByText('厂商中立', { exact: true })).toBeVisible()

    const institutionCta = main.getByRole('link', { name: '申请生态共建' }).last()
    const professionalCta = main.getByRole('link', { name: '专业用户加入' }).last()

    await expect(institutionCta).toHaveAttribute('href', '/join')
    await expect(institutionCta).toHaveClass(/btn--primary/)
    await expect(professionalCta).toHaveAttribute('href', '/professionals')
    await expect(professionalCta).toHaveClass(/btn--ghost/)
  })
})
