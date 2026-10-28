/**
 * Checkbox — Voltron Design System (Figma: 01 · Atoms › Checkbox)
 *
 * shadcn/ui nativo (Radix). checked={false | true | "indeterminate"} (ícones Check e Minus).
 * Focus → anel --ring 50% · Disabled → 50% · Invalid → aria-invalid (--destructive).
 */
import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon, MinusIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group/checkbox size-4 shrink-0 cursor-pointer rounded-control border border-input bg-card text-primary-foreground shadow-xs outline-none",
        "transition-[background-color,border-color,box-shadow]",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:data-[state=checked]:bg-destructive aria-invalid:data-[state=indeterminate]:bg-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        <CheckIcon weight="bold" className="size-3.5 group-data-[state=indeterminate]/checkbox:hidden" />
        <MinusIcon weight="bold" className="hidden size-3.5 group-data-[state=indeterminate]/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
