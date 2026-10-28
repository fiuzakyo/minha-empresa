/**
 * Announcement Badge — Voltron Design System (Figma: 01 · Atoms › Announcement Badge)
 *
 * Pílula de anúncio clicável (composição sobre Badge outline, rounded-full, render como <a>).
 * A pílula inteira é um único link.
 * - type: "icon"   → ícone em círculo + texto
 *         "action" → ícone + texto + seta em círculo
 *         "split"  → texto | ação (linkText + seta)
 * - tone: neutral | brand
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRightIcon, ArrowUpRightIcon, BellRingingIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const announcementBadgeVariants = cva(
  [
    "group/announcement inline-flex h-8 w-fit items-center rounded-full border border-border bg-card text-sm font-medium text-vt-text-secondary shadow-xs outline-none",
    "transition-shadow hover:shadow-sm focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      type: {
        icon: "gap-2 ps-1 pe-3",
        action: "gap-2 ps-3 pe-1",
        split: "gap-0",
      },
      tone: {
        neutral: "",
        brand: "",
      },
    },
    defaultVariants: {
      type: "icon",
      tone: "neutral",
    },
  }
)

function AnnouncementBadge({
  className,
  type = "icon",
  tone = "neutral",
  icon = <BellRingingIcon />,
  linkText = "Explorar",
  children,
  ...props
}: React.ComponentProps<"a"> &
  VariantProps<typeof announcementBadgeVariants> & {
    /** Ícone Phosphor (Figma Icon). */
    icon?: React.ReactNode
    /** Texto da ação no tipo "split" (Figma Link text). */
    linkText?: React.ReactNode
  }) {
  const circle = cn(
    "inline-flex size-6 shrink-0 items-center justify-center rounded-full",
    tone === "brand" ? "bg-vt-primary-soft" : "bg-muted"
  )
  return (
    <a
      data-slot="announcement-badge"
      data-type={type}
      data-tone={tone}
      className={cn(announcementBadgeVariants({ type, tone }), className)}
      {...props}
    >
      {type === "icon" && (
        <>
          <span aria-hidden="true" className={circle}>
            {icon}
          </span>
          {children}
        </>
      )}
      {type === "action" && (
        <>
          <span aria-hidden="true" className="inline-flex">
            {icon}
          </span>
          {children}
          <span aria-hidden="true" className={circle}>
            <ArrowUpRightIcon />
          </span>
        </>
      )}
      {type === "split" && (
        <>
          <span className="inline-flex h-full items-center px-3">{children}</span>
          <span aria-hidden="true" className="h-full w-px bg-muted" />
          <span
            className={cn(
              "inline-flex h-full items-center gap-1 px-3",
              tone === "brand" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {linkText}
            <ArrowRightIcon aria-hidden="true" />
          </span>
        </>
      )}
    </a>
  )
}

export { AnnouncementBadge, announcementBadgeVariants }
