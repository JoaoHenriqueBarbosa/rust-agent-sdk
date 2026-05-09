// function: markNoSelectRegion
function markNoSelectRegion(screen, x3, y2, width, height) {
  let maxX = Math.min(x3 + width, screen.width), maxY = Math.min(y2 + height, screen.height), noSel = screen.noSelect, stride = screen.width;
  for (let row = Math.max(0, y2);row < maxY; row++) {
    let rowStart = row * stride;
    noSel.fill(1, rowStart + Math.max(0, x3), rowStart + maxX);
  }
}
