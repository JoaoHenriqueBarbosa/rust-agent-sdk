// function: justifyAbsolute
function justifyAbsolute(justify, leadEdge, trailEdge, childSize) {
  switch (justify) {
    case Justify.Center:
      return leadEdge + (trailEdge - leadEdge - childSize) / 2;
    case Justify.FlexEnd:
      return trailEdge - childSize;
    default:
      return leadEdge;
  }
}
