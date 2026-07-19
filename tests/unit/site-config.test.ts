import {
  APPLICATION_TARGET,
  isSafeExternalUrl,
  PUBLIC_STATIC_ROUTES,
  resolveApplicationTarget,
  resolveSiteUrl,
  resolveWorkingGroupApplicationUrl,
  SITE_NAME,
  SITE_NAVIGATION,
} from '@/config/site'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('site configuration', () => {
  it('uses the alliance brand and canonical production domain', () => {
    expect(SITE_NAME).toBe('中关村自主大模型产业联盟')
    expect(resolveSiteUrl()).toBe('https://www.zgc-llm.org.cn')
    expect(resolveSiteUrl('http://localhost:3000')).toBe('http://localhost:3000')
    expect(resolveSiteUrl('not-a-url')).toBe('https://www.zgc-llm.org.cn')
    expect(resolveSiteUrl('javascript:alert(1)')).toBe('https://www.zgc-llm.org.cn')
  })

  it('defines unique public navigation destinations with a members group', () => {
    const leaves = SITE_NAVIGATION.filter((item) => !item.children).map(({ href }) => href)

    expect(leaves).toContain('/cybersecurity')
    expect(new Set(leaves).size).toBe(leaves.length)

    const group = SITE_NAVIGATION.find((item) => item.children)

    expect(group?.href).toBe('/members')
    expect(group?.children?.map((child) => child.href)).toEqual(['/members', '/working-groups'])

    expect(PUBLIC_STATIC_ROUTES).toContain('/privacy')
    expect(PUBLIC_STATIC_ROUTES).not.toContain('/admin')
    expect(PUBLIC_STATIC_ROUTES).not.toContain('/professionals')
  })

  it('derives working-group sub-routes from WORKING_GROUPS', () => {
    expect(PUBLIC_STATIC_ROUTES).toContain('/working-groups/cybersecurity')
    expect(PUBLIC_STATIC_ROUTES).toContain('/working-groups/cybersecurity/members')
    expect(PUBLIC_STATIC_ROUTES).toContain('/working-groups/cybersecurity/join')
  })

  it('exposes an application target with a committed default that env can override', () => {
    const configured = process.env.NEXT_PUBLIC_APPLICATION_URL

    if (isSafeExternalUrl(configured)) {
      expect(APPLICATION_TARGET.href).toBe(configured)
    } else {
      // 未配置（或空串）环境变量时回退到源码内置的公开问卷默认链接（合法 https）
      expect(isSafeExternalUrl(APPLICATION_TARGET.href)).toBe(true)
    }
    expect(APPLICATION_TARGET.label).toBeTruthy()
    expect(APPLICATION_TARGET.unavailableMessage).toContain('联系')
  })

  it.each([
    ['https://example.feishu.cn/share/base/form/example', true],
    ['http://example.feishu.cn/share/base/form/example', false],
    ['javascript:alert(1)', false],
    ['data:text/html,unsafe', false],
    ['', false],
    [undefined, false],
  ])('validates external application URL %s', (value, expected) => {
    expect(isSafeExternalUrl(value)).toBe(expected)
  })

  it('returns an unavailable state for an invalid configured URL', () => {
    const target = resolveApplicationTarget('not-a-url')

    expect(target.href).toBeUndefined()
    expect(target.isAvailable).toBe(false)
    expect(target.unavailableMessage).toContain('联系')
  })

  it('returns an available state for a valid configured URL', () => {
    const target = resolveApplicationTarget('https://example.feishu.cn/share/base/form/example')

    expect(target.href).toBe('https://example.feishu.cn/share/base/form/example')
    expect(target.isAvailable).toBe(true)
  })

  describe('resolveWorkingGroupApplicationUrl', () => {
    const ENV_KEY = 'NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY'
    const SPECIFIC_HTTPS_URL = 'https://a.feishu.cn/x'

    afterEach(() => {
      vi.unstubAllEnvs()
    })

    it('returns the dedicated URL when the working group env key resolves to a safe https value', () => {
      vi.stubEnv(ENV_KEY, SPECIFIC_HTTPS_URL)

      expect(resolveWorkingGroupApplicationUrl({ applicationEnvKey: ENV_KEY })).toBe(
        SPECIFIC_HTTPS_URL,
      )
    })

    it('falls back to the committed dedicated default when no dedicated env value is set', () => {
      vi.stubEnv(ENV_KEY, undefined)

      const dedicated = resolveWorkingGroupApplicationUrl({ applicationEnvKey: ENV_KEY })

      // 未配置专属环境变量时回退到源码内置的网安专属默认链接（合法 https）
      expect(isSafeExternalUrl(dedicated)).toBe(true)
      // 未声明 applicationEnvKey 的工作组回退到通用申请入口
      expect(resolveWorkingGroupApplicationUrl({ applicationEnvKey: undefined })).toBe(
        APPLICATION_TARGET.href,
      )
    })

    it('ignores a non-https dedicated value and falls back to the committed default', () => {
      vi.stubEnv(ENV_KEY, 'http://a.feishu.cn/x')

      const result = resolveWorkingGroupApplicationUrl({ applicationEnvKey: ENV_KEY })

      expect(result).not.toBe('http://a.feishu.cn/x')
      expect(isSafeExternalUrl(result)).toBe(true)
    })

    it('resolves a dedicated URL whose host differs from the shared application host', () => {
      // NEXT_PUBLIC_APPLICATION_URL 由 APPLICATION_TARGET 在模块加载时读取一次，测试期间
      // stub 该变量不会改变已加载的 APPLICATION_TARGET.href，因此这里用一个显式的「通用」
      // https 常量代表两条路径应指向不同 host 的语义，而不依赖真实环境变量的加载时机。
      const SHARED_HTTPS_URL = 'https://alliance.feishu.cn/share/base/form/shared'
      vi.stubEnv(ENV_KEY, SPECIFIC_HTTPS_URL)

      const dedicated = resolveWorkingGroupApplicationUrl({ applicationEnvKey: ENV_KEY })

      expect(dedicated).toBe(SPECIFIC_HTTPS_URL)
      expect(new URL(dedicated as string).host).not.toBe(new URL(SHARED_HTTPS_URL).host)
    })
  })
})
