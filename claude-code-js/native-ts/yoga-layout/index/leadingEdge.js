// function: leadingEdge
function leadingEdge(dir) {
  switch (dir) {
    case FlexDirection.Row:
      return EDGE_LEFT;
    case FlexDirection.RowReverse:
      return EDGE_RIGHT;
    case FlexDirection.Column:
      return EDGE_TOP;
    case FlexDirection.ColumnReverse:
      return EDGE_BOTTOM;
  }
}
