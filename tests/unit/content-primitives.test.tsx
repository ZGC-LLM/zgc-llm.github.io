import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PageHero } from '@/components/site/page-hero'
import { SectionHeading } from '@/components/site/section-heading'

afterEach(cleanup)

describe('PageHero', () => {
  it('renders required title and description while omitting optional regions', () => {
    const { container } = render(<PageHero description="描述" title="标题" />)

    expect(screen.getByRole('heading', { level: 1, name: '标题' })).toBeTruthy()
    expect(screen.getByText('描述')).toBeTruthy()
    expect(container.querySelector('.eyebrow')).toBeNull()
    expect(container.querySelector('.hero-actions')).toBeNull()
  })

  it('renders an eyebrow and explicit action region when supplied', () => {
    const { container } = render(
      <PageHero
        actions={<a href="/next">继续</a>}
        description="描述"
        eyebrow="专题"
        title="标题"
      />,
    )

    expect(screen.getByText('专题')).toBeTruthy()
    expect(screen.getByRole('link', { name: '继续' }).getAttribute('href')).toBe('/next')
    expect(container.querySelector('.hero-actions')).not.toBeNull()
  })
})

describe('SectionHeading', () => {
  it('omits optional copy and row wrapper when no action is present', () => {
    const { container } = render(<SectionHeading title="范围" />)

    expect(screen.getByRole('heading', { level: 2, name: '范围' })).toBeTruthy()
    expect(container.querySelector('.row-head')).toBeNull()
    expect(container.querySelector('.eyebrow')).toBeNull()
  })

  it('renders all optional copy and an action in a row header', () => {
    const { container } = render(
      <SectionHeading
        action={<a href="/details">查看详情</a>}
        description="范围说明"
        eyebrow="公开信息"
        title="范围"
      />,
    )

    expect(screen.getByText('公开信息')).toBeTruthy()
    expect(screen.getByText('范围说明')).toBeTruthy()
    expect(screen.getByRole('link', { name: '查看详情' }).getAttribute('href')).toBe('/details')
    expect(container.querySelector('.row-head')).not.toBeNull()
  })
})
