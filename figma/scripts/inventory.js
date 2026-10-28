// Inventário de componentes de UMA página (rodar um por página, em paralelo).
// Uso: concatenar lib.js + este arquivo, trocando __PAGE_ID__.
// Retorna, para cada component set / componente avulso, a impressão digital (hash)
// usada pelo diff entre versões.

const page = await figma.getNodeByIdAsync('__PAGE_ID__');
await figma.setCurrentPageAsync(page);
const nodes = page.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })
  .filter((n) => n.type === 'COMPONENT_SET' || !(n.parent && n.parent.type === 'COMPONENT_SET'))
  .filter((n) => !n.name.startsWith('_') && !n.name.startsWith('.'));
const items = [];
for (const n of nodes) {
  await prepare(n);
  const body = JSON.stringify({ d: n.description || '', p: propDefs(n), s: ser(n) });
  items.push({
    id: n.id,
    key: n.key,
    name: n.name,
    path: pathOf(n),
    kind: n.type === 'COMPONENT_SET' ? 'set' : 'component',
    variants: n.type === 'COMPONENT_SET' ? n.children.length : 1,
    props: propDefs(n),
    description: n.description || undefined,
    hash: fnv(body),
  });
}
return { page: page.name, count: items.length, items };
