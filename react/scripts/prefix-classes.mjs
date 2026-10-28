#!/usr/bin/env node
/**
 * Gera o código do pacote @fiuzakyo/ui-react a partir do registro shadcn.
 *
 * O registro (shadcn/registry/futuredata) é a ÚNICA fonte dos componentes. Aqui as classes Tailwind
 * de cada componente ganham o prefixo "fd:" (Tailwind v4 prefix) para que o pacote React possa ser
 * distribuído com um CSS pronto, sem exigir Tailwind no projeto e sem colidir com classes do app.
 *
 * O que é prefixado (somente literais escritos nos componentes):
 *   - className="…" e className={"…"} em JSX
 *   - strings dentro de cn(…) (exceto comparações como size === "xs" e chamadas aninhadas)
 *   - cva(base, { variants: { … }, compoundVariants: [{ className: … }] })
 *   - propriedades `className` e objetos `classNames={{ … }}`
 * Classes vindas do app (prop className) não são tocadas.
 */
import ts from "typescript"
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync, rmSync, copyFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

export const PREFIX = "fd"
const here = dirname(fileURLToPath(import.meta.url))
const repo = join(here, "..", "..")
const srcRoot = join(repo, "shadcn", "registry")
const outRoot = join(repo, "react", ".generated", "registry")

const prefixList = (s) =>
  s
    .split(/(\s+)/)
    .map((tok) => (tok.trim() && !tok.startsWith(`${PREFIX}:`) ? `${PREFIX}:${tok}` : tok))
    .join("")

const isComparison = (node) =>
  ts.isBinaryExpression(node.parent) &&
  [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken].includes(
    node.parent.operatorToken.kind
  )

const calleeName = (call) => (ts.isIdentifier(call.expression) ? call.expression.text : null)

function transformFile(file) {
  const code = readFileSync(file, "utf8")
  const sf = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const edits = [] // [start, end, replacement]

  const prefixLiteral = (lit) => {
    if (ts.isStringLiteral(lit) || ts.isNoSubstitutionTemplateLiteral(lit)) {
      const raw = lit.getText(sf)
      const quote = raw[0]
      edits.push([lit.getStart(sf), lit.getEnd(), quote + prefixList(lit.text) + quote])
    }
  }

  /** Prefixa todas as strings "de classe" dentro de uma expressão (args de cn, valores de cva…). */
  const deep = (node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      if (!isComparison(node)) prefixLiteral(node)
      return
    }
    if (ts.isCallExpression(node)) {
      const name = calleeName(node)
      if (name === "cn") node.arguments.forEach(deep)
      return // outras chamadas (ex.: buttonVariants({ variant: "outline" })) não são classes
    }
    if (ts.isPropertyAssignment(node)) return deep(node.initializer)
    if (ts.isElementAccessExpression(node)) return deep(node.expression)
    ts.forEachChild(node, deep)
  }

  const visitCva = (call) => {
    const [base, config] = call.arguments
    if (base) deep(base)
    if (config && ts.isObjectLiteralExpression(config)) {
      for (const p of config.properties) {
        if (!ts.isPropertyAssignment(p)) continue
        const key = p.name.getText(sf)
        if (key === "variants" && ts.isObjectLiteralExpression(p.initializer)) {
          for (const axis of p.initializer.properties)
            if (ts.isPropertyAssignment(axis) && ts.isObjectLiteralExpression(axis.initializer))
              for (const v of axis.initializer.properties) if (ts.isPropertyAssignment(v)) deep(v.initializer)
        }
        if (key === "compoundVariants" && ts.isArrayLiteralExpression(p.initializer)) {
          for (const obj of p.initializer.elements)
            if (ts.isObjectLiteralExpression(obj))
              for (const q of obj.properties)
                if (ts.isPropertyAssignment(q) && ["className", "class"].includes(q.name.getText(sf))) deep(q.initializer)
        }
      }
    }
  }

  const visit = (node) => {
    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(sf)
      if (name === "className" || name === "containerClassName") {
        if (node.initializer) deep(node.initializer)
        return
      }
      if (name === "classNames" || name === "toastOptions") {
        if (node.initializer) visitClassNamesObject(node.initializer)
        return
      }
    }
    if (ts.isPropertyAssignment(node)) {
      const key = node.name.getText(sf)
      if (key === "className" || key === "imgClassName") return deep(node.initializer)
      if (key === "classNames") return visitClassNamesObject(node.initializer)
    }
    if (ts.isCallExpression(node)) {
      const name = calleeName(node)
      if (name === "cn") return node.arguments.forEach(deep)
      if (name === "cva") return visitCva(node)
    }
    ts.forEachChild(node, visit)
  }

  const visitClassNamesObject = (node) => {
    const walk = (n) => {
      if (ts.isPropertyAssignment(n)) {
        if (n.name.getText(sf) === "classNames") return walk(n.initializer)
        return deep(n.initializer)
      }
      if (ts.isSpreadAssignment(n)) return
      ts.forEachChild(n, walk)
    }
    walk(node)
  }

  visit(sf)
  edits.sort((a, b) => b[0] - a[0])
  let out = code
  for (const [s, e, r] of edits) out = out.slice(0, s) + r + out.slice(e)
  return { out, count: edits.length }
}

const walkDir = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walkDir(p) : [p]
  })

rmSync(join(repo, "react", ".generated"), { recursive: true, force: true })
let total = 0
for (const file of walkDir(srcRoot)) {
  const rel = relative(srcRoot, file)
  const dest = join(outRoot, rel)
  mkdirSync(dirname(dest), { recursive: true })
  if (rel.endsWith(".css")) continue
  if (rel === join("futuredata", "lib", "utils.ts")) {
    writeFileSync(
      dest,
      `import { clsx, type ClassValue } from "clsx"\nimport { extendTailwindMerge } from "tailwind-merge"\n\n// Classes do pacote usam o prefixo "${PREFIX}:" (Tailwind v4); as do app passam intactas.\nconst twMerge = extendTailwindMerge({ prefix: "${PREFIX}" })\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}\n`
    )
    continue
  }
  if (!/\.tsx?$/.test(rel)) {
    copyFileSync(file, dest)
    continue
  }
  const { out, count } = transformFile(file)
  total += count
  writeFileSync(dest, out)
}
console.log(`react: ${total} literais de classe prefixados com "${PREFIX}:"`)
