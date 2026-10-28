/**
 * Team Switcher — Voltron Design System (Figma: 03 · Organisms › Sidebar / Team Switcher)
 *
 * Menu aberto pelo Sidebar / Header para trocar de conta ou workspace (padrão TeamSwitcher do
 * bloco sidebar-07): rótulo, contas (a ativa marcada) e "Adicionar conta".
 */
import * as React from "react"
import { CaretUpDownIcon, PlusIcon } from "@phosphor-icons/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/futuredata/ui/avatar"
import { Button } from "@/registry/futuredata/ui/button"
import {
  DropdownMenu,
  DropdownMenuAccountItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/futuredata/ui/dropdown-menu"

type Team = { id: string; name: string; description?: string; image?: string; initials?: string }

function TeamSwitcher({
  teams,
  activeId,
  onSelect,
  onAdd,
  label = "Contas",
  addLabel = "Adicionar conta",
  trigger,
}: {
  teams: Team[]
  activeId: string
  onSelect: (id: string) => void
  onAdd?: () => void
  label?: string
  addLabel?: string
  /** Gatilho customizado; o padrão é um Button ghost icon-sm com CaretUpDown. */
  trigger?: React.ReactNode
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon-sm" aria-label="Trocar conta">
            <CaretUpDownIcon />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {teams.map((t) => (
          <DropdownMenuAccountItem
            key={t.id}
            selected={t.id === activeId}
            onSelect={() => onSelect(t.id)}
            name={t.name}
            description={t.description}
            avatar={
              <Avatar size="md">
                {t.image && <AvatarImage src={t.image} alt="" />}
                <AvatarFallback>{t.initials ?? t.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            }
          />
        ))}
        {onAdd && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onAdd}>
              <PlusIcon />
              {addLabel}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { TeamSwitcher }
export type { Team }
