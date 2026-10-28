/**
 * Tabs — Voltron Design System
 * Figma: 01 · Atoms › Tabs / Trigger · 02 · Molecules › Tabs
 *
 * shadcn/ui Tabs (Radix) + estilos Voltron na TabsList (variant):
 * - pills (sem fundo) · pills-elevated (padrão shadcn: fundo --muted, padding 4, radius/lg)
 * - pills-rounded · pills-elevated-rounded (radius/full)
 * - underline (linha-base --border) · underline-floating (sem linha-base)
 * - folders (linha-base formada pelas abas inativas) · folders-highlighted (aba ativa com topo --primary)
 * Trigger: 36px (pills) / 40px (underline, folders), px 16, gap 8, Medium sm; ativo --card + shadow-sm (pills),
 * indicador 2px --primary (underline), aba recortada (folders). Contador opcional com <TabsCount>.
 */
import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type TabsVariant = NonNullable<VariantProps<typeof tabsListVariants>["variant"]>
const TabsVariantContext = React.createContext<TabsVariant>("pills-elevated")

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props} />
}

const tabsListVariants = cva("inline-flex w-fit items-end text-sm", {
  variants: {
    variant: {
      pills: "gap-1",
      "pills-elevated": "gap-1 rounded-lg bg-muted p-1",
      "pills-rounded": "gap-1",
      "pills-elevated-rounded": "gap-1 rounded-full bg-muted p-1",
      underline: "border-b border-border",
      "underline-floating": "",
      folders: "",
      "folders-highlighted": "",
    },
  },
  defaultVariants: { variant: "pills-elevated" },
})

function TabsList({
  className,
  variant = "pills-elevated",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsVariantContext.Provider value={variant ?? "pills-elevated"}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  )
}

const tabsTriggerVariants = cva(
  [
    "group/tab relative inline-flex cursor-pointer items-center justify-center gap-2 px-4 font-medium whitespace-nowrap text-vt-text-secondary outline-none",
    "transition-[color,background-color,box-shadow] hover:text-foreground",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  ],
  {
    variants: {
      variant: {
        pills: "h-9 rounded-md hover:bg-muted data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        "pills-elevated":
          "h-9 rounded-md hover:bg-muted data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        "pills-rounded":
          "h-9 rounded-full hover:bg-muted data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        "pills-elevated-rounded":
          "h-9 rounded-full hover:bg-muted data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        underline:
          "-mb-px h-10 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 hover:after:bg-input data-[state=active]:text-vt-primary-strong data-[state=active]:after:bg-primary",
        "underline-floating":
          "h-10 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 hover:after:bg-input data-[state=active]:text-vt-primary-strong data-[state=active]:after:bg-primary",
        folders:
          "h-10 rounded-t-md border-b border-border data-[state=active]:border-x data-[state=active]:border-t data-[state=active]:border-b-transparent data-[state=active]:bg-card data-[state=active]:text-foreground",
        "folders-highlighted":
          "h-10 rounded-t-md border-b border-border before:absolute before:inset-x-[-1px] before:top-[-1px] before:h-0.5 before:rounded-t-md data-[state=active]:border-x data-[state=active]:border-t data-[state=active]:border-b-transparent data-[state=active]:bg-card data-[state=active]:text-vt-primary-strong data-[state=active]:before:bg-primary",
      },
    },
    defaultVariants: { variant: "pills-elevated" },
  }
)

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(TabsVariantContext)
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  )
}

/** Contador da aba (Tag sm): Brand na aba ativa, Neutral nas demais. */
function TabsCount({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tabs-count"
      className={cn(
        "inline-flex h-6 items-center rounded-control border border-border bg-background px-2 text-xs font-medium text-foreground",
        "group-data-[state=active]/tab:border-vt-primary-medium group-data-[state=active]/tab:bg-accent group-data-[state=active]/tab:text-vt-primary-strong",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsCount, TabsContent, tabsListVariants, tabsTriggerVariants }
