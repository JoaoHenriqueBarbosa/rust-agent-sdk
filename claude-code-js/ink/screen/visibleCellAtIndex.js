// function: visibleCellAtIndex
function visibleCellAtIndex(cells, charPool, hyperlinkPool, index, lastRenderedStyleId) {
  let ci = index << 1, charId = cells[ci];
  if (charId === 1)
    return;
  let word1 = cells[ci + 1];
  if (charId === 0 && (word1 & 262140) === 0) {
    let fgStyle = word1 >>> STYLE_SHIFT;
    if (fgStyle === 0 || fgStyle === lastRenderedStyleId)
      return;
  }
  let hid = word1 >>> HYPERLINK_SHIFT & HYPERLINK_MASK;
  return {
    char: charPool.get(charId),
    styleId: word1 >>> STYLE_SHIFT,
    width: word1 & WIDTH_MASK,
    hyperlink: hid === 0 ? void 0 : hyperlinkPool.get(hid)
  };
}
