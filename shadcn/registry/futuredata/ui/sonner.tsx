/**
 * Toast — Voltron Design System (Figma: 02 · Molecules › Toast)
 *
 * shadcn/ui Sonner com o visual Voltron: superfície --card + --border + Elevation/shadow-md;
 * o ícone carrega o status (error → --destructive, warning → --warning, success → --success,
 * information → --info, feature → --primary).
 *
 *   <Toaster />                         // uma vez no layout
 *   toast.success("Salvo", { description: "…", action: { label: "Desfazer", onClick } })
 *   toast.custom(() => <VoltronToast status="feature" size="large" title="…" description="…" />)
 */
import * as React from "react"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"
import { CheckCircleIcon, InfoIcon, SparkleIcon, WarningCircleIcon, WarningIcon, XIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const statusIcon = {
  error: <WarningCircleIcon className="text-destructive" />,
  warning: <WarningIcon className="text-warning" />,
  success: <CheckCircleIcon className="text-success" />,
  information: <InfoIcon className="text-info" />,
  feature: <SparkleIcon className="text-primary" />,
} as const

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: statusIcon.success,
        info: statusIcon.information,
        warning: statusIcon.warning,
        error: statusIcon.error,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group/toast !rounded-alert !border-border !bg-card !text-foreground !shadow-md !gap-2 !px-3 !py-2.5 [&_svg]:size-5",
          title: "!text-sm !font-medium",
          description: "!text-sm !text-vt-text-secondary",
          actionButton: "!bg-transparent !text-foreground !font-medium !underline !underline-offset-4",
          cancelButton: "!bg-transparent !text-muted-foreground",
          closeButton: "!bg-card !border-border",
        },
      }}
      {...props}
    />
  )
}

/** Toast completo do Figma para usar com toast.custom(). */
function VoltronToast({
  status = "information",
  size = "small",
  title,
  description,
  actions,
  onDismiss,
  className,
}: {
  status?: keyof typeof statusIcon
  /** x-small (texto 12) | small (texto 14) | large (título + descrição + ações empilhados) */
  size?: "x-small" | "small" | "large"
  title: React.ReactNode
  description?: React.ReactNode
  /** Até dois links (Figma Link Button / Double Link). */
  actions?: React.ReactNode
  onDismiss?: () => void
  className?: string
}) {
  const large = size === "large"
  return (
    <div
      data-slot="toast"
      data-status={status}
      data-size={size}
      className={cn(
        "flex w-full gap-2 border border-border bg-card text-foreground shadow-md",
        large ? "items-start rounded-alert-lg px-4 py-3 sm:w-90" : "items-center rounded-alert",
        size === "x-small" && "px-2.5 py-2 text-xs sm:w-70 [&_svg]:size-4",
        size === "small" && "px-3 py-2.5 text-sm sm:w-80 [&_svg]:size-5",
        large && "text-sm [&_svg]:size-5",
        className
      )}
    >
      <span className="flex h-5 shrink-0 items-center">{statusIcon[status]}</span>
      {large ? (
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-semibold">{title}</span>
          {description && <span className="text-vt-text-secondary">{description}</span>}
          {actions && <div className="flex gap-4 pt-1 font-medium underline underline-offset-4">{actions}</div>}
        </div>
      ) : (
        <>
          <span className="min-w-0 flex-1 font-medium">{title}</span>
          {actions && <span className="font-medium underline underline-offset-4">{actions}</span>}
        </>
      )}
      {onDismiss && (
        <button
          type="button"
          aria-label="Fechar"
          onClick={onDismiss}
          className={cn("inline-flex cursor-pointer rounded-sm text-muted-foreground outline-none hover:text-foreground", size === "x-small" && "[&_svg]:size-3")}
        >
          <XIcon />
        </button>
      )}
    </div>
  )
}

export { Toaster, VoltronToast, toast }
