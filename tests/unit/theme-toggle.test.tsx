import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { ThemeToggle } from '@/components/site/theme-toggle'
import { THEME_STORAGE_KEY } from '@/config/site'

afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute('data-theme')
  window.localStorage.clear()
})

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme')
  window.localStorage.clear()
})

describe('ThemeToggle', () => {
  it('exposes a bilingual accessible label by default', () => {
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: '切换深浅色主题 / Toggle theme' })).toBeTruthy()
  })

  it('flips html[data-theme] and persists the choice to localStorage on click', () => {
    document.documentElement.dataset.theme = 'light'
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button'))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')

    fireEvent.click(screen.getByRole('button'))

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('syncs the icon to the actual data-theme after mount', () => {
    document.documentElement.dataset.theme = 'dark'
    render(<ThemeToggle />)

    expect(screen.getByRole('button').textContent).toContain('☾')
  })
})
