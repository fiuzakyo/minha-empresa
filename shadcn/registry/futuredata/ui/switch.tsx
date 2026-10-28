/**
 * Switch — Voltron Design System (Figma: 01 · Atoms › Switch)
 *
 * shadcn/ui nativo (Radix) + extensão + custom aprovado:
 * - size: "sm" (36×20) | "default" (48×24)  — Figma Size sm | md
 * - icons: mostra X/Check dentro do thumb (Figma Type=Icon); troque com iconOff / iconOn
 * - animação "líquida": o thumb estica enquanto é pressionado (Figma State=Pressed)
 */
import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"
import { CheckIcon, XIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "sm",
  icons = false,
  iconOff,
  iconOn,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
  /** Mostra ícones no thumb (Figma Type=Icon). */
  icons?: boolean
  iconOff?: React.ReactNode
  iconOn?: React.ReactNode
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch inline-flex shrink-0 cursor-pointer items-center rounded-full bg-input p-0.5 shadow-xs outline-none",
        "transition-[background-color,box-shadow] duration-200",
        "data-[state=checked]:bg-primary",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[size=sm]:h-5 data-[size=sm]:w-9 data-[size=default]:h-6 data-[size=default]:w-12",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none relative block rounded-full bg-card shadow-xs ring-0",
          "transition-[width,translate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          // sm: thumb 16px, esticado 24px
          "group-data-[size=sm]/switch:size-4 group-data-[size=sm]/switch:group-active/switch:w-6",
          "group-data-[size=sm]/switch:data-[state=checked]:translate-x-4 group-data-[size=sm]/switch:group-active/switch:data-[state=checked]:translate-x-2",
          // default: thumb 20px, esticado 32px
          "group-data-[size=default]/switch:size-5 group-data-[size=default]/switch:group-active/switch:w-8",
          "group-data-[size=default]/switch:data-[state=checked]:translate-x-6 group-data-[size=default]/switch:group-active/switch:data-[state=checked]:translate-x-3"
        )}
      >
        {icons && (
          <>
            <span className="absolute inset-0 grid place-content-center text-muted-foreground transition-opacity group-data-[state=checked]/switch:opacity-0 [&_svg]:size-2.5 group-data-[size=default]/switch:[&_svg]:size-3">
              {iconOff ?? <XIcon weight="bold" />}
            </span>
            <span className="absolute inset-0 grid place-content-center text-primary opacity-0 transition-opacity group-data-[state=checked]/switch:opacity-100 [&_svg]:size-2.5 group-data-[size=default]/switch:[&_svg]:size-3">
              {iconOn ?? <CheckIcon weight="bold" />}
            </span>
          </>
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
