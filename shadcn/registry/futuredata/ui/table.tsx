/**
 * Table — Voltron Design System
 * Figma: 02 · Molecules › Table / Head, Table / Cell · 03 · Organisms › Table / Row
 *
 * shadcn/ui Table com o visual Voltron:
 * - TableHead: 56px, px 16/8, texto Medium sm --foreground, divisor vertical opcional (divider)
 * - TableCell: 64px, px 16, texto Regular sm; tipos de conteúdo por composição
 *   (TableCellText com descrição, Avatar, Tag de status, Button de menu)
 * - TableRow: hover --muted · selected (data-state=selected) --accent · striped (prop no TableBody) --background
 */
import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn("w-full caption-bottom border-collapse text-sm", className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("bg-card [&_tr]:border-b [&_tr]:border-border", className)} {...props} />
}

function TableBody({ className, striped = false, ...props }: React.ComponentProps<"tbody"> & { striped?: boolean }) {
  return (
    <tbody
      data-slot="table-body"
      data-striped={striped || undefined}
      className={cn("bg-card [&_tr:last-child]:border-0 data-[striped=true]:[&>tr:nth-child(even):not([data-state=selected]):not(:hover)]:bg-background", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("border-t border-border bg-muted font-medium", className)} {...props} />
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn("border-b border-border transition-colors hover:bg-muted data-[state=selected]:bg-accent", className)}
      {...props}
    />
  )
}

function TableHead({
  className,
  divider = false,
  children,
  ...props
}: React.ComponentProps<"th"> & {
  /** Divisor vertical à direita do cabeçalho (Figma Divider). */
  divider?: boolean
}) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "relative h-14 ps-4 pe-2 text-start align-middle font-medium whitespace-nowrap text-foreground",
        "[&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pe-0",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">{children}</div>
      {divider && <span aria-hidden="true" className="absolute top-1/2 right-0 h-5 w-px -translate-y-1/2 bg-border" />}
    </th>
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "h-16 px-4 align-middle whitespace-nowrap text-foreground [&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pe-0",
        className
      )}
      {...props}
    />
  )
}

/** Conteúdo de célula: texto (muted opcional) + descrição (Figma Type Text · Muted Text · Text + Description). */
function TableCellText({
  className,
  description,
  muted = false,
  children,
  ...props
}: React.ComponentProps<"div"> & { description?: React.ReactNode; muted?: boolean }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", className)} {...props}>
      <span className={cn("truncate text-sm", muted ? "text-muted-foreground" : "text-foreground")}>{children}</span>
      {description && <span className="truncate text-xs text-muted-foreground">{description}</span>}
    </div>
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCellText, TableCaption }
