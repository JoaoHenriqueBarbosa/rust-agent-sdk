// function: shiftRows
function shiftRows(screen, top, bottom, n5) {
  if (n5 === 0 || top < 0 || bottom >= screen.height || top > bottom)
    return;
  let { width: w2, cells64, noSelect: noSel, softWrap: sw } = screen;
  if (Math.abs(n5) > bottom - top) {
    cells64.fill(EMPTY_CELL_VALUE, top * w2, (bottom + 1) * w2), noSel.fill(0, top * w2, (bottom + 1) * w2), sw.fill(0, top, bottom + 1);
    return;
  }
  if (n5 > 0)
    cells64.copyWithin(top * w2, (top + n5) * w2, (bottom + 1) * w2), noSel.copyWithin(top * w2, (top + n5) * w2, (bottom + 1) * w2), sw.copyWithin(top, top + n5, bottom + 1), cells64.fill(EMPTY_CELL_VALUE, (bottom - n5 + 1) * w2, (bottom + 1) * w2), noSel.fill(0, (bottom - n5 + 1) * w2, (bottom + 1) * w2), sw.fill(0, bottom - n5 + 1, bottom + 1);
  else
    cells64.copyWithin((top - n5) * w2, top * w2, (bottom + n5 + 1) * w2), noSel.copyWithin((top - n5) * w2, top * w2, (bottom + n5 + 1) * w2), sw.copyWithin(top - n5, top, bottom + n5 + 1), cells64.fill(EMPTY_CELL_VALUE, top * w2, (top - n5) * w2), noSel.fill(0, top * w2, (top - n5) * w2), sw.fill(0, top, top - n5);
}
