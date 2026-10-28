/**
 * Tag — Voltron Design System (Figma: 01 · Atoms › Tag)
 *
 * Etiqueta interativa (filtros, multisseleção): Badge + botão de remover (X).
 * Diferente do Badge, que é só leitura.
 * - tone: neutral | brand | success | warning | error
 * - size: sm (24px, texto xs) | md (32px, texto base)
 * - icon: ícone à esquerda (Figma Leading + Icon) · onRemove: mostra o X (Figma Removable)
 * Acessibilidade: success e warning mantêm o texto em --foreground; a cor vai na borda e no fundo.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { XIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const tagVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-control border px-2 font-medium",
    "transition-[border-color,box-shadow] outline-none has-[button:focus-visible]:ring-[3px] has-[button:focus-visible]:ring-ring/50 focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        neutral: "border-border bg-background text-foreground hover:border-input",
        brand: "border-vt-primary-medium bg-accent text-vt-primary-strong hover:border-primary",
        success: "border-vt-success-medium bg-vt-success-very-soft text-foreground hover:border-success",
        warning: "border-vt-warning-medium bg-vt-warning-very-soft text-foreground hover:border-warning",
        error: "border-vt-error-medium bg-vt-error-very-soft text-vt-error-strong hover:border-destructive",
      },
      size: {
        sm: "h-6 text-xs [&_svg]:size-3",
        md: "h-8 text-base [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "sm",
    },
  }
)

function Tag({
  className,
  tone = "neutral",
  size = "sm",
  icon,
  onRemove,
  removeLabel = "Remover",
  disabled = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof tagVariants> & {
    icon?: React.ReactNode
    /** Mostra o botão X e é chamado ao clicar nele. */
    onRemove?: () => void
    removeLabel?: string
    disabled?: boolean
  }) {
  return (
    <span
      data-slot="tag"
      data-tone={tone}
      data-size={size}
      aria-disabled={disabled || undefined}
      className={cn(tagVariants({ tone, size }), className)}
      {...props}
    >
      {icon}
      {children}
      {onRemove && (
        <button
          type="button"
          data-slot="tag-remove"
          aria-label={removeLabel}
          disabled={disabled}
          onClick={onRemove}
          className="-me-0.5 inline-flex cursor-pointer items-center justify-center rounded-sm opacity-70 outline-none hover:opacity-100"
        >
          <XIcon aria-hidden="true" />
        </button>
      )}
    </span>
  )
}

export { Tag, tagVariants }
