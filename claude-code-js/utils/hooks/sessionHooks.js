// Original: src/utils/hooks/sessionHooks.ts
function addSessionHook(setAppState, sessionId, event, matcher, hook, onHookSuccess, skillRoot) {
  addHookToSession(setAppState, sessionId, event, matcher, hook, onHookSuccess, skillRoot);
}
function addFunctionHook(setAppState, sessionId, event, matcher, callback, errorMessage2, options2) {
  let id = options2?.id || `function-hook-${Date.now()}-${Math.random()}`, hook = {
    type: "function",
    id,
    timeout: options2?.timeout || 5000,
    callback,
    errorMessage: errorMessage2
  };
  return addHookToSession(setAppState, sessionId, event, matcher, hook), id;
}
function addHookToSession(setAppState, sessionId, event, matcher, hook, onHookSuccess, skillRoot) {
  setAppState((prev) => {
    let store = prev.sessionHooks.get(sessionId) ?? { hooks: {} }, eventMatchers = store.hooks[event] || [], existingMatcherIndex = eventMatchers.findIndex((m4) => m4.matcher === matcher && m4.skillRoot === skillRoot), updatedMatchers;
    if (existingMatcherIndex >= 0) {
      updatedMatchers = [...eventMatchers];
      let existingMatcher = updatedMatchers[existingMatcherIndex];
      updatedMatchers[existingMatcherIndex] = {
        matcher: existingMatcher.matcher,
        skillRoot: existingMatcher.skillRoot,
        hooks: [...existingMatcher.hooks, { hook, onHookSuccess }]
      };
    } else
      updatedMatchers = [
        ...eventMatchers,
        {
          matcher,
          skillRoot,
          hooks: [{ hook, onHookSuccess }]
        }
      ];
    let newHooks = { ...store.hooks, [event]: updatedMatchers };
    return prev.sessionHooks.set(sessionId, { hooks: newHooks }), prev;
  }), logForDebugging(`Added session hook for event ${event} in session ${sessionId}`);
}
function removeSessionHook(setAppState, sessionId, event, hook) {
  setAppState((prev) => {
    let store = prev.sessionHooks.get(sessionId);
    if (!store)
      return prev;
    let updatedMatchers = (store.hooks[event] || []).map((matcher) => {
      let updatedHooks = matcher.hooks.filter((h4) => !isHookEqual(h4.hook, hook));
      return updatedHooks.length > 0 ? { ...matcher, hooks: updatedHooks } : null;
    }).filter((m4) => m4 !== null), newHooks = updatedMatchers.length > 0 ? { ...store.hooks, [event]: updatedMatchers } : { ...store.hooks };
    if (updatedMatchers.length === 0)
      delete newHooks[event];
    return prev.sessionHooks.set(sessionId, { ...store, hooks: newHooks }), prev;
  }), logForDebugging(`Removed session hook for event ${event} in session ${sessionId}`);
}
function convertToHookMatchers(sessionMatchers) {
  return sessionMatchers.map((sm) => ({
    matcher: sm.matcher,
    skillRoot: sm.skillRoot,
    hooks: sm.hooks.map((h4) => h4.hook).filter((h4) => h4.type !== "function")
  }));
}
function getSessionHooks(appState, sessionId, event) {
  let store = appState.sessionHooks.get(sessionId);
  if (!store)
    return /* @__PURE__ */ new Map;
  let result = /* @__PURE__ */ new Map;
  if (event) {
    let sessionMatchers = store.hooks[event];
    if (sessionMatchers)
      result.set(event, convertToHookMatchers(sessionMatchers));
    return result;
  }
  for (let evt of HOOK_EVENTS) {
    let sessionMatchers = store.hooks[evt];
    if (sessionMatchers)
      result.set(evt, convertToHookMatchers(sessionMatchers));
  }
  return result;
}
function getSessionFunctionHooks(appState, sessionId, event) {
  let store = appState.sessionHooks.get(sessionId);
  if (!store)
    return /* @__PURE__ */ new Map;
  let result = /* @__PURE__ */ new Map, extractFunctionHooks = (sessionMatchers) => {
    return sessionMatchers.map((sm) => ({
      matcher: sm.matcher,
      hooks: sm.hooks.map((h4) => h4.hook).filter((h4) => h4.type === "function")
    })).filter((m4) => m4.hooks.length > 0);
  };
  if (event) {
    let sessionMatchers = store.hooks[event];
    if (sessionMatchers) {
      let functionMatchers = extractFunctionHooks(sessionMatchers);
      if (functionMatchers.length > 0)
        result.set(event, functionMatchers);
    }
    return result;
  }
  for (let evt of HOOK_EVENTS) {
    let sessionMatchers = store.hooks[evt];
    if (sessionMatchers) {
      let functionMatchers = extractFunctionHooks(sessionMatchers);
      if (functionMatchers.length > 0)
        result.set(evt, functionMatchers);
    }
  }
  return result;
}
function getSessionHookCallback(appState, sessionId, event, matcher, hook) {
  let store = appState.sessionHooks.get(sessionId);
  if (!store)
    return;
  let eventMatchers = store.hooks[event];
  if (!eventMatchers)
    return;
  for (let matcherEntry of eventMatchers)
    if (matcherEntry.matcher === matcher || matcher === "") {
      let hookEntry = matcherEntry.hooks.find((h4) => isHookEqual(h4.hook, hook));
      if (hookEntry)
        return hookEntry;
    }
  return;
}
function clearSessionHooks(setAppState, sessionId) {
  setAppState((prev) => {
    return prev.sessionHooks.delete(sessionId), prev;
  }), logForDebugging(`Cleared all session hooks for session ${sessionId}`);
}
var init_sessionHooks = __esm(() => {
  init_agentSdkTypes();
  init_debug();
  init_hooksSettings();
});
