// function: hasAnyDefinedEdge
function hasAnyDefinedEdge(edges) {
  for (let i4 = 0;i4 < 9; i4++)
    if (edges[i4].unit !== 0)
      return !0;
  return !1;
}
