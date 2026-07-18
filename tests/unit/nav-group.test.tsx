import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { NavGroup } from '@/components/site/nav-group'

let mockPathname = '/'
vi.mock('next/navigation', () => ({ usePathname: () => mockPathname }))

afterEach(() => {
  cleanup()
  mockPathname = '/'
})

const items = [
  { href: '/members', label: '联盟成员' },
  { href: '/working-groups', label: '工作组成员' },
]

function renderGroup(variant: 'desktop' | 'mobile' = 'desktop') {
  return render(
    <NavGroup
      expandLabel="展开子菜单"
      href="/members"
      items={items}
      label="成员伙伴"
      variant={variant}
    />,
  )
}

describe('NavGroup', () => {
  it('renders the title as a navigable link to the parent target', () => {
    renderGroup()

    const link = screen.getByRole('link', { name: '成员伙伴' })

    expect(link.getAttribute('href')).toBe('/members')
  })

  it('keeps the submenu collapsed by default (no hydration mismatch)', () => {
    renderGroup()

    const toggle = screen.getByRole('button', { name: '展开子菜单' })

    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(toggle.getAttribute('aria-controls')).toBeTruthy()
    expect(screen.queryByRole('link', { name: '联盟成员' })).toBeNull()
  })

  it('expands the submenu on caret click and reveals both child links', () => {
    renderGroup()

    const toggle = screen.getByRole('button', { name: '展开子菜单' })
    fireEvent.click(toggle)

    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('link', { name: '联盟成员' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '工作组成员' })).toBeTruthy()
  })

  it('closes on Escape and returns focus to the caret toggle', () => {
    renderGroup()

    const toggle = screen.getByRole('button', { name: '展开子菜单' })
    fireEvent.click(toggle)
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(toggle)
  })

  it('marks the title link current when the parent route is active', () => {
    mockPathname = '/members'
    renderGroup()

    expect(screen.getByRole('link', { name: '成员伙伴' }).getAttribute('aria-current')).toBe('page')
  })

  it('marks the title current on nested working-group routes (accepted overlap)', () => {
    mockPathname = '/working-groups/cybersecurity/members'
    renderGroup()

    expect(screen.getByRole('link', { name: '成员伙伴' }).getAttribute('aria-current')).toBe('page')
  })

  it('renders children inline for the mobile variant', () => {
    renderGroup('mobile')

    fireEvent.click(screen.getByRole('button', { name: '展开子菜单' }))

    expect(screen.getByRole('link', { name: '联盟成员' })).toBeTruthy()
  })
})
