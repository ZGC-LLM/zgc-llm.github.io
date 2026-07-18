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

describe('NavGroup', () => {
  it('renders a collapsed disclosure trigger by default (no hydration mismatch)', () => {
    render(<NavGroup items={items} label="成员伙伴" variant="desktop" />)

    const trigger = screen.getByRole('button', { name: '成员伙伴' })

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('aria-controls')).toBeTruthy()
    // Children are hidden until expanded.
    expect(screen.queryByRole('link', { name: '联盟成员' })).toBeNull()
  })

  it('expands on trigger click and reveals both child links', () => {
    render(<NavGroup items={items} label="成员伙伴" variant="desktop" />)

    const trigger = screen.getByRole('button', { name: '成员伙伴' })
    fireEvent.click(trigger)

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('link', { name: '联盟成员' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '工作组成员' })).toBeTruthy()
  })

  it('closes on Escape and returns focus to the trigger', () => {
    render(<NavGroup items={items} label="成员伙伴" variant="desktop" />)

    const trigger = screen.getByRole('button', { name: '成员伙伴' })
    fireEvent.click(trigger)
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
  })

  it('marks the trigger as current when a child route is active', () => {
    mockPathname = '/members'
    render(<NavGroup items={items} label="成员伙伴" variant="desktop" />)

    expect(screen.getByRole('button', { name: '成员伙伴' }).getAttribute('aria-current')).toBe(
      'page',
    )
  })

  it('marks the trigger current on nested working-group routes (accepted overlap)', () => {
    mockPathname = '/working-groups/cybersecurity/members'
    render(<NavGroup items={items} label="成员伙伴" variant="desktop" />)

    expect(screen.getByRole('button', { name: '成员伙伴' }).getAttribute('aria-current')).toBe(
      'page',
    )
  })

  it('renders children inline for the mobile variant', () => {
    render(<NavGroup items={items} label="成员伙伴" variant="mobile" />)

    fireEvent.click(screen.getByRole('button', { name: '成员伙伴' }))

    expect(screen.getByRole('link', { name: '联盟成员' })).toBeTruthy()
  })
})
