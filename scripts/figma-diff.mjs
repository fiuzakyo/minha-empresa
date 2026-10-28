#!/usr/bin/env node
/**
 * Compara o snapshot atual do Figma (figma/snapshot/) com o de outra versão do repositório
 * e diz exatamente o que mudou para o time de desenvolvimento.
 *
 *   node scripts/figma-diff.mjs                 # compara com origin/main
 *   node scripts/figma-diff.mjs --base v1.2.0   # compara com uma tag/commit
 *   node scripts/figma-diff.mjs --changeset     # também grava .changeset/figma-sync-<data>.md
 *   node scripts/figma-diff.mjs --json          # saída em JSON (para automações)
 *
 * Regras de versão (semver):
 *   major → componente removido, propriedade/opção de variante removida, token removido
 *   minor → componente, propriedade, opção ou token novo
 *   patch → só valores visuais mudaram (cores, espaçamentos, raios, estados…)
 */
import { execFileSync } from "node:child_process"
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repo = join(dirname(fileURLToPath(import.meta.url)), "..")
const args = process.argv.slice(2)
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "origin/main"

const readCurrent = (f) => JSON.parse(readFileSync(join(repo, "figma", "snapshot", f), "utf8"))
const readBase = (f) => {
  try {
    return JSON.parse(execFileSync("git", ["show", `${base}:figma/snapshot/${f}`], { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }))
  } catch {
    return null
  }
}
const varFiles = readdirSync(join(repo, "figma", "snapshot")).filter((f) => /^variables\..+\.json$/.test(f))
const merge = (reader) => varFiles.reduce((acc, f) => Object.assign(acc, reader(f) ?? {}), {})

const cur = { vars: merge(readCurrent), styles: readCurrent("styles.json"), comps: readCurrent("components.json").components }
const old = { vars: merge(readBase), styles: readBase("styles.json") ?? { textStyles: [], effectStyles: [] }, comps: readBase("components.json")?.components ?? {} }
const firstSync = Object.keys(old.comps).length === 0

let bump = "none"
const raise = (level) => {
  const order = ["none", "patch", "minor", "major"]
  if (order.indexOf(level) > order.indexOf(bump)) bump = level
}

/* ---------------- tokens ---------------- */
const tokenChanges = []
for (const col of new Set([...Object.keys(old.vars), ...Object.keys(cur.vars)])) {
  const a = old.vars[col], b = cur.vars[col]
  const am = new Map((a?.vars ?? []).map((r) => [r[0], r])), bm = new Map((b?.vars ?? []).map((r) => [r[0], r]))
  for (const [name, r] of bm) {
    if (!am.has(name)) tokenChanges.push({ kind: "added", col, name, to: r.slice(2) }), raise("minor")
    else if (JSON.stringify(am.get(name)) !== JSON.stringify(r)) tokenChanges.push({ kind: "changed", col, name, from: am.get(name).slice(2), to: r.slice(2), modes: b.modes }), raise("patch")
  }
  for (const [name, r] of am) if (!bm.has(name)) tokenChanges.push({ kind: "removed", col, name, from: r.slice(2) }), raise("major")
}
const styleChanges = []
for (const key of ["textStyles", "effectStyles"]) {
  const am = new Map(old.styles[key].map((r) => [r[0], r])), bm = new Map(cur.styles[key].map((r) => [r[0], r]))
  for (const [n, r] of bm) {
    if (!am.has(n)) styleChanges.push({ kind: "added", key, name: n }), raise("minor")
    else if (JSON.stringify(am.get(n)) !== JSON.stringify(r)) styleChanges.push({ kind: "changed", key, name: n }), raise("patch")
  }
  for (const n of am.keys()) if (!bm.has(n)) styleChanges.push({ kind: "removed", key, name: n }), raise("major")
}

