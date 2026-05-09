// Original: src/commands/feedback/feedback.tsx
var exports_feedback = {};
__export(exports_feedback, {
  renderFeedbackComponent: () => renderFeedbackComponent,
  call: () => call8
});
function renderFeedbackComponent(onDone, abortSignal, messages, initialDescription = "", backgroundTasks = {}) {
  return /* @__PURE__ */ jsx_dev_runtime165.jsxDEV(Feedback, {
    abortSignal,
    messages,
    initialDescription,
    onDone,
    backgroundTasks
  }, void 0, !1, void 0, this);
}
async function call8(onDone, context6, args) {
  let initialDescription = args || "";
  return renderFeedbackComponent(onDone, context6.abortController.signal, context6.messages, initialDescription);
}
var jsx_dev_runtime165;
var init_feedback = __esm(() => {
  init_Feedback();
  jsx_dev_runtime165 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
