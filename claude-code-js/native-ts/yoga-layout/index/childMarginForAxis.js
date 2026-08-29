// function: childMarginForAxis
function childMarginForAxis(child, axis, ownerWidth) {
  if (!child._hasMargin)
    return 0;
  let lead = resolveEdge(child.style.margin, leadingEdge(axis), ownerWidth), trail = resolveEdge(child.style.margin, trailingEdge(axis), ownerWidth);
  return lead + trail;
}
