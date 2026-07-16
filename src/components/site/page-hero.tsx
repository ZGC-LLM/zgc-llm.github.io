import type { ReactElement, ReactNode } from 'react'

interface PageHeroProps {
  actions?: ReactNode
  description: string
  eyebrow?: string
  title: string
}

export function PageHero({ actions, description, eyebrow, title }: PageHeroProps): ReactElement {
  return (
    <section className="page-hero">
      <div className="page-hero__inner site-container">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p>{description}</p>
        {actions ? <div className="hero-actions">{actions}</div> : null}
      </div>
    </section>
  )
}
