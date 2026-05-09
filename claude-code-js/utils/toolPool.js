// Original: src/utils/toolPool.ts
function mergeAndFilterTools(initialTools, assembled, mode) {
  let [mcp2, builtIn] = partition_default(uniqBy_default([...initialTools, ...assembled], "name"), isMcpTool), byName = (a2, b) => a2.name.localeCompare(b.name);
  return [...builtIn.sort(byName), ...mcp2.sort(byName)];
}
var init_toolPool = __esm(() => {
  init_partition();
  init_uniqBy();
  init_tools();
  init_utils7();
});
