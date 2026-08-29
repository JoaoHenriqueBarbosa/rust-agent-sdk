// function: diffRowAdded
function diffRowAdded(nextCells, next, ci, y2, startX, endX, nextCell, cb) {
  for (let x3 = startX;x3 < endX; x3++, ci += 2) {
    if (nextCells[ci] === 0 && nextCells[ci | 1] === 0)
      continue;
    if (cellAtCI(next, ci, nextCell), cb(x3, y2, void 0, nextCell))
      return !0;
  }
  return !1;
}
