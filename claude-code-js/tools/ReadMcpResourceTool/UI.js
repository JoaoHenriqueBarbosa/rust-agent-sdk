// Original: src/tools/ReadMcpResourceTool/UI.tsx
function renderToolUseMessage3(input) {
  if (!input.uri || !input.server)
    return null;
  return `Read resource "${input.uri}" from server "${input.server}"`;
}
function userFacingName() {
  return "readMcpResource";
}
function renderToolResultMessage3(output, _progressMessagesForMessage, {
  verbose
}) {
  if (!output || !output.contents || output.contents.length === 0)
    return /* @__PURE__ */ jsx_dev_runtime31.jsxDEV(ThemedBox_default, {
      justifyContent: "space-between",
      overflowX: "hidden",
      width: "100%",
      children: /* @__PURE__ */ jsx_dev_runtime31.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime31.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "(No content)"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  let formattedOutput = jsonStringify(output, null, 2);
  return /* @__PURE__ */ jsx_dev_runtime31.jsxDEV(OutputLine, {
    content: formattedOutput,
    verbose
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime31;
var init_UI3 = __esm(() => {
  init_MessageResponse();
  init_OutputLine();
  init_ink2();
  init_slowOperations();
  jsx_dev_runtime31 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
