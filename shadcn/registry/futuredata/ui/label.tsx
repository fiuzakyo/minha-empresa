/**
 * Label — Voltron Design System (Figma: 01 · Atoms › Label)
 *
 * shadcn/ui Label + marcadores opcionais do Figma:
 * - required → asterisco em error/strong
 * - optional → "(opcional)" em --muted-foreground
 * - info     → ícone Info 16px (use como gatilho de Tooltip)
 * State Error = data-invalid no Field (ou aria-invalid no controle); Disabled = 50% de opacidade.
 */
import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"
import { InfoIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

function Label({
  className,
  children,
  required = false,
  optional = false,
  optionalText = "(opcional)",
  info,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  /** Mostra o asterisco de campo obrigatório. */
  required?: boolean
  /** Mostra o texto "(opcional)". */
  optional?: boolean
  optionalText?: React.ReactNode
  /** Conteúdo do ícone de informação (ex.: <Tooltip>). `true` mostra só o ícone. */
  info?: React.ReactNode | true
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium text-foreground select-none",
        "group-data-[invalid=true]/field:text-vt-error-strong peer-aria-invalid:text-vt-error-strong",
        "group-data-[disabled=true]/field:pointer-events-none group-data-[disabled=true]/field:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="text-vt-error-strong">
          *
        </span>
      )}
      {optional && <span className="font-normal text-muted-foreground">{optionalText}</span>}
      {info === true ? (
        <InfoIcon aria-hidden="true" className="size-4 text-muted-foreground" />
      ) : (
        info
      )}
    </LabelPrimitive.Root>
  )
}

export { Label }
