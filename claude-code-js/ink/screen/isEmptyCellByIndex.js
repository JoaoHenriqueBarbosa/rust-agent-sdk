// function: isEmptyCellByIndex
function isEmptyCellByIndex(screen, index) {
  let ci = index << 1;
  return screen.cells[ci] === 0 && screen.cells[ci | 1] === 0;
}
