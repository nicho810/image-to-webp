import type { ReactNode } from 'react'

type AlertVariant = 'danger'

type AlertProps = {
  variant?: AlertVariant
  children: ReactNode
}

export function Alert({ variant = 'danger', children }: AlertProps) {
  return <div className={`vds-alert vds-alert--${variant}`}>{children}</div>
}

