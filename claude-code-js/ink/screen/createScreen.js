// function: createScreen
function createScreen(width, height, styles5, charPool, hyperlinkPool) {
  if (ifNotInteger(width, "createScreen width"), ifNotInteger(height, "createScreen height"), !Number.isInteger(width) || width < 0)
    width = Math.max(0, Math.floor(width) || 0);
  if (!Number.isInteger(height) || height < 0)
    height = Math.max(0, Math.floor(height) || 0);
  let size = width * height, buf = new ArrayBuffer(size << 3), cells = new Int32Array(buf), cells64 = new BigInt64Array(buf);
  return {
    width,
    height,
    cells,
    cells64,
    charPool,
    hyperlinkPool,
    emptyStyleId: styles5.none,
    damage: void 0,
    noSelect: new Uint8Array(size),
    softWrap: new Int32Array(height)
  };
}
