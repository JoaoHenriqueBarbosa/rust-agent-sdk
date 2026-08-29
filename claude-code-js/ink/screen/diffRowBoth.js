// function: diffRowBoth
function diffRowBoth(prevCells, nextCells, prev, next, ci, y2, startX, endX, prevCell, nextCell, cb) {
  let x3 = startX;
  while (x3 < endX) {
    let skip = findNextDiff(prevCells, nextCells, ci, endX - x3);
    if (x3 += skip, ci += skip << 1, x3 >= endX)
      break;
    if (cellAtCI(prev, ci, prevCell), cellAtCI(next, ci, nextCell), cb(x3, y2, prevCell, nextCell))
      return !0;
    x3++, ci += 2;
  }
  return !1;
}
