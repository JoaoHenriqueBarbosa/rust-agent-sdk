// Original: src/tools/ExitWorktreeTool/UI.tsx
function renderToolUseMessage22() {
  return "Exiting worktree\u2026";
}
function renderToolResultMessage21(output, _progressMessagesForMessage, _options) {
  let actionLabel = output.action === "keep" ? "Kept worktree" : "Removed worktree";
  return /* @__PURE__ */ jsx_dev_runtime148.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime148.jsxDEV(ThemedText, {
        children: [
          actionLabel,
          output.worktreeBranch ? /* @__PURE__ */ jsx_dev_runtime148.jsxDEV(jsx_dev_runtime148.Fragment, {
            children: [
              " ",
              "(branch ",
              /* @__PURE__ */ jsx_dev_runtime148.jsxDEV(ThemedText, {
                bold: !0,
                children: output.worktreeBranch
              }, void 0, !1, void 0, this),
              ")"
            ]
          }, void 0, !0, void 0, this) : null
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime148.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Returned to ",
          output.originalCwd
        ]
      }, void 0, !0, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var jsx_dev_runtime148;
var init_UI21 = __esm(() => {
  init_ink2();
  jsx_dev_runtime148 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
