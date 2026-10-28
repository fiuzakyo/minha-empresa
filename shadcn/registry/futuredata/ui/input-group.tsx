/**
 * Input Group — Voltron Design System (Figma: 02 · Molecules › Input Group / Inline Edit)
 *
 * shadcn/ui Input Group: um contêiner com borda que agrupa input + addons (ícones, botões, texto).
 * Visual Voltron: altura 48 (spacing/12), radius/lg, --card, Elevation/shadow-xs.
 * Hover → --background · Focus → focus/halo · Error → aria-invalid no input · Disabled → --background sem borda.
 *
 * Inline Edit (Figma): <InputGroup><InputGroupAddon><PencilSimpleIcon/></InputGroupAddon>
 *   <InputGroupInput/><InputGroupAddon align="inline-end"><InputGroupButton>Salvar</InputGroupButton></InputGroupAddon></InputGroup>
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/futuredata/ui/button"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex h-12 w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-card ps-3 shadow-xs outline-none",
        "transition-[background-color,border-color,box-shadow] hover:bg-background",
        "has-[[data-slot=input-group-control]:focus-visible]:border-vt-focus-halo has-[[data-slot=input-group-control]:focus-visible]:shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-vt-focus-halo",
        "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:shadow-none",
        "has-[[data-slot=input-group-control]:disabled]:border-transparent has-[[data-slot=input-group-control]:disabled]:bg-background has-[[data-slot=input-group-control]:disabled]:shadow-none",
        "[&_svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto shrink-0 cursor-text items-center justify-center gap-2 text-sm text-muted-foreground select-none group-has-[[data-slot=input-group-control]:disabled]/input-group:text-vt-text-disabled",
  {
    variants: {
      align: {
        "inline-start": "order-first",
        "inline-end": "order-last pe-0 has-[>button]:pe-2",
      },
    },
    defaultVariants: { align: "inline-start" },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return
        e.currentTarget.parentElement?.querySelector<HTMLInputElement>("[data-slot=input-group-control]")?.focus()
      }}
      {...props}
    />
  )
}

function InputGroupButton({
  className,
  variant = "link",
  size = "sm",
  type = "button",
  ...props
}: React.ComponentProps<typeof Button>) {
  return <Button type={type} data-size={size} variant={variant} size={size} className={cn("shadow-none", className)} {...props} />
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)} {...props} />
}

function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-control"
      className={cn(
        "h-full min-w-0 flex-1 bg-transparent pe-3 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-vt-text-disabled",
        className
      )}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput }
