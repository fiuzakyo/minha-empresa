/**
 * Data Table — Voltron Design System (Figma: 03 · Organisms › Data Table)
 *
 * Composição shadcn/ui (Table + TanStack Table): toolbar (título, descrição, filtros e ação principal),
 * cabeçalho, linhas selecionáveis e paginação (PaginationBar). Cada produto define colunas (ColumnDef)
 * e dados. Contêiner --card, --border, radius/xl, Elevation/shadow-xs.
 *
 *   <DataTable title="Registros" columns={columns} data={rows} toolbar={<Button>Novo</Button>} />
 *   Use `selectColumn()` para a coluna de seleção com Checkbox.
 */
import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/registry/futuredata/ui/checkbox"
import { PaginationBar } from "@/registry/futuredata/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/futuredata/ui/table"

/** Coluna de seleção (Figma: Table / Head e Table / Cell com Select). */
function selectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Selecionar todas"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox aria-label="Selecionar linha" checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />
    ),
    enableSorting: false,
  }
}

function DataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
  toolbar,
  pagination = true,
  pageSize: initialPageSize = 10,
  striped = false,
  onSelectionChange,
  className,
}: {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title?: React.ReactNode
  description?: React.ReactNode
  /** Filtros e ação principal à direita do título (Figma Toolbar). */
  toolbar?: React.ReactNode
  /** Mostra a paginação (Figma Pagination). */
  pagination?: boolean
  pageSize?: number
  striped?: boolean
  onSelectionChange?: (rows: TData[]) => void
  className?: string
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [paginationState, setPagination] = React.useState({ pageIndex: 0, pageSize: initialPageSize })

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection, pagination: paginationState },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(pagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
  })

  React.useEffect(() => {
    onSelectionChange?.(table.getSelectedRowModel().rows.map((r) => r.original))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection])

  return (
    <div data-slot="data-table" className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-xs", className)}>
      {(title || description || toolbar) && (
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-4">
          <div className="flex min-w-0 flex-col gap-0.5">
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
        </div>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="hover:bg-transparent">
              {hg.headers.map((h, i) => (
                <TableHead key={h.id} divider={i < hg.headers.length - 1 && h.column.id !== "select"}>
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody striped={striped}>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination && (
        <PaginationBar
          className="border-t border-border"
          page={paginationState.pageIndex + 1}
          total={data.length}
          pageSize={paginationState.pageSize}
          onPageChange={(p) => table.setPageIndex(p - 1)}
          onPageSizeChange={(s) => table.setPageSize(s)}
        />
      )}
    </div>
  )
}

export { DataTable, selectColumn }
export type { ColumnDef }
