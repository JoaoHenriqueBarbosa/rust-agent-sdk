// function: cellAtCI
function cellAtCI(screen, ci, out) {
  let w1 = ci | 1, word1 = screen.cells[w1];
  out.char = screen.charPool.get(screen.cells[ci]), out.styleId = word1 >>> STYLE_SHIFT, out.width = word1 & WIDTH_MASK;
  let hid = word1 >>> HYPERLINK_SHIFT & HYPERLINK_MASK;
  out.hyperlink = hid === 0 ? void 0 : screen.hyperlinkPool.get(hid);
}
