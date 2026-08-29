// Original: src/components/permissions/FileWritePermissionRequest/FileWriteToolDiff.tsx
function FileWriteToolDiff(t0) {
  let $3 = import_compiler_runtime305.c(15), {
    file_path,
    content,
    fileExists,
    oldContent
  } = t0, {
    columns
  } = useTerminalSize(), t1;
  bb0: {
    if (!fileExists) {
      t1 = null;
      break bb0;
    }
    let t22;
    if ($3[0] !== content || $3[1] !== file_path || $3[2] !== oldContent)
      t22 = getPatchForDisplay({
        filePath: file_path,
        fileContents: oldContent,
        edits: [{
          old_string: oldContent,
          new_string: content,
          replace_all: !1
        }]
      }), $3[0] = content, $3[1] = file_path, $3[2] = oldContent, $3[3] = t22;
    else
      t22 = $3[3];
    t1 = t22;
  }
  let hunks = t1, t2;
  if ($3[4] !== content)
    t2 = content.split(`
`)[0] ?? null, $3[4] = content, $3[5] = t2;
  else
    t2 = $3[5];
  let firstLine = t2, t3;
  if ($3[6] !== columns || $3[7] !== content || $3[8] !== file_path || $3[9] !== firstLine || $3[10] !== hunks || $3[11] !== oldContent)
    t3 = hunks ? intersperse(hunks.map((_) => /* @__PURE__ */ jsx_dev_runtime393.jsxDEV(StructuredDiff, {
      patch: _,
      dim: !1,
      filePath: file_path,
      firstLine,
      fileContent: oldContent,
      width: columns - 2
    }, _.newStart, !1, void 0, this)), _temp187) : /* @__PURE__ */ jsx_dev_runtime393.jsxDEV(HighlightedCode, {
      code: content || "(No content)",
      filePath: file_path
    }, void 0, !1, void 0, this), $3[6] = columns, $3[7] = content, $3[8] = file_path, $3[9] = firstLine, $3[10] = hunks, $3[11] = oldContent, $3[12] = t3;
  else
    t3 = $3[12];
  let t4;
  if ($3[13] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime393.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime393.jsxDEV(ThemedBox_default, {
        borderColor: "subtle",
        borderStyle: "dashed",
        flexDirection: "column",
        borderLeft: !1,
        borderRight: !1,
        paddingX: 1,
        children: t3
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[13] = t3, $3[14] = t4;
  else
    t4 = $3[14];
  return t4;
}
function _temp187(i5) {
  return /* @__PURE__ */ jsx_dev_runtime393.jsxDEV(NoSelect, {
    fromLeftEdge: !0,
    children: /* @__PURE__ */ jsx_dev_runtime393.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "..."
    }, void 0, !1, void 0, this)
  }, `ellipsis-${i5}`, !1, void 0, this);
}
var import_compiler_runtime305, jsx_dev_runtime393;
var init_FileWriteToolDiff = __esm(() => {
  init_useTerminalSize();
  init_ink2();
  init_diff2();
  init_HighlightedCode();
  init_StructuredDiff();
  import_compiler_runtime305 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime393 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
