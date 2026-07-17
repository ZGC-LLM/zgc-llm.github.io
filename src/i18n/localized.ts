import { DEFAULT_LOCALE, type Locale } from './locales'

/**
 * 双语文本字段：中文（`zh`）为权威必填，英文（`en`）可选。
 * `enDraft` 标注英文为机器/初稿翻译，尚待人工校对（供覆盖度枚举）。
 */
export interface LocalizedText {
  zh: string
  en?: string
  enDraft?: boolean
}

/** 任意类型的双语容器：`zh` 权威、`en` 可选，缺失回退 `zh`。 */
export type Localized<T> = { zh: T; en?: T }

/**
 * 按 locale 解析双语容器为具体值。
 * 非默认语言缺失时回退到中文权威值——视图永远拿到确定值、不感知回退。
 */
export function resolve<T>(value: Localized<T>, locale: Locale): T {
  if (locale === DEFAULT_LOCALE) return value.zh

  const localized = value[locale]

  return localized === undefined ? value.zh : localized
}

/** 是否尚未人工校对：英文缺失（走回退）或标注了 `enDraft`。 */
export function isUntranslated(value: LocalizedText): boolean {
  return value.en === undefined || value.enDraft === true
}
