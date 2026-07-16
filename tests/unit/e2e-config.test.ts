import { describe, expect, it } from 'vitest'

import { resolveE2EBaseURL, resolveE2EPort } from '../helpers/e2eConfig'

describe('Playwright E2E port configuration', () => {
  it('uses the isolated default and accepts valid integer ports', () => {
    expect(resolveE2EPort(undefined)).toBe(3100)
    expect(resolveE2EPort('3200')).toBe(3200)
  })

  it.each(['NaN', '0', '65536', '3100.5'])(
    'rejects invalid E2E_PORT value %s',
    (value) => {
      expect(() => resolveE2EPort(value)).toThrow(/integer between 1 and 65535/)
    },
  )
})

describe('Playwright remote base URL configuration', () => {
  it('treats blank values as local mode and trims valid remote URLs', () => {
    expect(resolveE2EBaseURL(undefined)).toBeUndefined()
    expect(resolveE2EBaseURL('   ')).toBeUndefined()
    expect(resolveE2EBaseURL(' https://preview.example.com ')).toBe(
      'https://preview.example.com',
    )
  })

  it.each(['preview.example.com', 'javascript:alert(1)'])(
    'rejects invalid E2E_BASE_URL value %s',
    (value) => {
      expect(() => resolveE2EBaseURL(value)).toThrow(/absolute HTTP or HTTPS URL/)
    },
  )
})
