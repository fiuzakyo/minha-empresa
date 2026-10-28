#!/usr/bin/env node
// Publica os pacotes @fiuzakyo/* no GitHub Packages com changesets.
// No GitHub Actions o token é o GITHUB_TOKEN do próprio workflow (permissão packages: write).
import { execSync } from "node:child_process"

if (!process.env.NODE_AUTH_TOKEN) {
  console.log("NODE_AUTH_TOKEN ausente: versões e CHANGELOG atualizados, publicação pulada.")
  process.exit(0)
}
execSync("npx changeset publish", { stdio: "inherit" })
