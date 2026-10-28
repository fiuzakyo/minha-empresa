# figma/

Retrato do arquivo [Voltron-Design-System](https://www.figma.com/design/cEmgSJcUBJQR8PdyCqaVWy/Voltron-Design-System)
na última sincronização. É daqui que saem os tokens e é com isto que o diff detecta mudanças.

| Arquivo | Conteúdo |
|---|---|
| `snapshot/variables.*.json` | todas as coleções de variáveis: `[nome, tipo, valor por modo…]`; aliases como `@coleção/variável` |
| `snapshot/styles.json` | estilos de texto e de sombra |
| `snapshot/components.json` | inventário: cada component set com id, key, propriedades, nº de variantes, hash e os arquivos de código que o implementam (`files`) |
| `manifest.json` | data da sincronização, versão e impressões digitais (FNV-1a) — as de variáveis batem com as calculadas dentro do Figma por `scripts/checksums.js` |
| `scripts/*.js` | scripts que rodam no Figma pela ferramenta `use_figma` do MCP (ver `CLAUDE.md`) |
