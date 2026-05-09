// Original: src/tools/NotebookEditTool/UI.tsx
function getToolUseSummary5(input) {
  if (!input?.notebook_path)
    return null;
  return getDisplayPath(input.notebook_path);
}
function renderToolUseMessage13({
  notebook_path,
  cell_id,
  new_source,
  cell_type,
  edit_mode
}, {
  verbose
}) {
  if (!notebook_path || !new_source || !cell_type)
    return null;
  let displayPath = verbose ? notebook_path : getDisplayPath(notebook_path);
  if (verbose)
    return /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(jsx_dev_runtime137.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(FilePathLink, {
          filePath: notebook_path,
          children: displayPath
        }, void 0, !1, void 0, this),
        `@${cell_id}, content: ${new_source.slice(0, 30)}\u2026, cell_type: ${cell_type}, edit_mode: ${edit_mode ?? "replace"}`
      ]
    }, void 0, !0, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(jsx_dev_runtime137.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(FilePathLink, {
        filePath: notebook_path,
        children: displayPath
      }, void 0, !1, void 0, this),
      `@${cell_id}`
    ]
  }, void 0, !0, void 0, this);
}
function renderToolUseRejectedMessage5(input, {
  verbose
}) {
  return /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(NotebookEditToolUseRejectedMessage, {
    notebook_path: input.notebook_path,
    cell_id: input.cell_id,
    new_source: input.new_source,
    cell_type: input.cell_type,
    edit_mode: input.edit_mode,
    verbose
  }, void 0, !1, void 0, this);
}
function renderToolUseErrorMessage9(result, {
  verbose
}) {
  if (!verbose && typeof result === "string" && extractTag(result, "tool_use_error"))
    return /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(ThemedText, {
        color: "error",
        children: "Error editing notebook"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(FallbackToolUseErrorMessage, {
    result,
    verbose
  }, void 0, !1, void 0, this);
}
function renderToolResultMessage12({
  cell_id,
  new_source,
  error: error44
}) {
  if (error44)
    return /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(ThemedText, {
        color: "error",
        children: error44
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(MessageResponse, {
    children: /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(ThemedText, {
          children: [
            "Updated cell ",
            /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(ThemedText, {
              bold: !0,
              children: cell_id
            }, void 0, !1, void 0, this),
            ":"
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(ThemedBox_default, {
          marginLeft: 2,
          children: /* @__PURE__ */ jsx_dev_runtime137.jsxDEV(HighlightedCode, {
            code: new_source,
            filePath: "notebook.py"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime137;
var init_UI12 = __esm(() => {
  init_messages3();
  init_FallbackToolUseErrorMessage();
  init_FilePathLink();
  init_HighlightedCode();
  init_MessageResponse();
  init_NotebookEditToolUseRejectedMessage();
  init_ink2();
  init_file();
  jsx_dev_runtime137 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
