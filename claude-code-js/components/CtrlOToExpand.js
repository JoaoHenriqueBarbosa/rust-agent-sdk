// Original: src/components/CtrlOToExpand.tsx
function SubAgentProvider(t0) {
  let $3 = import_compiler_runtime22.c(2), {
    children
  } = t0, t1;
  if ($3[0] !== children)
    t1 = /* @__PURE__ */ jsx_dev_runtime25.jsxDEV(SubAgentContext.Provider, {
      value: !0,
      children
    }, void 0, !1, void 0, this), $3[0] = children, $3[1] = t1;
  else
    t1 = $3[1];
  return t1;
}
function CtrlOToExpand() {
  let $3 = import_compiler_runtime22.c(2), isInSubAgent = import_react35.useContext(SubAgentContext), inVirtualList = import_react35.useContext(InVirtualListContext), expandShortcut = useShortcutDisplay("app:toggleTranscript", "Global", "ctrl+o");
  if (isInSubAgent || inVirtualList)
    return null;
  let t0;
  if ($3[0] !== expandShortcut)
    t0 = /* @__PURE__ */ jsx_dev_runtime25.jsxDEV(ThemedText, {
      dimColor: !0,
      children: /* @__PURE__ */ jsx_dev_runtime25.jsxDEV(KeyboardShortcutHint, {
        shortcut: expandShortcut,
        action: "expand",
        parens: !0
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = expandShortcut, $3[1] = t0;
  else
    t0 = $3[1];
  return t0;
}
function ctrlOToExpand() {
  let shortcut = getShortcutDisplay("app:toggleTranscript", "Global", "ctrl+o");
  return source_default.dim(`(${shortcut} to expand)`);
}
var import_compiler_runtime22, import_react35, jsx_dev_runtime25, SubAgentContext;
var init_CtrlOToExpand = __esm(() => {
  init_source();
  init_ink2();
  init_shortcutFormat();
  init_useShortcutDisplay();
  init_KeyboardShortcutHint();
  init_messageActions();
  import_compiler_runtime22 = __toESM(require_react_compiler_runtime_development(), 1), import_react35 = __toESM(require_react_development(), 1), jsx_dev_runtime25 = __toESM(require_react_jsx_dev_runtime_development(), 1), SubAgentContext = import_react35.default.createContext(!1);
});
