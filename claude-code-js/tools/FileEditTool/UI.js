// Original: src/tools/FileEditTool/UI.tsx
function userFacingName3(input) {
  if (!input)
    return "Update";
  if (input.file_path?.startsWith(getPlansDirectory()))
    return "Updated plan";
  if (input.edits != null)
    return "Update";
  if (input.old_string === "")
    return "Create";
  return "Update";
}
function getToolUseSummary(input) {
  if (!input?.file_path)
    return null;
  return getDisplayPath(input.file_path);
}
function renderToolUseMessage9({
  file_path
}, {
  verbose
}) {
  if (!file_path)
    return null;
  if (file_path.startsWith(getPlansDirectory()))
    return "";
  return /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(FilePathLink, {
    filePath: file_path,
    children: verbose ? file_path : getDisplayPath(file_path)
  }, void 0, !1, void 0, this);
}
function renderToolResultMessage8({
  filePath,
  structuredPatch: structuredPatch2,
  originalFile
}, _progressMessagesForMessage, {
  style,
  verbose
}) {
  let isPlanFile = filePath.startsWith(getPlansDirectory());
  return /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(FileEditToolUpdatedMessage, {
    filePath,
    structuredPatch: structuredPatch2,
    firstLine: originalFile.split(`
`)[0] ?? null,
    fileContent: originalFile,
    style,
    verbose,
    previewHint: isPlanFile ? "/plan to preview" : void 0
  }, void 0, !1, void 0, this);
}
function renderToolUseRejectedMessage3(input, options2) {
  let {
    style,
    verbose
  } = options2, filePath = input.file_path, oldString = input.old_string ?? "", newString = input.new_string ?? "", replaceAll2 = input.replace_all ?? !1;
  if ("edits" in input && input.edits != null)
    return /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(FileEditToolUseRejectedMessage, {
      file_path: filePath,
      operation: "update",
      firstLine: null,
      verbose
    }, void 0, !1, void 0, this);
  if (oldString === "")
    return /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(FileEditToolUseRejectedMessage, {
      file_path: filePath,
      operation: "write",
      content: newString,
      firstLine: firstLineOf(newString),
      verbose
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(EditRejectionDiff, {
    filePath,
    oldString,
    newString,
    replaceAll: replaceAll2,
    style,
    verbose
  }, void 0, !1, void 0, this);
}
function renderToolUseErrorMessage5(result, options2) {
  let {
    verbose
  } = options2;
  if (!verbose && typeof result === "string" && extractTag(result, "tool_use_error")) {
    let errorMessage2 = extractTag(result, "tool_use_error");
    if (errorMessage2?.includes("File has not been read yet"))
      return /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "File must be read first"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
    if (errorMessage2?.includes(FILE_NOT_FOUND_CWD_NOTE))
      return /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(ThemedText, {
          color: "error",
          children: "File not found"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
    return /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(ThemedText, {
        color: "error",
        children: "Error editing file"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  }
  return /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(FallbackToolUseErrorMessage, {
    result,
    verbose
  }, void 0, !1, void 0, this);
}
function EditRejectionDiff(t0) {
  let $3 = import_compiler_runtime114.c(16), {
    filePath,
    oldString,
    newString,
    replaceAll: replaceAll2,
    style,
    verbose
  } = t0, t1;
  if ($3[0] !== filePath || $3[1] !== newString || $3[2] !== oldString || $3[3] !== replaceAll2)
    t1 = () => loadRejectionDiff(filePath, oldString, newString, replaceAll2), $3[0] = filePath, $3[1] = newString, $3[2] = oldString, $3[3] = replaceAll2, $3[4] = t1;
  else
    t1 = $3[4];
  let [dataPromise] = import_react79.useState(t1), t2;
  if ($3[5] !== filePath || $3[6] !== verbose)
    t2 = /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(FileEditToolUseRejectedMessage, {
      file_path: filePath,
      operation: "update",
      firstLine: null,
      verbose
    }, void 0, !1, void 0, this), $3[5] = filePath, $3[6] = verbose, $3[7] = t2;
  else
    t2 = $3[7];
  let t3;
  if ($3[8] !== dataPromise || $3[9] !== filePath || $3[10] !== style || $3[11] !== verbose)
    t3 = /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(EditRejectionBody, {
      promise: dataPromise,
      filePath,
      style,
      verbose
    }, void 0, !1, void 0, this), $3[8] = dataPromise, $3[9] = filePath, $3[10] = style, $3[11] = verbose, $3[12] = t3;
  else
    t3 = $3[12];
  let t4;
  if ($3[13] !== t2 || $3[14] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(import_react79.Suspense, {
      fallback: t2,
      children: t3
    }, void 0, !1, void 0, this), $3[13] = t2, $3[14] = t3, $3[15] = t4;
  else
    t4 = $3[15];
  return t4;
}
function EditRejectionBody(t0) {
  let $3 = import_compiler_runtime114.c(7), {
    promise: promise3,
    filePath,
    style,
    verbose
  } = t0, {
    patch,
    firstLine,
    fileContent
  } = import_react79.use(promise3), t1;
  if ($3[0] !== fileContent || $3[1] !== filePath || $3[2] !== firstLine || $3[3] !== patch || $3[4] !== style || $3[5] !== verbose)
    t1 = /* @__PURE__ */ jsx_dev_runtime132.jsxDEV(FileEditToolUseRejectedMessage, {
      file_path: filePath,
      operation: "update",
      patch,
      firstLine,
      fileContent,
      style,
      verbose
    }, void 0, !1, void 0, this), $3[0] = fileContent, $3[1] = filePath, $3[2] = firstLine, $3[3] = patch, $3[4] = style, $3[5] = verbose, $3[6] = t1;
  else
    t1 = $3[6];
  return t1;
}
async function loadRejectionDiff(filePath, oldString, newString, replaceAll2) {
  try {
    let ctx = await readEditContext(filePath, oldString, CONTEXT_LINES);
    if (ctx === null || ctx.truncated || ctx.content === "") {
      let {
        patch: patch2
      } = getPatchForEdit({
        filePath,
        fileContents: oldString,
        oldString,
        newString
      });
      return {
        patch: patch2,
        firstLine: null,
        fileContent: void 0
      };
    }
    let actualOld = findActualString(ctx.content, oldString) || oldString, actualNew = preserveQuoteStyle(oldString, actualOld, newString), {
      patch
    } = getPatchForEdit({
      filePath,
      fileContents: ctx.content,
      oldString: actualOld,
      newString: actualNew,
      replaceAll: replaceAll2
    });
    return {
      patch: adjustHunkLineNumbers(patch, ctx.lineOffset - 1),
      firstLine: ctx.lineOffset === 1 ? firstLineOf(ctx.content) : null,
      fileContent: ctx.content
    };
  } catch (e) {
    return logError2(e), {
      patch: [],
      firstLine: null,
      fileContent: void 0
    };
  }
}
var import_compiler_runtime114, import_react79, jsx_dev_runtime132;
var init_UI8 = __esm(() => {
  init_FileEditToolUseRejectedMessage();
  init_MessageResponse();
  init_messages3();
  init_FallbackToolUseErrorMessage();
  init_FileEditToolUpdatedMessage();
  init_FilePathLink();
  init_ink2();
  init_diff2();
  init_file();
  init_log3();
  init_plans();
  init_readEditContext();
  init_utils13();
  import_compiler_runtime114 = __toESM(require_react_compiler_runtime_development(), 1), import_react79 = __toESM(require_react_development(), 1), jsx_dev_runtime132 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
