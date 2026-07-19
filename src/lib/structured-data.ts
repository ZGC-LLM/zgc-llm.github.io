import { SITE_NAME, SITE_URL } from '@/config/site'
import { HTML_LANG, type Locale } from '@/i18n/locales'

/**
 * 站级结构化数据：全站页面统一注入 Organization + WebSite，
 * 供搜索引擎理解官网主体与站点身份（Rich Results / 知识面板）。
 * `inLanguage` 随 locale 变化；组织名/URL 为官方权威值，两语言一致。
 */
export function siteStructuredData(locale: Locale): Record<string, unknown>[] {
  const logo = new URL('/brand/llm-alliance-logo.png', SITE_URL).toString()

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      logo,
      name: SITE_NAME,
      url: SITE_URL,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      inLanguage: HTML_LANG[locale],
      name: SITE_NAME,
      url: SITE_URL,
    },
  ]
}
