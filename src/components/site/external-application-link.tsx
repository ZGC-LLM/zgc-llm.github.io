import type { ReactElement, ReactNode } from 'react'

import { resolveApplicationTarget } from '@/config/site'
import type { Locale } from '@/i18n/locales'

interface ExternalApplicationLinkProps {
  children?: ReactNode
  className?: string
  configuredUrl?: string
  label?: string
  locale?: Locale
}

type ExternalApplicationProvider = 'external' | 'feishu'

interface ExternalApplicationCopy {
  providers: Record<
    ExternalApplicationProvider,
    { accessibleSuffix: string; visibleNotice: string }
  >
  unavailable: (label: string) => string
}

const EXTERNAL_APPLICATION_COPY: Record<Locale, ExternalApplicationCopy> = {
  en: {
    providers: {
      external: {
        accessibleSuffix: ', opens an external service in a new tab',
        visibleNotice:
          'Opens an external service. Application information is handled by the operator identified on the destination page; this site does not receive or store application-form data.',
      },
      feishu: {
        accessibleSuffix: ', opens a Feishu form in a new tab',
        visibleNotice:
          'Opens Feishu. Application information is handled by the operator identified on that form; this site does not receive or store application-form data.',
      },
    },
    unavailable: (label) =>
      `${label}: This channel is not currently available. Please check this site again for updates.`,
  },
  zh: {
    providers: {
      external: {
        accessibleSuffix: '，打开外部服务（新窗口）',
        visibleNotice:
          '将前往外部服务。申请信息由目标页面所示运营方处理；本站不接收或保存申请表单数据。',
      },
      feishu: {
        accessibleSuffix: '，打开飞书外部表单（新窗口）',
        visibleNotice: '将前往飞书。申请信息由表单所示运营方处理；本站不接收或保存申请表单数据。',
      },
    },
    unavailable: (label) => `${label}：当前不可用。请稍后查看官网更新。`,
  },
}

function copyLocaleFor(label: string): Locale {
  return /[\u3400-\u9fff]/u.test(label) ? 'zh' : 'en'
}

function providerFor(href: string): ExternalApplicationProvider {
  const hostname = new URL(href).hostname.toLowerCase()

  return hostname === 'feishu.cn' || hostname.endsWith('.feishu.cn') ? 'feishu' : 'external'
}

export function ExternalApplicationLink({
  children,
  className,
  configuredUrl,
  label,
  locale,
}: ExternalApplicationLinkProps): ReactElement {
  const target = resolveApplicationTarget(configuredUrl)
  const resolvedLabel = label ?? target.label
  const copy = EXTERNAL_APPLICATION_COPY[locale ?? copyLocaleFor(resolvedLabel)]
  const unavailableMessage = copy.unavailable(resolvedLabel)

  if (!target.isAvailable || !target.href) {
    return (
      <span className="external-application external-application--unavailable">
        <span
          aria-disabled="true"
          aria-live="polite"
          className="external-application__unavailable"
          title={unavailableMessage}
        >
          {unavailableMessage}
        </span>
      </span>
    )
  }

  const providerCopy = copy.providers[providerFor(target.href)]

  return (
    <span className="external-application">
      <a
        aria-label={`${resolvedLabel}${providerCopy.accessibleSuffix}`}
        className={['external-application__link', className].filter(Boolean).join(' ')}
        href={target.href}
        rel="noreferrer noopener"
        target="_blank"
      >
        {children ?? resolvedLabel}
        <span aria-hidden="true" className="external-application__icon">
          ↗
        </span>
      </a>
      <small className="external-application__notice">{providerCopy.visibleNotice}</small>
    </span>
  )
}
