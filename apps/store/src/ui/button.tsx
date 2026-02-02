import React, {
  ReactNode,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react"
// 1. Importa el componente de Medusa
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ButtonVariant = "primary" | "light" | "secondary" | "outline" | "ghost"
type ButtonSize = "sm" | "md" | "lg"

type BaseProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  fullWidth?: boolean
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

type ButtonProps = ButtonAsButton | ButtonAsLink

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  fullWidth = false,
  href,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    light:
      "bg-white text-blue-600 hover:bg-blue-50 focus:ring-white border border-gray-200",
    secondary:
      "border border-white/40 text-white hover:bg-white/10 focus:ring-white",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-600",
    ghost: "text-blue-600 hover:bg-blue-50",
  }

  const sizes: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const classes = `
    ${base}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
    cursor-pointer
  `

  if (href) {
    return (
      <LocalizedClientLink href={href} className={classes} {...(props as any)}>
        {children}
      </LocalizedClientLink>
    )
  }

  return (
    <button className={classes} {...(props as any)}>
      {children}
    </button>
  )
}
