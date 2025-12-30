import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'accent' | 'neutral' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({ variant = 'accent', className, children, ...props }: ButtonProps) {
  const classes = ['vds-button', `vds-button--${variant}`, className].filter(Boolean).join(' ')
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

