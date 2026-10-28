# Changesets

Cada sincronização com o Figma gera aqui um arquivo `figma-sync-<data>.md` (via `npm run figma:diff -- --changeset`)
com o tipo de versão (major/minor/patch) e a lista do que mudou. Ao fazer o merge no `main`, o workflow de release
transforma esses arquivos em novas versões dos pacotes e no CHANGELOG de cada um.
