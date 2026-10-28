// Biblioteca do INVENTÁRIO (inventory.js cola este arquivo no topo antes de rodar via MCP use_figma).
// ATENÇÃO: o hash de cada componente em figma/snapshot/components.json é calculado com este serializador.
// Não altere a saída de ser() sem regerar o inventário inteiro — senão todos os componentes aparecem como "alterados".
// com variáveis e estilos referenciados pelo NOME (não pelo id interno).

const __cols = await figma.variables.getLocalVariableCollectionsAsync();
const __vars = await figma.variables.getLocalVariablesAsync();
const __varById = {};
for (const v of __vars) __varById[v.id] = v.name;
const __styleName = {};
for (const s of [...(await figma.getLocalEffectStylesAsync()), ...(await figma.getLocalTextStylesAsync())]) __styleName[s.id] = s.name;

const r2 = (n) => (typeof n === 'number' ? Math.round(n * 100) / 100 : n);
const hex = (c, a) => {
  const h = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return '#' + h(c.r) + h(c.g) + h(c.b) + (a !== undefined && a < 1 ? h(a) : '');
};
const vname = (alias) => (alias && alias.id ? '$' + (__varById[alias.id] || 'ext') : undefined);

const paint = (p) => {
  if (!p || p.visible === false) return null;
  if (p.type === 'SOLID') return vname(p.boundVariables && p.boundVariables.color) || hex(p.color, p.opacity);
  if (p.type === 'IMAGE') return 'img';
  if (p.type && p.type.startsWith('GRADIENT')) return 'grad:' + p.gradientStops.map((s) => vname(s.boundVariables && s.boundVariables.color) || hex(s.color, s.color.a)).join(',');
  return p.type;
};
const paints = (arr) => (Array.isArray(arr) ? arr.map(paint).filter(Boolean) : arr === figma.mixed ? 'mixed' : undefined);

function ser(node, depth = 0, parentAuto = false) {
  const o = { t: node.type[0] + node.type.slice(1, 3).toLowerCase(), n: node.name };
  if (node.visible === false) o.hide = 1;
  if ('width' in node) o.wh = [r2(node.width), r2(node.height)];
  if (depth > 0 && !parentAuto && 'x' in node) o.xy = [r2(node.x), r2(node.y)];
  const auto = 'layoutMode' in node && node.layoutMode !== 'NONE';
  if (auto) {
    o.L = [node.layoutMode[0], node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft, node.itemSpacing, node.primaryAxisAlignItems, node.counterAxisAlignItems].map(r2);
    if (node.layoutWrap === 'WRAP') o.wrap = 1;
  }
  if (parentAuto && 'layoutSizingHorizontal' in node) o.sz = node.layoutSizingHorizontal[0] + node.layoutSizingVertical[0];
  if ('cornerRadius' in node) {
    if (node.cornerRadius === figma.mixed) o.r = [node.topLeftRadius, node.topRightRadius, node.bottomRightRadius, node.bottomLeftRadius];
    else if (node.cornerRadius) o.r = node.cornerRadius;
  }
  if ('fills' in node) { const f = paints(node.fills); if (f && f.length) o.f = f; }
  if ('strokes' in node) {
    const s = paints(node.strokes);
    if (s && s.length) { o.s = s; o.sw = node.strokeWeight === figma.mixed ? [node.strokeTopWeight, node.strokeRightWeight, node.strokeBottomWeight, node.strokeLeftWeight] : node.strokeWeight; if (node.dashPattern && node.dashPattern.length) o.dash = node.dashPattern; }
  }
  if ('effects' in node && node.effects.length) o.fx = node.effectStyleId && __styleName[node.effectStyleId] ? '@' + __styleName[node.effectStyleId] : node.effects.filter((e) => e.visible !== false).map((e) => [e.type, r2(e.offset && e.offset.x), r2(e.offset && e.offset.y), e.radius, e.spread, vname(e.boundVariables && e.boundVariables.color) || (e.color ? hex(e.color, e.color.a) : '')]);
  if ('opacity' in node && node.opacity < 1) o.op = r2(node.opacity);
  if (node.boundVariables) {
    const b = {};
    for (const [k, v] of Object.entries(node.boundVariables)) if (!['fills', 'strokes', 'effects', 'componentProperties', 'textRangeFills'].includes(k)) b[k] = Array.isArray(v) ? v.map(vname) : vname(v);
    if (Object.keys(b).length) o.bv = b;
  }
  if (node.type === 'TEXT') {
    o.txt = node.characters.length > 60 ? node.characters.slice(0, 60) + '…' : node.characters;
    o.font = node.fontName === figma.mixed ? 'mixed' : node.fontName.family + ' ' + node.fontName.style;
    o.fs = node.fontSize === figma.mixed ? 'mixed' : node.fontSize;
    if (node.textStyleId && node.textStyleId !== figma.mixed && __styleName[node.textStyleId]) o.ts = __styleName[node.textStyleId];
    if (node.textAlignHorizontal !== 'LEFT') o.ta = node.textAlignHorizontal[0];
    if (node.textDecoration && node.textDecoration !== 'NONE' && node.textDecoration !== figma.mixed) o.td = node.textDecoration[0];
  }
  if (node.type === 'INSTANCE') {
    o.main = __mainNames.get(node.id);
    const props = {};
    for (const [k, v] of Object.entries(node.componentProperties || {})) props[k.split('#')[0]] = v.value;
    if (Object.keys(props).length) o.props = props;
  }
  if (node.componentPropertyReferences && Object.keys(node.componentPropertyReferences).length) {
    o.ref = Object.fromEntries(Object.entries(node.componentPropertyReferences).map(([k, v]) => [k, v.split('#')[0]]));
  }
  // instâncias: não descer (o componente-base tem a própria entrada); exceto se forem ícones simples
  if ('children' in node && node.type !== 'INSTANCE') o.c = node.children.map((ch) => ser(ch, depth + 1, auto));
  return o;
}

// resolve o nome do componente principal das instâncias (async) antes de serializar
const __mainNames = new Map();
async function prepare(root) {
  const insts = 'findAllWithCriteria' in root ? root.findAllWithCriteria({ types: ['INSTANCE'] }) : [];
  for (const i of insts) {
    const m = await i.getMainComponentAsync();
    __mainNames.set(i.id, m ? (m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.name + ' › ' + m.name : m.name) : 'missing');
  }
}

const fnv = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };

const propDefs = (node) => {
  const owner = node.type === 'COMPONENT_SET' || !(node.parent && node.parent.type === 'COMPONENT_SET') ? node : node.parent;
  try {
    return Object.fromEntries(Object.entries(owner.componentPropertyDefinitions || {}).map(([k, d]) => [k.split('#')[0], d.type === 'VARIANT' ? d.variantOptions : d.type === 'BOOLEAN' ? 'bool:' + d.defaultValue : d.type === 'TEXT' ? 'text:' + d.defaultValue : d.type]));
  } catch (e) { return {}; }
};

const pathOf = (node) => {
  const p = [];
  for (let n = node.parent; n && n.type !== 'PAGE'; n = n.parent) p.unshift(n.name);
  return p.join(' / ');
};
