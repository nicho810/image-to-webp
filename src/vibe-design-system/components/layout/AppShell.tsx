import type { ReactNode } from 'react'

type AppShellProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <main className="vds-appShell">
      <header className="vds-appShell__header">
        <h1 className="vds-appShell__title">{title}</h1>
        {subtitle ? <p className="vds-appShell__subtitle">{subtitle}</p> : null}
      </header>
      {children}
    </main>
  )
}

