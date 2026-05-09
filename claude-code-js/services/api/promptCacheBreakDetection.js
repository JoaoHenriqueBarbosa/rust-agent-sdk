// Original: src/services/api/promptCacheBreakDetection.ts
function resetPromptCacheBreakDetection() {
  previousStateBySource.clear();
}
var previousStateBySource, CACHE_TTL_1HOUR_MS = 3600000;
var init_promptCacheBreakDetection = __esm(() => {
  init_lib();
  init_debug();
  init_log3();
  init_filesystem();
  init_slowOperations();
  previousStateBySource = /* @__PURE__ */ new Map;
});
