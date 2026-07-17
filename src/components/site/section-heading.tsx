import type { ReactElement, ReactNode } from 'react'

interface SectionHeadingProps {
  action?: ReactNode
  description?: string
  eyebrow?: string
  title: string
}

export function SectionHeading({
  action,
  description,
  eyebrow,
  title,
}: SectionHeadingProps): ReactElement {
  const heading = (
    <div className="sec-head">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  )

  if (action) {
    return (
      <div className="row-head">
        {heading}
        <div className="shrink-0">{action}</div>
      </div>
    )
  }

  return heading
}
