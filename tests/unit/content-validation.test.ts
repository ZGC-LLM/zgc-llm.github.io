import {
  contentErrors,
  isIsoCalendarDate,
  validateAllContent,
  validateContent,
} from '@/lib/content-validation'
import { cloneContentBundle, createValidContentBundle } from './fixtures/content-bundle'
import { describe, expect, it } from 'vitest'

describe('repository content release gate', () => {
  it('accepts every checked-in content source without errors or migration warnings', () => {
    expect(validateAllContent()).toEqual([])
    expect(contentErrors()).toEqual([])
  })

  it('provides a complete zero-issue fixture for isolated boundary tests', () => {
    expect(validateContent(createValidContentBundle())).toEqual([])
  })

  it('returns fresh fixture state for every test', () => {
    const first = cloneContentBundle()
    const second = cloneContentBundle()

    first.news[0].title = '局部修改'

    expect(second.news[0].title).toBe('已核验动态')
    expect(validateContent(second)).toEqual([])
  })

  it('returns actionable, structured issues instead of plain strings', () => {
    const bundle = cloneContentBundle()
    bundle.members = [{ ...bundle.members[0], id: 'Not Kebab Case' }]

    expect(validateContent(bundle)).toContainEqual({
      code: 'identifier',
      message: 'member id 须为 lowercase kebab-case: Not Kebab Case',
      severity: 'error',
      where: 'members[0] #Not Kebab Case',
    })
  })
})

describe('isIsoCalendarDate', () => {
  it.each([
    ['2024-02-29', true],
    ['2023-02-28', true],
    ['2000-02-29', true],
    ['2023-02-29', false],
    ['1900-02-29', false],
    ['2026-04-31', false],
    ['2026-13-01', false],
    ['2026-00-01', false],
    ['2026-01-00', false],
    ['2026-1-01', false],
    ['2026/01/01', false],
    ['', false],
    [undefined, false],
    [20260719, false],
  ] as const)('classifies %j as %s', (value, expected) => {
    expect(isIsoCalendarDate(value)).toBe(expected)
  })
})
