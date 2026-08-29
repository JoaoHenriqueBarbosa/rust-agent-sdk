// function: diffRowRemoved
function diffRowRemoved(prev, ci, y2, startX, endX, prevCell, cb) {
  for (let x3 = startX;x3 < endX; x3++, ci += 2)
    if (cellAtCI(prev, ci, prevCell), cb(x3, y2, prevCell, void 0))
      return !0;
  return !1;
}
