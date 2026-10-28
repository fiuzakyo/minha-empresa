/**
 * Number Input — Voltron Design System (Figma: 02 · Molecules › Field / Number Input)
 *
 * Composição (o shadcn não tem Number Input nativo): Button ghost icon-sm (−/+) nas pontas
 * e o valor centralizado. Contêiner radius/lg (sm/xs: radius/md), --card, Elevation/shadow-xs.
 * - size: md | sm | xs (padding vertical 6 · 4 · 2)
 * - min, max, step · controlado (value/onValueChange) ou não (defaultValue)
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { MinusIcon, PlusIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/futuredata/ui/button"

const numberInputVariants = cva(
  [
    "flex w-full items-center gap-1 border border-input bg-card px-1 shadow-xs",
    "transition-[background-color,border-color,box-shadow] hover:bg-background",
    "focus-within:border-vt-focus-halo focus-within:shadow-none focus-within:ring-[3px] focus-within:ring-vt-focus-halo",
    "has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:shadow-none",
    "has-[input:disabled]:border-transparent has-[input:disabled]:bg-background has-[input:disabled]:shadow-none",
  ],
  {
    variants: {
      size: {
        md: "rounded-lg py-1.5",
        sm: "rounded-md py-1",
        xs: "rounded-md py-0.5",
      },
    },
    defaultVariants: { size: "md" },
  }
)

function NumberInput({
  className,
  size = "md",
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  disabled,
  decrementLabel = "Diminuir",
  incrementLabel = "Aumentar",
  ...props
}: Omit<React.ComponentProps<"input">, "size" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"> &
  VariantProps<typeof numberInputVariants> & {
    value?: number
    defaultValue?: number
    onValueChange?: (value: number) => void
    min?: number
    max?: number
    step?: number
    decrementLabel?: string
    incrementLabel?: string
  }) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const set = (v: number) => {
    const next = Math.min(max, Math.max(min, v))
    if (valueProp === undefined) setInner(next)
    onValueChange?.(next)
  }
  return (
    <div data-slot="number-input" data-size={size} className={cn(numberInputVariants({ size }), className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={decrementLabel}
        disabled={disabled || value <= min}
        onClick={() => set(value - step)}
      >
        <MinusIcon />
      </Button>
      <input
        type="number"
        inputMode="decimal"
        data-slot="number-input-control"
        value={Number.isFinite(value) ? value : ""}
        min={Number.isFinite(min) ? min : undefined}
        max={Number.isFinite(max) ? max : undefined}
        step={step}
        disabled={disabled}
        onChange={(e) => set(e.target.valueAsNumber || 0)}
        className="min-w-0 flex-1 [appearance:textfield] bg-transparent text-center text-sm text-foreground outline-none disabled:text-vt-text-disabled [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={incrementLabel}
        disabled={disabled || value >= max}
        onClick={() => set(value + step)}
      >
        <PlusIcon />
      </Button>
    </div>
  )
}

export { NumberInput, numberInputVariants }
