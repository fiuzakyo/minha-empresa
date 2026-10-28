// Exporta estilos de texto e de sombra no formato de figma/snapshot/styles.json. Rodar via MCP use_figma.
const vars = await figma.variables.getLocalVariablesAsync();
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const byId = {};
for (const v of vars) byId[v.id] = v;
const colName = {};
for (const c of cols) colName[c.id] = c.name;
const ref = (id) => (byId[id] ? colName[byId[id].variableCollectionId] + '/' + byId[id].name : 'EXT');
const ts = await figma.getLocalTextStylesAsync();
const es = await figma.getLocalEffectStylesAsync();
return {
  textStyles: ts.map((s) => [s.name, s.fontName.family, s.fontName.style, s.fontSize, s.lineHeight.unit === 'AUTO' ? 'auto' : s.lineHeight.value + (s.lineHeight.unit === 'PIXELS' ? 'px' : '%'), s.letterSpacing.value + (s.letterSpacing.unit === 'PIXELS' ? 'px' : '%')]),
  effectStyles: es.map((s) => [s.name, s.effects.filter((e) => e.visible !== false).map((e) => [e.type, e.offset && e.offset.x, e.offset && e.offset.y, e.radius, e.spread, e.boundVariables && e.boundVariables.color ? ref(e.boundVariables.color.id) : null])]),
};
