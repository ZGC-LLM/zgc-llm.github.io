import { describe, expect, it } from 'vitest'

import { isUntranslated, resolve, resolveWithStatus } from '@/i18n/localized'

describe('localized content resolution', () => {
  it('returns the authoritative Chinese value without fallback', () => {
    expect(resolveWithStatus({ en: 'Alliance', zh: '联盟' }, 'zh')).toEqual({
      isFallback: false,
      sourceLocale: 'zh',
      value: '联盟',
    })
  })

  it('returns a reviewed English value without fallback', () => {
    expect(resolveWithStatus({ en: 'Alliance', zh: '联盟' }, 'en')).toEqual({
      isFallback: false,
      sourceLocale: 'en',
      value: 'Alliance',
    })
  })

  it('reports the Chinese source when English is absent', () => {
    const value = { nested: true }

    expect(resolveWithStatus({ zh: value }, 'en')).toEqual({
      isFallback: true,
      sourceLocale: 'zh',
      value,
    })
    expect(resolve({ zh: '联盟' }, 'en')).toBe('联盟')
  })

  it.each([
    [{ zh: '联盟' }, true],
    [{ en: 'Alliance', enDraft: true, zh: '联盟' }, true],
    [{ en: 'Alliance', enDraft: false, zh: '联盟' }, false],
    [{ en: 'Alliance', zh: '联盟' }, false],
  ] as const)('classifies translation review state', (value, expected) => {
    expect(isUntranslated(value)).toBe(expected)
  })
})
