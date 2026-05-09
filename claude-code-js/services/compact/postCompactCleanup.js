// Original: src/services/compact/postCompactCleanup.ts
function runPostCompactCleanup(querySource) {
  let isMainThreadCompact = querySource === void 0 || querySource.startsWith("repl_main_thread") || querySource === "sdk";
  if (resetMicrocompactState(), isMainThreadCompact)
    getUserContext.cache.clear?.(), resetGetMemoryFilesCache("compact");
  clearSystemPromptSections(), clearClassifierApprovals(), clearSpeculativeChecks(), clearBetaTracingState(), clearSessionMessagesCache();
}
var init_postCompactCleanup = __esm(() => {
  init_systemPromptSections();
  init_context2();
  init_bashPermissions();
  init_classifierApprovals();
  init_claudemd();
  init_sessionStorage();
  init_betaSessionTracing();
  init_microCompact();
});
