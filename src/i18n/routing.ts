import { DEFAULT_LOCALE, type Locale } from './locales'

/**
 * 路由 ↔ URL 单一来源。
 *
 * 约定（design §2.1，已由发起方确认）：中文为默认、钉在**根路径**（`/`、`/alliance` …
 * 物理路径不变）；英文置于 `/en/*` 前缀。所有 hreflang / canonical / 语言切换
 * 均从这里派生，避免各处硬编码前缀导致漂移。
 *
 * 入参 `zhPath` 是页面的中文规范路径（如 `/alliance`、`/news/foo`），
 * 动态路由由调用方拼好 slug 后传入。
 */
const EN_PREFIX = '/en'

export function localizePath(zhPath: string, locale: Locale): string {
  const normalized = zhPath === '' ? '/' : zhPath

  if (locale === DEFAULT_LOCALE) return normalized

  return normalized === '/' ? EN_PREFIX : `${EN_PREFIX}${normalized}`
}

export interface LocalizedAlternates {
  canonical: string
  languages: Record<string, string>
}

/**
 * 为某页构建 `metadata.alternates`：
 * - `canonical` 指向**当前 locale** 自身的 URL
 * - `languages` 列出全部语言变体（hreflang），`x-default` 指向中文
 * 返回相对路径，由 Next 依 `metadataBase` 解析为绝对 URL。
 */
export function buildAlternates(zhPath: string, locale: Locale): LocalizedAlternates {
  return {
    canonical: localizePath(zhPath, locale),
    languages: {
      en: localizePath(zhPath, 'en'),
      'x-default': localizePath(zhPath, DEFAULT_LOCALE),
      'zh-CN': localizePath(zhPath, 'zh'),
    },
  }
}
