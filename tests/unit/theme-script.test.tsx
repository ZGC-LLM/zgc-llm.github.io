import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { ThemeScript } from '@/components/site/theme-script'

afterEach(cleanup)

describe('ThemeScript', () => {
  it('renders an inline script that clears the legacy theme key and follows the system color scheme', () => {
    const { container } = render(<ThemeScript />)

    const script = container.querySelector('script')
    expect(script).not.toBeNull()
    expect(script?.textContent).toContain("localStorage.removeItem('zgcllm-theme')")
    expect(script?.textContent).toContain('prefers-color-scheme: dark')
    expect(script?.textContent).toContain("document.documentElement.dataset.theme")
  })
})
