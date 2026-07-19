import type { ReactElement } from 'react'

type JsonLdData = Record<string, unknown> | readonly Record<string, unknown>[]

interface JsonLdProps {
  /** 一个或多个 schema.org 结构化数据对象 */
  data: JsonLdData
}

/**
 * 为 HTML `<script>` 数据块序列化 JSON。
 * 单纯的 `JSON.stringify` 不会转义 HTML 解析器的 `</script>` 哨兵，
 * 也不转义 JavaScript 行分隔符 U+2028/U+2029——含这些字符的内容会破坏脚本块或造成注入。
 */
export function serializeJsonLd(data: JsonLdData): string {
  return JSON.stringify(data)
    .replace(/&/gu, '\\u0026')
    .replace(/</gu, '\\u003c')
    .replace(/>/gu, '\\u003e')
    .replace(/\u2028/gu, '\\u2028')
    .replace(/\u2029/gu, '\\u2029')
}

/**
 * 渲染 `<script type="application/ld+json">` 结构化数据。
 * 服务端组件；`serializeJsonLd` 负责转义 HTML 哨兵与行分隔符。
 * 机制与 layout 主题脚本一致，静态导出（output: export）兼容。
 */
export function JsonLd({ data }: JsonLdProps): ReactElement {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
      type="application/ld+json"
    />
  )
}
