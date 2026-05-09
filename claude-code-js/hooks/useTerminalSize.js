// Original: src/hooks/useTerminalSize.ts
function useTerminalSize() {
  let size = import_react25.useContext(TerminalSizeContext);
  if (!size)
    throw Error("useTerminalSize must be used within an Ink App component");
  return size;
}
var import_react25;
var init_useTerminalSize = __esm(() => {
  init_TerminalSizeContext();
  import_react25 = __toESM(require_react_development(), 1);
});
