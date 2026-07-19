import type { ReactElement } from 'react'

interface JsonLdProps {
  /** 一个或多个 schema.org 结构化数据对象 */
  data: Record<string, unknown> | readonly Record<string, unknown>[]
}

/**
 * 渲染 `<script type="application/ld+json">` 结构化数据。
 * 服务端组件；`JSON.stringify` 负责转义，注入面仅来自内部常量（无用户输入）。
 * 机制与 layout 主题脚本一致，静态导出（output: export）兼容。
 */
export function JsonLd({ data }: JsonLdProps): ReactElement {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  )
}
