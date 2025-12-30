import type { ReactNode } from 'react'

type ActionsRowProps = {
  children: ReactNode
}

export function ActionsRow({ children }: ActionsRowProps) {
  return <div className="vds-actions">{children}</div>
}

