/**
 * Stat Item — Voltron Design System (Figma: 02 · Molecules › Stat Item)
 * Métrica compacta: ícone + valor (SemiBold) + rótulo opcional. size: md (ícone 16, texto sm) | sm (ícone 14, texto xs).
 */
import * as React from "react"

import { cn } from "@/lib/utils"

function StatItem({
  icon,
  value,
  label,
  size = "md",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  icon?: React.ReactNode
  value: React.ReactNode
  label?: React.ReactNode
  size?: "md" | "sm"
}) {
  return (
    <div
      data-slot="stat-item"
      data-size={size}
      className={cn(
        "inline-flex items-center text-foreground [&_svg]:shrink-0",
        size === "md" ? "gap-1.5 text-sm [&_svg]:size-4" : "gap-1 text-xs [&_svg]:size-3.5",
        className
      )}
      {...props}
    >
      {icon}
      <span className="font-semibold tabular-nums">{value}</span>
      {label && <span className="text-muted-foreground">{label}</span>}
    </div>
  )
}

export { StatItem }
