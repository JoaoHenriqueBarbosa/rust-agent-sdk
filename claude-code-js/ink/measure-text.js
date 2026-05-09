// Original: src/ink/measure-text.ts
function measureText(text, maxWidth) {
  if (text.length === 0)
    return {
      width: 0,
      height: 0
    };
  let noWrap = maxWidth <= 0 || !Number.isFinite(maxWidth), height = 0, width = 0, start = 0;
  while (start <= text.length) {
    let end = text.indexOf(`
`, start), line = end === -1 ? text.substring(start) : text.substring(start, end), w2 = lineWidth(line);
    if (width = Math.max(width, w2), noWrap)
      height++;
    else
      height += w2 === 0 ? 1 : Math.ceil(w2 / maxWidth);
    if (end === -1)
      break;
    start = end + 1;
  }
  return { width, height };
}
var measure_text_default;
var init_measure_text = __esm(() => {
  init_line_width_cache();
  measure_text_default = measureText;
});
