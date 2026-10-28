# Voltron Design System — código

Tokens e componentes do **Voltron Design System**, gerados a partir da biblioteca no Figma
([Voltron-Design-System](https://www.figma.com/design/cEmgSJcUBJQR8PdyCqaVWy/Voltron-Design-System)).
O Figma é a fonte da verdade do design; este repositório é a fonte da verdade do código.

| | |
|---|---|
| Marcas | Whitelabel · Detetive Auto · Verax |
| Temas | claro · escuro |
| Tokens | 640 variáveis em 12 coleções, 50 estilos de texto, 16 sombras |
| Componentes | 62 do Figma (21 Atoms · 32 Molecules · 8 Organisms) em 47 arquivos |
| Ícones | [Phosphor](https://phosphoricons.com) (`@phosphor-icons/react`), os mesmos do Figma |

## Qual pasta usar

O código de cada componente é escrito **uma vez** (em `shadcn/registry`) e distribuído de três formas.
Escolha a que combina com o projeto:

| Pasta | Pacote | Para quem | Como entra no projeto |
|---|---|---|---|
| [`shadcn/`](shadcn/README.md) | registro `@futuredata/*` | projetos que já usam **shadcn/ui** | `npx shadcn add @futuredata/button` copia o código para o projeto |
| [`tailwind/`](tailwind/README.md) | `@futuredata/ui-tailwind` | projetos **React + Tailwind v4** que preferem uma dependência | `npm i @futuredata/ui-tailwind` |
| [`react/`](react/README.md) | `@futuredata/ui-react` | projetos **React sem Tailwind** | `npm i @futuredata/ui-react` + 1 arquivo CSS |
| [`tokens/`](tokens/README.md) | `@futuredata/tokens` | qualquer stack (CSS, JS, outras plataformas) | `npm i @futuredata/tokens` |

Os três pacotes de componentes têm **a mesma API** (mesmos nomes, props e variantes), então trocar de um para outro
é só trocar o import.

## Marca e tema

Todas as cores, raios, alturas e fontes vêm de variáveis CSS. A marca e o tema são escolhidos por atributo,
no `<html>` ou em qualquer trecho da página:

```html
<html data-brand="whitelabel">          <!-- whitelabel | detetive-auto | verax -->
<body class="dark">                     <!-- ou data-theme="dark" -->
```

## Como as atualizações chegam

Toda mudança no Figma vira um **Pull Request** neste repositório contendo só o que mudou, com um resumo
(componentes novos, alterados e removidos; tokens alterados) e o tipo de versão (major/minor/patch).
Depois do merge, os pacotes são publicados com o CHANGELOG. Detalhes em
[docs/fluxo-de-atualizacao.md](docs/fluxo-de-atualizacao.md).

## Estrutura

```
figma/
  snapshot/          retrato do Figma na última sincronização (variáveis, estilos, componentes)
  manifest.json      impressões digitais usadas para detectar mudanças
  scripts/           scripts que rodam dentro do Figma (via MCP) para exportar tudo isso
tokens/              @futuredata/tokens — build gera dist/ (CSS, tema Tailwind, JSON DTCG, JS)
shadcn/              registro shadcn — FONTE dos componentes (registry/futuredata/) e public/r/
tailwind/            @futuredata/ui-tailwind — empacota o registro como biblioteca
react/               @futuredata/ui-react — empacota o registro com CSS pronto (classes prefixadas fd:)
playground/          vitrine com todos os componentes, marcas e temas
scripts/             diff do Figma, manifesto, geração de índices
.changeset/          notas de versão de cada sincronização
```

## Comandos

```bash
npm install
npm run build          # tokens + registro shadcn + pacotes react e tailwind
npm run typecheck
npm run playground     # gera playground/dist/index.html (sirva a pasta e abra no navegador)
npm run figma:diff     # o que mudou no Figma em relação ao main
```
