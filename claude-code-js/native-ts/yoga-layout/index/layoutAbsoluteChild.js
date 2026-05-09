// function: layoutAbsoluteChild
function layoutAbsoluteChild(parent, child, parentWidth, parentHeight, pad, bor) {
  let cs = child.style, posLeft = resolveEdgeRaw(cs.position, EDGE_LEFT), posRight = resolveEdgeRaw(cs.position, EDGE_RIGHT), posTop = resolveEdgeRaw(cs.position, EDGE_TOP), posBottom = resolveEdgeRaw(cs.position, EDGE_BOTTOM), rLeft = resolveValue(posLeft, parentWidth), rRight = resolveValue(posRight, parentWidth), rTop = resolveValue(posTop, parentHeight), rBottom = resolveValue(posBottom, parentHeight), paddingBoxW = parentWidth - bor[0] - bor[2], paddingBoxH = parentHeight - bor[1] - bor[3], cw = resolveValue(cs.width, paddingBoxW), ch = resolveValue(cs.height, paddingBoxH);
  if (!isDefined(cw) && isDefined(rLeft) && isDefined(rRight))
    cw = paddingBoxW - rLeft - rRight;
  if (!isDefined(ch) && isDefined(rTop) && isDefined(rBottom))
    ch = paddingBoxH - rTop - rBottom;
  layoutNode(child, cw, ch, isDefined(cw) ? MeasureMode.Exactly : MeasureMode.Undefined, isDefined(ch) ? MeasureMode.Exactly : MeasureMode.Undefined, paddingBoxW, paddingBoxH, !0);
  let mL = resolveEdge(cs.margin, EDGE_LEFT, parentWidth), mT = resolveEdge(cs.margin, EDGE_TOP, parentWidth), mR = resolveEdge(cs.margin, EDGE_RIGHT, parentWidth), mB = resolveEdge(cs.margin, EDGE_BOTTOM, parentWidth), mainAxis = parent.style.flexDirection, reversed = isReverse(mainAxis), mainRow = isRow(mainAxis), wrapReverse = parent.style.flexWrap === Wrap.WrapReverse, alignment = cs.alignSelf === Align.Auto ? parent.style.alignItems : cs.alignSelf, left;
  if (isDefined(rLeft))
    left = bor[0] + rLeft + mL;
  else if (isDefined(rRight))
    left = parentWidth - bor[2] - rRight - child.layout.width - mR;
  else if (mainRow) {
    let lead = pad[0] + bor[0], trail = parentWidth - pad[2] - bor[2];
    left = reversed ? trail - child.layout.width - mR : justifyAbsolute(parent.style.justifyContent, lead, trail, child.layout.width) + mL;
  } else
    left = alignAbsolute(alignment, pad[0] + bor[0], parentWidth - pad[2] - bor[2], child.layout.width, wrapReverse) + mL;
  let top;
  if (isDefined(rTop))
    top = bor[1] + rTop + mT;
  else if (isDefined(rBottom))
    top = parentHeight - bor[3] - rBottom - child.layout.height - mB;
  else if (mainRow)
    top = alignAbsolute(alignment, pad[1] + bor[1], parentHeight - pad[3] - bor[3], child.layout.height, wrapReverse) + mT;
  else {
    let lead = pad[1] + bor[1], trail = parentHeight - pad[3] - bor[3];
    top = reversed ? trail - child.layout.height - mB : justifyAbsolute(parent.style.justifyContent, lead, trail, child.layout.height) + mT;
  }
  child.layout.left = left, child.layout.top = top;
}
