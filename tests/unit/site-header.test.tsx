import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SiteHeader } from '@/components/site/site-header'
import { dict } from '@/i18n/dictionary'

const navigationState = vi.hoisted(() => ({ pathname: '/' }))

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}))

interface MediaListenerEvent {
  matches: boolean
}

const mediaListeners = new Set<(event: MediaListenerEvent) => void>()

beforeEach(() => {
  navigationState.pathname = '/'
  mediaListeners.clear()
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn(() => ({
      addEventListener: (_type: string, listener: (event: MediaListenerEvent) => void) => {
        mediaListeners.add(listener)
      },
      matches: false,
      media: '(min-width: 1280px)',
      removeEventListener: (_type: string, listener: (event: MediaListenerEvent) => void) => {
        mediaListeners.delete(listener)
      },
    })),
  })
})

afterEach(cleanup)

describe('SiteHeader', () => {
  it.each([
    ['zh', '/', '/working-groups', '/join'],
    ['en', '/en', '/en/working-groups', '/en/join'],
  ] as const)(
    'renders localized brand, navigation and participation routes for %s',
    (locale, home, groups, join) => {
      const copy = dict(locale).header
      render(<SiteHeader locale={locale} />)

      expect(
        screen
          .getByRole('link', { name: locale === 'zh' ? /中关村/u : 'ZGCLLM' })
          .getAttribute('href'),
      ).toBe(home)
      expect(
        screen.getAllByRole('link', { name: copy.joinWorkingGroup })[0].getAttribute('href'),
      ).toBe(groups)
      expect(
        screen.getAllByRole('link', { name: copy.institutionApply })[0].getAttribute('href'),
      ).toBe(join)
      expect(screen.getByRole('navigation', { name: copy.mainNav })).toBeTruthy()
    },
  )

  it('opens and closes the mobile menu with click and Escape while restoring focus', () => {
    render(<SiteHeader locale="zh" />)
    const trigger = screen.getByLabelText(dict('zh').header.openNav)

    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('navigation', { name: dict('zh').header.mobileNav })).toBeTruthy()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
  })

  it('closes an open mobile menu after an outside pointer event', () => {
    render(<SiteHeader locale="zh" />)
    const trigger = screen.getByLabelText(dict('zh').header.openNav)

    fireEvent.click(trigger)
    fireEvent.pointerDown(document.body)

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
  })

  it('closes an open mobile menu when entering the desktop breakpoint', () => {
    render(<SiteHeader locale="zh" />)
    const trigger = screen.getByLabelText(dict('zh').header.openNav)

    fireEvent.click(trigger)
    expect(mediaListeners.size).toBe(1)
    act(() => {
      for (const listener of mediaListeners) listener({ matches: true })
    })

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('closes the mobile menu after activating a contained navigation link', () => {
    render(<SiteHeader locale="zh" />)
    const trigger = screen.getByLabelText(dict('zh').header.openNav)

    fireEvent.click(trigger)
    const mobileNav = screen.getByRole('navigation', { name: dict('zh').header.mobileNav })
    const firstLink = mobileNav.querySelector('a') as HTMLAnchorElement
    firstLink.addEventListener('click', (event) => event.preventDefault(), { once: true })
    fireEvent.click(firstLink)

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('closes when focus actually moves to a focusable element outside the mobile menu', () => {
    render(
      <>
        <SiteHeader locale="zh" />
        <button type="button">页面外部操作</button>
      </>,
    )
    const trigger = screen.getByLabelText(dict('zh').header.openNav)
    const outsideButton = screen.getByRole('button', { name: '页面外部操作' })

    fireEvent.click(trigger)
    act(() => outsideButton.focus())

    expect(document.activeElement).toBe(outsideButton)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('keeps the mobile menu open for null-relatedTarget focus and submenu interaction inside it', () => {
    render(<SiteHeader locale="zh" />)
    const trigger = screen.getByLabelText(dict('zh').header.openNav)

    fireEvent.click(trigger)
    const submenuTrigger = screen.getByRole('button', {
      name: dict('zh').header.expandSubmenu,
    })
    fireEvent.focusIn(submenuTrigger, { relatedTarget: null })
    fireEvent.click(submenuTrigger)

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(submenuTrigger.getAttribute('aria-expanded')).toBe('true')
  })
})
