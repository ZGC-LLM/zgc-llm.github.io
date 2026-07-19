export type Locale = 'zh' | 'en'

export const LOCALES: readonly Locale[] = ['zh', 'en'] as const

export const DEFAULT_LOCALE: Locale = 'zh'

/** `<html lang>` 取值：zh→zh-CN、en→en。 */
export const HTML_LANG: Readonly<Record<Locale, string>> = {
  en: 'en',
  zh: 'zh-CN',
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}
