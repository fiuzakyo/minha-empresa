#!/usr/bin/env node
// Publica os pacotes com changesets — só se houver token do registro npm configurado.
import { execSync } from "node:child_process"

if (!process.env.NPM_TOKEN && !process.env.NODE_AUTH_TOKEN) {
  console.log("NPM_TOKEN não configurado: versões e CHANGELOG atualizados, publicação no npm pulada.")
  process.exit(0)
}
execSync("npx changeset publish", { stdio: "inherit" })
