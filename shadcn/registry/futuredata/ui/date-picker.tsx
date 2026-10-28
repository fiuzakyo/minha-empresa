/**
 * Date Picker — Voltron Design System (Figma: 03 · Organisms › Date Picker)
 *
 * Composição shadcn/ui (Popover + Calendar). Conteúdo do painel:
 * - mode="single": 1 mês
 * - mode="range":  2 meses + atalhos de período à esquerda (Time Filter) + resumo do período
 * - footer: ações Cancelar / Aplicar (o valor só é confirmado no Aplicar)
 * Painel: --card, --border, radius/xl, Elevation/shadow-lg.
 */
import * as React from "react"
import type { DateRange } from "react-day-picker"
import { CalendarBlankIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/futuredata/ui/button"
import { Calendar } from "@/registry/futuredata/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/futuredata/ui/popover"

const fmt = (d?: Date) => (d ? d.toLocaleDateString("pt-BR") : "")

export type DatePreset = { label: string; range: () => DateRange }

const day = (offset: number) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + offset)
  return d
}

const defaultPresets: DatePreset[] = [
  { label: "Hoje", range: () => ({ from: day(0), to: day(0) }) },
  { label: "Ontem", range: () => ({ from: day(-1), to: day(-1) }) },
  { label: "Últimos 7 dias", range: () => ({ from: day(-6), to: day(0) }) },
  { label: "Últimos 30 dias", range: () => ({ from: day(-29), to: day(0) }) },
  {
    label: "Este mês",
    range: () => {
      const t = day(0)
      return { from: new Date(t.getFullYear(), t.getMonth(), 1), to: t }
    },
  },
]

type SingleProps = { mode?: "single"; value?: Date; onValueChange?: (value: Date | undefined) => void }
type RangeProps = { mode: "range"; value?: DateRange; onValueChange?: (value: DateRange | undefined) => void }

function DatePicker(
  props: (SingleProps | RangeProps) & {
    placeholder?: string
    /** Mostra Cancelar / Aplicar (Figma Footer). */
    footer?: boolean
    /** Atalhos de período no modo range (Figma Time Filter). */
    presets?: DatePreset[] | false
    className?: string
    disabled?: boolean
  }
) {
  const { placeholder = "Selecione uma data", footer = true, className, disabled } = props
  const isRange = props.mode === "range"
  const presets = props.presets === false ? [] : props.presets ?? defaultPresets
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<Date | DateRange | undefined>(props.value)
  React.useEffect(() => {
    if (open) setDraft(props.value)
  }, [open, props.value])

  const commit = (v: Date | DateRange | undefined) => {
    ;(props.onValueChange as ((v: unknown) => void) | undefined)?.(v)
    setOpen(false)
  }

  const label = isRange
    ? (props.value as DateRange | undefined)?.from
      ? `${fmt((props.value as DateRange).from)} – ${fmt((props.value as DateRange).to)}`
      : placeholder
    : fmt(props.value as Date | undefined) || placeholder

  const range = draft as DateRange | undefined
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled} className={cn("justify-start font-normal", className)}>
          <CalendarBlankIcon data-icon="inline-start" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex">
          {isRange && presets.length > 0 && (
            <div className="flex w-40 flex-col gap-1 border-e border-border p-3">
              {presets.map((p) => (
                <Button key={p.label} variant="ghost" size="sm" className="justify-start" onClick={() => setDraft(p.range())}>
                  {p.label}
                </Button>
              ))}
            </div>
          )}
          <div className="flex flex-col">
            {isRange ? (
              <Calendar
                mode="range"
                numberOfMonths={2}
                selected={range}
                onSelect={(v) => (footer ? setDraft(v) : commit(v))}
                className="rounded-t-xl"
              />
            ) : (
              <Calendar
                mode="single"
                selected={draft as Date | undefined}
                onSelect={(v) => (footer ? setDraft(v) : commit(v))}
                className="rounded-t-xl"
              />
            )}
            {footer && (
              <div className="flex items-center justify-between gap-3 border-t border-border p-3">
                <span className="text-sm text-muted-foreground">
                  {isRange
                    ? range?.from
                      ? `${fmt(range.from)} – ${fmt(range.to)}`
                      : "Selecione o período"
                    : fmt(draft as Date | undefined)}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={() => commit(draft)}>
                    Aplicar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
