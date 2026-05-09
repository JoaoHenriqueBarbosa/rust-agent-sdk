// Original: src/commands/context/context.tsx
var exports_context = {};
__export(exports_context, {
  call: () => call15
});
function toApiView(messages) {
  return getMessagesAfterCompactBoundary(messages);
}
async function call15(onDone, context6) {
  let {
    messages,
    getAppState,
    options: {
      mainLoopModel,
      tools
    }
  } = context6, apiView = toApiView(messages), {
    messages: compactedMessages
  } = await microcompactMessages(apiView), terminalWidth = process.stdout.columns || 80, appState = getAppState(), data = await analyzeContextUsage(compactedMessages, mainLoopModel, async () => appState.toolPermissionContext, tools, appState.agentDefinitions, terminalWidth, context6, void 0, apiView), output = await renderToAnsiString(/* @__PURE__ */ jsx_dev_runtime188.jsxDEV(ContextVisualization, {
    data
  }, void 0, !1, void 0, this));
  return onDone(output), null;
}
var jsx_dev_runtime188;
var init_context3 = __esm(() => {
  init_ContextVisualization();
  init_microCompact();
  init_analyzeContext();
  init_messages3();
  init_staticRender();
  jsx_dev_runtime188 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
