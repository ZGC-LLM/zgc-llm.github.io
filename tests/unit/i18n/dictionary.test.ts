import { describe, expect, it } from 'vitest'

import { allDictionaries, dict } from '@/i18n/dictionary'
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/locales'

function leafPaths(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix]

  return Object.entries(value as Record<string, unknown>)
    .flatMap(([key, child]) => leafPaths(child, prefix ? `${prefix}.${key}` : key))
    .sort()
}

describe('locale dictionaries', () => {
  it('provides one dictionary for every supported locale in stable order', () => {
    expect(allDictionaries()).toEqual(LOCALES.map((locale) => ({ dictionary: dict(locale), locale })))
  })

  it('keeps every locale structurally complete', () => {
    const reference = leafPaths(dict(DEFAULT_LOCALE))

    for (const locale of LOCALES) {
      expect(leafPaths(dict(locale)), locale).toEqual(reference)
    }
  })

  it('uses localized, non-empty navigation and recovery labels', () => {
    expect(dict('zh').header.mainNav).not.toBe(dict('en').header.mainNav)
    expect(dict('zh').skipToContent.trim()).not.toBe('')
    expect(dict('en').skipToContent.trim()).not.toBe('')
  })
})
