// Original: src/components/diff/DiffDetailView.tsx
import { resolve as resolve41 } from "path";
function DiffDetailView(t0) {
  let $3 = import_compiler_runtime150.c(53), {
    filePath,
    hunks,
    isLargeFile,
    isBinary,
    isTruncated,
    isUntracked
  } = t0, {
    columns
  } = useTerminalSize(), t1;
  bb0: {
    if (!filePath) {
      let t23;
      if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
        t23 = {
          firstLine: null,
          fileContent: void 0
        }, $3[0] = t23;
      else
        t23 = $3[0];
      t1 = t23;
      break bb0;
    }
    let content, t22;
    if ($3[1] !== filePath) {
      let fullPath = resolve41(getCwd(), filePath);
      content = readFileSafe(fullPath), t22 = content?.split(`
`)[0] ?? null, $3[1] = filePath, $3[2] = content, $3[3] = t22;
    } else
      content = $3[2], t22 = $3[3];
    let t32 = content ?? void 0, t42;
    if ($3[4] !== t22 || $3[5] !== t32)
      t42 = {
        firstLine: t22,
        fileContent: t32
      }, $3[4] = t22, $3[5] = t32, $3[6] = t42;
    else
      t42 = $3[6];
    t1 = t42;
  }
  let {
    firstLine,
    fileContent
  } = t1;
  if (isUntracked) {
    let t22;
    if ($3[7] !== filePath)
      t22 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedText, {
        bold: !0,
        children: filePath
      }, void 0, !1, void 0, this), $3[7] = filePath, $3[8] = t22;
    else
      t22 = $3[8];
    let t32;
    if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
      t32 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedText, {
        dimColor: !0,
        children: " (untracked)"
      }, void 0, !1, void 0, this), $3[9] = t32;
    else
      t32 = $3[9];
    let t42;
    if ($3[10] !== t22)
      t42 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedBox_default, {
        children: [
          t22,
          t32
        ]
      }, void 0, !0, void 0, this), $3[10] = t22, $3[11] = t42;
    else
      t42 = $3[11];
    let t52;
    if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
      t52 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(Divider, {
        padding: 4
      }, void 0, !1, void 0, this), $3[12] = t52;
    else
      t52 = $3[12];
    let t62;
    if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
      t62 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: "New file not yet staged."
      }, void 0, !1, void 0, this), $3[13] = t62;
    else
      t62 = $3[13];
    let t72;
    if ($3[14] !== filePath)
      t72 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t62,
          /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: [
              "Run `git add ",
              filePath,
              "` to see line counts."
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[14] = filePath, $3[15] = t72;
    else
      t72 = $3[15];
    let t82;
    if ($3[16] !== t42 || $3[17] !== t72)
      t82 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        width: "100%",
        children: [
          t42,
          t52,
          t72
        ]
      }, void 0, !0, void 0, this), $3[16] = t42, $3[17] = t72, $3[18] = t82;
    else
      t82 = $3[18];
    return t82;
  }
  if (isBinary) {
    let t22;
    if ($3[19] !== filePath)
      t22 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedText, {
          bold: !0,
          children: filePath
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[19] = filePath, $3[20] = t22;
    else
      t22 = $3[20];
    let t32;
    if ($3[21] === Symbol.for("react.memo_cache_sentinel"))
      t32 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(Divider, {
        padding: 4
      }, void 0, !1, void 0, this), $3[21] = t32;
    else
      t32 = $3[21];
    let t42;
    if ($3[22] === Symbol.for("react.memo_cache_sentinel"))
      t42 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedText, {
          dimColor: !0,
          italic: !0,
          children: "Binary file - cannot display diff"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[22] = t42;
    else
      t42 = $3[22];
    let t52;
    if ($3[23] !== t22)
      t52 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        width: "100%",
        children: [
          t22,
          t32,
          t42
        ]
      }, void 0, !0, void 0, this), $3[23] = t22, $3[24] = t52;
    else
      t52 = $3[24];
    return t52;
  }
  if (isLargeFile) {
    let t22;
    if ($3[25] !== filePath)
      t22 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedText, {
          bold: !0,
          children: filePath
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[25] = filePath, $3[26] = t22;
    else
      t22 = $3[26];
    let t32;
    if ($3[27] === Symbol.for("react.memo_cache_sentinel"))
      t32 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(Divider, {
        padding: 4
      }, void 0, !1, void 0, this), $3[27] = t32;
    else
      t32 = $3[27];
    let t42;
    if ($3[28] === Symbol.for("react.memo_cache_sentinel"))
      t42 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedText, {
          dimColor: !0,
          italic: !0,
          children: "Large file - diff exceeds 1 MB limit"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[28] = t42;
    else
      t42 = $3[28];
    let t52;
    if ($3[29] !== t22)
      t52 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        width: "100%",
        children: [
          t22,
          t32,
          t42
        ]
      }, void 0, !0, void 0, this), $3[29] = t22, $3[30] = t52;
    else
      t52 = $3[30];
    return t52;
  }
  let t2;
  if ($3[31] !== filePath)
    t2 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedText, {
      bold: !0,
      children: filePath
    }, void 0, !1, void 0, this), $3[31] = filePath, $3[32] = t2;
  else
    t2 = $3[32];
  let t3;
  if ($3[33] !== isTruncated)
    t3 = isTruncated && /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedText, {
      dimColor: !0,
      children: " (truncated)"
    }, void 0, !1, void 0, this), $3[33] = isTruncated, $3[34] = t3;
  else
    t3 = $3[34];
  let t4;
  if ($3[35] !== t2 || $3[36] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedBox_default, {
      children: [
        t2,
        t3
      ]
    }, void 0, !0, void 0, this), $3[35] = t2, $3[36] = t3, $3[37] = t4;
  else
    t4 = $3[37];
  let t5;
  if ($3[38] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(Divider, {
      padding: 4
    }, void 0, !1, void 0, this), $3[38] = t5;
  else
    t5 = $3[38];
  let t6;
  if ($3[39] !== columns || $3[40] !== fileContent || $3[41] !== filePath || $3[42] !== firstLine || $3[43] !== hunks)
    t6 = hunks.length === 0 ? /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "No diff content"
    }, void 0, !1, void 0, this) : hunks.map((hunk, index) => /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(StructuredDiff, {
      patch: hunk,
      filePath,
      firstLine,
      fileContent,
      dim: !1,
      width: columns - 2 - 2
    }, index, !1, void 0, this)), $3[39] = columns, $3[40] = fileContent, $3[41] = filePath, $3[42] = firstLine, $3[43] = hunks, $3[44] = t6;
  else
    t6 = $3[44];
  let t7;
  if ($3[45] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: t6
    }, void 0, !1, void 0, this), $3[45] = t6, $3[46] = t7;
  else
    t7 = $3[46];
  let t8;
  if ($3[47] !== isTruncated)
    t8 = isTruncated && /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedText, {
      dimColor: !0,
      italic: !0,
      children: "\u2026 diff truncated (exceeded 400 line limit)"
    }, void 0, !1, void 0, this), $3[47] = isTruncated, $3[48] = t8;
  else
    t8 = $3[48];
  let t9;
  if ($3[49] !== t4 || $3[50] !== t7 || $3[51] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime189.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      width: "100%",
      children: [
        t4,
        t5,
        t7,
        t8
      ]
    }, void 0, !0, void 0, this), $3[49] = t4, $3[50] = t7, $3[51] = t8, $3[52] = t9;
  else
    t9 = $3[52];
  return t9;
}
var import_compiler_runtime150, jsx_dev_runtime189;
var init_DiffDetailView = __esm(() => {
  init_useTerminalSize();
  init_ink2();
  init_cwd2();
  init_file();
  init_Divider();
  init_StructuredDiff();
  import_compiler_runtime150 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime189 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
