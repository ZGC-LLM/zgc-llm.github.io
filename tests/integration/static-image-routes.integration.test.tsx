import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const imageResponse = vi.hoisted(() => ({
  calls: [] as Array<{ element: unknown; options: unknown; response: unknown }>,
}))

vi.mock('next/og', () => ({
  ImageResponse: class ImageResponseMock {
    constructor(element: unknown, options: unknown) {
      imageResponse.calls.push({ element, options, response: this })
    }
  },
}))

import { dynamic as appleDynamic, GET as getAppleIcon } from '@/app/apple-icon.png/route'
import { dynamic as iconDynamic, GET as getIcon } from '@/app/icon.png/route'
import { dynamic as socialDynamic, GET as getSocialPreview } from '@/app/social-preview.png/route'

beforeEach(() => {
  imageResponse.calls.length = 0
})

describe('static ImageResponse route contracts', () => {
  it.each([
    ['icon', getIcon, iconDynamic, { height: 64, width: 64 }, ['ZG']],
    ['apple icon', getAppleIcon, appleDynamic, { height: 180, width: 180 }, ['ZG']],
    [
      'social preview',
      getSocialPreview,
      socialDynamic,
      { height: 630, width: 1200 },
      ['ZGCLLM', 'www.zgc-llm.org.cn'],
    ],
  ] as const)(
    'emits a force-static neutral %s asset with the expected dimensions',
    (_name, get, dynamic, size, text) => {
      const response = get()
      const call = imageResponse.calls[0]
      const markup = renderToStaticMarkup(call.element as ReactElement)

      expect(response).toBe(call.response)
      expect(dynamic).toBe('force-static')
      expect(imageResponse.calls).toHaveLength(1)
      expect(call.options).toEqual(size)
      for (const value of text) expect(markup).toContain(value)
      expect(markup).not.toContain('logo')
    },
  )
})
