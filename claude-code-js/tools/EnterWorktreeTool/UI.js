// Original: src/tools/EnterWorktreeTool/UI.tsx
function renderToolUseMessage21() {
  return "Creating worktree\u2026";
}
function renderToolResultMessage20(output, _progressMessagesForMessage, _options) {
  return /* @__PURE__ */ jsx_dev_runtime147.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime147.jsxDEV(ThemedText, {
        children: [
          "Switched to worktree on branch ",
          /* @__PURE__ */ jsx_dev_runtime147.jsxDEV(ThemedText, {
            bold: !0,
            children: output.worktreeBranch
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime147.jsxDEV(ThemedText, {
        dimColor: !0,
        children: output.worktreePath
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var jsx_dev_runtime147;
var init_UI20 = __esm(() => {
  init_ink2();
  jsx_dev_runtime147 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
