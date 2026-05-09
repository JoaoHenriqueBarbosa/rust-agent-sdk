// function: physicalEdge
function physicalEdge(edge) {
  switch (edge) {
    case Edge.Left:
    case Edge.Start:
      return EDGE_LEFT;
    case Edge.Top:
      return EDGE_TOP;
    case Edge.Right:
    case Edge.End:
      return EDGE_RIGHT;
    case Edge.Bottom:
      return EDGE_BOTTOM;
    default:
      return EDGE_LEFT;
  }
}
