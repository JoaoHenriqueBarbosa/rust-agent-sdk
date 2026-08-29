// Original: src/tools/SendMessageTool/UI.tsx
function renderToolUseMessage26(input) {
  if (typeof input.message !== "object" || input.message === null)
    return null;
  if (input.message.type === "plan_approval_response")
    return input.message.approve ? `approve plan from: ${input.to}` : `reject plan from: ${input.to}`;
  return null;
}
function renderToolResultMessage24(content, _progressMessages, {
  verbose
}) {
  let result = typeof content === "string" ? jsonParse(content) : content;
  if ("routing" in result && result.routing)
    return null;
  if ("request_id" in result && "target" in result)
    return null;
  return /* @__PURE__ */ jsx_dev_runtime150.jsxDEV(MessageResponse, {
    children: /* @__PURE__ */ jsx_dev_runtime150.jsxDEV(ThemedText, {
      dimColor: !0,
      children: result.message
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime150;
var init_UI24 = __esm(() => {
  init_MessageResponse();
  init_ink2();
  init_slowOperations();
  jsx_dev_runtime150 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
