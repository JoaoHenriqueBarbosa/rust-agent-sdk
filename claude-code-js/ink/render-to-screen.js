// Original: src/ink/render-to-screen.ts
function scanPositions(screen, query) {
  let lq = query.toLowerCase();
  if (!lq)
    return [];
  let qlen = lq.length, w2 = screen.width, h4 = screen.height, noSelect = screen.noSelect, positions = [], t0 = performance.now();
  for (let row = 0;row < h4; row++) {
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
      let startCi = codeUnitToCell[pos], endCi = codeUnitToCell[pos + qlen - 1], col = colOf[startCi], endCol = colOf[endCi] + 1;
      positions.push({ row, col, len: endCol - col }), pos = text.indexOf(lq, pos + qlen);
    }
  }
  return timing.scan += performance.now() - t0, positions;
}
function applyPositionedHighlight(screen, stylePool, positions, rowOffset, currentIdx) {
  if (currentIdx < 0 || currentIdx >= positions.length)
    return !1;
  let p4 = positions[currentIdx], row = p4.row + rowOffset;
  if (row < 0 || row >= screen.height)
    return !1;
  let transform2 = (id) => stylePool.withCurrentMatch(id), rowOff = row * screen.width;
  for (let col = p4.col;col < p4.col + p4.len; col++) {
    if (col < 0 || col >= screen.width)
      continue;
    let cell = cellAtIndex(screen, rowOff + col);
    setCellStyleId(screen, col, row, transform2(cell.styleId));
  }
  return !0;
}
var import_constants38, timing;
var init_render_to_screen = __esm(() => {
  init_debug();
  init_dom();
  init_focus();
  init_output2();
  init_reconciler();
  init_render_node_to_output();
  init_screen();
  import_constants38 = __toESM(require_react_reconciler_constants_development(), 1), timing = { reconcile: 0, yoga: 0, paint: 0, scan: 0, calls: 0 };
});
