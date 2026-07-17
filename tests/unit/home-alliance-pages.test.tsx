import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import AlliancePage, { metadata as allianceMetadata } from '@/app/(frontend)/alliance/page'
import HomePage, { metadata as homeMetadata } from '@/app/(frontend)/page'
import WorkingGroupsPage, {
  metadata as workingGroupsMetadata,
} from '@/app/(frontend)/working-groups/page'

afterEach(cleanup)

describe('home page', () => {
  it('presents the alliance, institution-first conversion, and cybersecurity initiative', () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /汇聚自主大模型产业力量/,
      }),
    ).toBeTruthy()

    const institutionLink = screen.getByRole('link', { name: '申请生态共建' })
    const professionalLink = screen.getByRole('link', { name: '专业用户加入' })

    expect(institutionLink.getAttribute('href')).toBe('/join')
    expect(institutionLink.className).toContain('btn--primary')
    expect(professionalLink.getAttribute('href')).toBe('/professionals')
    expect(professionalLink.className).toContain('btn--ghost')
    expect(screen.getByRole('link', { name: /了解网络安全生态/ }).getAttribute('href')).toBe(
      '/cybersecurity',
    )
    expect(screen.getByRole('main').id).toBe('main-content')
    expect(screen.getByRole('heading', { name: '成员信息整理中' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '查看成员伙伴' }).getAttribute('href')).toBe(
      '/members',
    )
    expect(screen.getByRole('heading', { name: '最新动态即将发布' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '查看新闻动态' }).getAttribute('href')).toBe('/news')
    expect(document.body.textContent).not.toMatch(/项目初始化|进入内容后台|管理后台/)
  })

  it('defines page-specific metadata', () => {
    expect(homeMetadata.title).toEqual({ absolute: '首页｜中关村自主大模型产业联盟' })
    expect(homeMetadata.description).toMatch(/生态共建/)
    expect(homeMetadata.alternates).toEqual({ canonical: '/' })
  })
})

describe('alliance page', () => {
  it('explains the mission, values, mechanism, and participation route', () => {
    render(<AlliancePage />)

    expect(screen.getByRole('heading', { level: 1, name: '联盟介绍' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '联盟宗旨' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '共同价值' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '协作机制' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: '面向长期价值持续行动' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '了解参与方式' }).getAttribute('href')).toBe('/join')
    expect(screen.getByRole('main').id).toBe('main-content')
  })

  it('defines page-specific metadata', () => {
    expect(allianceMetadata.title).toBe('联盟介绍')
    expect(allianceMetadata.description).toMatch(/宗旨|协同/)
    expect(allianceMetadata.alternates).toEqual({ canonical: '/alliance' })
  })
})

describe('working groups page', () => {
  it('lists only confirmed initiatives and links to cybersecurity', () => {
    render(<WorkingGroupsPage />)

    expect(screen.getByRole('heading', { level: 1, name: '工作组与专项' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 3, name: '网络安全生态' })).toBeTruthy()
    expect(screen.getByRole('link', { name: /查看网络安全生态/ }).getAttribute('href')).toBe(
      '/cybersecurity',
    )
    expect(screen.getByText(/其余工作组信息将在确认后发布/)).toBeTruthy()
    expect(screen.getByRole('main').id).toBe('main-content')
  })

  it('defines page-specific metadata', () => {
    expect(workingGroupsMetadata.title).toBe('工作组与专项')
    expect(workingGroupsMetadata.description).toMatch(/工作组|重点专项/)
    expect(workingGroupsMetadata.alternates).toEqual({ canonical: '/working-groups' })
  })
})
