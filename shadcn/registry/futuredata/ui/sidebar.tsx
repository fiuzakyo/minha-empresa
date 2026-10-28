/**
 * Sidebar — Voltron Design System
 * Figma: 01 · Atoms › Sidebar / Group Label
 *        02 · Molecules › Sidebar / Menu Button, Sidebar / Header, Sidebar / User
 *        03 · Organisms › Sidebar (collapsible=icon)
 *
 * Versão Voltron do shadcn/ui Sidebar, com a mesma API essencial:
 *   <SidebarProvider>
 *     <Sidebar>                                  expandida 256px · recolhida (ícones) 64px
 *       <SidebarHeader><SidebarAccount …/></SidebarHeader>
 *       <SidebarContent>
 *         <SidebarGroup><SidebarGroupLabel>Geral</SidebarGroupLabel>
 *           <SidebarMenu><SidebarMenuItem><SidebarMenuButton isActive>…</SidebarMenuButton></SidebarMenuItem></SidebarMenu>
 *         </SidebarGroup>
 *       </SidebarContent>
 *       <SidebarFooter><Balance …/><SidebarUser …/></SidebarFooter>
 *     </Sidebar>
 *     <main>…<SidebarTrigger/></main>
 *   </SidebarProvider>
 * Atalho: Ctrl/⌘ + B alterna.
 */
import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { CaretUpDownIcon, SidebarSimpleIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/futuredata/ui/button"
import { Separator } from "@/registry/futuredata/ui/separator"

type SidebarContextValue = {
  open: boolean
  state: "expanded" | "collapsed"
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar precisa estar dentro de <SidebarProvider>.")
  return ctx
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [inner, setInner] = React.useState(defaultOpen)
  const open = openProp ?? inner
  const setOpen = React.useCallback(
    (v: boolean) => {
      if (openProp === undefined) setInner(v)
      onOpenChange?.(v)
    },
    [openProp, onOpenChange]
  )
  const toggleSidebar = React.useCallback(() => setOpen(!open), [open, setOpen])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [toggleSidebar])

  const value = React.useMemo<SidebarContextValue>(
    () => ({ open, state: open ? "expanded" : "collapsed", setOpen, toggleSidebar }),
    [open, setOpen, toggleSidebar]
  )
  return (
    <SidebarContext.Provider value={value}>
      <div data-slot="sidebar-wrapper" className={cn("flex min-h-svh w-full", className)} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

function Sidebar({ className, children, ...props }: React.ComponentProps<"aside">) {
  const { state } = useSidebar()
  return (
    <aside
      data-slot="sidebar"
      data-state={state}
      className={cn(
        "group/sidebar sticky top-0 flex h-svh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        "transition-[width] duration-200 ease-out data-[state=expanded]:w-64 data-[state=collapsed]:w-16",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, open } = useSidebar()
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      aria-label={open ? "Recolher menu" : "Expandir menu"}
      aria-expanded={open}
      onClick={(e) => {
        onClick?.(e)
        toggleSidebar()
      }}
      className={className}
      {...props}
    >
      <SidebarSimpleIcon />
    </Button>
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex flex-col gap-2 p-4 group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:px-2", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("flex flex-col gap-2 p-4 group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:px-2", className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden px-2", className)}
      {...props}
    />
  )
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator data-slot="sidebar-separator" className={cn("mx-2 w-auto bg-sidebar-border", className)} {...props} />
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group" className={cn("flex w-full min-w-0 flex-col gap-1 py-2", className)} {...props} />
}

/** Rótulo de grupo em maiúsculas (SemiBold xs, --muted-foreground). Recolhida: truncado e centralizado. */
function SidebarGroupLabel({ className, asChild = false, ...props }: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="sidebar-group-label"
      className={cn(
        "flex h-8 shrink-0 items-center px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
        "group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:truncate group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:text-center",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group-content" className={cn("w-full text-sm", className)} {...props} />
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="sidebar-menu" className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props} />
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-item" className={cn("group/menu-item relative", className)} {...props} />
}

const sidebarMenuButtonVariants = cva(
  [
    "peer/menu-button flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-md px-3 text-start text-sm font-medium text-vt-text-secondary outline-none",
    "transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50",
    "data-[active=true]:bg-accent data-[active=true]:text-vt-primary-strong",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&>svg]:size-5 [&>svg]:shrink-0 [&>span:last-child]:truncate",
    // recolhida: só o ícone, 40×40
    "group-data-[state=collapsed]/sidebar:size-10 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:p-0",
    "group-data-[state=collapsed]/sidebar:[&>:not(svg)]:hidden",
  ],
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-8 font-normal data-[active=true]:font-medium",
      },
    },
    defaultVariants: { size: "default" },
  }
)

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof sidebarMenuButtonVariants> & {
    asChild?: boolean
    isActive?: boolean
    /** Texto mostrado como title quando a sidebar está recolhida. */
    tooltip?: string
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const { state } = useSidebar()
  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive}
      data-size={size}
      aria-current={isActive ? "page" : undefined}
      title={state === "collapsed" ? tooltip : undefined}
      className={cn(sidebarMenuButtonVariants({ size }), className)}
      {...props}
    />
  )
}

