// Original: src/tools/EnterPlanModeTool/UI.tsx
function renderToolUseMessage20() {
  return null;
}
function renderToolResultMessage19(_output, _progressMessagesForMessage, _options) {
  return /* @__PURE__ */ jsx_dev_runtime146.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginTop: 1,
    children: [
      /* @__PURE__ */ jsx_dev_runtime146.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: [
          /* @__PURE__ */ jsx_dev_runtime146.jsxDEV(ThemedText, {
            color: getModeColor("plan"),
            children: BLACK_CIRCLE
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime146.jsxDEV(ThemedText, {
            children: " Entered plan mode"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime146.jsxDEV(ThemedBox_default, {
        paddingLeft: 2,
        children: /* @__PURE__ */ jsx_dev_runtime146.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Claude is now exploring and designing an implementation approach."
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
function renderToolUseRejectedMessage7() {
  return /* @__PURE__ */ jsx_dev_runtime146.jsxDEV(ThemedBox_default, {
    flexDirection: "row",
    marginTop: 1,
    children: [
      /* @__PURE__ */ jsx_dev_runtime146.jsxDEV(ThemedText, {
        color: getModeColor("default"),
        children: BLACK_CIRCLE
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime146.jsxDEV(ThemedText, {
        children: " User declined to enter plan mode"
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var jsx_dev_runtime146;
var init_UI19 = __esm(() => {
  init_figures2();
  init_PermissionMode();
  init_ink2();
  jsx_dev_runtime146 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
