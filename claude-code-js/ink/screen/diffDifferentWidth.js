// function: diffDifferentWidth
function diffDifferentWidth(prev, next, startX, endX, startY, endY, cb) {
  let prevWidth = prev.width, nextWidth = next.width, prevCells = prev.cells, nextCells = next.cells, prevCell = {
    char: " ",
    styleId: 0,
    width: 0 /* Narrow */,
    hyperlink: void 0
  }, nextCell = {
    char: " ",
    styleId: 0,
    width: 0 /* Narrow */,
    hyperlink: void 0
  }, prevStride = prevWidth << 1, nextStride = nextWidth << 1, prevRowCI = startY * prevWidth + startX << 1, nextRowCI = startY * nextWidth + startX << 1;
  for (let y2 = startY;y2 < endY; y2++) {
    let prevIn = y2 < prev.height, nextIn = y2 < next.height, prevEndX = prevIn ? Math.min(endX, prevWidth) : startX, nextEndX = nextIn ? Math.min(endX, nextWidth) : startX, bothEndX = Math.min(prevEndX, nextEndX), prevCI = prevRowCI, nextCI = nextRowCI;
    for (let x3 = startX;x3 < bothEndX; x3++) {
      if (prevCells[prevCI] === nextCells[nextCI] && prevCells[prevCI + 1] === nextCells[nextCI + 1]) {
        prevCI += 2, nextCI += 2;
        continue;
      }
      if (cellAtCI(prev, prevCI, prevCell), cellAtCI(next, nextCI, nextCell), prevCI += 2, nextCI += 2, cb(x3, y2, prevCell, nextCell))
        return !0;
    }
    if (prevEndX > bothEndX) {
      prevCI = prevRowCI + (bothEndX - startX << 1);
      for (let x3 = bothEndX;x3 < prevEndX; x3++)
        if (cellAtCI(prev, prevCI, prevCell), prevCI += 2, cb(x3, y2, prevCell, void 0))
          return !0;
    }
    if (nextEndX > bothEndX) {
      nextCI = nextRowCI + (bothEndX - startX << 1);
      for (let x3 = bothEndX;x3 < nextEndX; x3++) {
        if (nextCells[nextCI] === 0 && nextCells[nextCI | 1] === 0) {
          nextCI += 2;
          continue;
        }
        if (cellAtCI(next, nextCI, nextCell), nextCI += 2, cb(x3, y2, void 0, nextCell))
          return !0;
      }
    }
    prevRowCI += prevStride, nextRowCI += nextStride;
  }
  return !1;
}
