// Original: src/components/permissions/NotebookEditPermissionRequest/NotebookEditToolDiff.tsx
import { relative as relative33 } from "path";
function NotebookEditToolDiff(props) {
  let $3 = import_compiler_runtime307.c(5), t0;
  if ($3[0] !== props.notebook_path)
    t0 = getFsImplementation().readFile(props.notebook_path, {
      encoding: "utf-8"
    }).then(_temp189).catch(_temp278), $3[0] = props.notebook_path, $3[1] = t0;
  else
    t0 = $3[1];
  let notebookDataPromise = t0, t1;
  if ($3[2] !== notebookDataPromise || $3[3] !== props)
    t1 = /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(import_react218.Suspense, {
      fallback: null,
      children: /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(NotebookEditToolDiffInner, {
        ...props,
        promise: notebookDataPromise
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[2] = notebookDataPromise, $3[3] = props, $3[4] = t1;
  else
    t1 = $3[4];
  return t1;
}
function _temp278() {
  return null;
}
function _temp189(content) {
  return safeParseJSON(content);
}
function NotebookEditToolDiffInner(t0) {
  let $3 = import_compiler_runtime307.c(34), {
    notebook_path,
    cell_id,
    new_source,
    cell_type,
    edit_mode: t1,
    verbose,
    width,
    promise: promise3
  } = t0, edit_mode = t1 === void 0 ? "replace" : t1, notebookData = import_react218.use(promise3), t2;
  if ($3[0] !== cell_id || $3[1] !== notebookData) {
    bb0: {
      if (!notebookData || !cell_id) {
        t2 = "";
        break bb0;
      }
      let cellIndex = parseCellId(cell_id);
      if (cellIndex !== void 0) {
        if (notebookData.cells[cellIndex]) {
          let source = notebookData.cells[cellIndex].source, t33;
          if ($3[3] !== source)
            t33 = Array.isArray(source) ? source.join("") : source, $3[3] = source, $3[4] = t33;
          else
            t33 = $3[4];
          t2 = t33;
          break bb0;
        }
        t2 = "";
        break bb0;
      }
      let t32;
      if ($3[5] !== cell_id)
        t32 = (cell) => cell.id === cell_id, $3[5] = cell_id, $3[6] = t32;
      else
        t32 = $3[6];
      let cell_0 = notebookData.cells.find(t32);
      if (!cell_0) {
        t2 = "";
        break bb0;
      }
      t2 = Array.isArray(cell_0.source) ? cell_0.source.join("") : cell_0.source;
    }
    $3[0] = cell_id, $3[1] = notebookData, $3[2] = t2;
  } else
    t2 = $3[2];
  let oldSource = t2, t3;
  bb1: {
    if (!notebookData || edit_mode === "insert" || edit_mode === "delete") {
      t3 = null;
      break bb1;
    }
    let t42;
    if ($3[7] !== new_source || $3[8] !== notebook_path || $3[9] !== oldSource)
      t42 = getPatchForDisplay({
        filePath: notebook_path,
        fileContents: oldSource,
        edits: [{
          old_string: oldSource,
          new_string: new_source,
          replace_all: !1
        }],
        ignoreWhitespace: !1
      }), $3[7] = new_source, $3[8] = notebook_path, $3[9] = oldSource, $3[10] = t42;
    else
      t42 = $3[10];
    t3 = t42;
  }
  let hunks = t3, editTypeDescription;
  bb2:
    switch (edit_mode) {
      case "insert": {
        editTypeDescription = "Insert new cell";
        break bb2;
      }
      case "delete": {
        editTypeDescription = "Delete cell";
        break bb2;
      }
      default:
        editTypeDescription = "Replace cell contents";
    }
  let t4;
  if ($3[11] !== notebook_path || $3[12] !== verbose)
    t4 = verbose ? notebook_path : relative33(getCwd(), notebook_path), $3[11] = notebook_path, $3[12] = verbose, $3[13] = t4;
  else
    t4 = $3[13];
  let t5;
  if ($3[14] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(ThemedText, {
      bold: !0,
      children: t4
    }, void 0, !1, void 0, this), $3[14] = t4, $3[15] = t5;
  else
    t5 = $3[15];
  let t6 = cell_type ? ` (${cell_type})` : "", t7;
  if ($3[16] !== cell_id || $3[17] !== editTypeDescription || $3[18] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        editTypeDescription,
        " for cell ",
        cell_id,
        t6
      ]
    }, void 0, !0, void 0, this), $3[16] = cell_id, $3[17] = editTypeDescription, $3[18] = t6, $3[19] = t7;
  else
    t7 = $3[19];
  let t8;
  if ($3[20] !== t5 || $3[21] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(ThemedBox_default, {
      paddingBottom: 1,
      flexDirection: "column",
      children: [
        t5,
        t7
      ]
    }, void 0, !0, void 0, this), $3[20] = t5, $3[21] = t7, $3[22] = t8;
  else
    t8 = $3[22];
  let t9;
  if ($3[23] !== cell_type || $3[24] !== edit_mode || $3[25] !== hunks || $3[26] !== new_source || $3[27] !== notebook_path || $3[28] !== oldSource || $3[29] !== width)
    t9 = edit_mode === "delete" ? /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingLeft: 2,
      children: /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(HighlightedCode, {
        code: oldSource,
        filePath: notebook_path
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : edit_mode === "insert" ? /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingLeft: 2,
      children: /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(HighlightedCode, {
        code: new_source,
        filePath: cell_type === "markdown" ? "file.md" : notebook_path
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : hunks ? intersperse(hunks.map((_) => /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(StructuredDiff, {
      patch: _,
      dim: !1,
      width,
      filePath: notebook_path,
      firstLine: new_source.split(`
`)[0] ?? null,
      fileContent: oldSource
    }, _.newStart, !1, void 0, this)), _temp352) : /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(HighlightedCode, {
      code: new_source,
      filePath: cell_type === "markdown" ? "file.md" : notebook_path
    }, void 0, !1, void 0, this), $3[23] = cell_type, $3[24] = edit_mode, $3[25] = hunks, $3[26] = new_source, $3[27] = notebook_path, $3[28] = oldSource, $3[29] = width, $3[30] = t9;
  else
    t9 = $3[30];
  let t10;
  if ($3[31] !== t8 || $3[32] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(ThemedBox_default, {
        borderStyle: "round",
        flexDirection: "column",
        paddingX: 1,
        children: [
          t8,
          t9
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[31] = t8, $3[32] = t9, $3[33] = t10;
  else
    t10 = $3[33];
  return t10;
}
function _temp352(i5) {
  return /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(NoSelect, {
    fromLeftEdge: !0,
    children: /* @__PURE__ */ jsx_dev_runtime395.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "..."
    }, void 0, !1, void 0, this)
  }, `ellipsis-${i5}`, !1, void 0, this);
}
var import_compiler_runtime307, import_react218, jsx_dev_runtime395;
var init_NotebookEditToolDiff = __esm(() => {
  init_ink2();
  init_cwd2();
  init_diff2();
  init_fsOperations();
  init_json();
  init_notebook();
  init_HighlightedCode();
  init_StructuredDiff();
  import_compiler_runtime307 = __toESM(require_react_compiler_runtime_development(), 1), import_react218 = __toESM(require_react_development(), 1), jsx_dev_runtime395 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
