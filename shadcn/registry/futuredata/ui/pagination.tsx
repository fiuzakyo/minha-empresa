/**
 * Pagination — Voltron Design System (Figma: 02 · Molecules › Pagination)
 *
 * shadcn/ui Pagination + composição Voltron: barra --card com seletor de itens por página e total
 * à esquerda; páginas à direita (atual: Button outline sm; demais: ghost sm), reticências,
 * Anterior e Próximo.
 *
 * Primitivas: Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious,
 * PaginationNext, PaginationEllipsis. Barra pronta: <PaginationBar page total pageSize ... />.
 */
import * as React from "react"
import { CaretDownIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { buttonVariants, type Button } from "@/registry/futuredata/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav role="navigation" aria-label="paginação" data-slot="pagination" className={cn("flex", className)} {...props} />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex flex-row items-center gap-1", className)} {...props} />
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = { isActive?: boolean } & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({ className, isActive, size = "sm", ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(buttonVariants({ variant: isActive ? "outline" : "ghost", size }), "min-w-8 px-2.5", className)}
      {...props}
    />
  )
}

function PaginationPrevious({ children = "Anterior", ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Página anterior" {...props}>
      {children}
    </PaginationLink>
  )
}

function PaginationNext({ children = "Próximo", ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Próxima página" {...props}>
      {children}
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" className={cn("px-1 text-sm text-muted-foreground", className)} {...props}>
      …<span className="sr-only">Mais páginas</span>
    </span>
  )
}

/** Páginas a mostrar: 1 … p-1 p p+1 … último (no máximo 7 entradas). */
function pageWindow(page: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  if (page <= 4) return [1, 2, 3, 4, 5, "…", pageCount]
  if (page >= pageCount - 3) return [1, "…", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
  return [1, "…", page - 1, page, page + 1, "…", pageCount]
}

/** Barra completa do Figma (Pagination). */
function PaginationBar({
  className,
  page,
  total,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  showPageSize = true,
  pageSizeLabel = "Resultados por página:",
  totalLabel = "Total",
}: {
  className?: string
  page: number
  total: number
  pageSize: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  /** Figma Page size selector. */
  showPageSize?: boolean
  pageSizeLabel?: React.ReactNode
  totalLabel?: React.ReactNode
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const go = (p: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (p >= 1 && p <= pageCount && p !== page) onPageChange(p)
  }
  return (
    <div
      data-slot="pagination-bar"
      className={cn("flex w-full flex-wrap items-center justify-between gap-3 bg-card px-4 py-2 text-sm", className)}
    >
      {showPageSize ? (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{pageSizeLabel}</span>
          <span className="relative inline-flex h-8 items-center rounded-md border border-input bg-card">
            <select
              aria-label="Itens por página"
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="h-full cursor-pointer appearance-none rounded-md bg-transparent ps-2.5 pe-8 font-medium text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {pageSizeOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <CaretDownIcon aria-hidden="true" className="pointer-events-none absolute right-2 size-5 text-muted-foreground" />
          </span>
          <span className="text-muted-foreground">{totalLabel}</span>
          <span className="font-semibold text-foreground">{total.toLocaleString("pt-BR")}</span>
        </div>
      ) : (
        <span />
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={go(page - 1)}
              aria-disabled={page <= 1}
              className={cn(page <= 1 && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
          {pageWindow(page, pageCount).map((p, i) =>
            p === "…" ? (
              <PaginationItem key={`e${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink href="#" isActive={p === page} onClick={go(p)}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={go(page + 1)}
              aria-disabled={page >= pageCount}
              className={cn(page >= pageCount && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationBar,
}
