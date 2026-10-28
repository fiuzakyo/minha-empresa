#!/usr/bin/env node
/**
 * Gera os artefatos de tokens a partir do snapshot do Figma (figma/snapshot/*.json).
 *
 *   dist/voltron.css         → variáveis CSS (primitivos, marcas, semânticos claro/escuro, shadcn, escalas, sombras, tipografia)
 *   dist/tailwind.css        → tema do Tailwind v4 (@theme inline) apontando para as variáveis acima
 *   dist/tokens.<marca>.<tema>.json → valores resolvidos em formato W3C DTCG (para outras plataformas)
 *   dist/index.js / index.d.ts → os mesmos valores resolvidos em JS/TS
 *
 * Nada aqui é editado à mão: altere o Figma e rode a sincronização.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const snapDir = join(root, 'figma', 'snapshot');
const outDir = join(here, '..', 'dist');
mkdirSync(outDir, { recursive: true });

// ---------------------------------------------------------------------------
// 1. Carrega o snapshot
// ---------------------------------------------------------------------------
const collections = {};
for (const f of readdirSync(snapDir).filter((f) => /^variables\..+\.json$/.test(f))) {
  Object.assign(collections, JSON.parse(readFileSync(join(snapDir, f), 'utf8')));
}
const styles = JSON.parse(readFileSync(join(snapDir, 'styles.json'), 'utf8'));

const C = {
  prim: '_Colors Primitives',
  alpha: '_Alpha Primitives',
  brand: '0 · Brand',
  shadcn: '0 · shadcn Theme',
  semantic: '1 · Semantic Colors',
  spacing: '2 · Spacing',
  radius: '3 · Radius',
  border: '4 · Border',
  opacity: '5 · Opacity',
  type: '6 · Typography',
  grid: '7 · Grid & Breakpoint',
  size: '8 · Size',
};

export const BRANDS = { Whitelabel: 'whitelabel', 'Detetive Auto': 'detetive-auto', Verax: 'verax' };
const THEMES = { Light: 'light', Dark: 'dark' };

const slug = (s) => s.replace(/\//g, '-').replace(/\s+/g, '-').toLowerCase();

/** Nome da variável CSS para cada coleção (segue o codeSyntax definido no Figma). */
const cssName = (collection, name) => {
  switch (collection) {
    case C.prim: return `--vt-color-${slug(name)}`;
    case C.alpha: return `--vt-alpha-${slug(name)}`;
    case C.brand: return `--vt-brand-${slug(name)}`;
    case C.semantic: return `--vt-${slug(name)}`;
    case C.shadcn: return `--${slug(name)}`;
    default: return `--vt-${slug(name)}`; // spacing-*, radius-*, font-size-*, size-* ...
  }
};

const isAlias = (v) => typeof v === 'string' && v.startsWith('@');
const parseAlias = (v) => {
  const s = v.slice(1);
  const col = Object.keys(collections).find((c) => s.startsWith(c + '/'));
  if (!col) throw new Error(`Alias desconhecido: ${v}`);
  return { col, name: s.slice(col.length + 1) };
};

// px para tudo que é dimensão; opacidade vira 0–1; pesos e colunas ficam sem unidade
const formatNumber = (col, name, n) => {
  if (col === C.opacity) return String(n / 100);
  if (/font-weight|columns/.test(name)) return String(n);
  return `${+n.toFixed(2)}px`;
};
const formatString = (name, s) => (/font/.test(name) ? `"${s}", ui-sans-serif, system-ui, sans-serif` : s);

const cssValue = (col, name, type, value) => {
  if (isAlias(value)) {
    const a = parseAlias(value);
    return `var(${cssName(a.col, a.name)})`;
  }
  if (type === 'F') return formatNumber(col, name, value);
  if (type === 'S') return formatString(name, value);
  return value;
};

const decls = (col, modeIndex, filter = () => true) =>
  collections[col].vars
    .filter(([n]) => filter(n))
    .map(([n, t, ...vals]) => `  ${cssName(col, n)}: ${cssValue(col, n, t, vals[modeIndex])};`)
    .join('\n');

