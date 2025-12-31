import type { ReactNode } from 'react'

type AppShellProps = {
  title: string
  subtitle?: string
  headerRight?: ReactNode
  children: ReactNode
}

export function AppShell({ title, subtitle, headerRight, children }: AppShellProps) {
  return (
    <main className="vds-appShell">
      <header className="vds-appShell__header">
        <div className="vds-appShell__titleRow">
          <h1 className="vds-appShell__title">{title}</h1>
          {headerRight ? <div className="vds-appShell__headerRight">{headerRight}</div> : null}
        </div>
        {subtitle ? <p className="vds-appShell__subtitle">{subtitle}</p> : null}
      </header>
      {children}
    </main>
  )
}
