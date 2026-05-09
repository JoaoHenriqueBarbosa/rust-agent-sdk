// Original: src/components/FileEditToolUseRejectedMessage.tsx
import { relative as relative14 } from "path";
function FileEditToolUseRejectedMessage(t0) {
  let $3 = import_compiler_runtime112.c(38), {
    file_path,
    operation,
    patch,
    firstLine,
    fileContent,
    content,
    style,
    verbose
  } = t0, {
    columns
  } = useTerminalSize(), t1;
  if ($3[0] !== operation)
    t1 = /* @__PURE__ */ jsx_dev_runtime130.jsxDEV(ThemedText, {
      color: "subtle",
      children: [
        "User rejected ",
        operation,
        " to "
      ]
    }, void 0, !0, void 0, this), $3[0] = operation, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== file_path || $3[3] !== verbose)
    t2 = verbose ? file_path : relative14(getCwd(), file_path), $3[2] = file_path, $3[3] = verbose, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime130.jsxDEV(ThemedText, {
      bold: !0,
      color: "subtle",
      children: t2
    }, void 0, !1, void 0, this), $3[5] = t2, $3[6] = t3;
  else
    t3 = $3[6];
  let t4;
  if ($3[7] !== t1 || $3[8] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime130.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        t1,
        t3
      ]
    }, void 0, !0, void 0, this), $3[7] = t1, $3[8] = t3, $3[9] = t4;
  else
    t4 = $3[9];
  let text2 = t4;
  if (style === "condensed" && !verbose) {
    let t52;
    if ($3[10] !== text2)
      t52 = /* @__PURE__ */ jsx_dev_runtime130.jsxDEV(MessageResponse, {
        children: text2
      }, void 0, !1, void 0, this), $3[10] = text2, $3[11] = t52;
    else
      t52 = $3[11];
    return t52;
  }
  if (operation === "write" && content !== void 0) {
    let plusLines, t52;
    if ($3[12] !== content || $3[13] !== verbose) {
      let lines2 = content.split(`
`);
      plusLines = lines2.length - MAX_LINES_TO_RENDER, t52 = verbose ? content : lines2.slice(0, MAX_LINES_TO_RENDER).join(`
`), $3[12] = content, $3[13] = verbose, $3[14] = plusLines, $3[15] = t52;
    } else
      plusLines = $3[14], t52 = $3[15];
    let t62 = t52 || "(No content)", t72 = columns - 12, t8;
    if ($3[16] !== file_path || $3[17] !== t62 || $3[18] !== t72)
      t8 = /* @__PURE__ */ jsx_dev_runtime130.jsxDEV(HighlightedCode, {
        code: t62,
        filePath: file_path,
        width: t72,
        dim: !0
      }, void 0, !1, void 0, this), $3[16] = file_path, $3[17] = t62, $3[18] = t72, $3[19] = t8;
    else
      t8 = $3[19];
    let t9;
    if ($3[20] !== plusLines || $3[21] !== verbose)
      t9 = !verbose && plusLines > 0 && /* @__PURE__ */ jsx_dev_runtime130.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "\u2026 +",
          plusLines,
          " lines"
        ]
      }, void 0, !0, void 0, this), $3[20] = plusLines, $3[21] = verbose, $3[22] = t9;
    else
      t9 = $3[22];
    let t10;
    if ($3[23] !== t8 || $3[24] !== t9 || $3[25] !== text2)
      t10 = /* @__PURE__ */ jsx_dev_runtime130.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime130.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            text2,
            t8,
            t9
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[23] = t8, $3[24] = t9, $3[25] = text2, $3[26] = t10;
    else
      t10 = $3[26];
    return t10;
  }
  if (!patch || patch.length === 0) {
    let t52;
    if ($3[27] !== text2)
      t52 = /* @__PURE__ */ jsx_dev_runtime130.jsxDEV(MessageResponse, {
        children: text2
      }, void 0, !1, void 0, this), $3[27] = text2, $3[28] = t52;
    else
      t52 = $3[28];
    return t52;
  }
  let t5 = columns - 12, t6;
  if ($3[29] !== fileContent || $3[30] !== file_path || $3[31] !== firstLine || $3[32] !== patch || $3[33] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime130.jsxDEV(StructuredDiffList, {
      hunks: patch,
      dim: !0,
      width: t5,
      filePath: file_path,
      firstLine,
      fileContent
    }, void 0, !1, void 0, this), $3[29] = fileContent, $3[30] = file_path, $3[31] = firstLine, $3[32] = patch, $3[33] = t5, $3[34] = t6;
  else
    t6 = $3[34];
  let t7;
  if ($3[35] !== t6 || $3[36] !== text2)
    t7 = /* @__PURE__ */ jsx_dev_runtime130.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime130.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          text2,
          t6
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[35] = t6, $3[36] = text2, $3[37] = t7;
  else
    t7 = $3[37];
  return t7;
}
var import_compiler_runtime112, jsx_dev_runtime130, MAX_LINES_TO_RENDER = 10;
var init_FileEditToolUseRejectedMessage = __esm(() => {
  init_useTerminalSize();
  init_cwd2();
  init_ink2();
  init_HighlightedCode();
  init_MessageResponse();
  init_StructuredDiffList();
  import_compiler_runtime112 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime130 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
