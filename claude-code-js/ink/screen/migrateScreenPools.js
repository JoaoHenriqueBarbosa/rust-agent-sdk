// function: migrateScreenPools
function migrateScreenPools(screen, charPool, hyperlinkPool) {
  let { charPool: oldCharPool, hyperlinkPool: oldHyperlinkPool } = screen;
  if (oldCharPool === charPool && oldHyperlinkPool === hyperlinkPool)
    return;
  let size = screen.width * screen.height, cells = screen.cells;
  for (let ci = 0;ci < size << 1; ci += 2) {
    let oldCharId = cells[ci];
    cells[ci] = charPool.intern(oldCharPool.get(oldCharId));
    let word1 = cells[ci + 1], oldHyperlinkId = word1 >>> HYPERLINK_SHIFT & HYPERLINK_MASK;
    if (oldHyperlinkId !== 0) {
      let oldStr = oldHyperlinkPool.get(oldHyperlinkId), newHyperlinkId = hyperlinkPool.intern(oldStr), styleId = word1 >>> STYLE_SHIFT, width = word1 & WIDTH_MASK;
      cells[ci + 1] = packWord1(styleId, newHyperlinkId, width);
    }
  }
  screen.charPool = charPool, screen.hyperlinkPool = hyperlinkPool;
}
