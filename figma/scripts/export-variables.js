// Exporta as variáveis do Figma no formato de figma/snapshot/variables.*.json.
// Rodar via MCP use_figma, um grupo de coleções por chamada (o retorno é limitado a ~48 KB):
//   __WANT__ = ["_Colors Primitives", "_Alpha Primitives"]          → variables.primitives.json
//   __WANT__ = ["1 · Semantic Colors", "0 · shadcn Theme"]          → variables.semantic.json
//   __WANT__ = ["0 · Brand"]                                        → variables.brand.json
//   __WANT__ = ["6 · Typography", "2 · Spacing", "3 · Radius", "4 · Border",
//               "5 · Opacity", "7 · Grid & Breakpoint", "8 · Size"] → variables.scales.json
// Coleções novas no Figma: crie um novo variables.<nome>.json — o build e o diff leem todos.
// Cada linha: [nome, tipo (C cor | F número | S texto | B booleano), valor por modo...]
// Aliases viram "@<coleção>/<variável>".

const WANT = __WANT__;
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
  return val;
};
const out = {};
for (const c of cols.filter((c) => WANT.includes(c.name))) {
  out[c.name] = {
    modes: c.modes.map((m) => m.name),
    vars: c.variableIds.map((id) => byId[id]).filter(Boolean).map((v) => [v.name, v.resolvedType[0], ...c.modes.map((m) => fmt(v.valuesByMode[m.modeId]))]),
  };
}
// coleções que existem no Figma mas não estão em nenhum grupo (para não perder coleção nova)
out.__allCollections = cols.map((c) => c.name);
return out;
