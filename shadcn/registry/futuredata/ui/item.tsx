/**
 * Item — Voltron Design System (Figma: 02 · Molecules › Item)
 *
 * shadcn/ui Item + extensão Voltron:
 * - variant: outline (--card + --border) | muted (--muted) | dashed (borda tracejada, só a ação — espaço vazio)
 * - size: default (p 12, gap 12, mídia 32) | sm (py 8, gap 10, mídia 24)
 * Partes: ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions. Raio radius/card.
 */
import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const itemVariants = cva(
  "group/item flex w-full items-center rounded-card border text-sm outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:hover:bg-muted",
  {
    variants: {
      variant: {
        outline: "border-border bg-card",
        muted: "border-transparent bg-muted",
        dashed: "justify-center border-dashed border-border bg-muted",
      },
      size: {
        default: "gap-3 p-3",
        sm: "gap-2.5 px-3 py-2",
      },
    },
    defaultVariants: { variant: "outline", size: "default" },
  }
)

function Item({
  className,
  variant = "outline",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function ItemMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-media"
      className={cn("flex shrink-0 items-center justify-center group-data-[size=sm]/item:[&_[data-slot=avatar]]:size-6", className)}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-content" className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)} {...props} />
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-title" className={cn("truncate text-sm font-medium text-foreground", className)} {...props} />
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="item-description" className={cn("line-clamp-2 text-xs text-muted-foreground", className)} {...props} />
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-actions" className={cn("flex items-center gap-2", className)} {...props} />
}

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="list" data-slot="item-group" className={cn("flex flex-col gap-2", className)} {...props} />
}

export { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, ItemGroup, itemVariants }
