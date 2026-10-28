/**
 * Prompt Input — Voltron Design System (Figma: 03 · Organisms › Prompt Input)
 *
 * Campo de mensagem para IA (equivale ao PromptInput do registro AI Elements):
 * cartão --card (radius/xl → radius/2xl com foco), ícone à esquerda, textarea, anexos,
 * barra de ferramentas (anexar, sugestões, seletor de modelo, enviar/parar) e aviso de privacidade.
 * States: Empty · Focus (focus/halo) · Filled · Loading (botão vira Parar) · Disabled (50%).
 */
import * as React from "react"
import { ArrowUpIcon, MagicWandIcon, PaperclipIcon, ShieldCheckIcon, StopIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/futuredata/ui/button"

function PromptInput({
  className,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  onStop,
  onAttach,
  loading = false,
  disabled = false,
  placeholder = "Envie uma mensagem para a IA…",
  leadingIcon = <MagicWandIcon />,
  attachments,
  suggestions,
  modelSelector,
  disclaimer = (
    <>
      Seus dados são privados e seguros.{" "}
      <a href="#" className="font-medium text-vt-primary-strong hover:underline">
        Saiba mais
      </a>
    </>
  ),
}: {
  className?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSubmit?: (value: string) => void
  onStop?: () => void
  /** Mostra o botão de anexar (Figma Attach). */
  onAttach?: () => void
  loading?: boolean
  disabled?: boolean
  placeholder?: string
  /** false esconde (Figma Leading Icon). */
  leadingIcon?: React.ReactNode | false
  /** <AttachmentChip/>s (Figma Attachments). */
  attachments?: React.ReactNode
  /** <Button variant="outline"/> ou <PromptSuggestion/>s (Figma Suggestions). */
  suggestions?: React.ReactNode
  /** <ModelSelector/> (Figma Model Selector). */
  modelSelector?: React.ReactNode
  /** false esconde (Figma Disclaimer). */
  disclaimer?: React.ReactNode | false
}) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const set = (v: string) => {
    if (valueProp === undefined) setInner(v)
    onValueChange?.(v)
  }
  const submit = () => {
    if (!value.trim() || loading || disabled) return
    onSubmit?.(value)
  }
  return (
    <div data-slot="prompt-input" className={cn("flex w-full flex-col gap-3", disabled && "pointer-events-none opacity-50", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className={cn(
          "flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-[border-color,box-shadow,border-radius]",
          "focus-within:rounded-2xl focus-within:border-vt-focus-halo focus-within:ring-[3px] focus-within:ring-vt-focus-halo",
          disabled && "border-input shadow-none"
        )}
      >
        {attachments && <div className="flex flex-wrap gap-2">{attachments}</div>}
        <div className="flex min-h-12 gap-2">
          {leadingIcon && <span className="pt-0.5 text-muted-foreground [&_svg]:size-5">{leadingIcon}</span>}
          <textarea
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            onChange={(e) => set(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
            className="field-sizing-content max-h-60 min-h-6 flex-1 resize-none bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          {onAttach && (
            <Button type="button" variant="outline" size="icon" aria-label="Anexar arquivo" onClick={onAttach}>
              <PaperclipIcon />
            </Button>
          )}
          {suggestions && <div className="flex min-w-0 flex-wrap items-center gap-2">{suggestions}</div>}
          <span className="flex-1" />
          {modelSelector}
          {loading ? (
            <Button type="button" size="icon" aria-label="Parar" onClick={onStop}>
              <StopIcon weight="fill" />
            </Button>
          ) : (
            <Button type="submit" size="icon" aria-label="Enviar" disabled={!value.trim()}>
              <ArrowUpIcon />
            </Button>
          )}
        </div>
      </form>
      {disclaimer && (
        <p className="flex items-center gap-1.5 ps-1 text-sm text-vt-text-secondary [&_svg]:size-5">
          <ShieldCheckIcon aria-hidden="true" className="text-success" />
          <span>{disclaimer}</span>
        </p>
      )}
    </div>
  )
}

export { PromptInput }
