/**
 * File Upload — Voltron Design System (Figma: 02 · Molecules › File Upload)
 *
 * Composição (o shadcn não tem componente próprio): input type="file" + Progress + ações em link.
 * - <FileUploadDropzone>: Action=Empty — clique ou arraste; marcador de obrigatório opcional
 * - <FileUploadItem status="uploading|downloading|uploaded|failed" />: arquivo com Key Icon,
 *   nome, meta, ação (Cancelar · Remover · Tentar novamente) e barra de progresso
 * - <FileUploadPreview>: Action=Preview — imagem com overlay surface/overlay e texto text/on-media no hover
 */
import * as React from "react"
import { CloudArrowUpIcon, FileTextIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { KeyIcon } from "@/registry/futuredata/ui/key-icon"
import { Progress } from "@/registry/futuredata/ui/progress"

const surface = cn(
  "relative flex w-full flex-col gap-2.5 overflow-hidden rounded-lg bg-card p-3 text-start transition-[background-color,box-shadow]"
)

function FileUploadDropzone({
  className,
  title = "Clique para enviar",
  linkText = "ou arraste o arquivo",
  hint = ".pdf, .jpg, .png — máx. 20 MB",
  required = false,
  onFiles,
  accept,
  multiple,
  disabled,
  ...props
}: Omit<React.ComponentProps<"label">, "onDrop"> & {
  title?: React.ReactNode
  linkText?: React.ReactNode
  hint?: React.ReactNode
  required?: boolean
  onFiles?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
}) {
  const [dragging, setDragging] = React.useState(false)
  return (
    <label
      data-slot="file-upload-dropzone"
      data-dragging={dragging || undefined}
      className={cn(
        surface,
        "cursor-pointer overflow-visible shadow-sm hover:bg-muted hover:shadow-md data-[dragging=true]:bg-muted data-[dragging=true]:shadow-md",
        "has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/50 has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-50",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        onFiles?.(Array.from(e.dataTransfer.files))
      }}
      {...props}
    >
      <input
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        required={required}
        onChange={(e) => onFiles?.(Array.from(e.target.files ?? []))}
      />
      <span className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center text-foreground">
          <CloudArrowUpIcon aria-hidden="true" className="size-5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex flex-wrap gap-1 text-sm font-medium">
            <span className="text-vt-text-secondary">{title}</span>
            <span className="text-primary">{linkText}</span>
          </span>
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </span>
      </span>
      {required && (
        <span
          aria-hidden="true"
          className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full border border-border bg-background text-xs font-medium text-vt-error-strong"
        >
          *
        </span>
      )}
    </label>
  )
}

type FileStatus = "uploading" | "downloading" | "uploaded" | "failed"

const statusText: Record<FileStatus, (p: number) => string> = {
  uploading: (p) => `Enviando · ${p}%`,
  downloading: (p) => `Baixando · ${p}%`,
  uploaded: () => "",
  failed: () => "Falha no envio",
}

function FileUploadItem({
  className,
  name,
  meta,
  status = "uploaded",
  progress = 0,
  icon = <FileTextIcon />,
  actionLabel,
  onAction,
  ...props
}: React.ComponentProps<"div"> & {
  name: React.ReactNode
  /** Texto de meta (ex.: "pdf · 2.000 KB"). Em uploading/downloading/failed o padrão vem do status. */
  meta?: React.ReactNode
  status?: FileStatus
  progress?: number
  icon?: React.ReactNode
  /** Padrão: Cancelar (em andamento) · Remover (enviado) · Tentar novamente (falha). */
  actionLabel?: React.ReactNode
  onAction?: () => void
}) {
  const busy = status === "uploading" || status === "downloading"
  const label = actionLabel ?? (busy ? "Cancelar" : status === "failed" ? "Tentar novamente" : "Remover")
  return (
    <div
      data-slot="file-upload-item"
      data-status={status}
      className={cn(
        surface,
        "border shadow-xs",
        status === "failed" ? "border-vt-error-medium" : "border-border",
        busy && "pb-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <KeyIcon size="md">{icon}</KeyIcon>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-foreground">{name}</span>
          <span className="flex items-center gap-1 text-xs">
            <span className={status === "failed" ? "text-destructive" : "text-muted-foreground"}>
              {meta ?? statusText[status](Math.round(progress))}
            </span>
            {onAction && (
              <>
                <span aria-hidden="true" className="text-muted-foreground">
                  ·
                </span>
                <button
                  type="button"
                  onClick={onAction}
                  className={cn(
                    "cursor-pointer rounded-sm outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    status === "failed" ? "text-primary" : "text-destructive"
                  )}
                >
                  {label}
                </button>
              </>
            )}
          </span>
        </div>
      </div>
      {busy && <Progress value={progress} className="absolute inset-x-0 bottom-0 rounded-none" />}
    </div>
  )
}

function FileUploadPreview({
  className,
  src,
  alt = "",
  name,
  meta,
  actionLabel = "Remover",
  onAction,
  ...props
}: React.ComponentProps<"div"> & {
  src: string
  alt?: string
  name: React.ReactNode
  meta?: React.ReactNode
  actionLabel?: React.ReactNode
  onAction?: () => void
}) {
  return (
    <div
      data-slot="file-upload-preview"
      className={cn(surface, "group/preview min-h-16 justify-center shadow-xs hover:shadow-sm", className)}
      {...props}
    >
      <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-vt-surface-overlay opacity-0 transition-opacity group-hover/preview:opacity-100 group-focus-within/preview:opacity-100" />
      <div className="relative flex flex-col gap-0.5 text-vt-text-on-media opacity-0 transition-opacity group-hover/preview:opacity-100 group-focus-within/preview:opacity-100">
        <span className="truncate text-sm font-medium">{name}</span>
        <span className="flex items-center gap-1 text-xs">
          {meta}
          {onAction && (
            <>
              <span aria-hidden="true">·</span>
              <button type="button" onClick={onAction} className="cursor-pointer rounded-sm outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50">
                {actionLabel}
              </button>
            </>
          )}
        </span>
      </div>
    </div>
  )
}

export { FileUploadDropzone, FileUploadItem, FileUploadPreview }
