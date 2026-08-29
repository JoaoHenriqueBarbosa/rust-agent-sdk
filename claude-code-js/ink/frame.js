// Original: src/ink/frame.ts
function emptyFrame(rows, columns, stylePool, charPool, hyperlinkPool) {
  return {
    screen: createScreen(0, 0, stylePool, charPool, hyperlinkPool),
    viewport: { width: columns, height: rows },
    cursor: { x: 0, y: 0, visible: !0 }
  };
}
var init_frame = __esm(() => {
  init_screen();
});
