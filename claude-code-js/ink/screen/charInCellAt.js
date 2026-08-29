// function: charInCellAt
function charInCellAt(screen, x3, y2) {
  if (x3 < 0 || y2 < 0 || x3 >= screen.width || y2 >= screen.height)
    return;
  let ci = y2 * screen.width + x3 << 1;
  return screen.charPool.get(screen.cells[ci]);
}
