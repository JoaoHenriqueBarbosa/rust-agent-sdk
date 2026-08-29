// function: cellAtIndex
function cellAtIndex(screen, index) {
  let ci = index << 1, word1 = screen.cells[ci + 1], hid = word1 >>> HYPERLINK_SHIFT & HYPERLINK_MASK;
  return {
    char: screen.charPool.get(screen.cells[ci]),
    styleId: word1 >>> STYLE_SHIFT,
    width: word1 & WIDTH_MASK,
    hyperlink: hid === 0 ? void 0 : screen.hyperlinkPool.get(hid)
  };
}
