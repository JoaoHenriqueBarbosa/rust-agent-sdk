// Original: src/tools/GlobTool/UI.tsx
function userFacingName5() {
  return "Search";
}
function renderToolUseMessage12({
  pattern,
  path: path19
}, {
  verbose
}) {
  if (!pattern)
    return null;
  if (!path19)
    return `pattern: "${pattern}"`;
  return `pattern: "${pattern}", path: "${verbose ? path19 : getDisplayPath(path19)}"`;
}
function renderToolUseErrorMessage8(result, {
  verbose
}) {
  if (!verbose && typeof result === "string" && extractTag(result, "tool_use_error")) {
    if (extractTag(result, "tool_use_error")?.includes(FILE_NOT_FOUND_CWD_NOTE))
      return /* @__PURE__ */ jsx_dev_runtime135.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime135.jsxDEV(ThemedText, {
          color: "error",
          children: "File not found"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
    return /* @__PURE__ */ jsx_dev_runtime135.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime135.jsxDEV(ThemedText, {
        color: "error",
        children: "Error searching files"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  }
  return /* @__PURE__ */ jsx_dev_runtime135.jsxDEV(FallbackToolUseErrorMessage, {
    result,
    verbose
  }, void 0, !1, void 0, this);
}
function getToolUseSummary4(input) {
  if (!input?.pattern)
    return null;
  return truncate(input.pattern, TOOL_SUMMARY_MAX_LENGTH);
}
var jsx_dev_runtime135, renderToolResultMessage11;
var init_UI11 = __esm(() => {
  init_MessageResponse();
  init_messages3();
  init_FallbackToolUseErrorMessage();
  init_ink2();
  init_file();
  init_format();
  init_GrepTool();
  jsx_dev_runtime135 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  renderToolResultMessage11 = GrepTool.renderToolResultMessage;
});
