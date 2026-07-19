import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  APPLICATION_ENV,
  APPROVED_APPLICATION_URL,
  importSiteConfig,
} from './helpers/import-site-config'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('canonical site configuration', () => {
  it.each([undefined, 'https://www.zgc-llm.org.cn'])(
    'keeps the exact approved production origin for %s',
    async (configured) => {
      const { CANONICAL_SITE_URL, resolveSiteUrl } = await importSiteConfig()

      expect(resolveSiteUrl(configured)).toBe(CANONICAL_SITE_URL)
    },
  )

  it.each([
    ' http://www.zgc-llm.org.cn',
    'https://www.zgc-llm.org.cn ',
    'http://www.zgc-llm.org.cn',
    'https://zgc-llm.org.cn',
    'https://zgcllm.org.cn',
    'https://www.zgc-llm.org.cn:443',
    'https://user@example.com@www.zgc-llm.org.cn',
    'https://www.zgc-llm.org.cn/path',
    'https://www.zgc-llm.org.cn/?preview=1',
    'https://www.zgc-llm.org.cn/#preview',
    'http://localhost:3000',
    'not-a-url',
  ])('fails closed instead of adopting an unapproved canonical origin: %s', async (configured) => {
    const { CANONICAL_SITE_URL, resolveSiteUrl } = await importSiteConfig()

    expect(resolveSiteUrl(configured)).toBe(CANONICAL_SITE_URL)
  })

  it('derives unique public routes, including each working-group sub-route', async () => {
    const { PUBLIC_STATIC_ROUTES, SITE_NAVIGATION } = await importSiteConfig()

    expect(new Set(PUBLIC_STATIC_ROUTES).size).toBe(PUBLIC_STATIC_ROUTES.length)
    expect(PUBLIC_STATIC_ROUTES).toEqual(
      expect.arrayContaining([
        '/',
        '/privacy',
        '/working-groups/cybersecurity',
        '/working-groups/cybersecurity/join',
        '/working-groups/cybersecurity/members',
      ]),
    )
    expect(PUBLIC_STATIC_ROUTES).not.toEqual(expect.arrayContaining(['/admin', '/professionals']))
    expect(SITE_NAVIGATION.find(({ href }) => href === '/members')?.children).toHaveLength(2)
  })
})

describe('external URL policy', () => {
  it.each([
    ['https://example.com/form', true],
    ['https://sub.example.com:443/form', true],
    ['https://user:pass@example.com/form', false],
    [' https://example.com/form', false],
    ['https://example.com/form\n', false],
    ['http://example.com/form', false],
    ['javascript:alert(1)', false],
    ['not-a-url', false],
    ['', false],
    [undefined, false],
  ])('classifies generic external URL %s', async (value, expected) => {
    const { isSafeExternalUrl } = await importSiteConfig()

    expect(isSafeExternalUrl(value)).toBe(expected)
  })

  it.each([
    ['alliance', APPROVED_APPLICATION_URL.alliance],
    ['cybersecurity-program', APPROVED_APPLICATION_URL.program],
    ['cybersecurity-working-group', APPROVED_APPLICATION_URL.workingGroup],
  ] as const)('accepts only the exact approved URL for %s', async (targetId, url) => {
    const { isAllowedApplicationUrl, normalizeApplicationUrl } = await importSiteConfig()

    expect(normalizeApplicationUrl(url, targetId)).toBe(url)
    expect(isAllowedApplicationUrl(url, targetId)).toBe(true)
  })

  it.each([
    `${APPROVED_APPLICATION_URL.alliance}/`,
    `${APPROVED_APPLICATION_URL.alliance}?source=test`,
    `${APPROVED_APPLICATION_URL.alliance}#form`,
    APPROVED_APPLICATION_URL.alliance.replace('https://', 'http://'),
    APPROVED_APPLICATION_URL.alliance.replace('clouditera.feishu.cn', 'evil.example'),
    APPROVED_APPLICATION_URL.alliance.replace('clouditera.feishu.cn', 'clouditera.feishu.cn.evil'),
    'https://clouditera.feishu.cn/share/base/form/not-approved',
  ])('rejects an application URL outside the exact host/path contract: %s', async (url) => {
    const { isAllowedApplicationUrl, normalizeApplicationUrl } = await importSiteConfig()

    expect(normalizeApplicationUrl(url)).toBeUndefined()
    expect(isAllowedApplicationUrl(url)).toBe(false)
  })

  it('does not allow an approved URL to cross target boundaries', async () => {
    const { normalizeApplicationUrl } = await importSiteConfig()

    expect(normalizeApplicationUrl(APPROVED_APPLICATION_URL.program, 'alliance')).toBeUndefined()
    expect(
      normalizeApplicationUrl(APPROVED_APPLICATION_URL.workingGroup, 'cybersecurity-program'),
    ).toBeUndefined()
  })

  it.each([undefined, '', 'unknown', '__proto__', 'toString'])(
    'rejects unknown target and environment identifiers: %s',
    async (value) => {
      const {
        isKnownApplicationEnvKey,
        isKnownApplicationTargetId,
        isKnownWorkingGroupApplicationEnvKey,
      } = await importSiteConfig()

      expect(isKnownApplicationEnvKey(value)).toBe(false)
      expect(isKnownApplicationTargetId(value)).toBe(false)
      expect(isKnownWorkingGroupApplicationEnvKey(value)).toBe(false)
    },
  )

  it('recognizes only registered target and environment identifiers', async () => {
    const {
      isKnownApplicationEnvKey,
      isKnownApplicationTargetId,
      isKnownWorkingGroupApplicationEnvKey,
    } = await importSiteConfig()

    expect(isKnownApplicationTargetId('alliance')).toBe(true)
    expect(isKnownApplicationTargetId('cybersecurity-program')).toBe(true)
    expect(isKnownApplicationEnvKey(APPLICATION_ENV.alliance)).toBe(true)
    expect(isKnownWorkingGroupApplicationEnvKey(APPLICATION_ENV.workingGroup)).toBe(true)
    expect(isKnownWorkingGroupApplicationEnvKey(APPLICATION_ENV.program)).toBe(false)
  })
})

