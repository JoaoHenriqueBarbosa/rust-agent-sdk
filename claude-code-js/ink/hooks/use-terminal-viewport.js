// Original: src/ink/hooks/use-terminal-viewport.ts
function useTerminalViewport() {
  let terminalSize = import_react15.useContext(TerminalSizeContext), elementRef = import_react15.useRef(null), entryRef = import_react15.useRef({ isVisible: !0 }), setElement = import_react15.useCallback((el) => {
    elementRef.current = el;
  }, []);
  return import_react15.useLayoutEffect(() => {
    let element = elementRef.current;
    if (!element?.yogaNode || !terminalSize)
      return;
    let height = element.yogaNode.getComputedHeight(), rows = terminalSize.rows, absoluteTop = element.yogaNode.getComputedTop(), parent = element.parentNode, root2 = element.yogaNode;
    while (parent) {
      if (parent.yogaNode)
        absoluteTop += parent.yogaNode.getComputedTop(), root2 = parent.yogaNode;
      if (parent.scrollTop)
        absoluteTop -= parent.scrollTop;
      parent = parent.parentNode;
    }
    let screenHeight = root2.getComputedHeight(), bottom = absoluteTop + height, cursorRestoreScroll = screenHeight > rows ? 1 : 0, viewportY = Math.max(0, screenHeight - rows) + cursorRestoreScroll, viewportBottom = viewportY + rows, visible = bottom > viewportY && absoluteTop < viewportBottom;
    if (visible !== entryRef.current.isVisible)
      entryRef.current = { isVisible: visible };
  }), [setElement, entryRef.current];
}
var import_react15;
var init_use_terminal_viewport = __esm(() => {
  init_TerminalSizeContext();
  import_react15 = __toESM(require_react_development(), 1);
});
