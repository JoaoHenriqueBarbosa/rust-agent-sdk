// Original: src/components/permissions/FileWritePermissionRequest/FileWritePermissionRequest.tsx
import { basename as basename50, relative as relative32 } from "path";
function FileWritePermissionRequest(props) {
  let $3 = import_compiler_runtime306.c(30), parseInput = _temp188, t0;
  if ($3[0] !== props.toolUseConfirm.input)
    t0 = parseInput(props.toolUseConfirm.input), $3[0] = props.toolUseConfirm.input, $3[1] = t0;
  else
    t0 = $3[1];
  let parsed = t0, {
    file_path,
    content
  } = parsed, t1;
  if ($3[2] !== file_path) {
    try {
      t1 = {
        fileExists: !0,
        oldContent: readFileSync4(file_path)
      };
    } catch (t22) {
      let e = t22;
      if (!isENOENT(e))
        throw e;
      let t32;
      if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
        t32 = {
          fileExists: !1,
          oldContent: ""
        }, $3[4] = t32;
      else
        t32 = $3[4];
      t1 = t32;
    }
    $3[2] = file_path, $3[3] = t1;
  } else
    t1 = $3[3];
  let {
    fileExists,
    oldContent
  } = t1, actionText = fileExists ? "overwrite" : "create", t2 = props.toolUseConfirm, t3 = props.toolUseContext, t4 = props.onDone, t5 = props.onReject, t6 = props.workerBadge, t7 = fileExists ? "Overwrite file" : "Create file", t8;
  if ($3[5] !== file_path)
    t8 = relative32(getCwd(), file_path), $3[5] = file_path, $3[6] = t8;
  else
    t8 = $3[6];
  let t9;
  if ($3[7] !== file_path)
    t9 = basename50(file_path), $3[7] = file_path, $3[8] = t9;
  else
    t9 = $3[8];
  let t10;
  if ($3[9] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime394.jsxDEV(ThemedText, {
      bold: !0,
      children: t9
    }, void 0, !1, void 0, this), $3[9] = t9, $3[10] = t10;
  else
    t10 = $3[10];
  let t11;
  if ($3[11] !== actionText || $3[12] !== t10)
    t11 = /* @__PURE__ */ jsx_dev_runtime394.jsxDEV(ThemedText, {
      children: [
        "Do you want to ",
        actionText,
        " ",
        t10,
        "?"
      ]
    }, void 0, !0, void 0, this), $3[11] = actionText, $3[12] = t10, $3[13] = t11;
  else
    t11 = $3[13];
  let t12;
  if ($3[14] !== content || $3[15] !== fileExists || $3[16] !== file_path || $3[17] !== oldContent)
    t12 = /* @__PURE__ */ jsx_dev_runtime394.jsxDEV(FileWriteToolDiff, {
      file_path,
      content,
      fileExists,
      oldContent
    }, void 0, !1, void 0, this), $3[14] = content, $3[15] = fileExists, $3[16] = file_path, $3[17] = oldContent, $3[18] = t12;
  else
    t12 = $3[18];
  let t13;
  if ($3[19] !== file_path || $3[20] !== props.onDone || $3[21] !== props.onReject || $3[22] !== props.toolUseConfirm || $3[23] !== props.toolUseContext || $3[24] !== props.workerBadge || $3[25] !== t11 || $3[26] !== t12 || $3[27] !== t7 || $3[28] !== t8)
    t13 = /* @__PURE__ */ jsx_dev_runtime394.jsxDEV(FilePermissionDialog, {
      toolUseConfirm: t2,
      toolUseContext: t3,
      onDone: t4,
      onReject: t5,
      workerBadge: t6,
      title: t7,
      subtitle: t8,
      question: t11,
      content: t12,
      path: file_path,
      completionType: "write_file_single",
      parseInput,
      ideDiffSupport: ideDiffSupport2
    }, void 0, !1, void 0, this), $3[19] = file_path, $3[20] = props.onDone, $3[21] = props.onReject, $3[22] = props.toolUseConfirm, $3[23] = props.toolUseContext, $3[24] = props.workerBadge, $3[25] = t11, $3[26] = t12, $3[27] = t7, $3[28] = t8, $3[29] = t13;
  else
    t13 = $3[29];
  return t13;
}
function _temp188(input) {
  return FileWriteTool.inputSchema.parse(input);
}
var import_compiler_runtime306, jsx_dev_runtime394, ideDiffSupport2;
var init_FileWritePermissionRequest = __esm(() => {
  init_ink2();
  init_FileWriteTool();
  init_cwd2();
  init_errors();
  init_fileRead();
  init_FilePermissionDialog();
  init_FileWriteToolDiff();
  import_compiler_runtime306 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime394 = __toESM(require_react_jsx_dev_runtime_development(), 1), ideDiffSupport2 = {
    getConfig: (input) => {
      let oldContent;
      try {
        oldContent = readFileSync4(input.file_path);
      } catch (e) {
        if (!isENOENT(e))
          throw e;
        oldContent = "";
      }
      return createSingleEditDiffConfig(input.file_path, oldContent, input.content, !1);
    },
    applyChanges: (input, modifiedEdits) => {
      let firstEdit = modifiedEdits[0];
      if (firstEdit)
        return {
          ...input,
          content: firstEdit.new_string
        };
      return input;
    }
  };
});
