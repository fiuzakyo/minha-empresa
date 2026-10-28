/**
 * Tag Input — Voltron Design System (Figma: 02 · Molecules › Field / Tag Input)
 *
 * Composição (o shadcn não tem Tag Input nativo): Tags md removíveis dentro do campo,
 * input para adicionar (Enter ou vírgula) e botão limpar tudo (X).
 * Contêiner radius/lg (sm/xs: radius/md), padding 8/10, --card, Elevation/shadow-xs.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { XIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Tag } from "@/registry/futuredata/ui/tag"

const tagInputVariants = cva(
  [
    "flex w-full flex-wrap items-center gap-1 border border-input bg-card ps-2 pe-2.5 shadow-xs",
    "transition-[background-color,border-color,box-shadow] hover:bg-background",
    "focus-within:border-vt-focus-halo focus-within:shadow-none focus-within:ring-[3px] focus-within:ring-vt-focus-halo",
    "has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:shadow-none",
    "has-[input:disabled]:border-transparent has-[input:disabled]:bg-background has-[input:disabled]:shadow-none",
  ],
  {
    variants: {
      size: {
        md: "min-h-15 rounded-lg py-2",
        sm: "min-h-14 rounded-md py-1.5",
        xs: "min-h-13 rounded-md py-1",
      },
    },
    defaultVariants: { size: "md" },
  }
)

function TagInput({
  className,
  size = "md",
  value: valueProp,
  defaultValue = [],
  onValueChange,
  placeholder = "Adicionar…",
  clearable = true,
  clearLabel = "Limpar tudo",
  disabled,
  ...props
}: Omit<React.ComponentProps<"input">, "size" | "value" | "defaultValue"> &
  VariantProps<typeof tagInputVariants> & {
    value?: string[]
    defaultValue?: string[]
    onValueChange?: (value: string[]) => void
    /** Botão X que limpa todas as tags (Figma Right Icon). */
    clearable?: boolean
    clearLabel?: string
  }) {
  const [inner, setInner] = React.useState(defaultValue)
  const [draft, setDraft] = React.useState("")
  const tags = valueProp ?? inner
  const set = (next: string[]) => {
    if (valueProp === undefined) setInner(next)
    onValueChange?.(next)
  }
  const add = (raw: string) => {
    const t = raw.trim()
    if (t && !tags.includes(t)) set([...tags, t])
    setDraft("")
  }
  return (
    <div data-slot="tag-input" data-size={size} className={cn(tagInputVariants({ size }), className)}>
      {tags.map((t) => (
        <Tag key={t} size="md" disabled={disabled} onRemove={() => set(tags.filter((x) => x !== t))} removeLabel={`Remover ${t}`}>
          {t}
        </Tag>
      ))}
      <input
        value={draft}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            add(draft)
          } else if (e.key === "Backspace" && !draft && tags.length) {
            set(tags.slice(0, -1))
          }
        }}
        onBlur={() => draft && add(draft)}
        className="min-w-20 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:placeholder:text-vt-text-disabled"
        {...props}
      />
      {clearable && tags.length > 0 && (
        <button
          type="button"
          aria-label={clearLabel}
          disabled={disabled}
          onClick={() => set([])}
          className="ms-auto inline-flex cursor-pointer rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none"
        >
          <XIcon className="size-5" />
        </button>
      )}
    </div>
  )
}

export { TagInput, tagInputVariants }
