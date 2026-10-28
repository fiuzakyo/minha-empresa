/**
 * Profile Card — Voltron Design System (Figma: 03 · Organisms › Profile Card)
 *
 * Card de perfil: foto (Image), identidade (Profile Identity), métricas (Stat Item) e ação.
 * - layout: vertical (destaque, foto 4:3) | horizontal (listas, foto 1:1 104px)
 * - action: follow (Button soft + Plus) | following (Button outline + Check) — ou passe o seu
 * - loading: skeleton · hover: Elevation/shadow-md
 * Contêiner --card, --border, radius/card (Verax 0), padding 8.
 */
import * as React from "react"
import { CheckIcon, PlusIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Image } from "@/registry/futuredata/ui/aspect-ratio"
import { Button } from "@/registry/futuredata/ui/button"
import { Skeleton } from "@/registry/futuredata/ui/skeleton"
import { ProfileIdentity } from "@/registry/futuredata/components/profile-identity"

function ProfileCard({
  className,
  layout = "vertical",
  photo,
  name,
  bio,
  seal = true,
  stats,
  following,
  onFollowChange,
  action,
  loading = false,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  layout?: "vertical" | "horizontal"
  photo?: string
  name: React.ReactNode
  bio?: React.ReactNode
  seal?: boolean | React.ReactNode
  /** <StatItem/>s (Figma Show Stats). */
  stats?: React.ReactNode
  /** Estado do botão seguir; omita para esconder (Figma Show Action). */
  following?: boolean
  onFollowChange?: (following: boolean) => void
  /** Ação customizada no lugar do seguir. */
  action?: React.ReactNode
  loading?: boolean
}) {
  const vertical = layout === "vertical"
  const followButton =
    action ??
    (following === undefined ? null : following ? (
      <Button variant="outline" size="sm" onClick={() => onFollowChange?.(false)}>
        Seguindo
        <CheckIcon data-icon="inline-end" />
      </Button>
    ) : (
      <Button variant="soft" size="sm" onClick={() => onFollowChange?.(true)}>
        Seguir
        <PlusIcon data-icon="inline-end" />
      </Button>
    ))
  return (
    <div
      data-slot="profile-card"
      data-layout={layout}
      aria-busy={loading || undefined}
      className={cn(
        "flex rounded-card border border-border bg-card p-2 transition-shadow hover:shadow-md",
        vertical ? "w-80 flex-col" : "w-full max-w-[520px] flex-row gap-3",
        className
      )}
      {...props}
    >
      <Image
        ratio={vertical ? "4:3" : "1:1"}
        src={loading ? undefined : photo}
        alt=""
        className={cn(!vertical && "w-26 shrink-0")}
      />
      <div className={cn("flex min-w-0 flex-1 flex-col gap-3", vertical ? "px-3 pt-4 pb-1" : "p-1")}>
        {loading ? (
          <>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-48" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-10" />
              <span className="flex-1" />
              <Skeleton className="h-9 w-22" />
            </div>
          </>
        ) : (
          <>
            <ProfileIdentity name={name} bio={bio} seal={seal} size={vertical ? "lg" : "sm"} />
            {(stats || followButton) && (
              <div className="flex items-center gap-4">
                {stats}
                <span className="flex-1" />
                {followButton}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export { ProfileCard }
