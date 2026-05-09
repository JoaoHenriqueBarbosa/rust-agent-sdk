// Original: src/tools/FileWriteTool/UI.tsx
import { isAbsolute as isAbsolute20, relative as relative15, resolve as resolve33 } from "path";
function countLines(content) {
  let parts = content.split(EOL5);
  return content.endsWith(EOL5) ? parts.length - 1 : parts.length;
}
function FileWriteToolCreatedMessage(t0) {
  let $3 = import_compiler_runtime115.c(25), {
    filePath,
    content,
    verbose
  } = t0, {
    columns
  } = useTerminalSize(), contentWithFallback = content || "(No content)", numLines = countLines(content), plusLines = numLines - MAX_LINES_TO_RENDER2, t1;
  if ($3[0] !== numLines)
    t1 = /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(ThemedText, {
      bold: !0,
      children: numLines
    }, void 0, !1, void 0, this), $3[0] = numLines, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== filePath || $3[3] !== verbose)
    t2 = verbose ? filePath : relative15(getCwd(), filePath), $3[2] = filePath, $3[3] = verbose, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(ThemedText, {
      bold: !0,
      children: t2
    }, void 0, !1, void 0, this), $3[5] = t2, $3[6] = t3;
  else
    t3 = $3[6];
  let t4;
  if ($3[7] !== t1 || $3[8] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(ThemedText, {
      children: [
        "Wrote ",
        t1,
        " lines to",
        " ",
        t3
      ]
    }, void 0, !0, void 0, this), $3[7] = t1, $3[8] = t3, $3[9] = t4;
  else
    t4 = $3[9];
  let t5;
  if ($3[10] !== contentWithFallback || $3[11] !== verbose)
    t5 = verbose ? contentWithFallback : contentWithFallback.split(`
`).slice(0, MAX_LINES_TO_RENDER2).join(`
`), $3[10] = contentWithFallback, $3[11] = verbose, $3[12] = t5;
  else
    t5 = $3[12];
  let t6 = columns - 12, t7;
  if ($3[13] !== filePath || $3[14] !== t5 || $3[15] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(HighlightedCode, {
        code: t5,
        filePath,
        width: t6
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[13] = filePath, $3[14] = t5, $3[15] = t6, $3[16] = t7;
  else
    t7 = $3[16];
  let t8;
  if ($3[17] !== numLines || $3[18] !== plusLines || $3[19] !== verbose)
    t8 = !verbose && plusLines > 0 && /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "\u2026 +",
        plusLines,
        " ",
        plusLines === 1 ? "line" : "lines",
        " ",
        numLines > 0 && /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[17] = numLines, $3[18] = plusLines, $3[19] = verbose, $3[20] = t8;
  else
    t8 = $3[20];
  let t9;
  if ($3[21] !== t4 || $3[22] !== t7 || $3[23] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t4,
          t7,
          t8
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[21] = t4, $3[22] = t7, $3[23] = t8, $3[24] = t9;
  else
    t9 = $3[24];
  return t9;
}
function userFacingName4(input) {
  if (input?.file_path?.startsWith(getPlansDirectory()))
    return "Updated plan";
  return "Write";
}
function isResultTruncated({
  type,
  content
}) {
  if (type !== "create")
    return !1;
  let pos = 0;
  for (let i5 = 0;i5 < MAX_LINES_TO_RENDER2; i5++) {
    if (pos = content.indexOf(EOL5, pos), pos === -1)
      return !1;
    pos++;
  }
  return pos < content.length;
}
function getToolUseSummary2(input) {
  if (!input?.file_path)
    return null;
  return getDisplayPath(input.file_path);
}
function renderToolUseMessage10(input, {
  verbose
}) {
  if (!input.file_path)
    return null;
  if (input.file_path.startsWith(getPlansDirectory()))
    return "";
  return /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(FilePathLink, {
    filePath: input.file_path,
    children: verbose ? input.file_path : getDisplayPath(input.file_path)
  }, void 0, !1, void 0, this);
}
function renderToolUseRejectedMessage4({
  file_path,
  content
}, {
  style,
  verbose
}) {
  return /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(WriteRejectionDiff, {
    filePath: file_path,
    content,
    style,
    verbose
  }, void 0, !1, void 0, this);
}
function WriteRejectionDiff(t0) {
  let $3 = import_compiler_runtime115.c(20), {
    filePath,
    content,
    style,
    verbose
  } = t0, t1;
  if ($3[0] !== content || $3[1] !== filePath)
    t1 = () => loadRejectionDiff2(filePath, content), $3[0] = content, $3[1] = filePath, $3[2] = t1;
  else
    t1 = $3[2];
  let [dataPromise] = import_react80.useState(t1), t2;
  if ($3[3] !== content)
    t2 = content.split(`
`)[0] ?? null, $3[3] = content, $3[4] = t2;
  else
    t2 = $3[4];
  let firstLine = t2, t3;
  if ($3[5] !== content || $3[6] !== filePath || $3[7] !== firstLine || $3[8] !== verbose)
    t3 = /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(FileEditToolUseRejectedMessage, {
      file_path: filePath,
      operation: "write",
      content,
      firstLine,
      verbose
    }, void 0, !1, void 0, this), $3[5] = content, $3[6] = filePath, $3[7] = firstLine, $3[8] = verbose, $3[9] = t3;
  else
    t3 = $3[9];
  let createFallback = t3, t4;
  if ($3[10] !== createFallback || $3[11] !== dataPromise || $3[12] !== filePath || $3[13] !== firstLine || $3[14] !== style || $3[15] !== verbose)
    t4 = /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(WriteRejectionBody, {
      promise: dataPromise,
      filePath,
      firstLine,
      createFallback,
      style,
      verbose
    }, void 0, !1, void 0, this), $3[10] = createFallback, $3[11] = dataPromise, $3[12] = filePath, $3[13] = firstLine, $3[14] = style, $3[15] = verbose, $3[16] = t4;
  else
    t4 = $3[16];
  let t5;
  if ($3[17] !== createFallback || $3[18] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(import_react80.Suspense, {
      fallback: createFallback,
      children: t4
    }, void 0, !1, void 0, this), $3[17] = createFallback, $3[18] = t4, $3[19] = t5;
  else
    t5 = $3[19];
  return t5;
}
function WriteRejectionBody(t0) {
  let $3 = import_compiler_runtime115.c(8), {
    promise: promise3,
    filePath,
    firstLine,
    createFallback,
    style,
    verbose
  } = t0, data = import_react80.use(promise3);
  if (data.type === "create")
    return createFallback;
  if (data.type === "error") {
    let t12;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(ThemedText, {
          children: "(No changes)"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[0] = t12;
    else
      t12 = $3[0];
    return t12;
  }
  let t1;
  if ($3[1] !== data.oldContent || $3[2] !== data.patch || $3[3] !== filePath || $3[4] !== firstLine || $3[5] !== style || $3[6] !== verbose)
    t1 = /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(FileEditToolUseRejectedMessage, {
      file_path: filePath,
      operation: "update",
      patch: data.patch,
      firstLine,
      fileContent: data.oldContent,
      style,
      verbose
    }, void 0, !1, void 0, this), $3[1] = data.oldContent, $3[2] = data.patch, $3[3] = filePath, $3[4] = firstLine, $3[5] = style, $3[6] = verbose, $3[7] = t1;
  else
    t1 = $3[7];
  return t1;
}
async function loadRejectionDiff2(filePath, content) {
  try {
    let fullFilePath = isAbsolute20(filePath) ? filePath : resolve33(getCwd(), filePath), handle = await openForScan(fullFilePath);
    if (handle === null)
      return {
        type: "create"
      };
    let oldContent;
    try {
      oldContent = await readCapped(handle);
    } finally {
      await handle.close();
    }
    if (oldContent === null)
      return {
        type: "create"
      };
    return {
      type: "update",
      patch: getPatchForDisplay({
        filePath,
        fileContents: oldContent,
        edits: [{
          old_string: oldContent,
          new_string: content,
          replace_all: !1
        }]
      }),
      oldContent
    };
  } catch (e) {
    return logError2(e), {
      type: "error"
    };
  }
}
function renderToolUseErrorMessage6(result, {
  verbose
}) {
  if (!verbose && typeof result === "string" && extractTag(result, "tool_use_error"))
    return /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(ThemedText, {
        color: "error",
        children: "Error writing file"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(FallbackToolUseErrorMessage, {
    result,
    verbose
  }, void 0, !1, void 0, this);
}
function renderToolResultMessage9({
  filePath,
  content,
  structuredPatch: structuredPatch2,
  type,
  originalFile
}, _progressMessagesForMessage, {
  style,
  verbose
}) {
  switch (type) {
    case "create": {
      if (filePath.startsWith(getPlansDirectory()) && !verbose) {
        if (style !== "condensed")
          return /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(MessageResponse, {
            children: /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "/plan to preview"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this);
      } else if (style === "condensed" && !verbose) {
        let numLines = countLines(content);
        return /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(ThemedText, {
          children: [
            "Wrote ",
            /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(ThemedText, {
              bold: !0,
              children: numLines
            }, void 0, !1, void 0, this),
            " lines to",
            " ",
            /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(ThemedText, {
              bold: !0,
              children: relative15(getCwd(), filePath)
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this);
      }
      return /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(FileWriteToolCreatedMessage, {
        filePath,
        content,
        verbose
      }, void 0, !1, void 0, this);
    }
    case "update": {
      let isPlanFile = filePath.startsWith(getPlansDirectory());
      return /* @__PURE__ */ jsx_dev_runtime133.jsxDEV(FileEditToolUpdatedMessage, {
        filePath,
        structuredPatch: structuredPatch2,
        firstLine: content.split(`
`)[0] ?? null,
        fileContent: originalFile ?? void 0,
        style,
        verbose,
        previewHint: isPlanFile ? "/plan to preview" : void 0
      }, void 0, !1, void 0, this);
    }
  }
}
var import_compiler_runtime115, import_react80, jsx_dev_runtime133, MAX_LINES_TO_RENDER2 = 10, EOL5 = `
`;
var init_UI9 = __esm(() => {
  init_MessageResponse();
  init_messages3();
  init_CtrlOToExpand();
  init_FallbackToolUseErrorMessage();
  init_FileEditToolUpdatedMessage();
  init_FileEditToolUseRejectedMessage();
  init_FilePathLink();
  init_HighlightedCode();
  init_useTerminalSize();
  init_ink2();
  init_cwd2();
  init_diff2();
  init_file();
  init_log3();
  init_plans();
  init_readEditContext();
  import_compiler_runtime115 = __toESM(require_react_compiler_runtime_development(), 1), import_react80 = __toESM(require_react_development(), 1), jsx_dev_runtime133 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
