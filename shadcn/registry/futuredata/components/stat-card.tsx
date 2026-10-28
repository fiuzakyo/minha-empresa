/**
 * Stat Card — Voltron Design System (Figma: 02 · Molecules › Stat Card)
 *
 * Card de KPI (padrão SectionCards do bloco dashboard-01): rótulo + atalho, valor em destaque,
 * variação e mini barras decorativas. trend: up (success/strong) | down (error/strong) | neutral (--muted-foreground).
 * Moldura --muted com cartão interno --card, ambos radius/card.
 */
import * as React from "react"
import { ArrowUpRightIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

function StatCard({
  className,
  label,
  value,
  delta,
  trend = "neutral",
  href,
  chart = true,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  label: React.ReactNode
  value: React.ReactNode
  /** Variação ou contexto (ex.: "+12% desde ontem"). */
  delta?: React.ReactNode
  trend?: "up" | "down" | "neutral"
  /** Mostra o atalho ↗ (Figma Link). */
  href?: string
  /** Mini barras decorativas (Figma Chart). */
  chart?: boolean
}) {
  return (
    <div
      data-slot="stat-card"
      data-trend={trend}
      className={cn("flex flex-col gap-2.5 rounded-card border border-border bg-muted px-1 pt-3 pb-1", className)}
      {...props}
    >
      <div className="flex items-center justify-between px-2 text-sm text-muted-foreground">
        <span>{label}</span>
        {href && (
          <a href={href} aria-label="Ver detalhes" className="rounded-sm outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50">
            <ArrowUpRightIcon className="size-4" />
          </a>
        )}
      </div>
      <div className="flex items-end gap-3 rounded-card border border-border bg-card p-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-2xl font-semibold text-foreground tabular-nums">{value}</span>
          {delta && (
            <span
              className={cn(
                "text-xs",
                trend === "up" && "text-vt-success-strong",
                trend === "down" && "text-vt-error-strong",
                trend === "neutral" && "text-muted-foreground"
              )}
            >
              {delta}
            </span>
          )}
        </div>
        {chart && (
          <div aria-hidden="true" className="flex items-end gap-1">
            {[10, 16, 12, 20].map((h, i) => (
              <span key={i} className="w-1.5 bg-border" style={{ height: h }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { StatCard }
