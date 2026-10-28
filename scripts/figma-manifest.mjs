#!/usr/bin/env node
/**
 * Atualiza figma/manifest.json a partir de figma/snapshot/*.
 * O manifesto é o "recibo" da última sincronização: arquivo do Figma, data, versão do design system
 * e uma impressão digital (FNV-1a, mesmo algoritmo usado dentro do Figma) de cada coleção de
 * variáveis, dos estilos e de cada componente. É com ele que o diff descobre o que mudou.
 *
 *   node scripts/figma-manifest.mjs [--synced-at 2026-10-27]
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repo = join(dirname(fileURLToPath(import.meta.url)), "..")
const snap = join(repo, "figma", "snapshot")
const read = (f) => JSON.parse(readFileSync(join(snap, f), "utf8"))

export const fnv = (s) => {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, "0")
}
const js = (v) => (typeof v === "number" && Number.isInteger(v) ? String(v) : String(v))

/** Mesmo texto canônico usado pelo script de verificação no Figma. */
export const collectionChecksum = (c) => fnv(c.modes.join(",") + "\n" + c.vars.map((r) => r.map(js).join("|")).join("\n"))

const collections = {}
for (const f of readdirSync(snap).filter((f) => /^variables\..+\.json$/.test(f))) Object.assign(collections, read(f))
const styles = read("styles.json")
const { components } = read("components.json")

const args = process.argv.slice(2)
const syncedAt = args.includes("--synced-at") ? args[args.indexOf("--synced-at") + 1] : new Date().toLocaleDateString("sv-SE")
const prev = (() => {
  try {
    return JSON.parse(readFileSync(join(repo, "figma", "manifest.json"), "utf8"))
  } catch {
    return {}
  }
})()

const manifest = {
  figma: {
    fileKey: "cEmgSJcUBJQR8PdyCqaVWy",
    fileName: "Voltron-Design-System",
    url: "https://www.figma.com/design/cEmgSJcUBJQR8PdyCqaVWy/Voltron-Design-System",
  },
  syncedAt,
  version: JSON.parse(readFileSync(join(repo, "tokens", "package.json"), "utf8")).version,
  checksums: {
    variables: Object.fromEntries(Object.entries(collections).map(([k, c]) => [k, collectionChecksum(c)]).sort()),
    textStyles: fnv(JSON.stringify(styles.textStyles)),
    effectStyles: fnv(JSON.stringify(styles.effectStyles)),
    components: Object.fromEntries(Object.entries(components).map(([k, c]) => [k, c.hash]).sort()),
  },
  counts: {
    variables: Object.values(collections).reduce((n, c) => n + c.vars.length, 0),
    textStyles: styles.textStyles.length,
    effectStyles: styles.effectStyles.length,
    components: Object.keys(components).length,
  },
}
if (prev.syncedAt && JSON.stringify({ ...prev, syncedAt: 0 }) === JSON.stringify({ ...manifest, syncedAt: 0 })) {
  console.log("figma/manifest.json: sem mudanças")
} else {
  writeFileSync(join(repo, "figma", "manifest.json"), JSON.stringify(manifest, null, 2) + "\n")
  console.log(`figma/manifest.json: ${manifest.counts.components} componentes, ${manifest.counts.variables} variáveis`)
}
