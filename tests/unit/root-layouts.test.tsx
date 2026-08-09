import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import EnRootLayout from '@/app/(en)/layout'
import RootLayout from '@/app/(frontend)/layout'

function findBody(element: ReactElement): ReactElement<{ suppressHydrationWarning?: boolean }> {
  const body = Children.toArray((element.props as { children?: ReactNode }).children).find(
    (child) => isValidElement(child) && child.type === 'body',
  )

  if (!isValidElement<{ suppressHydrationWarning?: boolean }>(body)) {
    throw new Error('Root layout must render a body element')
  }

  return body
}

describe('root layouts', () => {
  it('tolerates browser-extension attributes injected on the Chinese body', () => {
    const body = findBody(RootLayout({ children: <main /> }))

    expect(body.props.suppressHydrationWarning).toBe(true)
  })

  it('tolerates browser-extension attributes injected on the English body', () => {
    const body = findBody(EnRootLayout({ children: <main /> }))

    expect(body.props.suppressHydrationWarning).toBe(true)
  })
})
