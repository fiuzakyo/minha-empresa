#!/usr/bin/env node
// Gera playground/dist/index.html com a vitrine de @fiuzakyo/ui-react (rode `npm run build` antes).
import { build } from "esbuild"
import { writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
mkdirSync(join(here, "dist"), { recursive: true })
await build({
  entryPoints: [join(here, "gallery.tsx")],
  bundle: true,
  outfile: join(here, "dist", "gallery.js"),
  format: "esm",
  jsx: "automatic",
  minify: true,
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
})
const fonts = ["Nunito+Sans:wght@200..1000", "Plus+Jakarta+Sans:wght@200..800", "Inter:wght@100..900", "Manrope:wght@200..800", "IBM+Plex+Sans:wght@100..700"]
writeFileSync(
  join(here, "dist", "index.html"),
  `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Voltron · playground</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts.map((f) => "family=" + f).join("&")}&display=swap">
<link rel="stylesheet" href="gallery.css"><style>body{margin:0}</style></head>
<body><div id="root"></div><script type="module" src="gallery.js"></script></body></html>`
)
console.log("playground/dist/index.html")
