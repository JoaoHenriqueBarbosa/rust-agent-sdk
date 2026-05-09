// Original: src/components/NotebookEditToolUseRejectedMessage.tsx
import { relative as relative17 } from "path";
function NotebookEditToolUseRejectedMessage(t0) {
  let $3 = import_compiler_runtime117.c(20), {
    notebook_path,
    cell_id,
    new_source,
    cell_type,
    edit_mode: t1,
    verbose
  } = t0, edit_mode = t1 === void 0 ? "replace" : t1, operation = edit_mode === "delete" ? "delete" : `${edit_mode} cell in`, t2;
  if ($3[0] !== operation)
    t2 = /* @__PURE__ */ jsx_dev_runtime136.jsxDEV(ThemedText, {
      color: "subtle",
      children: [
        "User rejected ",
        operation,
        " "
      ]
    }, void 0, !0, void 0, this), $3[0] = operation, $3[1] = t2;
  else
    t2 = $3[1];
  let t3;
  if ($3[2] !== notebook_path || $3[3] !== verbose)
    t3 = verbose ? notebook_path : relative17(getCwd(), notebook_path), $3[2] = notebook_path, $3[3] = verbose, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime136.jsxDEV(ThemedText, {
      bold: !0,
      color: "subtle",
      children: t3
    }, void 0, !1, void 0, this), $3[5] = t3, $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] !== cell_id)
    t5 = /* @__PURE__ */ jsx_dev_runtime136.jsxDEV(ThemedText, {
      color: "subtle",
      children: [
        " at cell ",
        cell_id
      ]
    }, void 0, !0, void 0, this), $3[7] = cell_id, $3[8] = t5;
  else
    t5 = $3[8];
  let t6;
  if ($3[9] !== t2 || $3[10] !== t4 || $3[11] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime136.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        t2,
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[9] = t2, $3[10] = t4, $3[11] = t5, $3[12] = t6;
  else
    t6 = $3[12];
  let t7;
  if ($3[13] !== cell_type || $3[14] !== edit_mode || $3[15] !== new_source)
    t7 = edit_mode !== "delete" && /* @__PURE__ */ jsx_dev_runtime136.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime136.jsxDEV(HighlightedCode, {
        code: new_source,
        filePath: cell_type === "markdown" ? "file.md" : "file.py",
        dim: !0
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[13] = cell_type, $3[14] = edit_mode, $3[15] = new_source, $3[16] = t7;
  else
    t7 = $3[16];
  let t8;
  if ($3[17] !== t6 || $3[18] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime136.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime136.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t6,
          t7
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[17] = t6, $3[18] = t7, $3[19] = t8;
  else
    t8 = $3[19];
  return t8;
}
var import_compiler_runtime117, jsx_dev_runtime136;
var init_NotebookEditToolUseRejectedMessage = __esm(() => {
  init_cwd2();
  init_ink2();
  init_HighlightedCode();
  init_MessageResponse();
  import_compiler_runtime117 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime136 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
