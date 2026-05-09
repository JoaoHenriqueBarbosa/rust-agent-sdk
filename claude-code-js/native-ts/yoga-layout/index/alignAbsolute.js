// function: alignAbsolute
function alignAbsolute(align, leadEdge, trailEdge, childSize, wrapReverse) {
  switch (align) {
    case Align.Center:
      return leadEdge + (trailEdge - leadEdge - childSize) / 2;
    case Align.FlexEnd:
      return wrapReverse ? leadEdge : trailEdge - childSize;
    default:
      return wrapReverse ? trailEdge - childSize : leadEdge;
  }
}
