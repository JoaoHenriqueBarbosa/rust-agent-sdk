// Original: src/components/permissions/SedEditPermissionRequest/SedEditPermissionRequest.tsx
import { basename as basename47, relative as relative30 } from "path";
function SedEditPermissionRequest(t0) {
  let $3 = import_compiler_runtime298.c(9), props, sedInfo;
  if ($3[0] !== t0)
    ({
      sedInfo,
      ...props
    } = t0), $3[0] = t0, $3[1] = props, $3[2] = sedInfo;
  else
    props = $3[1], sedInfo = $3[2];
  let {
    filePath
  } = sedInfo, t1;
  if ($3[3] !== filePath)
    t1 = (async () => {
      let encoding = detectEncodingForResolvedPath(filePath);
      return {
        oldContent: (await getFsImplementation().readFile(filePath, {
          encoding
        })).replaceAll(`\r
`, `
`),
        fileExists: !0
      };
    })().catch(_temp180), $3[3] = filePath, $3[4] = t1;
  else
    t1 = $3[4];
  let contentPromise = t1, t2;
  if ($3[5] !== contentPromise || $3[6] !== props || $3[7] !== sedInfo)
    t2 = /* @__PURE__ */ jsx_dev_runtime384.jsxDEV(import_react213.Suspense, {
      fallback: null,
      children: /* @__PURE__ */ jsx_dev_runtime384.jsxDEV(SedEditPermissionRequestInner, {
        sedInfo,
        contentPromise,
        ...props
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = contentPromise, $3[6] = props, $3[7] = sedInfo, $3[8] = t2;
  else
    t2 = $3[8];
  return t2;
}
function _temp180(e) {
  if (!isENOENT(e))
    throw e;
  return {
    oldContent: "",
    fileExists: !1
  };
}
function SedEditPermissionRequestInner(t0) {
  let $3 = import_compiler_runtime298.c(35), contentPromise, props, sedInfo;
  if ($3[0] !== t0)
    ({
      sedInfo,
      contentPromise,
      ...props
    } = t0), $3[0] = t0, $3[1] = contentPromise, $3[2] = props, $3[3] = sedInfo;
  else
    contentPromise = $3[1], props = $3[2], sedInfo = $3[3];
  let {
    filePath
  } = sedInfo, {
    oldContent,
    fileExists
  } = import_react213.use(contentPromise), t1;
  if ($3[4] !== oldContent || $3[5] !== sedInfo)
    t1 = applySedSubstitution(oldContent, sedInfo), $3[4] = oldContent, $3[5] = sedInfo, $3[6] = t1;
  else
    t1 = $3[6];
  let newContent = t1, t2;
  bb0: {
    if (oldContent === newContent) {
      let t33;
      if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
        t33 = [], $3[7] = t33;
      else
        t33 = $3[7];
      t2 = t33;
      break bb0;
    }
    let t32;
    if ($3[8] !== newContent || $3[9] !== oldContent)
      t32 = [{
        old_string: oldContent,
        new_string: newContent,
        replace_all: !1
      }], $3[8] = newContent, $3[9] = oldContent, $3[10] = t32;
    else
      t32 = $3[10];
    t2 = t32;
  }
  let edits = t2, t3;
  bb1: {
    if (!fileExists) {
      t3 = "File does not exist";
      break bb1;
    }
    t3 = "Pattern did not match any content";
  }
  let noChangesMessage = t3, t4;
  if ($3[11] !== filePath || $3[12] !== newContent)
    t4 = (input) => {
      return {
        ...BashTool.inputSchema.parse(input),
        _simulatedSedEdit: {
          filePath,
          newContent
        }
      };
    }, $3[11] = filePath, $3[12] = newContent, $3[13] = t4;
  else
    t4 = $3[13];
  let parseInput = t4, t5 = props.toolUseConfirm, t6 = props.toolUseContext, t7 = props.onDone, t8 = props.onReject, t9;
  if ($3[14] !== filePath)
    t9 = relative30(getCwd(), filePath), $3[14] = filePath, $3[15] = t9;
  else
    t9 = $3[15];
  let t10;
  if ($3[16] !== filePath)
    t10 = basename47(filePath), $3[16] = filePath, $3[17] = t10;
  else
    t10 = $3[17];
  let t11;
  if ($3[18] !== t10)
    t11 = /* @__PURE__ */ jsx_dev_runtime384.jsxDEV(ThemedText, {
      children: [
        "Do you want to make this edit to",
        " ",
        /* @__PURE__ */ jsx_dev_runtime384.jsxDEV(ThemedText, {
          bold: !0,
          children: t10
        }, void 0, !1, void 0, this),
        "?"
      ]
    }, void 0, !0, void 0, this), $3[18] = t10, $3[19] = t11;
  else
    t11 = $3[19];
  let t12;
  if ($3[20] !== edits || $3[21] !== filePath || $3[22] !== noChangesMessage)
    t12 = edits.length > 0 ? /* @__PURE__ */ jsx_dev_runtime384.jsxDEV(FileEditToolDiff, {
      file_path: filePath,
      edits
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime384.jsxDEV(ThemedText, {
      dimColor: !0,
      children: noChangesMessage
    }, void 0, !1, void 0, this), $3[20] = edits, $3[21] = filePath, $3[22] = noChangesMessage, $3[23] = t12;
  else
    t12 = $3[23];
  let t13;
  if ($3[24] !== filePath || $3[25] !== parseInput || $3[26] !== props.onDone || $3[27] !== props.onReject || $3[28] !== props.toolUseConfirm || $3[29] !== props.toolUseContext || $3[30] !== props.workerBadge || $3[31] !== t11 || $3[32] !== t12 || $3[33] !== t9)
    t13 = /* @__PURE__ */ jsx_dev_runtime384.jsxDEV(FilePermissionDialog, {
      toolUseConfirm: t5,
      toolUseContext: t6,
      onDone: t7,
      onReject: t8,
      title: "Edit file",
      subtitle: t9,
      question: t11,
      content: t12,
      path: filePath,
      completionType: "str_replace_single",
      parseInput,
      workerBadge: props.workerBadge
    }, void 0, !1, void 0, this), $3[24] = filePath, $3[25] = parseInput, $3[26] = props.onDone, $3[27] = props.onReject, $3[28] = props.toolUseConfirm, $3[29] = props.toolUseContext, $3[30] = props.workerBadge, $3[31] = t11, $3[32] = t12, $3[33] = t9, $3[34] = t13;
  else
    t13 = $3[34];
  return t13;
}
var import_compiler_runtime298, import_react213, jsx_dev_runtime384;
var init_SedEditPermissionRequest = __esm(() => {
  init_FileEditToolDiff();
  init_cwd2();
  init_errors();
  init_fileRead();
  init_fsOperations();
  init_ink2();
  init_BashTool();
  init_sedEditParser();
  init_FilePermissionDialog();
  import_compiler_runtime298 = __toESM(require_react_compiler_runtime_development(), 1), import_react213 = __toESM(require_react_development(), 1), jsx_dev_runtime384 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
