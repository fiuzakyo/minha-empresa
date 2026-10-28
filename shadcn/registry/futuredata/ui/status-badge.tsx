/**
 * Status Badge — Voltron Design System (Figma: 01 · Atoms › Status Badge)
 *
 * Pílula de status com ponto colorido e ação opcional (composição sobre Badge outline, rounded-full).
 * - status: neutral | success | warning | error | brand → cor do ponto
 * - action: texto da ação (Figma Action text), renderizado como pílula --muted à direita
 * Hover → Elevation/shadow-sm · Focus → anel --ring. Com `href` a pílula inteira é um link.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statusDotVariants = cva("size-2 shrink-0 rounded-full", {
  variants: {
    status: {
      neutral: "bg-foreground",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-destructive",
      brand: "bg-primary",
    },
  },
  defaultVariants: { status: "neutral" },
})

function StatusBadge({
  className,
  status = "neutral",
  action,
  children,
  ...props
}: React.ComponentProps<"a"> &
  VariantProps<typeof statusDotVariants> & {
    /** Texto da ação à direita (ex.: "Ver novidades"). */
    action?: React.ReactNode
  }) {
  // com href vira link; sem href é só uma pílula informativa
  const Comp = props.href ? "a" : "span"
  return (
    <Comp
      data-slot="status-badge"
      data-status={status}
      className={cn(
        "inline-flex h-8 w-fit items-center gap-1 rounded-full border border-border bg-card ps-3 text-sm font-medium text-vt-text-secondary shadow-xs outline-none",
        "transition-shadow hover:shadow-sm focus-visible:ring-[3px] focus-visible:ring-ring/50",
        action ? "pe-1" : "pe-3",
        className
      )}
      {...props}
    >
      <span className={cn("flex items-center gap-2", action && "pe-2")}>
        <span aria-hidden="true" className={statusDotVariants({ status })} />
        {children}
      </span>
      {action && (
        <span data-slot="status-badge-action" className="inline-flex h-6 items-center rounded-full bg-muted px-3">
          {action}
        </span>
      )}
    </Comp>
  )
}

export { StatusBadge }
