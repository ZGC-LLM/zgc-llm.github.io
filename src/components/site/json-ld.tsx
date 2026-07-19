import type { ReactElement } from 'react'

import type { JsonObject, JsonValue } from '@/lib/structured-data'

type LegacyJsonLdObject = Record<string, unknown>
type JsonLdData =
  | JsonObject
  | JsonValue
  | LegacyJsonLdObject
  | readonly JsonObject[]
  | readonly LegacyJsonLdObject[]

interface JsonLdProps {
  /** Compatibility union narrows to JsonValue as page-owned Article helpers migrate. */
  data: JsonLdData
}

/**
 * Serialize JSON for an HTML script data block. JSON.stringify alone does not
 * escape the HTML parser's `</script>` sentinel or JavaScript line separators.
 */
export function serializeJsonLd(data: JsonLdData): string {
  return JSON.stringify(data)
    .replace(/&/gu, '\\u0026')
    .replace(/</gu, '\\u003c')
    .replace(/>/gu, '\\u003e')
    .replace(/\u2028/gu, '\\u2028')
    .replace(/\u2029/gu, '\\u2029')
}

export function JsonLd({ data }: JsonLdProps): ReactElement {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
      type="application/ld+json"
    />
  )
}
