// Original: src/components/StructuredDiff.tsx
function computeGutterWidth(patch) {
  return Math.max(patch.oldStart + patch.oldLines - 1, patch.newStart + patch.newLines - 1, 1).toString().length + 3;
}
function renderColorDiff(patch, firstLine, filePath, fileContent, theme, width, dim2, splitGutter) {
  let ColorDiff2 = expectColorDiff();
  if (!ColorDiff2)
    return null;
  let rawGutterWidth = splitGutter ? computeGutterWidth(patch) : 0, gutterWidth = rawGutterWidth > 0 && rawGutterWidth < width ? rawGutterWidth : 0, key2 = `${theme}|${width}|${dim2 ? 1 : 0}|${gutterWidth}|${firstLine ?? ""}|${filePath}`, perHunk = RENDER_CACHE.get(patch), hit = perHunk?.get(key2);
  if (hit)
    return hit;
  let lines2 = new ColorDiff2(patch, firstLine, filePath, fileContent).render(theme, width, dim2);
  if (lines2 === null)
    return null;
  let gutters = null, contents = null;
  if (gutterWidth > 0)
    gutters = lines2.map((l3) => sliceAnsi(l3, 0, gutterWidth)), contents = lines2.map((l3) => sliceAnsi(l3, gutterWidth));
  let entry = {
    lines: lines2,
    gutterWidth,
    gutters,
    contents
  };
  if (!perHunk)
    perHunk = /* @__PURE__ */ new Map, RENDER_CACHE.set(patch, perHunk);
  if (perHunk.size >= 4)
    perHunk.clear();
  return perHunk.set(key2, entry), entry;
}
var import_compiler_runtime111, import_react78, jsx_dev_runtime128, RENDER_CACHE, StructuredDiff;
var init_StructuredDiff = __esm(() => {
  init_useSettings();
  init_ink2();
  init_fullscreen();
  init_sliceAnsi();
  init_colorDiff();
  init_Fallback2();
  import_compiler_runtime111 = __toESM(require_react_compiler_runtime_development(), 1), import_react78 = __toESM(require_react_development(), 1), jsx_dev_runtime128 = __toESM(require_react_jsx_dev_runtime_development(), 1), RENDER_CACHE = /* @__PURE__ */ new WeakMap;
  StructuredDiff = import_react78.memo(function(t0) {
    let $3 = import_compiler_runtime111.c(26), {
      patch,
      dim: dim2,
      filePath,
      firstLine,
      fileContent,
      width,
      skipHighlighting: t1
    } = t0, skipHighlighting = t1 === void 0 ? !1 : t1, [theme] = useTheme(), syntaxHighlightingDisabled = useSettings().syntaxHighlightingDisabled ?? !1, safeWidth = Math.max(1, Math.floor(width)), t2;
    if ($3[0] !== dim2 || $3[1] !== fileContent || $3[2] !== filePath || $3[3] !== firstLine || $3[4] !== patch || $3[5] !== safeWidth || $3[6] !== skipHighlighting || $3[7] !== syntaxHighlightingDisabled || $3[8] !== theme) {
      let splitGutter = isFullscreenEnvEnabled();
      t2 = skipHighlighting || syntaxHighlightingDisabled ? null : renderColorDiff(patch, firstLine, filePath, fileContent ?? null, theme, safeWidth, dim2, splitGutter), $3[0] = dim2, $3[1] = fileContent, $3[2] = filePath, $3[3] = firstLine, $3[4] = patch, $3[5] = safeWidth, $3[6] = skipHighlighting, $3[7] = syntaxHighlightingDisabled, $3[8] = theme, $3[9] = t2;
    } else
      t2 = $3[9];
    let cached3 = t2;
    if (!cached3) {
      let t32;
      if ($3[10] !== dim2 || $3[11] !== patch || $3[12] !== width)
        t32 = /* @__PURE__ */ jsx_dev_runtime128.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime128.jsxDEV(StructuredDiffFallback, {
            patch,
            dim: dim2,
            width
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[10] = dim2, $3[11] = patch, $3[12] = width, $3[13] = t32;
      else
        t32 = $3[13];
      return t32;
    }
    let {
      lines: lines2,
      gutterWidth,
      gutters,
      contents
    } = cached3;
    if (gutterWidth > 0 && gutters && contents) {
      let t32;
      if ($3[14] !== gutterWidth || $3[15] !== gutters)
        t32 = /* @__PURE__ */ jsx_dev_runtime128.jsxDEV(NoSelect, {
          fromLeftEdge: !0,
          children: /* @__PURE__ */ jsx_dev_runtime128.jsxDEV(RawAnsi, {
            lines: gutters,
            width: gutterWidth
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[14] = gutterWidth, $3[15] = gutters, $3[16] = t32;
      else
        t32 = $3[16];
      let t4 = safeWidth - gutterWidth, t5;
      if ($3[17] !== contents || $3[18] !== t4)
        t5 = /* @__PURE__ */ jsx_dev_runtime128.jsxDEV(RawAnsi, {
          lines: contents,
          width: t4
        }, void 0, !1, void 0, this), $3[17] = contents, $3[18] = t4, $3[19] = t5;
      else
        t5 = $3[19];
      let t6;
      if ($3[20] !== t32 || $3[21] !== t5)
        t6 = /* @__PURE__ */ jsx_dev_runtime128.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          children: [
            t32,
            t5
          ]
        }, void 0, !0, void 0, this), $3[20] = t32, $3[21] = t5, $3[22] = t6;
      else
        t6 = $3[22];
      return t6;
    }
    let t3;
    if ($3[23] !== lines2 || $3[24] !== safeWidth)
      t3 = /* @__PURE__ */ jsx_dev_runtime128.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime128.jsxDEV(RawAnsi, {
          lines: lines2,
          width: safeWidth
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[23] = lines2, $3[24] = safeWidth, $3[25] = t3;
    else
      t3 = $3[25];
    return t3;
  });
});
