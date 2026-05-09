// function: isEmptyCellAt
function isEmptyCellAt(screen, x3, y2) {
  if (x3 < 0 || y2 < 0 || x3 >= screen.width || y2 >= screen.height)
    return !0;
  return isEmptyCellByIndex(screen, y2 * screen.width + x3);
}
