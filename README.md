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
| [`tailwind/`](tailwind/README.md) | `@fiuzakyo/ui-tailwind` | projetos **React + Tailwind v4** que preferem uma dependência | `npm i @fiuzakyo/ui-tailwind` |
| [`react/`](react/README.md) | `@fiuzakyo/ui-react` | projetos **React sem Tailwind** | `npm i @fiuzakyo/ui-react` + 1 arquivo CSS |
| [`tokens/`](tokens/README.md) | `@fiuzakyo/tokens` | qualquer stack (CSS, JS, outras plataformas) | `npm i @fiuzakyo/tokens` |

Os três pacotes de componentes têm **a mesma API** (mesmos nomes, props e variantes), então trocar de um para outro
é só trocar o import.

## Instalando os pacotes (GitHub Packages)

Os pacotes `@fiuzakyo/*` são publicados no GitHub Packages. O npm precisa saber onde buscar esse escopo e,
mesmo com o repositório público, o GitHub exige um token para instalar.

1. Crie um token em GitHub → Settings → Developer settings → **Personal access tokens (classic)** com o escopo
   `read:packages`.
2. No projeto que vai consumir, crie um `.npmrc`:

   ```ini
   @fiuzakyo:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
   ```

3. Exporte o token (`export GITHUB_PACKAGES_TOKEN=ghp_…`) e instale normalmente: `npm i @fiuzakyo/ui-react`.

No CI do projeto consumidor, use o mesmo `.npmrc` com o token num secret. Em repositórios do GitHub Actions dá para
usar o próprio `GITHUB_TOKEN`: na página do pacote, em *Package settings → Manage Actions access*, adicione o
repositório consumidor.

O registro shadcn não passa por aqui: ele é lido direto do GitHub (veja [`shadcn/`](shadcn/README.md)).

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
tokens/              @fiuzakyo/tokens — build gera dist/ (CSS, tema Tailwind, JSON DTCG, JS)
shadcn/              registro shadcn — FONTE dos componentes (registry/futuredata/) e public/r/
tailwind/            @fiuzakyo/ui-tailwind — empacota o registro como biblioteca
react/               @fiuzakyo/ui-react — empacota o registro com CSS pronto (classes prefixadas fd:)
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
