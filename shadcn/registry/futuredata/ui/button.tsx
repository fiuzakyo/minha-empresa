/**
 * Button — Voltron Design System (Figma: 01 · Atoms › Button)
 *
 * shadcn/ui nativo + extensão Voltron (`soft`).
 * - variant: default | secondary | ghost | destructive | link | outline | soft
 * - size:    sm | default | lg | icon-xs | icon-sm | icon | icon-lg
 *   (altura vem de size/button/* e muda por marca: Verax é mais alta)
 * - State (Figma) → estados CSS: hover, focus-visible, disabled
 * - Ícones Phosphor 20px (size-5). Ao lado do texto, marque com
 *   data-icon="inline-start" | "inline-end" (ficam com 60% de opacidade, como no Figma).
 */
import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-button font-medium",
    "transition-[color,background-color,border-color,box-shadow,opacity] outline-none",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:shadow-none",
    "aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
    "[&>[data-icon=inline-start]]:opacity-60 [&>[data-icon=inline-end]]:opacity-60",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-brand-md hover:bg-primary/90 disabled:opacity-20",
        secondary:
          "bg-vt-secondary-emphasis text-secondary-foreground shadow-secondary-md hover:bg-vt-secondary-strong/80 focus-visible:bg-vt-secondary-strong focus-visible:ring-chart-2/50 disabled:bg-secondary disabled:opacity-20",
        ghost: "text-foreground hover:bg-accent disabled:opacity-50",
        destructive:
          "bg-destructive text-primary-foreground shadow-error-md hover:bg-destructive/90 focus-visible:ring-destructive/20 disabled:opacity-50",
        link: "text-primary underline-offset-4 hover:underline disabled:opacity-50",
        outline:
          "border border-input bg-card text-foreground hover:bg-background disabled:opacity-50",
        soft: "bg-vt-primary-very-soft text-vt-primary-strong hover:bg-vt-primary-soft disabled:opacity-50",
      },
      size: {
        sm: "h-button-sm gap-1.5 px-3 text-sm has-[>[data-icon=inline-start]]:ps-2.5 has-[>[data-icon=inline-end]]:pe-2.5",
        default:
          "h-button-default gap-2 px-4 text-base has-[>[data-icon=inline-start]]:ps-3 has-[>[data-icon=inline-end]]:pe-3",
        lg: "h-button-lg gap-2 px-6 text-base has-[>[data-icon=inline-start]]:ps-4 has-[>[data-icon=inline-end]]:pe-4",
        "icon-xs": "size-button-icon-xs [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-button-icon-sm",
        icon: "size-button-icon",
        "icon-lg": "size-button-icon-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
