// function: _temp148
function _temp148(exitState) {
  return exitState.pending ? /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedText, {
    children: [
      "Press ",
      exitState.keyName,
      " again to exit"
    ]
  }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(Byline, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(KeyboardShortcutHint, {
        shortcut: "Enter",
        action: "confirm"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(KeyboardShortcutHint, {
        shortcut: "Esc",
        action: "cancel"
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
