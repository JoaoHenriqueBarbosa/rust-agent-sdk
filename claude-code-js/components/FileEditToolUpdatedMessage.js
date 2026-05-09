// Original: src/components/FileEditToolUpdatedMessage.tsx
function FileEditToolUpdatedMessage(t0) {
  let $3 = import_compiler_runtime113.c(22), {
    filePath,
    structuredPatch: structuredPatch2,
    firstLine,
    fileContent,
    style,
    verbose,
    previewHint
  } = t0, {
    columns
  } = useTerminalSize(), numAdditions = structuredPatch2.reduce(_temp211, 0), numRemovals = structuredPatch2.reduce(_temp47, 0), t1;
  if ($3[0] !== numAdditions)
    t1 = numAdditions > 0 ? /* @__PURE__ */ jsx_dev_runtime131.jsxDEV(jsx_dev_runtime131.Fragment, {
      children: [
        "Added ",
        /* @__PURE__ */ jsx_dev_runtime131.jsxDEV(ThemedText, {
          bold: !0,
          children: numAdditions
        }, void 0, !1, void 0, this),
        " ",
        numAdditions > 1 ? "lines" : "line"
      ]
    }, void 0, !0, void 0, this) : null, $3[0] = numAdditions, $3[1] = t1;
  else
    t1 = $3[1];
  let t2 = numAdditions > 0 && numRemovals > 0 ? ", " : null, t3;
  if ($3[2] !== numAdditions || $3[3] !== numRemovals)
    t3 = numRemovals > 0 ? /* @__PURE__ */ jsx_dev_runtime131.jsxDEV(jsx_dev_runtime131.Fragment, {
      children: [
        numAdditions === 0 ? "R" : "r",
        "emoved ",
        /* @__PURE__ */ jsx_dev_runtime131.jsxDEV(ThemedText, {
          bold: !0,
          children: numRemovals
        }, void 0, !1, void 0, this),
        " ",
        numRemovals > 1 ? "lines" : "line"
      ]
    }, void 0, !0, void 0, this) : null, $3[2] = numAdditions, $3[3] = numRemovals, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== t1 || $3[6] !== t2 || $3[7] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime131.jsxDEV(ThemedText, {
      children: [
        t1,
        t2,
        t3
      ]
    }, void 0, !0, void 0, this), $3[5] = t1, $3[6] = t2, $3[7] = t3, $3[8] = t4;
  else
    t4 = $3[8];
  let text2 = t4;
  if (previewHint) {
    if (style !== "condensed" && !verbose) {
      let t52;
      if ($3[9] !== previewHint)
        t52 = /* @__PURE__ */ jsx_dev_runtime131.jsxDEV(MessageResponse, {
          children: /* @__PURE__ */ jsx_dev_runtime131.jsxDEV(ThemedText, {
            dimColor: !0,
            children: previewHint
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[9] = previewHint, $3[10] = t52;
      else
        t52 = $3[10];
      return t52;
    }
  } else if (style === "condensed" && !verbose)
    return text2;
  let t5;
  if ($3[11] !== text2)
    t5 = /* @__PURE__ */ jsx_dev_runtime131.jsxDEV(ThemedText, {
      children: text2
    }, void 0, !1, void 0, this), $3[11] = text2, $3[12] = t5;
  else
    t5 = $3[12];
  let t6 = columns - 12, t7;
  if ($3[13] !== fileContent || $3[14] !== filePath || $3[15] !== firstLine || $3[16] !== structuredPatch2 || $3[17] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime131.jsxDEV(StructuredDiffList, {
      hunks: structuredPatch2,
      dim: !1,
      width: t6,
      filePath,
      firstLine,
      fileContent
    }, void 0, !1, void 0, this), $3[13] = fileContent, $3[14] = filePath, $3[15] = firstLine, $3[16] = structuredPatch2, $3[17] = t6, $3[18] = t7;
  else
    t7 = $3[18];
  let t8;
  if ($3[19] !== t5 || $3[20] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime131.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime131.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t5,
          t7
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[19] = t5, $3[20] = t7, $3[21] = t8;
  else
    t8 = $3[21];
  return t8;
}
function _temp47(acc_0, hunk_0) {
  return acc_0 + count2(hunk_0.lines, _temp310);
}
function _temp310(__0) {
  return __0.startsWith("-");
}
function _temp211(acc, hunk) {
  return acc + count2(hunk.lines, _temp48);
}
function _temp48(_) {
  return _.startsWith("+");
}
var import_compiler_runtime113, jsx_dev_runtime131;
var init_FileEditToolUpdatedMessage = __esm(() => {
  init_useTerminalSize();
  init_ink2();
  init_MessageResponse();
  init_StructuredDiffList();
  import_compiler_runtime113 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime131 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