// ---------------------------------------------------------------------------
// 2. Sombras (effect styles) e tipografia (text styles)
// ---------------------------------------------------------------------------
const colorRef = (ref) => {
  const col = Object.keys(collections).find((c) => ref.startsWith(c + '/'));
  return `var(${cssName(col, ref.slice(col.length + 1))})`;
};
const elevationName = (n) => `--vt-${slug(n.replace(/\//g, ' '))}`; // Elevation/Brand/shadow-sm → --vt-elevation-brand-shadow-sm
const elevations = styles.effectStyles.map(([n, effects]) => [
  elevationName(n),
  effects.map(([, x, y, blur, spread, ref]) => `${x}px ${y}px ${blur}px ${spread}px ${colorRef(ref)}`).join(', '),
]);

const WEIGHT = { ExtraLight: 'var(--vt-font-weight-light)', Light: 'var(--vt-font-weight-light)', Regular: 'var(--vt-font-weight-regular)', Medium: 'var(--vt-font-weight-medium)', SemiBold: 'var(--vt-font-weight-semibold)', ExtraBold: 'var(--vt-font-weight-bold)', Bold: 'var(--vt-font-weight-bold)' };
const DISPLAY_SIZES = new Set(['3xl', '4xl', '5xl', '6xl']);
const textStyles = styles.textStyles.map(([n, , style, , , ls]) => {
  const cls = n.split('/').pop(); // text-regular-sm
  const size = cls.split('-').pop();
  return {
    cls,
    size,
    css: [
      `font-family: var(${DISPLAY_SIZES.has(size) ? '--vt-font-family-display' : '--vt-font-family-text'})`,
      `font-size: var(--vt-font-size-${size})`,
      `line-height: var(--vt-line-height-${size})`,
      `font-weight: ${WEIGHT[style] ?? 'var(--vt-font-weight-regular)'}`,
      `letter-spacing: ${parseFloat(ls) / 100}em`,
    ],
  };
});

// ---------------------------------------------------------------------------
// 3. voltron.css
// ---------------------------------------------------------------------------
const brandModes = collections[C.brand].modes;
const semModes = collections[C.semantic].modes;

// Tudo que depende de marca/tema precisa ser redeclarado onde a marca ou o tema mudam,
// porque var() é resolvido no elemento onde a propriedade é declarada.
const themed = (modeIndex) =>
  [
    '  /* semânticos */',
    decls(C.semantic, modeIndex),
    '  /* ponte shadcn/ui */',
    decls(C.shadcn, 0),
    '  /* escalas que dependem da marca */',
    decls(C.radius, 0),
    decls(C.size, 0),
    decls(C.type, 0, (n) => /font-family|font-weight\/bold/.test(n)),
    '  /* sombras */',
    elevations.map(([k, v]) => `  ${k}: ${v};`).join('\n'),
  ].join('\n');

const css = `/* Voltron Design System — tokens
 * Gerado automaticamente a partir do Figma. Não edite à mão.
 *
 * Uso:   <html data-brand="whitelabel|detetive-auto|verax" class="dark?">
 *        (também funciona em qualquer subárvore com data-brand / data-theme)
 */

/* ---------- primitivos e escalas fixas ---------- */
:root {
${decls(C.prim, 0)}
${decls(C.alpha, 0)}
${decls(C.spacing, 0)}
${decls(C.border, 0)}
${decls(C.opacity, 0)}
${decls(C.grid, 0)}
${decls(C.type, 0, (n) => !/font-family|font-weight\/bold/.test(n))}
}

/* ---------- marcas ---------- */
${brandModes
  .map(
    (m, i) => `${i === 0 ? ':root, ' : ''}[data-brand="${BRANDS[m]}"] {\n${decls(C.brand, i)}\n}`
  )
  .join('\n\n')}

/* ---------- tema claro ---------- */
:root, [data-brand], [data-theme="light"] {
  color-scheme: light;
${themed(semModes.indexOf('Light'))}
}

/* ---------- tema escuro ---------- */
.dark, [data-theme="dark"], .dark [data-brand], [data-theme="dark"] [data-brand] {
  color-scheme: dark;
${themed(semModes.indexOf('Dark'))}
}

/* ---------- estilos de texto ---------- */
${textStyles.map((t) => `.vt-${t.cls} {\n  ${t.css.join(';\n  ')};\n}`).join('\n')}
`;
writeFileSync(join(outDir, 'voltron.css'), css);

