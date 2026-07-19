import { getSiteName, SITE_NAME, SITE_URL } from '@/config/site'
import { HTML_LANG, type Locale } from '@/i18n/locales'
import { absoluteCanonicalUrl } from '@/i18n/routing'

export type JsonPrimitive = boolean | null | number | string
export type JsonValue = JsonObject | JsonPrimitive | readonly JsonValue[]
export interface JsonObject {
  readonly [key: string]: JsonValue
}

const organizationId = new URL('/#organization', `${SITE_URL}/`).toString()
const websiteId = (locale: Locale): string => `${absoluteCanonicalUrl('/', locale)}#website`

/**
 * Organization + locale-specific WebSite schema. The repository image is not
 * declared as an official logo until its brand-usage authorisation is recorded.
 */
export function siteStructuredData(locale: Locale): readonly JsonObject[] {
  return [
    {
      '@context': 'https://schema.org',
      '@id': organizationId,
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteCanonicalUrl('/', 'zh'),
    },
    {
      '@context': 'https://schema.org',
      '@id': websiteId(locale),
      '@type': 'WebSite',
      inLanguage: HTML_LANG[locale],
      name: getSiteName(locale),
      publisher: { '@id': organizationId },
      url: absoluteCanonicalUrl('/', locale),
    },
  ]
}

export interface ArticleStructuredDataInput {
  dateModified?: string
  datePublished: string
  description: string
  headline: string
  locale: Locale
  zhPath: string
}

/** Locale-safe Article schema sharing the same canonical URL contract as metadata/sitemap. */
export function articleStructuredData({
  dateModified,
  datePublished,
  description,
  headline,
  locale,
  zhPath,
}: ArticleStructuredDataInput): JsonObject {
  const url = absoluteCanonicalUrl(zhPath, locale)

  return {
    '@context': 'https://schema.org',
    '@id': `${url}#article`,
    '@type': 'Article',
    ...(dateModified ? { dateModified } : {}),
    datePublished,
    description,
    headline,
    inLanguage: HTML_LANG[locale],
    mainEntityOfPage: { '@id': url },
    publisher: { '@id': organizationId },
    url,
  }
}
