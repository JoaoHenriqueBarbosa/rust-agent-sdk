// Original: src/utils/sessionStart.ts
function takeInitialUserMessage() {
  let v2 = pendingInitialUserMessage;
  return pendingInitialUserMessage = void 0, v2;
}
async function processSessionStartHooks(source, {
  sessionId,
  agentType,
  model,
  forceSyncExecution
} = {}) {
  if (isBareMode())
    return [];
  let hookMessages = [], additionalContexts = [], allWatchPaths = [];
  if (shouldAllowManagedHooksOnly())
    logForDebugging("Skipping plugin hooks - allowManagedHooksOnly is enabled");
  else
    try {
      await withDiagnosticsTiming("load_plugin_hooks", () => loadPluginHooks());
    } catch (error44) {
      let enhancedError = error44 instanceof Error ? Error(`Failed to load plugin hooks during ${source}: ${error44.message}`) : Error(`Failed to load plugin hooks during ${source}: ${String(error44)}`);
      if (error44 instanceof Error && error44.stack)
        enhancedError.stack = error44.stack;
      logError2(enhancedError);
      let errorMessage2 = error44 instanceof Error ? error44.message : String(error44), userGuidance = "";
      if (errorMessage2.includes("Failed to clone") || errorMessage2.includes("network") || errorMessage2.includes("ETIMEDOUT") || errorMessage2.includes("ENOTFOUND"))
        userGuidance = "This appears to be a network issue. Check your internet connection and try again.";
      else if (errorMessage2.includes("Permission denied") || errorMessage2.includes("EACCES") || errorMessage2.includes("EPERM"))
        userGuidance = "This appears to be a permissions issue. Check file permissions on ~/.claude/plugins/";
      else if (errorMessage2.includes("Invalid") || errorMessage2.includes("parse") || errorMessage2.includes("JSON") || errorMessage2.includes("schema"))
        userGuidance = "This appears to be a configuration issue. Check your plugin settings in .claude/settings.json";
      else
        userGuidance = "Please fix the plugin configuration or remove problematic plugins from your settings.";
      logForDebugging(`Warning: Failed to load plugin hooks. SessionStart hooks from plugins will not execute. Error: ${errorMessage2}. ${userGuidance}`, { level: "warn" });
    }
  let resolvedAgentType = agentType ?? getMainThreadAgentType();
  for await (let hookResult of executeSessionStartHooks(source, sessionId, resolvedAgentType, model, void 0, void 0, forceSyncExecution)) {
    if (hookResult.message)
      hookMessages.push(hookResult.message);
    if (hookResult.additionalContexts && hookResult.additionalContexts.length > 0)
      additionalContexts.push(...hookResult.additionalContexts);
    if (hookResult.initialUserMessage)
      pendingInitialUserMessage = hookResult.initialUserMessage;
    if (hookResult.watchPaths && hookResult.watchPaths.length > 0)
      allWatchPaths.push(...hookResult.watchPaths);
  }
  if (allWatchPaths.length > 0)
    updateWatchPaths(allWatchPaths);
  if (additionalContexts.length > 0) {
    let contextMessage = createAttachmentMessage({
      type: "hook_additional_context",
      content: additionalContexts,
      hookName: "SessionStart",
      toolUseID: "SessionStart",
      hookEvent: "SessionStart"
    });
    hookMessages.push(contextMessage);
  }
  return hookMessages;
}
async function processSetupHooks(trigger, { forceSyncExecution } = {}) {
  if (isBareMode())
    return [];
  let hookMessages = [], additionalContexts = [];
  if (shouldAllowManagedHooksOnly())
    logForDebugging("Skipping plugin hooks - allowManagedHooksOnly is enabled");
  else
    try {
      await loadPluginHooks();
    } catch (error44) {
      let errorMessage2 = error44 instanceof Error ? error44.message : String(error44);
      logForDebugging(`Warning: Failed to load plugin hooks. Setup hooks from plugins will not execute. Error: ${errorMessage2}`, { level: "warn" });
    }
  for await (let hookResult of executeSetupHooks(trigger, void 0, void 0, forceSyncExecution)) {
    if (hookResult.message)
      hookMessages.push(hookResult.message);
    if (hookResult.additionalContexts && hookResult.additionalContexts.length > 0)
      additionalContexts.push(...hookResult.additionalContexts);
  }
  if (additionalContexts.length > 0) {
    let contextMessage = createAttachmentMessage({
      type: "hook_additional_context",
      content: additionalContexts,
      hookName: "Setup",
      toolUseID: "Setup",
      hookEvent: "Setup"
    });
    hookMessages.push(contextMessage);
  }
  return hookMessages;
}
var pendingInitialUserMessage;
var init_sessionStart = __esm(() => {
  init_state();
  init_attachments2();
  init_debug();
  init_diagLogs();
  init_envUtils();
  init_fileChangedWatcher();
  init_hooksConfigSnapshot();
  init_hooks5();
  init_log3();
  init_loadPluginHooks();
});
