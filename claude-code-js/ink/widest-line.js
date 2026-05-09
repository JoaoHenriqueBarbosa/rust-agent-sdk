// Original: src/ink/widest-line.ts
function widestLine(string4) {
  let maxWidth = 0, start = 0;
  while (start <= string4.length) {
    let end = string4.indexOf(`
`, start), line = end === -1 ? string4.substring(start) : string4.substring(start, end);
    if (maxWidth = Math.max(maxWidth, lineWidth(line)), end === -1)
      break;
    start = end + 1;
  }
  return maxWidth;
}
var init_widest_line = __esm(() => {
  init_line_width_cache();
});
