// Original: src/components/PromptInput/ShimmeredInput.tsx
function HighlightedInput(t0) {
  let $3 = import_compiler_runtime124.c(23), {
    text: text2,
    highlights
  } = t0, lines2;
  if ($3[0] !== highlights || $3[1] !== text2) {
    let segments = segmentTextByHighlights(text2, highlights);
    lines2 = [[]];
    let pos = 0;
    for (let segment of segments) {
      let parts = segment.text.split(`
`);
      for (let i5 = 0;i5 < parts.length; i5++) {
        if (i5 > 0)
          lines2.push([]), pos = pos + 1;
        let part = parts[i5];
        if (part.length > 0)
          lines2[lines2.length - 1].push({
            text: part,
            highlight: segment.highlight,
            start: pos
          });
        pos = pos + part.length;
      }
    }
    $3[0] = highlights, $3[1] = text2, $3[2] = lines2;
  } else
    lines2 = $3[2];
  let t1;
  if ($3[3] !== highlights)
    t1 = highlights.some(_temp57), $3[3] = highlights, $3[4] = t1;
  else
    t1 = $3[4];
  let hasShimmer = t1, sweepStart = 0, cycleLength = 1;
  if (hasShimmer) {
    let lo = 1 / 0, hi = -1 / 0;
    if ($3[5] !== hi || $3[6] !== highlights || $3[7] !== lo) {
      for (let h_0 of highlights)
        if (h_0.shimmerColor)
          lo = Math.min(lo, h_0.start), hi = Math.max(hi, h_0.end);
      $3[5] = hi, $3[6] = highlights, $3[7] = lo, $3[8] = lo, $3[9] = hi;
    } else
      lo = $3[8], hi = $3[9];
    sweepStart = lo - 10, cycleLength = hi - lo + 20;
  }
  let t2;
  if ($3[10] !== cycleLength || $3[11] !== hasShimmer || $3[12] !== lines2 || $3[13] !== sweepStart)
    t2 = {
      lines: lines2,
      hasShimmer,
      sweepStart,
      cycleLength
    }, $3[10] = cycleLength, $3[11] = hasShimmer, $3[12] = lines2, $3[13] = sweepStart, $3[14] = t2;
  else
    t2 = $3[14];
  let {
    lines: lines_0,
    hasShimmer: hasShimmer_0,
    sweepStart: sweepStart_0,
    cycleLength: cycleLength_0
  } = t2, [ref, time3] = useAnimationFrame(hasShimmer_0 ? 50 : null), glimmerIndex = hasShimmer_0 ? sweepStart_0 + Math.floor(time3 / 50) % cycleLength_0 : -100, t3;
  if ($3[15] !== glimmerIndex || $3[16] !== lines_0) {
    let t42;
    if ($3[18] !== glimmerIndex)
      t42 = (lineParts, lineIndex) => /* @__PURE__ */ jsx_dev_runtime156.jsxDEV(ThemedBox_default, {
        children: lineParts.length === 0 ? /* @__PURE__ */ jsx_dev_runtime156.jsxDEV(ThemedText, {
          children: " "
        }, void 0, !1, void 0, this) : lineParts.map((part_0, partIndex) => {
          if (part_0.highlight?.shimmerColor && part_0.highlight.color)
            return /* @__PURE__ */ jsx_dev_runtime156.jsxDEV(ThemedText, {
              children: part_0.text.split("").map((char, charIndex) => /* @__PURE__ */ jsx_dev_runtime156.jsxDEV(ShimmerChar, {
                char,
                index: part_0.start + charIndex,
                glimmerIndex,
                messageColor: part_0.highlight.color,
                shimmerColor: part_0.highlight.shimmerColor
              }, charIndex, !1, void 0, this))
            }, partIndex, !1, void 0, this);
          return /* @__PURE__ */ jsx_dev_runtime156.jsxDEV(ThemedText, {
            color: part_0.highlight?.color,
            dimColor: part_0.highlight?.dimColor,
            inverse: part_0.highlight?.inverse,
            children: /* @__PURE__ */ jsx_dev_runtime156.jsxDEV(Ansi, {
              children: part_0.text
            }, void 0, !1, void 0, this)
          }, partIndex, !1, void 0, this);
        })
      }, lineIndex, !1, void 0, this), $3[18] = glimmerIndex, $3[19] = t42;
    else
      t42 = $3[19];
    t3 = lines_0.map(t42), $3[15] = glimmerIndex, $3[16] = lines_0, $3[17] = t3;
  } else
    t3 = $3[17];
  let t4;
  if ($3[20] !== ref || $3[21] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime156.jsxDEV(ThemedBox_default, {
      ref,
      flexDirection: "column",
      children: t3
    }, void 0, !1, void 0, this), $3[20] = ref, $3[21] = t3, $3[22] = t4;
  else
    t4 = $3[22];
  return t4;
}
function _temp57(h4) {
  return h4.shimmerColor;
}
var import_compiler_runtime124, jsx_dev_runtime156;
var init_ShimmeredInput = __esm(() => {
  init_ink2();
  init_textHighlighting();
  init_ShimmerChar();
  import_compiler_runtime124 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime156 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
