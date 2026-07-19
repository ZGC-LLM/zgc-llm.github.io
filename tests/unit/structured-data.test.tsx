import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { SITE_NAME, SITE_URL } from '@/config/site'
import { HTML_LANG } from '@/i18n/locales'
import { siteStructuredData } from '@/lib/structured-data'
import { JsonLd } from '@/components/site/json-ld'

afterEach(cleanup)

describe('siteStructuredData', () => {
  it('emits an Organization entry with the canonical name, URL and logo', () => {
    const [organization] = siteStructuredData('zh')

    expect(organization).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    })
    expect(organization.logo).toBe(new URL('/brand/llm-alliance-logo.png', SITE_URL).toString())
  })

  it('emits a WebSite entry whose inLanguage follows the given locale', () => {
    const zhData = siteStructuredData('zh')
    const enData = siteStructuredData('en')

    const zhWebsite = zhData.find((entry) => entry['@type'] === 'WebSite')
    const enWebsite = enData.find((entry) => entry['@type'] === 'WebSite')

    expect(zhWebsite?.inLanguage).toBe(HTML_LANG.zh)
    expect(enWebsite?.inLanguage).toBe(HTML_LANG.en)
    expect(zhWebsite?.name).toBe(SITE_NAME)
    expect(zhWebsite?.url).toBe(SITE_URL)
  })
})

describe('JsonLd', () => {
  it('renders a script tag carrying the serialized structured data without escaping quotes', () => {
    const { container } = render(<JsonLd data={{ '@type': 'Organization', name: 'Example' }} />)

    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    expect(script?.textContent).toBe(JSON.stringify({ '@type': 'Organization', name: 'Example' }))
  })

  it('accepts an array of structured-data objects', () => {
    const data = [{ '@type': 'Organization' }, { '@type': 'WebSite' }]
    const { container } = render(<JsonLd data={data} />)

    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script?.textContent).toBe(JSON.stringify(data))
  })
})
