// Original: src/components/HighlightedCode.tsx
function CodeLine(t0) {
  let $3 = import_compiler_runtime109.c(13), {
    line,
    gutterWidth
  } = t0, t1;
  if ($3[0] !== gutterWidth || $3[1] !== line)
    t1 = sliceAnsi(line, 0, gutterWidth), $3[0] = gutterWidth, $3[1] = line, $3[2] = t1;
  else
    t1 = $3[2];
  let gutter = t1, t2;
  if ($3[3] !== gutterWidth || $3[4] !== line)
    t2 = sliceAnsi(line, gutterWidth), $3[3] = gutterWidth, $3[4] = line, $3[5] = t2;
  else
    t2 = $3[5];
  let content = t2, t3;
  if ($3[6] !== gutter)
    t3 = /* @__PURE__ */ jsx_dev_runtime126.jsxDEV(NoSelect, {
      fromLeftEdge: !0,
      children: /* @__PURE__ */ jsx_dev_runtime126.jsxDEV(ThemedText, {
        children: /* @__PURE__ */ jsx_dev_runtime126.jsxDEV(Ansi, {
          children: gutter
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[6] = gutter, $3[7] = t3;
  else
    t3 = $3[7];
  let t4;
  if ($3[8] !== content)
    t4 = /* @__PURE__ */ jsx_dev_runtime126.jsxDEV(ThemedText, {
      children: /* @__PURE__ */ jsx_dev_runtime126.jsxDEV(Ansi, {
        children: content
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[8] = content, $3[9] = t4;
  else
    t4 = $3[9];
  let t5;
  if ($3[10] !== t3 || $3[11] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime126.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[10] = t3, $3[11] = t4, $3[12] = t5;
  else
    t5 = $3[12];
  return t5;
}
var import_compiler_runtime109, import_react77, jsx_dev_runtime126, DEFAULT_WIDTH = 80, HighlightedCode;
var init_HighlightedCode = __esm(() => {
  init_useSettings();
  init_ink2();
  init_fullscreen();
  init_sliceAnsi();
  init_Fallback();
  init_colorDiff();
  import_compiler_runtime109 = __toESM(require_react_compiler_runtime_development(), 1), import_react77 = __toESM(require_react_development(), 1), jsx_dev_runtime126 = __toESM(require_react_jsx_dev_runtime_development(), 1), HighlightedCode = import_react77.memo(function(t0) {
    let $3 = import_compiler_runtime109.c(21), {
      code,
      filePath,
      width,
      dim: t1
    } = t0, dim2 = t1 === void 0 ? !1 : t1, ref = import_react77.useRef(null), [measuredWidth, setMeasuredWidth] = import_react77.useState(width || DEFAULT_WIDTH), [theme] = useTheme(), syntaxHighlightingDisabled = useSettings().syntaxHighlightingDisabled ?? !1, t2;
    bb0: {
      if (syntaxHighlightingDisabled) {
        t2 = null;
        break bb0;
      }
      let t32;
      if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
        t32 = expectColorFile(), $3[0] = t32;
      else
        t32 = $3[0];
      let ColorFile2 = t32;
      if (!ColorFile2) {
        t2 = null;
        break bb0;
      }
      let t42;
      if ($3[1] !== code || $3[2] !== filePath)
        t42 = new ColorFile2(code, filePath), $3[1] = code, $3[2] = filePath, $3[3] = t42;
      else
        t42 = $3[3];
      t2 = t42;
    }
    let colorFile = t2, t3, t4;
    if ($3[4] !== width)
      t3 = () => {
        if (!width && ref.current) {
          let {
            width: elementWidth
          } = measure_element_default(ref.current);
          if (elementWidth > 0)
            setMeasuredWidth(elementWidth - 2);
        }
      }, t4 = [width], $3[4] = width, $3[5] = t3, $3[6] = t4;
    else
      t3 = $3[5], t4 = $3[6];
    import_react77.useEffect(t3, t4);
    let t5;
    bb1: {
      if (colorFile === null) {
        t5 = null;
        break bb1;
      }
      let t62;
      if ($3[7] !== colorFile || $3[8] !== dim2 || $3[9] !== measuredWidth || $3[10] !== theme)
        t62 = colorFile.render(theme, measuredWidth, dim2), $3[7] = colorFile, $3[8] = dim2, $3[9] = measuredWidth, $3[10] = theme, $3[11] = t62;
      else
        t62 = $3[11];
      t5 = t62;
    }
    let lines2 = t5, t6;
    bb2: {
      if (!isFullscreenEnvEnabled()) {
        t6 = 0;
        break bb2;
      }
      let lineCount = countCharInString(code, `
`) + 1, t72;
      if ($3[12] !== lineCount)
        t72 = lineCount.toString(), $3[12] = lineCount, $3[13] = t72;
      else
        t72 = $3[13];
      t6 = t72.length + 2;
    }
    let gutterWidth = t6, t7;
    if ($3[14] !== code || $3[15] !== dim2 || $3[16] !== filePath || $3[17] !== gutterWidth || $3[18] !== lines2 || $3[19] !== syntaxHighlightingDisabled)
      t7 = /* @__PURE__ */ jsx_dev_runtime126.jsxDEV(ThemedBox_default, {
        ref,
        children: lines2 ? /* @__PURE__ */ jsx_dev_runtime126.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: lines2.map((line, i5) => gutterWidth > 0 ? /* @__PURE__ */ jsx_dev_runtime126.jsxDEV(CodeLine, {
            line,
            gutterWidth
          }, i5, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime126.jsxDEV(ThemedText, {
            children: /* @__PURE__ */ jsx_dev_runtime126.jsxDEV(Ansi, {
              children: line
            }, void 0, !1, void 0, this)
          }, i5, !1, void 0, this))
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime126.jsxDEV(HighlightedCodeFallback, {
          code,
          filePath,
          dim: dim2,
          skipColoring: syntaxHighlightingDisabled
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[14] = code, $3[15] = dim2, $3[16] = filePath, $3[17] = gutterWidth, $3[18] = lines2, $3[19] = syntaxHighlightingDisabled, $3[20] = t7;
    else
      t7 = $3[20];
    return t7;
  });
});
