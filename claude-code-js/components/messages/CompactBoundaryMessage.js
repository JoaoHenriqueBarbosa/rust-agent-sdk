// Original: src/components/messages/CompactBoundaryMessage.tsx
function CompactBoundaryMessage() {
  let $3 = import_compiler_runtime93.c(2), historyShortcut = useShortcutDisplay("app:toggleTranscript", "Global", "ctrl+o"), t0;
  if ($3[0] !== historyShortcut)
    t0 = /* @__PURE__ */ jsx_dev_runtime104.jsxDEV(ThemedBox_default, {
      marginY: 1,
      children: /* @__PURE__ */ jsx_dev_runtime104.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "\u273B Conversation compacted (",
          historyShortcut,
          " for history)"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = historyShortcut, $3[1] = t0;
  else
    t0 = $3[1];
  return t0;
}
var import_compiler_runtime93, jsx_dev_runtime104;
var init_CompactBoundaryMessage = __esm(() => {
  init_ink2();
  init_useShortcutDisplay();
  import_compiler_runtime93 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime104 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
