/**
 * Image / Aspect Ratio — Voltron Design System (Figma: 01 · Atoms › Image)
 *
 * shadcn/ui Aspect Ratio + <Image>: mídia com proporção fixa, raio radius/media
 * (Whitelabel e Detetive Auto 18px, Verax 0) e fundo --muted.
 * - ratio: "1:1" | "4:3" | "3:4" | "16:9" (ou um número)
 * - sem `src` mostra o placeholder (ícone Image), como Content=Placeholder no Figma
 */
import * as React from "react"
import { AspectRatio as AspectRatioPrimitive } from "radix-ui"
import { ImageIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

function AspectRatio({ ...props }: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

const RATIOS = { "1:1": 1, "4:3": 4 / 3, "3:4": 3 / 4, "16:9": 16 / 9 } as const

function Image({
  ratio = "1:1",
  src,
  alt = "",
  className,
  style,
  imgClassName,
  ...props
}: Omit<React.ComponentProps<"img">, "ref"> & {
  ratio?: keyof typeof RATIOS | number
  imgClassName?: string
}) {
  const value = typeof ratio === "number" ? ratio : RATIOS[ratio]
  return (
    <div data-slot="image" style={style} className={cn("w-full overflow-hidden rounded-media bg-muted", className)}>
      <AspectRatio ratio={value}>
        {src ? (
          <img src={src} alt={alt} className={cn("size-full object-cover", imgClassName)} {...props} />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageIcon aria-hidden="true" className="size-8" />
          </div>
        )}
      </AspectRatio>
    </div>
  )
}

export { AspectRatio, Image }
