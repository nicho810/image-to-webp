import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  children: ReactNode
}

export function Card({ title, children }: CardProps) {
  return (
    <section className="vds-card">
      {title ? <h2 className="vds-card__title">{title}</h2> : null}
      {children}
    </section>
  )
}

