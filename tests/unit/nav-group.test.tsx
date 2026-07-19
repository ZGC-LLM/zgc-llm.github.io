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

  it('does not claim an unrelated nested working-group route as current', () => {
    mockPathname = '/working-groups/cybersecurity/members'
    renderGroup()

    expect(screen.getByRole('button', { name: '成员伙伴' }).getAttribute('aria-current')).toBeNull()
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

  it('opens on desktop hover and closes when the pointer leaves', () => {
    const { container } = renderGroup()
    const group = container.querySelector('.nav-group') as HTMLDivElement
    const trigger = screen.getByRole('button', { name: '成员伙伴' })

    fireEvent.mouseEnter(group)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    fireEvent.mouseLeave(group)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('closes after an outside pointer press', () => {
    renderGroup()
    const trigger = screen.getByRole('button', { name: '成员伙伴' })

    fireEvent.click(trigger)
    fireEvent.pointerDown(document.body)

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('closes when desktop focus leaves the group', () => {
    const { container } = renderGroup()
    const group = container.querySelector('.nav-group') as HTMLDivElement
    const trigger = screen.getByRole('button', { name: '成员伙伴' })

    fireEvent.click(trigger)
    fireEvent.blur(group, { relatedTarget: document.body })

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('closes an open group after the pathname changes', () => {
    const view = renderGroup()
    const trigger = screen.getByRole('button', { name: '成员伙伴' })
    fireEvent.click(trigger)

    mockPathname = '/news'
    view.rerender(
      <NavGroup
        expandLabel="展开子菜单"
        href="/members"
        items={items}
        label="成员伙伴"
        variant="desktop"
      />,
    )

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })
})
