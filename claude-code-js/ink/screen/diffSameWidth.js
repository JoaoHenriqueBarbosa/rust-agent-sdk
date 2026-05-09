// function: diffSameWidth
function diffSameWidth(prev, next, startX, endX, startY, endY, cb) {
  let prevCells = prev.cells, nextCells = next.cells, width = prev.width, prevHeight = prev.height, nextHeight = next.height, stride = width << 1, prevCell = {
    char: " ",
    styleId: 0,
    width: 0 /* Narrow */,
    hyperlink: void 0
  }, nextCell = {
    char: " ",
    styleId: 0,
    width: 0 /* Narrow */,
    hyperlink: void 0
  }, rowEndX = Math.min(endX, width), rowCI = startY * width + startX << 1;
  for (let y2 = startY;y2 < endY; y2++) {
    let prevIn = y2 < prevHeight, nextIn = y2 < nextHeight;
    if (prevIn && nextIn) {
      if (diffRowBoth(prevCells, nextCells, prev, next, rowCI, y2, startX, rowEndX, prevCell, nextCell, cb))
        return !0;
    } else if (prevIn) {
      if (diffRowRemoved(prev, rowCI, y2, startX, rowEndX, prevCell, cb))
        return !0;
    } else if (nextIn) {
      if (diffRowAdded(nextCells, next, rowCI, y2, startX, rowEndX, nextCell, cb))
        return !0;
    }
    rowCI += stride;
  }
  return !1;
}
