import { request as rawHttpRequest, type IncomingHttpHeaders } from 'node:http'
import { brotliDecompressSync, gunzipSync } from 'node:zlib'

import { expect, test } from '@playwright/test'

import { expectNoSeriousAccessibilityViolations } from '../helpers/accessibility'
import { expectSingleH1, gotoRoute } from '../helpers/assertions'
import {
  CANONICAL_ORIGIN,
  canonicalUrl,
  HTML_ROUTES,
  LOCALIZED_ROUTES,
  PUBLIC_ROUTES,
} from '../helpers/routes'

interface AnchorSnapshot {
  readonly href: string
  readonly rel: string
  readonly target: string
}

interface RawHttpResponse {
  readonly body: Buffer
  readonly headers: IncomingHttpHeaders
  readonly statusCode: number
}

function normalizePathname(pathname: string): string {
  return pathname === '/' ? '/' : pathname.replace(/\/$/u, '')
}

function requestRaw(
  baseURL: string,
  path: string,
  method: 'GET' | 'HEAD' = 'GET',
  headers: Readonly<Record<string, string>> = {},
): Promise<RawHttpResponse> {
  const origin = new URL(baseURL)

  if (origin.protocol !== 'http:') {
    throw new Error('Raw static-server checks require a local HTTP base URL')
  }

  return new Promise((resolvePromise, rejectPromise) => {
    const request = rawHttpRequest(
      {
        headers,
        host: origin.hostname,
        method,
        path,
        port: origin.port,
      },
      (response) => {
        const chunks: Buffer[] = []

        response.on('data', (chunk: Buffer) => chunks.push(chunk))
        response.once('end', () =>
          resolvePromise({
            body: Buffer.concat(chunks),
            headers: response.headers,
            statusCode: response.statusCode ?? 0,
          }),
        )
      },
    )

    request.once('error', rejectPromise)
    request.end()
  })
}

