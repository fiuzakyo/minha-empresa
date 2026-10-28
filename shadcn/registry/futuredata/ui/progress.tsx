/**
 * Progress — Voltron Design System (Figma: 01 · Atoms › Progress)
 *
 * shadcn/ui nativo (Radix) + extensão:
 * - tone: brand | success | warning | error (trilho <tom>/very-soft, indicador na cor do tom)
 * - size: sm (4px) | md (8px)
 * - label: texto acima da barra, com a porcentagem à direita (Figma Label + Label text)
 */
import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressVariants = cva("relative w-full overflow-hidden rounded-full", {
  variants: {
    tone: {
      brand: "bg-accent *:data-[slot=progress-indicator]:bg-primary",
      success: "bg-vt-success-very-soft *:data-[slot=progress-indicator]:bg-success",
      warning: "bg-vt-warning-very-soft *:data-[slot=progress-indicator]:bg-warning",
      error: "bg-vt-error-very-soft *:data-[slot=progress-indicator]:bg-destructive",
    },
    size: {
      sm: "h-1",
      md: "h-2",
    },
  },
  defaultVariants: {
    tone: "brand",
    size: "sm",
  },
})

function Progress({
  className,
  value,
  tone = "brand",
  size = "sm",
  label,
  showValue = true,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants> & {
    /** Texto acima da barra (Figma Label text). */
    label?: React.ReactNode
    /** Mostra a porcentagem quando há label. */
    showValue?: boolean
  }) {
  const pct = Math.max(0, Math.min(100, value ?? 0))
  const bar = (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-tone={tone}
      value={value}
      className={cn(progressVariants({ tone, size }), !label && className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 rounded-full transition-transform"
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </ProgressPrimitive.Root>
  )
  if (!label) return bar
  return (
    <div data-slot="progress-field" className={cn("flex w-full flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        {showValue && <span className="text-muted-foreground tabular-nums">{Math.round(pct)}%</span>}
      </div>
      {bar}
    </div>
  )
}

export { Progress, progressVariants }
