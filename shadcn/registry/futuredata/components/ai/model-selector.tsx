/**
 * Model Selector — Voltron Design System (Figma: 02 · Molecules › Model Selector)
 *
 * Seletor do modelo de IA no Prompt Input (DropdownMenu): ícone + nome (SemiBold xs) + chevron.
 * Hover → --muted · Open → --accent + borda --ring e CaretUp.
 */
import * as React from "react"
import { CaretDownIcon, SparkleIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/registry/futuredata/ui/dropdown-menu"

type ModelOption = { value: string; label: string; icon?: React.ReactNode }

function ModelSelector({
  models,
  value,
  onValueChange,
  className,
}: {
  models: ModelOption[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}) {
  const current = models.find((m) => m.value === value) ?? models[0]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-slot="model-selector"
        className={cn(
          "group/model inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none",
          "transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:border-ring data-[state=open]:bg-accent",
          "[&_svg]:size-4 [&_svg]:shrink-0",
          className
        )}
      >
        {current?.icon ?? <SparkleIcon />}
        {current?.label}
        <CaretDownIcon className="transition-transform group-data-[state=open]/model:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {models.map((m) => (
            <DropdownMenuRadioItem key={m.value} value={m.value}>
              {m.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ModelSelector }
export type { ModelOption }
