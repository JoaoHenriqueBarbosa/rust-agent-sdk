// Original: src/ink/components/TerminalFocusContext.tsx
function TerminalFocusProvider(t0) {
  let $3 = import_compiler_runtime2.c(6), {
    children
  } = t0, isTerminalFocused = import_react5.useSyncExternalStore(subscribeTerminalFocus, getTerminalFocused), terminalFocusState = import_react5.useSyncExternalStore(subscribeTerminalFocus, getTerminalFocusState), t1;
  if ($3[0] !== isTerminalFocused || $3[1] !== terminalFocusState)
    t1 = {
      isTerminalFocused,
      terminalFocusState
    }, $3[0] = isTerminalFocused, $3[1] = terminalFocusState, $3[2] = t1;
  else
    t1 = $3[2];
  let value = t1, t2;
  if ($3[3] !== children || $3[4] !== value)
    t2 = /* @__PURE__ */ jsx_dev_runtime2.jsxDEV(TerminalFocusContext.Provider, {
      value,
      children
    }, void 0, !1, void 0, this), $3[3] = children, $3[4] = value, $3[5] = t2;
  else
    t2 = $3[5];
  return t2;
}
var import_compiler_runtime2, import_react5, jsx_dev_runtime2, TerminalFocusContext, TerminalFocusContext_default;
var init_TerminalFocusContext = __esm(() => {
  init_terminal_focus_state();
  import_compiler_runtime2 = __toESM(require_react_compiler_runtime_development(), 1), import_react5 = __toESM(require_react_development(), 1), jsx_dev_runtime2 = __toESM(require_react_jsx_dev_runtime_development(), 1), TerminalFocusContext = import_react5.createContext({
    isTerminalFocused: !0,
    terminalFocusState: "unknown"
  });
  TerminalFocusContext.displayName = "TerminalFocusContext";
  TerminalFocusContext_default = TerminalFocusContext;
});
