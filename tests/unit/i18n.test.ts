import { describe, expect, it } from 'vitest'

import { dict } from '@/i18n/dictionary'
import { DEFAULT_LOCALE, HTML_LANG, isLocale, LOCALES } from '@/i18n/locales'
import { isUntranslated, resolve } from '@/i18n/localized'
import { buildAlternates, localizePath } from '@/i18n/routing'

describe('locales', () => {
  it('recognizes supported locales and rejects others', () => {
    expect(isLocale('zh')).toBe(true)
    expect(isLocale('en')).toBe(true)
    expect(isLocale('fr')).toBe(false)
  })

  it('defaults to zh with correct html lang mapping', () => {
    expect(DEFAULT_LOCALE).toBe('zh')
    expect(HTML_LANG.zh).toBe('zh-CN')
    expect(HTML_LANG.en).toBe('en')
  })
})

describe('resolve (localized fallback)', () => {
  it('returns zh authoritative value for the default locale', () => {
    expect(resolve({ zh: '联盟', en: 'Alliance' }, 'zh')).toBe('联盟')
  })

  it('returns en value when present', () => {
    expect(resolve({ zh: '联盟', en: 'Alliance' }, 'en')).toBe('Alliance')
  })

  it('falls back to zh when en is missing', () => {
    expect(resolve({ zh: '联盟' }, 'en')).toBe('联盟')
  })
})

describe('isUntranslated', () => {
  it('flags missing or draft english', () => {
    expect(isUntranslated({ zh: '联盟' })).toBe(true)
    expect(isUntranslated({ zh: '联盟', en: 'Alliance', enDraft: true })).toBe(true)
    expect(isUntranslated({ zh: '联盟', en: 'Alliance' })).toBe(false)
  })
})

describe('localizePath', () => {
  it('keeps zh paths on the root (no prefix)', () => {
    expect(localizePath('/', 'zh')).toBe('/')
    expect(localizePath('/alliance', 'zh')).toBe('/alliance')
    expect(localizePath('/news/foo', 'zh')).toBe('/news/foo')
  })

  it('prefixes en paths with /en, mapping root to /en', () => {
    expect(localizePath('/', 'en')).toBe('/en')
    expect(localizePath('/alliance', 'en')).toBe('/en/alliance')
    expect(localizePath('/news/foo', 'en')).toBe('/en/news/foo')
  })
})

describe('buildAlternates', () => {
  it('sets canonical to the current locale and lists all hreflang variants', () => {
    const zhAlt = buildAlternates('/alliance', 'zh')

    expect(zhAlt.canonical).toBe('/alliance')
    expect(zhAlt.languages['zh-CN']).toBe('/alliance')
    expect(zhAlt.languages.en).toBe('/en/alliance')
    expect(zhAlt.languages['x-default']).toBe('/alliance')

    const enAlt = buildAlternates('/alliance', 'en')

    expect(enAlt.canonical).toBe('/en/alliance')
    expect(enAlt.languages['x-default']).toBe('/alliance')
  })
})

describe('dictionary key completeness', () => {
  function keyPaths(value: unknown, prefix = ''): string[] {
    if (value === null || typeof value !== 'object') return [prefix]

    return Object.entries(value as Record<string, unknown>)
      .flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key))
      .sort()
  }

  it('every locale dictionary shares the same key structure', () => {
    const reference = keyPaths(dict(DEFAULT_LOCALE))

    for (const locale of LOCALES) {
      expect(keyPaths(dict(locale))).toEqual(reference)
    }
  })
})
