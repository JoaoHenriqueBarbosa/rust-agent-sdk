// Original: src/components/permissions/AskUserQuestionPermissionRequest/PreviewBox.tsx
function PreviewBox(props) {
  let $3 = import_compiler_runtime288.c(4);
  if (useSettings().syntaxHighlightingDisabled) {
    let t02;
    if ($3[0] !== props)
      t02 = /* @__PURE__ */ jsx_dev_runtime371.jsxDEV(PreviewBoxBody, {
        ...props,
        highlight: null
      }, void 0, !1, void 0, this), $3[0] = props, $3[1] = t02;
    else
      t02 = $3[1];
    return t02;
  }
  let t0;
  if ($3[2] !== props)
    t0 = /* @__PURE__ */ jsx_dev_runtime371.jsxDEV(import_react202.Suspense, {
      fallback: /* @__PURE__ */ jsx_dev_runtime371.jsxDEV(PreviewBoxBody, {
        ...props,
        highlight: null
      }, void 0, !1, void 0, this),
      children: /* @__PURE__ */ jsx_dev_runtime371.jsxDEV(PreviewBoxWithHighlight, {
        ...props
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[2] = props, $3[3] = t0;
  else
    t0 = $3[3];
  return t0;
}
function PreviewBoxWithHighlight(props) {
  let $3 = import_compiler_runtime288.c(4), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = getCliHighlightPromise(), $3[0] = t0;
  else
    t0 = $3[0];
  let highlight = import_react202.use(t0), t1;
  if ($3[1] !== highlight || $3[2] !== props)
    t1 = /* @__PURE__ */ jsx_dev_runtime371.jsxDEV(PreviewBoxBody, {
      ...props,
      highlight
    }, void 0, !1, void 0, this), $3[1] = highlight, $3[2] = props, $3[3] = t1;
  else
    t1 = $3[3];
  return t1;
}
function PreviewBoxBody(t0) {
  let $3 = import_compiler_runtime288.c(34), {
    content,
    maxLines,
    minHeight,
    minWidth: t1,
    maxWidth,
    highlight
  } = t0, minWidth = t1 === void 0 ? 40 : t1, {
    columns: terminalWidth
  } = useTerminalSize(), [theme2] = useTheme(), effectiveMaxWidth = maxWidth ?? terminalWidth - 4, effectiveMaxLines = maxLines ?? 20, t2;
  if ($3[0] !== content || $3[1] !== highlight || $3[2] !== theme2)
    t2 = applyMarkdown(content, theme2, highlight), $3[0] = content, $3[1] = highlight, $3[2] = theme2, $3[3] = t2;
  else
    t2 = $3[3];
  let rendered = t2, T0, bottomBorder, t3, t4, t5, truncationBar;
  if ($3[4] !== effectiveMaxLines || $3[5] !== effectiveMaxWidth || $3[6] !== minHeight || $3[7] !== minWidth || $3[8] !== rendered) {
    let contentLines = rendered.split(`
`), isTruncated = contentLines.length > effectiveMaxLines, truncatedLines = isTruncated ? contentLines.slice(0, effectiveMaxLines) : contentLines, effectiveMinHeight = Math.min(minHeight ?? 0, effectiveMaxLines), paddingNeeded = Math.max(0, effectiveMinHeight - truncatedLines.length - (isTruncated ? 1 : 0)), lines2 = paddingNeeded > 0 ? [...truncatedLines, ...Array(paddingNeeded).fill("")] : truncatedLines, contentWidth = Math.max(minWidth, ...lines2.map(_temp171)), boxWidth = Math.min(contentWidth + 4, effectiveMaxWidth), innerWidth = boxWidth - 4, t62;
    if ($3[15] !== boxWidth)
      t62 = BOX_CHARS.horizontal.repeat(boxWidth - 2), $3[15] = boxWidth, $3[16] = t62;
    else
      t62 = $3[16];
    let topBorder = `${BOX_CHARS.topLeft}${t62}${BOX_CHARS.topRight}`, t72;
    if ($3[17] !== boxWidth)
      t72 = BOX_CHARS.horizontal.repeat(boxWidth - 2), $3[17] = boxWidth, $3[18] = t72;
    else
      t72 = $3[18];
    if (bottomBorder = `${BOX_CHARS.bottomLeft}${t72}${BOX_CHARS.bottomRight}`, truncationBar = isTruncated ? (() => {
      let hiddenCount = contentLines.length - effectiveMaxLines, label = `${BOX_CHARS.horizontal.repeat(3)} \u2702 ${BOX_CHARS.horizontal.repeat(3)} ${hiddenCount} lines hidden `, labelWidth = stringWidth(label), fillWidth = Math.max(0, boxWidth - 2 - labelWidth);
      return `${BOX_CHARS.teeLeft}${label}${BOX_CHARS.horizontal.repeat(fillWidth)}${BOX_CHARS.teeRight}`;
    })() : null, T0 = ThemedBox_default, t3 = "column", $3[19] !== topBorder)
      t4 = /* @__PURE__ */ jsx_dev_runtime371.jsxDEV(ThemedText, {
        dimColor: !0,
        children: topBorder
      }, void 0, !1, void 0, this), $3[19] = topBorder, $3[20] = t4;
    else
      t4 = $3[20];
    let t82;
    if ($3[21] !== innerWidth)
      t82 = (line_0, index2) => {
        let displayLine = stringWidth(line_0) > innerWidth ? sliceAnsi(line_0, 0, innerWidth) : line_0, padding = " ".repeat(Math.max(0, innerWidth - stringWidth(displayLine)));
        return /* @__PURE__ */ jsx_dev_runtime371.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          children: [
            /* @__PURE__ */ jsx_dev_runtime371.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                BOX_CHARS.vertical,
                " "
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime371.jsxDEV(Ansi, {
              children: displayLine
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime371.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                padding,
                " ",
                BOX_CHARS.vertical
              ]
            }, void 0, !0, void 0, this)
          ]
        }, index2, !0, void 0, this);
      }, $3[21] = innerWidth, $3[22] = t82;
    else
      t82 = $3[22];
    t5 = lines2.map(t82), $3[4] = effectiveMaxLines, $3[5] = effectiveMaxWidth, $3[6] = minHeight, $3[7] = minWidth, $3[8] = rendered, $3[9] = T0, $3[10] = bottomBorder, $3[11] = t3, $3[12] = t4, $3[13] = t5, $3[14] = truncationBar;
  } else
    T0 = $3[9], bottomBorder = $3[10], t3 = $3[11], t4 = $3[12], t5 = $3[13], truncationBar = $3[14];
  let t6;
  if ($3[23] !== truncationBar)
    t6 = truncationBar && /* @__PURE__ */ jsx_dev_runtime371.jsxDEV(ThemedText, {
      color: "warning",
      children: truncationBar
    }, void 0, !1, void 0, this), $3[23] = truncationBar, $3[24] = t6;
  else
    t6 = $3[24];
  let t7;
  if ($3[25] !== bottomBorder)
    t7 = /* @__PURE__ */ jsx_dev_runtime371.jsxDEV(ThemedText, {
      dimColor: !0,
      children: bottomBorder
    }, void 0, !1, void 0, this), $3[25] = bottomBorder, $3[26] = t7;
  else
    t7 = $3[26];
  let t8;
  if ($3[27] !== T0 || $3[28] !== t3 || $3[29] !== t4 || $3[30] !== t5 || $3[31] !== t6 || $3[32] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime371.jsxDEV(T0, {
      flexDirection: t3,
      children: [
        t4,
        t5,
        t6,
        t7
      ]
    }, void 0, !0, void 0, this), $3[27] = T0, $3[28] = t3, $3[29] = t4, $3[30] = t5, $3[31] = t6, $3[32] = t7, $3[33] = t8;
  else
    t8 = $3[33];
  return t8;
}
function _temp171(line) {
  return stringWidth(line);
}
var import_compiler_runtime288, import_react202, jsx_dev_runtime371, BOX_CHARS;
var init_PreviewBox = __esm(() => {
  init_useSettings();
  init_useTerminalSize();
  init_stringWidth();
  init_ink2();
  init_cliHighlight();
  init_markdown();
  init_sliceAnsi();
  import_compiler_runtime288 = __toESM(require_react_compiler_runtime_development(), 1), import_react202 = __toESM(require_react_development(), 1), jsx_dev_runtime371 = __toESM(require_react_jsx_dev_runtime_development(), 1), BOX_CHARS = {
    topLeft: "\u250C",
    topRight: "\u2510",
    bottomLeft: "\u2514",
    bottomRight: "\u2518",
    horizontal: "\u2500",
    vertical: "\u2502",
    teeLeft: "\u251C",
    teeRight: "\u2524"
  };
});
