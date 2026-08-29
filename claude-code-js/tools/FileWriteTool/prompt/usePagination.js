// function: usePagination
function usePagination({ items, active, renderItem, pageSize, loop = !0 }) {
  let state3 = useRef7({ position: 0, lastActive: 0 }), position = loop ? infinite({
    active,
    lastActive: state3.current.lastActive,
    total: items.length,
    pageSize,
    pointer: state3.current.position
  }) : finite({
    active,
    total: items.length,
    pageSize
  });
  return state3.current.position = position, state3.current.lastActive = active, lines({
    items,
    width: readlineWidth(),
    renderItem,
    active,
    position,
    pageSize
  }).join(`
`);
}
