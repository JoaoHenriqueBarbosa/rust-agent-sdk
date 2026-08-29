// function: setCellStyleId
function setCellStyleId(screen, x3, y2, styleId) {
  if (x3 < 0 || y2 < 0 || x3 >= screen.width || y2 >= screen.height)
    return;
  let ci = y2 * screen.width + x3 << 1, cells = screen.cells, word1 = cells[ci + 1], width = word1 & WIDTH_MASK;
  if (width === 2 /* SpacerTail */ || width === 3 /* SpacerHead */)
    return;
  let hid = word1 >>> HYPERLINK_SHIFT & HYPERLINK_MASK;
  cells[ci + 1] = packWord1(styleId, hid, width);
  let d = screen.damage;
  if (d)
    screen.damage = unionRect(d, { x: x3, y: y2, width: 1, height: 1 });
  else
    screen.damage = { x: x3, y: y2, width: 1, height: 1 };
}
