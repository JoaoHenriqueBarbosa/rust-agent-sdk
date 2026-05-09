// Original: src/ink/hooks/use-terminal-focus.ts
function useTerminalFocus() {
  let { isTerminalFocused } = import_react6.useContext(TerminalFocusContext_default);
  return isTerminalFocused;
}
var import_react6;
var init_use_terminal_focus = __esm(() => {
  init_TerminalFocusContext();
  import_react6 = __toESM(require_react_development(), 1);
});
