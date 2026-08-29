// Original: src/ink/wrap-text.ts
function sliceFit(text, start, end) {
  let s2 = sliceAnsi(text, start, end);
  return stringWidth(s2) > end - start ? sliceAnsi(text, start, end - 1) : s2;
}
function truncate2(text, columns, position) {
  if (columns < 1)
    return "";
  if (columns === 1)
    return ELLIPSIS;
  let length = stringWidth(text);
  if (length <= columns)
    return text;
  if (position === "start")
    return ELLIPSIS + sliceFit(text, length - columns + 1, length);
  if (position === "middle") {
    let half = Math.floor(columns / 2);
    return sliceFit(text, 0, half) + ELLIPSIS + sliceFit(text, length - (columns - half) + 1, length);
  }
  return sliceFit(text, 0, columns - 1) + ELLIPSIS;
}
function wrapText2(text, maxWidth, wrapType) {
  if (wrapType === "wrap")
    return wrapAnsi2(text, maxWidth, {
      trim: !1,
      hard: !0
    });
  if (wrapType === "wrap-trim")
    return wrapAnsi2(text, maxWidth, {
      trim: !0,
      hard: !0
    });
  if (wrapType.startsWith("truncate")) {
    let position = "end";
    if (wrapType === "truncate-middle")
      position = "middle";
    if (wrapType === "truncate-start")
      position = "start";
    return truncate2(text, maxWidth, position);
  }
  return text;
}
var ELLIPSIS = "\u2026";
var init_wrap_text = __esm(() => {
  init_sliceAnsi();
  init_stringWidth();
  init_wrapAnsi();
});
