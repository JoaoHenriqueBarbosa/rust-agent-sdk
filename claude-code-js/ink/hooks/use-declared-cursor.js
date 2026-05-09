// Original: src/ink/hooks/use-declared-cursor.ts
function useDeclaredCursor({
  line,
  column,
  active
}) {
  let setCursorDeclaration = import_react42.useContext(CursorDeclarationContext_default), nodeRef = import_react42.useRef(null), setNode = import_react42.useCallback((node) => {
    nodeRef.current = node;
  }, []);
  return import_react42.useLayoutEffect(() => {
    let node = nodeRef.current;
    if (active && node)
      setCursorDeclaration({ relativeX: column, relativeY: line, node });
    else
      setCursorDeclaration(null, node);
  }), import_react42.useLayoutEffect(() => {
    return () => {
      setCursorDeclaration(null, nodeRef.current);
    };
  }, [setCursorDeclaration]), setNode;
}
var import_react42;
var init_use_declared_cursor = __esm(() => {
  init_CursorDeclarationContext();
  import_react42 = __toESM(require_react_development(), 1);
});
