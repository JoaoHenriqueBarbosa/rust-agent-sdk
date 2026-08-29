// Original: src/hooks/useMergedTools.ts
function useMergedTools(initialTools, mcpTools, toolPermissionContext) {
  return import_react174.useMemo(() => {
    let assembled = assembleToolPool(toolPermissionContext, mcpTools);
    return mergeAndFilterTools(initialTools, assembled, toolPermissionContext.mode);
  }, [
    initialTools,
    mcpTools,
    toolPermissionContext,
    !1,
    !1
  ]);
}
var import_react174;
var init_useMergedTools = __esm(() => {
  init_tools2();
  init_toolPool();
  import_react174 = __toESM(require_react_development(), 1);
});