test.describe('release metadata, transport and accessibility gates', () => {
  test('all 24 indexable HTML routes expose complete localized metadata', async ({ page }) => {
    test.setTimeout(180_000)

    const canonicalValues = new Set<string>()
    const descriptionValues = new Set<string>()
    const titleValues = new Set<string>()

    for (const route of HTML_ROUTES) {
      await test.step(route.path, async () => {
        await gotoRoute(page, route.path)
        await expectSingleH1(page, route.path)
        await expect(page.locator('html')).toHaveAttribute(
          'lang',
          route.locale === 'zh' ? 'zh-CN' : 'en',
        )

        const canonical = canonicalUrl(route.path)
        const pair = LOCALIZED_ROUTES.find(({ id }) => id === route.routeId)

        expect(pair, `missing localized route pair for ${route.routeId}`).toBeDefined()
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical)
        await expect(page.locator('link[rel="alternate"][hreflang="zh-CN"]')).toHaveAttribute(
          'href',
          canonicalUrl(pair?.zh ?? '/'),
        )
        await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
          'href',
          canonicalUrl(pair?.en ?? '/en'),
        )
        await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
          'href',
          canonicalUrl(pair?.zh ?? '/'),
        )
        await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical)
        await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /\S/u)
        await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
          'content',
          /\S/u,
        )
        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
          'content',
          `${CANONICAL_ORIGIN}/social-preview.png`,
        )
        await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
          'content',
          'summary_large_image',
        )
        await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', /\S/u)
        expect(await page.locator('meta[name="robots"][content*="noindex" i]').count()).toBe(0)

        const title = await page.title()
        const description = await page.locator('meta[name="description"]').getAttribute('content')

        expect(title.trim().length, `${route.path} should have a useful title`).toBeGreaterThan(4)
        expect(
          description?.trim().length ?? 0,
          `${route.path} should have a useful description`,
        ).toBeGreaterThanOrEqual(20)
        titleValues.add(title)
        descriptionValues.add(description ?? '')
        canonicalValues.add(canonical)

        const jsonLdBlocks = await page
          .locator('script[type="application/ld+json"]')
          .allTextContents()
        expect(jsonLdBlocks.length, `${route.path} should include structured data`).toBeGreaterThan(
          0,
        )

        for (const block of jsonLdBlocks) {
          const parsed: unknown = JSON.parse(block)
          expect(parsed, `${route.path} JSON-LD should parse`).toBeTruthy()
        }
      })
    }

    expect(canonicalValues.size).toBe(HTML_ROUTES.length)
    expect(titleValues.size).toBe(HTML_ROUTES.length)
    expect(descriptionValues.size).toBe(HTML_ROUTES.length)
  })

  test('all 26 public endpoints support deterministic GET and HEAD semantics', async ({
    request,
  }) => {
    test.setTimeout(120_000)

    for (const path of PUBLIC_ROUTES) {
      const response = await request.get(path)
      const headResponse = await request.fetch(path, { method: 'HEAD' })

      expect(response.status(), `${path} GET status`).toBe(200)
      expect(headResponse.status(), `${path} HEAD status`).toBe(200)
      expect((await headResponse.body()).byteLength, `${path} HEAD body`).toBe(0)
      expect(headResponse.headers()['x-content-type-options']).toBe('nosniff')
      expect(Number(headResponse.headers()['content-length'])).toBeGreaterThan(0)

      if (path === '/robots.txt') {
        expect(response.headers()['content-type']).toMatch(/^text\/plain/iu)
      } else if (path === '/sitemap.xml') {
        expect(response.headers()['content-type']).toMatch(/xml/iu)
      } else {
        expect(response.headers()['content-type']).toMatch(/^text\/html/iu)
      }
    }
  })

  test('robots and sitemap enumerate only the 24 indexable localized documents', async ({
    request,
  }) => {
    const robots = await (await request.get('/robots.txt')).text()
    const sitemap = await (await request.get('/sitemap.xml')).text()
    const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1])
    const expectedLocations = HTML_ROUTES.map(({ path }) => canonicalUrl(path)).sort()

    expect(robots).toContain(`Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`)
    expect(robots).not.toContain('alliance-website-launch')
    expect([...new Set(sitemapLocations)].sort()).toEqual(expectedLocations)
    expect(sitemap).not.toContain('alliance-website-launch')
  })

  test('every rendered internal link resolves and every external HTTP link is hardened', async ({
    page,
    request,
  }) => {
    test.setTimeout(180_000)

    const internalPaths = new Set<string>()
    const knownHtmlPaths = new Set(HTML_ROUTES.map(({ path }) => path))

    for (const route of HTML_ROUTES) {
      await gotoRoute(page, route.path)
      const pageURL = new URL(page.url())
      const anchors = await page.locator('a[href]').evaluateAll<AnchorSnapshot[]>((elements) =>
        elements.map((element) => ({
          href: element.getAttribute('href') ?? '',
          rel: element.getAttribute('rel') ?? '',
          target: element.getAttribute('target') ?? '',
        })),
      )

      for (const anchor of anchors) {
        const destination = new URL(anchor.href, pageURL)

        if (destination.protocol !== 'http:' && destination.protocol !== 'https:') continue

        if (destination.origin === pageURL.origin) {
          const path = normalizePathname(destination.pathname)

          expect(knownHtmlPaths.has(path), `${route.path} links to undeclared route ${path}`).toBe(
            true,
          )
          internalPaths.add(path)
        } else {
          expect(destination.protocol, `${route.path} external link must use HTTPS`).toBe('https:')
          expect(anchor.target, `${route.path} external link must open separately`).toBe('_blank')
          const relTokens = new Set(anchor.rel.split(/\s+/u))

          expect(relTokens.has('noopener'), `${route.path} external link needs noopener`).toBe(true)
          expect(relTokens.has('noreferrer'), `${route.path} external link needs noreferrer`).toBe(
            true,
          )
        }
      }
    }

    for (const path of internalPaths) {
      expect((await request.get(path)).status(), `${path} internal-link status`).toBe(200)
    }
  })

  test('published routes emit no browser warnings, page errors or unexpected failed requests', async ({
    page,
  }, testInfo) => {
    test.setTimeout(180_000)

    type IgnoredPrefetchAbort = {
      readonly kind: 'next-rsc' | 'successful-route-head'
      readonly method: string
      readonly url: string
    }

    const diagnostics: string[] = []
    const ignoredPrefetchAborts: IgnoredPrefetchAbort[] = []
    const pendingRequestDiagnostics = new Set<Promise<void>>()
    const knownHtmlPaths = new Set(HTML_ROUTES.map(({ path }) => path))
    const responseStatuses = new WeakMap<object, number>()

    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') {
        diagnostics.push(`console.${message.type()}: ${message.text()}`)
      }
    })
    page.on('pageerror', (error) => diagnostics.push(`pageerror: ${error.message}`))
    page.on('response', (response) => responseStatuses.set(response.request(), response.status()))
    page.on('requestfailed', (request) => {
      const inspectFailure = async (): Promise<void> => {
        const errorText = request.failure()?.errorText ?? 'unknown'
        const headers = await request.allHeaders()
        const requestURL = new URL(request.url())
        const isExactAbort = errorText === 'net::ERR_ABORTED'
        const isRscPrefetch =
          isExactAbort &&
          request.method() === 'GET' &&
          request.resourceType() === 'fetch' &&
          /(?:^|\/)__next\.[^/]+\.txt$/u.test(requestURL.pathname) &&
          headers['next-router-prefetch'] === '1' &&
          headers.rsc === '1'

        if (isRscPrefetch) {
          ignoredPrefetchAborts.push({
            kind: 'next-rsc',
            method: request.method(),
            url: request.url(),
          })
          return
        }

        const referer = headers.referer
        const normalizedRequestPath = normalizePathname(requestURL.pathname)
        const isSameOriginRouteHeadProbe =
          isExactAbort &&
          request.method() === 'HEAD' &&
          request.resourceType() === 'fetch' &&
          knownHtmlPaths.has(normalizedRequestPath) &&
          headers['sec-fetch-dest'] === 'empty' &&
          headers['sec-fetch-mode'] === 'cors' &&
          headers['sec-fetch-site'] === 'same-origin' &&
          Boolean(referer) &&
          new URL(referer).origin === requestURL.origin
        const response = isSameOriginRouteHeadProbe ? await request.response() : null
        const responseStatus = response?.status() ?? responseStatuses.get(request)

        if (isSameOriginRouteHeadProbe && responseStatus === 200) {
          ignoredPrefetchAborts.push({
            kind: 'successful-route-head',
            method: request.method(),
            url: request.url(),
          })
          return
        }

        diagnostics.push(
          `requestfailed: ${request.method()} ${request.url()} (${errorText}; resource=${request.resourceType()}; status=${responseStatus ?? 'none'})`,
        )
      }

      const pending = inspectFailure().finally(() => pendingRequestDiagnostics.delete(pending))
      pendingRequestDiagnostics.add(pending)
    })

    for (const route of HTML_ROUTES) {
      await gotoRoute(page, route.path)
      await page.waitForLoadState('networkidle')
    }

    while (pendingRequestDiagnostics.size > 0) {
      await Promise.all([...pendingRequestDiagnostics])
    }

    const ignoredPrefetchSummary = {
      count: ignoredPrefetchAborts.length,
      nextRsc: ignoredPrefetchAborts.filter(({ kind }) => kind === 'next-rsc').length,
      samples: ignoredPrefetchAborts.slice(0, 10),
      successfulRouteHead: ignoredPrefetchAborts.filter(
        ({ kind }) => kind === 'successful-route-head',
      ).length,
    }

    await testInfo.attach('ignored-prefetch-aborts.json', {
      body: Buffer.from(JSON.stringify(ignoredPrefetchSummary, null, 2)),
      contentType: 'application/json',
    })

    expect(
      ignoredPrefetchAborts.every(({ kind, method, url }) => {
        if (kind === 'next-rsc') {
          return method === 'GET' && /(?:^|\/)__next\.[^/]+\.txt(?:\?|$)/u.test(url)
        }

        return method === 'HEAD' && knownHtmlPaths.has(normalizePathname(new URL(url).pathname))
      }),
      'every ignored abort must retain evidence of a recognized Next.js prefetch request',
    ).toBe(true)

    expect(diagnostics, 'public routes should be clean in the browser console and network').toEqual(
      [],
    )
  })

  test('withdrawn and unknown routes stay 404, noindex and canonical-free in both locales', async ({
    page,
  }) => {
    for (const route of [
      '/news/alliance-website-launch',
      '/en/news/alliance-website-launch',
      '/working-groups/not-published',
      '/en/working-groups/not-published',
    ]) {
      await gotoRoute(page, route, 404)
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/iu)
      await expect(page.locator('html')).toHaveAttribute(
        'lang',
        route.startsWith('/en/') ? 'en' : 'zh-CN',
      )
    }
  })

  test('the owned static server rejects encoded traversal paths', async ({ baseURL }) => {
    test.skip(!baseURL || new URL(baseURL).hostname !== '127.0.0.1', 'local static server only')

    if (!baseURL) throw new Error('local static server base URL is missing')

    for (const path of ['/%2e%2e/package.json', '/..%2fpackage.json', '/%5c..%5cpackage.json']) {
      expect((await requestRaw(baseURL, path)).statusCode, `${path} should be rejected`).toBe(400)
    }
  })

  test('the owned static server negotiates compressed GET and HEAD representations', async ({
    baseURL,
  }) => {
    test.skip(!baseURL || new URL(baseURL).hostname !== '127.0.0.1', 'local static server only')

    if (!baseURL) throw new Error('local static server base URL is missing')

    const brotliGet = await requestRaw(baseURL, '/', 'GET', { 'Accept-Encoding': 'br, gzip' })
    const brotliHead = await requestRaw(baseURL, '/', 'HEAD', { 'Accept-Encoding': 'br, gzip' })

    expect(brotliGet.statusCode).toBe(200)
    expect(brotliGet.headers['content-encoding']).toBe('br')
    expect(brotliGet.headers.vary).toBe('Accept-Encoding')
    expect(Number(brotliGet.headers['content-length'])).toBe(brotliGet.body.byteLength)
    expect(brotliDecompressSync(brotliGet.body).toString('utf8')).toContain('<!DOCTYPE html>')
    expect(brotliHead.body.byteLength).toBe(0)
    expect(brotliHead.headers['content-encoding']).toBe(brotliGet.headers['content-encoding'])
    expect(brotliHead.headers['content-length']).toBe(brotliGet.headers['content-length'])

    const gzipGet = await requestRaw(baseURL, '/robots.txt', 'GET', {
      'Accept-Encoding': 'br;q=0, gzip',
    })
    const gzipHead = await requestRaw(baseURL, '/robots.txt', 'HEAD', {
      'Accept-Encoding': 'br;q=0, gzip',
    })

    expect(gzipGet.headers['content-encoding']).toBe('gzip')
    expect(gunzipSync(gzipGet.body).toString('utf8')).toContain('Sitemap:')
    expect(gzipHead.body.byteLength).toBe(0)
    expect(gzipHead.headers['content-encoding']).toBe(gzipGet.headers['content-encoding'])
    expect(gzipHead.headers['content-length']).toBe(gzipGet.headers['content-length'])

    const weightedGet = await requestRaw(baseURL, '/sitemap.xml', 'GET', {
      'Accept-Encoding': 'br;q=0.4, gzip;q=0.9, identity;q=0.1',
    })

    expect(weightedGet.headers['content-encoding']).toBe('gzip')
    expect(gunzipSync(weightedGet.body).toString('utf8')).toContain('<urlset')

    const identityGet = await requestRaw(baseURL, '/', 'GET', {
      'Accept-Encoding': 'br;q=0, gzip;q=0, identity',
    })
    const identityHead = await requestRaw(baseURL, '/', 'HEAD', {
      'Accept-Encoding': 'br;q=0, gzip;q=0, identity',
    })

    expect(identityGet.headers['content-encoding']).toBeUndefined()
    expect(identityGet.body.toString('utf8')).toContain('<!DOCTYPE html>')
    expect(identityHead.body.byteLength).toBe(0)
    expect(identityHead.headers['content-encoding']).toBeUndefined()
    expect(identityHead.headers['content-length']).toBe(identityGet.headers['content-length'])

    const binaryGet = await requestRaw(baseURL, '/icon.png', 'GET', {
      'Accept-Encoding': 'br, gzip, identity;q=0.1',
    })
    const binaryHead = await requestRaw(baseURL, '/icon.png', 'HEAD', {
      'Accept-Encoding': 'br, gzip, identity;q=0.1',
    })

    expect(binaryGet.headers['content-encoding']).toBeUndefined()
    expect(binaryGet.body.subarray(1, 4).toString('ascii')).toBe('PNG')
    expect(binaryHead.body.byteLength).toBe(0)
    expect(binaryHead.headers['content-encoding']).toBeUndefined()
    expect(binaryHead.headers['content-length']).toBe(binaryGet.headers['content-length'])
  })

  test('the owned static server returns deterministic 406 responses when no representation is acceptable', async ({
    baseURL,
  }) => {
    test.skip(!baseURL || new URL(baseURL).hostname !== '127.0.0.1', 'local static server only')

    if (!baseURL) throw new Error('local static server base URL is missing')

    for (const { acceptEncoding, path } of [
      {
        acceptEncoding: 'br;q=0, gzip;q=0, identity;q=0',
        path: '/',
      },
      {
        acceptEncoding: 'identity;q=0',
        path: '/icon.png',
      },
    ]) {
      const getResponse = await requestRaw(baseURL, path, 'GET', {
        'Accept-Encoding': acceptEncoding,
      })
      const headResponse = await requestRaw(baseURL, path, 'HEAD', {
        'Accept-Encoding': acceptEncoding,
      })

      for (const response of [getResponse, headResponse]) {
        expect(response.statusCode, `${path} ${acceptEncoding}`).toBe(406)
        expect(response.body.byteLength).toBe(0)
        expect(response.headers['content-encoding']).toBeUndefined()
        expect(response.headers['content-length']).toBe('0')
        expect(response.headers.vary).toBe('Accept-Encoding')
        expect(response.headers['x-content-type-options']).toBe('nosniff')
      }
    }
  })

  test('all published pages and representative UI states have no serious axe violations', async ({
    page,
  }, testInfo) => {
    test.setTimeout(240_000)

    for (const route of HTML_ROUTES) {
      await gotoRoute(page, route.path)
      await expectNoSeriousAccessibilityViolations(
        page,
        testInfo,
        `route-${route.locale}-${route.routeId}`,
      )
    }

    await page.setViewportSize({ height: 844, width: 390 })
    await gotoRoute(page, '/')
    const mobileTrigger = page.locator('header details.mobile-menu summary')
    await expect(mobileTrigger).toHaveAttribute('aria-label', '打开网站导航')
    await expect(mobileTrigger).toHaveAttribute('aria-controls', /\S/u)
    await mobileTrigger.click()
    await expect(mobileTrigger).toHaveAttribute('aria-expanded', 'true')
    await expectNoSeriousAccessibilityViolations(page, testInfo, 'open-mobile-navigation')

    await page.emulateMedia({ colorScheme: 'dark' })
    await gotoRoute(page, '/en')
    await expectNoSeriousAccessibilityViolations(page, testInfo, 'dark-theme')

    await gotoRoute(page, '/join')
    await expectNoSeriousAccessibilityViolations(page, testInfo, 'unavailable-application')

    await gotoRoute(page, '/en/not-a-public-route', 404)
    await expectNoSeriousAccessibilityViolations(page, testInfo, 'not-found')
  })
})
