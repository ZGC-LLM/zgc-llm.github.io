import { existsSync, readFileSync, statSync } from 'node:fs'
import { createServer, type ServerResponse } from 'node:http'
import { extname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'

import { resolveE2EPort } from './e2eConfig'

const HOST = '127.0.0.1'
const OUTPUT_ROOT = resolve(fileURLToPath(new URL('../../out', import.meta.url)))
const NOT_FOUND_FILE = resolve(OUTPUT_ROOT, '404.html')
const MIME_TYPES: Readonly<Record<string, string>> = {
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}
const COMPRESSIBLE_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.map',
  '.svg',
  '.txt',
  '.webmanifest',
  '.xml',
])
const REPRESENTATION_CACHE = new Map<string, Buffer>()

type ContentEncoding = 'br' | 'gzip'
type RepresentationEncoding = ContentEncoding | 'identity'
type EncodingNegotiation = RepresentationEncoding | 'not-acceptable'

const COMPRESSIBLE_REPRESENTATIONS: ReadonlySet<RepresentationEncoding> = new Set([
  'br',
  'gzip',
  'identity',
])
const IDENTITY_REPRESENTATION: ReadonlySet<RepresentationEncoding> = new Set(['identity'])

function isInsideOutputRoot(candidate: string): boolean {
  const relativePath = relative(OUTPUT_ROOT, candidate)

  return relativePath === '' || (!relativePath.startsWith(`..${sep}`) && relativePath !== '..')
}

