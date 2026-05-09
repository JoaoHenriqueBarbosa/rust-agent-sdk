// function: resolveEdge
function resolveEdge(edges, physicalEdge, ownerSize, allowAuto = !1) {
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
  if (v2.unit === Unit.Undefined)
    return 0;
  if (v2.unit === Unit.Auto)
    return allowAuto ? NaN : 0;
  return resolveValue(v2, ownerSize);
}
