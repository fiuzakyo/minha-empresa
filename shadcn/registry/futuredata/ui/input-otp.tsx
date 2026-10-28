/**
 * Input OTP — Voltron Design System (Figma: 01 · Atoms › Input OTP / Slot)
 *
 * shadcn/ui nativo (input-otp). Cada slot é uma caixa 48×56 (spacing/12 × spacing/14),
 * radius/lg, dígito Medium 2xl. Combine 4–6 slots num InputOTPGroup.
 * States: Placeholder (text/disabled) · Hover (--background) · Focus (focus/halo) ·
 * Filled · Disabled · Error (aria-invalid no InputOTP).
 */
import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & { containerClassName?: string }) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn("group/otp flex items-center gap-2 has-disabled:opacity-100", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-group" className={cn("flex items-center gap-2", className)} {...props} />
}

function InputOTPSlot({
  index,
  placeholder = "0",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
  /** Dígito exibido em cinza quando o slot está vazio (Figma State=Placeholder). */
  placeholder?: string
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-filled={!!char}
      className={cn(
        "relative flex h-14 w-12 items-center justify-center rounded-lg border border-input bg-card text-2xl font-medium text-foreground shadow-xs outline-none",
        "transition-[background-color,border-color,box-shadow] hover:bg-background",
        "data-[active=true]:border-vt-focus-halo data-[active=true]:shadow-none data-[active=true]:ring-[3px] data-[active=true]:ring-vt-focus-halo",
        "group-has-[input[aria-invalid=true]]/otp:border-destructive group-has-[input[aria-invalid=true]]/otp:text-vt-error-strong group-has-[input[aria-invalid=true]]/otp:shadow-none",
        "group-has-disabled/otp:border-transparent group-has-disabled/otp:bg-background group-has-disabled/otp:shadow-none",
        className
      )}
      {...props}
    >
      {char ?? <span className="text-vt-text-disabled">{placeholder}</span>}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" className="text-muted-foreground" {...props}>
      <MinusIcon className="size-4" />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
