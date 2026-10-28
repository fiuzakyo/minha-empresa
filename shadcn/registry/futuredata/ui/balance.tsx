/**
 * Balance — Voltron Design System (Figma: 02 · Molecules › Balance)
 *
 * Saldo do usuário com ação de adicionar (Button Group: texto + Button default icon-lg "+").
 * - collapsed: versão compacta para a Sidebar recolhida (só valor + botão; o rótulo vai para o title)
 * Contêiner --card + --border, radius/button, Elevation/shadow-xs.
 */
import * as React from "react"
import { PlusIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/futuredata/ui/button"

function Balance({
  className,
  label = "Saldo",
  value,
  onAdd,
  addLabel = "Adicionar saldo",
  collapsed = false,
  ...props
}: React.ComponentProps<"div"> & {
  label?: React.ReactNode
  value: React.ReactNode
  onAdd?: () => void
  addLabel?: string
  /** Versão compacta (Figma Mode=Collapsed). */
  collapsed?: boolean
}) {
  return (
    <div
      data-slot="balance"
      data-collapsed={collapsed || undefined}
      title={collapsed && typeof label === "string" ? label : undefined}
      className={cn(
        "flex overflow-hidden rounded-button border border-border bg-card shadow-xs",
        collapsed ? "w-12 flex-col" : "w-full",
        className
      )}
      {...props}
    >
      <div className={cn("flex min-w-0 flex-1 flex-col", collapsed ? "items-center px-0.5 py-1.5" : "px-4 py-2")}>
        {!collapsed && <span className="text-xs text-muted-foreground">{label}</span>}
        <span className={cn("truncate font-semibold text-foreground", collapsed ? "text-xs" : "text-lg")}>{value}</span>
      </div>
      {onAdd && (
        <Button
          size="icon-lg"
          aria-label={addLabel}
          onClick={onAdd}
          className={cn("h-auto rounded-none shadow-none", collapsed ? "h-10 w-full" : "w-14 self-stretch")}
        >
          <PlusIcon />
        </Button>
      )}
    </div>
  )
}

export { Balance }
