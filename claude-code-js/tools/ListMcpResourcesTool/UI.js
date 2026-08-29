// Original: src/tools/ListMcpResourcesTool/UI.tsx
function renderToolUseMessage(input) {
  return input.server ? `List MCP resources from server "${input.server}"` : "List all MCP resources";
}
function renderToolResultMessage(output, _progressMessagesForMessage, {
  verbose
}) {
  if (!output || output.length === 0)
    return /* @__PURE__ */ jsx_dev_runtime28.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime28.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "(No resources found)"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  let formattedOutput = jsonStringify(output, null, 2);
  return /* @__PURE__ */ jsx_dev_runtime28.jsxDEV(OutputLine, {
    content: formattedOutput,
    verbose
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime28;
var init_UI = __esm(() => {
  init_MessageResponse();
  init_OutputLine();
  init_ink2();
  init_slowOperations();
  jsx_dev_runtime28 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
