/**
 * Prompt Suggestion — Voltron Design System (Figma: 02 · Molecules › Prompt Suggestion)
 * Ação rápida abaixo do Prompt Input (padrão Suggestion do AI Elements): pílula com texto
 * e seta ↗ em círculo --muted. Hover → fundo --muted e círculo --card.
 */
import * as React from "react"
import { ArrowUpRightIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

function PromptSuggestion({ className, children, type = "button", ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      data-slot="prompt-suggestion"
      className={cn(
        "group/suggestion inline-flex h-9 cursor-pointer items-center gap-2.5 rounded-full py-1.5 ps-3 pe-1.5 text-sm font-medium text-foreground outline-none",
        "transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
      {...props}
    >
      {children}
      <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-full bg-muted transition-colors group-hover/suggestion:bg-card">
        <ArrowUpRightIcon className="size-3.5" />
      </span>
    </button>
  )
}

export { PromptSuggestion }
