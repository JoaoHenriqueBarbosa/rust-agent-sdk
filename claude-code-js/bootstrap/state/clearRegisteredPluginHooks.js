// function: clearRegisteredPluginHooks
function clearRegisteredPluginHooks() {
  if (!STATE.registeredHooks)
    return;
  let filtered = {};
  for (let [event, matchers] of Object.entries(STATE.registeredHooks)) {
    let callbackHooks = matchers.filter((m) => !("pluginRoot" in m));
    if (callbackHooks.length > 0)
      filtered[event] = callbackHooks;
  }
  STATE.registeredHooks = Object.keys(filtered).length > 0 ? filtered : null;
}
