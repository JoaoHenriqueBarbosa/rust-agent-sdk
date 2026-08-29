// Original: src/hooks/useMergedClients.ts
function mergeClients(initialClients, mcpClients) {
  if (initialClients && mcpClients && mcpClients.length > 0)
    return uniqBy_default([...initialClients, ...mcpClients], "name");
  return initialClients || [];
}
function useMergedClients(initialClients, mcpClients) {
  return import_react271.useMemo(() => mergeClients(initialClients, mcpClients), [initialClients, mcpClients]);
}
var import_react271;
var init_useMergedClients = __esm(() => {
  init_uniqBy();
  import_react271 = __toESM(require_react_development(), 1);
});
