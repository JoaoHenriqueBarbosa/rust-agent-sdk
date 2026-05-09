// Original: src/hooks/useMergedCommands.ts
function useMergedCommands(initialCommands, mcpCommands) {
  return import_react272.useMemo(() => {
    if (mcpCommands.length > 0)
      return uniqBy_default([...initialCommands, ...mcpCommands], "name");
    return initialCommands;
  }, [initialCommands, mcpCommands]);
}
var import_react272;
var init_useMergedCommands = __esm(() => {
  init_uniqBy();
  import_react272 = __toESM(require_react_development(), 1);
});
