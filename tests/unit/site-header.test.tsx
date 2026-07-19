import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SiteHeader } from '@/components/site/site-header'

let mockPathname = '/'
vi.mock('next/navigation', () => ({ usePathname: () => mockPathname }))

function getTrigger(container: HTMLElement): HTMLElement {
  // The mobile menu trigger is the only <summary> in the header.
  return container.querySelector('summary.mobile-menu__trigger') as HTMLElement
}

beforeEach(() => {
  // jsdom lacks matchMedia; the header's desktop-breakpoint listener needs it.
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  )
})

afterEach(() => {
  cleanup()
  mockPathname = '/'
  vi.unstubAllGlobals()
})

describe('SiteHeader mobile menu', () => {
  it('starts closed and toggles aria-expanded on the trigger', () => {
    const { container } = render(<SiteHeader locale="zh" />)
    const trigger = getTrigger(container)

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('aria-controls')).toBeTruthy()

    fireEvent.click(trigger)

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  it('closes and restores focus to the trigger on Escape', () => {
    const { container } = render(<SiteHeader locale="zh" />)
    const trigger = getTrigger(container)

    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
  })

  it('closes when a pointer event occurs outside the menu', () => {
    const { container } = render(<SiteHeader locale="zh" />)
    const trigger = getTrigger(container)

    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    fireEvent.pointerDown(document.body)

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('exposes the localized close label while open', () => {
    const { container } = render(<SiteHeader locale="en" />)
    const trigger = getTrigger(container)

    fireEvent.click(trigger)

    expect(trigger.getAttribute('aria-label')).toBe('Close site navigation')
  })
})
