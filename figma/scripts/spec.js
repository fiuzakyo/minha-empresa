// Especificação compacta de componentes para escrever/atualizar o código. Rodar via MCP use_figma.
// Autocontido (NÃO usa lib.js: o serializador daqui é mais enxuto e não entra no hash do inventário).
// Trocar __IDS__ por uma lista de ids de component sets (ex.: ["28:7176"]). Retorno ≤ 46 KB: se vier
// { tooBig }, divida a lista.
//
// Para cada component set:
//   default : variante padrão serializada
//   axes    : o que muda ao trocar UM eixo (ex.: variant=secondary) mantendo os demais no padrão
//   mixed   : o que não é explicado pela soma dos eixos (ex.: hover do secondary usa outra cor)
// Chaves: wh tamanho · xy posição (absoluta) · L auto-layout [dir, pt, pr, pb, pl, gap, main, cross] ·
// sz sizing (F fixed, H hug, F fill) · r raio · f fills · s strokes · sw espessura · sa alinhamento ·
// fx efeito (@estilo) · op opacidade · bv variáveis ligadas · ts estilo de texto · main componente da instância.

const __vars = await figma.variables.getLocalVariablesAsync();
const __varById = {};
for (const v of __vars) __varById[v.id] = v.name;
const __styleName = {};
for (const s of [...(await figma.getLocalEffectStylesAsync()), ...(await figma.getLocalTextStylesAsync())]) __styleName[s.id] = s.name;
const r2 = (n) => (typeof n === 'number' ? Math.round(n * 100) / 100 : n);
const hex = (c, a) => { const h = (x) => Math.round(x * 255).toString(16).padStart(2, '0'); return '#' + h(c.r) + h(c.g) + h(c.b) + (a !== undefined && a < 1 ? h(a) : ''); };
const vname = (alias) => (alias && alias.id ? '$' + (__varById[alias.id] || 'ext') : undefined);
const paint = (p) => { if (!p || p.visible === false) return null; if (p.type === 'SOLID') return vname(p.boundVariables && p.boundVariables.color) || hex(p.color, p.opacity); if (p.type === 'IMAGE') return 'img'; if (p.type && p.type.startsWith('GRADIENT')) return 'grad:' + p.gradientStops.map((s) => vname(s.boundVariables && s.boundVariables.color) || hex(s.color, s.color.a)).join(','); return p.type; };
const paints = (arr) => (Array.isArray(arr) ? arr.map(paint).filter(Boolean) : arr === figma.mixed ? 'mixed' : undefined);
function ser(node, depth = 0, parentAuto = false) {
  const o = { t: node.type[0] + node.type.slice(1, 3).toLowerCase(), n: node.name };
  if (node.visible === false) o.hide = 1;
  if ('width' in node) o.wh = [r2(node.width), r2(node.height)];
  if (depth > 0 && (!parentAuto || node.layoutPositioning === 'ABSOLUTE') && 'x' in node) o.xy = [r2(node.x), r2(node.y)];
  const auto = 'layoutMode' in node && node.layoutMode !== 'NONE';
  if (auto) { o.L = [node.layoutMode[0], node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft, node.itemSpacing, node.primaryAxisAlignItems, node.counterAxisAlignItems].map(r2); if (node.layoutWrap === 'WRAP') o.wrap = 1; }
  if (parentAuto && 'layoutSizingHorizontal' in node) o.sz = node.layoutSizingHorizontal[0] + node.layoutSizingVertical[0];
  if ('cornerRadius' in node) { if (node.cornerRadius === figma.mixed) o.r = [node.topLeftRadius, node.topRightRadius, node.bottomRightRadius, node.bottomLeftRadius]; else if (node.cornerRadius) o.r = node.cornerRadius; }
  if ('fills' in node) { const f = paints(node.fills); if (f && f.length) o.f = f; }
  if ('strokes' in node) { const s = paints(node.strokes); if (s && s.length) { o.s = s; o.sw = node.strokeWeight === figma.mixed ? [node.strokeTopWeight, node.strokeRightWeight, node.strokeBottomWeight, node.strokeLeftWeight] : node.strokeWeight; if (node.strokeAlign !== 'INSIDE') o.sa = node.strokeAlign[0]; if (node.dashPattern && node.dashPattern.length) o.dash = node.dashPattern; } }
  if ('effects' in node && node.effects.length) o.fx = node.effectStyleId && __styleName[node.effectStyleId] ? '@' + __styleName[node.effectStyleId] : node.effects.filter((e) => e.visible !== false).map((e) => [e.type, r2(e.offset && e.offset.x), r2(e.offset && e.offset.y), e.radius, e.spread, vname(e.boundVariables && e.boundVariables.color) || (e.color ? hex(e.color, e.color.a) : '')]);
  if ('opacity' in node && node.opacity < 1) o.op = r2(node.opacity);
  if (node.boundVariables) { const b = {}; for (const [k, v] of Object.entries(node.boundVariables)) if (!['fills', 'strokes', 'effects', 'componentProperties', 'textRangeFills'].includes(k) && !/Radius$|stroke.+Weight$/.test(k)) b[k] = Array.isArray(v) ? v.map(vname) : vname(v); if (node.boundVariables.topLeftRadius) b.radius = vname(node.boundVariables.topLeftRadius); if (Object.keys(b).length) o.bv = b; }
  if (node.type === 'TEXT') { o.txt = node.characters.length > 40 ? node.characters.slice(0, 40) + '…' : node.characters; o.fs = node.fontSize === figma.mixed ? 'mixed' : node.fontSize; if (node.textStyleId && node.textStyleId !== figma.mixed && __styleName[node.textStyleId]) o.ts = __styleName[node.textStyleId]; else o.font = node.fontName === figma.mixed ? 'mixed' : node.fontName.family + ' ' + node.fontName.style; if (node.textAlignHorizontal !== 'LEFT') o.ta = node.textAlignHorizontal[0]; if (node.textDecoration && node.textDecoration !== 'NONE' && node.textDecoration !== figma.mixed) o.td = node.textDecoration[0]; delete o.bv; }
  if (node.type === 'INSTANCE') { o.main = __mainNames.get(node.id); const props = {}; for (const [k, v] of Object.entries(node.componentProperties || {})) if (typeof v.value !== 'string' || !/^\d+:\d+$/.test(v.value)) props[k.split('#')[0]] = v.value; if (Object.keys(props).length) o.props = props; delete o.bv; delete o.L; delete o.f; delete o.s; delete o.sw; delete o.r; delete o.fx; }
  if (node.componentPropertyReferences && Object.keys(node.componentPropertyReferences).length) o.ref = Object.fromEntries(Object.entries(node.componentPropertyReferences).map(([k, v]) => [k, v.split('#')[0]]));
  if ('children' in node && node.type !== 'INSTANCE') o.c = node.children.map((ch) => ser(ch, depth + 1, auto));
  return o;
}
const __mainNames = new Map();
async function prepare(root) { const insts = 'findAllWithCriteria' in root ? root.findAllWithCriteria({ types: ['INSTANCE'] }) : []; for (const i of insts) { const m = await i.getMainComponentAsync(); __mainNames.set(i.id, m ? (m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.name + ' › ' + m.name : m.name) : 'missing'); } }
const IDS = __IDS__;
const KEYS = ['wh', 'xy', 'L', 'sz', 'r', 'f', 's', 'sw', 'sa', 'dash', 'fx', 'op', 'bv', 'font', 'fs', 'ts', 'ta', 'td', 'hide', 'main', 'props', 'txt'];
const flat = (o, path = '', out = { k: {}, n: {} }) => { out.n[path || '/'] = o; for (const k of KEYS) { if (o[k] === undefined) continue; if (k === 'op' && o.bv && o.bv.opacity) continue; if (k === 'bv') { for (const [b, v] of Object.entries(o.bv)) out.k[(path || '') + '.bv:' + b] = JSON.stringify(v); continue; } out.k[(path || '') + '.' + k] = JSON.stringify(o[k]); } if (o.c) { const seen = {}; for (const ch of o.c) { seen[ch.n] = (seen[ch.n] || 0) + 1; flat(ch, path + '/' + ch.n + (seen[ch.n] > 1 ? '#' + seen[ch.n] : ''), out); } } return out; };
const nodeOf = (key) => key.slice(0, key.lastIndexOf('.')) || '/';
const diff = (base, other) => { const d = {}; const goneNodes = Object.keys(base.n).filter((p) => !(p in other.n)); const newNodes = Object.keys(other.n).filter((p) => !(p in base.n)); const under = (p, list) => list.some((g) => p === g || p.startsWith(g + '/')); for (const g of goneNodes) if (!under(g.slice(0, g.lastIndexOf('/')), goneNodes)) d[g] = null; for (const g of newNodes) if (!under(g.slice(0, g.lastIndexOf('/')), newNodes)) d[g] = other.n[g]; for (const k of new Set([...Object.keys(base.k), ...Object.keys(other.k)])) { const n = nodeOf(k); if (under(n, goneNodes) || under(n, newNodes)) continue; if (base.k[k] !== other.k[k]) d[k] = other.k[k] === undefined ? null : JSON.parse(other.k[k]); } return d; };
const parseName = (name) => Object.fromEntries(name.split(',').map((p) => p.split('=').map((s) => s.trim())));
const result = [];
for (const id of IDS) {
  const node = await figma.getNodeByIdAsync(id);
  if (!node) { result.push({ id, missing: true }); continue; }
  await prepare(node);
  const isSet = node.type === 'COMPONENT_SET';
  const variants = isSet ? node.children : [node];
  const def = isSet ? node.defaultVariant || variants[0] : node;
  const defSer = ser(def); const base = flat(defSer);
  const entry = { id, name: node.name, default: defSer };
  if (isSet) {
    const defProps = parseName(def.name); const axes = {}; const singles = {};
    const all = variants.map((v) => ({ v, p: parseName(v.name), f: flat(ser(v)) }));
    for (const { p, f } of all) { const changed = Object.keys(p).filter((k) => p[k] !== defProps[k]); if (changed.length === 1) { const ax = changed[0]; if (!axes[ax]) axes[ax] = {}; axes[ax][p[ax]] = diff(base, f); singles[ax + '=' + p[ax]] = f; } }
    const mixed = {};
    for (const { v, p, f } of all) {
      const changed = Object.keys(p).filter((k) => p[k] !== defProps[k]);
      if (changed.length < 2) continue;
      const pred = { k: { ...base.k }, n: { ...base.n } };
      for (const ax of changed) { const s = singles[ax + '=' + p[ax]]; if (!s) continue; for (const k of new Set([...Object.keys(base.k), ...Object.keys(s.k)])) if (base.k[k] !== s.k[k]) { if (s.k[k] === undefined) delete pred.k[k]; else pred.k[k] = s.k[k]; } for (const n of Object.keys(base.n)) if (!(n in s.n)) delete pred.n[n]; for (const n of Object.keys(s.n)) if (!(n in base.n)) pred.n[n] = s.n[n]; }
      const r = diff(pred, f);
      for (const k of Object.keys(r)) if (k.endsWith('.wh') || k.endsWith('.txt') || k.endsWith('.xy')) { const a = pred.k[k] && JSON.parse(pred.k[k]); if (!k.endsWith('.wh') || (a && r[k] && a[1] === r[k][1])) delete r[k]; }
      if (Object.keys(r).length) mixed[v.name] = r;
    }
    entry.axes = axes; entry.mixed = mixed;
  }
  result.push(entry);
}
const out = JSON.stringify(result);
return out.length > 46000 ? { tooBig: out.length, sizes: result.map(r => [r.name, JSON.stringify(r).length]) } : result;
