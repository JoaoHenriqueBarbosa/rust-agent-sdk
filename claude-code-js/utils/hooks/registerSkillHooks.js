// Original: src/utils/hooks/registerSkillHooks.ts
function registerSkillHooks(setAppState, sessionId, hooks, skillName, skillRoot) {
  let registeredCount = 0;
  for (let eventName of HOOK_EVENTS) {
    let matchers = hooks[eventName];
    if (!matchers)
      continue;
    for (let matcher of matchers)
      for (let hook of matcher.hooks) {
        let onHookSuccess = hook.once ? () => {
          logForDebugging(`Removing one-shot hook for event ${eventName} in skill '${skillName}'`), removeSessionHook(setAppState, sessionId, eventName, hook);
        } : void 0;
        addSessionHook(setAppState, sessionId, eventName, matcher.matcher || "", hook, onHookSuccess, skillRoot), registeredCount++;
      }
  }
  if (registeredCount > 0)
    logForDebugging(`Registered ${registeredCount} hooks from skill '${skillName}'`);
}
var init_registerSkillHooks = __esm(() => {
  init_agentSdkTypes();
  init_debug();
  init_sessionHooks();
});
