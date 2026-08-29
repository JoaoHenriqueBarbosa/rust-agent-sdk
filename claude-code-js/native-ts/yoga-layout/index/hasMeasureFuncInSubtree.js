// function: hasMeasureFuncInSubtree
function hasMeasureFuncInSubtree(node) {
  if (node.measureFunc)
    return !0;
  for (let c3 of node.children)
    if (hasMeasureFuncInSubtree(c3))
      return !0;
  return !1;
}
