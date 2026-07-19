import type { Metadata } from 'next'

import { getSiteDescription, getSiteName, SITE_NAME, SITE_URL } from '@/config/site'
import { DEFAULT_LOCALE, HREF_LANG, type Locale } from './locales'

const EN_PREFIX = '/en'
const CANONICAL_TRAILING_SLASH = process.env.BUILD_TARGET === 'export'

const OPEN_GRAPH_LOCALE: Readonly<Record<Locale, string>> = {
  en: 'en_US',
  zh: 'zh_CN',
}

function normalizeInternalPath(path: string): string {
  const value = path === '' ? '/' : path

  if (
    !value.startsWith('/') ||
    value.includes('//') ||
    value.includes('\\') ||
    value.includes('?') ||
    value.includes('#') ||
    /[\u0000-\u001f\u007f]/u.test(value) ||
    /%(?:2e|2f|5c)/iu.test(value)
  ) {
    throw new Error(`Expected an internal pathname without query or fragment: ${path}`)
  }

  const segments = value.split('/')
  if (segments.some((segment) => segment === '.' || segment === '..')) {
    throw new Error(`Path traversal segments are not allowed: ${path}`)
  }

  return value === '/' ? '/' : value.replace(/\/+$/u, '')
}

/** Convert an arbitrary supported-locale pathname into the canonical zh route shape. */
export function toZhPath(pathname: string): string {
  const normalized = normalizeInternalPath(pathname)

  if (normalized === EN_PREFIX) return '/'
  if (normalized.startsWith(`${EN_PREFIX}/`)) return normalized.slice(EN_PREFIX.length)

  return normalized
}

export function localeFromPathname(pathname: string): Locale {
  const normalized = normalizeInternalPath(pathname)

  return normalized === EN_PREFIX || normalized.startsWith(`${EN_PREFIX}/`) ? 'en' : 'zh'
}

/** Map one canonical zh route shape to the requested locale without losing dynamic slugs. */
export function localizePath(zhPath: string, locale: Locale): string {
  const normalized = toZhPath(zhPath)

  if (locale === DEFAULT_LOCALE) return normalized

  return normalized === '/' ? EN_PREFIX : `${EN_PREFIX}${normalized}`
}

export function switchLocalePath(pathname: string, locale: Locale): string {
  return localizePath(toZhPath(pathname), locale)
}

/** Canonical pathname for the selected build target (export uses directory URLs). */
export function canonicalPath(zhPath: string, locale: Locale): string {
  const localized = localizePath(zhPath, locale)

  if (!CANONICAL_TRAILING_SLASH || localized === '/') return localized

  return `${localized}/`
}

export function absoluteSiteUrl(pathname: string): string {
  const keepTrailingSlash = pathname.length > 1 && pathname.endsWith('/')
  const normalized = normalizeInternalPath(pathname)
  const outputPath = keepTrailingSlash ? `${normalized}/` : normalized

  return new URL(outputPath, `${SITE_URL}/`).toString()
}

export function absoluteCanonicalUrl(zhPath: string, locale: Locale): string {
  return absoluteSiteUrl(canonicalPath(zhPath, locale))
}

export interface LocalizedAlternates {
  canonical: string
  languages: Record<string, string>
}

/** Absolute canonical/hreflang set with zh as x-default. */
export function buildAlternates(zhPath: string, locale: Locale): LocalizedAlternates {
  return {
    canonical: absoluteCanonicalUrl(zhPath, locale),
    languages: {
      [HREF_LANG.en]: absoluteCanonicalUrl(zhPath, 'en'),
      'x-default': absoluteCanonicalUrl(zhPath, DEFAULT_LOCALE),
      [HREF_LANG.zh]: absoluteCanonicalUrl(zhPath, 'zh'),
    },
  }
}

export type PageMetadataType = 'article' | 'website'

export interface PageMetadataInput {
  absoluteTitle?: boolean
  description: string
  locale: Locale
  publishedTime?: string
  title: string
  type?: PageMetadataType
  zhPath: string
}

/**
 * Complete per-page metadata contract. T-004–T-006 page shells provide only
 * their locale-safe title/description/path; canonical, OG and Twitter cannot
 * drift independently. The shared static PNG route provides a provisional,
 * text-only social image without presenting an unapproved graphic as an
 * official Alliance logo.
 */
export function buildPageMetadata({
  absoluteTitle = false,
  description,
  locale,
  publishedTime,
  title,
  type = 'website',
  zhPath,
}: PageMetadataInput): Metadata {
  const canonical = absoluteCanonicalUrl(zhPath, locale)
  const socialImage = {
    alt: 'ZGCLLM — www.zgc-llm.org.cn',
    height: 630,
    type: 'image/png',
    url: absoluteSiteUrl('/social-preview.png'),
    width: 1200,
  }
  const socialTitle = absoluteTitle
    ? title
    : locale === 'zh'
      ? `${title}｜${SITE_NAME}`
      : `${title} | ZGCLLM`
  const commonOpenGraph = {
    alternateLocale: [OPEN_GRAPH_LOCALE[locale === 'zh' ? 'en' : 'zh']],
    description,
    locale: OPEN_GRAPH_LOCALE[locale],
    images: [socialImage],
    siteName: getSiteName(locale),
    title: socialTitle,
    url: canonical,
  }

  return {
    alternates: buildAlternates(zhPath, locale),
    description,
    openGraph:
      type === 'article'
        ? {
            ...commonOpenGraph,
            ...(publishedTime ? { publishedTime } : {}),
            type: 'article',
          }
        : {
            ...commonOpenGraph,
            type: 'website',
          },
    title: absoluteTitle ? { absolute: title } : title,
    twitter: {
      card: 'summary_large_image',
      description,
      images: [{ alt: socialImage.alt, url: socialImage.url }],
      title: socialTitle,
    },
  }
}

export function buildRootMetadata(locale: Locale): Metadata {
  const name = getSiteName(locale)
  const description = getSiteDescription(locale)
  const pageMetadata = buildPageMetadata({
    absoluteTitle: true,
    description,
    locale,
    title: name,
    zhPath: '/',
  })

  return {
    ...pageMetadata,
    applicationName: name,
    icons: {
      apple: [{ sizes: '180x180', type: 'image/png', url: '/apple-icon.png' }],
      icon: [{ sizes: '64x64', type: 'image/png', url: '/icon.png' }],
    },
    metadataBase: new URL(SITE_URL),
    title: {
      default: locale === 'zh' ? `${SITE_NAME}｜官网` : 'ZGCLLM',
      template: locale === 'zh' ? `%s｜${SITE_NAME}` : '%s | ZGCLLM',
    },
  }
}
