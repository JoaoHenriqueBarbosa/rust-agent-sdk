// Original: src/components/design-system/ProgressBar.tsx
function ProgressBar(t0) {
  let $3 = import_compiler_runtime25.c(13), {
    ratio: inputRatio,
    width,
    fillColor,
    emptyColor
  } = t0, ratio = Math.min(1, Math.max(0, inputRatio)), whole = Math.floor(ratio * width), t1;
  if ($3[0] !== whole)
    t1 = BLOCKS[BLOCKS.length - 1].repeat(whole), $3[0] = whole, $3[1] = t1;
  else
    t1 = $3[1];
  let segments;
  if ($3[2] !== ratio || $3[3] !== t1 || $3[4] !== whole || $3[5] !== width) {
    if (segments = [t1], whole < width) {
      let remainder = ratio * width - whole, middle = Math.floor(remainder * BLOCKS.length);
      segments.push(BLOCKS[middle]);
      let empty = width - whole - 1;
      if (empty > 0) {
        let t22;
        if ($3[7] !== empty)
          t22 = BLOCKS[0].repeat(empty), $3[7] = empty, $3[8] = t22;
        else
          t22 = $3[8];
        segments.push(t22);
      }
    }
    $3[2] = ratio, $3[3] = t1, $3[4] = whole, $3[5] = width, $3[6] = segments;
  } else
    segments = $3[6];
  let t2 = segments.join(""), t3;
  if ($3[9] !== emptyColor || $3[10] !== fillColor || $3[11] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime29.jsxDEV(ThemedText, {
      color: fillColor,
      backgroundColor: emptyColor,
      children: t2
    }, void 0, !1, void 0, this), $3[9] = emptyColor, $3[10] = fillColor, $3[11] = t2, $3[12] = t3;
  else
    t3 = $3[12];
  return t3;
}
var import_compiler_runtime25, jsx_dev_runtime29, BLOCKS;
var init_ProgressBar = __esm(() => {
  init_ink2();
  import_compiler_runtime25 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime29 = __toESM(require_react_jsx_dev_runtime_development(), 1), BLOCKS = [" ", "\u258F", "\u258E", "\u258D", "\u258C", "\u258B", "\u258A", "\u2589", "\u2588"];
});
