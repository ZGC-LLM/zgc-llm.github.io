import type { ReactElement, ReactNode } from 'react'

import { resolveApplicationTarget } from '@/config/site'

interface ExternalApplicationLinkProps {
  children?: ReactNode
  className?: string
  configuredUrl?: string
  label?: string
}

export function ExternalApplicationLink({
  children,
  className,
  configuredUrl,
  label,
}: ExternalApplicationLinkProps): ReactElement {
  const target = resolveApplicationTarget(configuredUrl)
  const resolvedLabel = label ?? target.label

  if (!target.isAvailable || !target.href) {
    return (
      <span aria-disabled="true" className={className} title={target.unavailableMessage}>
        {target.unavailableMessage}
      </span>
    )
  }

  return (
    <a
      aria-label={`${resolvedLabel}（打开外部表单）`}
      className={className}
      href={target.href}
      rel="noreferrer noopener"
      target="_blank"
    >
      {children ?? resolvedLabel}
    </a>
  )
}
