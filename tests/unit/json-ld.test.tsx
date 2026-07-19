import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { JsonLd, serializeJsonLd } from '@/components/site/json-ld'

afterEach(cleanup)

describe('JSON-LD serialization', () => {
  it('escapes every HTML-script sentinel while preserving JSON semantics', () => {
    const input = {
      hostile: '</script><tag>&value>\u2028next\u2029line',
      nested: ['safe', { quote: '"' }],
    }
    const serialized = serializeJsonLd(input)

    expect(serialized).not.toContain('</script>')
    expect(serialized).not.toContain('<tag>')
    expect(serialized).not.toContain('&value>')
    expect(serialized).not.toContain('\u2028')
    expect(serialized).not.toContain('\u2029')
    expect(serialized).toContain('\\u003c/script\\u003e')
    expect(serialized).toContain('\\u0026')
    expect(serialized).toContain('\\u2028')
    expect(serialized).toContain('\\u2029')
    expect(JSON.parse(serialized)).toEqual(input)
  })

  it.each([
    [{ '@context': 'https://schema.org', '@type': 'Organization' }],
    [[{ '@context': 'https://schema.org', '@type': 'Organization' }]],
  ])('renders parseable structured data inside the correct script type', (data) => {
    const { container } = render(<JsonLd data={data} />)
    const script = container.querySelector('script[type="application/ld+json"]')

    expect(script).not.toBeNull()
    expect(JSON.parse(script?.textContent ?? '')).toEqual(data)
  })
})
