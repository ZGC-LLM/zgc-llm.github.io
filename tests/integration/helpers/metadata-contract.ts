import type { Metadata } from 'next'
import { expect } from 'vitest'

export function expectLocalizedMetadata(
  metadata: Metadata,
  zhPath: string,
  locale: 'zh' | 'en',
): void {
  const normalizedPath = zhPath === '/' ? '' : zhPath
  const zhUrl = `https://www.zgc-llm.org.cn${normalizedPath || '/'}`
  const enUrl = `https://www.zgc-llm.org.cn/en${normalizedPath}`
  const canonical = locale === 'zh' ? zhUrl : enUrl

  expect(metadata.alternates).toMatchObject({
    canonical,
    languages: {
      en: enUrl,
      'x-default': zhUrl,
      'zh-CN': zhUrl,
    },
  })
  expect(metadata.description).toEqual(expect.any(String))
  expect(String(metadata.description).trim()).not.toBe('')
  expect(metadata.openGraph).toMatchObject({ url: canonical })
  expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' })
}
