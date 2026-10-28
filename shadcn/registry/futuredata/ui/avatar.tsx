/**
 * Avatar — Voltron Design System
 * Figma: 01 · Atoms › Avatar, Avatar / Portrait, Avatar / Status
 *        02 · Molecules › Avatar Group, Avatar Group / Compact
 *
 * shadcn/ui Avatar (Radix) com:
 * - size: xs 24 · sm 32 · md 40 · lg 48 · xl 64 (o raio cresce com o tamanho)
 * - variant="portrait": proporção 2:3 (sm 64×96 · md 96×144 · lg 128×192)
 * - <AvatarStatus status="online|away|busy|offline" /> dentro do Avatar
 * - <AvatarGroup> empilhado (-space-x) com anel --card e contador de excedentes
 */
import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { UserIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const avatarVariants = cva("group/avatar relative inline-flex shrink-0 select-none", {
  variants: {
    variant: {
      default: "",
      portrait: "",
    },
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: "",
    },
  },
  compoundVariants: [
    { variant: "default", size: "xs", className: "size-6 [--avatar-radius:var(--vt-radius-md)]" },
    { variant: "default", size: "sm", className: "size-8 [--avatar-radius:var(--vt-radius-lg)]" },
    { variant: "default", size: "md", className: "size-10 [--avatar-radius:var(--vt-radius-lg)]" },
    { variant: "default", size: "lg", className: "size-12 [--avatar-radius:var(--vt-radius-xl)]" },
    { variant: "default", size: "xl", className: "size-16 [--avatar-radius:var(--vt-radius-xl)]" },
    { variant: "portrait", size: ["xs", "sm"], className: "h-24 w-16 [--avatar-radius:var(--vt-radius-lg)]" },
    { variant: "portrait", size: "md", className: "h-36 w-24 [--avatar-radius:var(--vt-radius-xl)]" },
    { variant: "portrait", size: ["lg", "xl"], className: "h-48 w-32 [--avatar-radius:var(--vt-radius-xl)]" },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

function Avatar({
  className,
  size = "md",
  variant = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      data-variant={variant}
      className={cn(avatarVariants({ size, variant }), className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-auto size-full rounded-[var(--avatar-radius)] object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-[var(--avatar-radius)] font-medium",
        children ? "bg-accent text-vt-primary-strong" : "bg-background text-muted-foreground",
        // tamanho do texto das iniciais por tamanho do avatar
        "text-xs group-data-[size=md]/avatar:text-sm group-data-[size=lg]/avatar:text-base group-data-[size=xl]/avatar:text-lg",
        "group-data-[variant=portrait]/avatar:text-lg group-data-[variant=portrait]/avatar:group-data-[size=md]/avatar:vt-text-bold-2xl group-data-[variant=portrait]/avatar:group-data-[size=lg]/avatar:vt-text-bold-3xl",
        // ícone de usuário quando não há iniciais: metade do avatar
        "[&>svg]:size-1/2",
        className
      )}
      {...props}
    >
      {children ?? <UserIcon aria-hidden="true" />}
    </AvatarPrimitive.Fallback>
  )
}

const avatarStatusVariants = cva(
  "absolute right-0 bottom-0 block rounded-full border-2 border-card size-3 group-data-[size=xs]/avatar:size-2 group-data-[size=xs]/avatar:border group-data-[size=lg]/avatar:size-4 group-data-[size=xl]/avatar:size-4 group-data-[variant=portrait]/avatar:size-4",
  {
    variants: {
      status: {
        online: "bg-success",
        away: "bg-warning",
        busy: "bg-destructive",
        offline: "bg-vt-border-strong",
      },
    },
    defaultVariants: { status: "online" },
  }
)

const statusLabel = { online: "Online", away: "Ausente", busy: "Ocupado", offline: "Offline" } as const

function AvatarStatus({
  className,
  status = "online",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof avatarStatusVariants>) {
  return (
    <span
      data-slot="avatar-status"
      data-status={status}
      role="status"
      aria-label={statusLabel[status ?? "online"]}
      className={cn(avatarStatusVariants({ status }), className)}
      {...props}
    />
  )
}

/** Avatares sobrepostos (Figma: Avatar Group). Use `count` para o contador "+N". */
function AvatarGroup({
  className,
  children,
  size = "md",
  count,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  /** Texto do contador de excedentes, ex.: "+3". */
  count?: React.ReactNode
  /** compact: contador ao lado (Figma: Avatar Group / Compact); stroke adiciona contêiner com borda. */
  variant?: "default" | "compact" | "stroke"
}) {
  const overlap = {
    xs: cn("-space-x-1.5"),
    sm: cn("-space-x-2"),
    md: cn("-space-x-2.5"),
    lg: cn("-space-x-3"),
    xl: cn("-space-x-4"),
  }[size]
  return (
    <div
      data-slot="avatar-group"
      data-size={size}
      data-variant={variant}
      className={cn(
        "flex items-center",
        variant === "stroke" && "w-fit gap-2 rounded-xl border border-border bg-card p-1 pe-3 shadow-xs",
        variant !== "default" && "gap-2",
        className
      )}
      {...props}
    >
      <div className={cn("flex items-center *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-card *:data-[slot=avatar]:rounded-[var(--avatar-radius)]", overlap)}>
        {React.Children.map(children, (child) =>
          React.isValidElement<React.ComponentProps<typeof Avatar>>(child) ? React.cloneElement(child, { size }) : child
        )}
        {count != null && variant === "default" && (
          <span
            data-slot="avatar-group-count"
            className={cn(
              avatarVariants({ size }),
              "items-center justify-center rounded-[var(--avatar-radius)] bg-background font-medium text-vt-text-secondary ring-2 ring-card",
              size === "xs" || size === "sm" ? "text-xs" : size === "xl" ? "text-base" : "text-sm"
            )}
          >
            {count}
          </span>
        )}
      </div>
      {count != null && variant !== "default" && (
        <span data-slot="avatar-group-count" className={cn("font-medium text-vt-text-secondary", size === "xs" ? "text-xs" : "text-sm")}>
          {count}
        </span>
      )}
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarStatus, AvatarGroup, avatarVariants }
