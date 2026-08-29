// Original: src/components/wizard/WizardNavigationFooter.tsx
function WizardNavigationFooter({
  instructions = /* @__PURE__ */ jsx_dev_runtime322.jsxDEV(Byline, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime322.jsxDEV(KeyboardShortcutHint, {
        shortcut: "\u2191\u2193",
        action: "navigate"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime322.jsxDEV(KeyboardShortcutHint, {
        shortcut: "Enter",
        action: "select"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime322.jsxDEV(ConfigurableShortcutHint, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this)
}) {
  let exitState = useExitOnCtrlCDWithKeybindings();
  return /* @__PURE__ */ jsx_dev_runtime322.jsxDEV(ThemedBox_default, {
    marginLeft: 3,
    marginTop: 1,
    children: /* @__PURE__ */ jsx_dev_runtime322.jsxDEV(ThemedText, {
      dimColor: !0,
      children: exitState.pending ? `Press ${exitState.keyName} again to exit` : instructions
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime322;
var init_WizardNavigationFooter = __esm(() => {
  init_useExitOnCtrlCDWithKeybindings();
  init_ink2();
  init_ConfigurableShortcutHint();
  init_Byline();
  init_KeyboardShortcutHint();
  jsx_dev_runtime322 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
