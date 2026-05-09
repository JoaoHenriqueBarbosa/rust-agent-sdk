// function: trailingEdge
function trailingEdge(dir) {
  switch (dir) {
    case FlexDirection.Row:
      return EDGE_RIGHT;
    case FlexDirection.RowReverse:
      return EDGE_LEFT;
    case FlexDirection.Column:
      return EDGE_BOTTOM;
    case FlexDirection.ColumnReverse:
      return EDGE_TOP;
  }
}