/** Contador do item (Tag Brand sm). */
function SidebarMenuBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="sidebar-menu-badge"
      className={cn(
        "ms-auto inline-flex h-6 min-w-6 items-center justify-center rounded-control border border-vt-primary-medium bg-accent px-2 text-xs font-medium text-vt-primary-strong",
        "group-data-[state=collapsed]/sidebar:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={cn("ms-5 flex flex-col gap-1 border-s border-sidebar-border ps-2 group-data-[state=collapsed]/sidebar:hidden", className)}
      {...props}
    />
  )
}

function SidebarMenuSubItem(props: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-sub-item" {...props} />
}

function SidebarMenuSubButton(props: React.ComponentProps<typeof SidebarMenuButton>) {
  return <SidebarMenuButton data-slot="sidebar-menu-sub-button" size="sm" {...props} />
}

/** Cabeçalho com conta/workspace (Figma: Sidebar / Header). Recolhida: só o avatar. */
function SidebarAccount({
  avatar,
  name,
  description,
  switcher,
  showTrigger = true,
  className,
}: {
  avatar: React.ReactNode
  name: React.ReactNode
  description?: React.ReactNode
  /** Botão/DropdownMenuTrigger para trocar de workspace (Sidebar / Team Switcher). */
  switcher?: React.ReactNode
  /** Mostra o botão de recolher. */
  showTrigger?: boolean
  className?: string
}) {
  return (
    <div data-slot="sidebar-account" className={cn("flex items-center gap-3 py-1 ps-1 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:p-1", className)}>
      {avatar}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 group-data-[state=collapsed]/sidebar:hidden">
        <span className="truncate text-sm font-semibold text-foreground">{name}</span>
        {description && <span className="truncate text-xs text-muted-foreground">{description}</span>}
      </div>
      <div className="flex items-center group-data-[state=collapsed]/sidebar:hidden">
        {switcher}
        {showTrigger && <SidebarTrigger />}
      </div>
    </div>
  )
}

/** Usuário logado no rodapé (Figma: Sidebar / User). Use como DropdownMenuTrigger asChild. */
function SidebarUser({
  avatar,
  name,
  email,
  chevron = true,
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & {
  avatar: React.ReactNode
  name: React.ReactNode
  email?: React.ReactNode
  chevron?: boolean
}) {
  return (
    <button
      type="button"
      data-slot="sidebar-user"
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-start outline-none transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:bg-muted",
        "group-data-[state=collapsed]/sidebar:w-auto group-data-[state=collapsed]/sidebar:p-1",
        className
      )}
      {...props}
    >
      {avatar}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 group-data-[state=collapsed]/sidebar:hidden">
        <span className="truncate text-sm font-semibold text-foreground">{name}</span>
        {email && <span className="truncate text-xs text-muted-foreground">{email}</span>}
      </span>
      {chevron && <CaretUpDownIcon aria-hidden="true" className="size-5 shrink-0 text-muted-foreground group-data-[state=collapsed]/sidebar:hidden" />}
    </button>
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return <main data-slot="sidebar-inset" className={cn("relative flex min-w-0 flex-1 flex-col bg-background", className)} {...props} />
}

export {
  Sidebar,
  SidebarAccount,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  SidebarUser,
  sidebarMenuButtonVariants,
  useSidebar,
}
