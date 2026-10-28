/**
 * Breadcrumb — Voltron Design System
 * Figma: 01 · Atoms › Breadcrumb / Item · 02 · Molecules › Breadcrumb
 *
 * shadcn/ui nativo. Itens separados por CaretRight (BreadcrumbSeparator), gap 8px.
 * - BreadcrumbHome: ícone House (preenchido quando é a página atual)
 * - BreadcrumbLink: text/secondary → hover primary/strong
 * - BreadcrumbPage: página atual em --muted-foreground
 * - BreadcrumbEllipsis: níveis recolhidos (DotsThree em pílula --background)
 */
import * as React from "react"
import { Slot } from "radix-ui"
import { CaretRightIcon, DotsThreeIcon, HouseIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn("flex flex-wrap items-center gap-2 text-sm font-medium break-words text-vt-text-secondary", className)}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center", className)} {...props} />
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "rounded-sm transition-colors outline-none hover:text-vt-primary-strong focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

/** Ícone de início. `current` deixa o ícone preenchido (é a página atual). */
function BreadcrumbHome({
  current = false,
  label = "Início",
  className,
  ...props
}: React.ComponentProps<"a"> & { current?: boolean; label?: string }) {
  const icon = <HouseIcon weight={current ? "fill" : "regular"} className="size-5" aria-hidden="true" />
  if (current) {
    return (
      <span data-slot="breadcrumb-home" aria-current="page" aria-label={label} className={cn("inline-flex text-vt-text-secondary", className)}>
        {icon}
      </span>
    )
  }
  return (
    <BreadcrumbLink data-slot="breadcrumb-home" aria-label={label} className={cn("inline-flex", className)} {...props}>
      {icon}
    </BreadcrumbLink>
  )
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("text-muted-foreground [&>svg]:size-5", className)}
      {...props}
    >
      {children ?? <CaretRightIcon />}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "inline-flex h-6 w-8 items-center justify-center rounded-sm bg-background px-1.5 py-0.5 transition-colors hover:bg-muted data-[state=open]:bg-accent",
        className
      )}
      {...props}
    >
      <DotsThreeIcon weight="bold" className="size-5" />
      <span className="sr-only">Mais</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbHome,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