describe('fail-closed application resolution', () => {
  it('keeps every application target unavailable when no public env is configured', async () => {
    const {
      APPLICATION_TARGET,
      APPLICATION_TARGETS,
      resolveApplicationTarget,
      resolveConfiguredApplicationTarget,
    } = await importSiteConfig()

    expect(APPLICATION_TARGET.href).toBeUndefined()
    expect(Object.values(APPLICATION_TARGETS).every(({ href }) => href === undefined)).toBe(true)
    expect(resolveApplicationTarget()).toMatchObject({
      href: undefined,
      isAvailable: false,
      status: 'missing',
    })
    expect(resolveConfiguredApplicationTarget('alliance')).toMatchObject({
      href: undefined,
      isAvailable: false,
      status: 'missing',
    })
  })

  it.each([
    ['not-a-url', 'invalid'],
    ['http://clouditera.feishu.cn/form', 'invalid'],
    ['https://example.com/form', 'unapproved'],
    [APPROVED_APPLICATION_URL.alliance, 'unconfigured'],
  ] as const)('reports %s as %s instead of exposing a link', async (configured, status) => {
    const { resolveApplicationTarget } = await importSiteConfig()

    expect(resolveApplicationTarget(configured)).toMatchObject({
      href: undefined,
      isAvailable: false,
      status,
    })
  })

  it.each([
    [APPLICATION_ENV.alliance, 'alliance', APPROVED_APPLICATION_URL.alliance],
    [APPLICATION_ENV.program, 'cybersecurity-program', APPROVED_APPLICATION_URL.program],
    [
      APPLICATION_ENV.workingGroup,
      'cybersecurity-working-group',
      APPROVED_APPLICATION_URL.workingGroup,
    ],
  ] as const)(
    'enables only %s when its exact env value is present',
    async (envKey, targetId, url) => {
      const environment = { [envKey]: url }
      const { APPLICATION_TARGETS, resolveApplicationTarget, resolveConfiguredApplicationTarget } =
        await importSiteConfig(environment)

      expect(resolveConfiguredApplicationTarget(targetId)).toMatchObject({
        href: url,
        id: targetId,
        isAvailable: true,
        status: 'available',
      })
      expect(resolveApplicationTarget(url)).toMatchObject({
        href: url,
        id: targetId,
        isAvailable: true,
        status: 'available',
      })
      for (const [otherId, target] of Object.entries(APPLICATION_TARGETS)) {
        expect(target.href, otherId).toBe(otherId === targetId ? url : undefined)
      }
    },
  )

  it.each([
    ['', 'missing'],
    ['  ', 'missing'],
    ['not-a-url', 'invalid'],
    ['https://example.com/form', 'unapproved'],
  ] as const)('classifies an explicit alliance env value as %s', async (value, status) => {
    const { resolveConfiguredApplicationTarget } = await importSiteConfig({
      NEXT_PUBLIC_APPLICATION_URL: value,
    })

    expect(resolveConfiguredApplicationTarget('alliance')).toMatchObject({
      href: undefined,
      isAvailable: false,
      status,
    })
  })

  it('rejects a runtime-invalid target ID without indexing the target table', async () => {
    const { resolveConfiguredApplicationTarget } = await importSiteConfig()

    expect(resolveConfiguredApplicationTarget('__proto__' as 'alliance')).toEqual(
      expect.objectContaining({
        href: undefined,
        isAvailable: false,
        label: '申请通道',
        status: 'invalid',
      }),
    )
  })

  it('never falls a working group back to the Alliance application target', async () => {
    const { resolveWorkingGroupApplicationTarget, resolveWorkingGroupApplicationUrl } =
      await importSiteConfig({
        NEXT_PUBLIC_APPLICATION_URL: APPROVED_APPLICATION_URL.alliance,
      })

    expect(resolveWorkingGroupApplicationTarget({ applicationEnvKey: undefined })).toMatchObject({
      href: undefined,
      isAvailable: false,
      status: 'missing',
    })
    expect(
      resolveWorkingGroupApplicationTarget({ applicationEnvKey: 'UNKNOWN_ENV' }),
    ).toMatchObject({ href: undefined, isAvailable: false, status: 'unapproved' })
    expect(
      resolveWorkingGroupApplicationTarget({
        applicationEnvKey: APPLICATION_ENV.workingGroup,
      }),
    ).toMatchObject({ href: undefined, isAvailable: false, status: 'missing' })
    expect(
      resolveWorkingGroupApplicationUrl({ applicationEnvKey: APPLICATION_ENV.workingGroup }),
    ).toBe('')
  })

  it('resolves the working-group target only from its dedicated exact env', async () => {
    const { resolveWorkingGroupApplicationTarget, resolveWorkingGroupApplicationUrl } =
      await importSiteConfig({
        NEXT_PUBLIC_APPLICATION_URL_CYBERSECURITY: APPROVED_APPLICATION_URL.workingGroup,
      })
    const group = { applicationEnvKey: APPLICATION_ENV.workingGroup }

    expect(resolveWorkingGroupApplicationTarget(group)).toMatchObject({
      href: APPROVED_APPLICATION_URL.workingGroup,
      id: 'cybersecurity-working-group',
      isAvailable: true,
      status: 'available',
    })
    expect(resolveWorkingGroupApplicationUrl(group)).toBe(APPROVED_APPLICATION_URL.workingGroup)
  })
})
