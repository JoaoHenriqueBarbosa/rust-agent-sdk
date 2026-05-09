// Original: src/components/permissions/NotebookEditPermissionRequest/NotebookEditPermissionRequest.tsx
import { basename as basename51 } from "path";
function NotebookEditPermissionRequest(props) {
  let $3 = import_compiler_runtime308.c(52), parseInput = _temp190, T0, T1, T2, language, notebook_path, parsed, t0, t1, t10, t2, t3, t4, t5, t6, t7, t8, t9;
  if ($3[0] !== props.onDone || $3[1] !== props.onReject || $3[2] !== props.toolUseConfirm || $3[3] !== props.toolUseContext || $3[4] !== props.workerBadge) {
    parsed = parseInput(props.toolUseConfirm.input);
    let {
      notebook_path: t112,
      edit_mode,
      cell_type
    } = parsed;
    notebook_path = t112, language = cell_type === "markdown" ? "markdown" : "python";
    let editTypeText = edit_mode === "insert" ? "insert this cell into" : edit_mode === "delete" ? "delete this cell from" : "make this edit to";
    T2 = FilePermissionDialog, t5 = props.toolUseConfirm, t6 = props.toolUseContext, t7 = props.onDone, t8 = props.onReject, t9 = props.workerBadge, t10 = "Edit notebook", T1 = ThemedText, t2 = "Do you want to ", t3 = editTypeText, t4 = " ", T0 = ThemedText, t0 = !0, t1 = basename51(notebook_path), $3[0] = props.onDone, $3[1] = props.onReject, $3[2] = props.toolUseConfirm, $3[3] = props.toolUseContext, $3[4] = props.workerBadge, $3[5] = T0, $3[6] = T1, $3[7] = T2, $3[8] = language, $3[9] = notebook_path, $3[10] = parsed, $3[11] = t0, $3[12] = t1, $3[13] = t10, $3[14] = t2, $3[15] = t3, $3[16] = t4, $3[17] = t5, $3[18] = t6, $3[19] = t7, $3[20] = t8, $3[21] = t9;
  } else
    T0 = $3[5], T1 = $3[6], T2 = $3[7], language = $3[8], notebook_path = $3[9], parsed = $3[10], t0 = $3[11], t1 = $3[12], t10 = $3[13], t2 = $3[14], t3 = $3[15], t4 = $3[16], t5 = $3[17], t6 = $3[18], t7 = $3[19], t8 = $3[20], t9 = $3[21];
  let t11;
  if ($3[22] !== T0 || $3[23] !== t0 || $3[24] !== t1)
    t11 = /* @__PURE__ */ jsx_dev_runtime396.jsxDEV(T0, {
      bold: t0,
      children: t1
    }, void 0, !1, void 0, this), $3[22] = T0, $3[23] = t0, $3[24] = t1, $3[25] = t11;
  else
    t11 = $3[25];
  let t12;
  if ($3[26] !== T1 || $3[27] !== t11 || $3[28] !== t2 || $3[29] !== t3 || $3[30] !== t4)
    t12 = /* @__PURE__ */ jsx_dev_runtime396.jsxDEV(T1, {
      children: [
        t2,
        t3,
        t4,
        t11,
        "?"
      ]
    }, void 0, !0, void 0, this), $3[26] = T1, $3[27] = t11, $3[28] = t2, $3[29] = t3, $3[30] = t4, $3[31] = t12;
  else
    t12 = $3[31];
  let t13 = props.verbose ? 120 : 80, t14;
  if ($3[32] !== parsed.cell_id || $3[33] !== parsed.cell_type || $3[34] !== parsed.edit_mode || $3[35] !== parsed.new_source || $3[36] !== parsed.notebook_path || $3[37] !== props.verbose || $3[38] !== t13)
    t14 = /* @__PURE__ */ jsx_dev_runtime396.jsxDEV(NotebookEditToolDiff, {
      notebook_path: parsed.notebook_path,
      cell_id: parsed.cell_id,
      new_source: parsed.new_source,
      cell_type: parsed.cell_type,
      edit_mode: parsed.edit_mode,
      verbose: props.verbose,
      width: t13
    }, void 0, !1, void 0, this), $3[32] = parsed.cell_id, $3[33] = parsed.cell_type, $3[34] = parsed.edit_mode, $3[35] = parsed.new_source, $3[36] = parsed.notebook_path, $3[37] = props.verbose, $3[38] = t13, $3[39] = t14;
  else
    t14 = $3[39];
  let t15;
  if ($3[40] !== T2 || $3[41] !== language || $3[42] !== notebook_path || $3[43] !== t10 || $3[44] !== t12 || $3[45] !== t14 || $3[46] !== t5 || $3[47] !== t6 || $3[48] !== t7 || $3[49] !== t8 || $3[50] !== t9)
    t15 = /* @__PURE__ */ jsx_dev_runtime396.jsxDEV(T2, {
      toolUseConfirm: t5,
      toolUseContext: t6,
      onDone: t7,
      onReject: t8,
      workerBadge: t9,
      title: t10,
      question: t12,
      content: t14,
      path: notebook_path,
      completionType: "tool_use_single",
      languageName: language,
      parseInput
    }, void 0, !1, void 0, this), $3[40] = T2, $3[41] = language, $3[42] = notebook_path, $3[43] = t10, $3[44] = t12, $3[45] = t14, $3[46] = t5, $3[47] = t6, $3[48] = t7, $3[49] = t8, $3[50] = t9, $3[51] = t15;
  else
    t15 = $3[51];
  return t15;
}
function _temp190(input) {
  let result = NotebookEditTool.inputSchema.safeParse(input);
  if (!result.success)
    return logError2(Error(`Failed to parse notebook edit input: ${result.error.message}`)), {
      notebook_path: "",
      new_source: "",
      cell_id: ""
    };
  return result.data;
}
var import_compiler_runtime308, jsx_dev_runtime396;
var init_NotebookEditPermissionRequest = __esm(() => {
  init_ink2();
  init_NotebookEditTool();
  init_log3();
  init_FilePermissionDialog();
  init_NotebookEditToolDiff();
  import_compiler_runtime308 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime396 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
