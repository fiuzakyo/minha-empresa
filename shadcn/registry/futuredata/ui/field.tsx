/**
 * Field — Voltron Design System
 * Figma: 01 · Atoms › Field / Description, Field / Counter
 *        02 · Molecules › Field / Text Input, Field / Checkbox, Field / Checkbox Card
 *
 * Base (shadcn/ui Field): Field, FieldLabel, FieldContent, FieldTitle, FieldDescription, FieldError, FieldGroup
 * Extensões Voltron:
 * - FieldDescription tone: default | error | success | warning (+ ícone)
 * - FieldCounter: contador "n/máx" (default · near · over)
 * - FieldTextInput: campo com label flutuante (Type Basic | Select | Phone | Amount | Card via start/end)
 * - FieldCheckbox: checkbox com label, sublabel, badge, descrição e link (Flip → flip)
 * - FieldChoiceCard: cartão selecionável (Field / Checkbox Card)
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircleIcon, InfoIcon, WarningCircleIcon, WarningIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/registry/futuredata/ui/checkbox"
import { Label } from "@/registry/futuredata/ui/label"

/* ---------------------------------------------------------------- base */

function Field({
  className,
  orientation = "vertical",
  invalid,
  disabled,
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "vertical" | "horizontal"
  /** Marca o campo como inválido (estilo de erro em label, borda e descrição). */
  invalid?: boolean
  disabled?: boolean
}) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "group/field flex w-full gap-2",
        orientation === "vertical" ? "flex-col" : "flex-row items-start",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-group" className={cn("flex w-full flex-col gap-6", className)} {...props} />
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-content" className={cn("flex flex-1 flex-col gap-0.5", className)} {...props} />
}