function requestPathname(requestUrl: string): string | undefined {
  const rawPathname = requestUrl.split(/[?#]/u, 1)[0] ?? '/'

  if (
    !rawPathname.startsWith('/') ||
    rawPathname.includes('\\') ||
    /[\u0000-\u001f\u007f]/u.test(rawPathname) ||
    /%(?:2e|2f|5c)/iu.test(rawPathname)
  ) {
    return undefined
  }

  try {
    const decoded = decodeURIComponent(rawPathname)

    if (
      decoded.includes('\\') ||
      /[\u0000-\u001f\u007f]/u.test(decoded) ||
      decoded.split('/').some((segment) => segment === '.' || segment === '..')
    ) {
      return undefined
    }

    return decoded
  } catch {
    return undefined
  }
}

function fileForRequest(requestUrl: string): string | undefined {
  const pathname = requestPathname(requestUrl)

  if (pathname === undefined) return undefined

  const relativePath =
    pathname === '/'
      ? 'index.html'
      : extname(pathname)
        ? pathname.slice(1)
        : `${pathname.replace(/^\/+|\/+$/gu, '')}/index.html`
  const candidate = resolve(OUTPUT_ROOT, relativePath)

  return isInsideOutputRoot(candidate) ? candidate : undefined
}

function negotiateEncoding(
  header: string | readonly string[] | undefined,
  availableRepresentations: ReadonlySet<RepresentationEncoding>,
): EncodingNegotiation {
  const headerValue = typeof header === 'string' ? header : (header?.join(',') ?? '')
  if (!headerValue.trim()) {
    return availableRepresentations.has('identity') ? 'identity' : 'not-acceptable'
  }

  const preferences = new Map<string, number>()

  for (const entry of headerValue
    .toLowerCase()
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)) {
    const [name, ...parameters] = entry.split(';').map((value) => value.trim())
    const qualityParameter = parameters.find((parameter) => parameter.startsWith('q='))
    const parsedQuality = qualityParameter ? Number(qualityParameter.slice(2)) : 1
    const quality =
      Number.isFinite(parsedQuality) && parsedQuality >= 0 && parsedQuality <= 1 ? parsedQuality : 0

    preferences.set(name, quality)
  }

  function qualityFor(encoding: RepresentationEncoding): number {
    const explicit = preferences.get(encoding)

    if (explicit !== undefined) return explicit
    if (encoding === 'identity') {
      return preferences.get('*') === 0 ? 0 : 1
    }

    return preferences.get('*') ?? 0
  }

  const priority: Readonly<Record<RepresentationEncoding, number>> = {
    br: 2,
    gzip: 1,
    identity: 0,
  }
  const selected = (['br', 'gzip', 'identity'] as const)
    .filter((encoding) => availableRepresentations.has(encoding))
    .map((encoding) => ({ encoding, quality: qualityFor(encoding) }))
    .filter(({ quality }) => quality > 0)
    .sort(
      (left, right) =>
        right.quality - left.quality || priority[right.encoding] - priority[left.encoding],
    )[0]

  return selected?.encoding ?? 'not-acceptable'
}

function representation(filePath: string, encoding: RepresentationEncoding): Buffer {
  const cacheKey = `${filePath}:${encoding}`
  const cached = REPRESENTATION_CACHE.get(cacheKey)

  if (cached !== undefined) return cached

  const source = readFileSync(filePath)
  const body =
    encoding === 'br'
      ? brotliCompressSync(source, {
          params: { [constants.BROTLI_PARAM_QUALITY]: 5 },
        })
      : encoding === 'gzip'
        ? gzipSync(source, { level: 6 })
        : source

  REPRESENTATION_CACHE.set(cacheKey, body)

  return body
}

function writeNotAcceptable(response: ServerResponse): void {
  response.writeHead(406, {
    'Cache-Control': 'no-store',
    'Content-Length': 0,
    Vary: 'Accept-Encoding',
    'X-Content-Type-Options': 'nosniff',
  })
  response.end()
}

function writeFile(
  response: ServerResponse,
  filePath: string,
  statusCode: number,
  head: boolean,
  acceptEncoding: string | readonly string[] | undefined,
): void {
  const extension = extname(filePath).toLowerCase()
  const encoding = negotiateEncoding(
    acceptEncoding,
    COMPRESSIBLE_EXTENSIONS.has(extension) ? COMPRESSIBLE_REPRESENTATIONS : IDENTITY_REPRESENTATION,
  )

  if (encoding === 'not-acceptable') {
    writeNotAcceptable(response)
    return
  }

  const body = representation(filePath, encoding)

  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    ...(encoding === 'identity' ? {} : { 'Content-Encoding': encoding }),
    'Content-Length': body.byteLength,
    'Content-Type': MIME_TYPES[extension] ?? 'application/octet-stream',
    Vary: 'Accept-Encoding',
    'X-Content-Type-Options': 'nosniff',
  })

  if (head) {
    response.end()
    return
  }

  response.end(body)
}

if (!existsSync(OUTPUT_ROOT) || !existsSync(NOT_FOUND_FILE)) {
  throw new Error(
    'Static export is missing. Run `pnpm build:export` before starting the E2E server.',
  )
}

const port = resolveE2EPort(process.env.E2E_PORT)
const server = createServer((request, response) => {
  const method = request.method ?? 'GET'

  if (method !== 'GET' && method !== 'HEAD') {
    response.writeHead(405, {
      Allow: 'GET, HEAD',
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    })
    response.end('Method Not Allowed')
    return
  }

  const requestedFile = fileForRequest(request.url ?? '/')

  if (requestedFile === undefined) {
    response.writeHead(400, {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    })
    response.end(method === 'HEAD' ? undefined : 'Bad Request')
    return
  }

  const filePath =
    existsSync(requestedFile) && statSync(requestedFile).isFile() ? requestedFile : NOT_FOUND_FILE

  writeFile(
    response,
    filePath,
    filePath === requestedFile ? 200 : 404,
    method === 'HEAD',
    request.headers['accept-encoding'],
  )
})

function closeServer(): void {
  server.close((error) => {
    if (error) {
      process.stderr.write(`${error.message}\n`)
      process.exitCode = 1
    }
  })
}

process.once('SIGINT', closeServer)
process.once('SIGTERM', closeServer)

server.listen(port, HOST, () => {
  process.stdout.write(`Static export server listening at http://${HOST}:${port}\n`)
})