// ---------------------------------------------------------------------------
// 4. tailwind.css (Tailwind v4)
// ---------------------------------------------------------------------------
const shadcnColors = collections[C.shadcn].vars.filter(([, t]) => t === 'C').map(([n]) => n);
const semanticColors = collections[C.semantic].vars.map(([n]) => n);
const radii = collections[C.radius].vars.map(([n]) => n.replace('radius/', ''));
const sizes = collections[C.type].vars.filter(([n]) => n.startsWith('font-size/')).map(([n]) => n.split('/')[1]);
const bps = collections[C.grid].vars.filter(([n]) => n.startsWith('breakpoint/')).map(([n]) => n.split('/')[1]);

const tw = `/* Voltron Design System — tema do Tailwind CSS v4
 * Gerado automaticamente a partir do Figma. Não edite à mão.
 *
 *   @import "tailwindcss";
 *   @import "@voltron/tokens/voltron.css";
 *   @import "@voltron/tokens/tailwind.css";
 */
@custom-variant dark (&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *));

@theme inline {
  /* cores shadcn/ui: bg-primary, text-muted-foreground, border-input ... */
${shadcnColors.map((n) => `  --color-${n}: var(--${n});`).join('\n')}

  /* cores semânticas Voltron: bg-vt-primary-soft, text-vt-text-muted ... */
${semanticColors.map((n) => `  --color-vt-${slug(n)}: var(--vt-${slug(n)});`).join('\n')}

  /* raios: rounded-button, rounded-input, rounded-card, rounded-lg ... */
${radii.map((r) => `  --radius-${r}: var(--vt-radius-${r});`).join('\n')}

  /* tipografia: font-display, font-sans, text-sm ... */
  --font-sans: var(--vt-font-family-text);
  --font-display: var(--vt-font-family-display);
${sizes.map((s) => `  --text-${s}: var(--vt-font-size-${s});\n  --text-${s}--line-height: var(--vt-line-height-${s});`).join('\n')}
  --font-weight-light: var(--vt-font-weight-light);
  --font-weight-normal: var(--vt-font-weight-regular);
  --font-weight-medium: var(--vt-font-weight-medium);
  --font-weight-semibold: var(--vt-font-weight-semibold);
  --font-weight-bold: var(--vt-font-weight-bold);

  /* sombras: shadow-sm, shadow-brand-md, shadow-error-md ... */
${elevations
  .map(([k]) => {
    const n = k.replace('--vt-elevation-', '').replace(/^(brand|error|secondary)-shadow-(.+)$/, '$1-$2').replace(/^shadow-/, '');
    return `  --shadow-${n}: var(${k});`;
  })
  .join('\n')}

  /* alturas de controles: h-button-sm, h-input-md ... */
${collections[C.size].vars.map(([n]) => `  --spacing-${slug(n.replace('size/', ''))}: var(--vt-${slug(n)});`).join('\n')}
}

/* breakpoints precisam de valor literal */
@theme {
${bps.map((b) => `  --breakpoint-${b}: ${collections[C.grid].vars.find(([n]) => n === 'breakpoint/' + b)[2] / 16}rem;`).join('\n')}
}

/* estilos de texto do Figma como utilitários: vt-text-medium-sm, vt-text-bold-2xl ... */
${textStyles.map((t) => `@utility vt-${t.cls} {\n  ${t.css.join(';\n  ')};\n}`).join('\n')}
`;
writeFileSync(join(outDir, 'tailwind.css'), tw);

