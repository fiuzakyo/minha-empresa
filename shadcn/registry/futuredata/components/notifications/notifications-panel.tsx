/**
 * Notifications Panel — Voltron Design System (Figma: 03 · Organisms › Notifications)
 *
 * Centro de notificações (Popover + Tabs + lista de NotificationItem): título,
 * "Marcar todas como lidas", filtros em Tabs (pills-elevated) com contadores e a lista.
 * Cada produto define os tipos e os filtros.
 *
 *   <Popover><PopoverTrigger asChild><Button …/></PopoverTrigger>
 *     <NotificationsPanel filters={[{ value: "todas", label: "Todas", count: 8, items: <>…</> }]} />
 *   </Popover>
 */
import * as React from "react"
import { ChecksIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/futuredata/ui/button"
import { PopoverContent } from "@/registry/futuredata/ui/popover"
import { Tabs, TabsContent, TabsCount, TabsList, TabsTrigger } from "@/registry/futuredata/ui/tabs"

type NotificationsFilter = {
  value: string
  label: React.ReactNode
  count?: number
  /** <NotificationItem/>s deste filtro. */
  items: React.ReactNode
}

function NotificationsPanel({
  title = "Notificações",
  filters,
  onMarkAllRead,
  className,
  asPopover = true,
}: {
  title?: React.ReactNode
  filters: NotificationsFilter[]
  onMarkAllRead?: () => void
  className?: string
  /** false renderiza o painel fora de um Popover (ex.: página dedicada). */
  asPopover?: boolean
}) {
  const body = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {onMarkAllRead && (
          <Button variant="link" size="sm" className="px-0" onClick={onMarkAllRead}>
            <ChecksIcon data-icon="inline-start" />
            Marcar todas como lidas
          </Button>
        )}
      </div>
      <Tabs defaultValue={filters[0]?.value}>
        <TabsList variant="pills-elevated">
          {filters.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
              {f.count != null && <TabsCount>{f.count}</TabsCount>}
            </TabsTrigger>
          ))}
        </TabsList>
        {filters.map((f) => (
          <TabsContent key={f.value} value={f.value}>
            <div role="list" className="-mx-2 flex max-h-[28rem] flex-col overflow-y-auto">
              {f.items}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
  if (!asPopover) {
    return <div className={cn("w-[440px] rounded-xl border border-border bg-popover p-5 shadow-lg", className)}>{body}</div>
  }
  return (
    <PopoverContent align="end" className={cn("w-[440px] p-5", className)}>
      {body}
    </PopoverContent>
  )
}

export { NotificationsPanel }
export type { NotificationsFilter }
