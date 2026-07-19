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
  it('renders the title as an expand trigger button on desktop (no navigation)', () => {
    renderGroup()

    const trigger = screen.getByRole('button', { name: '成员伙伴' })

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('aria-controls')).toBeTruthy()
    expect(screen.queryByRole('link', { name: '成员伙伴' })).toBeNull()
    expect(screen.queryByRole('link', { name: '联盟成员' })).toBeNull()
  })

  it('expands the submenu on title click and reveals both child links (desktop)', () => {
    renderGroup()

    const trigger = screen.getByRole('button', { name: '成员伙伴' })
    fireEvent.click(trigger)

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('link', { name: '联盟成员' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '工作组成员' })).toBeTruthy()
  })

  it('closes on Escape and returns focus to the title trigger (desktop)', () => {
    renderGroup()

    const trigger = screen.getByRole('button', { name: '成员伙伴' })
    fireEvent.click(trigger)
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
  })

  it('marks the title trigger current when the parent route is active (desktop)', () => {
    mockPathname = '/members'
    renderGroup()

    expect(screen.getByRole('button', { name: '成员伙伴' }).getAttribute('aria-current')).toBe(
      'page',
    )
  })

  it('does not mark the group title current for a child destination (no duplicate aria-current)', () => {
    // The group href is /members; a submenu child points at a /working-groups/* route.
    // Only the item that actually owns the route announces current — the group title must not.
    mockPathname = '/working-groups/cybersecurity/members'
    renderGroup()

    expect(
      screen.getByRole('button', { name: '成员伙伴' }).getAttribute('aria-current'),
    ).toBeNull()
  })

  it('renders the title as a navigable link on mobile', () => {
    renderGroup('mobile')

    const link = screen.getByRole('link', { name: '成员伙伴' })

    expect(link.getAttribute('href')).toBe('/members')
  })

  it('renders children inline for the mobile variant', () => {
    renderGroup('mobile')

    fireEvent.click(screen.getByRole('button', { name: '展开子菜单' }))

    expect(screen.getByRole('link', { name: '联盟成员' })).toBeTruthy()
  })
})
