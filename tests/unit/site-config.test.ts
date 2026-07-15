import { CORE_MODULES, SITE_NAME, SITE_URL } from '@/config/site'
import { describe, expect, it } from 'vitest'

describe('site configuration', () => {
  it('uses the alliance brand and canonical production domain', () => {
    expect(SITE_NAME).toBe('中关村自主大模型产业联盟')
    expect(SITE_URL).toBe('https://www.zgcllm.org.cn')
  })

  it('defines the six agreed website modules with unique slugs', () => {
    expect(CORE_MODULES).toHaveLength(6)
    expect(new Set(CORE_MODULES.map(({ slug }) => slug)).size).toBe(CORE_MODULES.length)
  })
})
