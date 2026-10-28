/**
 * Textarea — Voltron Design System (Figma: 02 · Molecules › Field / Textarea)
 *
 * shadcn/ui Textarea + <FieldTextarea>: mesmo visual do Field / Text Input (label flutuante)
 * com contador de caracteres. Altura mínima 96px (spacing/24), raio radius/md.
 * Hover → border/strong · Focus → focus/halo · Error → --destructive · Disabled → 50%.
 */
import * as React from "react"

import { cn } from "@/lib/utils"
import { Field, FieldCounter, FieldDescription, FieldError } from "@/registry/futuredata/ui/field"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none",
        "transition-[border-color,box-shadow] placeholder:text-muted-foreground hover:border-vt-border-strong",
        "focus-visible:border-vt-focus-halo focus-visible:ring-[3px] focus-visible:ring-vt-focus-halo",
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldTextarea({
  id,
  label,
  hint,
  error,
  maxLength,
  showCounter = true,
  className,
  value,
  defaultValue,
  onChange,
  disabled,
  ...props
}: React.ComponentProps<"textarea"> & {
  label: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  /** Mostra o contador quando há maxLength (Figma Counter). */
  showCounter?: boolean
}) {
  const autoId = React.useId()
  const inputId = id ?? autoId
  const [count, setCount] = React.useState(() => String(value ?? defaultValue ?? "").length)
  React.useEffect(() => {
    if (value !== undefined) setCount(String(value).length)
  }, [value])
  return (
    <Field invalid={Boolean(error)} disabled={disabled} className={className}>
      <div
        className={cn(
          "group/control relative flex min-h-24 w-full flex-col gap-2 rounded-md border border-input bg-card px-3 pt-2.5 pb-2",
          "transition-[border-color,box-shadow] hover:border-vt-border-strong",
          "focus-within:border-vt-focus-halo focus-within:ring-[3px] focus-within:ring-vt-focus-halo",
          "group-data-[invalid=true]/field:border-destructive group-data-[invalid=true]/field:ring-[3px] group-data-[invalid=true]/field:ring-destructive/20",
          "has-[:disabled]:opacity-50"
        )}
      >
        <textarea
          id={inputId}
          placeholder=" "
          value={value}
          defaultValue={defaultValue}
          maxLength={undefined}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          onChange={(e) => {
            setCount(e.target.value.length)
            onChange?.(e)
          }}
          className="field-sizing-content min-h-12 w-full flex-1 resize-y bg-transparent text-sm text-foreground outline-none placeholder:text-transparent"
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute top-2.5 left-2 rounded-sm bg-card px-1 text-sm text-muted-foreground transition-all",
            "group-focus-within/control:-top-2.5 group-focus-within/control:text-xs group-focus-within/control:font-medium group-focus-within/control:text-foreground",
            "group-has-[textarea:not(:placeholder-shown)]/control:-top-2.5 group-has-[textarea:not(:placeholder-shown)]/control:text-xs group-has-[textarea:not(:placeholder-shown)]/control:font-medium group-has-[textarea:not(:placeholder-shown)]/control:text-foreground",
            "group-data-[invalid=true]/field:text-destructive"
          )}
        >
          {label}
        </label>
        {showCounter && maxLength != null && (
          <div className="flex justify-end">
            <FieldCounter value={count} max={maxLength} />
          </div>
        )}
      </div>
      {error ? <FieldError>{error}</FieldError> : hint ? <FieldDescription>{hint}</FieldDescription> : null}
    </Field>
  )
}

export { Textarea, FieldTextarea }