/* -------------- componentes -------------- */
const compChanges = []
const byId = (comps) => new Map(Object.entries(comps).map(([slug, c]) => [c.figmaId, { slug, ...c }]))
const oa = byId(old.comps), ob = byId(cur.comps)
for (const [id, c] of ob) {
  const p = oa.get(id)
  if (!p) {
    compChanges.push({ kind: "added", name: c.name, files: c.files }), raise("minor")
    continue
  }
  const details = []
  if (p.name !== c.name) details.push(`renomeado de "${p.name}"`)
  for (const [prop, def] of Object.entries(c.props)) {
    const was = p.props[prop]
    if (was === undefined) details.push(`+ propriedade \`${prop}\``), raise("minor")
    else if (Array.isArray(def) && Array.isArray(was)) {
      const added = def.filter((o) => !was.includes(o)), removed = was.filter((o) => !def.includes(o))
      if (added.length) details.push(`\`${prop}\`: + ${added.join(", ")}`), raise("minor")
      if (removed.length) details.push(`\`${prop}\`: − ${removed.join(", ")} (quebra)`), raise("major")
    } else if (JSON.stringify(def) !== JSON.stringify(was)) details.push(`\`${prop}\`: ${was} → ${def}`), raise("patch")
  }
  for (const prop of Object.keys(p.props)) if (!(prop in c.props)) details.push(`− propriedade \`${prop}\` (quebra)`), raise("major")
  if (p.hash !== c.hash && !details.length) details.push("ajuste visual (estilos, espaçamentos ou estados)"), raise("patch")
  if (details.length || p.hash !== c.hash) compChanges.push({ kind: "changed", name: c.name, files: c.files, details })
}
for (const [id, p] of oa) if (!ob.has(id)) compChanges.push({ kind: "removed", name: p.name, files: p.files }), raise("major")

/* ---------------- saída ---------------- */
const summary = { base, firstSync, bump, tokens: tokenChanges, styles: styleChanges, components: compChanges }
if (args.includes("--json")) {
  console.log(JSON.stringify(summary, null, 2))
  process.exit(0)
}

const fmtVal = (v) => (Array.isArray(v) ? v.map((x) => `\`${x}\``).join(" / ") : `\`${v}\``)
const lines = []
if (firstSync) {
  lines.push(`Primeira carga: ${Object.keys(cur.comps).length} componentes e ${Object.values(cur.vars).reduce((n, c) => n + c.vars.length, 0)} variáveis.`)
} else if (bump === "none") {
  lines.push("Nada mudou no Figma desde a última sincronização.")
} else {
  lines.push(`**Versão sugerida: ${bump}** (comparado com \`${base}\`)`, "")
  const group = (title, list, render) => list.length && lines.push(`### ${title}`, ...list.map(render), "")
  group("Componentes novos", compChanges.filter((c) => c.kind === "added"), (c) => `- **${c.name}** → ${c.files.map((f) => `\`${f}\``).join(", ")}`)
  group("Componentes alterados", compChanges.filter((c) => c.kind === "changed"), (c) => `- **${c.name}** (${c.files.map((f) => `\`${f}\``).join(", ")}): ${c.details.join("; ")}`)
  group("Componentes removidos (quebra)", compChanges.filter((c) => c.kind === "removed"), (c) => `- **${c.name}** → ${c.files.map((f) => `\`${f}\``).join(", ")}`)
  group("Tokens", tokenChanges, (t) =>
    t.kind === "changed"
      ? `- ✏️ \`${t.col} / ${t.name}\`: ${fmtVal(t.from)} → ${fmtVal(t.to)}`
      : t.kind === "added"
        ? `- ➕ \`${t.col} / ${t.name}\` = ${fmtVal(t.to)}`
        : `- ➖ \`${t.col} / ${t.name}\` (quebra)`
  )
  group("Estilos de texto e sombra", styleChanges, (s) => `- ${s.kind === "added" ? "➕" : s.kind === "removed" ? "➖" : "✏️"} ${s.name}`)
}
const report = lines.join("\n")
console.log(report)

if (args.includes("--changeset") && bump !== "none") {
  const level = firstSync ? "major" : bump
  const touchesTokens = firstSync || tokenChanges.length || styleChanges.length
  const pkgs = [touchesTokens && "@futuredata/tokens", "@futuredata/ui-react", "@futuredata/ui-tailwind"].filter(Boolean)
  const date = new Date().toLocaleDateString("sv-SE")
  mkdirSync(join(repo, ".changeset"), { recursive: true })
  const file = join(repo, ".changeset", `figma-sync-${date}.md`)
  writeFileSync(file, `---\n${pkgs.map((p) => `"${p}": ${level}`).join("\n")}\n---\n\nSincronização com o Figma (${date}).\n\n${report}\n`)
  console.error(`\n→ ${file.replace(repo + "/", "")}`)
}
