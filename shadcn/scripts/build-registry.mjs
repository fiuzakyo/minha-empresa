#!/usr/bin/env node
/**
 * Gera shadcn/registry.json a partir dos arquivos em registry/futuredata/.
 * As dependências são lidas dos próprios imports:
 *   - pacotes npm               → "dependencies"
 *   - @/registry/futuredata/... → "registryDependencies" (@futuredata/<nome>)
 * Depois, `shadcn build` transforma o registry.json em public/r/<nome>.json.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative, basename } from "node:path"
import { fileURLToPath } from "node:url"

const pkg = join(dirname(fileURLToPath(import.meta.url)), "..")
const base = join(pkg, "registry", "futuredata")
const repo = join(pkg, "..")
const manifest = JSON.parse(readFileSync(join(repo, "figma", "snapshot", "components.json"), "utf8"))
const ownPkg = JSON.parse(readFileSync(join(pkg, "package.json"), "utf8"))
const versions = ownPkg.dependencies

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
const itemName = (file) => basename(file).replace(/\.tsx?$/, "")

// Figma → código: descrição de cada arquivo a partir dos componentes do Figma que ele implementa
const figmaByFile = {}
for (const c of Object.values(manifest.components)) {
  for (const f of c.files ?? []) (figmaByFile[f] ??= []).push(c.name)
}

const items = []
for (const file of walk(base).filter((f) => /\.tsx?$/.test(f) && !f.includes(`${join("futuredata", "lib")}`))) {
  const rel = relative(pkg, file).replace(/\\/g, "/")
  const code = readFileSync(file, "utf8")
  const imports = [...code.matchAll(/from "([^"]+)"/g)].map((m) => m[1])
  const npm = [...new Set(imports.filter((i) => !i.startsWith(".") && !i.startsWith("@/") && i !== "react").map((i) => (i.startsWith("@") ? i.split("/").slice(0, 2).join("/") : i.split("/")[0])))]
  const regDeps = [...new Set(imports.filter((i) => i.startsWith("@/registry/futuredata/")).map((i) => `@futuredata/${basename(i)}`))]
  const isUi = rel.includes("/ui/")
  const target = isUi ? undefined : rel.replace("registry/futuredata/", "")
  const figma = figmaByFile[rel.replace("registry/futuredata/", "")] ?? []
  const docMatch = code.match(/\/\*\*\s*\n\s*\*\s*([^\n]+)/)
  items.push({
    name: itemName(file),
    type: isUi ? "registry:ui" : "registry:component",
    title: docMatch ? docMatch[1].split(" — ")[0].trim() : itemName(file),
    description: figma.length ? `Figma: ${figma.join(", ")}` : undefined,
    dependencies: npm.map((n) => (versions[n] ? `${n}@${versions[n]}` : n)),
    registryDependencies: ["@futuredata/theme", ...regDeps],
    files: [{ path: rel, type: isUi ? "registry:ui" : "registry:component", ...(target ? { target } : {}) }],
  })
}
items.sort((a, b) => a.name.localeCompare(b.name))

const theme = {
  name: "theme",
  type: "registry:file",
  title: "Tema Voltron",
  description: "Tokens de todas as marcas (Whitelabel, Detetive Auto, Verax), claro/escuro, ponte shadcn e tema do Tailwind v4. Importe styles/futuredata.css no globals.css.",
  dependencies: ["tw-animate-css"],
  files: [{ path: "registry/futuredata/styles/futuredata.css", type: "registry:file", target: "styles/futuredata.css" }],
}
const all = {
  name: "all",
  type: "registry:block",
  title: "Voltron completo",
  description: "Instala o tema e todos os componentes do Voltron Design System.",
  registryDependencies: ["@futuredata/theme", ...items.map((i) => `@futuredata/${i.name}`)],
  files: [],
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "futuredata",
  homepage: "https://github.com/fiuzakyo/minha-empresa",
  items: [theme, ...items, all],
}
writeFileSync(join(pkg, "registry.json"), JSON.stringify(registry, null, 2) + "\n")
console.log(`registry.json: ${items.length} componentes + theme + all`)
