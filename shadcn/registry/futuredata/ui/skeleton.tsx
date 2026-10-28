/**
 * Skeleton — Voltron Design System (usado no Profile Card, State=Skeleton)
 * shadcn/ui nativo: bloco --muted com radius/sm e pulso.
 */
import * as React from "react"

import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("animate-pulse rounded-sm bg-muted", className)} {...props} />
}

export { Skeleton }
