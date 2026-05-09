// function: setCellAt
function setCellAt(screen, x3, y2, cell) {
  if (x3 < 0 || y2 < 0 || x3 >= screen.width || y2 >= screen.height)
    return;
  let ci = y2 * screen.width + x3 << 1, cells = screen.cells, prevWidth = cells[ci + 1] & WIDTH_MASK;
  if (prevWidth === 1 /* Wide */ && cell.width !== 1 /* Wide */) {
    if (x3 + 1 < screen.width) {
      let spacerCI = ci + 2;
      if ((cells[spacerCI + 1] & WIDTH_MASK) === 2 /* SpacerTail */)
        cells[spacerCI] = EMPTY_CHAR_INDEX, cells[spacerCI + 1] = packWord1(screen.emptyStyleId, 0, 0 /* Narrow */);
    }
  }
  let clearedWideX = -1;
  if (prevWidth === 2 /* SpacerTail */ && cell.width !== 2 /* SpacerTail */) {
    if (x3 > 0) {
      let wideCI = ci - 2;
      if ((cells[wideCI + 1] & WIDTH_MASK) === 1 /* Wide */)
        cells[wideCI] = EMPTY_CHAR_INDEX, cells[wideCI + 1] = packWord1(screen.emptyStyleId, 0, 0 /* Narrow */), clearedWideX = x3 - 1;
    }
  }
  cells[ci] = internCharString(screen, cell.char), cells[ci + 1] = packWord1(cell.styleId, internHyperlink(screen, cell.hyperlink), cell.width);
  let minX = clearedWideX >= 0 ? Math.min(x3, clearedWideX) : x3, damage = screen.damage;
  if (damage) {
    let right = damage.x + damage.width, bottom = damage.y + damage.height;
    if (minX < damage.x)
      damage.width += damage.x - minX, damage.x = minX;
    else if (x3 >= right)
      damage.width = x3 - damage.x + 1;
    if (y2 < damage.y)
      damage.height += damage.y - y2, damage.y = y2;
    else if (y2 >= bottom)
      damage.height = y2 - damage.y + 1;
  } else
    screen.damage = { x: minX, y: y2, width: x3 - minX + 1, height: 1 };
  if (cell.width === 1 /* Wide */) {
    let spacerX = x3 + 1;
    if (spacerX < screen.width) {
      let spacerCI = ci + 2;
      if ((cells[spacerCI + 1] & WIDTH_MASK) === 1 /* Wide */) {
        let orphanCI = spacerCI + 2;
        if (spacerX + 1 < screen.width && (cells[orphanCI + 1] & WIDTH_MASK) === 2 /* SpacerTail */)
          cells[orphanCI] = EMPTY_CHAR_INDEX, cells[orphanCI + 1] = packWord1(screen.emptyStyleId, 0, 0 /* Narrow */);
      }
      cells[spacerCI] = SPACER_CHAR_INDEX, cells[spacerCI + 1] = packWord1(screen.emptyStyleId, 0, 2 /* SpacerTail */);
      let d = screen.damage;
      if (d && spacerX >= d.x + d.width)
        d.width = spacerX - d.x + 1;
    }
  }
}
