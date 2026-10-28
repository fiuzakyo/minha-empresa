/**
 * Notification Item — Voltron Design System (Figma: 02 · Molecules › Notifications / Item)
 *
 * Linha de notificação (shadcn Item): avatar, autor em destaque, mensagem, data, tempo relativo
 * e ponto de não lida. type:
 * - follow   → "começou a seguir você"
 * - comment  → trecho do comentário em --muted (fica --card no hover)
 * - reaction → selo de coração --primary sobre o avatar
 * - invite   → alvo em destaque + Recusar / Aceitar
 * Hover → --muted. radius/lg, padding 12, gap 12.
 */
import * as React from "react"
import { HeartIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/futuredata/ui/button"

function NotificationItem({
  className,
  type = "follow",
  avatar,
  actor,
  message,
  target,
  comment,
  date,
  time,
  unread = false,
  onAccept,
  onDecline,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  type?: "follow" | "comment" | "reaction" | "invite"
  avatar: React.ReactNode
  actor: React.ReactNode
  /** Texto livre da mensagem (ex.: "comentou no seu documento"). */
  message: React.ReactNode
  /** Alvo em destaque no convite (Figma Target). */
  target?: React.ReactNode
  comment?: React.ReactNode
  date?: React.ReactNode
  time?: React.ReactNode
  unread?: boolean
  onAccept?: () => void
  onDecline?: () => void
}) {
  return (
    <div
      role="listitem"
      data-slot="notification-item"
      data-type={type}
      data-unread={unread || undefined}
      className={cn("group/notification flex gap-3 rounded-lg p-3 transition-colors hover:bg-muted", className)}
      {...props}
    >
      <div className="relative size-10 shrink-0">
        {avatar}
        {type === "reaction" && (
          <span className="absolute -right-1 -bottom-1 flex size-[18px] items-center justify-center rounded-full bg-primary text-primary-foreground ring-[3px] ring-card">
            <HeartIcon weight="fill" className="size-3" aria-label="Reação" />
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex gap-2">
          <p className="flex-1 text-sm text-foreground">
            <span className="font-semibold">{actor}</span> {message}
            {target && <span className="font-semibold"> {target}</span>}
          </p>
          {unread && (
            <span className="flex h-5 items-center">
              <span aria-label="Não lida" className="size-2 rounded-full bg-primary" />
            </span>
          )}
        </div>
        {(date || time) && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{date}</span>
            <span>{time}</span>
          </div>
        )}
        {type === "comment" && comment && (
          <p className="mt-1 rounded-md bg-muted p-3 text-sm text-foreground transition-colors group-hover/notification:bg-card">{comment}</p>
        )}
        {type === "invite" && (
          <div className="mt-1 flex gap-2">
            <Button variant="outline" size="sm" onClick={onDecline}>
              Recusar
            </Button>
            <Button size="sm" onClick={onAccept}>
              Aceitar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export { NotificationItem }
