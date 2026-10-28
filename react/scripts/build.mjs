#!/usr/bin/env node
// Build do @fiuzakyo/ui-react:
// 1. gera .generated/ com as classes prefixadas  2. confere o prefixo  3. index  4. JS + tipos  5. CSS
import { execFileSync } from "node:child_process"
import { mkdirSync, rmSync, statSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const pkg = join(dirname(fileURLToPath(import.meta.url)), "..")
const repo = join(pkg, "..")
const run = (cmd, args, cwd = pkg) => execFileSync(cmd, args, { cwd, stdio: "inherit" })

run("node", ["scripts/prefix-classes.mjs"])
run("node", ["scripts/check-prefix.mjs"])
run("node", ["scripts/gen-index.mjs", "react/.generated/index.ts", "./registry/futuredata"], repo)
rmSync(join(pkg, "dist"), { recursive: true, force: true })
mkdirSync(join(pkg, "dist"), { recursive: true })
run("npx", ["tsup"])
run("npx", ["@tailwindcss/cli", "-i", "src/styles.css", "-o", "dist/styles.css", "--minify"])
console.log(`dist/styles.css: ${(statSync(join(pkg, "dist/styles.css")).size / 1024).toFixed(1)} KB`)
