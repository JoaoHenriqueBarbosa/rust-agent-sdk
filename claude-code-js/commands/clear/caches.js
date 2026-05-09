// Original: src/commands/clear/caches.ts
var exports_caches = {};
__export(exports_caches, {
  clearSessionCaches: () => clearSessionCaches
});
function clearSessionCaches(preservedAgentIds = /* @__PURE__ */ new Set) {
  let hasPreserved = preservedAgentIds.size > 0;
  if (getUserContext.cache.clear?.(), getSystemContext.cache.clear?.(), getGitStatus.cache.clear?.(), getSessionStartDate.cache.clear?.(), clearFileSuggestionCaches(), clearCommandsCache(), !hasPreserved)
    resetPromptCacheBreakDetection();
  if (setSystemPromptInjection(null), setLastEmittedDate(null), runPostCompactCleanup(), resetSentSkillNames(), resetGetMemoryFilesCache("session_start"), clearStoredImagePaths(), clearAllSessions(), !hasPreserved)
    clearAllPendingCallbacks();
  if (clearRepositoryCaches(), clearCommandPrefixCaches(), !hasPreserved)
    clearAllDumpState();
  clearInvokedSkills(preservedAgentIds), clearResolveGitDirCache(), clearDynamicSkills(), resetAllLSPDiagnosticState(), clearTrackedMagicDocs(), clearSessionEnvVars(), Promise.resolve().then(() => (init_utils15(), exports_utils2)).then(({ clearWebFetchCache: clearWebFetchCache2 }) => clearWebFetchCache2()), Promise.resolve().then(() => (init_ToolSearchTool(), exports_ToolSearchTool)).then(({ clearToolSearchDescriptionCache: clearToolSearchDescriptionCache2 }) => clearToolSearchDescriptionCache2()), Promise.resolve().then(() => (init_loadAgentsDir(), exports_loadAgentsDir)).then(({ clearAgentDefinitionsCache: clearAgentDefinitionsCache2 }) => clearAgentDefinitionsCache2()), Promise.resolve().then(() => (init_prompt7(), exports_prompt2)).then(({ clearPromptCache: clearPromptCache2 }) => clearPromptCache2());
}
var init_caches = __esm(() => {
  init_state();
  init_commands5();
  init_common2();
  init_context2();
  init_fileSuggestions();
  init_useSwarmPermissionPoller();
  init_dumpPrompts();
  init_promptCacheBreakDetection();
  init_sessionIngress();
  init_postCompactCleanup();
  init_LSPDiagnosticRegistry();
  init_magicDocs();
  init_loadSkillsDir();
  init_attachments2();
  init_commands4();
  init_claudemd();
  init_detectRepository();
  init_gitFilesystem();
  init_imageStore();
  init_sessionEnvVars();
});
