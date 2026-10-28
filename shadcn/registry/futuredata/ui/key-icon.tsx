/**
 * Key Icon — Voltron Design System (Figma: 01 · Atoms › Key Icon)
 *
 * Ícone em destaque: contêiner + ícone Phosphor (cards de recurso, estados vazios, benefícios).
 * - tone:    neutral | brand | success | warning | error
 * - variant: subtle (tinta + ícone colorido) | solid (fundo cheio)   — Figma Style
 * - size:    sm 32 · md 40 · lg 48 · xl 64 (ícone 16 · 20 · 24 · 32)
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const keyIconVariants = cva(
  "inline-flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "",
        brand: "",
        success: "",
        warning: "",
        error: "",
      },
      variant: {
        subtle: "",
        solid: "",
      },
      size: {
        sm: "size-8 rounded-md [&_svg]:size-4",
        md: "size-10 rounded-lg [&_svg]:size-5",
        lg: "size-12 rounded-xl [&_svg]:size-6",
        xl: "size-16 rounded-2xl [&_svg]:size-8",
      },
    },
    compoundVariants: [
      { variant: "subtle", tone: "neutral", className: "bg-background text-foreground" },
      { variant: "subtle", tone: "brand", className: "bg-accent text-primary" },
      { variant: "subtle", tone: "success", className: "bg-vt-success-very-soft text-vt-success-base" },
      { variant: "subtle", tone: "warning", className: "bg-vt-warning-very-soft text-vt-warning-base" },
      { variant: "subtle", tone: "error", className: "bg-vt-error-very-soft text-vt-error-base" },
      { variant: "solid", tone: "neutral", className: "bg-foreground text-background" },
      { variant: "solid", tone: "brand", className: "bg-primary text-primary-foreground" },
      { variant: "solid", tone: "success", className: "bg-success text-success-foreground" },
      { variant: "solid", tone: "warning", className: "bg-warning text-warning-foreground" },
      { variant: "solid", tone: "error", className: "bg-destructive text-primary-foreground" },
    ],
    defaultVariants: {
      tone: "neutral",
      variant: "subtle",
      size: "sm",
    },
  }
)

function KeyIcon({
  className,
  tone = "neutral",
  variant = "subtle",
  size = "sm",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof keyIconVariants>) {
  return (
    <span
      data-slot="key-icon"
      data-tone={tone}
      data-variant={variant}
      data-size={size}
      aria-hidden={props["aria-label"] ? undefined : true}
      className={cn(keyIconVariants({ tone, variant, size }), className)}
      {...props}
    />
  )
}

export { KeyIcon, keyIconVariants }
