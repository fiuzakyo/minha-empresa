/**
 * Profile Identity — Voltron Design System (Figma: 02 · Molecules › Profile Identity)
 * Nome (Bold xl/base) + selo opcional (SealCheck em primary/strong, trocável) + bio (2 linhas).
 * size: lg | sm.
 */
import * as React from "react"
import { SealCheckIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

function ProfileIdentity({
  name,
  bio,
  seal = true,
  size = "lg",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  name: React.ReactNode
  bio?: React.ReactNode
  /** true usa SealCheck; passe outro ícone para trocar (ex.: selo do produto); false esconde. */
  seal?: boolean | React.ReactNode
  size?: "lg" | "sm"
}) {
  return (
    <div data-slot="profile-identity" data-size={size} className={cn("flex flex-col", size === "lg" ? "gap-2" : "gap-1", className)} {...props}>
      <div className="flex items-center gap-1.5">
        <span className={cn("text-foreground", size === "lg" ? "vt-text-bold-xl" : "vt-text-bold-base")}>{name}</span>
        {seal && (
          <span className={cn("text-vt-primary-strong [&_svg]:shrink-0", size === "lg" ? "[&_svg]:size-5" : "[&_svg]:size-4")}>
            {seal === true ? <SealCheckIcon weight="fill" aria-label="Verificado" /> : seal}
          </span>
        )}
      </div>
      {bio && <p className={cn("line-clamp-2 text-muted-foreground", size === "lg" ? "text-sm" : "text-xs")}>{bio}</p>}
    </div>
  )
}

export { ProfileIdentity }
