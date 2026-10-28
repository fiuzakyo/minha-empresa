# Fluxo de atualização Figma → código

## Visão geral

```
Figma (design)  ──►  sincronização  ──►  Pull Request  ──►  merge  ──►  release dos pacotes
                    (Claude via MCP)     só o diff          (time)      (GitHub Actions)
```

1. **Design muda no Figma.** Componentes criados, alterados ou removidos; variáveis e estilos ajustados.
2. **Sincronização.** O Claude lê o arquivo do Figma pelo MCP e atualiza `figma/snapshot/`:
   variáveis (`variables.*.json`), estilos (`styles.json`) e o inventário de componentes
   (`components.json`, com uma impressão digital de cada component set).
3. **Diff.** `npm run figma:diff -- --changeset` compara o snapshot novo com o do `main` e lista:
   - componentes novos, alterados (com o detalhe: propriedade nova, opção removida, ajuste visual) e removidos;
   - tokens adicionados, alterados (valor antigo → novo, por marca/tema) e removidos;
   - o tipo de versão sugerido.
4. **Código.** Só os arquivos dos componentes que mudaram são regenerados em `shadcn/registry/futuredata/`
   (o mapa componente do Figma → arquivo está em `components.json`, campo `files`). Os pacotes `react/` e
   `tailwind/` são reconstruídos a partir dessa mesma fonte, então não há três versões para manter.
5. **Pull Request** em `figma-sync/<data>` com o relatório do diff na descrição. O CI confere tipos, build e
   se os arquivos gerados estão em dia.
6. **Merge.** O workflow de release abre o PR "Version Packages" (changesets). Ao fazer merge dele, as versões
   sobem, o CHANGELOG é escrito e os pacotes são publicados.

## O que o time de desenvolvimento recebe

- **No PR:** o resumo do que mudou e o diff de código apenas dos arquivos afetados.
- **No CHANGELOG de cada pacote:** a mesma lista, por versão.
- **No registro shadcn:** `npx shadcn add @futuredata/<componente>` traz a versão nova do arquivo
  (o shadcn mostra o diff antes de sobrescrever).

## Regras de versão

| Mudança no Figma | Versão |
|---|---|
| Componente removido · propriedade removida · opção de variante removida · token removido | **major** |
| Componente novo · propriedade nova · opção de variante nova · token novo | **minor** |
| Ajuste visual (cor, espaçamento, raio, estado) · valor de token alterado | **patch** |

## Exclusão de componentes

Remover direto quebra telas em produção. O caminho é:

1. Marcar como depreciado no Figma (descrição começando com `Depreciado:`) — o código recebe `@deprecated`
   e um aviso no console em desenvolvimento, numa versão **minor**.
2. Remover na próxima **major**, com a indicação do substituto no CHANGELOG.

## Renomear no Figma

O inventário identifica cada componente pelo id do nó no Figma, não pelo nome. Renomear aparece como
"renomeado de …" e não como remover + criar. Se o nome do componente em código mudar, o nome antigo fica
exportado como alias depreciado até a próxima major.

## Cobertura e limites

- **Ícones:** os ~1.500 ícones do Figma são a biblioteca Phosphor; o código usa `@phosphor-icons/react` em vez de
  exportar SVGs.
- **Assets** (logos das marcas, bandeiras, bandeiras de cartão) e as páginas de equipe (Whitelabel, Detetive Auto,
  Verax) ainda não são sincronizados — entram quando houver necessidade no código.
- **Calendário:** segue o componente do shadcn (react-day-picker v9) com o visual do `Calendar / Day`.
