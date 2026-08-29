// function: roundLayout
function roundLayout(node, scale, absLeft, absTop) {
  if (scale === 0)
    return;
  let l3 = node.layout, nodeLeft = l3.left, nodeTop = l3.top, nodeWidth = l3.width, nodeHeight = l3.height, absNodeLeft = absLeft + nodeLeft, absNodeTop = absTop + nodeTop, isText = node.measureFunc !== null;
  l3.left = roundValue(nodeLeft, scale, !1, isText), l3.top = roundValue(nodeTop, scale, !1, isText);
  let absRight = absNodeLeft + nodeWidth, absBottom = absNodeTop + nodeHeight, hasFracW = !isWholeNumber(nodeWidth * scale), hasFracH = !isWholeNumber(nodeHeight * scale);
  l3.width = roundValue(absRight, scale, isText && hasFracW, isText && !hasFracW) - roundValue(absNodeLeft, scale, !1, isText), l3.height = roundValue(absBottom, scale, isText && hasFracH, isText && !hasFracH) - roundValue(absNodeTop, scale, !1, isText);
  for (let c3 of node.children)
    roundLayout(c3, scale, absNodeLeft, absNodeTop);
}