function FieldLabel(props: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" {...props} />
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-title"
      className={cn("flex items-center gap-1 text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}

const descriptionIcon = {
  default: InfoIcon,
  error: WarningCircleIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
} as const

const fieldDescriptionVariants = cva("flex gap-1.5 text-sm group-data-[disabled=true]/field:opacity-50", {
  variants: {
    tone: {
      default: "text-muted-foreground",
      error: "text-vt-error-strong",
      // Acessibilidade: success e warning mantêm o texto em --foreground; a cor vai no ícone
      success: "text-foreground [&>svg]:text-vt-success-strong",
      warning: "text-foreground [&>svg]:text-vt-warning-strong",
    },
  },
  defaultVariants: { tone: "default" },
})

function FieldDescription({
  className,
  tone = "default",
  icon,
  children,
  ...props
}: React.ComponentProps<"p"> &
  VariantProps<typeof fieldDescriptionVariants> & {
    /** true usa o ícone padrão do tom; ou passe um ícone Phosphor. */
    icon?: boolean | React.ReactNode
  }) {
  const Icon = descriptionIcon[tone ?? "default"]
  return (
    <p data-slot="field-description" data-tone={tone} className={cn(fieldDescriptionVariants({ tone }), className)} {...props}>
      {icon === true ? (
        <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      ) : icon ? (
        icon
      ) : null}
      <span>{children}</span>
    </p>
  )
}

function FieldError({ children, ...props }: React.ComponentProps<"p">) {
  if (!children) return null
  return (
    <FieldDescription role="alert" data-slot="field-error" tone="error" icon {...props}>
      {children}
    </FieldDescription>
  )
}

/** Contador de caracteres "n/máx". O estado sai do valor (≥ 90% = near, > máx = over) ou de `state`. */
function FieldCounter({
  className,
  value,
  max,
  state,
  ...props
}: React.ComponentProps<"span"> & {
  value: number
  max: number
  state?: "default" | "near" | "over"
}) {
  const s = state ?? (value > max ? "over" : value >= max * 0.9 ? "near" : "default")
  return (
    <span
      data-slot="field-counter"
      data-state={s}
      aria-live="polite"
      className={cn(
        "text-xs text-muted-foreground tabular-nums data-[state=near]:text-foreground data-[state=over]:text-vt-error-strong",
        className
      )}
      {...props}
    >
      {value}/{max}
    </span>
  )
}

/* ---------------------------------------------------------- text input */

const fieldControlVariants = cva(
  [
    "group/control relative flex w-full items-center gap-2 rounded-input border border-input bg-card px-3 text-sm",
    "transition-[border-color,box-shadow,background-color]",
    "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-vt-focus-halo",
    "group-data-[invalid=true]/field:border-destructive group-data-[invalid=true]/field:ring-[3px] group-data-[invalid=true]/field:ring-destructive/20",
    "has-[:disabled]:opacity-50",
    "[&_svg]:size-5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      size: {
        md: "h-input-md",
        sm: "h-input-sm",
        xs: "h-input-xs",
      },
    },
    defaultVariants: { size: "md" },
  }
)

/**
 * Campo de texto com label flutuante: o label repousa dentro do campo e sobe para a borda
 * com foco ou valor. Mapeamento das variantes do Figma:
 * - Type=Basic  → só `label`
 * - Type=Select → `end={<CaretDownIcon />}` (ou use o componente Select)
 * - Type=Phone  → `start` com bandeira + chevron (seletor de país)
 * - Type=Amount → `prefix="R$"` + `end` com o seletor de moeda
 * - Type=Card   → `end` com a bandeira do cartão
 * - State=Error → `error="mensagem"` · State=Disabled → `disabled`
 * - Size Medium | Small | X-Small → size md | sm | xs
 */
function FieldTextInput({
  id,
  label,
  hint,
  error,
  start,
  end,
  prefix,
  size = "md",
  className,
  inputClassName,
  disabled,
  ...props
}: Omit<React.ComponentProps<"input">, "size" | "prefix"> &
  VariantProps<typeof fieldControlVariants> & {
    label: React.ReactNode
    /** Texto de apoio abaixo do campo (Figma Hint). */
    hint?: React.ReactNode
    /** Mensagem de erro; também marca o campo como inválido. */
    error?: React.ReactNode
    start?: React.ReactNode
    end?: React.ReactNode
    /** Prefixo que aparece com foco ou valor (ex.: "R$"). */
    prefix?: React.ReactNode
    inputClassName?: string
  }) {
  const autoId = React.useId()
  const inputId = id ?? autoId
  const hintId = `${inputId}-hint`
  const floatedAlways = Boolean(start)
  return (
    <Field invalid={Boolean(error)} disabled={disabled} className={className}>
      <div className={cn(fieldControlVariants({ size }))}>
        {start}
        {prefix && (
          <span className="hidden text-muted-foreground group-focus-within/control:inline group-has-[input:not(:placeholder-shown)]/control:inline">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          placeholder=" "
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={hint || error ? hintId : undefined}
          className={cn(
            "peer h-full min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-transparent",
            inputClassName
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute left-2 rounded-sm bg-card px-1 text-sm text-muted-foreground transition-all",
            "top-1/2 -translate-y-1/2",
            "group-focus-within/control:top-0 group-focus-within/control:text-xs group-focus-within/control:font-medium group-focus-within/control:text-foreground",
            "group-has-[input:not(:placeholder-shown)]/control:top-0 group-has-[input:not(:placeholder-shown)]/control:text-xs group-has-[input:not(:placeholder-shown)]/control:font-medium group-has-[input:not(:placeholder-shown)]/control:text-foreground",
            "group-data-[invalid=true]/field:text-vt-error-strong",
            floatedAlways && "top-0 text-xs font-medium text-foreground"
          )}
        >
          {label}
        </label>
        {end}
      </div>
      {error ? (
        <FieldError id={hintId}>{error}</FieldError>
      ) : hint ? (
        <FieldDescription id={hintId}>{hint}</FieldDescription>
      ) : null}
    </Field>
  )
}

/* ------------------------------------------------------------ checkbox */

/** Checkbox com rótulo rico (Figma: Field / Checkbox). */
function FieldCheckbox({
  id,
  label,
  sublabel,
  badge,
  description,
  link,
  flip = false,
  className,
  ...props
}: React.ComponentProps<typeof Checkbox> & {
  label: React.ReactNode
  sublabel?: React.ReactNode
  /** Ex.: <Badge>NOVO</Badge> */
  badge?: React.ReactNode
  description?: React.ReactNode
  /** Ex.: <a href="...">Saiba mais</a> */
  link?: React.ReactNode
  /** Checkbox à direita (Figma Flip=On). */
  flip?: boolean
}) {
  const autoId = React.useId()
  const checkboxId = id ?? autoId
  return (
    <Field
      orientation="horizontal"
      disabled={props.disabled}
      className={cn(flip && "flex-row-reverse", className)}
    >
      <div className="flex h-5 items-center">
        <Checkbox id={checkboxId} aria-describedby={description ? `${checkboxId}-desc` : undefined} {...props} />
      </div>
      <FieldContent>
        <div className="flex flex-wrap items-center gap-1">
          <Label htmlFor={checkboxId}>{label}</Label>
          {sublabel && <span className="text-sm text-muted-foreground">{sublabel}</span>}
          {badge}
        </div>
        {description && (
          <p id={`${checkboxId}-desc`} className="text-sm text-vt-text-secondary">
            {description}
          </p>
        )}
        {link && (
          <span className="text-sm font-medium text-primary underline underline-offset-4 [&_a]:outline-none [&_a:focus-visible]:ring-[3px] [&_a:focus-visible]:ring-ring/50">
            {link}
          </span>
        )}
      </FieldContent>
    </Field>
  )
}

/* --------------------------------------------------------- choice card */

/** Cartão selecionável (Figma: Field / Checkbox Card). `media` = ícone, avatar ou logo à esquerda. */
function FieldChoiceCard({
  id,
  label,
  sublabel,
  badge,
  description,
  media,
  className,
  ...props
}: React.ComponentProps<typeof Checkbox> & {
  label: React.ReactNode
  sublabel?: React.ReactNode
  badge?: React.ReactNode
  description?: React.ReactNode
  media?: React.ReactNode
}) {
  const autoId = React.useId()
  const checkboxId = id ?? autoId
  return (
    <label
      htmlFor={checkboxId}
      data-slot="field-choice-card"
      className={cn(
        "flex w-full cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3 shadow-xs",
        "transition-[border-color,box-shadow] hover:shadow-sm has-[[data-state=checked]]:border-primary",
        "has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50 has-[:disabled]:shadow-none",
        "has-[button:focus-visible]:ring-[3px] has-[button:focus-visible]:ring-ring/50",
        className
      )}
    >
      {media && <span className="flex size-10 shrink-0 items-center justify-center">{media}</span>}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-1">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {sublabel && <span className="text-sm text-muted-foreground">{sublabel}</span>}
          {badge}
        </span>
        {description && <span className="text-xs text-vt-text-secondary">{description}</span>}
      </span>
      <Checkbox id={checkboxId} {...props} />
    </label>
  )
}

export {
  Field,
  FieldGroup,
  FieldContent,
  FieldLabel,
  FieldTitle,
  FieldDescription,
  FieldError,
  FieldCounter,
  FieldTextInput,
  FieldCheckbox,
  FieldChoiceCard,
  fieldControlVariants,
}
