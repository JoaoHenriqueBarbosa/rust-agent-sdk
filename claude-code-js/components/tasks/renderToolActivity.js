// Original: src/components/tasks/renderToolActivity.tsx
function renderToolActivity(activity, tools, theme) {
  let tool = findToolByName(tools, activity.toolName);
  if (!tool)
    return activity.toolName;
  try {
    let parsed = tool.inputSchema.safeParse(activity.input), parsedInput = parsed.success ? parsed.data : {}, userFacingName8 = tool.userFacingName(parsedInput);
    if (!userFacingName8)
      return activity.toolName;
    let toolArgs = tool.renderToolUseMessage(parsedInput, {
      theme,
      verbose: !1
    });
    if (toolArgs)
      return /* @__PURE__ */ jsx_dev_runtime280.jsxDEV(ThemedText, {
        children: [
          userFacingName8,
          "(",
          toolArgs,
          ")"
        ]
      }, void 0, !0, void 0, this);
    return userFacingName8;
  } catch {
    return activity.toolName;
  }
}
var jsx_dev_runtime280;
var init_renderToolActivity = __esm(() => {
  init_ink2();
  init_Tool();
  jsx_dev_runtime280 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
