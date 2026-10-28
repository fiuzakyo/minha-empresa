# Instruções para o Claude — sincronização Figma → código

Este repositório é mantido a partir do Figma **Voltron-Design-System** (fileKey `cEmgSJcUBJQR8PdyCqaVWy`).
Quando pedirem para "sincronizar", "publicar a nova versão" ou "atualizar com o Figma", siga este roteiro.
Responda ao usuário em português.

## Princípios

- O Figma é a fonte do design. `shadcn/registry/futuredata/` é a ÚNICA fonte de código dos componentes;
  `react/` e `tailwind/` são builds dela. Nunca edite `react/.generated/`, `tokens/dist/`, `shadcn/public/r/`,
  `shadcn/registry.json` nem `shadcn/registry/futuredata/styles/` à mão.
- Cada sincronização = 1 branch `figma-sync/<AAAA-MM-DD>` + 1 PR contendo **só** o que mudou.
- Não mude a API de um componente sem que o Figma tenha mudado (props/variantes vêm das propriedades do Figma).

## Roteiro

1. **Sessão Figma:** `create_session` com o fileKey. Carregue a skill `figma-use` antes de `use_figma`.
2. **Variáveis:** rode `figma/scripts/checksums.js` e compare com `figma/manifest.json → checksums.variables`.
   Para cada coleção diferente (ou nova — veja `__allCollections`), rode `figma/scripts/export-variables.js`
   com o grupo correspondente e regrave o `figma/snapshot/variables.<grupo>.json` (só o retorno, mesmo formato).
   Rode `figma/scripts/export-styles.js` e regrave `figma/snapshot/styles.json` se mudou.
3. **Componentes:** rode `figma/scripts/inventory.js` (com `lib.js` colado no topo) em paralelo para as páginas
   `1:2` (Atoms), `1:3` (Molecules) e `1:4` (Organisms). Atualize `figma/snapshot/components.json`:
   mesmo slug, `hash`, `props`, `variants`, `name`; componentes novos ganham slug e `files` (o caminho vem da
   descrição do componente no Figma: "Código: @futuredata/ui · components/ui/x.tsx" → `ui/x.tsx`).
4. **Diff:** `npm run figma:diff`. Se não mudou nada, avise e pare.
5. **Spec dos componentes alterados/novos:** `figma/scripts/spec.js` com os ids (divida se vier `tooBig`) e leia
   a descrição do component set. Atualize os arquivos de `files` em `shadcn/registry/futuredata/`, seguindo as
   convenções abaixo. Componente removido: siga a política de depreciação em `docs/fluxo-de-atualizacao.md`.
6. **Build e verificação:** `npm run figma:manifest`, `npm run typecheck`, `npm run build`, `npm run playground`
   e um screenshot do playground (marcas whitelabel/verax, claro/escuro) dos componentes afetados.
7. **Changeset:** `npm run figma:diff -- --changeset` (grava `.changeset/figma-sync-<data>.md`).
8. **Commit e PR:** commit em `figma-sync/<data>`, push e PR para `main` com o relatório do diff na descrição.

## Convenções de código

- Tailwind v4 com tokens: cores shadcn (`bg-primary`, `text-muted-foreground`), semânticas Voltron
  (`bg-vt-primary-soft`, `text-vt-text-secondary` = variável `primary/soft`, `text/secondary`), raios
  `rounded-{button,input,card,alert,media,control,sm,md,lg,xl,2xl,full}`, alturas `h-button-*`, `h-input-*`,
  sombras `shadow-{xs,sm,md,lg}` e `shadow-{brand,secondary,error}-md`, texto `vt-text-<peso>-<tamanho>`.
- Mapeamento Figma → classe: `$primary/strong` → `vt-primary-strong`; `$primary` → `primary`;
  `@Elevation/Brand/shadow-md` → `shadow-brand-md`; `$radius/button` → `rounded-button`; `$spacing/3` → `3`.
- Estados do Figma viram estados CSS (`hover:`, `focus-visible:`, `disabled:`, `aria-invalid:`, `data-[state=…]:`),
  nunca props. Variantes viram props com `cva`, em kebab/minúsculas.
- Toda string de classe precisa passar por `className=`, `cn(...)` ou `cva(...)` (o build do pacote React prefixa
  apenas essas). Constantes de classe: `const x = cn("…")`.
- Ícones: `@phosphor-icons/react`, nomes com sufixo `Icon`. Ícone ao lado de texto em Button: `data-icon="inline-start|inline-end"`.
- Comentário JSDoc no topo de cada arquivo: nome, caminho no Figma e mapeamento de props. Não use `*/` dentro dele.
