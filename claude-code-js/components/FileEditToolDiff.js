// Original: src/components/FileEditToolDiff.tsx
function FileEditToolDiff(props) {
  let $3 = import_compiler_runtime296.c(7), t0;
  if ($3[0] !== props.edits || $3[1] !== props.file_path)
    t0 = () => loadDiffData(props.file_path, props.edits), $3[0] = props.edits, $3[1] = props.file_path, $3[2] = t0;
  else
    t0 = $3[2];
  let [dataPromise] = import_react209.useState(t0), t1;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime380.jsxDEV(DiffFrame, {
      placeholder: !0
    }, void 0, !1, void 0, this), $3[3] = t1;
  else
    t1 = $3[3];
  let t2;
  if ($3[4] !== dataPromise || $3[5] !== props.file_path)
    t2 = /* @__PURE__ */ jsx_dev_runtime380.jsxDEV(import_react209.Suspense, {
      fallback: t1,
      children: /* @__PURE__ */ jsx_dev_runtime380.jsxDEV(DiffBody, {
        promise: dataPromise,
        file_path: props.file_path
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = dataPromise, $3[5] = props.file_path, $3[6] = t2;
  else
    t2 = $3[6];
  return t2;
}
function DiffBody(t0) {
  let $3 = import_compiler_runtime296.c(6), {
    promise: promise3,
    file_path
  } = t0, {
    patch,
    firstLine,
    fileContent
  } = import_react209.use(promise3), {
    columns
  } = useTerminalSize(), t1;
  if ($3[0] !== columns || $3[1] !== fileContent || $3[2] !== file_path || $3[3] !== firstLine || $3[4] !== patch)
    t1 = /* @__PURE__ */ jsx_dev_runtime380.jsxDEV(DiffFrame, {
      children: /* @__PURE__ */ jsx_dev_runtime380.jsxDEV(StructuredDiffList, {
        hunks: patch,
        dim: !1,
        width: columns,
        filePath: file_path,
        firstLine,
        fileContent
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = columns, $3[1] = fileContent, $3[2] = file_path, $3[3] = firstLine, $3[4] = patch, $3[5] = t1;
  else
    t1 = $3[5];
  return t1;
}
function DiffFrame(t0) {
  let $3 = import_compiler_runtime296.c(5), {
    children,
    placeholder
  } = t0, t1;
  if ($3[0] !== children || $3[1] !== placeholder)
    t1 = placeholder ? /* @__PURE__ */ jsx_dev_runtime380.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "\u2026"
    }, void 0, !1, void 0, this) : children, $3[0] = children, $3[1] = placeholder, $3[2] = t1;
  else
    t1 = $3[2];
  let t2;
  if ($3[3] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime380.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime380.jsxDEV(ThemedBox_default, {
        borderColor: "subtle",
        borderStyle: "dashed",
        flexDirection: "column",
        borderLeft: !1,
        borderRight: !1,
        children: t1
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[3] = t1, $3[4] = t2;
  else
    t2 = $3[4];
  return t2;
}
async function loadDiffData(file_path, edits) {
  let valid = edits.filter((e) => e.old_string != null && e.new_string != null), single = valid.length === 1 ? valid[0] : void 0;
  if (single && single.old_string.length >= CHUNK_SIZE)
    return diffToolInputsOnly(file_path, [single]);
  try {
    let handle = await openForScan(file_path);
    if (handle === null)
      return diffToolInputsOnly(file_path, valid);
    try {
      if (!single || single.old_string === "") {
        let file2 = await readCapped(handle);
        if (file2 === null)
          return diffToolInputsOnly(file_path, valid);
        let normalized2 = valid.map((e) => normalizeEdit(file2, e));
        return {
          patch: getPatchForDisplay({
            filePath: file_path,
            fileContents: file2,
            edits: normalized2
          }),
          firstLine: firstLineOf(file2),
          fileContent: file2
        };
      }
      let ctx = await scanForContext(handle, single.old_string, CONTEXT_LINES);
      if (ctx.truncated || ctx.content === "")
        return diffToolInputsOnly(file_path, [single]);
      let normalized = normalizeEdit(ctx.content, single), hunks = getPatchForDisplay({
        filePath: file_path,
        fileContents: ctx.content,
        edits: [normalized]
      });
      return {
        patch: adjustHunkLineNumbers(hunks, ctx.lineOffset - 1),
        firstLine: ctx.lineOffset === 1 ? firstLineOf(ctx.content) : null,
        fileContent: ctx.content
      };
    } finally {
      await handle.close();
    }
  } catch (e) {
    return logError2(e), diffToolInputsOnly(file_path, valid);
  }
}
function diffToolInputsOnly(filePath, edits) {
  return {
    patch: edits.flatMap((e) => getPatchForDisplay({
      filePath,
      fileContents: e.old_string,
      edits: [e]
    })),
    firstLine: null,
    fileContent: void 0
  };
}
function normalizeEdit(fileContent, edit2) {
  let actualOld = findActualString(fileContent, edit2.old_string) || edit2.old_string, actualNew = preserveQuoteStyle(edit2.old_string, actualOld, edit2.new_string);
  return {
    ...edit2,
    old_string: actualOld,
    new_string: actualNew
  };
}
var import_compiler_runtime296, import_react209, jsx_dev_runtime380;
var init_FileEditToolDiff = __esm(() => {
  init_useTerminalSize();
  init_ink2();
  init_utils13();
  init_diff2();
  init_log3();
  init_readEditContext();
  init_StructuredDiffList();
  import_compiler_runtime296 = __toESM(require_react_compiler_runtime_development(), 1), import_react209 = __toESM(require_react_development(), 1), jsx_dev_runtime380 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
