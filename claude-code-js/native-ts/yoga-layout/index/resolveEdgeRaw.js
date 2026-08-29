// function: resolveEdgeRaw
function resolveEdgeRaw(edges, physicalEdge) {
  let v2 = edges[physicalEdge];
  if (v2.unit === Unit.Undefined)
    if (physicalEdge === EDGE_LEFT || physicalEdge === EDGE_RIGHT)
      v2 = edges[Edge.Horizontal];
    else
      v2 = edges[Edge.Vertical];
  if (v2.unit === Unit.Undefined)
    v2 = edges[Edge.All];
  if (v2.unit === Unit.Undefined) {
    if (physicalEdge === EDGE_LEFT)
      v2 = edges[Edge.Start];
    if (physicalEdge === EDGE_RIGHT)
      v2 = edges[Edge.End];
  }
  return v2;
}
