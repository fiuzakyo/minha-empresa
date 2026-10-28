/**
 * Calendar — Voltron Design System
 * Figma: 01 · Atoms › Calendar / Day · 02 · Molecules › Calendar
 *
 * shadcn/ui Calendar (react-day-picker v9). Semana começando na segunda, pt-BR.
 * - size: "sm" (células 32px, radius/md) | "md" (células 40px, radius/lg)
 * - Day: hover/today → --background (today em primary/strong) · selected/range start/end → --primary ·
 *   range middle → --accent · outside → --muted-foreground · disabled → 50% · ponto de evento via modifier "event"
 */
import * as React from "react"
import { DayPicker, getDefaultClassNames, type DayButton } from "react-day-picker"
import { ptBR } from "react-day-picker/locale"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/registry/futuredata/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  size = "sm",
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & { size?: "sm" | "md" }) {
  const defaults = getDefaultClassNames()
  return (
    <DayPicker
      locale={ptBR}
      weekStartsOn={1}
      showOutsideDays={showOutsideDays}
      data-slot="calendar"
      data-size={size}
      className={cn(
        "group/calendar bg-card p-3 [--cell-radius:var(--vt-radius-md)] [--cell-size:--spacing(8)] data-[size=md]:[--cell-radius:var(--vt-radius-lg)] data-[size=md]:[--cell-size:--spacing(10)]",
        className
      )}
      classNames={{
        root: cn("w-fit", defaults.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaults.months),
        month: cn("flex w-full flex-col gap-4", defaults.month),
        nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", defaults.nav),
        button_previous: cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "aria-disabled:opacity-50", defaults.button_previous),
        button_next: cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "aria-disabled:opacity-50", defaults.button_next),
        month_caption: cn("flex h-8 w-full items-center justify-center px-8", defaults.month_caption),
        caption_label: cn("text-sm font-semibold text-foreground capitalize select-none", defaults.caption_label),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaults.weekdays),
        weekday: cn("flex-1 text-xs font-normal text-muted-foreground capitalize select-none", defaults.weekday),
        week: cn("mt-1 flex w-full", defaults.week),
        day: cn(
          "group/day relative aspect-square size-(--cell-size) p-0 text-center select-none",
          "data-[range-middle=true]:bg-accent",
          "data-[range-start=true]:bg-[linear-gradient(to_right,transparent_50%,var(--accent)_50%)] data-[range-end=true]:bg-[linear-gradient(to_left,transparent_50%,var(--accent)_50%)]",
          "data-[range-start=true]:data-[range-end=true]:bg-none",
          defaults.day
        ),
        range_start: "rounded-none",
        range_middle: "rounded-none",
        range_end: "rounded-none",
        today: "",
        outside: cn("text-muted-foreground", defaults.outside),
        disabled: cn("opacity-50", defaults.disabled),
        hidden: cn("invisible", defaults.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: c }) =>
          orientation === "left" ? <CaretLeftIcon className={cn("size-5", c)} /> : <CaretRightIcon className={cn("size-5", c)} />,
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-today={modifiers.today && !modifiers.selected}
      data-event={Boolean((modifiers as Record<string, boolean>).event)}
      className={cn(
        "relative flex size-(--cell-size) cursor-pointer items-center justify-center rounded-(--cell-radius) text-sm font-normal text-foreground outline-none",
        "transition-colors hover:bg-background focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "data-[today=true]:bg-background data-[today=true]:font-medium data-[today=true]:text-vt-primary-strong",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-vt-primary-strong",
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:font-medium data-[selected-single=true]:text-primary-foreground",
        "data-[range-start=true]:bg-primary data-[range-start=true]:font-medium data-[range-start=true]:text-primary-foreground",
        "data-[range-end=true]:bg-primary data-[range-end=true]:font-medium data-[range-end=true]:text-primary-foreground",
        "group-data-[outside=true]/day:text-muted-foreground",
        // ponto de evento
        "after:absolute after:bottom-1 after:hidden after:size-1 after:rounded-full after:bg-primary data-[event=true]:after:block",
        "data-[selected-single=true]:after:bg-primary-foreground data-[range-start=true]:after:bg-primary-foreground data-[range-end=true]:after:bg-primary-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
