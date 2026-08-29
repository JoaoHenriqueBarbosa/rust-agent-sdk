// Original: src/utils/cleanupRegistry.ts
function registerCleanup(cleanupFn) {
  return cleanupFunctions.add(cleanupFn), () => cleanupFunctions.delete(cleanupFn);
}
async function runCleanupFunctions() {
  await Promise.all(Array.from(cleanupFunctions).map((fn) => fn()));
}
var cleanupFunctions;
var init_cleanupRegistry = __esm(() => {
  cleanupFunctions = /* @__PURE__ */ new Set;
});
