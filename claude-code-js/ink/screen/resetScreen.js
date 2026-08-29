// function: resetScreen
function resetScreen(screen, width, height) {
  if (ifNotInteger(width, "resetScreen width"), ifNotInteger(height, "resetScreen height"), !Number.isInteger(width) || width < 0)
    width = Math.max(0, Math.floor(width) || 0);
  if (!Number.isInteger(height) || height < 0)
    height = Math.max(0, Math.floor(height) || 0);
  let size = width * height;
  if (screen.cells64.length < size) {
    let buf = new ArrayBuffer(size << 3);
    screen.cells = new Int32Array(buf), screen.cells64 = new BigInt64Array(buf), screen.noSelect = new Uint8Array(size);
  }
  if (screen.softWrap.length < height)
    screen.softWrap = new Int32Array(height);
  screen.cells64.fill(EMPTY_CELL_VALUE, 0, size), screen.noSelect.fill(0, 0, size), screen.softWrap.fill(0, 0, height), screen.width = width, screen.height = height, screen.damage = void 0;
}
