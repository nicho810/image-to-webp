import type { SelectHTMLAttributes, ReactNode } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode
}

export function Select({ className, children, ...props }: SelectProps) {
  const classes = ['vds-select', className].filter(Boolean).join(' ')
  return (
    <select className={classes} {...props}>
      {children}
    </select>
  )
}

