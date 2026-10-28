/**
 * Badge — Voltron Design System (Figma: 01 · Atoms › Badge)
 *
 * shadcn/ui nativo (default | secondary | destructive | outline | ghost | link)
 * + extensão Voltron (success | warning | info).
 * Anatomia: rounded-full, px-2 py-0.5, gap-1, text-xs font-medium; ícone 12px (size-3)
 * marcado com data-icon="inline-start".
 */
import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border border-transparent px-2 py-0.5 text-xs font-medium",
    "transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none",
    "[&>svg]:pointer-events-none [&>svg]:size-3",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "bg-destructive text-primary-foreground [a&]:hover:bg-destructive/90",
        outline: "border-border text-foreground [a&]:hover:bg-accent",
        ghost: "text-foreground [a&]:hover:bg-accent",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        success: "bg-success text-success-foreground [a&]:hover:bg-success/90",
        warning: "bg-warning text-warning-foreground [a&]:hover:bg-warning/90",
        info: "bg-info text-info-foreground [a&]:hover:bg-info/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
