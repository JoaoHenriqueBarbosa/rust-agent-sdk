// function: isMarginAuto
function isMarginAuto(edges, physicalEdge) {
  return resolveEdgeRaw(edges, physicalEdge).unit === Unit.Auto;
}
