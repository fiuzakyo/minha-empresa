# Registro shadcn/ui — `@futuredata/*`

Esta pasta é a **fonte** de todos os componentes do Voltron (`registry/futuredata/`) e também um
[registro shadcn](https://ui.shadcn.com/docs/registry): o código é copiado para o seu projeto, como os
componentes do shadcn, e fica editável.

## Configuração (uma vez por projeto)

Projeto com shadcn/ui e Tailwind v4. No `components.json`, registre o namespace:

```json
{
  "registries": {
    "@futuredata": {
      "url": "https://raw.githubusercontent.com/fiuzakyo/minha-empresa/main/shadcn/public/r/{name}.json"
    }
  }
}
```

O repositório é público, então não precisa de token. Se ele ficar privado, acrescente
`"headers": { "Authorization": "token ${GITHUB_TOKEN}" }` com um token que leia o repositório.

Instale o tema e os componentes:

```bash
npx shadcn@latest add @futuredata/theme          # styles/futuredata.css
npx shadcn@latest add @futuredata/button @futuredata/field
npx shadcn@latest add @futuredata/all            # tudo de uma vez
```

No `globals.css`, depois do Tailwind:

```css
@import "tailwindcss";
@import "./styles/futuredata.css";
```

O `futuredata.css` substitui as variáveis padrão do shadcn (`--primary`, `--background`, `--radius`…) pelos tokens
do Voltron e acrescenta os tokens próprios (`bg-vt-primary-soft`, `rounded-button`, `h-input-md`, `shadow-brand-md`,
`vt-text-bold-xl`…). Marca e tema: `data-brand="whitelabel|detetive-auto|verax"` e `.dark`.

## Atualizar um componente

```bash
npx shadcn@latest add @futuredata/button --overwrite
```

O CHANGELOG dos pacotes (e o PR de cada sincronização) diz o que mudou em cada arquivo.

## Itens do registro

| Item | Arquivo | Componentes do Figma |
|---|---|---|
| `theme` | `styles/futuredata.css` | Foundations (cores, tipografia, espaçamento, raios, sombras) |
| `all` | — | todos abaixo |

Os demais itens têm o nome do arquivo (`button`, `field`, `sidebar`, `data-table`…). A lista completa, com o
componente do Figma de cada um, está em [`registry.json`](registry.json).

## Desenvolvimento

`registry.json` e `public/r/` são gerados (`npm run build -w @fiuzakyo/ui-shadcn`). Edite só
`registry/futuredata/`. O tema em `registry/futuredata/styles/` é gerado pelo build dos tokens.
