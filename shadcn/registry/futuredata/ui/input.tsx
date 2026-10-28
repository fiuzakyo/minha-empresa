/**
 * Input — Voltron Design System (base do Figma: 02 · Molecules › Field / Text Input)
 *
 * Caixa de texto simples. Para o campo completo com label flutuante e dica use
 * <FieldTextInput> (field.tsx). Altura por size: md 48 · sm 40 · xs 32 (size/input/*,
 * muda por marca) · raio radius/input.
 * Focus → borda --ring + halo focus/halo · Error → aria-invalid (--destructive) · Disabled → 50%.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  [
    "flex w-full min-w-0 rounded-input border border-input bg-card px-3 text-sm text-foreground outline-none",
    "transition-[border-color,box-shadow] placeholder:text-muted-foreground",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-vt-focus-halo",
    "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
  ],
  {
    variants: {
      size: {
        md: "h-input-md",
        sm: "h-input-sm",
        xs: "h-input-xs",
      },
    },
    defaultVariants: { size: "md" },
  }
)

function Input({
  className,
  type,
  size = "md",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
