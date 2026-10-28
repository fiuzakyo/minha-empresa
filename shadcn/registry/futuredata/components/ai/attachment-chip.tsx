/**
 * Attachment Chip — Voltron Design System (Figma: 02 · Molecules › Attachment Chip)
 *
 * Arquivo anexado ao Prompt Input: Key Icon + nome + meta (ou barra de progresso) + remover.
 * state: default | uploading (Progress) | error (borda error/medium, meta error/strong).
 */
import * as React from "react"
import { FileTextIcon, XIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/futuredata/ui/button"
import { KeyIcon } from "@/registry/futuredata/ui/key-icon"
import { Progress } from "@/registry/futuredata/ui/progress"

function AttachmentChip({
  className,
  name,
  meta,
  state = "default",
  progress = 0,
  icon = <FileTextIcon />,
  onRemove,
  errorText = "Falha no envio · tente novamente",
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  name: React.ReactNode
  /** Ex.: "PDF · 940 KB". */
  meta?: React.ReactNode
  state?: "default" | "uploading" | "error"
  progress?: number
  icon?: React.ReactNode
  onRemove?: () => void
  errorText?: React.ReactNode
}) {
  return (
    <div
      data-slot="attachment-chip"
      data-state={state}
      className={cn(
        "flex w-[294px] max-w-full items-center gap-3 rounded-lg border bg-card p-2",
        state === "error" ? "border-vt-error-medium" : "border-border",
        className
      )}
      {...props}
    >
      <KeyIcon size="sm">{icon}</KeyIcon>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-xs font-semibold text-foreground">{name}</span>
        {state === "uploading" ? (
          <Progress value={progress} />
        ) : (
          <span className={cn("truncate text-xs", state === "error" ? "text-vt-error-strong" : "text-muted-foreground")}>
            {state === "error" ? errorText : meta}
          </span>
        )}
      </div>
      {onRemove && (
        <Button variant="ghost" size="icon-xs" aria-label="Remover anexo" onClick={onRemove}>
          <XIcon />
        </Button>
      )}
    </div>
  )
}

export { AttachmentChip }
