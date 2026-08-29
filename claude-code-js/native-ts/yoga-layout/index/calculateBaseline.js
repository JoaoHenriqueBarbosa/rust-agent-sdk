// function: calculateBaseline
function calculateBaseline(node) {
  let baselineChild = null;
  for (let c3 of node.children) {
    if (c3._lineIndex > 0)
      break;
    if (c3.style.positionType === PositionType.Absolute)
      continue;
    if (c3.style.display === Display.None)
      continue;
    if (resolveChildAlign(node, c3) === Align.Baseline || c3.isReferenceBaseline_) {
      baselineChild = c3;
      break;
    }
    if (baselineChild === null)
      baselineChild = c3;
  }
  if (baselineChild === null)
    return node.layout.height;
  return calculateBaseline(baselineChild) + baselineChild.layout.top;
}
