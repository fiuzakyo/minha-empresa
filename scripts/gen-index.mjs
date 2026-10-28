#!/usr/bin/env node
// Gera o index.ts de um pacote reexportando todos os componentes do registro shadcn.
// Uso: node scripts/gen-index.mjs <destino> [base-de-import]
import { readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const [, , outArg, baseArg] = process.argv
const out = join(root, outArg)
const src = join(root, "shadcn", "registry", "futuredata")
const base = baseArg ?? relative(dirname(out), src).replace(/\\/g, "/")

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(f) ? [p] : []
  })

const files = ["ui", "components"].flatMap((d) => walk(join(src, d))).sort()
const lines = files.map((f) => `export * from "${base}/${relative(src, f).replace(/\\/g, "/").replace(/\.tsx?$/, "")}"`)
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, `// Gerado por scripts/gen-index.mjs — não edite.\nexport { cn } from "${base}/lib/utils"\n${lines.join("\n")}\n`)
console.log(`${outArg}: ${files.length} módulos`)
