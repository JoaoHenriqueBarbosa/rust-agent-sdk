// Original: src/components/permissions/FileEditPermissionRequest/FileEditPermissionRequest.tsx
import { basename as basename49, relative as relative31 } from "path";
function FileEditPermissionRequest(props) {
  let $3 = import_compiler_runtime303.c(51), parseInput = _temp185, T0, T1, T2, file_path, new_string, old_string, replace_all, t0, t1, t10, t2, t3, t4, t5, t6, t7, t8, t9;
  if ($3[0] !== props.onDone || $3[1] !== props.onReject || $3[2] !== props.toolUseConfirm || $3[3] !== props.toolUseContext || $3[4] !== props.workerBadge)
    ({
      file_path,
      old_string,
      new_string,
      replace_all
    } = parseInput(props.toolUseConfirm.input)), T2 = FilePermissionDialog, t4 = props.toolUseConfirm, t5 = props.toolUseContext, t6 = props.onDone, t7 = props.onReject, t8 = props.workerBadge, t9 = "Edit file", t10 = relative31(getCwd(), file_path), T1 = ThemedText, t2 = "Do you want to make this edit to", t3 = " ", T0 = ThemedText, t0 = !0, t1 = basename49(file_path), $3[0] = props.onDone, $3[1] = props.onReject, $3[2] = props.toolUseConfirm, $3[3] = props.toolUseContext, $3[4] = props.workerBadge, $3[5] = T0, $3[6] = T1, $3[7] = T2, $3[8] = file_path, $3[9] = new_string, $3[10] = old_string, $3[11] = replace_all, $3[12] = t0, $3[13] = t1, $3[14] = t10, $3[15] = t2, $3[16] = t3, $3[17] = t4, $3[18] = t5, $3[19] = t6, $3[20] = t7, $3[21] = t8, $3[22] = t9;
  else
    T0 = $3[5], T1 = $3[6], T2 = $3[7], file_path = $3[8], new_string = $3[9], old_string = $3[10], replace_all = $3[11], t0 = $3[12], t1 = $3[13], t10 = $3[14], t2 = $3[15], t3 = $3[16], t4 = $3[17], t5 = $3[18], t6 = $3[19], t7 = $3[20], t8 = $3[21], t9 = $3[22];
  let t11;
  if ($3[23] !== T0 || $3[24] !== t0 || $3[25] !== t1)
    t11 = /* @__PURE__ */ jsx_dev_runtime391.jsxDEV(T0, {
      bold: t0,
      children: t1
    }, void 0, !1, void 0, this), $3[23] = T0, $3[24] = t0, $3[25] = t1, $3[26] = t11;
  else
    t11 = $3[26];
  let t12;
  if ($3[27] !== T1 || $3[28] !== t11 || $3[29] !== t2 || $3[30] !== t3)
    t12 = /* @__PURE__ */ jsx_dev_runtime391.jsxDEV(T1, {
      children: [
        t2,
        t3,
        t11,
        "?"
      ]
    }, void 0, !0, void 0, this), $3[27] = T1, $3[28] = t11, $3[29] = t2, $3[30] = t3, $3[31] = t12;
  else
    t12 = $3[31];
  let t13 = replace_all || !1, t14;
  if ($3[32] !== new_string || $3[33] !== old_string || $3[34] !== t13)
    t14 = [{
      old_string,
      new_string,
      replace_all: t13
    }], $3[32] = new_string, $3[33] = old_string, $3[34] = t13, $3[35] = t14;
  else
    t14 = $3[35];
  let t15;
  if ($3[36] !== file_path || $3[37] !== t14)
    t15 = /* @__PURE__ */ jsx_dev_runtime391.jsxDEV(FileEditToolDiff, {
      file_path,
      edits: t14
    }, void 0, !1, void 0, this), $3[36] = file_path, $3[37] = t14, $3[38] = t15;
  else
    t15 = $3[38];
  let t16;
  if ($3[39] !== T2 || $3[40] !== file_path || $3[41] !== t10 || $3[42] !== t12 || $3[43] !== t15 || $3[44] !== t4 || $3[45] !== t5 || $3[46] !== t6 || $3[47] !== t7 || $3[48] !== t8 || $3[49] !== t9)
    t16 = /* @__PURE__ */ jsx_dev_runtime391.jsxDEV(T2, {
      toolUseConfirm: t4,
      toolUseContext: t5,
      onDone: t6,
      onReject: t7,
      workerBadge: t8,
      title: t9,
      subtitle: t10,
      question: t12,
      content: t15,
      path: file_path,
      completionType: "str_replace_single",
      parseInput,
      ideDiffSupport
    }, void 0, !1, void 0, this), $3[39] = T2, $3[40] = file_path, $3[41] = t10, $3[42] = t12, $3[43] = t15, $3[44] = t4, $3[45] = t5, $3[46] = t6, $3[47] = t7, $3[48] = t8, $3[49] = t9, $3[50] = t16;
  else
    t16 = $3[50];
  return t16;
}
function _temp185(input) {
  return FileEditTool.inputSchema.parse(input);
}
var import_compiler_runtime303, jsx_dev_runtime391, ideDiffSupport;
var init_FileEditPermissionRequest = __esm(() => {
  init_FileEditToolDiff();
  init_cwd2();
  init_ink2();
  init_FileEditTool();
  init_FilePermissionDialog();
  import_compiler_runtime303 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime391 = __toESM(require_react_jsx_dev_runtime_development(), 1), ideDiffSupport = {
    getConfig: (input) => createSingleEditDiffConfig(input.file_path, input.old_string, input.new_string, input.replace_all),
    applyChanges: (input, modifiedEdits) => {
      let firstEdit = modifiedEdits[0];
      if (firstEdit)
        return {
          ...input,
          old_string: firstEdit.old_string,
          new_string: firstEdit.new_string,
          replace_all: firstEdit.replace_all
        };
      return input;
    }
  };
});
