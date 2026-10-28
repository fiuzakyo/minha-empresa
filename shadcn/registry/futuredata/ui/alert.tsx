/**
 * Alert / Banner — Voltron Design System (Figma: 02 · Molecules › Alert / Banner)
 *
 * shadcn/ui Alert + extensão Voltron: aviso persistente na largura da página.
 * - status: error (nativo destructive) | warning | success | information | feature
 * - Texto e ícones num tom de contraste por status (≥ 4,5:1 nos dois modos)
 * - Layout em linha: ícone · título · descrição · link, centralizados; dismiss à direita
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircleIcon, InfoIcon, SparkleIcon, WarningCircleIcon, WarningIcon, XIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "flex w-full items-center gap-2 rounded-alert px-4 py-2.5 text-sm [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      status: {
        error: "bg-vt-error-very-soft text-vt-error-maximum",
        warning: "bg-vt-warning-very-soft text-warning-foreground",
        success: "bg-vt-success-very-soft text-success-foreground",
        information: "bg-vt-information-very-soft text-vt-information-maximum",
        feature: "bg-accent text-vt-primary-strong",
      },
    },
    defaultVariants: { status: "information" },
  }
)

const statusIcon = {
  error: WarningCircleIcon,
  warning: WarningIcon,
  success: CheckCircleIcon,
  information: InfoIcon,
  feature: SparkleIcon,
} as const

function Alert({
  className,
  status = "information",
  title,
  icon = true,
  action,
  onDismiss,
  dismissLabel = "Fechar",
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> &
  VariantProps<typeof alertVariants> & {
    title?: React.ReactNode
    /** true usa o ícone padrão do status; false esconde (Figma Left Icon). */
    icon?: boolean | React.ReactNode
    /** Link de ação ao final (Figma Link Button). */
    action?: React.ReactNode
    onDismiss?: () => void
    dismissLabel?: string
  }) {
  const Icon = statusIcon[status ?? "information"]
  return (
    <div
      data-slot="alert"
      data-status={status}
      role={status === "error" || status === "warning" ? "alert" : "status"}
      className={cn(alertVariants({ status }), className)}
      {...props}
    >
      {onDismiss && <span aria-hidden="true" className="w-4 shrink-0" />}
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
        {icon === true ? <Icon aria-hidden="true" /> : icon || null}
        {title && <span data-slot="alert-title" className="font-semibold">{title}</span>}
        {title && children && <span aria-hidden="true">·</span>}
        {children && <span data-slot="alert-description">{children}</span>}
        {action && (
          <span data-slot="alert-action" className="font-medium underline underline-offset-4">
            {action}
          </span>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className="inline-flex cursor-pointer rounded-sm opacity-80 outline-none hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <XIcon />
        </button>
      )}
    </div>
  )
}

export { Alert, alertVariants }
