import { describe, expect, it } from 'vitest'

import { DEFAULT_LOCALE, HREF_LANG, HTML_LANG, isLocale, LOCALES } from '@/i18n/locales'

describe('locale identifiers', () => {
  it.each([
    ['zh', true],
    ['en', true],
    ['zh-CN', false],
    ['EN', false],
    ['fr', false],
    ['', false],
  ])('classifies %s as a supported internal locale: %s', (value, expected) => {
    expect(isLocale(value)).toBe(expected)
  })

  it('keeps internal, HTML and hreflang identifiers deliberately separate', () => {
    expect(LOCALES).toEqual(['zh', 'en'])
    expect(DEFAULT_LOCALE).toBe('zh')
    expect(HTML_LANG).toEqual({ en: 'en', zh: 'zh-CN' })
    expect(HREF_LANG).toEqual({ en: 'en', zh: 'zh-CN' })
  })
})
