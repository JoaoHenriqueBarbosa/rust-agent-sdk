// Original: src/ink/hooks/use-search-highlight.ts
function useSearchHighlight() {
  import_react197.useContext(StdinContext_default);
  let ink = instances_default.get(process.stdout);
  return import_react197.useMemo(() => {
    if (!ink)
      return {
        setQuery: () => {},
        scanElement: () => [],
        setPositions: () => {}
      };
    return {
      setQuery: (query3) => ink.setSearchHighlight(query3),
      scanElement: (el) => ink.scanElementSubtree(el),
      setPositions: (state4) => ink.setSearchPositions(state4)
    };
  }, [ink]);
}
var import_react197;
var init_use_search_highlight = __esm(() => {
  init_StdinContext();
  init_instances();
  import_react197 = __toESM(require_react_development(), 1);
});
