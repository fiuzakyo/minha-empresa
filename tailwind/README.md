# `@fiuzakyo/ui-tailwind`

Os componentes do Voltron como **biblioteca React + Tailwind CSS v4**. É o mesmo código do registro shadcn
(`../shadcn/registry/futuredata`), compilado e versionado — você atualiza com `npm update` em vez de copiar arquivos.

## Instalação

> Os pacotes ficam no GitHub Packages: configure o `.npmrc` uma vez, como no [README da raiz](../README.md#instalando-os-pacotes-github-packages).

```bash
npm i @fiuzakyo/ui-tailwind
```

No CSS global (Tailwind v4):

```css
@import "tailwindcss";
@import "@fiuzakyo/ui-tailwind/styles.css";
```

`styles.css` traz os tokens (todas as marcas, claro/escuro), o tema do Tailwind e faz o Tailwind gerar as classes
usadas pelos componentes.

## Uso

```tsx
import { Button, FieldTextInput, Badge } from "@fiuzakyo/ui-tailwind"
import { PlusIcon } from "@phosphor-icons/react"

<html data-brand="verax">
  <Button variant="soft" size="sm"><PlusIcon data-icon="inline-start" />Adicionar</Button>
  <FieldTextInput label="E-mail" error="Informe um e-mail válido." />
  <Badge variant="success">Ativo</Badge>
</html>
```

As classes do Tailwind e os tokens também ficam disponíveis no seu código: `bg-primary`, `text-vt-text-secondary`,
`rounded-card`, `h-button-default`, `shadow-brand-md`, `vt-text-semibold-sm`…

O bundle já vem com `"use client"` (Next.js App Router).
