// Original: src/utils/hooks/registerFrontmatterHooks.ts
function registerFrontmatterHooks(setAppState, sessionId, hooks, sourceName, isAgent = !1) {
  if (!hooks || Object.keys(hooks).length === 0)
    return;
  let hookCount = 0;
  for (let event of HOOK_EVENTS) {
    let matchers = hooks[event];
    if (!matchers || matchers.length === 0)
      continue;
    let targetEvent = event;
    if (isAgent && event === "Stop")
      targetEvent = "SubagentStop", logForDebugging(`Converting Stop hook to SubagentStop for ${sourceName} (subagents trigger SubagentStop)`);
    for (let matcherConfig of matchers) {
      let matcher = matcherConfig.matcher ?? "", hooksArray = matcherConfig.hooks;
      if (!hooksArray || hooksArray.length === 0)
        continue;
      for (let hook of hooksArray)
        addSessionHook(setAppState, sessionId, targetEvent, matcher, hook), hookCount++;
    }
  }
  if (hookCount > 0)
    logForDebugging(`Registered ${hookCount} frontmatter hook(s) from ${sourceName} for session ${sessionId}`);
}
var init_registerFrontmatterHooks = __esm(() => {
  init_agentSdkTypes();
  init_debug();
  init_sessionHooks();
});
