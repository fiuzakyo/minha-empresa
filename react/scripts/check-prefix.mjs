#!/usr/bin/env node
// Verificação: nenhuma classe Tailwind usada pelos componentes ficou sem o prefixo "fd:".
// Compara os literais do código gerado com as classes que o Tailwind gera a partir do registro original.
import ts from "typescript"
import { execFileSync } from "node:child_process"
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repo = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const cache = join(repo, ".cache")
mkdirSync(cache, { recursive: true })
writeFileSync(join(cache, "check-in.css"), `@import "tailwindcss";\n@import "tw-animate-css";\n@import "../shadcn/registry/futuredata/styles/futuredata.css";\n@source "../shadcn/registry";\n`)
execFileSync("npx", ["@tailwindcss/cli", "-i", join(cache, "check-in.css"), "-o", join(cache, "check-out.css")], { cwd: repo, stdio: "ignore" })
const css = readFileSync(join(cache, "check-out.css"), "utf8")
const classes = new Set()
for (const m of css.matchAll(/\.((?:\\.|[A-Za-z0-9_-])+)/g)) classes.add(m[1].replace(/\\(.)/g, "$1"))

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
const problems = []
for (const file of walk(join(repo, "react", ".generated")).filter((f) => /\.tsx?$/.test(f))) {
  const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const visit = (n) => {
    const attr = n.parent && ts.isJsxAttribute(n.parent) ? n.parent.name.getText(sf) : null
    if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) && (!attr || /className/.test(attr))) {
      for (const tok of n.text.split(/\s+/)) {
        if (!tok || tok.startsWith("fd:")) continue
        if (classes.has(tok) && /[-:[]/.test(tok)) problems.push(`${file.replace(repo + "/", "")}:${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1}  "${tok}"`)
      }
    }
    ts.forEachChild(n, visit)
  }
  visit(sf)
}
if (problems.length) {
  console.error(`Classes sem prefixo (${problems.length}):\n` + problems.join("\n"))
  process.exit(1)
}
console.log("prefixo ok: todas as classes dos componentes estão prefixadas")
