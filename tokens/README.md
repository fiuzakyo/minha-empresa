# `@fiuzakyo/tokens`

Tokens do Voltron gerados das variáveis do Figma (12 coleções, 640 variáveis), com 3 marcas e 2 temas.

| Arquivo | Uso |
|---|---|
| `voltron.css` | variáveis CSS: primitivos (`--vt-color-*`), marca (`--vt-brand-*`), semânticos (`--vt-primary-base`, `--vt-text-muted`…), ponte shadcn (`--primary`, `--background`…), escalas (`--vt-spacing-*`, `--vt-radius-*`, `--vt-size-*`), sombras (`--vt-elevation-*`) e classes de texto (`.vt-text-medium-sm`…) |
| `tailwind.css` | tema do Tailwind v4 (`@theme inline`) apontando para as variáveis acima |
| `json/tokens.<marca>.<tema>.json` | valores resolvidos em formato W3C DTCG (outras plataformas, apps nativos) |
| `index.js` / `index.d.ts` | os mesmos valores em JS/TS: `tokens.verax.dark["color.primary.base"]` |

## Instalação

> Os pacotes ficam no GitHub Packages: configure o `.npmrc` uma vez, como no [README da raiz](../README.md#instalando-os-pacotes-github-packages).

```bash
npm i @fiuzakyo/tokens
```

## Marca e tema

```html
<html data-brand="detetive-auto" class="dark">
```

- `data-brand`: `whitelabel` (padrão) · `detetive-auto` · `verax`
- tema escuro: classe `.dark` ou `data-theme="dark"`
- Os dois funcionam em qualquer subárvore (ex.: um card com `data-brand="verax"` dentro de uma página Whitelabel).

## Camadas (como no Figma)

```
_Colors Primitives / _Alpha Primitives   cores cruas de cada marca
0 · Brand          (3 modos: marca)       primary/secondary/… 50–950, raios, alturas e fontes da marca
1 · Semantic Colors (2 modos: tema)       primary/base, text/muted, surface/elevated, focus/ring…
0 · shadcn Theme                          --primary, --card, --border… apontando para os semânticos
2–8                                       espaçamento, raios, bordas, opacidade, tipografia, grid, tamanhos
```

`dist/` é gerado por `npm run build` a partir de `../figma/snapshot/` — não edite à mão.
