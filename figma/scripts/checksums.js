// Impressão digital (FNV-1a) de cada coleção de variáveis, calculada DENTRO do Figma.
// Rodar via MCP use_figma e comparar com figma/manifest.json → checksums.variables.
// Se tudo bater, as variáveis não mudaram e o snapshot local está fiel ao Figma.

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const byId = {};
for (const v of vars) byId[v.id] = v;
const colName = {};
for (const c of cols) colName[c.id] = c.name;
const fmt = (val) => {
  if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
    const t = byId[val.id];
    return t ? '@' + colName[t.variableCollectionId] + '/' + t.name : '@EXT';
  }
  if (val && typeof val === 'object' && 'r' in val) {
    const h = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
    return '#' + h(val.r) + h(val.g) + h(val.b) + (val.a !== undefined && val.a < 1 ? h(val.a) : '');
  }
  return String(val);
};
const fnv = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };
const out = {};
for (const c of cols) {
  const lines = c.variableIds.map((id) => byId[id]).filter(Boolean).map((v) => [v.name, v.resolvedType[0], ...c.modes.map((m) => fmt(v.valuesByMode[m.modeId]))].join('|'));
  out[c.name] = fnv(c.modes.map((m) => m.name).join(',') + '\n' + lines.join('\n'));
}
return out;
