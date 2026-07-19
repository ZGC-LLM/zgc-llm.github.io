import { createContext, Script } from 'node:vm'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { ThemeScript } from '@/components/site/theme-script'

type ThemeChangeListener = (event: { matches: boolean }) => void

interface ThemeHarnessOptions {
  listenerApi?: 'legacy' | 'modern'
  matches?: boolean
  protectBrowserStorage?: boolean
  withMatchMedia?: boolean
}

function createThemeHarness({
  listenerApi = 'modern',
  matches = false,
  protectBrowserStorage = false,
  withMatchMedia = true,
}: ThemeHarnessOptions = {}) {
  const markup = renderToStaticMarkup(<ThemeScript />)
  const documentNode = new DOMParser().parseFromString(
    `<!doctype html><html><head>${markup}</head><body></body></html>`,
    'text/html',
  )
  const script = documentNode.querySelector('script')
  if (!script?.textContent) throw new Error('ThemeScript did not render executable source')

  let listener: ThemeChangeListener | undefined
  const addEventListener = vi.fn((event: string, nextListener: ThemeChangeListener) => {
    if (event === 'change') listener = nextListener
  })
  const addListener = vi.fn((nextListener: ThemeChangeListener) => {
    listener = nextListener
  })
  const mediaQuery = {
    matches,
    ...(listenerApi === 'modern' ? { addEventListener } : { addListener }),
  }
  const matchMedia = vi.fn(() => mediaQuery)
  const windowHarness: Record<string, unknown> = {}

  if (withMatchMedia) {
    Object.defineProperty(windowHarness, 'matchMedia', {
      configurable: true,
      value: matchMedia,
    })
  }

  if (protectBrowserStorage) {
    const rejectAccess = () => {
      throw new Error('Theme policy attempted to access browser persistence')
    }

    Object.defineProperties(windowHarness, {
      localStorage: { configurable: true, get: rejectAccess },
      sessionStorage: { configurable: true, get: rejectAccess },
    })
    Object.defineProperty(documentNode, 'cookie', {
      configurable: true,
      get: rejectAccess,
      set: rejectAccess,
    })
  }

  const context = createContext({ document: documentNode, window: windowHarness })
  const run = () => new Script(script.textContent!).runInContext(context)

  return {
    addEventListener,
    addListener,
    documentNode,
    getListener: () => listener,
    matchMedia,
    run,
  }
}

describe('ThemeScript', () => {
  it.each([
    { expectedTheme: 'light', matches: false },
    { expectedTheme: 'dark', matches: true },
  ])('applies the initial $expectedTheme system preference', ({ expectedTheme, matches }) => {
    const harness = createThemeHarness({ matches })

    harness.run()

    expect(harness.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    expect(harness.documentNode.documentElement.dataset.theme).toBe(expectedTheme)
    expect(harness.documentNode.documentElement.style.colorScheme).toBe(expectedTheme)
  })

  it('tracks system preference changes through the modern listener API', () => {
    const harness = createThemeHarness({ listenerApi: 'modern', matches: false })

    harness.run()
    expect(harness.addEventListener).toHaveBeenCalledOnce()

    harness.getListener()?.({ matches: true })
    expect(harness.documentNode.documentElement.dataset.theme).toBe('dark')
    expect(harness.documentNode.documentElement.style.colorScheme).toBe('dark')
  })

  it('falls back to the legacy listener API and still reacts to changes', () => {
    const harness = createThemeHarness({ listenerApi: 'legacy', matches: true })

    harness.run()
    expect(harness.addEventListener).not.toHaveBeenCalled()
    expect(harness.addListener).toHaveBeenCalledOnce()

    harness.getListener()?.({ matches: false })
    expect(harness.documentNode.documentElement.dataset.theme).toBe('light')
    expect(harness.documentNode.documentElement.style.colorScheme).toBe('light')
  })

  it('uses a deterministic light fallback when matchMedia is unavailable', () => {
    const harness = createThemeHarness({ withMatchMedia: false })

    harness.run()

    expect(harness.matchMedia).not.toHaveBeenCalled()
    expect(harness.documentNode.documentElement.dataset.theme).toBe('light')
    expect(harness.documentNode.documentElement.style.colorScheme).toBe('light')
  })

  it('does not read or write local storage, session storage, or cookies', () => {
    const harness = createThemeHarness({ protectBrowserStorage: true })

    expect(harness.run).not.toThrow()
    expect(harness.documentNode.documentElement.dataset.theme).toBe('light')
  })
})
