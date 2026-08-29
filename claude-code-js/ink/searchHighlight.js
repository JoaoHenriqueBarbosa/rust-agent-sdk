// Original: src/ink/searchHighlight.ts
function applySearchHighlight(screen, query, stylePool) {
  if (!query)
    return !1;
  let lq = query.toLowerCase(), qlen = lq.length, w2 = screen.width, noSelect = screen.noSelect, height = screen.height, applied = !1;
  for (let row = 0;row < height; row++) {
    let rowOff = row * w2, text = "", colOf = [], codeUnitToCell = [];
    for (let col = 0;col < w2; col++) {
      let idx = rowOff + col, cell = cellAtIndex(screen, idx);
      if (cell.width === 2 /* SpacerTail */ || cell.width === 3 /* SpacerHead */ || noSelect[idx] === 1)
        continue;
      let lc = cell.char.toLowerCase(), cellIdx = colOf.length;
      for (let i4 = 0;i4 < lc.length; i4++)
        codeUnitToCell.push(cellIdx);
      text += lc, colOf.push(col);
    }
    let pos = text.indexOf(lq);
    while (pos >= 0) {
      applied = !0;
      let startCi = codeUnitToCell[pos], endCi = codeUnitToCell[pos + qlen - 1];
      for (let ci = startCi;ci <= endCi; ci++) {
        let col = colOf[ci], cell = cellAtIndex(screen, rowOff + col);
        setCellStyleId(screen, col, row, stylePool.withInverse(cell.styleId));
      }
      pos = text.indexOf(lq, pos + qlen);
    }
  }
  return applied;
}
var init_searchHighlight = __esm(() => {
  init_screen();
});
