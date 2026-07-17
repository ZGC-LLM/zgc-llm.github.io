import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { LanguageToggle } from '@/components/site/language-toggle'

afterEach(cleanup)

describe('language toggle', () => {
  it('renders a segmented control with 中/EN options and an accessible label', () => {
    render(<LanguageToggle />)

    const control = screen.getByRole('button', { name: '切换语言 / Switch language' })

    expect(control).toBeTruthy()
    expect(screen.getByText('中')).toBeTruthy()
    expect(screen.getByText('EN')).toBeTruthy()
  })

  it('marks the current 中 segment as active by default', () => {
    render(<LanguageToggle />)

    expect(screen.getByText('中').className).toContain('on')
    expect(screen.getByText('EN').className).not.toContain('on')
  })

  it('gives placeholder feedback on click without touching html lang or content', () => {
    const initialLang = document.documentElement.lang

    render(<LanguageToggle />)

    const control = screen.getByRole('button', { name: '切换语言 / Switch language' })
    const status = screen.getByRole('status')

    // 点击前无反馈文案
    expect(status.textContent).toBe('')

    expect(() => fireEvent.click(control)).not.toThrow()

    // 点击后出现可见 + 可播报的“即将支持”反馈（移除 setShowHint 会使该断言失败）
    expect(status.textContent).toBe('即将支持')
    expect(status.getAttribute('aria-live')).toBe('polite')

    // 占位组件不切换正文语言、不改 html lang
    expect(document.documentElement.lang).toBe(initialLang)
    expect(screen.getByText('中')).toBeTruthy()
    expect(screen.getByText('EN')).toBeTruthy()
  })
})
