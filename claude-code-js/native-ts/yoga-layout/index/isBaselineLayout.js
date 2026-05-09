// function: isBaselineLayout
function isBaselineLayout(node, flowChildren) {
  if (!isRow(node.style.flexDirection))
    return !1;
  if (node.style.alignItems === Align.Baseline)
    return !0;
  for (let c3 of flowChildren)
    if (c3.style.alignSelf === Align.Baseline)
      return !0;
  return !1;
}