// Tema para o registro shadcn: tokens + tema Tailwind num arquivo só (sem os .vt-text-* de voltron.css,
// que no Tailwind viram @utility).
const shadcnTheme = css.replace(/\/\* ---------- estilos de texto ---------- \*\/[\s\S]*$/, '') + '\n' + tw.replace(/^\/\*[\s\S]*?\*\/\n/, '');
const shadcnStyles = join(root, 'shadcn', 'registry', 'futuredata', 'styles');
mkdirSync(shadcnStyles, { recursive: true });
writeFileSync(join(shadcnStyles, 'futuredata.css'), `/* Voltron Design System — tema para projetos shadcn/ui. Gerado a partir do Figma; não edite à mão.\n * Importe depois de "tailwindcss" no globals.css. */\n` + shadcnTheme);

// ---------------------------------------------------------------------------
// 5. Valores resolvidos (DTCG + JS)
// ---------------------------------------------------------------------------
const resolve = (col, name, brandIdx, themeIdx, seen = new Set()) => {
  const key = col + '/' + name;
  if (seen.has(key)) throw new Error('Alias circular: ' + key);
  seen.add(key);
  const row = collections[col].vars.find(([n]) => n === name);
  if (!row) throw new Error('Variável não encontrada: ' + key);
  const [, type, ...vals] = row;
  const idx = col === C.brand ? brandIdx : col === C.semantic ? themeIdx : 0;
  const v = vals[idx];
  if (isAlias(v)) {
    const a = parseAlias(v);
    return resolve(a.col, a.name, brandIdx, themeIdx, seen);
  }
  return { type, value: v };
};

const dtcgType = (col, name, type) =>
  type === 'C' ? 'color' : type === 'S' ? 'fontFamily' : /font-weight/.test(name) ? 'fontWeight' : col === C.opacity || /columns/.test(name) ? 'number' : 'dimension';

const index = {};
for (const [brandName, brandSlug] of Object.entries(BRANDS)) {
  const bi = brandModes.indexOf(brandName);
  index[brandSlug] = {};
  for (const [themeName, themeSlug] of Object.entries(THEMES)) {
    const ti = semModes.indexOf(themeName);
    const tree = {};
    const flat = {};
    for (const col of Object.values(C)) {
      if (col === C.prim || col === C.alpha) continue; // já resolvidos pelas camadas de cima
      for (const [name] of collections[col].vars) {
        const { type, value } = resolve(col, name, bi, ti);
        const group = col === C.shadcn ? 'shadcn' : col === C.brand ? 'brand' : col === C.semantic ? 'color' : null;
        const path = [group, ...name.split('/')].filter(Boolean);
        let node = tree;
        for (const p of path.slice(0, -1)) node = node[p] ??= {};
        const out = type === 'F' && dtcgType(col, name, type) === 'dimension' ? `${value}px` : col === C.opacity ? value / 100 : value;
        node[path.at(-1)] = { $type: dtcgType(col, name, type), $value: out };
        flat[path.join('.')] = out;
      }
    }
    writeFileSync(join(outDir, `tokens.${brandSlug}.${themeSlug}.json`), JSON.stringify(tree, null, 2) + '\n');
    index[brandSlug][themeSlug] = flat;
  }
}

writeFileSync(
  join(outDir, 'index.js'),
  `// Gerado automaticamente a partir do Figma. Não edite à mão.\nexport const brands = ${JSON.stringify(Object.values(BRANDS))};\nexport const themes = ${JSON.stringify(Object.values(THEMES))};\nexport const tokens = ${JSON.stringify(index, null, 2)};\nexport default tokens;\n`
);
const keys = Object.keys(index.whitelabel.light);
writeFileSync(
  join(outDir, 'index.d.ts'),
  `// Gerado automaticamente a partir do Figma. Não edite à mão.\nexport type Brand = ${Object.values(BRANDS).map((b) => `'${b}'`).join(' | ')};\nexport type Theme = 'light' | 'dark';\nexport type TokenName =\n${keys.map((k) => `  | '${k}'`).join('\n')};\nexport declare const brands: Brand[];\nexport declare const themes: Theme[];\nexport declare const tokens: Record<Brand, Record<Theme, Record<TokenName, string | number>>>;\nexport default tokens;\n`
);

console.log(`tokens: ${keys.length} tokens × ${Object.keys(BRANDS).length} marcas × 2 temas → ${outDir}`);
